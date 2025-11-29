// src/components/polls/CategoriesExplorer.tsx
"use client";

import { useMemo, useState } from "react";

interface CategoriesExplorerProps {
  categories: string[];
}

type CategoryType =
  | 'state'
  | 'major-city'
  | 'city'
  | 'vehicle-type'
  | 'vehicle'
  | 'pricing'
  | 'feature'
  | 'event'
  | 'other';

const STATE_ABBR = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
];

const MAJOR_CITIES = [
  'new-york-ny','los-angeles-ca','chicago-il','houston-tx','phoenix-az','philadelphia-pa','san-antonio-tx','san-diego-ca','dallas-tx','san-jose-ca'
];
const VEHICLE_TYPES = [
  'party-bus','sprinter-limo','coach-bus','mini-coach','limo','van','fleet','vehicle'
];

function getCategoryType(slug: string): CategoryType {
  // Major city: matches known major cities
  if (MAJOR_CITIES.includes(slug)) return 'major-city';
  // Vehicle type: matches known vehicle types
  if (VEHICLE_TYPES.includes(slug)) return 'vehicle-type';
  // State: matches state abbreviation only
  if (STATE_ABBR.includes(slug.toUpperCase())) return 'state';
  // City: ends with -[state-abbr] and not just state
  const cityMatch = slug.match(/([a-z\-]+)-([a-z]{2})$/);
  if (cityMatch && STATE_ABBR.includes(cityMatch[2].toUpperCase())) return 'city';
  // Vehicle: contains vehicle keywords
  if (/bus|limo|coach|sprinter|van|fleet|vehicle/.test(slug)) return 'vehicle';
  // Event: contains event keywords
  if (/wedding|prom|concert|bachelor|birthday|event|graduation|homecoming|game|tailgate/.test(slug)) return 'event';
  // Feature: contains feature keywords
  if (/feature|amenity|comfort|privacy|design|music|bar|photo|vibe|dance|sound|lights|drink/.test(slug)) return 'feature';
  // Pricing: contains pricing keywords
  if (/price|cost|budget|deposit|fee|surcharge|tip|rate|quote|split/.test(slug)) return 'pricing';
  return 'other';
}

// Humanize category slug to label
function humanizeCategory(slug: string): string {
  // Example: "albany-ny" → "Albany, NY", "sprinter-limo" → "Sprinter Limo"
  if (!slug) return "";
  let label = slug.replace(/-/g, " ");
  label = label.replace(/\b([a-z])/g, (m) => m.toUpperCase());
  // If ends with state abbreviation, format as "City, ST"
  const stateMatch = label.match(/ ([A-Z]{2})$/);
  if (stateMatch) {
    label = label.replace(/ ([A-Z]{2})$/, ", $1");
  }
  // Special handling for known vehicle types
  label = label.replace(/Sprinter Limo/i, "Sprinter Limo");
  label = label.replace(/Party Bus/i, "Party Bus");
  label = label.replace(/Mini Coach/i, "Mini Coach");
  label = label.replace(/Coach Bus/i, "Coach Bus");
  label = label.replace(/Limo/i, "Limo");
  return label.trim();
}

type CategoryInfo = {
  slug: string;
  label: string;
  type: CategoryType;
};

interface GroupedCategories {
  letter: string;
  items: CategoryInfo[];
}

const LETTERS = ["All", "#", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

export function CategoriesExplorer({ categories }: CategoriesExplorerProps) {
    const [activeType, setActiveType] = useState<CategoryType | 'all'>('all');
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState<string>("All");

  const grouped: GroupedCategories[] = useMemo(() => {
    const q = search.trim().toLowerCase();
    // Pair each category with its type and append 'Polls' to label
    const pairs = categories.map((slug) => ({ slug, label: humanizeCategory(slug) + ' Polls', type: getCategoryType(slug) }));
    // Filter by type
    let filtered = pairs;
    if (activeType !== 'all') {
      filtered = filtered.filter((c) => c.type === activeType);
    }
    // 1) Search filter
    if (q) {
      filtered = filtered.filter((c) =>
        c.label.toLowerCase().includes(q)
      );
    }

    // 2) Letter filter
    if (activeLetter !== "All") {
      filtered = filtered.filter((c) => {
        const first = (c.label[0] ?? "").toUpperCase();
        if (activeLetter === "#") {
          // Non A–Z letters
          return !/[A-Z]/.test(first);
        }
        return first === activeLetter;
      });
    }

    // 3) Group by first letter
    const map = new Map<string, Array<{slug: string, label: string, type: CategoryType}>>();
    for (const cat of filtered) {
      const first = (cat.label[0] ?? "").toUpperCase();
      const key = /[A-Z]/.test(first) ? first : "#";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(cat);
    }

    const result: GroupedCategories[] = Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([letter, items]) => ({
        letter,
        items: items.sort((a, b) => a.label.localeCompare(b.label)),
      }));

    return result;
  }, [categories, search, activeLetter, activeType]);

  const totalVisible = useMemo(
    () => grouped.reduce((sum, g) => sum + g.items.length, 0),
    [grouped]
  );

  return (
    <div className="space-y-8">
      {/* Search + count */}
            {/* Category type filter */}
            <div className="flex gap-2 flex-wrap mb-2 justify-center">
              {[
                { type: 'all', label: 'All Types', icon: '🌎' },
                { type: 'state', label: 'US States', icon: '🏛️' },
                { type: 'major-city', label: 'Major Cities', icon: '🏙️' },
                { type: 'city', label: 'Other Cities', icon: '🏘️' },
                { type: 'vehicle-type', label: 'Vehicle Types', icon: '🚐' },
                { type: 'vehicle', label: 'Vehicle Polls', icon: '🚗' },
                { type: 'pricing', label: 'Pricing', icon: '💸' },
                { type: 'feature', label: 'Features', icon: '✨' },
                { type: 'event', label: 'Events', icon: '🎉' },
                { type: 'other', label: 'Other', icon: '❓' },
              ].map(({ type, label, icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveType(type as CategoryType | 'all')}
                  className={["px-4 py-2 rounded-full border font-semibold transition-all flex items-center gap-2",
                    activeType === type
                      ? "bg-sky-400 text-slate-900 border-sky-400"
                      : "bg-[#050c1f] text-white/70 border-white/15 hover:bg-[#070f27]"
                  ].join(" ")}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                  <span className="text-xs text-white/50">{
                    type === 'all'
                      ? categories.length
                      : categories.filter((slug) => getCategoryType(slug) === type).length
                  }</span>
                </button>
              ))}
            </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 flex items-center gap-3 rounded-3xl bg-[#06122a] border border-sky-500/30 px-5 py-4 shadow-lg">
          <span className="text-sky-400 text-xl">🔎</span>
          <input
            type="search"
            placeholder="Search by city, state, vehicle, event, or keyword (e.g. Phoenix, Sprinter, Wedding, Texas)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder:text-sky-300"
          />
        </div>
        <p className="text-sm text-white/70">
          Showing <span className="font-bold text-sky-300">{totalVisible.toLocaleString()}</span> of <span className="font-bold text-sky-300">{categories.length.toLocaleString()}</span> categories
        </p>
      </div>

      {/* A–Z strip */}
      <div className="flex gap-1 overflow-x-auto pb-1 text-[11px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {LETTERS.map((letter) => {
          const isActive = activeLetter === letter;
          return (
            <button
              key={letter}
              type="button"
              onClick={() => setActiveLetter(letter)}
              className={[
                "px-2 py-1 rounded-full border transition-colors whitespace-nowrap",
                isActive
                  ? "bg-sky-400 text-slate-900 border-sky-400 font-semibold"
                  : "bg-[#050c1f] text-white/70 border-white/15 hover:bg-[#070f27]",
              ].join(" ")}
            >
              {letter.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Grouped grid */}
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {grouped.length === 0 && (
          <p className="text-xs text-white/60">
            No categories match that search yet. Try another keyword.
          </p>
        )}

        {grouped.map((group) => (
          <section key={group.letter} className="space-y-2">
            {/* Letter header */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-sky-400/20 border border-sky-400/50 flex items-center justify-center text-[11px] font-semibold text-sky-100">
                {group.letter}
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-sky-500/60 via-white/10 to-transparent" />
              <span className="text-[10px] text-white/50">
                {group.items.length.toLocaleString()} categories
              </span>
            </div>

            {/* Category buttons grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {group.items.map((cat) => {
                const slug = toSlug(cat.slug);
                return (
                  <a
                    key={cat.slug}
                    href={`/polls/category/${slug}`}
                    className="group inline-flex items-center justify-between gap-2 rounded-full border-2 border-sky-500/30 bg-gradient-to-r from-[#06122a] via-[#081a36] to-[#06122a] px-5 py-3 text-base font-semibold text-white shadow-lg hover:border-sky-400 hover:bg-[#081a36] hover:shadow-sky-500/40 transition-all"
                  >
                    <span className="truncate">{cat.label}</span>
                    <span className="opacity-70 group-hover:opacity-100 text-lg">→</span>
                  </a>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
