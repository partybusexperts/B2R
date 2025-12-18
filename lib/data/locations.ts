import { Database } from "@/types/database.types";
import { createClient } from "../supabase/server";
import { cache } from "react";

// 1. FOR PAGE: /locations (The Directory)
export const getAllLocations = cache(async () => {
  const supabase = await createClient();
  // Fetch minimal data for the big list
  const { data: locations, error } = await supabase
    .from("locations")
    .select("*")
    .order("state_name");

  if (error) {
    console.error("getAllLocations:", error);
    return [];
  }

  if (!locations) {
    console.warn("getAllLocations:", "No data found");
    return [];
  }

  // Use merged types or create relational tables / foreign keys
  return locations as Database["public"]["Tables"]["locations"]["Row"][];
});

// 2. FOR PAGE: /locations/states/[state_slug]
export const getLocationsByState = cache(async (stateSlug: string) => {
  const supabase = await createClient();
  const { data: locationsByState, error } = await supabase
    .from("locations")
    .select("*")
    .eq("state_slug", stateSlug)
    .order("city_name");

  if (error) {
    console.error("getLocationsByState:", error);
    return null;
  }

  if (!locationsByState) {
    console.warn("getLocationsByState:", "No data found");
    return null;
  }

  return locationsByState;
});

// 3. FOR PAGE: /locations/state/[state_slug]/city/[city_slug]
export const getLocationBySlugs = cache(
  async (stateSlug: string, citySlug: string) => {
    const supabase = await createClient();
    const { data: location, error } = await supabase
      .from("locations")
      .select("*")
      .eq("state_slug", stateSlug)
      .eq("city_slug", citySlug)
      .maybeSingle();

    if (error) {
      console.error("getLocationBySlugs:", error);
      return null;
    }

    if (!location) {
      console.warn("getLocationBySlugs:", "No data found");
      return null;
    }

    return location;
  },
);

// Legacy helper: used to safely redirect old routes like `/locations/city/[city_slug]`.
// Returns potentially multiple rows because `city_slug` is not globally unique.
export const getLocationsByCitySlug = cache(async (citySlug: string) => {
  const supabase = await createClient();
  const { data: locationsByCity, error } = await supabase
    .from("locations")
    .select("state_slug, city_slug")
    .eq("city_slug", citySlug)
    .order("state_slug");

  if (error) {
    console.error("getLocationsByCitySlug:", error);
    return null;
  }

  return locationsByCity ?? [];
});

// 4. FOR PAGE: /locations/state/[state_slug]/city/[city_slug]/[fleet_slug]
export const getLocationFleetPage = cache(
  async (stateSlug: string, citySlug: string, fleetSlug: string) => {
    const location = await getLocationBySlugs(stateSlug, citySlug);

    if (!location) return null;

    const isFleetType = (
      value: string,
    ): value is "party-bus" | "limo" | "coach" =>
      value === "party-bus" || value === "limo" || value === "coach";

    if (!isFleetType(fleetSlug)) return null;

    // CHECK: Does this city actually have this fleet type?
    // If Anchorage only has 'party-bus', then /anchorage/coach should 404.
    const hasFleet = location.available_fleet_types.includes(fleetSlug);

    if (!hasFleet) return null; // This triggers notFound() in Next.js

    return location;
  },
);

export type LocationsData = Awaited<ReturnType<typeof getAllLocations>>[number];

export interface LocationTrivia {
  question: string;
  answer: string;
  icon: string;
}

export interface LocationInfoBlock {
  title: string;
  icon: string;
  short_desc: string;
  modal_content: string;
}

export interface LocationCoordinates {
  lat: number;
  lng: number;
}
