import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json(
    {
      error: "Deprecated endpoint. Use /api/poll/by-tag instead.",
    },
    { status: 410 }
  );
}
