"use client";

import React, { useEffect, useMemo, useState, useId } from "react";
import EventCard from "../events/EventCard";
import { eventDetails as fallbackEventDetails } from "../../app/events/eventDetails";
import { getCategoryImages } from "../../utils/optimizedImages";

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

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

type EventDetail = (typeof fallbackEventDetails)[number];

export default function EventsShowcaseGrid({ limit = 6 }: { limit?: number }) {
  const [events, setEvents] = useState<EventDetail[]>(fallbackEventDetails.slice(0, limit));
  const [query, setQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");

  useEffect(() => {
    let mounted = true;
    const ac = new AbortController();

    async function load() {
      try {
        const params = new URLSearchParams();
        params.set("limit", String(limit));
        const res = await fetch(`/api/events?${params.toString()}`, { signal: ac.signal });
        if (!res.ok) throw new Error(`API ${res.status}`);
        const json = await res.json();
        if (mounted && json?.ok && Array.isArray(json.data) && json.data.length > 0) {
          setEvents(json.data);
        }
      } catch (err) {
        if ((err as any)?.name !== "AbortError") {
          console.debug("EventsShowcaseGrid fallback", err instanceof Error ? err.message : err);
        }
      }
    }

    load();
    return () => {
      mounted = false;
      ac.abort();
    };
  }, [limit]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? events.filter((e) => e.name.toLowerCase().includes(q)) : events;
    return list;
  }, [query, events]);

  const visible = filtered.slice(0, limit);
  const controlsId = useId();

  function handleGo() {
    if (selectedEvent) {
      window.location.href = selectedEvent;
      return;
    }
    if (filtered.length > 0) {
      const fallback = filtered[0];
      const href = fallback.href || `/events/${slugify(fallback.name)}`;
      window.location.href = href;
    }
  }

  return (
    <>
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-3 mb-10">
        <label
          htmlFor={`${controlsId}-search`}
          className="text-blue-100 font-semibold whitespace-nowrap"
        >
          Jump to an event:
        </label>
        <input
          id={`${controlsId}-search`}
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
          {filtered.slice(0, 50).map((event) => (
            <option key={event.name} value={event.href || `/events/${slugify(event.name)}`}>
              {event.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleGo}
          className="rounded-full font-bold px-6 py-2 text-base shadow-lg transition border flex items-center justify-center bg-blue-600 text-white border-blue-700 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!filtered.length}
        >
          Go
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {visible.map((event, i) => {
          const href = event.href || `/events/${slugify(event.name)}`;
          return (
            <EventCard
              key={event.name}
              name={event.name}
              description={event.description}
              href={href}
              imageSrc={pickImageForEvent(event.name, i)}
              slug={slugify(event.name)}
            />
          );
        })}
      </div>
      <div className="mt-10 text-center">
        <a
          href="/events"
          className="inline-flex items-center justify-center rounded-full px-8 py-3 text-base font-bold text-white bg-blue-600 border border-blue-500 shadow-lg hover:bg-blue-500 active:translate-y-[1px]"
        >
          More events
        </a>
      </div>
    </>
  );
}
