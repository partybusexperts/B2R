"use client";
import React, { useState } from "react";

const MODAL_INFO = {
  fleet: {
    title: "Our Fleet",
    content: (
      <>
        <p>
          Bus2Ride offers the largest and most modern party bus fleet in the region, with vehicles for every group size and occasion. All buses are meticulously maintained and feature luxury amenities.
        </p>
        <ul className="list-disc pl-6 mt-2 text-blue-100">
          <li>Mini, mid, and mega party buses</li>
          <li>Modern interiors, club lighting, and more</li>
          <li>Options for weddings, proms, corporate, and more</li>
        </ul>
      </>
    ),
  },
  capacity: {
    title: "Max Capacity",
    content: (
      <>
        <p>
          Our largest party buses can accommodate up to 56 passengers, making them perfect for big celebrations, group travel, and events. We also have smaller options for more intimate gatherings.
        </p>
        <ul className="list-disc pl-6 mt-2 text-blue-100">
          <li>8–56 passenger options</li>
          <li>Flexible seating arrangements</li>
          <li>ADA accessible vehicles available</li>
        </ul>
      </>
    ),
  },
  service: {
    title: "Service Area",
    content: (
      <>
        <p>
          We serve a wide area including all major cities and suburbs. If you don’t see your city listed, contact us for a custom quote!
        </p>
        <ul className="list-disc pl-6 mt-2 text-blue-100">
          <li>Greater metro and surrounding areas</li>
          <li>Airport, hotel, and event pickups</li>
          <li>Long-distance and out-of-state trips available</li>
        </ul>
      </>
    ),
  },
};

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gradient-to-br from-blue-900 to-black rounded-2xl shadow-2xl p-8 max-w-lg w-full relative border border-blue-700/40">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-blue-200 hover:text-white text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          ×
        </button>
        <h3 className="text-2xl font-bold mb-4 text-blue-100 font-serif">{title}</h3>
        <div className="text-blue-100 text-base">{children}</div>
      </div>
    </div>
  );
}

export interface StatsStripProps {
  /** Optional: show a Service Area card with these cities as chips. */
  cities?: string[];
  /** Fleet text (default: "25+ party buses") */
  fleetText?: string;
  /** Capacity text (default: "Up to 56 passengers") */
  capacityText?: string;
  /** Number of chips to show before “Show more” (default: 12) */
  maxChips?: number;
  /** Optional: custom search handler. Receives the raw query string. */
  onSearch?: (query: string) => void;
}

/** Optional export: Phoenix ~30mi list (use if you want) */
export const PHOENIX_30MI_CITIES = [
  "Phoenix","Scottsdale","Tempe","Mesa","Chandler","Gilbert","Glendale","Peoria",
  "Avondale","Goodyear","Surprise","Tolleson","Litchfield Park","Paradise Valley",
  "Fountain Hills","Sun City","Sun City West","Youngtown","El Mirage","Guadalupe",
  "Cave Creek","Carefree","Queen Creek","Buckeye"
];

export default function StatsStrip({
  cities,
  fleetText = "25+ party buses",
  capacityText = "Up to 56 passengers",
  maxChips = 12,
}: StatsStripProps) {
  const [expanded, setExpanded] = useState(false);
  const [modal, setModal] = useState<null | "fleet" | "capacity" | "service">(null);

  const hasCities = Array.isArray(cities) && cities.length > 0;
  const shown = hasCities ? (expanded ? cities! : cities!.slice(0, maxChips)) : [];

  return (
    <section className="w-full">
      <div className="relative max-w-3xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl px-6 py-10 flex flex-col items-center mb-8 border border-blue-700/30">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-center text-blue-200 font-serif tracking-tight drop-shadow-lg">
          Why Ride With Bus2Ride?
        </h2>
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center items-center mb-6">
          <button
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm min-w-[200px] hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            onClick={() => setModal("fleet")}
            type="button"
            aria-label="Learn more about our fleet"
          >
            <span className="text-3xl" aria-hidden="true">🚍</span>
            <span>
              <span className="text-xs uppercase tracking-wide text-slate-500 font-semibold block">
                Fleet
              </span>
              <span className="text-base md:text-lg font-bold text-slate-900 block">
                {fleetText}
              </span>
            </span>
          </button>
          <button
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm min-w-[200px] hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            onClick={() => setModal("capacity")}
            type="button"
            aria-label="Learn more about max capacity"
          >
            <span className="text-3xl" aria-hidden="true">👥</span>
            <span>
              <span className="text-xs uppercase tracking-wide text-slate-500 font-semibold block">
                Max Capacity
              </span>
              <span className="text-base md:text-lg font-bold text-slate-900 block">
                {capacityText}
              </span>
            </span>
          </button>
          {hasCities && (
            <div className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm min-w-[200px]">
              <div className="flex items-start gap-3">
                <div className="text-3xl" aria-hidden="true">🌆</div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                    Service Area
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {shown.map((city) => (
                      <span
                        key={city}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                      >
                        {city}
                      </span>
                    ))}
                    {cities!.length > maxChips && (
                      <button
                        type="button"
                        onClick={() => setExpanded((v) => !v)}
                        className="inline-flex items-center rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                        aria-expanded={expanded}
                      >
                        {expanded ? "Show less" : `+${cities!.length - maxChips} more`}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="w-full max-w-2xl mx-auto mt-2">
          <p className="text-lg md:text-xl font-medium text-blue-100 text-center">
            Bus2Ride offers the region’s largest, most modern party bus fleet. Enjoy luxury amenities, professional drivers, and flexible options for any group size. Safety, comfort, and unforgettable experiences—every ride, every time.
          </p>
        </div>
      </div>
      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal ? MODAL_INFO[modal].title : ""}
      >
        {modal ? MODAL_INFO[modal].content : null}
      </Modal>
    </section>
  );
}