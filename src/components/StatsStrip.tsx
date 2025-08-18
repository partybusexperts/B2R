"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export interface StatsStripProps {
  /** Optional: show a Service Area card with these cities as chips. */
  cities?: string[];
  /** Fleet text (default: "25+ party buses") */
  fleetText?: string;
  /** Capacity text (default: "Up to 56 passengers") */
  capacityText?: string;
  /** Number of chips to show before “Show more” (default: 12) */
  maxChips?: number;
  /** Optional: custom search handler. Receives the raw query string. */
  onSearch?: (query: string) => void;
}

/** Optional export: Phoenix ~30mi list (use if you want) */
export const PHOENIX_30MI_CITIES = [
  "Phoenix","Scottsdale","Tempe","Mesa","Chandler","Gilbert","Glendale","Peoria",
  "Avondale","Goodyear","Surprise","Tolleson","Litchfield Park","Paradise Valley",
  "Fountain Hills","Sun City","Sun City West","Youngtown","El Mirage","Guadalupe",
  "Cave Creek","Carefree","Queen Creek","Buckeye"
];

export default function StatsStrip({
  cities,
  fleetText = "25+ party buses",
  capacityText = "Up to 56 passengers",
  maxChips = 12,
  onSearch,
}: StatsStripProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [err, setErr] = useState("");

  const hasCities = Array.isArray(cities) && cities.length > 0;
  const shown = hasCities ? (expanded ? cities! : cities!.slice(0, maxChips)) : [];
  const gridCols = hasCities ? "sm:grid-cols-3" : "sm:grid-cols-2";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      setErr("Enter a city or ZIP");
      return;
    }
    setErr("");
    if (onSearch) {
      onSearch(q);
    } else {
      // Default: send to your quote page (adjust path if needed)
      router.push(`/quote?location=${encodeURIComponent(q)}`);
    }
  };

  return (
    <section className="w-full">
      <div className={`grid grid-cols-1 ${gridCols} gap-3`}>
        {/* Fleet */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-2xl" aria-hidden="true">🚍</div>
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
              Fleet
            </div>
            <div className="text-base md:text-lg font-bold text-slate-900">
              {fleetText}
            </div>
          </div>
        </div>

        {/* Capacity */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-2xl" aria-hidden="true">👥</div>
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
              Max Capacity
            </div>
            <div className="text-base md:text-lg font-bold text-slate-900">
              {capacityText}
            </div>
          </div>
        </div>

        {/* Service Area (only if cities provided) */}
        {hasCities && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="text-2xl" aria-hidden="true">🌆</div>
              <div className="flex-1">
                <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                  Service Area
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {shown.map((city) => (
                    <span
                      key={city}
                      className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                    >
                      {city}
                    </span>
                  ))}
                  {cities!.length > maxChips && (
                    <button
                      type="button"
                      onClick={() => setExpanded((v) => !v)}
                      className="inline-flex items-center rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                      aria-expanded={expanded}
                    >
                      {expanded ? "Show less" : `+${cities!.length - maxChips} more`}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Callout + Search */}
      <div className="mt-4 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-teal-50 p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm md:text-base font-semibold text-slate-900">
            For a more accurate quote, enter your <span className="underline decoration-blue-300">city or ZIP</span> to see the most up-to-date vehicles and photos.
          </p>
          <form onSubmit={submit} className="flex w-full md:w-auto items-center gap-2">
            <label htmlFor="location" className="sr-only">City or ZIP</label>
            <input
              id="location"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Scottsdale or 85004"
              autoComplete="off"
              className="w-full md:w-80 rounded-xl border-2 border-blue-400 bg-white px-5 py-4 text-lg font-semibold text-slate-900 placeholder:text-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-700 shadow-lg transition"
              style={{ boxShadow: '0 2px 16px 0 rgba(30, 64, 175, 0.10)' }}
            />
            <button
              type="submit"
              className="rounded-xl bg-blue-700 px-7 py-4 text-lg font-bold text-white shadow-lg hover:bg-blue-800 transition border-2 border-blue-700"
              style={{ letterSpacing: '0.03em' }}
            >
              Search
            </button>
          </form>
        </div>
        {err && <div className="mt-2 text-xs font-semibold text-red-600">{err}</div>}
      </div>
    </section>
  );
}
