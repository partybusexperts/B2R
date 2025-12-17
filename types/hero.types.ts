import type { Database } from "./database.types";

// IMPORTANT: these types due to hero.ctas being a JSONB column in supabase and not a relational table

export type HeroCTA = {
  href: string;
  label: string;
  style: HeroButtonStyle;
};

// TODO: make it an ENUM in supabase or delete
export type HeroButtonStyle = "primary" | "secondary" | "outline";

// TODO: check slug, maybe we can delete it
export type HeroData = Database["public"]["Tables"]["homepage_hero"]["Row"];

// TODO: seed table from cities, states, events and maybe vehicles
