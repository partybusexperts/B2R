"use client";

import React, { useEffect, useState } from "react";

const features = [
  { text: "Experienced, friendly reservation team", id: "reservation-team" },
  { text: "Easy online quotes & booking", id: "online-quotes" },
  { text: "Huge selection of vehicles for any group size", id: "vehicle-selection" },
  { text: "1,000,000+ passengers served nationwide", id: "passengers-served" },
  { text: "365-day customer support", id: "customer-support" },
];

const featureContent: Record<string, string> = {
  "reservation-team":
    "Friendly pros who know group travel. We’ll recommend the right vehicle, timing, and route so your trip is smooth from quote to drop-off.",
  "online-quotes":
    "Get instant, transparent pricing online. Customize pickups, stops, and amenities, then book in a few clicks—no hidden fees.",
  "vehicle-selection":
    "From limos and party buses to 56-passenger coaches. Clean, inspected, and matched to your headcount, itinerary, and vibe.",
  "passengers-served":
    "We’ve moved 1,000,000+ riders nationwide. That experience shows up in on-time pickups and stress-free events.",
  "customer-support":
    "Need help before or day-of? We’re available year-round for changes, special requests, and live support when it matters.",
};

export default function WhyRentWithUs() {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleOpen = (id: string) => setOpenId(id);
  const handleClose = () => setOpenId(null);

  // Close on Escape
  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openId]);

  return (
    <>
      <ul className="space-y-4 text-blue-900 text-lg">
        {features.map((feature) => (
          <li
            key={feature.id}
            className="flex items-center bg-white rounded-lg shadow px-4 py-3 hover:bg-blue-50 transition border border-blue-200 cursor-pointer"
          >
            <span className="text-blue-500 text-xl mr-2" aria-hidden>
              ★
            </span>
            <button
              type="button"
              className="flex-1 text-left hover:underline focus:underline outline-none bg-transparent border-none p-0 m-0 cursor-pointer"
              onClick={() => handleOpen(feature.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleOpen(feature.id);
              }}
              aria-label={feature.text}
            >
              {feature.text}
            </button>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {openId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="why-modal-title"
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-[92%] p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-blue-700 text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >
              ×
            </button>
            <h3 id="why-modal-title" className="text-2xl font-bold mb-3 text-blue-900">
              {features.find((f) => f.id === openId)?.text}
            </h3>
            <div className="text-blue-900/90 text-base leading-relaxed">
              {openId ? featureContent[openId] : ""}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
