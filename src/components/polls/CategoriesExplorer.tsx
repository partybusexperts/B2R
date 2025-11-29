// src/components/polls/CategoriesExplorer.tsx
"use client";

import React, { useMemo, useState } from "react";

interface CategoriesExplorerProps {
  categories: string[];
}

/**
 * High-level groups the user can toggle between
 */
type TopGroup =
  | "all"
  | "locations"
  | "vehicles"
  | "events"
  | "amenities"
  | "accessibility"
  | "experiences"
  | "policies"
  | "booking";

type RegionKey = "Northeast" | "Midwest" | "South" | "West" | "Unknown";

interface CategoryMeta {
  slug: string;
  label: string;
  topGroup: TopGroup;
  region?: RegionKey;
  stateCode?: string;
  kind?: "state" | "city" | "topic";
}

interface LocationStateGroup {
  stateCode: string;
  stateName: string;
  stateSlug?: string;
  items: CategoryMeta[]; // state + cities
}

interface LocationRegionGroup {
  region: RegionKey;
  states: LocationStateGroup[];
}

/**
 * STATE + REGION METADATA
 */
const STATE_META: Record<
  string,
  { code: string; slug: string; name: string; region: RegionKey }
> = {
  AL: { code: "AL", slug: "alabama", name: "Alabama", region: "South" },
  AK: { code: "AK", slug: "alaska", name: "Alaska", region: "West" },
  AZ: { code: "AZ", slug: "arizona", name: "Arizona", region: "West" },
  AR: { code: "AR", slug: "arkansas", name: "Arkansas", region: "South" },
  CA: { code: "CA", slug: "california", name: "California", region: "West" },
  CO: { code: "CO", slug: "colorado", name: "Colorado", region: "West" },
  CT: { code: "CT", slug: "connecticut", name: "Connecticut", region: "Northeast" },
  DE: { code: "DE", slug: "delaware", name: "Delaware", region: "South" },
  FL: { code: "FL", slug: "florida", name: "Florida", region: "South" },
  GA: { code: "GA", slug: "georgia", name: "Georgia", region: "South" },
  HI: { code: "HI", slug: "hawaii", name: "Hawaii", region: "West" },
  ID: { code: "ID", slug: "idaho", name: "Idaho", region: "West" },
  IL: { code: "IL", slug: "illinois", name: "Illinois", region: "Midwest" },
  IN: { code: "IN", slug: "indiana", name: "Indiana", region: "Midwest" },
  IA: { code: "IA", slug: "iowa", name: "Iowa", region: "Midwest" },
  KS: { code: "KS", slug: "kansas", name: "Kansas", region: "Midwest" },
  KY: { code: "KY", slug: "kentucky", name: "Kentucky", region: "South" },
  LA: { code: "LA", slug: "louisiana", name: "Louisiana", region: "South" },
  ME: { code: "ME", slug: "maine", name: "Maine", region: "Northeast" },
  MD: { code: "MD", slug: "maryland", name: "Maryland", region: "South" },
  MA: { code: "MA", slug: "massachusetts", name: "Massachusetts", region: "Northeast" },
  MI: { code: "MI", slug: "michigan", name: "Michigan", region: "Midwest" },
  MN: { code: "MN", slug: "minnesota", name: "Minnesota", region: "Midwest" },
  MS: { code: "MS", slug: "mississippi", name: "Mississippi", region: "South" },
  MO: { code: "MO", slug: "missouri", name: "Missouri", region: "Midwest" },
  MT: { code: "MT", slug: "montana", name: "Montana", region: "West" },
  NE: { code: "NE", slug: "nebraska", name: "Nebraska", region: "Midwest" },
  NV: { code: "NV", slug: "nevada", name: "Nevada", region: "West" },
  NH: { code: "NH", slug: "new-hampshire", name: "New Hampshire", region: "Northeast" },
  NJ: { code: "NJ", slug: "new-jersey", name: "New Jersey", region: "Northeast" },
  NM: { code: "NM", slug: "new-mexico", name: "New Mexico", region: "West" },
  NY: { code: "NY", slug: "new-york", name: "New York", region: "Northeast" },
  NC: { code: "NC", slug: "north-carolina", name: "North Carolina", region: "South" },
  ND: { code: "ND", slug: "north-dakota", name: "North Dakota", region: "Midwest" },
  OH: { code: "OH", slug: "ohio", name: "Ohio", region: "Midwest" },
  OK: { code: "OK", slug: "oklahoma", name: "Oklahoma", region: "South" },
  OR: { code: "OR", slug: "oregon", name: "Oregon", region: "West" },
  PA: { code: "PA", slug: "pennsylvania", name: "Pennsylvania", region: "Northeast" },
  RI: { code: "RI", slug: "rhode-island", name: "Rhode Island", region: "Northeast" },
  SC: { code: "SC", slug: "south-carolina", name: "South Carolina", region: "South" },
  SD: { code: "SD", slug: "south-dakota", name: "South Dakota", region: "Midwest" },
  TN: { code: "TN", slug: "tennessee", name: "Tennessee", region: "South" },
  TX: { code: "TX", slug: "texas", name: "Texas", region: "South" },
  UT: { code: "UT", slug: "utah", name: "Utah", region: "West" },
  VT: { code: "VT", slug: "vermont", name: "Vermont", region: "Northeast" },
  VA: { code: "VA", slug: "virginia", name: "Virginia", region: "South" },
  WA: { code: "WA", slug: "washington", name: "Washington", region: "West" },
  WV: { code: "WV", slug: "west-virginia", name: "West Virginia", region: "South" },
  WI: { code: "WI", slug: "wisconsin", name: "Wisconsin", region: "Midwest" },
  WY: { code: "WY", slug: "wyoming", name: "Wyoming", region: "West" },
};

const STATE_SLUG_TO_CODE: Record<string, string> = Object.values(STATE_META).reduce(
  (acc, s) => {
    acc[s.slug] = s.code;
    return acc;
  },
  {} as Record<string, string>
);

/**
 * QUICK LOOKUP SETS FOR NON-LOCATION TYPES
 */

// Vehicles (party bus, limos, shuttles, etc.)
const VEHICLE_KEYWORDS = [
  "party-bus",
  "coach-bus",
  "minibus",
  "mini-coach",
  "shuttle-bus",
  "motorcoach",
  "bus",
  "trolley",
  "sprinter",
  "executive-sprinter",
  "limo",
  "stretch-limo",
  "suv-limo",
  "sedan",
  "suv",
  "black-car-sedan",
  "luxury-suv",
  "party-van",
  "classic-car",
];

// Events & occasions
const EVENT_KEYWORDS = [
  "after-parties",
  "anniversary-parties",
  "bachelor-parties",
  "bachelorette-parties",
  "bar-bat-mitzvahs",
  "birthday-parties",
  "corporate-parties",
  "girls-nights-out",
  "guys-nights-out",
  "kids-parties",
  "quinceanera-parties",
  "retirement-parties",
  "sweet-sixteen",
  "graduation",
  "homecoming",
  "prom",
  "school-field-trips",
  "winter-formals",
  "bar-crawls",
  "brewery-tours",
  "casino-tours",
  "church-outings",
  "concerts",
  "dinners-out",
  "festivals",
  "haunted-houses",
  "holiday-lights-tours",
  "parades",
  "sporting-events",
  "wine-tours",
  "corporate-services",
  "employee-shuttles",
  "rehearsal-dinners",
  "team-building",
  "weddings",
  "christmas",
  "new-years-eve",
  "thanksgiving",
  "events",
];

// Amenities & features
const AMENITY_KEYWORDS = [
  // seating & comfort
  "armrests",
  "cushioned-seats",
  "footrests",
  "headrests",
  "heated-seats",
  "leather-seating",
  "leg-rests",
  "massage-seats",
  "plush-reclining-seats",
  "reclining-seats",
  "seating",
  "ventilated-seats",
  "wrap-around-seating",
  // entertainment
  "audio",
  "bluetooth-connectivity",
  "bluetooth-sound",
  "built-in-screens",
  "dance-pole",
  "dropdown-screens",
  "dvd-player",
  "entertainment",
  "flat-screen-tvs",
  "karaoke-system",
  "led-light-show",
  "laser-lights",
  "mood-lighting",
  "neon-accents",
  "satellite-radio",
  "strobe-lights",
  "surround-sound-system",
  "surround-sound-speakers",
  "tv-screens",
  "video-game-console",
  // bar & refreshments
  "bar-area",
  "bottle-holders",
  "champagne-glasses",
  "coolers",
  "coolers-ice",
  "ice-buckets",
  "mini-bar",
  "refrigerator",
  // storage
  "coat-hooks",
  "cup-holders",
  "luggage-storage",
  "overhead-bins",
  "overhead-compartments",
  "overhead-storage",
  "tray-tables",
  "under-bus-luggage-bays",
  "undercarriage-luggage-space",
  // climate
  "air-conditioning",
  "air-purifier",
  "climate-control",
  "heating",
  "individual-airflow-controls",
  "individual-overhead-vents",
  // power
  "power-charging",
  "power-outlets",
  "usb-charging",
  "usb-ports",
  "wi-fi",
  "wifi-connectivity",
  "wifi-hotspot",
  // restroom
  "compact-bathroom",
  "hand-sanitizer-dispenser",
  "hand-soap-in-restroom",
  "onboard-restrooms",
  "paper-towels-in-restroom",
  "restroom",
  "trash-receptacle",
  "uv-sanitizer",
  "wastebasket",
  "wipes-container",
  // safety & exterior
  "emergency-exits",
  "emergency-kit",
  "first-aid-kits",
  "first-aid-supplies",
  "seat-belts",
  "tire-pressure-monitoring",
  "vehicle-tracking",
  "alloy-wheels",
  "backup-camera",
  "chrome-accents",
  "custom-interiors",
  "custom-paint-job",
  "extended-wheelbase",
  "fiber-optic-roof",
  "parking-sensors",
  "plush-carpeting",
  "privacy-shades",
  "starlight-ceiling",
  "stretch-design",
  "sunroof",
  "tinted-windows",
  // misc amenities
  "bottle-openers",
  "fog-machine",
  "gps-navigation",
  "intercom-system",
  "mint-dispenser",
  "photo-booth-setup",
  "privacy-divider",
  "reading-lights",
  "smoke-machine",
  "tissue-box",
  "touchscreen-controls",
  "trash-receptacles",
  "waste-receptacle",
];

// Accessibility
const ACCESSIBILITY_KEYWORDS = [
  "accessibility-experience",
  "booster-seats",
  "child-seats",
  "handicap-seating",
  "pet-friendly-options",
  "ramp-access",
  "seatbelts-child-seats",
  "wheelchair",
  "wheelchair-lift",
];

// Experiences & issues
const EXPERIENCE_KEYWORDS = [
  "best-driver-moments",
  "overall-satisfaction",
  "damage-cleanup-stories",
  "double-booked-snafus",
  "equipment-failures",
  "found-items-stories",
  "issue-resolution",
  "nightmare-traffic",
  "overcapacity-problems",
  "payment-issues",
  "weather-disaster-stories",
  "worst-pickup-experience",
  "wrong-destination",
  "comfort-cleanliness",
  "driver-professionalism",
  "reliability-punctuality",
  "airport-procedures",
  "cross-border-travel",
  "event-staging-parking",
  "luggage-handling",
  "music-preferences",
  "operations-logistics",
  "pickup-dropoff-zones",
  "seasonality-trends",
  // moved from "other"
  "myths-vs-facts",
];

// Policies
const POLICY_KEYWORDS = [
  "alcohol-policy",
  "cancellations",
  "deposits",
  "driver-hours-regs",
  "emergency-procedures",
  "gratuity",
  "incident-reporting",
  "lost-and-found",
  "minimum-hours",
  "overtime",
  "smoking-policy",
];

// Booking & planning
const BOOKING_KEYWORDS = [
  "booking-experience",
  "booking-lead-times",
  "communication-preferences",
  "corporate-discounts",
  "multi-stop-itineraries",
  "peak-days-times",
  "payment-methods",
  "pickup-window",
  "route-planning",
  "traffic-weather-mitigation",
  "travel-distance",
  "vip-protocol",
  "wait-time-windows",
  // moved from "other"
  "pricing",
];

/**
 * Helper: nice label from slug.
 * - "phoenix-az" -> "Phoenix, AZ"
 * - "party-bus" -> "Party Bus"
 */
function humanizeSlug(slug: string): string {
  if (!slug) return "";

  const lower = slug.toLowerCase();
  const cityMatch = lower.match(/^(.+)-([a-z]{2})$/);

  // City, ST format
  if (cityMatch && STATE_META[cityMatch[2].toUpperCase()]) {
    const city = cityMatch[1].replace(/-/g, " ");
    const stateCode = cityMatch[2].toUpperCase();
    return `${titleCase(city)}, ${stateCode}`;
  }

  // State full name
  if (STATE_SLUG_TO_CODE[lower]) {
    const code = STATE_SLUG_TO_CODE[lower];
    return STATE_META[code].name;
  }

  // Fallback: just title case
  return titleCase(lower.replace(/-/g, " "));
}

function titleCase(str: string): string {
  return str.replace(/\b([a-z])/g, (m) => m.toUpperCase());
}

/**
 * Determine if slug is a location (state/city) or a topic
 */
function classifyTopGroup(slug: string): TopGroup {
  const lower = slug.toLowerCase();

  // Location: exact state slug
  if (STATE_SLUG_TO_CODE[lower]) return "locations";

  // Location: city ending in -[state]
  const cityMatch = lower.match(/.+-([a-z]{2})$/);
  if (cityMatch && STATE_META[cityMatch[1].toUpperCase()]) {
    return "locations";
  }

  // Vehicles
  if (VEHICLE_KEYWORDS.some((k) => lower.includes(k))) return "vehicles";

  // Events
  if (EVENT_KEYWORDS.some((k) => lower.includes(k))) return "events";

  // Amenities
  if (AMENITY_KEYWORDS.some((k) => lower.includes(k))) return "amenities";

  // Accessibility
  if (ACCESSIBILITY_KEYWORDS.some((k) => lower.includes(k))) return "accessibility";

  // Experiences
  if (EXPERIENCE_KEYWORDS.some((k) => lower.includes(k))) return "experiences";

  // Policies
  if (POLICY_KEYWORDS.some((k) => lower.includes(k))) return "policies";

  // Booking
  if (BOOKING_KEYWORDS.some((k) => lower.includes(k))) return "booking";

  // Fleet stats clearly belongs with vehicles
  if (lower === "fleet-size-stats") return "vehicles";

  // Anything truly unknown → booking/planning as a catch-all
  return "booking";
}

/**
 * Build CategoryMeta for every slug
 */
function buildCategoryMeta(slugs: string[]): CategoryMeta[] {
  return slugs.map((raw) => {
    const slug = raw.toLowerCase().trim();
    const topGroup = classifyTopGroup(slug);
    const label = humanizeSlug(slug);

    let region: RegionKey | undefined;
    let stateCode: string | undefined;
    let kind: CategoryMeta["kind"] = "topic";

    if (topGroup === "locations") {
      // State?
      if (STATE_SLUG_TO_CODE[slug]) {
        stateCode = STATE_SLUG_TO_CODE[slug];
        region = STATE_META[stateCode].region;
        kind = "state";
      } else {
        // City: ends with -ST
        const match = slug.match(/.+-([a-z]{2})$/);
        if (match && STATE_META[match[1].toUpperCase()]) {
          stateCode = match[1].toUpperCase();
          region = STATE_META[stateCode].region;
          kind = "city";
        }
      }
      if (!region) region = "Unknown";
    }

    return { slug, label, topGroup, region, stateCode, kind };
  });
}

/**
 * Group location metas into Region > State > Items
 */
function buildLocationRegions(metas: CategoryMeta[]): LocationRegionGroup[] {
  const byState: Record<string, LocationStateGroup> = {};

  for (const meta of metas) {
    if (!meta.stateCode) continue;
    const stateCode = meta.stateCode;
    const stateMeta = STATE_META[stateCode];
    if (!stateMeta) continue;

    if (!byState[stateCode]) {
      byState[stateCode] = {
        stateCode,
        stateName: stateMeta.name,
        stateSlug: stateMeta.slug,
        items: [],
      };
    }
    byState[stateCode].items.push(meta);
  }

  // Ensure state itself is present if its slug exists in metas
  for (const stateCode of Object.keys(STATE_META)) {
    const state = STATE_META[stateCode];
    const hasStateMeta = metas.find((m) => m.slug === state.slug);

    if (hasStateMeta) {
      if (!byState[stateCode]) {
        byState[stateCode] = {
          stateCode,
          stateName: state.name,
          stateSlug: state.slug,
          items: [],
        };
      }
      // Make sure state entry is first
      const list = byState[stateCode].items;
      const existing = list.find((m) => m.slug === state.slug);
      if (!existing) {
        list.unshift({
          slug: state.slug,
          label: state.name,
          topGroup: "locations",
          region: state.region,
          stateCode,
          kind: "state",
        });
      }
    }
  }

  // Build regions
  const regions: Record<RegionKey, LocationRegionGroup> = {
    Northeast: { region: "Northeast", states: [] },
    Midwest: { region: "Midwest", states: [] },
    South: { region: "South", states: [] },
    West: { region: "West", states: [] },
    Unknown: { region: "Unknown", states: [] },
  };

  Object.values(byState).forEach((stateGroup) => {
    const stateMeta = STATE_META[stateGroup.stateCode];
    const regionKey = stateMeta?.region || "Unknown";

    // Sort items inside state: state first, then cities
    stateGroup.items.sort((a, b) => {
      if (a.kind === "state" && b.kind !== "state") return -1;
      if (b.kind === "state" && a.kind !== "state") return 1;
      return a.label.localeCompare(b.label);
    });

    regions[regionKey].states.push(stateGroup);
  });

  // Sort states alphabetically
  (Object.values(regions) as LocationRegionGroup[]).forEach((r) => {
    r.states.sort((a, b) => a.stateName.localeCompare(b.stateName));
  });

  // Only return regions that actually have states
  return (Object.values(regions) as LocationRegionGroup[]).filter(
    (r) => r.states.length > 0
  );
}

/**
 * UI CONFIG
 */
const TOP_GROUP_CONFIG: { key: TopGroup; label: string; icon: string }[] = [
  { key: "all", label: "All Types", icon: "🌎" },
  { key: "locations", label: "Locations (Cities & States)", icon: "📍" },
  { key: "vehicles", label: "Vehicles", icon: "🚌" },
  { key: "events", label: "Events & Occasions", icon: "🎉" },
  { key: "amenities", label: "Amenities & Features", icon: "✨" },
  { key: "accessibility", label: "Accessibility", icon: "♿" },
  { key: "experiences", label: "Experiences & Issues", icon: "📖" },
  { key: "policies", label: "Policies & Procedures", icon: "📜" },
  { key: "booking", label: "Booking & Planning", icon: "🗓️" },
];

// Accent type for category styling
export type Accent = 'purple' | 'blue' | 'green' | 'amber' | 'red';

// Accent color classes
export const accentToClasses: Record<Accent, { badge: string; border: string; glow: string }> = {
  purple: {
    badge: 'bg-purple-100 text-purple-700',
    border: 'border-purple-200',
    glow: 'shadow-[0_0_30px_rgba(168,85,247,0.25)]',
  },
  blue: {
    badge: 'bg-blue-100 text-blue-700',
    border: 'border-blue-200',
    glow: 'shadow-[0_0_30px_rgba(59,130,246,0.25)]',
  },
  green: {
    badge: 'bg-emerald-100 text-emerald-700',
    border: 'border-emerald-200',
    glow: 'shadow-[0_0_30px_rgba(16,185,129,0.25)]',
  },
  amber: {
    badge: 'bg-amber-100 text-amber-700',
    border: 'border-amber-200',
    glow: 'shadow-[0_0_30px_rgba(245,158,11,0.25)]',
  },
  red: {
    badge: 'bg-rose-100 text-rose-700',
    border: 'border-rose-200',
    glow: 'shadow-[0_0_30px_rgba(244,63,94,0.25)]',
  },
};

export function CategoriesExplorer({ categories }: CategoriesExplorerProps) {
  const [activeGroup, setActiveGroup] = useState<TopGroup>("all");
  const [search, setSearch] = useState("");
  const [openBlocks, setOpenBlocks] = useState<Record<string, boolean>>({});

  const metas = useMemo(() => buildCategoryMeta(categories), [categories]);

  const searchLower = search.trim().toLowerCase();

  const filteredMetas = useMemo(() => {
    let list = metas;

    if (activeGroup !== "all") {
      list = list.filter((m) => m.topGroup === activeGroup);
    }

    if (searchLower) {
      list = list.filter(
        (m) =>
          m.label.toLowerCase().includes(searchLower) ||
          m.slug.toLowerCase().includes(searchLower)
      );
    }

    return list;
  }, [metas, activeGroup, searchLower]);

  const totalCount = metas.length;
  const visibleCount = filteredMetas.length;

  // Sub-grouped collections
  const locationRegions = useMemo(
    () => buildLocationRegions(filteredMetas.filter((m) => m.topGroup === "locations")),
    [filteredMetas]
  );

  const vehicles = filteredMetas.filter((m) => m.topGroup === "vehicles");
  const events = filteredMetas.filter((m) => m.topGroup === "events");
  const amenities = filteredMetas.filter((m) => m.topGroup === "amenities");
  const accessibility = filteredMetas.filter((m) => m.topGroup === "accessibility");
  const experiences = filteredMetas.filter((m) => m.topGroup === "experiences");
  const policies = filteredMetas.filter((m) => m.topGroup === "policies");
  const booking = filteredMetas.filter((m) => m.topGroup === "booking");

  const toggleBlock = (key: string) => {
    setOpenBlocks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-10">
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {TOP_GROUP_CONFIG.map(({ key, label, icon }) => {
          const count =
            key === "all"
              ? totalCount
              : metas.filter((m) => m.topGroup === key).length;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveGroup(key)}
              className={[
                "px-4 py-2 rounded-full border text-sm md:text-base font-semibold transition-all flex items-center gap-2",
                activeGroup === key
                  ? "bg-sky-400 text-slate-900 border-sky-400 shadow-lg shadow-sky-500/30"
                  : "bg-[#050c1f] text-white/75 border-white/10 hover:bg-[#09122d]",
              ].join(" ")}
            >
              <span>{icon}</span>
              <span>{label}</span>
              <span className="text-xs text-white/70 bg-black/30 px-2 py-0.5 rounded-full">
                {count.toLocaleString()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 flex items-center gap-3 rounded-3xl bg-[#06122a] border border-sky-500/30 px-5 py-4 shadow-xl shadow-sky-500/20">
          <span className="text-sky-400 text-2xl">🔎</span>
          <input
            type="search"
            placeholder="Search by city, state, vehicle, event, amenity, or keyword…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-base md:text-lg text-white placeholder:text-sky-300"
          />
        </div>
        <p className="text-sm text-white/70 text-center md:text-right">
          Showing{" "}
          <span className="font-bold text-sky-300">
            {visibleCount.toLocaleString()}
          </span>{" "}
          of{" "}
          <span className="font-bold text-sky-300">
            {totalCount.toLocaleString()}
          </span>{" "}
          categories
        </p>
      </div>

      {/* CONTENT BLOCKS */}
      <div className="space-y-8">
        {(activeGroup === "all" || activeGroup === "locations") && (
          <CategoryBlock
            id="locations"
            title="Locations (Cities & States)"
            subtitle="Browse by region → state → city."
            count={locationRegions.reduce(
              (sum, r) =>
                sum +
                r.states.reduce((s2, st) => s2 + st.items.length, 0),
              0
            )}
            openBlocks={openBlocks}
            onToggle={toggleBlock}
          >
            {locationRegions.length === 0 && <EmptyMessage />}

            <div className="grid gap-5">
              {locationRegions.map((region) => (
                <div
                  key={region.region}
                  className="rounded-3xl bg-gradient-to-br from-[#050b1d] via-[#07132b] to-[#050b1d] border border-white/10 p-4 md:p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
                      <span>📍</span>
                      <span>{region.region} Region</span>
                    </h3>
                    <span className="text-xs text-white/60">
                      {region.states.length} states
                    </span>
                  </div>
                  <div className="grid gap-4 max-h-[360px] overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {region.states.map((state) => (
                      <div key={state.stateCode}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-sky-300">
                              {state.stateName}
                            </span>
                            <span className="text-[10px] uppercase tracking-widest text-white/50 border border-white/10 rounded-full px-2 py-0.5">
                              {state.stateCode}
                            </span>
                          </div>
                          <span className="text-xs text-white/50">
                            {state.items.length.toLocaleString()}{" "}
                            {state.items.length === 1
                              ? "category"
                              : "categories"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {state.items.map((cat) => (
                            <CategoryButton key={cat.slug} meta={cat} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CategoryBlock>
        )}

        {(activeGroup === "all" || activeGroup === "vehicles") && (
          <SimpleGroupBlock
            id="vehicles"
            icon="🚌"
            title="Vehicles"
            subtitle="Party buses, limos, shuttles, sedans, SUVs & more."
            items={vehicles}
            openBlocks={openBlocks}
            onToggle={toggleBlock}
          />
        )}

        {(activeGroup === "all" || activeGroup === "events") && (
          <SimpleGroupBlock
            id="events"
            icon="🎉"
            title="Events & Occasions"
            subtitle="Parties, weddings, tours, proms, concerts, sporting events & more."
            items={events}
            openBlocks={openBlocks}
            onToggle={toggleBlock}
          />
        )}

        {(activeGroup === "all" || activeGroup === "amenities") && (
          <SimpleGroupBlock
            id="amenities"
            icon="✨"
            title="Amenities & Features"
            subtitle="Seating, lighting, sound systems, bars, climate control, storage & more."
            items={amenities}
            openBlocks={openBlocks}
            onToggle={toggleBlock}
          />
        )}

        {(activeGroup === "all" || activeGroup === "accessibility") && (
          <SimpleGroupBlock
            id="accessibility"
            icon="♿"
            title="Accessibility & Handicap Features"
            subtitle="Wheelchairs, lifts, child seats, ramps, pet-friendly options."
            items={accessibility}
            openBlocks={openBlocks}
            onToggle={toggleBlock}
          />
        )}

        {(activeGroup === "all" || activeGroup === "experiences") && (
          <SimpleGroupBlock
            id="experiences"
            icon="📖"
            title="Customer Experiences & Issues"
            subtitle="Best moments, nightmare stories, traffic, cleanups, overcapacity & more."
            items={experiences}
            openBlocks={openBlocks}
            onToggle={toggleBlock}
          />
        )}

        {(activeGroup === "all" || activeGroup === "policies") && (
          <SimpleGroupBlock
            id="policies"
            icon="📜"
            title="Policies & Procedures"
            subtitle="Alcohol, cancellations, deposits, smoking, hours, incidents."
            items={policies}
            openBlocks={openBlocks}
            onToggle={toggleBlock}
          />
        )}

        {(activeGroup === "all" || activeGroup === "booking") && (
          <SimpleGroupBlock
            id="booking"
            icon="🗓️"
            title="Booking & Planning"
            subtitle="Lead times, routes, payment methods, peak days, VIP protocols, pricing."
            items={booking}
            openBlocks={openBlocks}
            onToggle={toggleBlock}
          />
        )}

        {visibleCount === 0 && (
          <p className="text-center text-sm text-white/70">
            No categories match that search yet. Try another keyword.
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Reusable category pill button
 */
function CategoryButton({ meta }: { meta: CategoryMeta }) {
  const href = `/polls/category/${meta.slug}`;
  return (
    <a
      href={href}
      className="group inline-flex items-center justify-between gap-2 rounded-full border border-sky-500/30 bg-gradient-to-r from-[#06122a] via-[#081a36] to-[#06122a] px-3 py-2 text-xs md:text-sm font-semibold text-white shadow-md hover:border-sky-400 hover:bg-[#081a36] hover:shadow-sky-500/40 transition-all"
    >
      <span className="truncate">{meta.label}</span>
      <span className="opacity-70 group-hover:opacity-100 text-lg leading-none">
        →
      </span>
    </a>
  );
}

/**
 * Collapsible block wrapper
 */
function CategoryBlock(props: {
  id: string;
  title: string;
  subtitle?: string;
  count: number;
  children: any;
  openBlocks: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  const { id, title, subtitle, count, children, openBlocks, onToggle } = props;
  const isOpen = openBlocks[id] ?? true;

  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#050b1d] via-[#07122b] to-[#050b1d] shadow-xl shadow-black/40 overflow-hidden">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between px-5 md:px-6 py-4 md:py-5 bg-black/10 hover:bg-black/20 transition-colors"
      >
        <div className="flex flex-col items-start gap-1">
          <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
          {subtitle && (
            <p className="text-xs md:text-sm text-white/70">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/60 bg-white/5 border border-white/10 rounded-full px-3 py-1">
            {count.toLocaleString()}{" "}
            {count === 1 ? "category" : "categories"}
          </span>
          <span className="text-lg md:text-2xl">{isOpen ? "▴" : "▾"}</span>
        </div>
      </button>
      {isOpen && (
        <div className="px-4 md:px-6 pb-5 md:pb-6 pt-3">{children}</div>
      )}
    </section>
  );
}

/**
 * Simple flat group block (Vehicles, Events, etc.)
 */
function SimpleGroupBlock(props: {
  id: string;
  icon: string;
  title: string;
  subtitle?: string;
  items: CategoryMeta[];
  openBlocks: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  const { id, icon, title, subtitle, items, openBlocks, onToggle } = props;
  const isOpen = openBlocks[id] ?? true;

  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#050b1d] via-[#07122b] to-[#050b1d] shadow-xl shadow-black/40 overflow-hidden">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between px-5 md:px-6 py-4 md:py-5 bg-black/10 hover:bg-black/20 transition-colors"
      >
        <div className="flex flex-col items-start gap-1">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <span>{icon}</span>
            <span>{title}</span>
          </h2>
          {subtitle && (
            <p className="text-xs md:text-sm text-white/70">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/60 bg-white/5 border border-white/10 rounded-full px-3 py-1">
            {items.length.toLocaleString()}{" "}
            {items.length === 1 ? "category" : "categories"}
          </span>
          <span className="text-lg md:text-2xl">{isOpen ? "▴" : "▾"}</span>
        </div>
      </button>
      {isOpen && (
        <div className="px-4 md:px-6 pb-5 md:pb-6 pt-3">
          {items.length === 0 ? (
            <EmptyMessage />
          ) : (
            <div className="max-h-[420px] overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {items
                  .slice()
                  .sort((a, b) => a.label.localeCompare(b.label))
                  .map((cat) => (
                    <CategoryButton key={cat.slug} meta={cat} />
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function EmptyMessage() {
  return (
    <p className="text-xs md:text-sm text-white/60">
      No categories in this section match your filters yet.
    </p>
  );
}
