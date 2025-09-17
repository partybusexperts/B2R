"use client";
import React, { useEffect, useMemo, useState } from "react";
import SmartImage from "./SmartImage";
import { eventDetails as fallbackEventDetails } from "../app/events/eventDetails";
import { getCategoryImages } from "../utils/optimizedImages";

const PHONE_DISPLAY = "(888) 535-2566";
const PHONE_TEL = "8885352566";
const EMAIL = "info@bus2ride.com";

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

const CTA = {
  base:
    "inline-flex items-center justify-center rounded-full font-bold text-sm tracking-tight shadow-md transition border min-w-[160px] h-10 px-5 active:translate-y-[1px]",
  primary:
    "bg-blue-600 text-white border-blue-700 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
  secondary: "bg-white text-blue-900 border-blue-200 hover:bg-blue-50",
  accent: "bg-blue-700 text-white border-blue-700 hover:bg-blue-800",
};

export default function EventsSection({ limit = 999, tag }: { limit?: number; tag?: string }){
  const [query, setQuery] = useState("");
  const [events, setEvents] = useState<typeof fallbackEventDetails>(fallbackEventDetails);

  useEffect(() => {
    let mounted = true;
    const ac = new AbortController();
    const timeoutMs = 2500; // short timeout so UI isn't blocked by slow API
    const to = setTimeout(() => ac.abort(), timeoutMs);

    async function load() {
      try {
        const params = new URLSearchParams();
        params.set('limit', String(limit));
        if (tag) params.set('tag', String(tag));
        const url = `/api/events?${params.toString()}`;
        const res = await fetch(url, { signal: ac.signal });
        clearTimeout(to);
        if (!res.ok) throw new Error(`API ${res.status}`);
        const json = await res.json();
        if (mounted && json?.ok && Array.isArray(json.data) && json.data.length > 0) {
          setEvents(json.data);
        }
      } catch (e) {
        // AbortError is expected when the API is slow — keep the local fallback
        const maybeName = (e as unknown) && typeof (e as any)?.name === 'string' ? (e as any).name : undefined;
        if (maybeName === 'AbortError') {
          console.debug('Events API request aborted (timeout), using fallback');
        } else {
          console.debug('Events API failed, using local fallback', e instanceof Error ? e.message : e);
        }
      }
    }
    load();
    return () => { mounted = false; ac.abort(); clearTimeout(to); };
  }, [tag, limit]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? events.filter((e) => e.name.toLowerCase().includes(q)) : events;
    return list.slice(0, limit);
  }, [query, events, limit]);

  return (
    <div className="w-full py-8 px-3 md:px-6">
      <div className="w-full max-w-7xl mx-auto">
        <div className="w-full flex items-center justify-between mb-6 gap-4">
          <h2 className="text-3xl font-extrabold font-serif">Events & Occasions</h2>
          <input
            placeholder="Search events…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-lg px-4 py-2 bg-[#f8fafc] text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[220px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filtered.map((event, i) => {
            const href = event.href || `/events/${slugify(event.name)}`;
            return (
              <a
                key={event.name}
                href={href}
                className="relative bg-white rounded-3xl border p-6 no-underline min-h-[380px] flex flex-col items-center shadow group hover:-translate-y-0.5 transition-transform"
              >
                <SmartImage
                  src={pickImageForEvent(event.name, i)}
                  alt={event.name}
                  className="rounded-2xl shadow-lg w-full h-56 object-cover object-center mb-4 border"
                />
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 font-serif text-center">
                  {event.name}
                </h3>
                <p className="text-base md:text-lg text-slate-700 text-center mb-6">
                  {event.description}
                </p>

                <div className="flex flex-row flex-wrap gap-2 justify-center items-center w-full mt-auto">
                  <a href="/quote#instant" className={`${CTA.base} ${CTA.primary}`}>
                    Quote
                  </a>
                  <a href={`tel:${PHONE_TEL}`} className={`${CTA.base} ${CTA.secondary}`}>
                    📞 {PHONE_DISPLAY}
                  </a>
                  <a href={`mailto:${EMAIL}`} className={`${CTA.base} ${CTA.primary}`}>
                    Email
                  </a>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
