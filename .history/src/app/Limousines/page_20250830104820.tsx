"use client";

import React, { useMemo, useState } from "react";
import ToolsGrid from "../../components/tools/ToolsGrid";
import { getCategoryImages, toImageObject, findByFileName } from "../../utils/optimizedImages";
import type { OptimizedImageEntry } from '../../utils/optimizedImages';
import { resolveVehicles } from "../../data/vehicles";
import VehicleGalleryCard from "../../components/VehicleGalleryCard";
import StructuredData from "../../components/StructuredData";
import OptimizedImage from "../../components/OptimizedImage";
import { SmartImage } from "../../components/SmartImage";

type Feature = { label: string; icon: string; description: string };
// legacy Bus type removed (using catalog vehicles)

const PHONE_DISPLAY = "(888) 535-2566";
const PHONE_TEL = "8885352566";
const EMAIL = "info@bus2ride.com";

/* ---------------- LIMO FEATURES ---------------- */
const LIMO_FEATURES: Feature[] = [
  { label: "Private, Smooth Ride", icon: "🚘", description: "Quiet cabins with plush seating keep the focus on your group—no distractions, just comfort." },
  { label: "Easy, Elegant Arrivals", icon: "🚪", description: "Low step-in and wide doors make getting in and out simple—perfect for formal attire and photos." },
  { label: "Professional Chauffeurs", icon: "🤵", description: "Trained drivers who know venues, timing, and best routes—relax and enjoy the evening." },
  { label: "Comfortable Interiors", icon: "🛋️", description: "Leather seating, climate control, glassware holders—everything set for a smooth experience." },
  { label: "Picture-Perfect Look", icon: "📸", description: "Classic black or white stretch limos deliver a timeless look for weddings and special nights." },
  { label: "Great for Small Groups", icon: "👥", description: "Ideal for 6–18 passengers—stylish and efficient for city routes and venues." },
];

// Tools moved to shared registry (ToolsGrid)

/* ---------------- Placeholder images (legacy removed in favor of optimized manifest) ---------------- */

/* Promo images replaced with optimized manifest lookups */

/* ---------------- Catalog vehicles (limousines) ---------------- */
// Pulled dynamically from VEHICLES catalog; ensure vehicles.ts has limo entries with multiple images

/* ---------------- Polls & Reviews ---------------- */
const POLLS = [
  { question: "What’s the most important factor in limousine pricing?", options: ["Group size", "Date/season", "Trip length", "Vehicle type"] },
  { question: "Would you pay more for a newer limo model?", options: ["Yes", "No"] },
  { question: "How much extra would you pay for a stretch SUV limo over a sedan limo?", options: ["$0", "$50", "$100", "$200+"] },
  { question: "What’s a fair hourly rate for a 10-passenger stretch limo?", options: ["$100", "$150", "$200", "$250+"] },
  { question: "Do you prefer all-inclusive pricing or itemized fees?", options: ["All-inclusive", "Itemized", "No preference"] },
  { question: "Would you split the limo cost with your group?", options: ["Always", "Sometimes", "Never"] },
];

const REVIEWS = [
  { name: "Paul P.", text: "Absolutely excellent! Great customer service! The price was very good. The driver was professional. The limo looked pristine." },
  { name: "Jessie A.", text: "The limo company you need to call for any event. Prices and vehicles are like no other." },
  { name: "Dee C.", text: "Used them for our bachelorette/bachelor parties and our wedding—fantastic! Even let me extend an hour. Highly recommend." },
  { name: "Halee H.", text: "Great price, clean inside, super friendly driver. Will never use another company!" },
  { name: "Rachel L.", text: "We had the best time! Driver was so fun and amazing. Would recommend them 100%!" },
  { name: "Becky B.", text: "Made us feel like movie stars! Highly recommend." },
];

/* ---------------- Events ---------------- */
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
  "/images/limousines/10 Passenger Lincoln Stretch Limo Exterior 2.png",
  "/images/limousines/10 Passenger Lincoln Stretch Limo Exterior 3.png",
  "/images/limousines/10 Passenger Chrysler Limo White.png",
  "/images/limousines/12 Passenger Sprinter Limo Exterior.png",
  "/images/limousines/14 Passenger Limo Style Sprinter White.png",
  "/images/limousines/18 Passenger Cadillac Escalade Limo Exterior.png",
  "/images/limousines/18 Passenger Hummer Limo Exterior.png",
  "/images/limousines/16_Passenger_Stretch_Excursion_Exterior_optimized.jpg",
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

const eventBlurb = (title: string) =>
  `Perfect for ${title.toLowerCase()}—on-time pickups, clean rides, and a vibe your group will love.`;

export default function LimousinesPage() {
  const [toolSearch, setToolSearch] = useState("");
  const [reviewSearch, setReviewSearch] = useState("");
  const [pollSearch, setPollSearch] = useState("");
  const [eventSearch, setEventSearch] = useState("");

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

  const limoOptimized = useMemo(() => getCategoryImages("limousines"), []);
  const catalogLimos = useMemo(() => {
    return resolveVehicles(findByFileName)
      .filter((v) => v.category === 'limousines')
      .sort((a, b) => ((a.capacityMax ?? 0) - (b.capacityMax ?? 0)));
  }, []);

  const eventsWithImages = useMemo(() => {
    const len = limoOptimized.length || 0;
    return POPULAR_EVENT_TITLES.map((title, i) => ({
      title,
  image: EVENT_IMAGES[i % EVENT_IMAGES.length],
      desc: eventBlurb(title),
      optimizedEntries: len ? [limoOptimized[i % len], limoOptimized[(i + 1) % len], limoOptimized[(i + 2) % len]] : undefined,
  // prefer actual event photos when present
  fallback: EVENTS_IMAGES_MAP[title] ?? EVENT_IMAGES[i % EVENT_IMAGES.length],
    }));
  }, [limoOptimized]);

  const filteredEvents = useMemo(() => {
    const q = eventSearch.trim().toLowerCase();
    if (!q) return eventsWithImages;
    return eventsWithImages.filter(
      (e) => e.title.toLowerCase().includes(q) || e.desc.toLowerCase().includes(q)
    );
  }, [eventSearch, eventsWithImages]);


  return (
    <main className="text-slate-100 bg-[#0f1f46]">
      <StructuredData
        id="limousines-schema"
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Limousine Fleet',
          description: 'Stretch limousine and luxury chauffeur vehicle options for events, weddings, proms and corporate travel.',
          mainEntity: catalogLimos.slice(0,12).map(v => ({
            '@type': 'Product',
            name: v.name,
            description: v.highlights.join(', '),
            additionalProperty: [{ '@type': 'PropertyValue', name: 'Capacity', value: v.capacityMax }],
            offers: { '@type': 'Offer', availability: 'https://schema.org/InStock', priceCurrency: 'USD' },
            image: v.images.map(i => i.entry?.original).filter(Boolean)
          })),
          image: limoOptimized.slice(0,6).map(toImageObject)
        }}
      />
  {/* HERO removed - page now begins at fleet */}

      {/* ---------- FLEET ---------- */}
      <section className="bg-[#122a56] pt-8 pb-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white font-serif tracking-tight">
            Pick Your Limousine
          </h2>
          <p className="text-blue-100/90 text-center max-w-3xl mx-auto mt-3 mb-10">
            From classic stretches to modern Sprinter limos—every ride is clean, comfy, and camera-ready. Choose the size that fits your crew.
          </p>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {catalogLimos.map(v => (
              <VehicleGalleryCard key={v.id} vehicle={v} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- WHY LIMOS ROCK ---------- */}
      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-2 text-white font-serif tracking-tight">
          Why Limousines Rock
        </h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-8">
          Timeless style, pro chauffeurs, and a smooth private ride—arrive relaxed and looking sharp.
        </p>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LIMO_FEATURES.map((f, idx) => (
            <li key={f.label} className="relative">
              <input
                id={`whylimo-${idx}`}
                type="checkbox"
                className="peer sr-only"
                aria-hidden="true"
              />

              <label
                htmlFor={`whylimo-${idx}`}
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

              <div className="hidden peer-checked:flex fixed inset-0 z-50 items-center justify-center p-4">
                <label
                  htmlFor={`whylimo-${idx}`}
                  className="absolute inset-0 bg-black/40 cursor-pointer"
                  aria-label="Close"
                />
                <div className="relative z-10 w-full max-w-md min-h-[300px] bg-gradient-to-br from-[#13306a] to-[#0e2250] border border-blue-800/40 rounded-2xl shadow-2xl">
                  <label
                    htmlFor={`whylimo-${idx}`}
                    className="absolute top-3 right-3 text-blue-100 hover:text-white text-2xl font-bold cursor-pointer"
                    aria-label="Close"
                  >
                    ×
                  </label>
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

      {/* ---------- REVIEWS ---------- */}
      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-white font-serif tracking-tight">
          Customer Reviews
        </h2>
        <div className="w-full flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search reviews by name or keywords…"
            value={reviewSearch}
            onChange={(e) => setReviewSearch(e.target.value)}
            className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredReviews.map((review, i) => (
            <div key={i} className="relative bg-[#12244e] border border-blue-800/30 rounded-2xl shadow-xl p-7 flex flex-col gap-3 hover:scale-[1.02] transition-transform overflow-hidden">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-600 rounded-full w-11 h-11 flex items-center justify-center text-2xl font-bold text-white shadow-lg border border-blue-300/30">
                  {review.name[0]}
                </div>
                <span className="font-bold text-blue-50 text-lg">{review.name}</span>
                <span className="ml-auto text-yellow-300 text-xl">★★★★★</span>
              </div>
              <div className="text-blue-50 text-base leading-relaxed font-medium">
                {review.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <a
            href="/reviews"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700"
          >
            More Reviews
          </a>
        </div>
      </section>

      {/* ---------- LIMO POLLS ---------- */}
      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-2 text-white font-serif tracking-tight">
          Limousine Polls
        </h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-6">
          Real riders. Real opinions. Compare trends and get honest insights to plan the perfect night.
        </p>
        <div className="w-full flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search polls…"
            value={pollSearch}
            onChange={(e) => setPollSearch(e.target.value)}
            className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            aria-label="Search polls"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredPolls.map((poll, idx) => (
            <div key={idx} className="bg-[#12244e] rounded-2xl shadow-xl border border-blue-800/30 p-6 flex flex-col items-center">
              <h3 className="text-xl font-bold text-blue-50 mb-2 text-center">{poll.question}</h3>
              <ul className="text-blue-100 mb-2 text-center">
                {poll.options.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
              <span className="text-blue-200 text-sm">
                Vote on our <a href="/polls" className="underline hover:text-blue-100">polls page</a>!
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <a
            href="/polls"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700"
          >
            More Polls
          </a>
        </div>
      </section>

      {/* ---------- PARTY & COACH PROMO ---------- */}
      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-white font-serif tracking-tight">
          We Also Have Party Buses & Coach Buses
        </h2>
        <p className="text-blue-100 text-center max-w-3xl mx-auto mb-8">
          Need something different? Explore party buses for bigger groups—or go with a coach for simple, comfy transport.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Party Bus */}
          <a href="/party-buses" className="group">
            <div className="rounded-2xl border border-blue-800/30 bg-[#12244e] overflow-hidden shadow-xl">
              <div className="h-96 w-full bg-[#173264]">
                {(() => { const p = getCategoryImages("partyBuses")[0]; return p ? <OptimizedImage entry={p} alt="Party Bus" className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform" /> : <div className="text-blue-100/80 flex items-center justify-center h-full">Party Bus</div>; })()}
              </div>
              <div className="px-6 py-5">
                <h3 className="text-2xl font-extrabold text-white text-center">Party Buses</h3>
                <p className="text-blue-200 text-center">Big energy for 14–45 passengers.</p>
              </div>
            </div>
          </a>
          {/* Coach Bus */}
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
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white font-serif tracking-tight">
            How the Bus2Ride Booking Process Works
          </h2>

          <div className="mt-8 flex flex-col md:flex-row gap-4 md:gap-6 justify-between">
            {[
              { step: "★1", label: "Contact Us", icon: "📞", href: "/contact" },
              { step: "★2", label: "Get a Quote", icon: "💬", href: "/quote#instant" },
              { step: "★3", label: "Reserve Your Ride", icon: "📝", href: "/reserve" },
              { step: "★4", label: "Finalize & Ride", icon: "🎉", href: "/itinerary" },
            ].map((s, idx) => (
              <div key={s.step} className="relative flex-1">
                <input
                  id={`howit-${idx}`}
                  type="checkbox"
                  className="peer sr-only"
                  aria-hidden="true"
                />
                <label
                  htmlFor={`howit-${idx}`}
                  role="button"
                  tabIndex={0}
                  className="block cursor-pointer group bg-[#173264] border border-blue-800/40 rounded-2xl px-5 py-6 text-center hover:border-blue-400/60 hover:shadow-[0_0_0_2px_rgba(96,165,250,.25)] transition"
                  aria-label={`Open details for: ${s.label}`}
                >
                  <div className="text-2xl">{s.icon}</div>
                  <div className="font-extrabold text-white mt-1">
                    {s.step}. {s.label}
                  </div>
                  <div className="mt-1 text-blue-200 text-sm opacity-90 group-hover:opacity-100">
                    Click to continue →
                  </div>
                </label>

                <div className="hidden peer-checked:flex fixed inset-0 z-50 items-center justify-center p-4">
                  <label
                    htmlFor={`howit-${idx}`}
                    className="absolute inset-0 bg-black/40 cursor-pointer"
                    aria-label="Close"
                  />
                  <div className="relative z-10 w-full max-w-lg bg-gradient-to-br from-[#13306a] to-[#0e2250] border border-blue-800/40 rounded-2xl shadow-2xl">
                    <label
                      htmlFor={`howit-${idx}`}
                      className="absolute top-3 right-3 text-blue-100 hover:text-white text-2xl font-bold cursor-pointer"
                      aria-label="Close"
                    >
                      ×
                    </label>
                    <div className="px-6 py-7 text-left">
                      <div className="mx-auto w-14 h-14 rounded-full bg-blue-900/20 border border-blue-700/40 flex items-center justify-center text-3xl mb-4">
                        {s.icon}
                      </div>
                      <h3 className="text-2xl font-extrabold text-white mb-2 font-serif tracking-tight">
                        {s.step}. {s.label}
                      </h3>

                      {/* Contact Us */}
                      {s.label === "Contact Us" && (
                        <div className="text-blue-100/90">
                          <p className="mb-3">Call or email our bookings team — we’re ready to help you plan the perfect trip.</p>
                          <ol className="list-decimal ml-6 space-y-2 mb-3">
                            <li>Tell us the date & time, pickup/dropoff points, and approximate passenger count.</li>
                            <li>Share special requests (restroom on board, wheelchair lift, stops, BYOB, etc.).</li>
                            <li>We’ll confirm availability and suggest vehicle options within 1 business hour (faster by phone).</li>
                          </ol>
                          <p className="text-sm text-blue-200">Hours: Mon–Sun, 8am–10pm local. For urgent same-day needs call us directly.</p>
                        </div>
                      )}

                      {/* Get a Quote (request-based) */}
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
            Limousine Booking Tools
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
              className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text.white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              aria-label="Search tools"
            />
          </div>
          <div className="w-full">
            <ToolsGrid limit={4} randomize={true} />
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
                <div className="h-60 md:h-72 w-full relative">
                  {ev.optimizedEntries && ev.optimizedEntries.length ? (
                    <OptimizedImage entry={ev.optimizedEntries[0]} alt={ev.title} className="w-full h-full object-cover" fillParent priorityIfAbove={2000} />
                  ) : (
                    <SmartImage src={ev.fallback || ev.image} alt={ev.title} className="w-full h-full object-cover" />
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
                      {ev.optimizedEntries.map((entry, idx: number) => (
                        <div key={idx} className="flex-shrink-0 w-24 h-14 rounded overflow-hidden border border-blue-800/40">
                          <OptimizedImage entry={entry as OptimizedImageEntry} alt={`${ev.title} ${idx + 1}`} className="w-full h-full object-cover" minDesiredWidth={200} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

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

  {/* Tools handled by ToolsGrid component (shared registry) */}
    </main>
  );
}
