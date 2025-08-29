import { NextResponse } from "next/server";
import pollsStore from "../../../../../lib/pollsStore";

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
    const results = await pollsStore.get(poll_id);
    return NextResponse.json({ poll_id, results });
  } catch (err) {
    console.error("poll results error", err);
    return NextResponse.json({ poll_id, results: {} });
  }
}
