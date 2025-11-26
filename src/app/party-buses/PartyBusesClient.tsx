"use client";

import React, { useEffect, useMemo, useState } from "react";

import VehicleGalleryCard from "../../components/VehicleGalleryCard";
import StructuredData from "../../components/StructuredData";
import OptimizedImage from "../../components/OptimizedImage";
import { getCategoryImages, toImageObject } from "../../utils/optimizedImages";
import type { HomepageVehicle } from "../../types/homepageVehicles";

const PARTY_FEATURES = [
  {
    label: "Loud Sound Systems",
    icon: "\u{1F3B5}",
    description: "High-quality speakers and Bluetooth hookups to keep the party going.",
    detail: "Our upgraded amps, subwoofers, and Bluetooth pairing let you DJ from any phone without missing a beat.",
  },
  {
    label: "Flexible Layouts",
    icon: "\u{1F4CB}",
    description: "Seating and standing areas configurable for dancing, coolers, and socializing.",
    detail: "Swap in perimeter couches, add dance poles, or keep open space for coolers—each party bus has modular sections we can stage for your itinerary.",
  },
  {
    label: "Large Capacities",
    icon: "\u{1F465}",
    description: "Comfortable options from small private buses to 40+ passenger party rigs.",
    detail: "From 12-person sprinters to 45-passenger coaches, we’ll match the right chassis, so nobody squeezes in the aisle.",
  },
  {
    label: "On-Board Amenities",
    icon: "\u{1F37B}",
    description: "Coolers, lighting, and privacy windows make for a great atmosphere.",
    detail: "LED mood lighting, cup holders, mini-bars, and privacy curtains are stocked before pickup—just BYOB and plug in.",
  },
  {
    label: "Durable Flooring & Safety",
    icon: "\u{1F6A7}",
    description: "Robust interiors and trained drivers keep your group safe and comfortable.",
    detail: "High-traction floors, DOT inspections, and CDL chauffeurs mean you can focus on the fun while we handle compliance.",
  },
  {
    label: "Photo-Ready",
    icon: "\u{1F4F7}",
    description: "Roomy spaces and lighting perfect for group photos and videos.",
    detail: "Mirrored ceilings, LED strips, and panoramic windows create photo backdrops so your posts look as good as the night feels.",
  },
];

interface Props {
  vehicles: HomepageVehicle[];
}

export default function PartyBusesPageClient({ vehicles }: Props) {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  const partyOptimized = useMemo(() => getCategoryImages("partyBuses"), []);

  const catalogPartyBuses = useMemo(() => {
    return [...vehicles].sort((a, b) => (a.capacityMax ?? 0) - (b.capacityMax ?? 0));
  }, [vehicles]);

  useEffect(() => {
    if (activeFeature === null) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveFeature(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeFeature]);

  return (
    <main className="text-slate-100 bg-[#0f1f46]">
      <StructuredData
        id="party-buses-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Party Bus Fleet",
          description: "Browse party bus vehicles for groups, from small to large capacity.",
          mainEntity: catalogPartyBuses.slice(0, 12).map((v) => ({
            "@type": "Product",
            name: v.name,
            description: v.amenities.slice(0, 5).join(", "),
            additionalProperty: v.capacityMax
              ? [{ "@type": "PropertyValue", name: "Capacity", value: v.capacityMax }]
              : undefined,
            offers: { "@type": "Offer", availability: "https://schema.org/InStock", priceCurrency: "USD" },
            image: v.imageUrl ? [v.imageUrl] : [],
          })),
          image: partyOptimized.slice(0, 6).map(toImageObject),
        }}
      />

      <section className="bg-[#122a56] pt-8 pb-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 data-content-key="party_buses.title" className="text-4xl md:text-5xl font-extrabold text-center text-white font-serif tracking-tight">
            Pick Your Party Bus
          </h2>
          <p data-content-key="party_buses.description" className="text-blue-100/90 text-center max-w-3xl mx-auto mt-3 mb-10">
            From minis to mega buses—clean, comfy, and ready for your group.
          </p>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {catalogPartyBuses.map((vehicle) => (
              <VehicleGalleryCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 data-content-key="party_buses.why_title" className="text-4xl md:text-5xl font-extrabold text-center mb-2 text-white font-serif tracking-tight">
          Why Party Buses Rock
        </h2>
        <p data-content-key="party_buses.why_description" className="text-blue-100/90 text-center max-w-3xl mx-auto mb-8">
          Everything you need for a great group night—sound, space, and style.
        </p>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PARTY_FEATURES.map((feature, idx) => (
            <li key={feature.label} className="relative">
              <button
                type="button"
                onClick={() => setActiveFeature(idx)}
                className="group w-full bg-[#12244e] rounded-2xl shadow border border-blue-800/30 px-5 py-4 text-left transition hover:border-blue-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-9 h-9 rounded-full bg-blue-900/20 border border-blue-700/40 flex items-center justify-center text-xl">
                    {feature.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-lg mb-0.5">{feature.label}</div>
                    <div className="text-blue-200 text-sm">{feature.description}</div>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-blue-300">Learn more →</span>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>

        {activeFeature !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
            role="dialog"
            aria-modal="true"
            onClick={() => setActiveFeature(null)}
          >
            <div
              className="relative max-w-lg w-full rounded-3xl border border-blue-700/40 bg-gradient-to-br from-[#173264] to-[#0e1f44] p-6 text-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/5 px-2 py-1 text-sm font-semibold text-white/80 hover:bg-white/10"
                onClick={() => setActiveFeature(null)}
                aria-label="Close feature details"
              >
                Close
              </button>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-900/30 border border-blue-700/40 text-2xl">
                  {PARTY_FEATURES[activeFeature].icon}
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold">{PARTY_FEATURES[activeFeature].label}</h3>
                  <p className="mt-2 text-blue-100/90 text-sm">
                    {PARTY_FEATURES[activeFeature].detail}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-white font-serif tracking-tight">
          We Also Have Limousines & Coach Buses
        </h2>
        <p className="text-blue-100 text-center max-w-3xl mx-auto mb-8">
          Need something different? Explore limousines for elegant arrivals—or go with a coach for simple, comfy transport.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="/limousines" className="group">
            <div className="rounded-2xl border border-blue-800/30 bg-[#12244e] overflow-hidden shadow-xl">
              <div className="h-96 w-full bg-[#173264]">
                {(() => {
                  const p = getCategoryImages("limousines")[0];
                  return p ? (
                    <OptimizedImage entry={p} alt="Limousine" className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform" />
                  ) : (
                    <div className="text-blue-100/80 flex items-center justify-center h-full">Limousine</div>
                  );
                })()}
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
                {(() => {
                  const c = getCategoryImages("coachBuses")[0];
                  return c ? (
                    <OptimizedImage entry={c} alt="Coach Bus" className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform" />
                  ) : (
                    <div className="text-blue-100/80 flex items-center justify-center h-full">Coach Bus</div>
                  );
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
                <input id={`howit-${idx}`} type="checkbox" className="peer sr-only" aria-hidden="true" />
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
                  <div className="mt-1 text-blue-200 text-sm opacity-90 group-hover:opacity-100">Click to continue →</div>
                </label>

                <div className="hidden peer-checked:flex fixed inset-0 z-50 items-center justify-center p-4">
                  <label htmlFor={`howit-${idx}`} className="absolute inset-0 bg-black/40 cursor-pointer" aria-label="Close" />
                  <div className="relative z-10 w-full max-w-lg bg-gradient-to-br from-[#13306a] to-[#0e2250] border border-blue-800/40 rounded-2xl shadow-2xl">
                    <label htmlFor={`howit-${idx}`} className="absolute top-3 right-3 text-blue-100 hover:text-white text-2xl font-bold cursor-pointer" aria-label="Close">
                      ×
                    </label>
                    <div className="px-6 py-7 text-left">
                      <div className="mx-auto w-14 h-14 rounded-full bg-blue-900/20 border border-blue-700/40 flex items-center justify-center text-3xl mb-4">
                        {s.icon}
                      </div>
                      <h3 className="text-2xl font-extrabold text-white mb-2 font-serif tracking-tight">
                        {s.step}. {s.label}
                      </h3>
                      <div className="text-blue-100/90">
                        <p className="mb-3">
                          {s.label === "Contact Us"
                            ? "Call or email our bookings team — we’re ready to help you plan the perfect trip."
                            : s.label === "Get a Quote"
                              ? "Request a written quote — our team reviews your trip details and replies with a confirmed price and available vehicles."
                              : s.label === "Reserve Your Ride"
                                ? "Reserve a vehicle once you’ve chosen a quote — a small deposit secures the booking."
                                : "Final checks and day-of instructions so your trip goes smoothly."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
