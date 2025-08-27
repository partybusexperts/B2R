import { NextResponse } from "next/server";
import { getAccessToken } from "../_lib/spotify";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const id = process.env.SPOTIFY_CLIENT_ID;
    const secret = process.env.SPOTIFY_CLIENT_SECRET;
    if (!id || !secret) {
      return NextResponse.json({ ok: false, auth: "missing" });
    }
    await getAccessToken(); // throws if bad
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const msg = String(e?.message || e);
    if (msg.includes("missing_credentials")) {
      return NextResponse.json({ ok: false, auth: "missing" });
    }
    return NextResponse.json({ ok: false, auth: "failed", error: msg }, { status: 500 });
  }
}
