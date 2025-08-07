import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const size = parseInt(req.nextUrl.searchParams.get('size') || '1000000'); // default to 1MB
  const data = Buffer.alloc(size, 'a'); // Create a buffer of 'a' characters

  return new NextResponse(data, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="dummy.txt"',
      'Content-Length': size.toString(),
    },
  });
}
