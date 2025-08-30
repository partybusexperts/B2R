import { NextResponse } from "next/server";
import { vote } from "@/lib/pollsStore";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { poll_id, option } = await req.json();
    if (!poll_id || !option) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    // If cookie exists, block duplicate vote
    const ck = cookies().get(`pv_${poll_id}`);
    if (ck?.value) {
      return NextResponse.json({ error: "Already voted" }, { status: 409 });
    }

    const { results, total } = await vote(poll_id, option);
    const res = NextResponse.json({ ok: true, results, total }, { headers: { "Cache-Control": "no-store" } });
    res.cookies.set(`pv_${poll_id}`, "1", { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Vote failed" }, { status: 400 });
  }
}
