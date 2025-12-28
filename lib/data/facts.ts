import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export type FactItem = {
  id: string;
  stat: string;
  label: string;
  description: string;
  icon: "star" | "clock" | "zap" | "users" | "trending" | "check";
  category: "stat" | "tip" | "insight";
  page_slug?: string;
  sort_order?: number;
};

export const mockFacts: FactItem[] = [
  { id: "1", stat: "500+", label: "Vehicles Available", description: "Party buses, limos, and coaches nationwide", icon: "star", category: "stat" },
  { id: "2", stat: "98%", label: "On-Time Rate", description: "Professional drivers who arrive early", icon: "clock", category: "stat" },
  { id: "3", stat: "24/7", label: "Support Available", description: "Questions answered any time of day", icon: "zap", category: "tip" },
  { id: "4", stat: "15-50", label: "Passengers Per Bus", description: "Options for every group size", icon: "users", category: "insight" },
  { id: "5", stat: "$150-400", label: "Hourly Range", description: "Transparent pricing, no hidden fees", icon: "trending", category: "stat" },
  { id: "6", stat: "4.9/5", label: "Average Rating", description: "Based on 10,000+ verified reviews", icon: "star", category: "insight" },
];

export const getFacts = cache(async (pageSlug = "home", limit = 6): Promise<FactItem[]> => {
  const supabase = await createClient();

  const { data: facts, error } = await supabase
    .from("site_stats" as any)
    .select("*")
    .eq("page_slug", pageSlug)
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error) {
    console.warn("getFacts: Supabase error, using fallback data", error.message);
    return mockFacts.slice(0, limit);
  }

  if (!facts || !Array.isArray(facts) || facts.length === 0) {
    console.warn("getFacts: No data found in Supabase, using fallback data");
    return mockFacts.slice(0, limit);
  }

  return (facts as unknown as Record<string, unknown>[]).map((fact) => ({
    id: String(fact.id),
    stat: String(fact.stat),
    label: String(fact.label),
    description: String(fact.description),
    icon: (fact.icon as FactItem["icon"]) || "star",
    category: (fact.category as FactItem["category"]) || "stat",
    page_slug: fact.page_slug ? String(fact.page_slug) : undefined,
    sort_order: fact.sort_order ? Number(fact.sort_order) : undefined,
  }));
});

export const getAllFacts = cache(async (limit = 20): Promise<FactItem[]> => {
  const supabase = await createClient();

  const { data: facts, error } = await supabase
    .from("site_stats" as any)
    .select("*")
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error) {
    console.warn("getAllFacts: Supabase error, using fallback data", error.message);
    return mockFacts;
  }

  if (!facts || !Array.isArray(facts) || facts.length === 0) {
    console.warn("getAllFacts: No data found in Supabase, using fallback data");
    return mockFacts;
  }

  return (facts as unknown as Record<string, unknown>[]).map((fact) => ({
    id: String(fact.id),
    stat: String(fact.stat),
    label: String(fact.label),
    description: String(fact.description),
    icon: (fact.icon as FactItem["icon"]) || "star",
    category: (fact.category as FactItem["category"]) || "stat",
    page_slug: fact.page_slug ? String(fact.page_slug) : undefined,
    sort_order: fact.sort_order ? Number(fact.sort_order) : undefined,
  }));
});
