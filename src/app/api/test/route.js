// src/app/api/test/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { urls } = await request.json();
    
    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json(
        { error: 'Invalid request. Please provide an array of URLs.' },
        { status: 400 }
      );
    }
    
    // In a real implementation, we would test the URLs here
    // For now, we'll simulate the results
    const results = urls.map(url => ({
      url,
      status: Math.random() > 0.3 ? 'Online' : 'Offline', // 70% chance of online
      responseTime: Math.floor(Math.random() * 1000) + 50 // Random response time between 50-1050ms
    }));
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      results
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'BDIX Server Tester API',
    endpoints: {
      test: {
        method: 'POST',
        description: 'Test BDIX server connectivity',
        requestBody: {
          urls: 'Array of URLs to test'
        }
      }
    }
  });
}