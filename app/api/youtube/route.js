import { NextResponse } from 'next/server';
import ytdl from 'ytdl-core';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const videoUrl = searchParams.get('url');
  const formatId = searchParams.get('format');

  if (!videoUrl) {
    return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
  }

  try {
    const info = await ytdl.getInfo(videoUrl);
    const allowedResolutions = ['480p', '720p', '1080p'];
    const formats = info.formats
      .filter(format => format.container === 'mp4' && allowedResolutions.includes(format.qualityLabel));

    if (formatId) {
      const format = formats.find(f => f.itag.toString() === formatId);

      if (!format) {
        return NextResponse.json({ error: 'Format not found' }, { status: 404 });
      }

      const safeTitle = info.videoDetails.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const response = await fetch(format.url);
      const videoStream = await response.body;

      if (!response.ok || !videoStream) {
        return NextResponse.json({ error: 'Failed to fetch video stream' }, { status: 500 });
      }

      return new NextResponse(videoStream, {
        headers: {
          'Content-Type': format.mimeType || 'video/mp4',
          'Content-Disposition': `attachment; filename="${safeTitle}.${format.container || 'mp4'}"`,
        },
      });
    } else {
      const { title, thumbnails } = info.videoDetails;
      const thumbnailUrl = thumbnails[0].url;

      return NextResponse.json({
        formats,
        title,
        thumbnailUrl,
      });
    }
  } catch (error) {
    console.error('Error fetching video stream:', error);
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 });
  }
}
