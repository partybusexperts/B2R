import { NextResponse } from "next/server";
import { vote } from "@/lib/pollsStore";

export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(request: Request) {
  try {
  const body = await request.json();
  const poll_id = String(body.poll_id || body.pollId || "").trim();
  const option = String(body.option || body.vote || "").trim();
  if (!poll_id || !option) return NextResponse.json({ error: "poll_id and option required" }, { status: 400 });
  const { results, total } = await vote(poll_id, option);
  const res = NextResponse.json({ ok: true, results, total }, { headers: { "Cache-Control": "no-store" } });
  res.cookies.set(`pv_${poll_id}`, "1", { path: "/", maxAge: 60 * 60 * 24 * 365 });
  return res;
  } catch (err) {
    console.error("API /api/poll/vote error:", err);
    return NextResponse.json({ error: "Failed to save vote" }, { status: 500 });
  }
}
