"use client";

import React, { useEffect, useMemo, useState, useId } from "react";
import EventCard from "./EventCard";
import { eventDetails as fallbackEventDetails } from "../../app/events/eventDetails";
import { getCategoryImages } from "../../utils/optimizedImages";

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const optimizedEventImages = getCategoryImages("eventImages");
const legacyFallbacks = [
  "/images/party-buses/18 Passenger White Party Bus Exterior.png",
  "/images/party-buses/30 Passenger Party Bus Exterior.png",
  "/images/party-buses/36 Passenger Party Bus Inside.png",
];

function pickImageForEvent(name: string, idx: number) {
  if (optimizedEventImages && optimizedEventImages.length > 0) {
    const norm = slugify(name);
    const exact = optimizedEventImages.find(
      (e) =>
        e.original.toLowerCase().includes("/" + norm) ||
        e.original.toLowerCase().endsWith("/" + norm + ".webp") ||
        e.original.toLowerCase().includes(norm)
    );
    if (exact) return exact.original;
    const tokens = norm.split("-").filter(Boolean);
    for (const t of tokens) {
      const found = optimizedEventImages.find((e) => e.original.toLowerCase().includes(t));
      if (found) return found.original;
    }
    return optimizedEventImages[idx % optimizedEventImages.length].original;
  }
  return legacyFallbacks[idx % legacyFallbacks.length];
}

const INFO_BANNERS = [
  {
    title: "Wedding Timeline Tip",
    body:
      "Peak Saturday weddings book 6–12 months out. Build a 15 min photo buffer after the ceremony so transport never delays your reception entrance.",
    cta: { label: "Plan Wedding Shuttle", href: "/events/weddings" },
  },
  {
    title: "Prom & School Event Rules",
    body:
      "Most prom contracts require a no-alcohol clause, chaperone contact & fixed pickup list. Gather it early to speed dispatch approval.",
    cta: { label: "Prom Guidelines", href: "/events/prom" },
  },
  {
    title: "Concert / Festival Exit",
    body:
      "After big shows, rideshare zones jam for 30+ minutes. Set a meet point 1–2 blocks out & give the driver a pinned map screenshot ahead of time.",
    cta: { label: "Concert Transport Tips", href: "/events/concerts" },
  },
  {
    title: "Game Day Tailgate",
    body:
      "Stadium lots can freeze movement 45–60 min post-game. Add post-event buffer & early arrival if you’re unloading grills or tents.",
    cta: { label: "Game Day Planning", href: "/events/sporting-events" },
  },
];

const CTA = {
  base:
    "inline-flex items-center justify-center rounded-full font-bold text-sm tracking-tight shadow-md transition border min-w-[160px] h-10 px-5 active:translate-y-[1px]",
  primary:
    "bg-blue-600 text-white border-blue-700 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
};

function InfoBanner({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="sm:col-span-2 md:col-span-3 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-6 md:p-7 flex flex-col md:flex-row md:items-center gap-5 border border-blue-400/30 shadow-[0_6px_18px_-2px_rgba(0,0,0,.4)]">
      <div className="flex-1">
        <h4 className="text-xl font-extrabold text-white mb-1 tracking-tight font-serif">{title}</h4>
        <p className="text-blue-100/90 leading-relaxed text-sm md:text-base">{body}</p>
      </div>
      {cta && (
        <a
          href={cta.href}
          className={`${CTA.base} ${CTA.primary}`}
        >
          {cta.label} →
        </a>
      )}
    </div>
  );
}

type EventDetail = (typeof fallbackEventDetails)[number];

type EventsExplorerProps = {
  limit?: number;
  showInfoBanners?: boolean;
  showMoreButton?: boolean;
  showSchema?: boolean;
};

export default function EventsExplorer({
  limit,
  showInfoBanners = true,
  showMoreButton = false,
  showSchema = true,
}: EventsExplorerProps) {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [query, setQuery] = useState("");
  const [events, setEvents] = useState<EventDetail[]>(fallbackEventDetails);
  const controlId = useId();

  useEffect(() => {
    let mounted = true;
    const ac = new AbortController();
    const timeoutMs = 2500;
    const to = setTimeout(() => ac.abort(), timeoutMs);

    async function load() {
      try {
        const res = await fetch(`/api/events?limit=250`, { signal: ac.signal });
        clearTimeout(to);
        if (!res.ok) throw new Error(`API ${res.status}`);
        const json = await res.json();
        if (mounted && json?.ok && Array.isArray(json.data) && json.data.length > 0) {
          setEvents(json.data);
        }
      } catch (e) {
        if ((e as any)?.name === "AbortError") {
          console.debug("Events API initial load aborted (timeout), using fallback");
        } else {
          console.debug("Events API failed, using local fallback", e instanceof Error ? e.message : e);
        }
      }
    }

    load();
    return () => {
      mounted = false;
      ac.abort();
      clearTimeout(to);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? events.filter((e) => e.name.toLowerCase().includes(q)) : events;
  }, [query, events]);

  const visible = limit ? filtered.slice(0, limit) : filtered;

  const handleGo = () => {
    if (selectedEvent) {
      window.location.href = selectedEvent;
      return;
    }
    if (filtered.length > 0) {
      const e = filtered[0];
      window.location.href = e.href || `/events/${slugify(e.name)}`;
    }
  };

  const cards = visible.map((event, i) => {
    const href = event.href || `/events/${slugify(event.name)}`;
    const slug = slugify(event.name);
    const card = (
      <EventCard
        key={event.name}
        name={event.name}
        description={event.description}
        href={href}
        imageSrc={pickImageForEvent(event.name, i)}
        slug={slug}
      />
    );

    if (!showInfoBanners) return card;

    const needsBanner = (i + 1) % 6 === 0 && i !== visible.length - 1;
    if (!needsBanner) return card;
    const bannerIndex = Math.floor((i + 1) / 6 - 1) % INFO_BANNERS.length;
    const banner = INFO_BANNERS[bannerIndex];
    return (
      <React.Fragment key={`${event.name}-${i}`}>
        {card}
        <InfoBanner title={banner.title} body={banner.body} cta={banner.cta} />
      </React.Fragment>
    );
  });

  return (
    <div className="w-full bg-[#122a56] rounded-[40px] border border-blue-800/40 py-12 px-3 md:px-6 shadow-[0_60px_160px_rgba(2,6,23,0.65)]">
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-3 mb-10">
        <label htmlFor={`${controlId}-search`} className="text-blue-100 font-semibold whitespace-nowrap">
          Jump to an event:
        </label>
        <input
          id={`${controlId}-search`}
          placeholder="Search events..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded-lg px-4 py-2 bg-[#0f1f46] text-blue-50 border border-blue-800/40 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[240px]"
        />
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="rounded-lg px-4 py-2 bg-[#0f1f46] text-blue-50 border border-blue-800/40 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[240px]"
        >
          <option value="">Select an event...</option>
          {filtered.map((event) => (
            <option key={event.name} value={event.href || `/events/${slugify(event.name)}`}>
              {event.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="rounded-full font-bold px-6 py-2 text-base shadow-lg transition border flex items-center justify-center bg-blue-600 text-white border-blue-700 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleGo}
          disabled={!filtered.length}
        >
          Go
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.length ? cards : <p className="text-center text-blue-100 col-span-full">No events found.</p>}
      </div>

      {showMoreButton && (
        <div className="mt-10 text-center">
          <a
            href="/events"
            className="inline-flex items-center justify-center rounded-full px-8 py-3 text-base font-bold text-white bg-blue-600 border border-blue-500 shadow-lg hover:bg-blue-500 active:translate-y-[1px]"
          >
            More events
          </a>
        </div>
      )}

      {showSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: "Events & Occasions",
              itemListElement: filtered.map((e, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: e.name,
                url: e.href ?? `/events/${slugify(e.name)}`,
              })),
            }),
          }}
        />
      )}
    </div>
  );
}
