import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { vote as voteFn, getResults as getResultsFn } from '@/lib/pollsStore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (id) {
      const res = await getResultsFn(id);
      return NextResponse.json(res, { status: 200 });
    }
    return NextResponse.json({ message: 'Use /api/poll/all to fetch the full list' }, { status: 400 });
  } catch (err) {
    console.error('API /api/poll GET error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pollId, option } = body || {};
    if (!pollId || !option) {
      return NextResponse.json({ error: 'pollId and option required' }, { status: 400 });
    }
    const result = await voteFn(pollId, option);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    const msg = (err && typeof err === 'object' && 'message' in err) ? (err as any).message : String(err);
    console.error('API /api/poll POST error', msg);
    return NextResponse.json({ error: msg || 'Internal error' }, { status: 500 });
  }
}
