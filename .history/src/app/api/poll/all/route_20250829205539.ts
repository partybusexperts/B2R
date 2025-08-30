import { NextResponse } from 'next/server';
import { getAll } from '@/lib/pollsStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getAll();
    return NextResponse.json(data, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('API /api/poll/all error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
