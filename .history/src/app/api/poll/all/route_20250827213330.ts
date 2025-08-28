import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const POLL_FILE = path.join(process.cwd(), 'polls.json');

export async function GET() {
  try {
    const txt = await fs.readFile(POLL_FILE, 'utf8');
    const polls = JSON.parse(txt || '{}');
    return NextResponse.json(polls);
  } catch {
    return NextResponse.json({});
  }
}
