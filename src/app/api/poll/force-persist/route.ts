import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return NextResponse.json(
    {
      error:
        "Deprecated endpoint. Poll persistence is now handled via Supabase.",
    },
    { status: 410 }
  );
}
