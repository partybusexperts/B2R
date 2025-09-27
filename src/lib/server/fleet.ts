// src/lib/server/fleet.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Returns a map: { [vehicleName]: ["LED Lights", "Bluetooth", "Coolers"] }
export async function getAmenityLabelsByVehicleName(
  category: "party-buses" | "limousines" | "coach-buses",
  limitPerVehicle = 3
): Promise<Record<string, string[]>> {
  // pull all labels per vehicle in this category
  const { data, error } = await supabase
    .from("vehicles11")
    .select(`
      name,
      vehicle_amenities11 (
        amenities11 ( label )
      )
    `)
    .eq("type", category);

  if (error || !data) return {};

  const map: Record<string, string[]> = {};
  for (const row of data as any[]) {
    const labels: string[] =
      (row.vehicle_amenities11 ?? [])
        .map((va: any) => va?.amenities11?.label)
        .filter(Boolean);

    // simple, deterministic pick: sort alphabetically then take first N
    const picked = [...new Set(labels)].sort().slice(0, limitPerVehicle);
    map[row.name] = picked;
  }
  return map;
}
