"use client";

import React, { useMemo, useState } from "react";
import { getCategoryImages, toImageObject, findByFileName } from "../../utils/optimizedImages";
import { resolveVehicles } from "../../data/vehicles";
import VehicleGalleryCard from "../../components/VehicleGalleryCard";
import StructuredData from "../../components/StructuredData";
import OptimizedImage from "../../components/OptimizedImage";
import { SmartImage } from "../../components/SmartImage";
import ToolsGrid from "../../components/tools/ToolsGrid";


const PHONE_DISPLAY = "(888) 535-2566";
const PHONE_TEL = "8885352566";
const EMAIL = "info@bus2ride.com";

// tools are now provided by the shared registry (ToolsGrid)

const POPULAR_EVENT_TITLES = [
  "Weddings",
  "Proms",
  "Birthday Parties",
  "Concerts",
  "Sporting Events",
  "Bachelorette Parties",
  "Bachelor Parties",
  "Night Out on the Town",
  "Wine Tours",
  "Brewery Tours",
  "Corporate Events",
  "Quinceañeras",
];

const EVENT_IMAGES = [
  "/images/party-buses/18 Passenger White Party Bus Exterior.png",
  "/images/party-buses/18 Passenger White Party Bus Interior.png",
  "/images/party-buses/20 Passenger Party Bus Exterior.png",
  "/images/party-buses/24 Passenger Party Bus Exterior.jpg",
  "/images/party-buses/30 Passenger Party Bus Exterior.png",
  "/images/party-buses/36 Passenger Party Bus Inside.png",
  "/images/party-buses/17 Passenger Black Party Bus Exterior.png",
  "/images/party-buses/18 Passenger Party Bus Interior 2.png",
];

// Prefer event-specific images when available in public/images/events
const EVENTS_IMAGES_MAP: Record<string, string> = {
  Weddings: "/images/events/weddings.jpg",
  Proms: "/images/events/prom.jpg",
  "Birthday Parties": "/images/events/birthday parties.jpg",
  Concerts: "/images/events/concerts.jpg",
  "Sporting Events": "/images/events/sporting events.jpg",
  "Bachelorette Parties": "/images/events/bachelorette parties.jpg",
  "Bachelor Parties": "/images/events/bachelor parties.jpg",
  "Night Out on the Town": "/images/events/girls nights out.jpg",
  "Wine Tours": "/images/events/brewery tours.jpg",
  "Brewery Tours": "/images/events/brewery tours.jpg",
  "Corporate Events": "/images/events/corporate parties.jpg",
  Quinceañeras: "/images/events/quinceanera parties.jpg",
};

const eventBlurb = (title: string) => `Perfect for ${title.toLowerCase()}—on-time pickups, clean rides, and a vibe your group will love.`;

export default function PartyBusesPage() {
  // toolSearch removed; ToolsGrid manages its own state
  const [eventSearch, setEventSearch] = useState("");

  const partyOptimized = useMemo(() => getCategoryImages("partyBuses"), []);

  const catalogPartyBuses = useMemo(() => {
    return resolveVehicles(findByFileName)
      .filter((v) => v.category === "party-buses")
      .sort((a, b) => (a.capacityMax ?? 0) - (b.capacityMax ?? 0));
  }, []);

  const eventsWithImages = useMemo(() => {
    const len = partyOptimized.length || 0;
    return POPULAR_EVENT_TITLES.map((title, i) => ({
      title,
      desc: eventBlurb(title),
  optimizedEntries: len ? [partyOptimized[i % len], partyOptimized[(i + 1) % len], partyOptimized[(i + 2) % len]] : undefined,
  // use event-specific image if present, otherwise fallback to party bus shots
  fallback: EVENTS_IMAGES_MAP[title] ?? EVENT_IMAGES[i % EVENT_IMAGES.length],
    }));
  }, [partyOptimized]);

  const filteredEvents = useMemo(() => {
    const q = eventSearch.trim().toLowerCase();
    if (!q) return eventsWithImages;
    return eventsWithImages.filter((e) => e.title.toLowerCase().includes(q) || e.desc.toLowerCase().includes(q));
  }, [eventSearch, eventsWithImages]);

  // tool filtering and modal handlers removed — ToolsGrid handles them

  return (
    <main className="text-slate-100 bg-[#0f1f46]">
      <StructuredData
        id="party-buses-schema"
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Party Bus Fleet',
          description: 'Browse party bus vehicles for groups, from small to large capacity.',
          mainEntity: catalogPartyBuses.slice(0, 12).map((v) => ({
            '@type': 'Product',
            name: v.name,
            description: (v.highlights || []).join(', '),
            additionalProperty: [{ '@type': 'PropertyValue', name: 'Capacity', value: v.capacityMax }],
            offers: { '@type': 'Offer', availability: 'https://schema.org/InStock', priceCurrency: 'USD' },
            image: v.images.map((i) => i.entry?.original).filter(Boolean),
          })),
          image: partyOptimized.slice(0, 6).map(toImageObject),
        }}
      />

      <section className="bg-[#122a56] pt-8 pb-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white font-serif tracking-tight">Pick Your Party Bus</h2>
          <p className="text-blue-100/90 text-center max-w-3xl mx-auto mt-3 mb-10">From minis to mega buses—clean, comfy, and ready for your group.</p>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {catalogPartyBuses.map((v) => (
              <VehicleGalleryCard key={v.id} vehicle={v} />
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 my-12 pb-12">
        <div className="bg-[#122a56] border border-blue-800/30 rounded-3xl shadow-xl px-6 md:px-8 py-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white font-serif tracking-tight mb-3">Events We Love Rolling To</h2>
          <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-6">From milestone moments to big-night blowouts—book the perfect ride for your event.</p>

          <div className="w-full flex justify-center mb-8">
            <input type="text" placeholder="Search events…" value={eventSearch} onChange={(e) => setEventSearch(e.target.value)} className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((ev) => (
              <div key={ev.title} className="relative rounded-2xl overflow-hidden border border-blue-800/30 shadow-lg bg-[#173264] flex flex-col">
                <div className="h-60 md:h-72 w-full relative">
                  {/* Prefer an actual event photo (public/images/events) when available. If not, fall back to optimized vehicle images, then to the generic fallback. */}
                  {ev.fallback && String(ev.fallback).startsWith("/images/events/") ? (
                    <SmartImage src={ev.fallback} alt={ev.title} className="w-full h-full object-cover" />
                  ) : ev.optimizedEntries && ev.optimizedEntries.length ? (
                    <OptimizedImage entry={ev.optimizedEntries[0]} alt={ev.title} className="w-full h-full object-cover" fillParent priorityIfAbove={2000} sizesOverride="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" minDesiredWidth={900} />
                  ) : (
                    <SmartImage src={ev.fallback} alt={ev.title} className="w-full h-full object-cover" />
                  )}
                </div>

                <div className="absolute inset-x-0 top-0 p-5 bg-gradient-to-b from-black/35 via-black/20 to-transparent pointer-events-none">
                  <div className="text-2xl font-extrabold text-white drop-shadow">{ev.title}</div>
                  <div className="text-blue-100 text-sm mt-1">{ev.desc}</div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-bold bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 transition" aria-label={`Call ${PHONE_DISPLAY}`}>{PHONE_DISPLAY}</a>
                    <a href={`mailto:${EMAIL}`} className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-bold bg-blue-800 text-white hover:bg-blue-900 border border-blue-900 transition">Email Now</a>
                  </div>

                  {ev.optimizedEntries && (
                    <div className="flex gap-2 overflow-x-auto py-2">
                      {ev.optimizedEntries.map((entry, idx) => (
                        <div key={idx} className="flex-shrink-0 w-24 h-14 rounded overflow-hidden border border-blue-800/40">
                          <OptimizedImage entry={entry} alt={`${ev.title} ${idx + 1}`} className="w-full h-full object-cover" minDesiredWidth={200} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <a href="/events" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700">More Event Ideas</a>
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 my-12">
        <div className="bg-[#122a56] border border-blue-800/30 rounded-3xl shadow-xl px-6 md:px-8 py-10">
          <h2 className="text-3xl font-extrabold text-center text-white font-serif tracking-tight mb-3">Planning Tools</h2>
          <p className="text-blue-200 text-center max-w-3xl mx-auto mb-6">Client-side utilities to plan budgets, BYOB, stops, and group sizes.</p>

          <div className="mb-6">
            <ToolsGrid limit={4} randomize={true} />
          </div>
        </div>
      </section>

  {/* ToolsGrid handles modal display */}
    </main>
  );
}
