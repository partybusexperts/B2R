import { NextResponse } from "next/server";
import { getResults } from "@/lib/pollsStore";

export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const poll_id = String(params?.id || "").trim();
  if (!poll_id) return NextResponse.json({ error: "poll_id required" }, { status: 400 });
  try {
    const { poll, results, total } = await getResults(poll_id);
    if (!poll) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ poll, results, total }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("poll results error", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
