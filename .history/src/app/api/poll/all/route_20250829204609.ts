import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAll } from '@/lib/pollsStore';

export async function GET(_req: NextRequest) {
  try {
    const data = await getAll();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('API /api/poll/all error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { getAll } from "@/lib/pollsStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getAll();
  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}
