import { createClient } from "../supabase/server";

export type WhyPoint = string | { label: string; detail?: string | null };

export type WhySection = {
  id: number;
  vehicle_type: "party-buses" | "limousines" | "coach-buses" | string;
  title: string;
  intro?: string | null;
  points: WhyPoint[];
  order: number | null;
};

export async function getWhySections(): Promise<WhySection[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("why_sections")
    .select("id, vehicle_type, title, intro, points, order")
    .order("order", { ascending: true });

  if (error) {
    console.error("[getWhySections]", error);
    return [];
  }
  return (data ?? []) as WhySection[];
}

export function pickWhyByType(
  sections: WhySection[],
  vehicleType: "party-buses" | "limousines" | "coach-buses"
): WhySection | undefined {
  return sections.find((s) => s.vehicle_type === vehicleType);
}
