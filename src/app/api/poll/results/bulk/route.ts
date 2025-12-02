import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return NextResponse.json(
    {
      error:
        "Deprecated endpoint. Bulk results will be served from Supabase-based endpoints.",
    },
    { status: 410 }
  );
}
