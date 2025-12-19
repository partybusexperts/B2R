import { createClient } from "@/lib/supabase/server";
import { HeroData } from "@/types/hero.types";
import { cache } from "react";

const fallbackHero: HeroData = {
  id: "mock-home",
  slug: "home",
  title: "Bus2Ride: Your Event Transportation Experts",
  subtitle: "Your trusted partner for seamless event transportation.",
  ctas: [
    {
      href: "/contact",
      label: "Contact Us",
      style: "secondary",
    },
    {
      href: "/party-buses",
      label: "View Fleet",
      style: "primary",
    },
    {
      href: "/pricing",
      label: "Get Instant Quote",
      style: "outline",
    },
  ],
  storage_bucket: "vehicles1",
  image_keys: null,
  // image_keys: [
  //   "36 Passenger Party Bus/36 Passenger Party Bus Interior Lux.png",
  //   "45 Passenger Party Bus/45 Passenger Party Bus Exterior Lux.png",
  //   "56 Passenger Coach Bus/56 Passenger Coach Bus Interior Lux.png",
  //   "14 Passenger Executive Sprinter Van/14 Passenger Executive Sprinter Interior Lux.png",
  // ],
  autoplay_ms: 5500,
  darken: 0.35,
  created_at: new Date("2023-01-01").toISOString(),
  updated_at: new Date("2023-01-01").toISOString(),
};

export const getHeroBySlug = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data: hero, error } = await supabase
    .from("homepage_hero")
    .select("*")
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("getHeroBySlug", error);
    return null;
  }

  if (!hero) {
    console.warn("getHeroBySlug:", "No data returned");
    return fallbackHero;
  }

  return hero;
});
