import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export const mockEvents: EventData[] = [
  {
    id: "1",
    title: "Wedding Celebrations",
    slug: "wedding-celebrations",
    description: "Make your wedding day unforgettable with our premium fleet",
    category: "wedding",
    date_range: "Year-round",
    images: ["weddings-hero.jpg"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "Bachelor & Bachelorette Parties",
    slug: "bachelor-bachelorette",
    description: "Celebrate the last night of singledom in style",
    category: "bachelor",
    date_range: "Friday - Sunday",
    images: ["bachelor-parties.jpg"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    title: "Prom Night",
    slug: "prom-night",
    description: "Arrive at prom in style with our luxury transportation",
    category: "prom",
    date_range: "April - June",
    images: ["prom-night.jpg"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    title: "Night Out on the Town",
    slug: "night-out-town",
    description: "Bar hopping and club nights made safe and fun",
    category: "nightlife",
    date_range: "Thursday - Saturday",
    images: ["nightlife.jpg"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

export const getEvents = cache(async (limit?: number) => {
  const supabase = await createClient();

  let request = supabase.from("events").select("*");

  if (limit) {
    request = request.limit(limit);
  }

  const { data: events, error } = await request;

  if (error) {
    console.error("getEvents:", error);
    return null;
  }

  if (!events || events?.length === 0) {
    console.warn("getEvents:", "No data found");
    return null;
  }

  return events;
});

export const getEventBySlug = cache(async (slug: string) => {
  const supabase = await createClient();

  const { data: eventsBySlug, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("getEventBySlug:", error);
    return null;
  }

  if (!eventsBySlug) {
    console.warn("getEventBySlug:", "No data found");
    return null;
  }

  return eventsBySlug;
});

export type EventData = NonNullable<
  Awaited<ReturnType<typeof getEvents>>
>[number];
