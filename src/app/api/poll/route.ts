import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return NextResponse.json(
    {
      error:
        "Deprecated voting endpoint. Voting will be handled by new Supabase-powered routes.",
    },
    { status: 410 }
  );
}
