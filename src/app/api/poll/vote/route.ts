import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received vote:", body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error handling vote:", err);
    return NextResponse.json(
      { error: "Failed to record vote" },
      { status: 500 }
    );
  }
}
