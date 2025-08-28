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
