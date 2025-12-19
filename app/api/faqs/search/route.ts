import { NextResponse } from "next/server";
import { searchFaqsBySlug } from "@/lib/data/faqs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category") ?? undefined;
  const query = searchParams.get("q") ?? undefined;
  const limitParam = searchParams.get("limit") ?? undefined;

  const limit = Number(limitParam);

  if (Number.isNaN(limit) || limit <= 0) {
    return NextResponse.json(
      { error: "Invalid limit", faqs: [] },
      { status: 400 },
    );
  }

  const faqs = await searchFaqsBySlug({ slug: category, query, limit });
  return NextResponse.json({ faqs });
}
