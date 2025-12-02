import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    {
      error:
        "Deprecated endpoint. Results will be served from Supabase-based endpoints.",
      pollId: params.id,
    },
    { status: 410 }
  );
}
