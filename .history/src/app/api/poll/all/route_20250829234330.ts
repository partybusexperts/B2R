import { NextRequest, NextResponse } from 'next/server';
import { getPolls } from '@/lib/pollsStore';
import { getCompressedRegistry } from '@/lib/registryCompression';

// Remove force-cache for better performance control
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check if client accepts gzip encoding
    const acceptEncoding = request.headers.get('accept-encoding') || '';
    const supportsGzip = acceptEncoding.includes('gzip');
    
    if (supportsGzip) {
      // Serve compressed registry directly - massive bandwidth savings
      const compressed = await getCompressedRegistry();
      
      return new NextResponse(compressed, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Encoding': 'gzip',
          'Cache-Control': 'public, max-age=600, s-maxage=600, stale-while-revalidate=3600',
          'Vary': 'Accept-Encoding',
          'X-Compressed': 'true'
        },
      });
    }
    
    // Fallback for non-gzip clients (rare in modern browsers)
    const polls = await getPolls();
    const res = NextResponse.json({ polls }, { status: 200 });
    // Increased cache duration for better performance
    res.headers.set('Cache-Control', 'public, max-age=600, s-maxage=600, stale-while-revalidate=3600');
    res.headers.set('X-Poll-Count', polls.length.toString());
    return res;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('API /api/poll/all error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
