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

async function writeData(data: any) {
  await fs.mkdir(path.join(process.cwd(), "data"), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const pollId = body.poll_id || body.pollId;
    const option = body.option || body.vote;
    if (!pollId || !option) return NextResponse.json({ error: "missing" }, { status: 400 });
    const data = await readData();
    data.votes = data.votes || {};
    data.votes[pollId] = data.votes[pollId] || {};
    data.votes[pollId][option] = (data.votes[pollId][option] || 0) + 1;
    await writeData(data);
    return NextResponse.json({ success: true, votes: data.votes[pollId] });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import pollsStore from '../../../../lib/pollsStore';

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

    await pollsStore.increment(poll_id, option);

    return NextResponse.json({ success: true, poll_id, option }, { headers: { 'Access-Control-Allow-Origin': '*' } });
  } catch (err) {
    console.error('API /api/poll/vote error:', err);
    return NextResponse.json({ error: 'Failed to save vote' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}
