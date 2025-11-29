"use client";

import React, { useEffect, useMemo, useState } from "react";
import VehicleGalleryCard from "../../components/VehicleGalleryCard";
import StructuredData from "../../components/StructuredData";
import OptimizedImage from "../../components/OptimizedImage";
import { getCategoryImages, toImageObject } from "../../utils/optimizedImages";
import type { HomepageVehicle } from "../../types/homepageVehicles";

const COACH_FEATURES = [
  {
    label: "Reclining High-Back Seats",
    icon: "💺",
    description: "Forward-facing captain seats keep everyone relaxed on multi-hour itineraries.",
    detail: "We stage clean seatbacks, armrests, and drop-down footrests so your team actually naps between tournament rounds.",
  },
  {
    label: "Professional Charter Drivers",
    icon: "🧑‍✈️",
    description: "CDL drivers with DOT-compliant hours, safety briefings, and route plans.",
    detail: "Each charter is dispatched with federally logged hours, backup drivers for overnights, and real-time dispatch support.",
  },
  {
    label: "Wi-Fi & Power",
    icon: "📶",
    description: "Most late-model coaches include Wi-Fi routers and USB/110v at the seats.",
    detail: "Lock in productivity with onboard routers, USB charging, and aisle-side outlets so laptops never die mid-route.",
  },
  {
    label: "Serious Luggage Capacity",
    icon: "🧳",
    description: "Underbody bays swallow suitcases, gear trunks, and golf or band cases.",
    detail: "We map load plans ahead of time so the gear you need first gets staged closest to the curb at each stop.",
  },
  {
    label: "Overhead Parcel Racks",
    icon: "🧷",
    description: "Keep backpacks and essentials above the seats for quick access.",
    detail: "Open parcel racks and aisle lighting reduce clutter so passengers can grab jackets, snacks, and chargers without digging through bays.",
  },
  {
    label: "Onboard Restrooms",
    icon: "🚻",
    description: "40+ passenger coaches typically include a fresh restroom for long legs.",
    detail: "We service and restock restrooms before every charter so overnight trips stay comfortable without unplanned exits.",
  },
];

const CROSS_SELL = [
  {
    slug: "/party-buses",
    title: "Party Buses",
    blurb: "Wrap-around seating, club lighting, and sound systems for social nights.",
    categoryKey: "partyBuses" as const,
    alt: "Party Bus",
  },
  {
    slug: "/limousines",
    title: "Limousines",
    blurb: "Stretch sedans & SUV limos for black-tie arrivals and photo moments.",
    categoryKey: "limousines" as const,
    alt: "Limousine",
  },
];

interface Props {
  vehicles: HomepageVehicle[];
}

export default function CoachBusesClient({ vehicles }: Props) {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const coachImages = useMemo(() => getCategoryImages("coachBuses"), []);
  const partyPreview = useMemo(() => getCategoryImages("partyBuses")[0] ?? null, []);
  const limoPreview = useMemo(() => getCategoryImages("limousines")[0] ?? null, []);

  const catalogCoaches = useMemo(() => {
    return [...vehicles].sort((a, b) => (a.capacityMax ?? 0) - (b.capacityMax ?? 0));
  }, [vehicles]);

  useEffect(() => {
    if (activeFeature === null) return undefined;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveFeature(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeFeature]);

  const previewByKey: Record<string, ReturnType<typeof getCategoryImages>[number] | null> = {
    partyBuses: partyPreview,
    limousines: limoPreview,
  };

  return (
    <main className="text-slate-100 bg-[#0f1f46]">
      <StructuredData
        id="coach-buses-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Coach & Charter Bus Fleet",
          description: "View charter coach and motorcoach options including mini, mid, and full-size vehicles with ADA and luggage upgrades.",
          mainEntity: catalogCoaches.slice(0, 12).map((v) => ({
            "@type": "Product",
            name: v.name,
            description: v.amenities.slice(0, 5).join(", "),
            additionalProperty: v.capacityMax
              ? [{ "@type": "PropertyValue", name: "Capacity", value: v.capacityMax }]
              : undefined,
            offers: { "@type": "Offer", availability: "https://schema.org/InStock", priceCurrency: "USD" },
            image: v.imageUrl ? [v.imageUrl] : [],
          })),
          image: coachImages.slice(0, 6).map(toImageObject),
        }}
      />

      <section className="bg-[#122a56] pt-8 pb-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white font-serif tracking-tight">Choose Your Coach Bus</h2>
          <p className="text-blue-100/90 text-center max-w-3xl mx-auto mt-3 mb-10">
            From 24-passenger mini coaches to double-axle motorcoaches—pick the capacity and amenities your run demands.
          </p>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {catalogCoaches.map((vehicle) => (
              <VehicleGalleryCard key={vehicle.id} vehicle={vehicle} highlightDetailCta />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-2 text-white font-serif tracking-tight">Why Coach Buses Work Best</h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-8">
          Charter coaches deliver the logistics trifecta—comfort, luggage, and pro drivers that keep large groups moving on time.
        </p>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COACH_FEATURES.map((feature, idx) => (
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
                  {COACH_FEATURES[activeFeature].icon}
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold">{COACH_FEATURES[activeFeature].label}</h3>
                  <p className="mt-2 text-blue-100/90 text-sm">{COACH_FEATURES[activeFeature].detail}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-white font-serif tracking-tight">We Also Offer Party Buses & Limousines</h2>
        <p className="text-blue-100 text-center max-w-3xl mx-auto mb-8">
          Need nightlife seating or a smaller profile? Tap into the other fleets and keep the same booking team.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CROSS_SELL.map((card) => {
            const preview = previewByKey[card.categoryKey];
            return (
              <a key={card.slug} href={card.slug} className="group">
                <div className="rounded-2xl border border-blue-800/30 bg-[#12244e] overflow-hidden shadow-xl">
                  <div className="h-96 w-full bg-[#173264]">
                    {preview ? (
                      <OptimizedImage entry={preview} alt={card.alt} className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform" />
                    ) : (
                      <div className="text-blue-100/80 flex h-full items-center justify-center">{card.title}</div>
                    )}
                  </div>
                  <div className="px-6 py-5">
                    <h3 className="text-2xl font-extrabold text-white text-center">{card.title}</h3>
                    <p className="text-blue-200 text-center">{card.blurb}</p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 my-12">
        <div className="bg-[#122a56] border border-blue-800/30 rounded-3xl shadow-xl px-5 md:px-8 py-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white font-serif tracking-tight">How the Bus2Ride Booking Process Works</h2>

          <div className="mt-8 flex flex-col md:flex-row gap-4 md:gap-6 justify-between">
            {[
              { step: "★1", label: "Send Trip Details", icon: "🗺️", copy: "Share cities, passenger count, luggage, and any ADA or multi-day needs—our charters team replies fast." },
              { step: "★2", label: "Get a Written Quote", icon: "💬", copy: "We price based on mileage, driver hours, coach size, and peak dates—no hidden fuel or toll fees." },
              { step: "★3", label: "Reserve & Dispatch", icon: "📝", copy: "Approve the quote, sign digitally, and place a deposit to dispatch your vehicle and driver." },
              { step: "★4", label: "Finalize & Ride", icon: "🚌", copy: "Confirm manifests 24–48 hours ahead. Day-of, we text driver info and roll call support." },
            ].map((step) => (
              <div key={step.step} className="relative flex-1 rounded-2xl border border-blue-800/30 bg-[#173264] px-5 py-6 text-center shadow">
                <div className="text-2xl">{step.icon}</div>
                <div className="font-extrabold text-white mt-1">
                  {step.step}. {step.label}
                </div>
                <p className="mt-2 text-sm text-blue-200/90">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
