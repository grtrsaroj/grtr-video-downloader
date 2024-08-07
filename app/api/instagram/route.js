import { NextResponse } from 'next/server';
import axios from 'axios';
import cheerio from 'cheerio';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const mediaData = [];
    let title = '';
    let thumbnailUrl = '';

    // Extract video URLs from meta tags
    $('meta[property="og:video"]').each((index, element) => {
      mediaData.push({
        type: 'video',
        url: $(element).attr('content')
      });
    });

    // Extract image URLs from meta tags
    $('meta[property="og:image"]').each((index, element) => {
      mediaData.push({
        type: 'image',
        url: $(element).attr('content')
      });
    });

    // Extract title and thumbnail URL
    $('meta[property="og:title"]').each((index, element) => {
      title = $(element).attr('content');
    });

    $('meta[property="og:image"]').each((index, element) => {
      thumbnailUrl = $(element).attr('content');
    });

    if (mediaData.length === 0) {
      return NextResponse.json({ error: 'No media found' }, { status: 404 });
    }

    return NextResponse.json({ media: mediaData, title, thumbnailUrl }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch media data' }, { status: 500 });
  }
}
