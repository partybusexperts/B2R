export type PollCategory = {
  key: string;
  label: string;
  group: "vehicles" | "events" | "features" | "pricing" | "safety" | "policies" | "operations" | "states" | "other";
  synonyms?: string[];
  weight?: number;
};

export const BASE_GROUP_ORDER: string[] = [
  "vehicles",
  "events",
  "features",
  "pricing",
  "safety",
  "policies",
  "operations",
  "states",
  "other",
];

export const VEHICLE_CATEGORIES: PollCategory[] = [
  { key: "vehicle:party-bus", label: "Party Bus", group: "vehicles", synonyms: ["partybus", "limo bus", "party coach"] },
  { key: "vehicle:limousine", label: "Limo", group: "vehicles", synonyms: ["limousine", "stretch limo", "sedan limo"] },
  { key: "vehicle:suv-limo", label: "SUV Limo", group: "vehicles", synonyms: ["escalade limo", "hummer limo", "chrysler 300 limo"] },
  { key: "vehicle:sprinter", label: "Sprinter Van", group: "vehicles", synonyms: ["mercedes sprinter", "sprinter limo", "sprinter shuttle"] },
  { key: "vehicle:shuttle-bus", label: "Shuttle Bus", group: "vehicles", synonyms: ["mini shuttle", "airport shuttle", "14-24 passenger"] },
  { key: "vehicle:mini-coach", label: "Mini Coach", group: "vehicles", synonyms: ["mini bus", "25-35 passenger coach"] },
  { key: "vehicle:motorcoach", label: "Motorcoach", group: "vehicles", synonyms: ["charter bus", "coach bus", "56 passenger"] },
  { key: "vehicle:sedan", label: "Sedan", group: "vehicles", synonyms: ["car service", "black car"] },
  { key: "vehicle:suv", label: "SUV", group: "vehicles", synonyms: ["suburban", "yukon", "navigator"] },
  { key: "vehicle:trolley", label: "Trolley", group: "vehicles" },
  { key: "vehicle:school-bus", label: "School Bus", group: "vehicles", synonyms: ["yellow bus"] },
];

export const EVENT_CATEGORIES: PollCategory[] = [
  { key: "event:wedding", label: "Weddings Polls", group: "events", synonyms: ["wedding", "rehearsal", "bridal"] },
  { key: "event:prom", label: "Proms Polls", group: "events", synonyms: ["homecoming", "school dance"] },
  { key: "event:birthday", label: "Birthdays Polls", group: "events", synonyms: ["sweet 16", "quince", "quinceañera", "mitzvah"] },
  { key: "event:bachelor", label: "Bachelor Parties Polls", group: "events" },
  { key: "event:bachelorette", label: "Bachelorette Parties Polls", group: "events" },
  { key: "event:concert", label: "Concerts Polls", group: "events" },
  { key: "event:sports", label: "Sporting Events Polls", group: "events", synonyms: ["game day", "tailgate"] },
  { key: "event:night-out", label: "Night Out Polls", group: "events", synonyms: ["bar crawl", "club", "downtown"] },
  { key: "event:wine", label: "Wine Tours Polls", group: "events", synonyms: ["vineyard"] },
  { key: "event:brewery", label: "Brewery Tours Polls", group: "events" },
  { key: "event:corporate", label: "Corporate Events Polls", group: "events", synonyms: ["offsite", "retreat", "meeting"] },
  { key: "event:airport", label: "Airport Polls", group: "events" },
  { key: "event:holiday", label: "Holiday Lights Polls", group: "events" },
  { key: "event:graduation", label: "Graduation Polls", group: "events" },
  { key: "event:church-youth", label: "Church/Youth Polls", group: "events" },
];

export const FEATURE_CATEGORIES: PollCategory[] = [
  { key: "feature:music", label: "Music/Playlist", group: "features", synonyms: ["spotify", "aux", "bluetooth", "dj"] },
  { key: "feature:lighting", label: "Lighting", group: "features", synonyms: ["led", "neon", "strobe", "laser"] },
  { key: "feature:pole", label: "Dance Pole", group: "features", synonyms: ["pole"] },
  { key: "feature:restroom", label: "Restroom", group: "features", synonyms: ["bathroom", "toilet"] },
  { key: "feature:ada", label: "ADA Access", group: "features", synonyms: ["wheelchair", "handicap"] },
  { key: "feature:byob", label: "BYOB", group: "features", synonyms: ["alcohol", "cooler", "ice"] },
  { key: "feature:charging", label: "Charging/USB", group: "features", synonyms: ["usb", "outlet"] },
  { key: "feature:luggage", label: "Luggage Space", group: "features" },
  { key: "feature:karaoke", label: "Karaoke", group: "features" },
  { key: "feature:pet", label: "Pet Friendly", group: "features" },
  { key: "feature:child-seat", label: "Child Seats", group: "features" },
];

export const PRICING_CATEGORIES: PollCategory[] = [
  { key: "pricing:deposits", label: "Deposits", group: "pricing" },
  { key: "pricing:overtime", label: "Overtime", group: "pricing" },
  { key: "pricing:gratuity", label: "Gratuity", group: "pricing", synonyms: ["tip", "driver tip"] },
  { key: "pricing:fees", label: "Fees/Refunds", group: "pricing", synonyms: ["cleaning", "damage", "cancellation"] },
  { key: "pricing:prom", label: "Prom Pricing", group: "pricing" },
  { key: "pricing:before5", label: "Before 5pm", group: "pricing" },
];

export const SAFETY_CATEGORIES: PollCategory[] = [
  { key: "safety:insurance", label: "Insurance & Licensing", group: "safety" },
  { key: "safety:dot", label: "DOT/Compliance", group: "safety" },
  { key: "safety:driver", label: "Driver Policies", group: "safety", synonyms: ["wait time", "dress code"] },
];

export const POLICY_CATEGORIES: PollCategory[] = [
  { key: "policy:smoking", label: "Smoking/Vaping", group: "policies" },
  { key: "policy:routes", label: "Route Flexibility", group: "policies" },
  { key: "policy:food", label: "Food/Drink Rules", group: "policies" },
];

export const OPERATIONS_CATEGORIES: PollCategory[] = [
  { key: "ops:pickup-drop", label: "Pickup/Drop Windows", group: "operations" },
  { key: "ops:stops", label: "Extra Stops", group: "operations" },
  { key: "ops:cleanup", label: "Cleanup Rules", group: "operations" },
];

export const US_STATES = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" }, { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" }, { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" }, { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" }, { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" }, { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" }, { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" }, { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" }, { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" }, { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" }, { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" }, { code: "DC", name: "District of Columbia" }
];

export const STATE_CATEGORIES: PollCategory[] = US_STATES.map((s) => ({
  // Key should be the full state name (slugified), no "state:" prefix and no postal code abbreviations
  key: s.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z-]/g, ""),
  label: s.name,
  group: "states",
  // Only include the full name as a searchable label — avoid postal code synonyms per request
  synonyms: [s.name],
}));

export const VEHICLE_TYPE_CATEGORIES: PollCategory[] = [
  { key: "type:luxury", label: "Luxury", group: "vehicles", synonyms: ["luxury", "premium"] },
  { key: "type:compact", label: "Compact", group: "vehicles", synonyms: ["compact", "sedan"] },
  { key: "type:suv", label: "SUV", group: "vehicles", synonyms: ["suv", "crossover"] },
  { key: "type:minivan", label: "Minivan", group: "vehicles", synonyms: ["minivan", "family van"] },
  { key: "type:coach", label: "Coach", group: "vehicles", synonyms: ["coach", "motorcoach"] },
  { key: "type:party", label: "Party", group: "vehicles", synonyms: ["party", "party-bus"] },
  { key: "type:limo", label: "Limo", group: "vehicles", synonyms: ["limo", "limousine"] },
];

// Group categories by logical group to guarantee a stable ordering in the UI
export const CATEGORIES_BY_GROUP: Record<string, PollCategory[]> = {
  vehicles: [...VEHICLE_CATEGORIES, ...VEHICLE_TYPE_CATEGORIES],
  events: [...EVENT_CATEGORIES],
  features: [...FEATURE_CATEGORIES],
  pricing: [...PRICING_CATEGORIES],
  safety: [...SAFETY_CATEGORIES],
  policies: [...POLICY_CATEGORIES],
  operations: [...OPERATIONS_CATEGORIES],
  states: [...STATE_CATEGORIES],
  other: [],
};

// Flatten groups in the configured BASE_GROUP_ORDER and sort categories inside each group by label
export const ALL_CATEGORIES: PollCategory[] = BASE_GROUP_ORDER.flatMap((grp) => {
  const list = CATEGORIES_BY_GROUP[grp] || [];
  return list.slice().sort((a, b) => (a.label || "").localeCompare(b.label || ""));
});

// Also export a stable ordered view keyed by group for UIs that need grouping
export const ORDERED_CATEGORIES_BY_GROUP = Object.fromEntries(
  BASE_GROUP_ORDER.map((g) => [g, (CATEGORIES_BY_GROUP[g] || []).slice().sort((a, b) => (a.label || "").localeCompare(b.label || ""))])
) as Record<string, PollCategory[]>;

/**
 * Normalize arbitrary input (category/tags/title/question/prompt) to known category keys.
 * Returns an array of matching category keys (deduped). Falls back to ["other:misc"].
 */
export function normalizeToCategoryKeys(input: { category?: string; tags?: string[]; title?: string; question?: string; prompt?: string }): string[] {
  const all = ALL_CATEGORIES;
  const textParts: string[] = [];
  if (input.category) textParts.push(input.category);
  if (input.title) textParts.push(input.title);
  if (input.question) textParts.push(input.question);
  if (input.prompt) textParts.push(input.prompt);
  if (input.tags && input.tags.length) textParts.push(...input.tags);
  const text = textParts.join(" ").toLowerCase();

  const matches = new Set<string>();

  // 1) exact key hit
  if (input.category) {
    const key = input.category.trim().toLowerCase();
    const found = all.find((c) => c.key.toLowerCase() === key || c.key.toLowerCase() === `category:${key}`);
    if (found) matches.add(found.key);
  }

  // 2) match label or synonyms by substring
  for (const cat of all) {
    const keyLower = cat.key.toLowerCase();
    if (text.includes(keyLower)) matches.add(cat.key);
    const labelLower = (cat.label || "").toLowerCase();
    if (labelLower && text.includes(labelLower)) matches.add(cat.key);
    if (cat.synonyms) {
      for (const s of cat.synonyms) {
        const sLower = s.toLowerCase();
        if (text.includes(sLower)) {
          matches.add(cat.key);
          break;
        }
      }
    }
  }

  // 3) try tag-based heuristic: match tags to category keys that include the tag
  if (input.tags) {
    for (const t of input.tags) {
      const tl = String(t).toLowerCase();
      for (const cat of all) {
        if (cat.key.toLowerCase().includes(tl)) matches.add(cat.key);
      }
    }
  }

  const out = Array.from(matches);
  if (out.length === 0) return ["other:misc"];
  return out;
}
