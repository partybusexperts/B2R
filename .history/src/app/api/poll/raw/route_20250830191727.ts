import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'polls.json');
    const raw = await fs.readFile(dataPath, 'utf8');
    const json = JSON.parse(raw || '{}');
    const votes = json.votes || {};
    return NextResponse.json({ ok: true, votes }, { status: 200 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('raw results error', err);
    return NextResponse.json({ ok: false, error: 'failed to read raw results' }, { status: 500 });
  }
}
