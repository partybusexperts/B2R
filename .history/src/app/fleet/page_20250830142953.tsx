"use client";

import React, { useMemo, useState } from "react";
import ToolsGrid from "../../components/tools/ToolsGrid";
import HomePolls from "../../components/HomePolls";
import { getCategoryImages, findByFileName } from "../../utils/optimizedImages";
import { resolveVehicles } from "../../data/vehicles";
import VehicleGalleryCard from "../../components/VehicleGalleryCard";
import StructuredData from "../../components/StructuredData";
import OptimizedImage from "../../components/OptimizedImage";

const PHONE_DISPLAY = "(888) 535-2566";
const PHONE_TEL = "8885352566";
const EMAIL = "info@bus2ride.com";

const topCategoryOrder: { key: string; label: string; match: (cat: string) => boolean; href: string }[] = [
  { key: "limousines", label: "Limousines", match: (c) => c === "limousines", href: "/limousines" },
  { key: "party", label: "Party Buses", match: (c) => /party/i.test(c) || c === "partyBuses", href: "/party-buses" },
  { key: "coaches", label: "Coach Buses", match: (c) => /coach/i.test(c) || c === "coachBuses", href: "/coaches" },
  { key: "shuttles", label: "Shuttles", match: (c) => /shuttle/i.test(c), href: "/shuttles" },
];

const POLLS = [
  { question: "What matters most when booking a vehicle?", options: ["Price", "Size", "Availability", "Amenities"] },
  { question: "Would you split the cost with your group?", options: ["Yes", "Sometimes", "No"] },
];

const REVIEWS = [
  { name: "Paul P.", text: "Absolutely excellent! Great customer service! The price was very good. The driver was professional. The vehicle looked pristine." },
  { name: "Jessie A.", text: "The company you need to call for any event. Prices and vehicles are like no other." },
  { name: "Dee C.", text: "Used them for our bachelorette and wedding—fantastic! Highly recommend." },
];

export default function FleetPage() {
  const [toolSearch, setToolSearch] = useState("");
  const [reviewSearch, setReviewSearch] = useState("");
  const [pollSearch, setPollSearch] = useState("");

  const catalog = useMemo(() => resolveVehicles(findByFileName), []);

  const filteredReviews = useMemo(() => {
    const q = reviewSearch.trim().toLowerCase();
    if (!q) return REVIEWS;
    return REVIEWS.filter((r) => r.name.toLowerCase().includes(q) || r.text.toLowerCase().includes(q));
  }, [reviewSearch]);

  const filteredPolls = useMemo(() => {
    const q = pollSearch.trim().toLowerCase();
    if (!q) return POLLS;
    return POLLS.filter((p) => p.question.toLowerCase().includes(q) || p.options.some((o) => o.toLowerCase().includes(q)));
  }, [pollSearch]);

  return (
    <main className="text-slate-100 bg-[#0f1f46]">
      <StructuredData
        id="fleet-schema"
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Fleet',
          description: 'Explore limousines, party buses, coaches, and shuttles for events and group transport.',
          mainEntity: catalog.slice(0, 12).map((v) => ({ '@type': 'Product', name: v.name, image: v.images.map(i => i.entry?.original).filter(Boolean) })),
        }}
      />

      {/* ---------- FLEET GRID ---------- */}
      <section className="bg-[#122a56] pt-8 pb-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white font-serif tracking-tight">Browse Vehicle Types</h2>
          <p className="text-blue-100/90 text-center max-w-3xl mx-auto mt-3 mb-10">From sleek limos to mega party buses — every ride is clean, comfy, and ready to roll.</p>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {topCategoryOrder.map((group) => {
              const vehicles = catalog.filter((v) => group.match(v.category)).slice(0, 3);
              if (!vehicles.length) return null;
              return (
                <a key={group.key} href={group.href} className="block" aria-label={`View ${group.label}`}>
                  <VehicleGalleryCard vehicle={vehicles[0]} showCTA={false} />
                  <div className="px-6 pb-6 pt-4 -mt-2">
                    <a href={group.href} className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 font-bold bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 transition">View {group.label}</a>
                  </div>
                </a>
              );
            })}
          </div>

          <p className="text-center text-blue-200 mt-10">Click a vehicle type to see all available options and details.</p>
        </div>
      </section>

      {/* ---------- PROMO ---------- */}
      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-3 text-white font-serif tracking-tight">Not sure which vehicle fits best?</h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-8">Tell us about your group size, trip length, and vibe — we’ll match you to the perfect fleet in seconds.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/quote#instant" className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-bold bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 transition">Get an Instant Quote</a>
          <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-bold bg-white text-blue-900 hover:bg-blue-50 border border-blue-200 transition">Call {PHONE_DISPLAY}</a>
        </div>
      </section>

      {/* ---------- REVIEWS (added below promo) ---------- */}
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

      {/* ---------- POLLS (added below reviews) - replaced with reusable HomePolls ---------- */}
      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-2 text-white font-serif tracking-tight">Fleet Polls</h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-6">Real riders. Real opinions. Compare trends and get honest insights to plan the perfect group trip.</p>
        <div className="max-w-6xl mx-auto">
          {/* HomePolls auto-selects 3 categories and shows 3 items per column, with a horizontal rail for the rest. */}
          <HomePolls pickSize={150} visiblePerGroup={3} />
        </div>
        <div className="flex justify-center mt-10">
          <a href="/polls" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700">More Polls</a>
        </div>
      </section>

      {/* ---------- TOOLS (added below polls) ---------- */}
      <section className="w-full bg-gradient-to-br from-[#122a5c] to-[#0f2148] py-16 md:py-20 border-t border-blue-800/30">
        <div className="max-w-6xl mx-auto flex flex-col items-center px-4 md:px-0">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-3 font-serif tracking-tight text-white">Fleet Tools</h2>
          <p className="text-lg md:text-xl text-blue-100 text-center max-w-2xl font-medium mb-8">Click a tool to open it in a perfectly-sized modal—some are compact, others full-width. Use them right here.</p>
          <div className="w-full flex justify-center mb-8">
            <input type="text" placeholder="Search tools..." value={toolSearch} onChange={(e) => setToolSearch(e.target.value)} className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition" aria-label="Search tools" />
          </div>
          <div className="w-full max-w-6xl">
            <ToolsGrid limit={4} filter={toolSearch} randomize={true} />
          </div>
          <div className="flex justify-center mt-10">
            <a href="/tools" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700">More Tools</a>
          </div>
        </div>
      </section>
    </main>
  );
}
