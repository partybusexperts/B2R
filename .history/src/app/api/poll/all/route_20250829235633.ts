import { NextRequest, NextResponse } from 'next/server';
import { getPolls } from '@/lib/pollsStore';

// Remove force-cache for better performance control
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Optimized response with aggressive caching
    const polls = await getPolls();
    
    // Pre-stringify to avoid repeated JSON.stringify calls
    const jsonData = JSON.stringify({ polls });
    
    return new NextResponse(jsonData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=600, s-maxage=600, stale-while-revalidate=3600',
        'X-Poll-Count': polls.length.toString(),
        'Content-Length': Buffer.byteLength(jsonData).toString()
      },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('API /api/poll/all error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
