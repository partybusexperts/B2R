import { NextResponse } from 'next/server';
import { getAll } from '@/lib/pollsStore';

// Cache this endpoint at the CDN/server for short periods to reduce repeated
// work. Clients may see slightly stale data (up to s-maxage), but the JSON
// registry is updated offline and votes are stored separately.
export const dynamic = 'force-cache';

export async function GET() {
  try {
    const data = await getAll();
    const res = NextResponse.json(data, { status: 200 });
    res.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    return res;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('API /api/poll/all error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
