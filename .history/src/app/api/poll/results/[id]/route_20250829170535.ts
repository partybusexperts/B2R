import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

const DATA_FILE = path.join(process.cwd(), "data", "polls.json");

async function readData() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { polls: [], votes: {} };
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const data = await readData();
  const votes = (data.votes && data.votes[id]) || {};
  return NextResponse.json({ results: votes });
}
import { NextResponse } from 'next/server';
import pollsStore from '../../../../../lib/pollsStore';

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
    const results = await pollsStore.get(poll_id);
    return NextResponse.json({ poll_id, results }, { headers: { 'Access-Control-Allow-Origin': '*' } });
  } catch (err) {
    console.error('poll results error', err);
    return NextResponse.json({ poll_id, results: {} }, { headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}
