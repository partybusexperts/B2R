import { Database } from "@/types/database.types";
import { createClient } from "../supabase/server";
import { cache } from "react";

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

console.log(`
- [ ]  header: title, description, bottom_label
- [ ]  why_book:
    - [ ]  description
    - [ ]  box1: title, description, modal_content
    - [ ]  box2: title, description, modal_content
    - [ ]  box3: title, description, modal_content
    - [ ]  row1: title, modal_content
    - [ ]  row2: title, modal_content
    - [ ]  row3: title, modal_content
    - [ ]  row4: title, modal_content
- [ ]  how_to_book: (ASK IF NEEDED, OR THIS CAN BE THE SAME FOR ALL CITIES)
    - [ ]  description
    - [ ]  step1: title, description, modal_content
    - [ ]  step2: title, description, modal_content
    - [ ]  step3: title, description, modal_content
- [ ]  cities_served: (MAYBE THIS CAN GO ON STATE TABLE INSTEAD OF CITY)
    - [ ]  description
    - [ ]  label
- [ ]  state_planning_guide: (MAYBE THIS CAN GO ON STATE TABLE INSTEAD OF CITY)
    - [ ]  box1: title, description
    - [ ]  box2: title, description
    - [ ]  box3: title, description
    - [ ]  box4: title, description
    - [ ]  box5: title, description
    - [ ]  box6: title, description
    - [ ]  box7: title, description
    - [ ]  box8: title, description
- [ ]  complete_guide: content (html)
- [ ]  planning_checklist: content (html) [ASK IF NEEDED]
- [ ]  transportation_overview:
    - [ ]  description
    - [ ]  column2: title, content (html)
    - [ ]  box1: title, description
    - [ ]  box2: title, description
    - [ ]  box3: title, description
    - [ ]  box4: title, description
    - [ ]  box5: title, description
    - [ ]  box6: title, description
- [ ]  extra_notes:
    - [ ]  title
    - [ ]  content (html)
- [ ]  top_hotspots:
    - [ ]  routes: {title, description}[]
    - [ ]  high_impact_venues: venues[]
    - [ ]  neighborhood_coverage: zones[]
    - [ ]  recommendations: content (html)
- [ ]  comfort_checklist:
    - [ ]  title
    - [ ]  description
    - [ ]  tips: text[]
    - [ ]  fleet_readiness: content (html)
    - [ ]  trivia: title, description
    - [ ]  fast_facts: title, description
    - [ ]  playbook:
        - [ ]  title
        - [ ]  box1: label, title, description
        - [ ]  box2: label, title, description
        - [ ]  box3: label, title, description
    - [ ]  case_files:
        - [ ]  box1: label, title, description
        - [ ]  box2: label, title, description
        - [ ]  box3: label, title, description
        - [ ]  box4: label, title, description
    - [ ]  hotfix_lane: description
    - [ ]  slot_count: number, label, description
    - [ ]  driver_intel: title, description
    - [ ]  live_weather: description
    - [ ]  packing_tips: description
- [ ]  transport_done_right: description, bottom_content (html)
`);

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
  box1: { title: string; description: string; modal_content: string };
  box2: { title: string; description: string; modal_content: string };
  box3: { title: string; description: string; modal_content: string };
  row1: { title: string; modal_content: string };
  row2: { title: string; modal_content: string };
  row3: { title: string; modal_content: string };
  row4: { title: string; modal_content: string };
}

export interface LocationHowToBook {
  description: string;
  step1: { title: string; description: string; modal_content: string };
  step2: { title: string; description: string; modal_content: string };
  step3: { title: string; description: string; modal_content: string };
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

export interface LocationCompleteGuide {
  content: string; // HTML content
}

export interface LocationTransportationOverview {
  description: string;
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
  high_impact_venues: { name: string; description: string }[];
  neighborhood_coverage: { name: string; description: string }[];
  recommendations: string; // HTML content
}

export interface LocationComfortChecklist {
  title: string;
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
  slot_count: { number: number; label: string; description: string };
  driver_intel: { title: string; description: string };
  live_weather: { description: string };
  packing_tips: { description: string };
}

export interface LocationTransportDoneRight {
  description: string;
  bottom_content: string; // HTML content
}
