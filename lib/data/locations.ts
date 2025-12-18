import { Database } from "@/types/database.types";
import { createClient } from "../supabase/server";
import { cache } from "react";

export const getLocations = cache(async () => {
  const supabase = await createClient();
  // Fetch minimal data for the big list
  const { data: locations, error } = await supabase
    .from("locations")
    .select("*")
    .order("state_name");

  if (error) {
    console.error("getLocations:", error);
    return [];
  }

  if (!locations) {
    console.warn("getLocations:", "No data found");
    return [];
  }

  return locations;
});

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

export async function getLocationWithContent({
  slug,
  fleetType,
}: {
  slug: string;
  fleetType: "party-buses" | "limousines" | "coach-buses";
}) {
  const supabase = await createClient();

  const { data: location, error } = await supabase
    .from("locations")
    .select(
      `
      *,
      content:locations_content!inner(*) 
    `,
    )
    .eq("slug", slug) // 1. Match the Location Slug
    .eq("content.fleet_type", fleetType) // 2. Match the Content Fleet Type
    .single();

  if (error || !location) {
    console.error("Error fetching fleet location content:", error);
    return null;
  }

  // The 'content' field will be an array (usually of 1 item).
  // You might want to flatten it for easier use in your component:
  const contentItem = Array.isArray(location.content)
    ? location.content[0]
    : location.content;

  return {
    ...location,
    ...contentItem, // Now is an object, not an array
  };
}

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

// Using merged types to avoid creating relational tables / foreign keys
export type LocationsData = Database["public"]["Tables"]["locations"]["Row"];
export type LocationsWithContentData = LocationsData &
  Database["public"]["Tables"]["locations_content"]["Row"];

export interface LocationCoordinates {
  lat: number;
  lng: number;
}
export interface LocationHeader {
  title: string;
  description: string;
  bottom_label: string;
}

export interface LocationWhyBook {
  description: string;
  box1: {
    label: string;
    title: string;
    description: string;
    modal_content: string;
  };
  box2: {
    label: string;
    title: string;
    description: string;
    modal_content: string;
  };
  box3: {
    label: string;
    title: string;
    description: string;
    modal_content: string;
  };
  row1: { title: string; modal_content: string };
  row2: { title: string; modal_content: string };
  row3: { title: string; modal_content: string };
  row4: { title: string; modal_content: string };
}

export interface LocationHowToBook {
  description: string;
  step1: {
    title: string;
    icon: string;
    description: string;
    modal_content: string;
  };
  step2: {
    title: string;
    icon: string;
    description: string;
    modal_content: string;
  };
  step3: {
    title: string;
    icon: string;
    description: string;
    modal_content: string;
  };
  step4: {
    title: string;
    icon: string;
    description: string;
    modal_content: string;
  };
}

export interface LocationCitiesServed {
  description: string;
  label: string;
}

export interface LocationStatePlanningGuide {
  box1: { title: string; description: string };
  box2: { title: string; description: string };
  box3: { title: string; description: string };
  box4: { title: string; description: string };
  box5: { title: string; description: string };
  box6: { title: string; description: string };
  box7: { title: string; description: string };
  box8: { title: string; description: string };
}

export type LocationCompleteGuide = string; // HTML content

export type LocationPlanningGuide = string; // HTML content

export interface LocationTransportationOverview {
  column1_description: string;
  column2: { title: string; content: string }; // HTML content
  box1: { title: string; description: string };
  box2: { title: string; description: string };
  box3: { title: string; description: string };
  box4: { title: string; description: string };
  box5: { title: string; description: string };
  box6: { title: string; description: string };
}

export interface LocationExtraPlanningNotes {
  title: string;
  content: string; // HTML content
}

export interface LocationTopHotspots {
  routes: { title: string; description: string }[];
  high_impact_venues: string[];
  neighborhood_coverage: string[];
  recommendations: string; // HTML content
}

export interface LocationComfortChecklist {
  description: string;
  tips: string[];
  fleet_readiness: string; // HTML content
  trivia: { title: string; description: string };
  fast_facts: { title: string; description: string };
  playbook: {
    title: string;
    box1: { label: string; title: string; description: string };
    box2: { label: string; title: string; description: string };
    box3: { label: string; title: string; description: string };
  };
  case_files: {
    box1: { label: string; title: string; description: string };
    box2: { label: string; title: string; description: string };
    box3: { label: string; title: string; description: string };
    box4: { label: string; title: string; description: string };
  };
  hotfix_lane: string;
  slot_count: { number: number; text: string; label: string };
  driver_intel: { description: string; label: string };
  live_weather: { description: string };
  packing_tips: string[];
}

export interface LocationTransportDoneRight {
  description: string;
  bottom_content: string; // HTML content
}
