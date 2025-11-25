import { createClient } from "@/lib/supabase/server";

export type FaqItem = {
  id: number;
  page_slug: string;
  question: string;
  answer: string;
  sort_order: number | null;
};

export async function getFaqsForPage(pageSlug: string, limit = 100) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("faqs")
    .select("id,page_slug,question,answer,sort_order")
    .eq("page_slug", pageSlug)
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("id", { ascending: true })
    .limit(limit);

  if (error) {
    console.error(`[faqs] Failed to load FAQs for ${pageSlug}:`, error);
    return [] as FaqItem[];
  }

  return (data ?? []) as FaqItem[];
}
