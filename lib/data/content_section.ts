import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export const mockWhySections = [
  {
    id: 1,
    intro: "Experience luxury and comfort",
    title: "Why Limousines Rock",
    vehicle_type: "limo",
    features: [
      {
        created_at: new Date().toISOString(),
        cta_link: null,
        description: "Sleek and sophisticated transportation",
        icon: "crown",
        id: 1,
        modal_title: null,
        modal_description: null,
        modal_content: null,
        title: "Luxury Elegance",
        why_section_id: 1,
      },
      {
        created_at: new Date().toISOString(),
        cta_link: null,
        description: "Professional chauffeurs for your peace of mind",
        icon: "users",
        id: 2,
        modal_title: null,
        modal_description: null,
        modal_content: null,
        title: "Professional Service",
        why_section_id: 1,
      },
      {
        created_at: new Date().toISOString(),
        cta_link: null,
        description: "Premium bar and entertainment options",
        icon: "wine-2",
        id: 3,
        modal_title: null,
        modal_description: null,
        modal_content: null,
        title: "Premium Amenities",
        why_section_id: 1,
      },
    ],
  },
  {
    id: 2,
    intro: "Perfect for large group events",
    title: "Why Coaches Rock",
    vehicle_type: "coach",
    features: [
      {
        created_at: new Date().toISOString(),
        cta_link: null,
        description: "Spacious seating for entire groups",
        icon: "Users",
        id: 4,
        modal_title: null,
        modal_description: null,
        modal_content: null,
        title: "Large Capacity",
        why_section_id: 2,
      },
      {
        created_at: new Date().toISOString(),
        cta_link: null,
        description: "Climate controlled comfort",
        icon: "thermometer",
        id: 5,
        modal_title: null,
        modal_description: null,
        modal_content: null,
        title: "Ultimate Comfort",
        why_section_id: 2,
      },
      {
        created_at: new Date().toISOString(),
        cta_link: null,
        description: "Long-distance travel capability",
        icon: "map",
        id: 6,
        modal_title: null,
        modal_description: null,
        modal_content: null,
        title: "Long-Distance Ready",
        why_section_id: 2,
      },
    ],
  },
  {
    id: 3,
    intro: "The ultimate party on wheels",
    title: "Why Party Buses Rock",
    vehicle_type: "party-bus",
    features: [
      {
        created_at: new Date().toISOString(),
        cta_link: null,
        description: "Dance floor and DJ equipment included",
        icon: "music",
        id: 7,
        modal_title: null,
        modal_description: null,
        modal_content: null,
        title: "Built-in Entertainment",
        why_section_id: 3,
      },
      {
        created_at: new Date().toISOString(),
        cta_link: null,
        description: "Fully stocked bar and beverage service",
        icon: "wine-2",
        id: 8,
        modal_title: null,
        modal_description: null,
        modal_content: null,
        title: "Full Bar Service",
        why_section_id: 3,
      },
      {
        created_at: new Date().toISOString(),
        cta_link: null,
        description: "Neon lights and LED ambiance",
        icon: "lightbulb",
        id: 9,
        modal_title: null,
        modal_description: null,
        modal_content: null,
        title: "Party Atmosphere",
        why_section_id: 3,
      },
    ],
  },
];

export const getWhySectionsBySlug = cache(async (slug: string) => {
  const supabase = await createClient();

  const { data: why_section, error } = await supabase
    .from("why_sections")
    .select(
      `
        *,
        features:why_features (
        *
        )
      `,
    )
    .eq("vehicle_type", slug)
    // Optional: Only get 3
    .limit(3, { foreignTable: "why_features" })
    // Optional: Ensure you get the 'best' 3 (e.g., by some order)
    .order("created_at", { referencedTable: "why_features", ascending: true })
    .single();

  if (error) {
    console.error("getWhySectionsContent:", slug, error);
    return null;
  }

  if (!why_section) {
    console.warn("getWhySectionsContent:", "No data found");
    return mockWhySections[0];
  }

  return why_section;
});

export type WhySection = Awaited<ReturnType<typeof getWhySectionsBySlug>>;

export type WhyFeature = NonNullable<WhySection>["features"][number];
