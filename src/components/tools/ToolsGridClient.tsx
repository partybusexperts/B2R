"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";

export type ToolLite = { slug: string; name: string };

export default function ToolsGridClient({ tools }: { tools: ToolLite[] }) {
  // Always render 12 tiles; pad if fewer
  const items = useMemo(() => {
    const padCount = Math.max(0, 12 - tools.length);
    const padded = [
      ...tools,
      ...Array.from({ length: padCount }, (_, i) => ({
        slug: `coming-soon-${i + 1}`,
        name: `Coming Soon ${i + 1}`,
      })),
    ];
    return padded.slice(0, 12);
  }, [tools]);

  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const active = items.find((t) => t.slug === openSlug) || null;
  const copy = active ? featureCopyFor(active.slug, active.name) : null;

  const close = useCallback(() => setOpenSlug(null), []);

  // close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <>
  {/* Bigger cards; 3 columns on lg to align with the 3 poll columns vibe */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((t) => {
          const coming = t.slug.startsWith("coming-soon");
          return (
            <button
              key={t.slug}
              onClick={() => setOpenSlug(t.slug)}
              className="group rounded-2xl border border-white/10 bg-white/5 p-5 lg:p-6 text-left hover:bg-white/10 transition focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
                  {emojiFor(t.slug)}
                </div>
                <div className="min-w-0">
                  <div className="text-lg font-semibold truncate">{t.name}</div>
                  <div className="text-xs text-white/60 truncate">
                    {coming ? "Coming soon" : "Tap to learn more"}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Modal */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/60" onClick={close} />

          <div
            className="relative z-10 w-full max-w-md rounded-2xl border border-white/10
                       bg-neutral-900 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 p-4 sm:p-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-base">
                  {emojiFor(active.slug)}
                </div>
                <h3 className="font-semibold text-base sm:text-lg">{active.name}</h3>
              </div>
              <button
                onClick={close}
                className="rounded-lg px-2 py-1 text-sm bg-white/10 hover:bg-white/15"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Body (boxed text) */}
            <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto">
              <div className="space-y-3">
                <p className="text-[15px] leading-6 text-white/90 font-medium">
                  {copy?.headline}
                </p>
                <p className="text-sm leading-6 text-white/80">{copy?.summary}</p>
                {copy?.bullets?.length ? (
                  <ul className="mt-1 space-y-1.5 text-sm text-white/85">
                    {copy.bullets.map((b, i) => (
                      <li key={i} className="flex gap-2">
                        <span aria-hidden>•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 p-4 sm:p-5 border-t border-white/10">
              <span className="inline-flex items-center gap-2 text-xs rounded-full bg-white/10 px-2.5 py-1">
                🚧 Coming soon
              </span>
              <button
                onClick={close}
                className="rounded-xl bg-white/20 hover:bg-white/30 px-3 py-1.5 text-sm"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function emojiFor(slug: string) {
  if (slug.includes("airport")) return "✈️";
  if (slug.includes("map")) return "🗺️";
  if (slug.includes("trip") || slug.includes("travel")) return "🧭";
  if (slug.includes("event")) return "🎟️";
  if (slug.includes("weather")) return "🌤️";
  return "🛠️";
}

function featureCopyFor(slug: string, name: string): {
  headline: string;
  summary: string;
  bullets: string[];
} {
  const s = slug.toLowerCase();

  // AIRPORT
  if (s.includes("airport")) {
    return {
      headline: "Find the right airport in seconds.",
      summary:
        "Search by city or code and instantly see nearby airports with quick distance and time hints.",
      bullets: [
        "Search by City, IATA, or ICAO code",
        "Nearest airports with distance & rough drive time",
        "Basic airport details at a glance",
        "One-tap copy of codes for trip planning",
      ],
    };
  }

  // WEATHER
  if (s.includes("weather")) {
    return {
      headline: "Fast checks on local weather.",
      summary:
        "Get current conditions and quick forecasts without leaving the page.",
      bullets: [
        "Current temp, wind, and precipitation",
        "Next-hours snapshot for quick decisions",
        "Simple 5-day glance",
        "City or ZIP search",
      ],
    };
  }

  // MAPS / ROUTES / TRAVEL / TRIP
  if (/(map|route|travel|trip|directions)/.test(s)) {
    return {
      headline: "Simple routes, no fuss.",
      summary:
        "Plug in two spots and get time estimates and a clean route overview.",
      bullets: [
        "Fast ETA by car",
        "Multiple route options when available",
        "Landmark search & quick add",
        "One-tap shareable summary",
      ],
    };
  }

  // EVENTS / TICKETS
  if (/(event|ticket|concert|show)/.test(s)) {
    return {
      headline: "Find events worth going to.",
      summary:
        "A tidy feed of shows and events with quick filters and open-in-maps.",
      bullets: [
        "Date & category filters",
        "Distance and venue basics",
        "Save favorites for later",
        "One-tap map directions",
      ],
    };
  }

  // RESTAURANTS / FOOD / DINING
  if (/(food|restaurant|dining|eat)/.test(s)) {
    return {
      headline: "Pick a place to eat, fast.",
      summary: "Scan nearby spots with practical details and quick directions.",
      bullets: [
        "Cuisine & price filters",
        "Open now / hours info",
        "Distance and quick call",
        "One-tap route in maps",
      ],
    };
  }

  // HOTELS / STAY / LODGING
  if (/(hotel|stay|lodg)/.test(s)) {
    return {
      headline: "Skim hotels without the clutter.",
      summary: "See location, basics, and availability hints in a clean list.",
      bullets: [
        "Map-friendly addresses",
        "Basic amenities at a glance",
        "Price range indicator",
        "Quick links to book",
      ],
    };
  }

  // FLIGHTS / AIRFARE
  if (/(flight|airfare)/.test(s)) {
    return {
      headline: "Quick flight checks.",
      summary: "Rough price hints and time windows to help you plan faster.",
      bullets: [
        "One-way / round-trip toggles",
        "Flexible date windows",
        "Price-range snapshots",
        "Copy-ready trip summary",
      ],
    };
  }

  // TRAFFIC / ROADS / COMMUTE
  if (/(traffic|road|commute)/.test(s)) {
    return {
      headline: "Know before you go.",
      summary: "A quick read on delays so you can pick the smarter route.",
      bullets: [
        "Live slowdowns & incidents",
        "Alternate route suggestions",
        "Time-of-day trends",
        "Share travel ETA",
      ],
    };
  }

  // PARKING
  if (/(park|parking)/.test(s)) {
    return {
      headline: "Parking made practical.",
      summary: "Find lots and street options with simple rules and time hints.",
      bullets: [
        "Nearby lots & garages",
        "Street rules cheat sheet",
        "Price/time estimates",
        "One-tap walking route",
      ],
    };
  }

  // SPORTS
  if (/(sport|game|score|team|league)/.test(s)) {
    return {
      headline: "Catch the scores you care about.",
      summary: "Fast scores and schedules in a clean layout.",
      bullets: [
        "Live scores & finals",
        "Upcoming games",
        "Follow your teams",
        "Compact standings view",
      ],
    };
  }

  // NEWS
  if (/(news|headline|local)/.test(s)) {
    return {
      headline: "Skim the news, skip the noise.",
      summary: "A tidy rundown of key stories with quick read-time hints.",
      bullets: [
        "Top stories by topic",
        "Local highlights",
        "Save to read later",
        "Share a one-line summary",
      ],
    };
  }

  // DEALS / COUPONS / PROMOS
  if (/(deal|coupon|promo|discount|sale)/.test(s)) {
    return {
      headline: "Find a deal without digging.",
      summary: "Pulls quick offers worth trying right now.",
      bullets: [
        "Nearby & online finds",
        "Category filters",
        "Expire-soon alerts",
        "One-tap apply/copy",
      ],
    };
  }

  // JOBS / CAREERS
  if (/(job|career|hiring|role)/.test(s)) {
    return {
      headline: "Spot roles that fit.",
      summary: "Quick search with sane filters and clear requirements.",
      bullets: [
        "Title, pay, and location filters",
        "Remote/on-site toggle",
        "Save interesting roles",
        "Open company page fast",
      ],
    };
  }

  // GENERIC FALLBACK
  return {
    headline: `${name}: quick, useful, and simple.`,
    summary:
      "This tool will open as a focused, guided experience with just the details you need.",
    bullets: [
      "Clean, mobile-friendly layout",
      "Fast search & clear results",
      "Handy actions (share, copy, open in maps)",
      "No clutter — just what matters",
    ],
  };
}
