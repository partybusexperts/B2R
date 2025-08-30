import { NextResponse } from 'next/server';
import { getResults } from '@/lib/pollsStore';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ids: string[] = Array.isArray(body && body.ids) ? body.ids : [];
    const out: Record<string, { results: Record<string, number>; total: number }> = {};
    await Promise.all(
      ids.map(async (id) => {
        try {
          const r = await getResults(id);
          out[id] = { results: r.results || {}, total: r.total || 0 };
        } catch (e) {
          out[id] = { results: {}, total: 0 };
        }
      })
    );
    const res = NextResponse.json({ data: out }, { status: 200 });
    res.headers.set('Cache-Control', 's-maxage=5, stale-while-revalidate=10');
    return res;
  } catch (err) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }
}
