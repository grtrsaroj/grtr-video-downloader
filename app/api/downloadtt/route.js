import { NextResponse } from 'next/server';
import TikTokScraper from 'tiktok-scraper';

export async function GET(request) {
  const { url, format } = request.nextUrl.searchParams;

  try {
    const videoMeta = await TikTokScraper.getVideoMeta(url);
    const downloadUrl = videoMeta.formats.find(f => f.itag === format)?.url; // Adjust as needed
    
    if (downloadUrl) {
      return NextResponse.redirect(downloadUrl);
    } else {
      return NextResponse.json({ error: 'Format not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process download' }, { status: 500 });
  }
}
