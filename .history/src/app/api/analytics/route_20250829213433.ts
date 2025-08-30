import { NextResponse } from "next/server";
import { appendEvent } from "@/lib/analyticsStore";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const payload = bodyText ? JSON.parse(bodyText) : {};
    await appendEvent(payload);
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
