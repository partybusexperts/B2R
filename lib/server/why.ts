import { createClient } from "@/lib/supabase/server";

export type WhySection = {
  id: number;
  vehicle_type: string;
  title: string;
  points: string[];     // jsonb array in DB
  order: number | null;
};

export async function getWhySections(): Promise<WhySection[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("why_sections")
    .select("id, vehicle_type, title, points, order")
    .order("order", { ascending: true });

  if (error) {
    console.error("[getWhySections]", error);
    return [];
  }
  return (data ?? []) as WhySection[];
}
