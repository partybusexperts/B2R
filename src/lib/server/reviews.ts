import { createClient } from "../supabase/server";

export type ReviewRow = {
  id: number;
  body: string | null;
  rating: number | null;
  author_display: string | null;
  source: string | null;
  source_url: string | null;
  featured: boolean | null;
  published_at: string | null;
  created_at?: string | null;
};

const hasSupabase =
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL) &&
  !!(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY);

export async function getFeaturedReviews(limit = 18): Promise<ReviewRow[]> {
  if (!hasSupabase) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, body, rating, author_display, source, source_url, featured, published_at, created_at")
    .eq("approved", true)
    .order("featured", { ascending: false })
    .order("rating", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getFeaturedReviews]", error);
    return [];
  }
  return (data ?? []) as ReviewRow[];
}

export async function getAggregateRating() {
  if (!hasSupabase) return { avg: null, count: 0 };
  const supabase = createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("rating", { head: false, count: "exact" })
    .eq("approved", true);
  if (error) return { avg: null, count: 0 };
  const rows = (data ?? []) as ReviewRow[];
  const ratings = rows.map((r) => Number(r.rating)).filter(Boolean);
  const count = ratings.length;
  const avg = count ? ratings.reduce((a, b) => a + b, 0) / count : null;
  return { avg, count };
}
