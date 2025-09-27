// src/lib/server/pages.ts
import { createClient } from "@supabase/supabase-js";

export async function getSections(pageSlug: string) {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ""; // tolerate different names
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";

  // If we're building without envs (e.g., static prerender), just return []
  if (!url || !key) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[getSections] Missing Supabase env; returning [].");
    }
    return [];
  }

  const supabase = createClient(url, key);

  const { data, error } = await supabase
    .from("page_sections")
    .select("kind, position, data")
    .eq("page_slug", pageSlug)
    .eq("is_active", true)
    .order("position", { ascending: true });

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[getSections] query error:", error.message);
    }
    return [];
  }
  return data ?? [];
}

