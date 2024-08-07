import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { url } = await request.json();

    const response = await axios.post('https://www.getfvid.com/downloader', new URLSearchParams({
      'url': url
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const body = response.data;

    let videoTitle = "Untitled";
    let thumbnailUrl = "";
    let videoName = "noname.mp4";

    // Check if video is private
    if (/Uh-Oh! This video might be private and not publi/.test(body)) {
      return NextResponse.json({ error: 'This video is private' }, { status: 400 });
    }

    // Extract video title
    const titleMatch = body.match(/<p class="card-text">(.*?)<\/p>/);
    if (titleMatch) {
      videoTitle = titleMatch[1];
      videoName = videoTitle + ".mp4";
    }

    // Extract thumbnail URL
    const thumbnailMatch = body.match(/<img src="(.*?)" alt="Video Thumbnail"/);
    if (thumbnailMatch) {
      thumbnailUrl = thumbnailMatch[1];
    }

    // Extract video download links
    const links = [];
    const regex = /<a href="(.+?)" target="_blank" class="btn btn-download"(.+?)>(.+?)<\/a>/g;
    let match;
    while ((match = regex.exec(body)) !== null) {
      links.push({
        quality: match[3].includes('<strong>HD</strong>') ? 'HD Quality' : 'Standard Quality',
        url: match[1].replace(/amp;/gi, '')
      });
    }

    if (links.length > 0) {
      return NextResponse.json({ title: videoTitle, thumbnailUrl, name: videoName, links });
    } else {
      return NextResponse.json({ error: 'No valid video URL found' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching video information:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
