import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const limit = Math.min(parseInt(searchParams.get("limit") || "24", 10), 50);
  const category = searchParams.get("category") || "";
  const q = searchParams.get("q") || "";

  try {
    const supabase = await createClient();
    
    let query = supabase
      .from("polls1")
      .select(`
        id,
        question,
        category_slug,
        category_data:poll_categories1 (
          name
        ),
        options:poll_options1 (
          id,
          label,
          vote_count,
          ord
        )
      `)
      .filter("question", "not.ilike", "Your opinion on%")
      .order("ord", { referencedTable: "poll_options1", ascending: true })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.ilike("category_slug", `%${category}%`);
    }

    if (q) {
      const escaped = q.replace(/%/g, "\\%").replace(/_/g, "\\_");
      query = query.or(`question.ilike.%${escaped}%,category_slug.ilike.%${escaped}%`);
    }

    const { data: polls, error } = await query;

    if (error) {
      console.error("API polls error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      polls: polls || [],
      offset,
      limit,
      hasMore: (polls?.length || 0) >= limit
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error("API polls error:", error);
    return NextResponse.json({ error: "Failed to fetch polls" }, { status: 500 });
  }
}
