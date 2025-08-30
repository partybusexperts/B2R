import { NextResponse } from "next/server";
import { vote } from "@/lib/pollsStore";

export const dynamic = "force-dynamic";

function readCookieHeader(req: Request, key: string) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const parts = cookie.split("; ");
    const found = parts.find(p => p.startsWith(`${key}=`));
    if (!found) return null;
    return found.split("=")[1];
  } catch (err) {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const poll_id = String(body.poll_id || body.pollId || "").trim();
    const option = String(body.option || body.vote || "").trim();
    if (!poll_id || !option) return NextResponse.json({ error: "poll_id and option required" }, { status: 400 });

    const ck = readCookieHeader(req, `pv_${poll_id}`);
    if (ck) {
      return NextResponse.json({ error: "Already voted" }, { status: 409 });
    }

    const { results, total } = await vote(poll_id, option);
    const res = NextResponse.json({ ok: true, results, total }, { headers: { "Cache-Control": "no-store" } });
    // Set cookie via header (set-cookie)
    res.headers.set("Set-Cookie", `pv_${poll_id}=1; Path=/; Max-Age=${60 * 60 * 24 * 365}`);
    return res;
  } catch (err) {
    const msg = (err && typeof err === "object" && 'message' in err) ? (err as any).message : String(err);
    return NextResponse.json({ error: msg || "Failed to save vote" }, { status: 500 });
  }
}
