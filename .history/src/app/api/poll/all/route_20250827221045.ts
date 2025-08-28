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

export async function GET() {
  try {
    const txt = await fs.readFile(POLL_FILE, 'utf8');
    const polls = JSON.parse(txt || '{}');
    return NextResponse.json(polls, { headers: { 'Access-Control-Allow-Origin': '*' } });
  } catch {
    return NextResponse.json({}, { headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}
