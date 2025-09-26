// src/lib/server/pages.ts
import { createClient } from "@supabase/supabase-js";

export async function getSections(pageSlug: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("page_sections")
    .select("kind, position, data")
    .eq("page_slug", pageSlug)
    .eq("is_active", true)
    .order("position", { ascending: true });

  if (error) {
    if (process.env.NODE_ENV !== "production") console.warn("[getSections]", error.message);
    return [];
  }
  return data ?? [];
}
