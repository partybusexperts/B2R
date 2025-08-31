"use client";

import React, { useMemo, useState } from "react";
import { getCategoryImages, toImageObject, findByFileName } from "../../utils/optimizedImages";
import { resolveVehicles } from "../../data/vehicles";
import VehicleGalleryCard from "../../components/VehicleGalleryCard";
import StructuredData from "../../components/StructuredData";
import OptimizedImage from "../../components/OptimizedImage";
import { SmartImage } from "../../components/SmartImage";
import ToolsGrid from "../../components/tools/ToolsGrid";
import HomePolls from "../../components/HomePolls";


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

  /* ---------------- PARTY FEATURES ---------------- */
  type Feature = { label: string; icon: string; description: string };
  const PARTY_FEATURES: Feature[] = [
    { label: "Loud Sound Systems", icon: "f3b5", description: "High-quality speakers and Bluetooth hookups to keep the party going." },
    { label: "Flexible Layouts", icon: "f4cb", description: "Seating and standing areas configurable for dancing, coolers, and socializing." },
    { label: "Large Capacities", icon: "f465", description: "Comfortable options from small private buses to 40+ passenger party rigs." },
    { label: "On-Board Amenities", icon: "f37b", description: "Coolers, lighting, and privacy windows make for a great atmosphere." },
    { label: "Durable Flooring & Safety", icon: "f6a7", description: "Robust interiors and trained drivers keep your group safe and comfortable." },
    { label: "Photo-Ready", icon: "f4f7", description: "Roomy spaces and lighting perfect for group photos and videos." },
  ];

  const REVIEWS = [
    { name: "Alex R.", text: "Perfect for our bachelorette weekend—driver was great and the van had everything we needed." },
    { name: "Samantha K.", text: "Spacious and clean. The lighting made the night feel special." },
    { name: "Jorge M.", text: "Booked a 30p for our company event. Everyone loved it and the booking was smooth." },
  ];

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

      

      {/* ---------- WHY PARTY BUSES ROCK ---------- */}
      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-2 text-white font-serif tracking-tight">Why Party Buses Rock</h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-8">Everything you need for a great group night—sound, space, and style.</p>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PARTY_FEATURES.map((f) => (
            <li key={f.label} className="relative">
              <div className="group block bg-[#12244e] rounded-2xl shadow border border-blue-800/30 px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-9 h-9 rounded-full bg-blue-900/20 border border-blue-700/40 flex items-center justify-center text-xl">
                    {f.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-lg mb-0.5">{f.label}</div>
                    <div className="text-blue-200 text-sm">{f.description}</div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- REVIEWS ---------- */}
      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-white font-serif tracking-tight">Customer Reviews</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((review, i) => (
            <div key={i} className="relative bg-[#12244e] border border-blue-800/30 rounded-2xl shadow-xl p-7 flex flex-col gap-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-600 rounded-full w-11 h-11 flex items-center justify-center text-2xl font-bold text-white shadow-lg border border-blue-300/30">{review.name[0]}</div>
                <span className="font-bold text-blue-50 text-lg">{review.name}</span>
                <span className="ml-auto text-yellow-300 text-xl">★★★★★</span>
              </div>
              <div className="text-blue-50 text-base leading-relaxed font-medium">{review.text}</div>
            </div>
          ))}
        </div>
      </section>

      

      {/* ---------- PARTY & COACH PROMO ---------- */}
      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-white font-serif tracking-tight">We Also Have Limousines & Coach Buses</h2>
        <p className="text-blue-100 text-center max-w-3xl mx-auto mb-8">Need something different? Explore limousines for elegant arrivals—or go with a coach for simple, comfy transport.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="/limousines" className="group">
            <div className="rounded-2xl border border-blue-800/30 bg-[#12244e] overflow-hidden shadow-xl">
              <div className="h-96 w-full bg-[#173264]">
                {(() => { const p = getCategoryImages("limousines")[0]; return p ? <OptimizedImage entry={p} alt="Limousine" className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform" /> : <div className="text-blue-100/80 flex items-center justify-center h-full">Limousine</div>; })()}
              </div>
              <div className="px-6 py-5">
                <h3 className="text-2xl font-extrabold text-white text-center">Limousines</h3>
                <p className="text-blue-200 text-center">Classic stretch limos for smaller, stylish groups.</p>
              </div>
            </div>
          </a>
          <a href="/coaches" className="group">
            <div className="rounded-2xl border border-blue-800/30 bg-[#12244e] overflow-hidden shadow-xl">
              <div className="h-96 w-full bg-[#173264]">
                {(() => { const c = getCategoryImages("coachBuses")[0]; return c ? <OptimizedImage entry={c} alt="Coach Bus" className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform" /> : <div className="text-blue-100/80 flex items-center justify-center h-full">Coach Bus</div>; })()}
              </div>
              <div className="px-6 py-5">
                <h3 className="text-2xl font-extrabold text-white text-center">Coach Buses</h3>
                <p className="text-blue-200 text-center">Comfortable seating for large groups.</p>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* ---------- HOW IT WORKS (CSS-only modals) ---------- */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 my-12">
        <div className="bg-[#122a56] border border-blue-800/30 rounded-3xl shadow-xl px-5 md:px-8 py-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white font-serif tracking-tight">How the Bus2Ride Booking Process Works</h2>

          <div className="mt-8 flex flex-col md:flex-row gap-4 md:gap-6 justify-between">
            {[
              { step: "\u26051", label: "Contact Us", icon: "\ud83d\udcde", href: "/contact" },
              { step: "\u26052", label: "Get a Quote", icon: "\ud83d\udcac", href: "/quote#instant" },
              { step: "\u26053", label: "Reserve Your Ride", icon: "\ud83d\udcdd", href: "/reserve" },
              { step: "\u26054", label: "Finalize & Ride", icon: "\ud83c\udf89", href: "/itinerary" },
            ].map((s, idx) => (
              <div key={s.step} className="relative flex-1">
                <input id={`howit-${idx}`} type="checkbox" className="peer sr-only" aria-hidden="true" />
                <label htmlFor={`howit-${idx}`} role="button" tabIndex={0} className="block cursor-pointer group bg-[#173264] border border-blue-800/40 rounded-2xl px-5 py-6 text-center hover:border-blue-400/60 hover:shadow-[0_0_0_2px_rgba(96,165,250,.25)] transition" aria-label={`Open details for: ${s.label}`}>
                  <div className="text-2xl">{s.icon}</div>
                  <div className="font-extrabold text-white mt-1">{s.step}. {s.label}</div>
                  <div className="mt-1 text-blue-200 text-sm opacity-90 group-hover:opacity-100">Click to continue →</div>
                </label>

                <div className="hidden peer-checked:flex fixed inset-0 z-50 items-center justify-center p-4">
                  <label htmlFor={`howit-${idx}`} className="absolute inset-0 bg-black/40 cursor-pointer" aria-label="Close" />
                  <div className="relative z-10 w-full max-w-lg bg-gradient-to-br from-[#13306a] to-[#0e2250] border border-blue-800/40 rounded-2xl shadow-2xl">
                    <label htmlFor={`howit-${idx}`} className="absolute top-3 right-3 text-blue-100 hover:text-white text-2xl font-bold cursor-pointer" aria-label="Close">×</label>
                    <div className="px-6 py-7 text-left">
                      <div className="mx-auto w-14 h-14 rounded-full bg-blue-900/20 border border-blue-700/40 flex items-center justify-center text-3xl mb-4">{s.icon}</div>
                      <h3 className="text-2xl font-extrabold text-white mb-2 font-serif tracking-tight">{s.step}. {s.label}</h3>
                      <div className="text-blue-100/90">
                        <p className="mb-3">{s.label === "Contact Us" ? `Call or email our bookings team — we’re ready to help you plan the perfect trip.` : ''}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                  {/* Server-side fallback for non-JS / SEO: ensure the initial HTML includes the event image if available */}
                  <noscript>
                    <img src={ev.fallback} alt={ev.title} className="w-full h-full object-cover" />
                  </noscript>
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

      {/* POLLS: canonical HomePolls with inner scroll to match Polls page */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 my-12">
        <div className="bg-[#122a56] border border-blue-800/30 rounded-3xl shadow-xl px-6 md:px-8 py-10">
          <h2 className="text-3xl font-extrabold text-center text-white font-serif tracking-tight mb-3">Community Polls</h2>
          <p className="text-blue-200 text-center max-w-3xl mx-auto mb-6">See what riders are saying about party buses, pricing, and trip planning. Vote or view results on the polls page.</p>

          <div className="mb-6">
            <HomePolls pickSize={150} visiblePerGroup={50} innerScroll={true} innerScrollClass="max-h-[48vh] overflow-y-auto no-scrollbar p-2 -mr-2" />
          </div>

          <div className="flex justify-center mt-6">
            <a href="/polls" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-2xl shadow transition border border-blue-700">More Polls</a>
          </div>
        </div>
      </section>

  {/* ToolsGrid handles modal display */}
    </main>
  );
}
