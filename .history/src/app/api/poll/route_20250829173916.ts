import { NextResponse } from "next/server";
import { getAll } from "@/lib/pollsStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getAll();
  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}
