"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import { getCategoryImages, toImageObject, findByFileName } from "../../utils/optimizedImages";
import { resolveVehicles } from "../../data/vehicles";
import VehicleGalleryCard from "../../components/VehicleGalleryCard";
import StructuredData from "../../components/StructuredData";
import OptimizedImage from "../../components/OptimizedImage";
import { SmartImage } from "../../components/SmartImage";
import ToolsModal from "../../components/ToolsModal";

type Tool = { name: string; icon: string; desc: string; size: "sm" | "md" | "lg" };

const PHONE_DISPLAY = "(888) 535-2566";
const PHONE_TEL = "8885352566";
const EMAIL = "info@bus2ride.com";

const TOOL_LIST: Tool[] = [
  { name: "Per Person Splitter", icon: "🧮", desc: "Split total cost per person quickly.", size: "sm" },
  { name: "BYOB Pack & Ice Calculator", icon: "🥤", desc: "Estimate drinks and ice.", size: "md" },
  { name: "Seat Space Fit Advisor", icon: "🪑", desc: "Check seating fit for your group.", size: "sm" },
  { name: "Bar Hop Route Builder", icon: "🗺️", desc: "Plan efficient bar-hop routes.", size: "lg" },
  { name: "Vibe Selector", icon: "🎶", desc: "Pick a mood and playlist ideas.", size: "md" },
  { name: "Stop Timing Planner", icon: "⏱️", desc: "Plan stop durations and timing.", size: "md" },
];

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
  "/images/Bus-3.png",
  "/images/Bus-4.png",
  "/images/Bus-5.png",
  "/images/Bus-3.png",
  "/images/Bus-2.png",
  "/images/Bus-5.png",
  "/images/Bus-3.png",
  "/images/Bus-1.png",
];

const eventBlurb = (title: string) => `Perfect for ${title.toLowerCase()}—on-time pickups, clean rides, and a vibe your group will love.`;

export default function PartyBusesPage() {
  const [toolSearch, setToolSearch] = useState("");
  const [activeToolIdx, setActiveToolIdx] = useState<number | null>(null);
  const [eventSearch, setEventSearch] = useState("");

  const partyOptimized = useMemo(() => getCategoryImages("partyBuses"), []);

  const catalogPartyBuses = useMemo(
    () =>
      resolveVehicles(findByFileName)
        .filter((v) => v.category === "party-buses")
        .sort((a, b) => (a.capacityMax ?? 0) - (b.capacityMax ?? 0)),
    []
  );

  const eventsWithImages = useMemo(() => {
    const len = partyOptimized.length || 0;
    return POPULAR_EVENT_TITLES.map((title, i) => ({
      title,
      desc: eventBlurb(title),
      optimizedEntries: len ? [partyOptimized[i % len], partyOptimized[(i + 1) % len], partyOptimized[(i + 2) % len]] : undefined,
      fallback: EVENT_IMAGES[i % EVENT_IMAGES.length],
    }));
  }, [partyOptimized]);

  const filteredEvents = useMemo(() => {
    const q = eventSearch.trim().toLowerCase();
    if (!q) return eventsWithImages;
    return eventsWithImages.filter((e) => e.title.toLowerCase().includes(q) || e.desc.toLowerCase().includes(q));
  }, [eventSearch, eventsWithImages]);

  const filteredTools = useMemo(
    () => TOOL_LIST.filter((t) => t.name.toLowerCase().includes(toolSearch.toLowerCase()) || t.desc.toLowerCase().includes(toolSearch.toLowerCase())),
    [toolSearch]
  );

  const closeModal = useCallback(() => setActiveToolIdx(null), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActiveToolIdx(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
                  {ev.optimizedEntries && ev.optimizedEntries.length ? (
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
                    <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-bold bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 transition">{PHONE_DISPLAY}</a>
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

      {activeToolIdx !== null && <ToolsModal activeToolIdx={activeToolIdx} toolList={TOOL_LIST} onClose={closeModal} />}
    </main>
  );
}
"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import { getCategoryImages, toImageObject, findByFileName } from "../../utils/optimizedImages";
import { resolveVehicles } from "../../data/vehicles";
import VehicleGalleryCard from "../../components/VehicleGalleryCard";
import StructuredData from "../../components/StructuredData";
import OptimizedImage from "../../components/OptimizedImage";
import { SmartImage } from "../../components/SmartImage";
import ToolsModal from "../../components/ToolsModal";

type Feature = { label: string; icon: string; description: string };
type Tool = { name: string; icon: string; desc: string; size: "sm" | "md" | "lg" };

const PHONE_DISPLAY = "(888) 535-2566";
const PHONE_TEL = "8885352566";
const EMAIL = "info@bus2ride.com";

const PARTY_BUS_FEATURES: Feature[] = [
  { label: "More Space to Move Around", icon: "🕺", description: "Spacious interiors let you dance, mingle, and move around safely—no cramped seating here!" },
  { label: "Better for Socializing, Less Claustrophobic", icon: "🫂", description: "Wrap-around seating means everyone faces each other and can actually talk; great group energy." },
  { label: "Wet bars with ice & bottled water", icon: "🧊", description: "Built-in wet bars with ice and complimentary bottled water. Bring your own drinks (21+ where legal)." },
  { label: "Easy to Get In and Out Of", icon: "🚪", description: "Wide doors and low steps make boarding and exiting the bus a breeze for all guests." },
  { label: "BYOB Friendly", icon: "🍾", description: "Bring your own beverages and keep the party going your way. Just no glass bottles, please!" },
  { label: "Some Restrooms on Big Party Buses", icon: "🚻", description: "Select larger party buses include onboard restrooms for maximum comfort and convenience during your trip." },
];

const TOOL_LIST: Tool[] = [
  { name: "Per Person Splitter", icon: "🧮", desc: "Split total cost per person in seconds.", size: "sm" },
  { name: "BYOB Pack & Ice Calculator", icon: "🥤", desc: "How much to bring so nobody runs dry.", size: "md" },
  { name: "Seat Space Fit Advisor", icon: "🪑", desc: "Check if your group fits comfortably.", size: "sm" },
  { name: "Bar Hop Route Builder", icon: "🗺️", desc: "Plan stops and timings for the night.", size: "lg" },
  { name: "Vibe Selector", icon: "🎶", desc: "Pick a mood & get playlist ideas.", size: "md" },
  { name: "Stop Timing Planner", icon: "⏱️", desc: "Map time per stop so you’re never rushed.", size: "md" },
];

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
  "/images/Bus-3.png",
  "/images/Bus-4.png",
  "/images/Bus-5.png",
  "/images/Bus-3.png",
  "/images/Bus-2.png",
  "/images/Bus-5.png",
  "/images/Bus-3.png",
  "/images/Bus-1.png",
];

const eventBlurb = (title: string) =>
  `Perfect for ${title.toLowerCase()}—on-time pickups, clean rides, and a vibe your group will love.`;

export default function PartyBusesPage() {
  const [toolSearch, setToolSearch] = useState("");
  const [activeToolIdx, setActiveToolIdx] = useState<number | null>(null);
  const [eventSearch, setEventSearch] = useState("");

  const partyOptimized = useMemo(() => getCategoryImages("partyBuses"), []);

  const catalogPartyBuses = useMemo(() =>
    resolveVehicles(findByFileName)
      .filter((v) => v.category === "party-buses")
      .sort((a, b) => (a.capacityMax ?? 0) - (b.capacityMax ?? 0)),
    []
  );

  const eventsWithImages = useMemo(() => {
    const len = partyOptimized.length || 0;
    return POPULAR_EVENT_TITLES.map((title, i) => ({
      title,
      desc: eventBlurb(title),
      // attach up to 3 nearby optimized entries for a thumbnail strip
      optimizedEntries: len ? [partyOptimized[i % len], partyOptimized[(i + 1) % len], partyOptimized[(i + 2) % len]] : undefined,
      fallback: EVENT_IMAGES[i % EVENT_IMAGES.length],
    }));
  }, [partyOptimized]);

  const filteredEvents = useMemo(() => {
    const q = eventSearch.trim().toLowerCase();
    if (!q) return eventsWithImages;
    return eventsWithImages.filter((e) => e.title.toLowerCase().includes(q) || e.desc.toLowerCase().includes(q));
  }, [eventSearch, eventsWithImages]);

  const filteredTools = useMemo(
    () =>
      TOOL_LIST.filter(
        (t) => t.name.toLowerCase().includes(toolSearch.toLowerCase()) || t.desc.toLowerCase().includes(toolSearch.toLowerCase())
      ),
    [toolSearch]
  );

  const closeModal = useCallback(() => setActiveToolIdx(null), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActiveToolIdx(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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

      {/* FLEET */}
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

      {/* TOOLS SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 my-12">
        <div className="bg-[#122a56] border border-blue-800/30 rounded-3xl shadow-xl px-5 md:px-8 py-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white font-serif tracking-tight">Party Bus Tools</h2>
          <p className="text-blue-200 text-center max-w-3xl mx-auto mt-3 mb-6">Client-side utilities to plan budgets, BYOB, stops, and group sizes.</p>

          <div className="w-full flex justify-center mb-6">
            <input type="text" placeholder="Search tools..." value={toolSearch} onChange={(e) => setToolSearch(e.target.value)} className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((t, i) => (
              <button key={t.name} onClick={() => setActiveToolIdx(TOOL_LIST.findIndex((it) => it.name === t.name))} className="text-left bg-[#12244e] rounded-2xl p-4 border border-blue-800/30 hover:scale-105 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-900/20 flex items-center justify-center text-xl">{t.icon}</div>
                  <div>
                    <div className="font-semibold text-white">{t.name}</div>
                    <div className="text-blue-200 text-sm">{t.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS (with thumbnail strips) */}
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
                  {ev.optimizedEntries && ev.optimizedEntries.length ? (
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

      {activeToolIdx !== null && <ToolsModal activeToolIdx={activeToolIdx} toolList={TOOL_LIST} onClose={closeModal} />}
    </main>
  );
}
          <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-white font-serif tracking-tight">We Also Have Limousines & Coaches</h2>
            <p className="text-blue-100 text-center max-w-3xl mx-auto mb-8">Need something different? Explore limos for smaller groups—or go with a coach for simple, comfy transport.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a href="/limos" className="group">
                <div className="rounded-2xl border border-blue-800/30 bg-[#12244e] overflow-hidden shadow-xl">
                  <div className="h-96 w-full bg-[#173264] relative">
                    {(() => {
                      const entry = getCategoryImages('limousines')[0];
                      return entry ? (
                        <OptimizedImage entry={entry} alt={entry.alt || 'Limousine'} className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform" fillParent priorityIfAbove={1400} />
                      ) : null;
                    })()}
                  </div>
                  <div className="px-6 py-5">
                    <h3 className="text-2xl font-extrabold text-white text-center">Limousines</h3>
                    <p className="text-blue-200 text-center">Elegant rides for 6–20 passengers.</p>
                  </div>
                </div>
              </a>
              <a href="/coaches" className="group">
                <div className="rounded-2xl border border-blue-800/30 bg-[#12244e] overflow-hidden shadow-xl">
                  <div className="h-96 w-full bg-[#173264] relative">
                    {(() => {
                      const entry = getCategoryImages('coachBuses')[0];
                      return entry ? (
                        <OptimizedImage entry={entry} alt={entry.alt || 'Coach Bus'} className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform" fillParent priorityIfAbove={1400} />
                      ) : null;
                    })()}
                  </div>
                  <div className="px-6 py-5">
                    <h3 className="text-2xl font-extrabold text-white text-center">Coach Buses</h3>
                    <p className="text-blue-200 text-center">Comfortable seating for large groups.</p>
                  </div>
                </div>
              </a>
            </div>
          </section>

          {/* HOW IT WORKS (CSS-only modals) */}
          <section className="max-w-7xl mx-auto px-4 md:px-6 my-12">
            <div className="bg-[#122a56] border border-blue-800/30 rounded-3xl shadow-xl px-5 md:px-8 py-8">
              <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white font-serif tracking-tight">How the Bus2Ride Booking Process Works</h2>
              <div className="mt-8 flex flex-col md:flex-row gap-4 md:gap-6 justify-between">
                {[{ step: "★1", label: "Contact Us", icon: "📞", href: "/contact" }, { step: "★2", label: "Get a Quote", icon: "💬", href: "/quote#instant" }, { step: "★3", label: "Reserve Your Ride", icon: "📝", href: "/reserve" }, { step: "★4", label: "Finalize & Ride", icon: "🎉", href: "/itinerary" }].map((s, idx) => (
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
                          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                            <a href={s.href} className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-bold bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 transition">Go to {s.label}</a>
                            <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-bold bg-white text-blue-900 hover:bg-blue-50 border border-blue-200 transition">Call {PHONE_DISPLAY}</a>
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
          <section className="w-full bg-gradient-to-br from-[#122a5c] to-[#0f2148] py-16 md:py-20 border-t border-blue-800/30">
            <div className="max-w-6xl mx-auto flex flex-col items-center px-4 md:px-0">
              <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-3 font-serif tracking-tight text-white">Limo & Party Bus Tools</h2>
              <p className="text-lg md:text-xl text-blue-100 text-center max-w-2xl font-medium mb-8">Click a tool to open it in a perfectly-sized modal—some are compact, others full-width. Your customers can use them right here.</p>
              <div className="w-full flex justify-center mb-8">
                <input type="text" placeholder="Search tools..." value={toolSearch} onChange={(e) => setToolSearch(e.target.value)} className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition" aria-label="Search tools" />
              </div>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 justify-center items-stretch">
                {TOOL_LIST.filter(t => t.name.toLowerCase().includes(toolSearch.toLowerCase()) || t.desc.toLowerCase().includes(toolSearch.toLowerCase())).map((tool) => {
                  const idx = TOOL_LIST.findIndex((t) => t.name === tool.name);
                  return (
                    <button key={tool.name} type="button" onClick={() => setActiveToolIdx(idx)} className="flex flex-col items-center text-left bg-[#12244e] rounded-2xl shadow-xl px-8 py-8 w-full max-w-xs mx-auto border border-blue-800/30 hover:scale-105 transition-transform">
                      <span className="text-4xl mb-2">{tool.icon}</span>
                      <span className="font-bold text-lg mb-1 text-white">{tool.name}</span>
                      <span className="text-blue-100 text-center text-base">{tool.desc}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-center mt-10">
                <a href="/tools" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700">More Tools</a>
              </div>
            </div>
          </section>

          {/* EVENTS */}
          <section className="max-w-7xl mx-auto px-4 md:px-6 my-12 pb-12">
            <div className="bg-[#122a56] border border-blue-800/30 rounded-3xl shadow-xl px-6 md:px-8 py-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white font-serif tracking-tight mb-3">Events We Love Rolling To</h2>
              <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-6">From milestone moments to big-night blowouts—book the perfect ride for your event and make traffic part of the fun.</p>

              <div className="w-full flex justify-center mb-8">
                <input type="text" placeholder="Search events…" value={eventSearch} onChange={(e) => setEventSearch(e.target.value)} className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition" aria-label="Search events" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((ev) => (
                  <div key={ev.title} className="relative rounded-2xl overflow-hidden border border-blue-800/30 shadow-lg bg-[#173264] flex flex-col">
                    <div className="h-60 md:h-72 w-full relative">
                      {ev.optimizedEntry ? (
                        <OptimizedImage entry={ev.optimizedEntry} alt={ev.title} className="w-full h-full object-cover" fillParent priorityIfAbove={2000} sizesOverride="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" minDesiredWidth={900} />
                      ) : (
                        <SmartImage src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                      )}
                    </div>

                    <div className="absolute inset-x-0 top-0 p-5 bg-gradient-to-b from-black/35 via-black/20 to-transparent pointer-events-none">
                      <div className="text-2xl font-extrabold text-white drop-shadow">{ev.title}</div>
                      <div className="text-blue-100 text-sm mt-1">{ev.desc}</div>
                    </div>

                    <div className="p-5">
                      <div className="flex flex-col gap-2">
                        <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-bold bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 transition" aria-label={`Call ${PHONE_DISPLAY}`}>888-535-2566</a>
                        <a href={`mailto:${EMAIL}`} className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-bold bg-blue-800 text-white hover:bg-blue-900 border border-blue-900 transition">Email Now</a>
                        <a href="/quote#instant" className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-bold bg-white text-blue-900 hover:bg-blue-50 border border-blue-200 transition">Instant Quote</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <a href="/events" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700">More Event Ideas</a>
              </div>
            </div>
          </section>

          {/* Tools Modal rendered here */}
          {activeToolIdx !== null && (
            <ToolsModal activeToolIdx={activeToolIdx} toolList={TOOL_LIST} onClose={closeModal} />
          )}
        </main>
      );
    }
            id="party-buses-schema"
            data={{
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: 'Party Bus Fleet',
              description: 'Browse luxury party bus vehicles available for group transportation including 14 to 45 passenger options with premium amenities.',
              mainEntity: catalogPartyBuses.slice(0,12).map(v => ({
                '@type': 'Product',
                name: v.name,
                description: v.highlights.join(', '),
                additionalProperty: [{ '@type': 'PropertyValue', name: 'Capacity', value: v.capacityMax }],
                offers: { '@type': 'Offer', availability: 'https://schema.org/InStock', priceCurrency: 'USD' },
                image: v.images.map(i => i.entry?.original).filter(Boolean)
              })),
              image: partyOptimized.slice(0,6).map(toImageObject)
            }}
          />

          {/* FLEET */}
          <section className="bg-[#122a56] pt-8 pb-14">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white font-serif tracking-tight">
                Pick Your Party Bus
              </h2>
              <p className="text-blue-100/90 text-center max-w-3xl mx-auto mt-3 mb-10">
                From classic minis to mega party buses—every ride is clean, comfy, and ready for your group.
              </p>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {catalogPartyBuses.map(v => (
                  <VehicleGalleryCard key={v.id} vehicle={v} />
                ))}
              </div>
            </div>
          </section>

          {/* WHY PARTY BUSES */}
          <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-2 text-white font-serif tracking-tight">
              Why Party Buses Rock
            </h2>
            <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-8">
              It’s the ultimate rolling venue—room to move, easy boarding, wrap-around seating, and the vibe dialed just right.
            </p>

            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PARTY_BUS_FEATURES.map((f, idx) => (
                <li key={f.label} className="relative">
                  <input id={`whybus-${idx}`} type="checkbox" className="peer sr-only" aria-hidden="true" />
                  <label htmlFor={`whybus-${idx}`} className="group block bg-[#12244e] rounded-2xl shadow border border-blue-800/30 px-5 py-4 text-blue-50 cursor-pointer hover:scale-105 transition-transform" aria-label={`Learn more about: ${f.label}`}>
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-9 h-9 rounded-full bg-blue-900/20 border border-blue-700/40 flex items-center justify-center text-xl group-hover:bg-blue-700/30 transition">{f.icon}</div>
                      <div>
                        <div className="font-semibold text-white text-lg mb-0.5">{f.label}</div>
                        <div className="text-blue-200 text-sm">{f.description}</div>
                      </div>
                    </div>
                  </label>

                  <div className="hidden peer-checked:flex fixed inset-0 z-50 items-center justify-center p-4">
                    <label htmlFor={`whybus-${idx}`} className="absolute inset-0 bg-black/40 cursor-pointer" aria-label="Close" />
                    <div className="relative z-10 w-full max-w-md min-h-[300px] bg-gradient-to-br from-[#13306a] to-[#0e2250] border border-blue-800/40 rounded-2xl shadow-2xl">
                      <label htmlFor={`whybus-${idx}`} className="absolute top-3 right-3 text-blue-100 hover:text-white text-2xl font-bold cursor-pointer" aria-label="Close">×</label>
                      <div className="px-6 py-7 flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-full bg-blue-900/20 border border-blue-700/40 flex items-center justify-center text-3xl mb-4">{f.icon}</div>
                        <h3 className="text-2xl font-extrabold text-white mb-2 font-serif tracking-tight">{f.label}</h3>
                        <div className="text-blue-100 text-lg">{f.description}</div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* REVIEWS */}
          <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-white font-serif tracking-tight">Customer Reviews</h2>
            <div className="w-full flex justify-center mb-8">
              <input type="text" placeholder="Search reviews by name or keywords…" value={reviewSearch} onChange={(e) => setReviewSearch(e.target.value)} className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredReviews.map((review, i) => (
                <div key={i} className="relative bg-[#12244e] border border-blue-800/30 rounded-2xl shadow-xl p-7 flex flex-col gap-3 hover:scale-[1.02] transition-transform overflow-hidden">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-600 rounded-full w-11 h-11 flex items-center justify-center text-2xl font-bold text-white shadow-lg border border-blue-300/30">{review.name[0]}</div>
                    <span className="font-bold text-blue-50 text-lg">{review.name}</span>
                    <span className="ml-auto text-yellow-300 text-xl">★★★★★</span>
                  </div>
                  <div className="text-blue-50 text-base leading-relaxed font-medium">{review.text}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-10">
              <a href="/reviews" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700">More Reviews</a>
            </div>
          </section>

          {/* POLLS */}
          <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-2 text-white font-serif tracking-tight">Party Bus Polls</h2>
            <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-6">Real riders. Real opinions. Compare trends and get honest insights to plan the perfect night.</p>
            <div className="w-full flex justify-center mb-8">
              <input type="text" placeholder="Search polls…" value={pollSearch} onChange={(e) => setPollSearch(e.target.value)} className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition" aria-label="Search polls" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {filteredPolls.map((poll, idx) => (
                <div key={idx} className="bg-[#12244e] rounded-2xl shadow-xl border border-blue-800/30 p-6 flex flex-col items-center">
                  <h3 className="text-xl font-bold text-blue-50 mb-2 text-center">{poll.question}</h3>
                  <ul className="text-blue-100 mb-2 text-center">{poll.options.map((opt, i) => <li key={i}>{opt}</li>)}</ul>
                  <span className="text-blue-200 text-sm">Vote on our <a href="/polls" className="underline hover:text-blue-100">polls page</a>!</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-10">
              <a href="/polls" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700">More Polls</a>
            </div>
          </section>

          {/* PROMOS */}
          <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-white font-serif tracking-tight">We Also Have Limousines & Coaches</h2>
            <p className="text-blue-100 text-center max-w-3xl mx-auto mb-8">Need something different? Explore limos for smaller groups—or go with a coach for simple, comfy transport.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a href="/limos" className="group">
                <div className="rounded-2xl border border-blue-800/30 bg-[#12244e] overflow-hidden shadow-xl">
                  <div className="h-96 w-full bg-[#173264] relative">
                    {(() => {
                      const entry = getCategoryImages('limousines')[0];
                      return entry ? (
                        <OptimizedImage entry={entry} alt={entry.alt || 'Limousine'} className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform" fillParent priorityIfAbove={1400} />
                      ) : null;
                    })()}
                  </div>
                  <div className="px-6 py-5">
                    <h3 className="text-2xl font-extrabold text-white text-center">Limousines</h3>
                    <p className="text-blue-200 text-center">Elegant rides for 6–20 passengers.</p>
                  </div>
                </div>
              </a>
              <a href="/coaches" className="group">
                <div className="rounded-2xl border border-blue-800/30 bg-[#12244e] overflow-hidden shadow-xl">
                  <div className="h-96 w-full bg-[#173264] relative">
                    {(() => {
                      const entry = getCategoryImages('coachBuses')[0];
                      return entry ? (
                        <OptimizedImage entry={entry} alt={entry.alt || 'Coach Bus'} className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform" fillParent priorityIfAbove={1400} />
                      ) : null;
                    })()}
                  </div>
                  <div className="px-6 py-5">
                    <h3 className="text-2xl font-extrabold text-white text-center">Coach Buses</h3>
                    <p className="text-blue-200 text-center">Comfortable seating for large groups.</p>
                  </div>
                </div>
              </a>
            </div>
          </section>

          {/* HOW IT WORKS (CSS-only modals) */}
          <section className="max-w-7xl mx-auto px-4 md:px-6 my-12">
            <div className="bg-[#122a56] border border-blue-800/30 rounded-3xl shadow-xl px-5 md:px-8 py-8">
              <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white font-serif tracking-tight">How the Bus2Ride Booking Process Works</h2>
              <div className="mt-8 flex flex-col md:flex-row gap-4 md:gap-6 justify-between">
                {[{ step: "★1", label: "Contact Us", icon: "📞", href: "/contact" }, { step: "★2", label: "Get a Quote", icon: "💬", href: "/quote#instant" }, { step: "★3", label: "Reserve Your Ride", icon: "📝", href: "/reserve" }, { step: "★4", label: "Finalize & Ride", icon: "🎉", href: "/itinerary" }].map((s, idx) => (
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
                          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                            <a href={s.href} className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-bold bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 transition">Go to {s.label}</a>
                            <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-bold bg-white text-blue-900 hover:bg-blue-50 border border-blue-200 transition">Call {PHONE_DISPLAY}</a>
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
          <section className="w-full bg-gradient-to-br from-[#122a5c] to-[#0f2148] py-16 md:py-20 border-t border-blue-800/30">
            <div className="max-w-6xl mx-auto flex flex-col items-center px-4 md:px-0">
              <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-3 font-serif tracking-tight text-white">Limo & Party Bus Tools</h2>
              <p className="text-lg md:text-xl text-blue-100 text-center max-w-2xl font-medium mb-8">Click a tool to open it in a perfectly-sized modal—some are compact, others full-width. Your customers can use them right here.</p>
              <div className="w-full flex justify-center mb-8">
                <input type="text" placeholder="Search tools..." value={toolSearch} onChange={(e) => setToolSearch(e.target.value)} className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition" aria-label="Search tools" />
              </div>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 justify-center items-stretch">
                {filteredTools.map((tool) => {
                  const idx = TOOL_LIST.findIndex((t) => t.name === tool.name);
                  return (
                    <button key={tool.name} type="button" onClick={() => setActiveToolIdx(idx)} className="flex flex-col items-center text-left bg-[#12244e] rounded-2xl shadow-xl px-8 py-8 w-full max-w-xs mx-auto border border-blue-800/30 hover:scale-105 transition-transform">
                      <span className="text-4xl mb-2">{tool.icon}</span>
                      <span className="font-bold text-lg mb-1 text-white">{tool.name}</span>
                      <span className="text-blue-100 text-center text-base">{tool.desc}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-center mt-10">
                <a href="/tools" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700">More Tools</a>
              </div>
            </div>
          </section>

          {/* EVENTS */}
          <section className="max-w-7xl mx-auto px-4 md:px-6 my-12 pb-12">
            <div className="bg-[#122a56] border border-blue-800/30 rounded-3xl shadow-xl px-6 md:px-8 py-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white font-serif tracking-tight mb-3">Events We Love Rolling To</h2>
              <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-6">From milestone moments to big-night blowouts—book the perfect ride for your event and make traffic part of the fun.</p>

              <div className="w-full flex justify-center mb-8">
                <input type="text" placeholder="Search events…" value={eventSearch} onChange={(e) => setEventSearch(e.target.value)} className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition" aria-label="Search events" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((ev) => (
                  <div key={ev.title} className="relative rounded-2xl overflow-hidden border border-blue-800/30 shadow-lg bg-[#173264] flex flex-col">
                    <div className="h-60 md:h-72 w-full relative">
                      {ev.optimizedEntry ? (
                        <OptimizedImage entry={ev.optimizedEntry} alt={ev.title} className="w-full h-full object-cover" fillParent priorityIfAbove={2000} sizesOverride="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" minDesiredWidth={900} />
                      ) : (
                        <SmartImage src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                      )}
                    </div>

                    <div className="absolute inset-x-0 top-0 p-5 bg-gradient-to-b from-black/35 via-black/20 to-transparent pointer-events-none">
                      <div className="text-2xl font-extrabold text-white drop-shadow">{ev.title}</div>
                      <div className="text-blue-100 text-sm mt-1">{ev.desc}</div>
                    </div>

                    <div className="p-5">
                      <div className="flex flex-col gap-2">
                        <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-bold bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 transition" aria-label={`Call ${PHONE_DISPLAY}`}>888-535-2566</a>
                        <a href={`mailto:${EMAIL}`} className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-bold bg-blue-800 text-white hover:bg-blue-900 border border-blue-900 transition">Email Now</a>
                        <a href="/quote#instant" className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-bold bg-white text-blue-900 hover:bg-blue-50 border border-blue-200 transition">Instant Quote</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <a href="/events" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700">More Event Ideas</a>
              </div>
            </div>
          </section>

          {/* Tools Modal rendered here */}
          {activeToolIdx !== null && (
            <ToolsModal activeToolIdx={activeToolIdx} toolList={TOOL_LIST} onClose={closeModal} />
          )}
        </main>
      );
    }
                          </ol>
                          <p className="text-sm text-blue-200">Hours: Mon–Sun, 8am–10pm local. For urgent same-day needs call us directly.</p>
                        </div>
                      )}

                      {/* Get a Quote (request-based, not instant) */}
                      {s.label === "Get a Quote" && (
                        <div className="text-blue-100/90">
                          <p className="mb-3">Request a written quote — our team reviews your trip details and replies with a confirmed price and available vehicles.</p>
                          <ol className="list-decimal ml-6 space-y-2 mb-3">
                            <li>Provide pickup city/ZIP, date, approximate passenger count, and estimated hours.</li>
                            <li>List any must-have amenities (restroom, wheelchair lift, BYOB, extra stops).</li>
                            <li>We’ll review availability and email a firm quote (usually within 1 business day; faster by phone).</li>
                          </ol>
                          <p className="text-sm text-blue-200">Quotes are written and time-limited (commonly 24–72 hours). If you need a faster turnaround, call us and we’ll prioritize your request.</p>
                        </div>
                      )}

                      {/* Reserve Your Ride */}
                      {s.label === "Reserve Your Ride" && (
                        <div className="text-blue-100/90">
                          <p className="mb-3">Reserve a vehicle once you’ve chosen a quote — a small deposit secures the booking.</p>
                          <ol className="list-decimal ml-6 space-y-2 mb-3">
                            <li>Accept the quote and provide your contact details and billing name.</li>
                            <li>Pay the deposit (card, ACH, or company invoicing where available).</li>
                            <li>Receive a confirmation email with contract, pickup window and driver info.</li>
                          </ol>
                          <p className="text-sm text-blue-200">Note: For busy dates book as early as possible; deposits are typically refundable per the contract terms.</p>
                        </div>
                      )}

                      {/* Finalize & Ride */}
                      {s.label === "Finalize & Ride" && (
                        <div className="text-blue-100/90">
                          <p className="mb-3">Final checks and day-of instructions so your trip goes smoothly.</p>
                          <ol className="list-decimal ml-6 space-y-2 mb-3">
                            <li>Confirm final headcount and pickup times 24–48 hours before departure.</li>
                            <li>Driver contact and ETA are sent the morning of your event.</li>
                            <li>Ask about gratuity, tolls, and any last-minute changes — we’ll accommodate when possible.</li>
                          </ol>
                          <p className="text-sm text-blue-200">Pro tip: Text the driver 10–15 minutes before pickup to coordinate curb location.</p>
                        </div>
                      )}

                      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                        <a
                          href={s.href}
                          className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-bold bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 transition"
                        >
                          Go to {s.label}
                        </a>
                        <a
                          href={`tel:${PHONE_TEL}`}
                          className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-bold bg-white text-blue-900 hover:bg-blue-50 border border-blue-200 transition"
                        >
                          Call {PHONE_DISPLAY}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- TOOLS (with modals) ---------- */}
      <section className="w-full bg-gradient-to-br from-[#122a5c] to-[#0f2148] py-16 md:py-20 border-t border-blue-800/30">
        <div className="max-w-6xl mx-auto flex flex-col items-center px-4 md:px-0">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-3 font-serif tracking-tight text-white">
            Limo & Party Bus Tools
          </h2>
          <p className="text-lg md:text-xl text-blue-100 text-center max-w-2xl font-medium mb-8">
            Click a tool to open it in a perfectly-sized modal—some are compact, others full-width. Your customers can use them right here.
          </p>
          <div className="w-full flex justify-center mb-8">
            <input
              type="text"
              placeholder="Search tools..."
              value={toolSearch}
              onChange={(e) => setToolSearch(e.target.value)}
              className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              aria-label="Search tools"
            />
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 justify-center items-stretch">
            {filteredTools.map((tool) => {
              const idx = TOOL_LIST.findIndex((t) => t.name === tool.name);
              return (
                <button
                  key={tool.name}
                  type="button"
                  onClick={() => setActiveToolIdx(idx)}
                  className="flex flex-col items-center text-left bg-[#12244e] rounded-2xl shadow-xl px-8 py-8 w-full max-w-xs mx-auto border border-blue-800/30 hover:scale-105 transition-transform"
                >
                  <span className="text-4xl mb-2">{tool.icon}</span>
                  <span className="font-bold text-lg mb-1 text-white">{tool.name}</span>
                  <span className="text-blue-100 text-center text-base">{tool.desc}</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-center mt-10">
            <a
              href="/tools"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700"
            >
              More Tools
            </a>
          </div>
        </div>
      </section>

      {/* ---------- EVENTS (top 12 + vertical buttons under each card) ---------- */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 my-12 pb-12">
        <div className="bg-[#122a56] border border-blue-800/30 rounded-3xl shadow-xl px-6 md:px-8 py-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white font-serif tracking-tight mb-3">
            Events We Love Rolling To
          </h2>
          <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-6">
            From milestone moments to big-night blowouts—book the perfect ride for your event and make traffic part of the fun.
          </p>

          <div className="w-full flex justify-center mb-8">
            <input
              type="text"
              placeholder="Search events…"
              value={eventSearch}
              onChange={(e) => setEventSearch(e.target.value)}
              className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              aria-label="Search events"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((ev) => (
              <div
                key={ev.title}
                className="relative rounded-2xl overflow-hidden border border-blue-800/30 shadow-lg bg-[#173264] flex flex-col"
              >
                {/* Image */}
                <div className="h-60 md:h-72 w-full relative">
                  {ev.optimizedEntry ? (
                    <OptimizedImage
                      entry={ev.optimizedEntry}
                      alt={ev.title}
                      className="w-full h-full object-cover"
                      fillParent
                      priorityIfAbove={2000}
                      sizesOverride="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                      minDesiredWidth={900}
                    />
                  ) : (
                    <SmartImage
                        src={ev.image}
                        alt={ev.title}
                        className="w-full h-full object-cover"
                      />
                  )}
                </div>

                {/* Title + blurb overlay on top of image */}
                <div className="absolute inset-x-0 top-0 p-5 bg-gradient-to-b from-black/35 via-black/20 to-transparent pointer-events-none">
                  <div className="text-2xl font-extrabold text-white drop-shadow">{ev.title}</div>
                  <div className="text-blue-100 text-sm mt-1">{ev.desc}</div>
                </div>

                {/* Vertical buttons under the image */}
                <div className="p-5">
                  <div className="flex flex-col gap-2">
                    <a
                      href={`tel:${PHONE_TEL}`}
                      className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-bold bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 transition"
                      aria-label={`Call ${PHONE_DISPLAY}`}
                    >
                      888-535-2566
                    </a>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-bold bg-blue-800 text-white hover:bg-blue-900 border border-blue-900 transition"
                    >
                      Email Now
                    </a>
                    <a
                      href="/quote#instant"
                      className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-bold bg-white text-blue-900 hover:bg-blue-50 border border-blue-200 transition"
                    >
                      Instant Quote
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* More button */}
          <div className="flex justify-center mt-8">
            <a
              href="/events"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700"
            >
              More Event Ideas
            </a>
          </div>
        </div>
      </section>

      {/* ---------- TOOL MODAL ---------- */}
      {activeToolIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
        >
          <div
            className={`w-full ${TOOL_SIZE_CLASS[TOOL_LIST[activeToolIdx].size]} bg-gradient-to-br from-[#13306a] to-[#0e2250] border border-blue-800/40 rounded-2xl shadow-2xl relative`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-blue-100 hover:text-white text-2xl font-bold"
              onClick={closeModal}
              aria-label="Close"
            >
              ×
            </button>
            <div className="px-6 py-5">
              <h3 className="text-2xl font-extrabold text-white mb-3 font-serif tracking-tight">
                {TOOL_LIST[activeToolIdx].name}
              </h3>
              {/* Placeholder tool bodies */}
              {TOOL_LIST[activeToolIdx].name === "Per Person Splitter" && (
                <div className="grid gap-3 max-w-md">
                  <label className="text-blue-100 text-sm font-semibold">Total Price ($)</label>
                  <input className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" placeholder="e.g., 800" />
                  <label className="text-blue-100 text-sm font-semibold mt-3">People</label>
                  <input className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" placeholder="e.g., 16" />
                  <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg border border-blue-700">
                    Calculate
                  </button>
                </div>
              )}
              {TOOL_LIST[activeToolIdx].name === "BYOB Pack & Ice Calculator" && (
                <div className="grid gap-3 max-w-2xl">
                  <p className="text-blue-100">Estimate drinks/ice for your group.</p>
                  <div className="grid md:grid-cols-3 gap-3">
                    <input className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" placeholder="People" />
                    <input className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" placeholder="Hours" />
                    <select className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white">
                      <option>Mixed</option>
                      <option>Mostly Beer</option>
                      <option>Mostly Spirits</option>
                    </select>
                  </div>
                  <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg border border-blue-700">
                    Estimate
                  </button>
                </div>
              )}
              {TOOL_LIST[activeToolIdx].name === "Seat Space Fit Advisor" && (
                export default function PartyBusesPage() {
                  const [toolSearch, setToolSearch] = useState("");
                  const [activeToolIdx, setActiveToolIdx] = useState<number | null>(null);
                  const [reviewSearch, setReviewSearch] = useState("");
                  const [pollSearch, setPollSearch] = useState("");
                  const [eventSearch, setEventSearch] = useState("");

                  const filteredTools = useMemo(
                    () =>
                      TOOL_LIST.filter(
                        (t) =>
                          t.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
                          t.desc.toLowerCase().includes(toolSearch.toLowerCase())
                      ),
                    [toolSearch]
                  );

                  const filteredReviews = useMemo(() => {
                    const q = reviewSearch.trim().toLowerCase();
                    if (!q) return REVIEWS;
                    return REVIEWS.filter(
                      (r) => r.name.toLowerCase().includes(q) || r.text.toLowerCase().includes(q)
                    );
                  }, [reviewSearch]);

                  const filteredPolls = useMemo(() => {
                    const q = pollSearch.trim().toLowerCase();
                    if (!q) return POLLS;
                    return POLLS.filter(
                      (p) =>
                        p.question.toLowerCase().includes(q) ||
                        p.options.some((o) => o.toLowerCase().includes(q))
                    );
                  }, [pollSearch]);

                  const partyOptimized = useMemo(() => getCategoryImages("partyBuses"), []);
                  const catalogPartyBuses = useMemo(() => {
                    return resolveVehicles(findByFileName)
                      .filter((v) => v.category === 'party-buses')
                      .sort((a, b) => ((a.capacityMax ?? 0) - (b.capacityMax ?? 0)));
                  }, []);
                  const [vehicleImageIdx, setVehicleImageIdx] = useState<Record<string, number>>({});
                  const setVehicleIdx = useCallback((id: string, idx: number) => setVehicleImageIdx(prev => ({ ...prev, [id]: idx })), []);

                  const structuredVehicles = useMemo(() => catalogPartyBuses.slice(0,12).map(v => ({
                    '@type': 'Product',
                    name: v.name,
                    description: v.highlights.join(', '),
                    additionalProperty: [ { '@type': 'PropertyValue', name: 'Capacity', value: v.capacityMax } ],
                    offers: { '@type': 'Offer', availability: 'https://schema.org/InStock', priceCurrency: 'USD' },
                    image: v.images.map(i => i.entry?.original).filter(Boolean)
                  })), [catalogPartyBuses]);

                  const eventsWithImages = useMemo(
                    () => {
                      const partyImgs = partyOptimized;
                      const len = partyImgs.length || 0;
                      return POPULAR_EVENT_TITLES.map((title, i) => {
                        const entries = len ? [partyImgs[i % len], partyImgs[(i + 1) % len], partyImgs[(i + 2) % len]] : [];
                        return {
                          title,
                          image: EVENT_IMAGES[i % EVENT_IMAGES.length],
                          desc: eventBlurb(title),
                          optimizedEntry: entries[0],
                          optimizedEntries: entries,
                        };
                      });
                    },
                    [partyOptimized]
                  );

                  const filteredEvents = useMemo(() => {
                    const q = eventSearch.trim().toLowerCase();
                    if (!q) return eventsWithImages;
                    return eventsWithImages.filter(
                      (e) => e.title.toLowerCase().includes(q) || e.desc.toLowerCase().includes(q)
                    );
                  }, [eventSearch, eventsWithImages]);

                  const closeModal = useCallback(() => setActiveToolIdx(null), []);
                  useEffect(() => {
                    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActiveToolIdx(null);
                    window.addEventListener("keydown", onKey);
                    return () => window.removeEventListener("keydown", onKey);
                  }, []);

                  return (
                    <main className="text-slate-100 bg-[#0f1f46]">
                      <StructuredData
                        id="party-buses-schema"
                        data={{
                          '@context': 'https://schema.org',
                          '@type': 'CollectionPage',
                            name: 'Party Bus Fleet',
                            description: 'Browse luxury party bus vehicles available for group transportation including 14 to 45 passenger options with premium amenities.',
                            mainEntity: structuredVehicles,
                            image: partyOptimized.slice(0,6).map(toImageObject)
                        }}
                      />

                      {/* ---------- FLEET ---------- */}
                      <section className="bg-[#122a56] pt-8 pb-14">
                        <div className="max-w-7xl mx-auto px-4 md:px-6">
                          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white font-serif tracking-tight">
                            Pick Your Party Bus
                          </h2>
                          <p className="text-blue-100/90 text-center max-w-3xl mx-auto mt-3 mb-10">
                            From sleek Sprinters to mega buses—every ride is clean, comfy, and ready to turn up the vibe. Choose the size that fits your crew.
                          </p>

                          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {catalogPartyBuses.map(v => {
                              const selectedIdx = vehicleImageIdx[v.id] ?? 0;
                              const selected = v.images[selectedIdx] || v.primary || v.images[0];
                              const entry = selected.entry || v.primary?.entry;
                              return (
                                <div
                                  key={v.id}
                                  className="bg-[#15305f]/90 border border-blue-800/40 rounded-[24px] shadow-[0_10px_30px_rgba(2,6,23,.35)] overflow-hidden"
                                >
                                  {/* header */}
                                  <div className="flex items-center justify-between px-6 pt-5 min-h-[28px]">
                                    <span className="text-xs font-semibold text-blue-100/90">Party Bus</span>
                                    {v.badge ? (
                                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white border border-blue-300/40">
                                        {v.badge}
                                      </span>
                                    ) : (
                                      <span className="h-[18px]" />
                                    )}
                                  </div>

                                  {/* main image */}
                                  <div className="px-6 mt-3">
                                    <div className="h-96 md:h-[26rem] w-full overflow-hidden rounded-2xl border border-blue-800/30 bg-[#18356e] flex items-center justify-center relative">
                                      {entry ? (
                                        <OptimizedImage entry={entry} alt={selected.alt || v.alt || v.name} className="w-full h-full object-cover" sizesOverride="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" minDesiredWidth={900} />
                                      ) : <div className="text-blue-100/80">Vehicle preview</div>}
                                      {v.images.length > 1 && (
                                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                          {v.images.map((img, i) => {
                                            const smallEntry = img.entry || entry;
                                            return (
                                              <button
                                                key={img.file + i}
                                                type="button"
                                                onClick={() => setVehicleIdx(v.id, i)}
                                                className={`relative h-10 w-14 overflow-hidden rounded-md border ${i === selectedIdx ? 'border-blue-300 ring-2 ring-blue-400' : 'border-blue-800/50'}`}
                                                aria-label={`Show ${img.role || 'image'} ${i+1} for ${v.name}`}
                                              >
                                                {smallEntry && (
                                                  <OptimizedImage entry={smallEntry} alt="" className="h-full w-full object-cover" minDesiredWidth={300} />
                                                )}
                                              </button>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* title + capacity */}
                                  <div className="px-6 mt-5">
                                    <h3 className="text-2xl font-extrabold text-white tracking-tight text-center">{v.name}</h3>
                                    <div className="mt-1 mb-4 text-sm font-semibold text-blue-200 text-center">Seats up to {v.capacityMax}</div>
                                    <ul className="text-blue-100/95 text-[0.95rem] space-y-1 min-h-[72px]">
                                      {v.highlights.slice(0, 3).map(h => (
                                        <li key={h} className="flex items-start gap-2">
                                          <span className="mt-[2px]">•</span>
                                          <span>{h}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  {/* bottom buttons */}
                                  <div className="px-6 pb-6 pt-4">
                                    <div className="grid grid-cols-3 gap-2">
                                      <a
                                        href={`tel:${PHONE_TEL}`}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 font-bold bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 transition"
                                      >
                                        Call
                                      </a>
                                      <a
                                        href={`mailto:${EMAIL}`}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 font-bold bg-blue-800 text-white hover:bg-blue-900 border border-blue-900 transition"
                                      >
                                        Email
                                      </a>
                                      <a
                                        href="/quote#instant"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 font-bold bg-white text-blue-900 hover:bg-blue-50 border border-blue-200 transition"
                                      >
                                        Quote
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </section>

                      {/* ---------- WHY PARTY BUSES ROCK (lightened) ---------- */}
                      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-2 text-white font-serif tracking-tight">
                          Why Party Buses Rock
                        </h2>
                        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-8">
                          It’s the ultimate rolling venue—room to move, easy boarding, wrap-around seating, and the vibe dialed just right.
                        </p>

                        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {PARTY_BUS_FEATURES.map((f, idx) => (
                            <li key={f.label} className="relative">
                              {/* Checkbox controls the modal purely with CSS (no React state) */}
                              <input
                                id={`whybus-${idx}`}
                                type="checkbox"
                                className="peer sr-only"
                                aria-hidden="true"
                              />

                              {/* Card (click to open) */}
                              <label
                                htmlFor={`whybus-${idx}`}
                                className="group block bg-[#12244e] rounded-2xl shadow border border-blue-800/30 px-5 py-4 text-blue-50 cursor-pointer hover:scale-105 transition-transform"
                                aria-label={`Learn more about: ${f.label}`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="shrink-0 w-9 h-9 rounded-full bg-blue-900/20 border border-blue-700/40 flex items-center justify-center text-xl group-hover:bg-blue-700/30 transition">
                                    {f.icon}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-white text-lg mb-0.5">{f.label}</div>
                                    <div className="text-blue-200 text-sm">{f.description}</div>
                                  </div>
                                </div>
                              </label>

                              {/* Modal (opens when checkbox is checked) */}
                              <div className="hidden peer-checked:flex fixed inset-0 z-50 items-center justify-center p-4">
                                {/* Clickable backdrop to close */}
                                <label
                                  htmlFor={`whybus-${idx}`}
                                  className="absolute inset-0 bg-black/40 cursor-pointer"
                                  aria-label="Close"
                                />
                                <div className="relative z-10 w-full max-w-md min-h-[300px] bg-gradient-to-br from-[#13306a] to-[#0e2250] border border-blue-800/40 rounded-2xl shadow-2xl">
                                  {/* Close button */}
                                  <label
                                    htmlFor={`whybus-${idx}`}
                                    className="absolute top-3 right-3 text-blue-100 hover:text-white text-2xl font-bold cursor-pointer"
                                    aria-label="Close"
                                  >
                                    ×
                                  </label>
                                  {/* Modal content */}
                                  <div className="px-6 py-7 flex flex-col items-center text-center">
                                    <div className="w-14 h-14 rounded-full bg-blue-900/20 border border-blue-700/40 flex items-center justify-center text-3xl mb-4">
                                      {f.icon}
                                    </div>
                                    <h3 className="text-2xl font-extrabold text-white mb-2 font-serif tracking-tight">
                                      {f.label}
                                    </h3>
                                    <div className="text-blue-100 text-lg">{f.description}</div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </section>
