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

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const poll_id = String(params?.id || '').trim();
  if (!poll_id) return NextResponse.json({ error: 'poll_id required' }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });

  try {
    const txt = await fs.readFile(POLL_FILE, 'utf8');
    const polls = JSON.parse(txt || '{}');
    const results = polls[poll_id] || {};
    return NextResponse.json({ poll_id, results }, { headers: { 'Access-Control-Allow-Origin': '*' } });
  } catch {
    return NextResponse.json({ poll_id, results: {} }, { headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}
