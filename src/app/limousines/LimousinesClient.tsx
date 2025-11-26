"use client";

import React, { useEffect, useMemo, useState } from "react";

import VehicleGalleryCard from "../../components/VehicleGalleryCard";
import StructuredData from "../../components/StructuredData";
import OptimizedImage from "../../components/OptimizedImage";
import { getCategoryImages, toImageObject } from "../../utils/optimizedImages";
import type { HomepageVehicle } from "../../types/homepageVehicles";

const LIMO_FEATURES = [
  {
    label: "Private, Smooth Ride",
    icon: "🚘",
    description: "Quiet cabins with plush seating keep the focus on your group—no distractions, just comfort.",
    detail: "Air suspension, partition doors, and soft LED lighting mute city noise so you can sip champagne, rehearse vows, or reset between meetings.",
  },
  {
    label: "Easy, Elegant Arrivals",
    icon: "🚪",
    description: "Low step-ins and wide doors make formal attire and photo moments effortless.",
    detail: "Drivers coordinate with venue staff so gowns stay spotless and photographers get the exact curb shot you planned.",
  },
  {
    label: "Professional Chauffeurs",
    icon: "🤵",
    description: "Trained chauffeurs know timelines, venue docks, and backup routes.",
    detail: "Every limo dispatch includes a vetted chauffeur, dress-code guidelines, and contingency routes in case traffic heats up.",
  },
  {
    label: "Comfort-First Interiors",
    icon: "🛋️",
    description: "Leather seating, chilled glassware, and climate control dialed into your group.",
    detail: "We prep climate settings, stock ice buckets, and stage glassware before pickup so the cabin feels curated the moment you board.",
  },
  {
    label: "Picture-Perfect Look",
    icon: "📸",
    description: "Black or white stretches headline every entrance and exit video.",
    detail: "Polished paint, chrome wheels, and LED accent lighting keep every reel and recap looking high end.",
  },
  {
    label: "Great for Small Crews",
    icon: "👥",
    description: "Ideal for 6–18 passengers when you want luxe without the bus footprint.",
    detail: "Stretch sedans, SUV limos, and Sprinter limos scale to your itinerary so nobody squeezes in or drowns in empty seats.",
  },
];

const CROSS_SELL: Array<{ slug: string; title: string; blurb: string; categoryKey: "partyBuses" | "coachBuses"; alt: string }> = [
  {
    slug: "/party-buses",
    title: "Party Buses",
    blurb: "Wrap-around seating, club lighting, and BYOB-ready interiors when the ride is part of the celebration.",
    categoryKey: "partyBuses",
    alt: "Party bus interior",
  },
  {
    slug: "/coach-buses",
    title: "Coach Buses",
    blurb: "Forward-facing seats, underbody luggage, and long-haul comfort for 30–56 riders.",
    categoryKey: "coachBuses",
    alt: "Coach bus exterior",
  },
];

interface Props {
  vehicles: HomepageVehicle[];
}

export default function LimousinesClient({ vehicles }: Props) {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  const limoImages = useMemo(() => getCategoryImages("limousines"), []);
  const catalogLimousines = useMemo(() => [...vehicles].sort((a, b) => (a.capacityMax ?? 0) - (b.capacityMax ?? 0)), [vehicles]);

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
        id="limousines-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Limousine Fleet",
          description: "Stretch limousines, SUV limos, and luxury sprinters for weddings, galas, and corporate transfers.",
          mainEntity: catalogLimousines.slice(0, 12).map((vehicle) => ({
            "@type": "Product",
            name: vehicle.name,
            description: vehicle.amenities.slice(0, 5).join(", "),
            additionalProperty: vehicle.capacityMax
              ? [{ "@type": "PropertyValue", name: "Capacity", value: vehicle.capacityMax }]
              : undefined,
            offers: { "@type": "Offer", availability: "https://schema.org/InStock", priceCurrency: "USD" },
            image: vehicle.imageUrl ? [vehicle.imageUrl] : [],
          })),
          image: limoImages.slice(0, 6).map(toImageObject),
        }}
      />

      <section className="bg-[#122a56] pt-8 pb-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white font-serif tracking-tight">Pick Your Limousine</h2>
          <p className="text-blue-100/90 text-center max-w-3xl mx-auto mt-3 mb-10">
            Sleek sedans, SUV stretches, and Sprinter limos tuned for weddings, corporate transfers, and VIP arrivals.
          </p>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {catalogLimousines.map((vehicle) => (
              <VehicleGalleryCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-2 text-white font-serif tracking-tight">Why Limousines Rock</h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-8">
          Luxe interiors, pro chauffeurs, and photo-ready style for every milestone moment.
        </p>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LIMO_FEATURES.map((feature, idx) => (
            <li key={feature.label} className="relative">
              <button
                type="button"
                onClick={() => setActiveFeature(idx)}
                className="group w-full bg-[#12244e] rounded-2xl shadow border border-blue-800/30 px-5 py-4 text-left transition hover:border-blue-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-9 h-9 rounded-full bg-blue-900/20 border border-blue-700/40 flex items-center justify-center text-xl">{feature.icon}</div>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" role="dialog" aria-modal="true" onClick={() => setActiveFeature(null)}>
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
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-900/30 border border-blue-700/40 text-2xl">{LIMO_FEATURES[activeFeature].icon}</div>
                <div>
                  <h3 className="text-2xl font-extrabold">{LIMO_FEATURES[activeFeature].label}</h3>
                  <p className="mt-2 text-blue-100/90 text-sm">{LIMO_FEATURES[activeFeature].detail}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-white font-serif tracking-tight">Need More Seats Or A Dance Floor?</h2>
        <p className="text-blue-100 text-center max-w-3xl mx-auto mb-8">
          Limousines keep things intimate. When you need room to mingle or haul the whole crew, these other fleet styles are ready.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CROSS_SELL.map((option) => {
            const fallbackImage = getCategoryImages(option.categoryKey)[0];
            return (
              <a key={option.slug} href={option.slug} className="group">
                <div className="rounded-2xl border border-blue-800/30 bg-[#12244e] overflow-hidden shadow-xl">
                  <div className="h-96 w-full bg-[#173264]">
                    {fallbackImage ? (
                      <OptimizedImage entry={fallbackImage} alt={option.alt} className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform" />
                    ) : (
                      <div className="text-blue-100/80 flex items-center justify-center h-full">{option.title}</div>
                    )}
                  </div>
                  <div className="px-6 py-5">
                    <h3 className="text-2xl font-extrabold text-white text-center">{option.title}</h3>
                    <p className="text-blue-200 text-center">{option.blurb}</p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 my-12">
        <div className="bg-[#122a56] border border-blue-800/30 rounded-3xl shadow-xl px-5 md:px-8 py-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white font-serif tracking-tight">How The Bus2Ride Booking Process Works</h2>

          <div className="mt-8 flex flex-col md:flex-row gap-4 md:gap-6 justify-between">
            {[
              { step: "★1", label: "Contact Us", icon: "📞", href: "/contact" },
              { step: "★2", label: "Get a Quote", icon: "💬", href: "/quote#instant" },
              { step: "★3", label: "Reserve Your Ride", icon: "📝", href: "/reserve" },
              { step: "★4", label: "Finalize & Ride", icon: "🎉", href: "/itinerary" },
            ].map((stage, idx) => (
              <div key={stage.step} className="relative flex-1">
                <input id={`limo-howit-${idx}`} type="checkbox" className="peer sr-only" aria-hidden="true" />
                <label
                  htmlFor={`limo-howit-${idx}`}
                  role="button"
                  tabIndex={0}
                  className="block cursor-pointer group bg-[#173264] border border-blue-800/40 rounded-2xl px-5 py-6 text-center hover:border-blue-400/60 hover:shadow-[0_0_0_2px_rgba(96,165,250,.25)] transition"
                  aria-label={`Open details for: ${stage.label}`}
                >
                  <div className="text-2xl">{stage.icon}</div>
                  <div className="font-extrabold text-white mt-1">
                    {stage.step}. {stage.label}
                  </div>
                  <div className="mt-1 text-blue-200 text-sm opacity-90 group-hover:opacity-100">Tap for details →</div>
                </label>

                <div className="hidden peer-checked:flex fixed inset-0 z-50 items-center justify-center p-4">
                  <label htmlFor={`limo-howit-${idx}`} className="absolute inset-0 bg-black/40 cursor-pointer" aria-label="Close" />
                  <div className="relative z-10 w-full max-w-lg bg-gradient-to-br from-[#13306a] to-[#0e2250] border border-blue-800/40 rounded-2xl shadow-2xl">
                    <label htmlFor={`limo-howit-${idx}`} className="absolute top-3 right-3 text-blue-100 hover:text-white text-2xl font-bold cursor-pointer" aria-label="Close">
                      ×
                    </label>
                    <div className="px-6 py-7 text-left">
                      <div className="mx-auto w-14 h-14 rounded-full bg-blue-900/20 border border-blue-700/40 flex items-center justify-center text-3xl mb-4">{stage.icon}</div>
                      <h3 className="text-2xl font-extrabold text-white mb-2 font-serif tracking-tight">
                        {stage.step}. {stage.label}
                      </h3>
                      <div className="text-blue-100/90">
                        <p className="mb-3">
                          {stage.label === "Contact Us"
                            ? "Call or email our bookings team with your date, pickup window, and passenger count. We’ll shortlist limos in minutes."
                            : stage.label === "Get a Quote"
                              ? "We confirm availability, outline the itinerary, and send a written quote with every fee spelled out."
                              : stage.label === "Reserve Your Ride"
                                ? "Approve the quote, sign digitally, and place a deposit to lock the vehicle and chauffeur."
                                : "Share final pickup details 24–48 hours out—then enjoy door-to-door service on event day."}
                        </p>
                        <a
                          href={stage.href}
                          className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-bold bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 transition"
                        >
                          Go to {stage.label}
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
    </main>
  );
}
