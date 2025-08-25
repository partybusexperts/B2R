"use client";

import React, { useState } from "react";

type Feature = { text: string; id: string };

const features: Feature[] = [
  { text: "Experienced Reservation Team", id: "reservation-team" },
  { text: "Easy Online Quotes & Booking (All-Inclusive)", id: "all-in-quotes" },
  { text: "Wide Selection of Newer Vehicles", id: "newer-vehicle-selection" },
  { text: "Flexible Scheduling", id: "flexible-scheduling" },
];

const featureContent: Record<string, string> = {
  "reservation-team":
    "Talk with specialists who book group transportation every day. We’ll match the vehicle and timing to your plan and flag overtime risks. Clear answers fast—no pushy sales.",
  "all-in-quotes":
    "You get one total that already includes gratuity, taxes, fuel/admin fees, and typical tolls. We send it in writing for easy apples-to-apples comparison. No hidden line items.",
  "newer-vehicle-selection":
    "Late-model limos, sprinters, party buses, and coaches. Quieter rides, stronger A/C, brighter lighting, and better sound. Tell us your vibe and headcount—we’ll recommend the best fit.",
  "flexible-scheduling":
    "Choose exact pickup windows, split transfers, or standby returns. Off-peak times (Sun–Thu/daytime) can unlock lower minimums and better selection. We’ll build a schedule that avoids overtime rounding.",
};

export default function WhyRentWithUs() {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleOpen = (id: string) => setOpenId(id);
  const handleClose = () => setOpenId(null);

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
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-7 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-blue-700 text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-3 text-blue-900">
              {features.find((f) => f.id === openId)?.text}
            </h3>
            <div
              className="text-blue-900/90 text-base leading-relaxed"
              style={{ maxHeight: 280, overflowY: "auto" }}
            >
              {featureContent[openId]}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
