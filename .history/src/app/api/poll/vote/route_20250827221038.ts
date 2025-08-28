import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const POLL_FILE = path.join(process.cwd(), 'polls.json');

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const poll_id = String(body.poll_id || '').trim();
    const option = String(body.option || '').trim();
    if (!poll_id || !option) {
      return NextResponse.json({ error: 'poll_id and option required' }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    let polls: Record<string, Record<string, number>> = {};
    try {
      const txt = await fs.readFile(POLL_FILE, 'utf8');
      polls = JSON.parse(txt || '{}');
  } catch {
      // file may not exist yet — start fresh
      polls = {};
    }

    if (!polls[poll_id]) polls[poll_id] = {};
    if (!polls[poll_id][option]) polls[poll_id][option] = 0;
    polls[poll_id][option] += 1;

  // atomic write
  const tmp = POLL_FILE + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(polls, null, 2), 'utf8');
  await fs.rename(tmp, POLL_FILE);

  return NextResponse.json({ success: true, poll_id, option }, { headers: { 'Access-Control-Allow-Origin': '*' } });
  } catch (err) {
    console.error('API /api/poll/vote error:', err);
  return NextResponse.json({ error: 'Failed to save vote' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}
