"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";

type Coach = {
  name: string;
  capacity: number;
  category: string;
  highlights: string[];
  image?: string;
  badge?: string;
};

const PHONE_DISPLAY = "(888) 535-2566";
const PHONE_TEL = "8885352566";
const EMAIL = "info@bus2ride.com";

const COACH_IMAGES = [
  "/images/Bus-1.png",
  "/images/Bus-2.png",
  "/images/Bus-3.png",
  "/images/Bus-4.png",
  "/images/Bus-5.png",
];

const COACHES: Coach[] = [
  {
    name: "Mini Coach (22–24 Pax)",
    capacity: 24,
    category: "Mini",
    highlights: ["Forward seating", "A/C & heat", "Clean interior"],
    badge: "Popular",
  },
  {
    name: "Mini Coach (28–30 Pax)",
    capacity: 30,
    category: "Mini",
    highlights: ["USB charging (select)", "Luggage space", "Great for shuttles"],
  },
  {
    name: "Mid Coach (34–38 Pax)",
    capacity: 38,
    category: "Mid",
    highlights: ["Reclining seats", "Overhead storage", "PA system"],
  },
  {
    name: "Full Coach (50–54 Pax)",
    capacity: 54,
    category: "Full-Size",
    highlights: ["Restroom", "TV monitors", "Climate control"],
    badge: "Fleet Standard",
  },
  {
    name: "Premium Coach (56 Pax)",
    capacity: 56,
    category: "Full-Size",
    highlights: ["Wi‑Fi (select)", "110V/USB power", "Extra under-bay cargo"],
    badge: "Premium",
  },
  {
    name: "Executive Coach (40 Pax)",
    capacity: 40,
    category: "Executive",
    highlights: ["Leather seating", "Tables (select)", "Ambient lighting"],
    badge: "Executive",
  },
];

const COACH_FEATURES = [
  {
    icon: "🧳",
    title: "Luggage Capacity",
    desc: "Under‑bay + overhead storage—ideal for airport runs, tours, retreats, and sports travel.",
  },
  {
    icon: "🔌",
    title: "Power & Wi‑Fi (Select)",
    desc: "Many coaches offer Wi‑Fi & outlets. Always confirm availability & data limits before relying on it.",
  },
  {
    icon: "🛋️",
    title: "Comfort Seating",
    desc: "Reclining high‑back seats with climate control help long trips feel shorter and more productive.",
  },
  {
    icon: "🚻",
    title: "Onboard Restroom",
    desc: "Great backup for longer legs—still plan real breaks every 2–3 hours for comfort.",
  },
  {
    icon: "🎤",
    title: "PA & AV Systems",
    desc: "Make announcements or play media through installed monitors. Ideal for tours & team travel.",
  },
  {
    icon: "🧊",
    title: "Cooler / Refresh Options",
    desc: "Ask about adding a cooler kit, ice & waters—simple add-ons that keep groups fresh & hydrated.",
  },
];

const FAQ = [
  {
    q: "How early should I book a full-size coach?",
    a: "For peak weekends and spring/fall travel season: 4–6 weeks. Otherwise 2–3 weeks is usually fine.",
  },
  {
    q: "Is Wi‑Fi guaranteed?",
    a: "No—confirm make/model and whether Wi‑Fi & outlets are active. Have offline backups for media.",
  },
  {
    q: "Do coaches have seatbelts?",
    a: "Many newer models have them; older units may not. Ask if belts matter for your group or age range.",
  },
  {
    q: "Can we eat or drink onboard?",
    a: "Light snacks & capped drinks are usually fine. Hot meals can trigger cleaning fees—ask first.",
  },
  {
    q: "What affects price most?",
    a: "Date/season, hours, deadhead distance, and last‑minute demand. Off‑peak or flexible timing can save.",
  },
];

export default function CoachBusesPage() {
  const [search, setSearch] = useState("");
  const [openFeature, setOpenFeature] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const coachesWithImages = useMemo(
    () =>
      COACHES.map((c, i) => ({
        ...c,
        image: COACH_IMAGES[i % COACH_IMAGES.length],
      })),
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return coachesWithImages;
    return coachesWithImages.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.highlights.some((h) => h.toLowerCase().includes(q))
    );
  }, [search, coachesWithImages]);

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
      <section className="relative overflow-hidden min-h-[470px] md:min-h-[540px] flex flex-col items-center justify-center text-center py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-blue-600 to-indigo-900" />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/15 via-transparent to-white/10 pointer-events-none" />
        <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold mb-5 tracking-tight font-serif text-white drop-shadow-[0_6px_20px_rgba(0,0,0,.35)]">
          Coach & Mini Bus Fleet
        </h1>
        <p className="relative z-10 text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-blue-50 font-medium">
          Clean, comfortable transport for teams, tours, corporate travel & long‑distance group trips.
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
              d="M0,70 C240,110 480,20 720,50 C960,80 1200,40 1440,70 L1440,120 L0,120 Z"
              fill="#102750"
            />
          </svg>
        </div>
      </section>

      {/* FLEET */}
      <section className="bg-[#102750] pt-8 pb-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white font-serif tracking-tight">
            Pick Your Coach
          </h2>
          <p className="text-blue-100/90 text-center max-w-3xl mx-auto mt-3 mb-8">
            Mini to full‑size—seating, luggage, power & comfort options for any itinerary.
          </p>
          <div className="flex justify-center mb-8">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, category or feature…"
              aria-label="Search coaches"
              className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/40 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((coach) => (
              <div
                key={coach.name}
                className="bg-[#15305f]/90 border border-blue-800/40 rounded-[24px] shadow-[0_10px_30px_rgba(2,6,23,.35)] overflow-hidden flex flex-col"
              >
                <div className="flex items-center justify-between px-6 pt-5 min-h-[28px]">
                  <span className="text-xs font-semibold text-blue-100/90">
                    {coach.category}
                  </span>
                  {coach.badge ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white border border-blue-300/40">
                      {coach.badge}
                    </span>
                  ) : (
                    <span className="h-[18px]" />
                  )}
                </div>
                <div className="px-6 mt-3">
                  <div className="h-72 w-full overflow-hidden rounded-2xl border border-blue-800/30 bg-[#18356e] flex items-center justify-center">
                    {coach.image ? (
                      <img
                        src={coach.image}
                        alt={coach.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-blue-100/80 text-sm">Preview</div>
                    )}
                  </div>
                </div>
                <div className="px-6 mt-5 flex-1">
                  <h3 className="text-2xl font-extrabold text-white tracking-tight text-center">
                    {coach.name}
                  </h3>
                  <div className="mt-1 mb-4 text-sm font-semibold text-blue-200 text-center">
                    Seats up to {coach.capacity}
                  </div>
                  <ul className="text-blue-100/95 text-[0.95rem] space-y-1">
                    {coach.highlights.slice(0, 4).map((h) => (
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
                No coaches match your search.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-2 text-white font-serif tracking-tight">
          Coach Advantages
        </h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-8">
          Efficient, comfortable, and organized group transport for local shuttles to multi‑day trips.
        </p>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {COACH_FEATURES.map((f) => (
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
          Coach FAQ
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
            Get a Coach Quote
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
              {COACH_FEATURES.find((f) => f.title === openFeature)?.desc}
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