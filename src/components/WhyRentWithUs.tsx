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
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur" onClick={handleClose} aria-hidden />
          <div
            className="relative z-10 w-full max-w-xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-[0_40px_120px_rgba(2,6,23,0.85)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="why-rent-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-full border border-white/20 p-2 text-white/70 hover:text-white hover:border-white/40"
              aria-label="Close"
            >
              ✕
            </button>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-200/80">Why Book With Us</p>
            <h3 id="why-rent-modal-title" className="mt-2 text-3xl font-extrabold text-white">
              {features.find((f) => f.id === openId)?.text}
            </h3>
            <div className="mt-4 max-h-72 overflow-y-auto text-blue-100/90 text-base leading-relaxed">
              {featureContent[openId]}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Close
              </button>
              <a href="/quote#instant" className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-blue-900 shadow hover:bg-slate-100">
                Get an Instant Quote
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
