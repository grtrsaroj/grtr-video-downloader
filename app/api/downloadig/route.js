import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mediaUrl = searchParams.get('media_url');

  if (!mediaUrl) {
    return NextResponse.json({ error: 'Media URL is required' }, { status: 400 });
  }

  try {
    const response = await axios({
      method: 'GET',
      url: mediaUrl,
      responseType: 'arraybuffer', // Ensure binary data is handled properly
    });

    // Determine the content type from response headers
    const contentType = response.headers['content-type'];
    const fileName = mediaUrl.split('/').pop().split('?')[0];

    return new NextResponse(response.data, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}
