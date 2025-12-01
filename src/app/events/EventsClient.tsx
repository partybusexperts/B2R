"use client";

import React, { useEffect, useMemo, useState } from "react";
import { eventDetails as fallbackEventDetails } from "./eventDetails";
import { getCategoryImages } from "../../utils/optimizedImages";
import EventCard from "../../components/events/EventCard";

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
      const found = optimizedEventImages.find((e) =>
        e.original.toLowerCase().includes(t)
      );
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
        <h4 className="text-xl font-extrabold text-white mb-1 tracking-tight font-serif">
          {title}
        </h4>
        <p className="text-blue-100/90 leading-relaxed text-sm md:text-base">
          {body}
        </p>
      </div>
      {cta && (
        <a
          href={cta.href}
          className="inline-flex items-center justify-center rounded-full px-6 py-2 font-bold text-sm bg-white text-blue-900 hover:bg-blue-50 border border-blue-100 shadow"
        >
          {cta.label} →
        </a>
      )}
    </div>
  );
}

export default function EventsClient() {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [query, setQuery] = useState("");
  const [events, setEvents] = useState<typeof fallbackEventDetails>(fallbackEventDetails);

  useEffect(() => {
    let mounted = true;
    const ac = new AbortController();
    const timeoutMs = 2500;
    const to = setTimeout(() => ac.abort(), timeoutMs);

    async function load(off = 0) {
      try {
        const res = await fetch(`/api/events?limit=250&offset=${off}`, { signal: ac.signal });
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

  return (
    <>
      <div className="w-full bg-[#122a56] py-12 px-3 md:px-6">
        <div className="w-full max-w-7xl mx-auto">
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-3 mb-10">
            <label htmlFor="event-search" className="text-blue-100 font-semibold whitespace-nowrap">
              Jump to an event:
            </label>

            <input
              "use client";

              import EventsExplorer from "../../components/events/EventsExplorer";

              export default function EventsClient() {
                return <EventsExplorer />;
              }
            <select
