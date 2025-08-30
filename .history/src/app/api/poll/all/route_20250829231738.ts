import { NextResponse } from 'next/server';
import { getPolls } from '@/lib/pollsStore';

// Cache this endpoint at the CDN/server for short periods to reduce repeated
// work. Clients may see slightly stale data (up to s-maxage), but the JSON
// registry is updated offline and votes are stored separately.
export const dynamic = 'force-cache';

export async function GET() {
  try {
  // Return only the canonical polls list (no votes) — this keeps the
  // payload small and avoids serializing the votes object on every request.
  const polls = await getPolls();
  const res = NextResponse.json({ polls }, { status: 200 });
  res.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
  return res;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('API /api/poll/all error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
