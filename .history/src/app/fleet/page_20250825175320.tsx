
"use client";

import React from "react";
import Image from "next/image";

/** ---------- Contact constants ---------- */
const PHONE_DISPLAY = "(888) 535-2566";
const PHONE_TEL = "8885352566";
const EMAIL = "info@bus2ride.com";

/** ---------- Your images + helper (kept) ---------- */
const randomImages = [
  "/images/18 Passenger White Party Bus Interior.png",
  "/images/18 Passenger White Party Bus Exterior.png",
  "/images/20 Passenger White Party Bus Exterior.png",
  "/images/36 Passenger Party Bus Exterior 4.png",
  "/images/10 Passenger Black Lincoln Stretch Limo Exterior Black.png",
  "/images/10 Passenger Chrysler 300 Limo Exterior.png",
  "/images/10 Passenger Lincoln Stretch Limo Interior.png",
  "/images/16_Passenger_Stretch_Excursion_Exterior_optimized.jpg",
  "/images/18 Passenger Hummer Limo Interior.png",
  "/images/Bus-1.png",
  "/images/Bus-2.png",
  "/images/Bus-3.png",
  "/images/Bus-4.png",
  "/images/Bus-5.png",
];

function getRandomImage() {
  return randomImages[Math.floor(Math.random() * randomImages.length)];
}

/** ---------- Your vehicles list (kept) ---------- */
const vehicles = [
  {
    name: "Party Buses",
    capacity: 30,
    image: getRandomImage(),
    href: "/party-buses",
    description:
      "Rolling nightlife: perimeter seating, lighting, sound & open space to celebrate in motion.",
  },
  {
    name: "Limousines",
    capacity: 10,
    image: getRandomImage(),
    href: "/limousines",
    description:
      "Classic stretch elegance for weddings, proms & VIP arrivals with privacy divider comfort.",
  },
  {
    name: "Limo Style Sprinter Vans",
    capacity: 14,
    image: getRandomImage(),
    href: "/party-buses", // per instructions limo style sprinters -> party buses fleet page
    description:
      "Luxury van interiors with party lighting & lounge feel for versatile upscale nights out.",
  },
  {
    name: "Executive Style Sprinter Vans",
    capacity: 14,
    image: getRandomImage(),
    href: "/coach-buses", // executive sprinters -> coach bus fleet page
    description:
      "Forward / captain seating, work-friendly environment, perfect for corporate transfers.",
  },
  {
    name: "Shuttle Buses",
    capacity: 24,
    image: getRandomImage(),
    href: "/coach-buses", // shuttle buses -> coach bus fleet page
    description:
      "Efficient group movement for campuses, events, weddings & recurring employee routes.",
  },
  {
    name: "Coach Buses",
    capacity: 50,
    image: getRandomImage(),
    href: "/coach-buses", // coach buses -> coach bus fleet page
    description:
      "Long-haul comfort with reclining seats, undercarriage luggage & smooth highway ride.",
  },
] as const;

/** ---------- Page ---------- */
export default function FleetPage() {
  return (
    <main className="text-slate-100 bg-[#0f1f46]">
      {/* ---------- HERO (matching the styled page) ---------- */}
      <section className="relative overflow-hidden min-h-[520px] md:min-h-[600px] flex flex-col items-center justify-center text-center py-20">
        {/* Primary bright gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-blue-600 to-indigo-900" />
        {/* Subtle sheen overlay to make it pop */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 mix-blend-overlay pointer-events-none" />

        <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold mb-6 tracking-tight font-serif text-white drop-shadow-[0_6px_20px_rgba(0,0,0,.35)]">
          Bus2Ride Fleet
        </h1>
        <p className="relative z-10 text-2xl md:text-3xl max-w-3xl mx-auto mb-10 text-blue-50 font-medium drop-shadow">
          Find the perfect ride for your crew — luxury, comfort, and quotes in seconds.
        </p>

        {/* CTAs */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center w-full max-w-3xl">
          <a
            href={`tel:${PHONE_TEL}`}
            className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] whitespace-nowrap bg-white/95 text-blue-900 hover:bg-white border-blue-200"
          >
            Call {PHONE_DISPLAY}
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] whitespace-nowrap bg-blue-600 text-white hover:bg-blue-700 border-blue-700"
          >
            Email Us
          </a>
          <a
            href="/quote#instant"
            className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] whitespace-nowrap bg-blue-800 text-white hover:bg-blue-900 border-blue-900"
          >
            ⚡ Instant Live Quote
          </a>
        </div>

        {/* Decorative wave divider to separate from darker page */}
        <div className="absolute bottom-[-1px] left-0 right-0">
          <svg viewBox="0 0 1440 110" className="w-full h-[110px]" preserveAspectRatio="none">
            <path
              d="M0,80 C240,130 480,20 720,60 C960,100 1200,40 1440,80 L1440,120 L0,120 Z"
              fill="#122a56"
              opacity="1"
            />
          </svg>
        </div>
      </section>

      {/* ---------- FLEET GRID (styled like the reference) ---------- */}
      <section className="bg-[#122a56] pt-8 pb-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white font-serif tracking-tight">
            Browse Vehicle Types
          </h2>
          <p className="text-blue-100/90 text-center max-w-3xl mx-auto mt-3 mb-10">
            From sleek limos to mega party buses — every ride is clean, comfy, and ready to roll.
          </p>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((v) => (
              <a
                key={v.name}
                href={v.href || `/fleet/${v.name.toLowerCase().replace(/ /g, "-")}`}
                className="bg-[#15305f]/90 border border-blue-800/40 rounded-[24px] shadow-[0_10px_30px_rgba(2,6,23,.35)] overflow-hidden hover:scale-[1.02] transition-transform"
                aria-label={`View details for ${v.name}`}
              >
                {/* header line */}
                <div className="flex items-center justify-between px-6 pt-5 min-h-[28px]">
                  <span className="text-xs font-semibold text-blue-100/90">{v.name}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white border border-blue-300/40">
                    Up to {v.capacity}
                  </span>
                </div>

                {/* image */}
                <div className="px-6 mt-3">
                  <div className="relative h-96 md:h-[26rem] w-full overflow-hidden rounded-2xl border border-blue-800/30 bg-[#18356e] flex items-center justify-center">
                    {/* Next/Image with fill */}
                    <Image
                      src={v.image}
                      alt={v.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </div>

                {/* title + desc */}
                <div className="px-6 mt-5">
                  <h3 className="text-2xl font-extrabold text-white tracking-tight text-center font-serif">
                    {v.name}
                  </h3>
                  <div className="mt-2 text-blue-100/95 text-base text-center min-h-[72px]">
                    {v.description}
                  </div>
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
                      ⚡ Quote
                    </a>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* helper hint */}
          <p className="text-center text-blue-200 mt-10">
            Click a vehicle type to see all available options and details.
          </p>
        </div>
      </section>

      {/* ---------- PROMO (optional section matching style) ---------- */}
      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-3 text-white font-serif tracking-tight">
          Not sure which vehicle fits best?
        </h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-8">
          Tell us about your group size, trip length, and vibe — we’ll match you to the perfect fleet in seconds.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/quote#instant"
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-bold bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 transition"
          >
            ⚡ Get an Instant Quote
          </a>
          <a
            href={`tel:${PHONE_TEL}`}
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-bold bg-white text-blue-900 hover:bg-blue-50 border border-blue-200 transition"
          >
            Call {PHONE_DISPLAY}
          </a>
        </div>
      </section>
    </main>
  );
}
