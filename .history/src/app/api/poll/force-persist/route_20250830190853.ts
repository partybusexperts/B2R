import { NextResponse } from 'next/server';
import { forceWrite, getAll } from '@/lib/pollsStore';
import fs from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await forceWrite();
    const dataPath = path.join(process.cwd(), 'data', 'polls.json');
    const raw = await fs.readFile(dataPath, 'utf8');
    const json = JSON.parse(raw || '{}');
    const { polls } = await getAll();
    return NextResponse.json({ ok: true, polls: polls.length, votes: json.votes || {} }, { status: 200 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('force-persist error', err);
    return NextResponse.json({ ok: false, error: 'persist failed' }, { status: 500 });
  }
}
