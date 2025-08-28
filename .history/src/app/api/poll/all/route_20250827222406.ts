import { NextResponse } from 'next/server';
import pollsStore from '../../../lib/pollsStore';

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
    const polls = await pollsStore.getAll();
    return NextResponse.json(polls, { headers: { 'Access-Control-Allow-Origin': '*' } });
  } catch (err) {
    console.error('poll all error', err);
    return NextResponse.json({}, { headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}
