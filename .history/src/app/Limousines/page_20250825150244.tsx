"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";

type Limo = {
  name: string;
  capacity: number;
  style: string;
  highlights: string[];
  image?: string;
  badge?: string;
};

const PHONE_DISPLAY = "(888) 535-2566";
const PHONE_TEL = "8885352566";
const EMAIL = "info@bus2ride.com";

const LIMO_IMAGES = [
  "/images/10 Passenger Lincoln Stretch Limo Exterior 2.png",
  "/images/10 Passenger Lincoln Stretch Limo Interior.png",
  "/images/18 Passenger Hummer Limo Exterior.png",
  "/images/18 Passenger Hummer Limo Inside.png",
  "/images/18 Passenger Ford Excursion Limo Exterior 2.png",
  "/images/18 Passenger Cadillac Escalade Limo Exterior.png",
  "/images/16_Passenger_Stretch_Excursion_Exterior_optimized.jpg",
  "/images/10 Passenger Chrysler 300 Limo Exterior.png",
];

const LIMOS: Limo[] = [
  {
    name: "Classic Lincoln Stretch (10 Pax)",
    capacity: 10,
    style: "Traditional Stretch",
    highlights: ["Leather seating", "Bluetooth / AUX", "Soft accent lighting"],
    badge: "Popular",
  },
  {
    name: "Chrysler 300 Stretch (12 Pax)",
    capacity: 12,
    style: "Modern Stretch",
    highlights: ["Wrap seating", "Star ceiling", "Rear controls"],
    badge: "Modern",
  },
  {
    name: "Ford Excursion Stretch (16 Pax)",
    capacity: 16,
    style: "SUV Stretch",
    highlights: ["High headroom", "Upgraded sound", "Ambient LEDs"],
  },
  {
    name: "Cadillac Escalade Stretch (18 Pax)",
    capacity: 18,
    style: "SUV Stretch",
    highlights: ["VIP look", "Color wash lighting", "Multiple bar stations"],
    badge: "Premium",
  },
  {
    name: "Hummer H2 Stretch (18–20 Pax)",
    capacity: 20,
    style: "SUV Stretch",
    highlights: ["Wide cabin", "Subwoofer system", "Ceiling + floor LEDs"],
    badge: "Iconic",
  },
  {
    name: "Sprinter Limo Coach (14 Pax)",
    capacity: 14,
    style: "Sprinter",
    highlights: ["Walk-in height", "Forward + perimeter mix", "USB charging"],
    badge: "Comfort",
  },
];

const LIMO_FEATURES = [
  {
    icon: "🧊",
    title: "Wet Bars Keep Drinks Cold",
    desc: "Built‑in wet bars to store your beverages & keep them chilled. Ask about ice and waters so they’re onboard when you arrive.",
  },
  {
    icon: "💡",
    title: "LED & Star Ceilings",
    desc: "Color‑changing ceiling, floor, and pillar lighting sets the mood instantly for weddings, proms, or nights out.",
  },
  {
    icon: "🎵",
    title: "Premium Audio",
    desc: "Bluetooth plus backup AUX—bring a playlist downloaded for spotty coverage. Subwoofers on larger SUV stretches.",
  },
  {
    icon: "🛋️",
    title: "Plush Leather Seating",
    desc: "Wrap or J‑style seating keeps the group facing each other—easy conversation, photos, and celebration.",
  },
  {
    icon: "🚪",
    title: "Chauffeur Service",
    desc: "Professional, licensed driver handles routing, timing, and staging. Focus on your event—not the logistics.",
  },
  {
    icon: "🕒",
    title: "Flexible Booking",
    desc: "Split transfers (out + return) or continuous charter blocks. Ask if off‑peak timing can cut the minimum.",
  },
];

const FAQ = [
  {
    q: "How far in advance should I book?",
    a: "Peak Saturdays and prom season: 4–8 weeks. Other dates: 2–3 weeks is often fine. Last‑minute? Still ask—standby deals happen.",
  },
  {
    q: "Are quotes all‑in?",
    a: "Ours are all‑in when labeled—base rate, tips, taxes, fuel/admin, typical tolls. Always compare all‑in vs all‑in.",
  },
  {
    q: "Can we bring alcohol?",
    a: "21+ groups in most areas can BYOB. Avoid glass when possible. Confirm local/state rules and any restrictions beforehand.",
  },
  {
    q: "Is overtime billed higher?",
    a: "Often yes and rounded to 30 or 60 minutes. Build a 15–30 minute buffer into your planned return to avoid it.",
  },
  {
    q: "Do limos have restrooms?",
    a: "No. If you need an onboard restroom, consider a larger party bus or coach for the legroom + facilities.",
  },
];

export default function LimousinesPage() {
  const [search, setSearch] = useState("");
  const [openFeature, setOpenFeature] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const limosWithImages = useMemo(
    () =>
      LIMOS.map((l, i) => ({
        ...l,
        image: LIMO_IMAGES[i % LIMO_IMAGES.length],
      })),
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return limosWithImages;
    return limosWithImages.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.style.toLowerCase().includes(q) ||
        l.highlights.some((h) => h.toLowerCase().includes(q))
    );
  }, [search, limosWithImages]);

  const closeModals = useCallback(() => {
    setOpenFeature(null);
    setOpenFaq(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModals();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeModals]);

  return (
    <main className="text-slate-100 bg-[#0f1f46]">
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[480px] md:min-h-[560px] flex flex-col items-center justify-center text-center py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-400 via-blue-600 to-indigo-900" />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/15 via-transparent to-white/10 pointer-events-none" />
        <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold mb-5 tracking-tight font-serif text-white drop-shadow-[0_6px_20px_rgba(0,0,0,.35)]">
          Limousine Fleet
        </h1>
        <p className="relative z-10 text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-blue-50 font-medium">
          Modern stretch limos, SUV stretches & luxury sprinter limos—clean, on‑time, and ready for your event.
        </p>
        <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`tel:${PHONE_TEL}`}
              className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[200px] bg-white/95 text-blue-900 hover:bg-white border-blue-200"
            >
              Call {PHONE_DISPLAY}
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[200px] bg-blue-600 text-white hover:bg-blue-700 border-blue-700"
            >
              Email Us
            </a>
            <a
              href="/quote#instant"
              className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[200px] bg-blue-800 text-white hover:bg-blue-900 border-blue-900"
            >
              ⚡ Instant Quote
            </a>
        </div>
        <div className="absolute bottom-[-1px] left-0 right-0">
          <svg viewBox="0 0 1440 100" className="w-full h-[100px]" preserveAspectRatio="none">
            <path
              d="M0,70 C240,120 480,20 720,55 C960,90 1200,40 1440,75 L1440,120 L0,120 Z"
              fill="#102750"
            />
          </svg>
        </div>
      </section>

      {/* FLEET */}
      <section className="bg-[#102750] pt-8 pb-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white font-serif tracking-tight">
            Pick Your Limousine
          </h2>
            <p className="text-blue-100/90 text-center max-w-3xl mx-auto mt-3 mb-8">
              Choose the size & style that fits your group. All-in quotes include tips, taxes, fuel & typical fees.
            </p>
          <div className="flex justify-center mb-8">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, style or feature…"
              aria-label="Search limousines"
              className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/40 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((limo) => (
              <div
                key={limo.name}
                className="bg-[#15305f]/90 border border-blue-800/40 rounded-[24px] shadow-[0_10px_30px_rgba(2,6,23,.35)] overflow-hidden flex flex-col"
              >
                <div className="flex items-center justify-between px-6 pt-5 min-h-[28px]">
                  <span className="text-xs font-semibold text-blue-100/90">
                    {limo.style}
                  </span>
                  {limo.badge ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white border border-blue-300/40">
                      {limo.badge}
                    </span>
                  ) : (
                    <span className="h-[18px]" />
                  )}
                </div>
                <div className="px-6 mt-3">
                  <div className="h-72 w-full overflow-hidden rounded-2xl border border-blue-800/30 bg-[#18356e] flex items-center justify-center">
                    {limo.image ? (
                      <img
                        src={limo.image}
                        alt={limo.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-blue-100/80 text-sm">Preview</div>
                    )}
                  </div>
                </div>
                <div className="px-6 mt-5 flex-1">
                  <h3 className="text-2xl font-extrabold text-white tracking-tight text-center">
                    {limo.name}
                  </h3>
                  <div className="mt-1 mb-4 text-sm font-semibold text-blue-200 text-center">
                    Seats up to {limo.capacity}
                  </div>
                  <ul className="text-blue-100/95 text-[0.95rem] space-y-1">
                    {limo.highlights.slice(0, 4).map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <span className="mt-[2px]">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
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
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center text-blue-100/80">
                No limos match your search.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-2 text-white font-serif tracking-tight">
          Why Ride in a Limo
        </h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-8">
          Comfort, style, and the perfect setting for weddings, proms, corporate nights & milestone celebrations.
        </p>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LIMO_FEATURES.map((f) => (
            <li key={f.title}>
              <button
                onClick={() => setOpenFeature(f.title)}
                className="group w-full text-left bg-[#12244e] rounded-2xl shadow border border-blue-800/30 px-5 py-4 text-blue-50 hover:scale-105 transition-transform"
                aria-haspopup="dialog"
                aria-controls="feature-modal"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-900/20 border border-blue-700/40 flex items-center justify-center text-xl group-hover:bg-blue-700/30 transition">
                    {f.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-lg leading-snug">
                      {f.title}
                    </div>
                    <div className="text-blue-200 text-sm mt-1">{f.desc}</div>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="max-w-5xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-6 text-white font-serif tracking-tight">
          Limo FAQs
        </h2>
        <ul className="space-y-4">
          {FAQ.map((item) => (
            <li key={item.q}>
              <button
                onClick={() => setOpenFaq(item.q)}
                className="w-full text-left bg-[#12244e] border border-blue-800/30 rounded-xl px-5 py-4 hover:border-blue-400/60 transition"
                aria-haspopup="dialog"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">{item.q}</span>
                  <span className="text-blue-300">→</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
        <div className="text-center mt-10">
          <a
            href="/quote#instant"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700"
          >
            Get an All-In Quote
          </a>
        </div>
      </section>

      {/* FEATURE MODAL */}
      {openFeature && (
        <div
          id="feature-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            role="dialog"
            aria-modal="true"
          onClick={closeModals}
        >
          <div
            className="w-full max-w-lg bg-gradient-to-br from-[#13306a] to-[#0e2250] border border-blue-800/40 rounded-2xl shadow-2xl relative p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close feature details"
              onClick={closeModals}
              className="absolute top-3 right-3 text-blue-100 hover:text-white text-2xl font-bold"
            >
              ×
            </button>
            <h3 className="text-2xl font-extrabold text-white mb-3 font-serif tracking-tight">
              {openFeature}
            </h3>
            <p className="text-blue-100/90">
              {
                LIMO_FEATURES.find((f) => f.title === openFeature)?.desc
              }
            </p>
          </div>
        </div>
      )}

      {/* FAQ MODAL */}
      {openFaq && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={closeModals}
        >
          <div
            className="w-full max-w-lg bg-gradient-to-br from-[#13306a] to-[#0e2250] border border-blue-800/40 rounded-2xl shadow-2xl relative p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close FAQ"
              onClick={closeModals}
              className="absolute top-3 right-3 text-blue-100 hover:text-white text-2xl font-bold"
            >
              ×
            </button>
            <h3 className="text-2xl font-extrabold text-white mb-3 font-serif tracking-tight">
              {openFaq}
            </h3>
            <p className="text-blue-100/90">
              {FAQ.find((f) => f.q === openFaq)?.a}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}