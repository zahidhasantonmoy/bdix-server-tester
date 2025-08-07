import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is missing' }, { status: 400 });
  }

  try {
    const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) }); // 5-second timeout
    if (response.ok) {
      return NextResponse.json({ status: 'Working', url });
    } else {
      return NextResponse.json({ status: 'Not Working', url, statusCode: response.status }, { status: 200 });
    }
  } catch (error: any) {
    console.error(`Error checking server ${url}:`, error);
    return NextResponse.json({ status: 'Not Working', url, error: error.message }, { status: 200 });
  }
}
