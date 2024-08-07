import { NextResponse } from 'next/server';
import TikTokScraper from 'tiktok-scraper';

export async function GET(request) {
  const { url } = request.nextUrl.searchParams;

  try {
    const videoMeta = await TikTokScraper.getVideoMeta(url);
    const streamingUrl = videoMeta.formats.find(f => f.container === 'mp4')?.url || '';

    return NextResponse.json({
      formats: videoMeta.formats,
      title: videoMeta.title,
      thumbnailUrl: videoMeta.thumbnailUrl,
      streamingUrl,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch video metadata' }, { status: 500 });
  }
}
