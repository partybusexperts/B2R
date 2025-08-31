import { NextResponse } from 'next/server';
import { getAll } from '@/lib/pollsStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { votes, polls } = await getAll();
    return NextResponse.json({ ok: true, polls: polls.length, votesCount: Object.keys(votes || {}).length, votes }, { status: 200 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('debug votes error', err);
    return NextResponse.json({ ok: false, error: 'failed to read votes' }, { status: 500 });
  }
}
