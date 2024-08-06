import { NextResponse } from 'next/server';
import ytdl from 'ytdl-core';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const videoUrl = searchParams.get('url');
  const formatId = searchParams.get('format');

  if (!videoUrl || !formatId) {
    return NextResponse.json({ error: 'Missing URL or format' }, { status: 400 });
  }

  try {
    const info = await ytdl.getInfo(videoUrl);
    const format = info.formats.find(f => f.itag.toString() === formatId);

    if (!format) {
      return NextResponse.json({ error: 'Format not found' }, { status: 404 });
    }

    const safeTitle = info.videoDetails.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const videoStream = ytdl(videoUrl, { format, requestOptions: { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' } } });

    return new NextResponse(videoStream, {
      headers: {
        'Content-Type': format.mimeType || 'video/mp4',
        'Content-Disposition': `attachment; filename="${safeTitle}.${format.container || 'mp4'}"`,
      },
      duplex: 'half',
    });
  } catch (error) {
    console.error('Error fetching video stream:', error);
    return NextResponse.json({ error: 'Failed to fetch video stream' }, { status: 500 });
  }
}
