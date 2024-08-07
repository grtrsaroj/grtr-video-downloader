import axios from 'axios';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const name = searchParams.get('name');

    if (!url || !name) {
      return NextResponse.json({ error: 'Missing URL or file name' }, { status: 400 });
    }

    const response = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer'
    });

    const filePath = path.join(process.cwd(), 'public', 'downloads', name);
    fs.writeFileSync(filePath, response.data);

    return NextResponse.json({ message: 'Download successful', filePath });
  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
