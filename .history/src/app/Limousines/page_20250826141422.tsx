"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import { getCategoryImages } from "../../utils/optimizedImages";
import OptimizedImage from "../../components/OptimizedImage";

type Feature = { label: string; icon: string; description: string };
type Tool = { name: string; icon: string; desc: string; size: "sm" | "md" | "lg" };
type Bus = {
  name: string;
  capacity: number;
  type: "Party Bus" | "Limo" | "Coach" | "Sprinter";
  highlights: string[];
  image?: string;
  badge?: string;
};

const PHONE_DISPLAY = "(888) 535-2566";
const PHONE_TEL = "8885352566";
const EMAIL = "info@bus2ride.com";

/* ---------------- LIMO FEATURES ---------------- */
const LIMO_FEATURES: Feature[] = [
  { label: "Private, Smooth Ride", icon: "🚘", description: "Quiet cabins with plush seating keep the focus on your group—no distractions, just comfort." },
  { label: "Easy, Elegant Arrivals", icon: "🚪", description: "Low step-in and wide doors make getting in and out simple—perfect for formal attire and photos." },
  { label: "Professional Chauffeurs", icon: "🤵", description: "Trained drivers who know venues, timing, and best routes—relax and enjoy the evening." },
  { label: "Comfortable Interiors", icon: "🛋️", description: "Leather seating, climate control, glassware holders—everything set for a smooth experience." },
  { label: "Picture-Perfect Look", icon: "📸", description: "Classic black or white stretch limos deliver a timeless look for weddings and special nights." },
  { label: "Great for Small Groups", icon: "👥", description: "Ideal for 6–18 passengers—stylish and efficient for city routes and venues." },
];

/* ---------------- Tools (with modal sizes) ---------------- */
const TOOL_LIST: Tool[] = [
  { name: "Per Person Splitter", icon: "🧮", desc: "Split total cost per person in seconds.", size: "sm" },
  { name: "BYOB Pack & Ice Calculator", icon: "🥤", desc: "How much to bring so nobody runs dry.", size: "md" },
  { name: "Seat Space Fit Advisor", icon: "🪑", desc: "Check if your group fits comfortably.", size: "sm" },
  { name: "Bar Hop Route Builder", icon: "🗺️", desc: "Plan stops and timings for the night.", size: "lg" },
  { name: "Vibe Selector", icon: "🎶", desc: "Pick a mood & get playlist ideas.", size: "md" },
  { name: "Stop Timing Planner", icon: "⏱️", desc: "Map time per stop so you’re never rushed.", size: "md" },
];

const TOOL_SIZE_CLASS: Record<Tool["size"], string> = {
  sm: "max-w-md min-h-[300px]",
  md: "max-w-2xl min-h-[420px]",
  lg: "max-w-5xl min-h-[540px]",
};

/* ---------------- Placeholder images (legacy removed in favor of optimized manifest) ---------------- */

/* Promo images for the “also have” section */
const PARTY_IMG = "/images/Bus-1.png";
const COACH_IMG = "/images/Bus-1.png";

/* ---------------- Fleet (Limos) ---------------- */
const BUSES: Bus[] = [
  {
    name: "Lincoln Stretch Limousine (10 Pax)",
    capacity: 10,
    type: "Limo",
    highlights: ["Bar setup", "Privacy divider", "Premium sound"],
    image: "",
    badge: "Classic",
  },
  {
    name: "Chrysler 300 Stretch Limousine (12 Pax)",
    capacity: 12,
    type: "Limo",
    highlights: ["Modern interior", "Fiber optic lighting", "AUX/Bluetooth"],
    image: "",
    badge: "Guest Favorite",
  },
  {
    name: "Cadillac Escalade SUV Limousine (18 Pax)",
    capacity: 18,
    type: "Limo",
    highlights: ["Extra headroom", "VIP look", "Subwoofer system"],
    image: "",
    badge: "Iconic",
  },
  {
    name: "Lincoln MKT Stretch Limousine (10 Pax)",
    capacity: 10,
    type: "Limo",
    highlights: ["Sleek exterior", "Comfort seating", "Glassware holders"],
    image: "",
  },
  {
    name: "Mercedes Sprinter Limo (14 Pax)",
    capacity: 14,
    type: "Sprinter",
    highlights: ["Wrap-around seating", "LED ceiling & floor", "Bluetooth sound"],
    image: "",
    badge: "Most Popular",
  },
  {
    name: "Black Executive Sedan (3 Pax)",
    capacity: 3,
    type: "Limo",
    highlights: ["Quiet ride", "Leather seating", "Perfect for airports"],
    image: "",
  },
];

/* ---------------- Polls & Reviews ---------------- */
const POLLS = [
  { question: "What’s the most important factor in limousine pricing?", options: ["Group size", "Date/season", "Trip length", "Vehicle type"] },
  { question: "Would you pay more for a newer limo model?", options: ["Yes", "No"] },
  { question: "How much extra would you pay for a stretch SUV limo over a sedan limo?", options: ["$0", "$50", "$100", "$200+"] },
  { question: "What’s a fair hourly rate for a 10-passenger stretch limo?", options: ["$100", "$150", "$200", "$250+"] },
  { question: "Do you prefer all-inclusive pricing or itemized fees?", options: ["All-inclusive", "Itemized", "No preference"] },
  { question: "Would you split the limo cost with your group?", options: ["Always", "Sometimes", "Never"] },
];

const REVIEWS = [
  { name: "Paul P.", text: "Absolutely excellent! Great customer service! The price was very good. The driver was professional. The limo looked pristine." },
  { name: "Jessie A.", text: "The limo company you need to call for any event. Prices and vehicles are like no other." },
  { name: "Dee C.", text: "Used them for our bachelorette/bachelor parties and our wedding—fantastic! Even let me extend an hour. Highly recommend." },
  { name: "Halee H.", text: "Great price, clean inside, super friendly driver. Will never use another company!" },
  { name: "Rachel L.", text: "We had the best time! Driver was so fun and amazing. Would recommend them 100%!" },
  { name: "Becky B.", text: "Made us feel like movie stars! Highly recommend." },
];

/* ---------------- Events ---------------- */
const POPULAR_EVENT_TITLES = [
  "Weddings",
  "Proms",
  "Birthday Parties",
  "Concerts",
  "Sporting Events",
  "Bachelorette Parties",
  "Bachelor Parties",
  "Night Out on the Town",
  "Wine Tours",
  "Brewery Tours",
  "Corporate Events",
  "Quinceañeras",
];

const EVENT_IMAGES = [
  "/images/Bus-3.png",
  "/images/Bus-4.png",
  "/images/Bus-5.png",
  "/images/Bus-3.png",
  "/images/Bus-2.png",
  "/images/Bus-5.png",
  "/images/Bus-3.png",
  "/images/Bus-1.png",
];

const eventBlurb = (title: string) =>
  `Perfect for ${title.toLowerCase()}—on-time pickups, clean rides, and a vibe your group will love.`;

export default function LimousinesPage() {
  const [toolSearch, setToolSearch] = useState("");
  const [activeToolIdx, setActiveToolIdx] = useState<number | null>(null);
  const [reviewSearch, setReviewSearch] = useState("");
  const [pollSearch, setPollSearch] = useState("");
  const [eventSearch, setEventSearch] = useState("");

  const filteredTools = useMemo(
    () =>
      TOOL_LIST.filter(
        (t) =>
          t.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
          t.desc.toLowerCase().includes(toolSearch.toLowerCase())
      ),
    [toolSearch]
  );

  const filteredReviews = useMemo(() => {
    const q = reviewSearch.trim().toLowerCase();
    if (!q) return REVIEWS;
    return REVIEWS.filter(
      (r) => r.name.toLowerCase().includes(q) || r.text.toLowerCase().includes(q)
    );
  }, [reviewSearch]);

  const filteredPolls = useMemo(() => {
    const q = pollSearch.trim().toLowerCase();
    if (!q) return POLLS;
    return POLLS.filter(
      (p) =>
        p.question.toLowerCase().includes(q) ||
        p.options.some((o) => o.toLowerCase().includes(q))
    );
  }, [pollSearch]);

  const limoOptimized = useMemo(() => getCategoryImages("limousines"), []);
  const busesWithImages = useMemo(
    () =>
      BUSES.map((b, i) => ({
        ...b,
        opt: limoOptimized[i % limoOptimized.length],
      })),
    [limoOptimized]
  );

  const eventsWithImages = useMemo(
    () =>
      POPULAR_EVENT_TITLES.map((title, i) => ({
        title,
        image: EVENT_IMAGES[i % EVENT_IMAGES.length],
        desc: eventBlurb(title),
      })),
    []
  );

  const filteredEvents = useMemo(() => {
    const q = eventSearch.trim().toLowerCase();
    if (!q) return eventsWithImages;
    return eventsWithImages.filter(
      (e) => e.title.toLowerCase().includes(q) || e.desc.toLowerCase().includes(q)
    );
  }, [eventSearch, eventsWithImages]);

  const closeModal = useCallback(() => setActiveToolIdx(null), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActiveToolIdx(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <main className="text-slate-100 bg-[#0f1f46]">
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden min-h-[520px] md:min-h-[600px] flex flex-col items-center justify-center text-center py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-blue-600 to-indigo-900" />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 mix-blend-overlay pointer-events-none" />
        <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold mb-6 tracking-tight font-serif text-white drop-shadow-[0_6px_20px_rgba(0,0,0,.35)]">
          Bus2Ride Limousine Fleet
        </h1>
        <p className="relative z-10 text-2xl md:text-3xl max-w-3xl mx-auto mb-10 text-blue-50 font-medium drop-shadow">
          Explore luxury limousines—sleek rides, pro chauffeurs, quotes in seconds.
        </p>
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
            Instant Live Quote
          </a>
        </div>

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

      {/* ---------- FLEET ---------- */}
      <section className="bg-[#122a56] pt-8 pb-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white font-serif tracking-tight">
            Pick Your Limousine
          </h2>
          <p className="text-blue-100/90 text-center max-w-3xl mx-auto mt-3 mb-10">
            From classic stretches to modern Sprinter limos—every ride is clean, comfy, and camera-ready. Choose the size that fits your crew.
          </p>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {busesWithImages.map((bus) => (
              <div
                key={bus.name}
                className="bg-[#15305f]/90 border border-blue-800/40 rounded-[24px] shadow-[0_10px_30px_rgba(2,6,23,.35)] overflow-hidden"
              >
                {/* header */}
                <div className="flex items-center justify-between px-6 pt-5 min-h-[28px]">
                  <span className="text-xs font-semibold text-blue-100/90">{bus.type}</span>
                  {bus.badge ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white border border-blue-300/40">
                      {bus.badge}
                    </span>
                  ) : (
                    <span className="h-[18px]" />
                  )}
                </div>

                {/* image */}
                <div className="px-6 mt-3">
                  <div className="h-96 md:h-[26rem] w-full overflow-hidden rounded-2xl border border-blue-800/30 bg-[#18356e] flex items-center justify-center">
                    {bus.opt ? (
                      <OptimizedImage entry={bus.opt} alt={bus.name} className="w-full h-full object-cover" />
                    ) : <div className="text-blue-100/80">Vehicle preview</div>}
                  </div>
                </div>

                {/* title + capacity */}
                <div className="px-6 mt-5">
                  <h3 className="text-2xl font-extrabold text-white tracking-tight text-center">{bus.name}</h3>
                  <div className="mt-1 mb-4 text-sm font-semibold text-blue-200 text-center">Seats up to {bus.capacity}</div>
                  <ul className="text-blue-100/95 text-[0.95rem] space-y-1 min-h-[72px]">
                    {bus.highlights.slice(0, 3).map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <span className="mt-[2px]">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
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
                      Quote
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- WHY LIMOS ROCK ---------- */}
      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-2 text-white font-serif tracking-tight">
          Why Limousines Rock
        </h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-8">
          Timeless style, pro chauffeurs, and a smooth private ride—arrive relaxed and looking sharp.
        </p>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LIMO_FEATURES.map((f, idx) => (
            <li key={f.label} className="relative">
              <input
                id={`whylimo-${idx}`}
                type="checkbox"
                className="peer sr-only"
                aria-hidden="true"
              />

              <label
                htmlFor={`whylimo-${idx}`}
                className="group block bg-[#12244e] rounded-2xl shadow border border-blue-800/30 px-5 py-4 text-blue-50 cursor-pointer hover:scale-105 transition-transform"
                aria-label={`Learn more about: ${f.label}`}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-9 h-9 rounded-full bg-blue-900/20 border border-blue-700/40 flex items-center justify-center text-xl group-hover:bg-blue-700/30 transition">
                    {f.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-lg mb-0.5">{f.label}</div>
                    <div className="text-blue-200 text-sm">{f.description}</div>
                  </div>
                </div>
              </label>

              <div className="hidden peer-checked:flex fixed inset-0 z-50 items-center justify-center p-4">
                <label
                  htmlFor={`whylimo-${idx}`}
                  className="absolute inset-0 bg-black/40 cursor-pointer"
                  aria-label="Close"
                />
                <div className="relative z-10 w-full max-w-md min-h-[300px] bg-gradient-to-br from-[#13306a] to-[#0e2250] border border-blue-800/40 rounded-2xl shadow-2xl">
                  <label
                    htmlFor={`whylimo-${idx}`}
                    className="absolute top-3 right-3 text-blue-100 hover:text-white text-2xl font-bold cursor-pointer"
                    aria-label="Close"
                  >
                    ×
                  </label>
                  <div className="px-6 py-7 flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-full bg-blue-900/20 border border-blue-700/40 flex items-center justify-center text-3xl mb-4">
                      {f.icon}
                    </div>
                    <h3 className="text-2xl font-extrabold text-white mb-2 font-serif tracking-tight">
                      {f.label}
                    </h3>
                    <div className="text-blue-100 text-lg">{f.description}</div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- REVIEWS ---------- */}
      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-white font-serif tracking-tight">
          Customer Reviews
        </h2>
        <div className="w-full flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search reviews by name or keywords…"
            value={reviewSearch}
            onChange={(e) => setReviewSearch(e.target.value)}
            className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredReviews.map((review, i) => (
            <div key={i} className="relative bg-[#12244e] border border-blue-800/30 rounded-2xl shadow-xl p-7 flex flex-col gap-3 hover:scale-[1.02] transition-transform overflow-hidden">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-600 rounded-full w-11 h-11 flex items-center justify-center text-2xl font-bold text-white shadow-lg border border-blue-300/30">
                  {review.name[0]}
                </div>
                <span className="font-bold text-blue-50 text-lg">{review.name}</span>
                <span className="ml-auto text-yellow-300 text-xl">★★★★★</span>
              </div>
              <div className="text-blue-50 text-base leading-relaxed font-medium">
                {review.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <a
            href="/reviews"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700"
          >
            More Reviews
          </a>
        </div>
      </section>

      {/* ---------- LIMO POLLS ---------- */}
      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-2 text-white font-serif tracking-tight">
          Limousine Polls
        </h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-6">
          Real riders. Real opinions. Compare trends and get honest insights to plan the perfect night.
        </p>
        <div className="w-full flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search polls…"
            value={pollSearch}
            onChange={(e) => setPollSearch(e.target.value)}
            className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            aria-label="Search polls"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredPolls.map((poll, idx) => (
            <div key={idx} className="bg-[#12244e] rounded-2xl shadow-xl border border-blue-800/30 p-6 flex flex-col items-center">
              <h3 className="text-xl font-bold text-blue-50 mb-2 text-center">{poll.question}</h3>
              <ul className="text-blue-100 mb-2 text-center">
                {poll.options.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
              <span className="text-blue-200 text-sm">
                Vote on our <a href="/polls" className="underline hover:text-blue-100">polls page</a>!
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <a
            href="/polls"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700"
          >
            More Polls
          </a>
        </div>
      </section>

      {/* ---------- PARTY & COACH PROMO ---------- */}
      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-white font-serif tracking-tight">
          We Also Have Party Buses & Coach Buses
        </h2>
        <p className="text-blue-100 text-center max-w-3xl mx-auto mb-8">
          Need something different? Explore party buses for bigger groups—or go with a coach for simple, comfy transport.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Party Bus */}
          <a href="/party-buses" className="group">
            <div className="rounded-2xl border border-blue-800/30 bg-[#12244e] overflow-hidden shadow-xl">
              <div className="h-96 w-full bg-[#173264]">
                {(() => { const p = getCategoryImages("partyBuses")[0]; return p ? <OptimizedImage entry={p} alt="Party Bus" className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform" /> : <div className="text-blue-100/80 flex items-center justify-center h-full">Party Bus</div>; })()}
              </div>
              <div className="px-6 py-5">
                <h3 className="text-2xl font-extrabold text-white text-center">Party Buses</h3>
                <p className="text-blue-200 text-center">Big energy for 14–45 passengers.</p>
              </div>
            </div>
          </a>
          {/* Coach Bus */}
          <a href="/coaches" className="group">
            <div className="rounded-2xl border border-blue-800/30 bg-[#12244e] overflow-hidden shadow-xl">
              <div className="h-96 w-full bg-[#173264]">
                {(() => { const c = getCategoryImages("coachBuses")[0]; return c ? <OptimizedImage entry={c} alt="Coach Bus" className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform" /> : <div className="text-blue-100/80 flex items-center justify-center h-full">Coach Bus</div>; })()}
              </div>
              <div className="px-6 py-5">
                <h3 className="text-2xl font-extrabold text-white text-center">Coach Buses</h3>
                <p className="text-blue-200 text-center">Comfortable seating for large groups.</p>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* ---------- HOW IT WORKS (CSS-only modals) ---------- */}
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
                <input
                  id={`howit-${idx}`}
                  type="checkbox"
                  className="peer sr-only"
                  aria-hidden="true"
                />
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
                  <div className="mt-1 text-blue-200 text-sm opacity-90 group-hover:opacity-100">
                    Click to continue →
                  </div>
                </label>

                <div className="hidden peer-checked:flex fixed inset-0 z-50 items-center justify-center p-4">
                  <label
                    htmlFor={`howit-${idx}`}
                    className="absolute inset-0 bg-black/40 cursor-pointer"
                    aria-label="Close"
                  />
                  <div className="relative z-10 w-full max-w-lg bg-gradient-to-br from-[#13306a] to-[#0e2250] border border-blue-800/40 rounded-2xl shadow-2xl">
                    <label
                      htmlFor={`howit-${idx}`}
                      className="absolute top-3 right-3 text-blue-100 hover:text-white text-2xl font-bold cursor-pointer"
                      aria-label="Close"
                    >
                      ×
                    </label>
                    <div className="px-6 py-7 text-center">
                      <div className="mx-auto w-14 h-14 rounded-full bg-blue-900/20 border border-blue-700/40 flex items-center justify-center text-3xl mb-4">
                        {s.icon}
                      </div>
                      <h3 className="text-2xl font-extrabold text-white mb-2 font-serif tracking-tight">
                        {s.step}. {s.label}
                      </h3>
                      <p className="text-blue-100/90">
                        Move to the next step below or reach out if you need help.
                      </p>

                      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                        <a
                          href={s.href}
                          className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-bold bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 transition"
                        >
                          Go to {s.label}
                        </a>
                        <a
                          href={`tel:${PHONE_TEL}`}
                          className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-bold bg-white text-blue-900 hover:bg-blue-50 border border-blue-200 transition"
                        >
                          Call {PHONE_DISPLAY}
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

      {/* ---------- TOOLS (with modals) ---------- */}
      <section className="w-full bg-gradient-to-br from-[#122a5c] to-[#0f2148] py-16 md:py-20 border-t border-blue-800/30">
        <div className="max-w-6xl mx-auto flex flex-col items-center px-4 md:px-0">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-3 font-serif tracking-tight text-white">
            Limousine Booking Tools
          </h2>
          <p className="text-lg md:text-xl text-blue-100 text-center max-w-2xl font-medium mb-8">
            Click a tool to open it in a perfectly-sized modal—some are compact, others full-width. Your customers can use them right here.
          </p>
          <div className="w-full flex justify-center mb-8">
            <input
              type="text"
              placeholder="Search tools..."
              value={toolSearch}
              onChange={(e) => setToolSearch(e.target.value)}
              className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text.white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              aria-label="Search tools"
            />
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 justify-center items-stretch">
            {filteredTools.map((tool) => {
              const idx = TOOL_LIST.findIndex((t) => t.name === tool.name);
              return (
                <button
                  key={tool.name}
                  type="button"
                  onClick={() => setActiveToolIdx(idx)}
                  className="flex flex-col items-center text-left bg-[#12244e] rounded-2xl shadow-xl px-8 py-8 w-full max-w-xs mx-auto border border-blue-800/30 hover:scale-105 transition-transform"
                >
                  <span className="text-4xl mb-2">{tool.icon}</span>
                  <span className="font-bold text-lg mb-1 text-white">{tool.name}</span>
                  <span className="text-blue-100 text-center text-base">{tool.desc}</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-center mt-10">
            <a
              href="/tools"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700"
            >
              More Tools
            </a>
          </div>
        </div>
      </section>

      {/* ---------- EVENTS (top 12 + vertical buttons under each card) ---------- */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 my-12 pb-12">
        <div className="bg-[#122a56] border border-blue-800/30 rounded-3xl shadow-xl px-6 md:px-8 py-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white font-serif tracking-tight mb-3">
            Events We Love Rolling To
          </h2>
          <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-6">
            From milestone moments to big-night blowouts—book the perfect ride for your event and make traffic part of the fun.
          </p>

          <div className="w-full flex justify-center mb-8">
            <input
              type="text"
              placeholder="Search events…"
              value={eventSearch}
              onChange={(e) => setEventSearch(e.target.value)}
              className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              aria-label="Search events"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((ev) => (
              <div
                key={ev.title}
                className="relative rounded-2xl overflow-hidden border border-blue-800/30 shadow-lg bg-[#173264] flex flex-col"
              >
                <div className="h-60 md:h-72 w-full">
                  <img
                    src={ev.image}
                    alt={ev.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute inset-x-0 top-0 p-5 bg-gradient-to-b from-black/35 via-black/20 to-transparent pointer-events-none">
                  <div className="text-2xl font-extrabold text-white drop-shadow">{ev.title}</div>
                  <div className="text-blue-100 text-sm mt-1">{ev.desc}</div>
                </div>

                <div className="p-5">
                  <div className="flex flex-col gap-2">
                    <a
                      href={`tel:${PHONE_TEL}`}
                      className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-bold bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 transition"
                      aria-label={`Call ${PHONE_DISPLAY}`}
                    >
                      888-535-2566
                    </a>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-bold bg-blue-800 text-white hover:bg-blue-900 border border-blue-900 transition"
                    >
                      Email Now
                    </a>
                    <a
                      href="/quote#instant"
                      className="inline-flex items-center justify.center rounded-xl px-4 py-2.5 font-bold bg-white text-blue-900 hover:bg-blue-50 border border-blue-200 transition"
                    >
                      Instant Quote
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <a
              href="/events"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700"
            >
              More Event Ideas
            </a>
          </div>
        </div>
      </section>

      {/* ---------- TOOL MODAL ---------- */}
      {activeToolIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
        >
          <div
            className={`w-full ${TOOL_SIZE_CLASS[TOOL_LIST[activeToolIdx].size]} bg-gradient.to-br from-[#13306a] to-[#0e2250] border border-blue-800/40 rounded-2xl shadow-2xl relative`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-blue-100 hover:text-white text-2xl font-bold"
              onClick={closeModal}
              aria-label="Close"
            >
              ×
            </button>
            <div className="px-6 py-5">
              <h3 className="text-2xl font-extrabold text-white mb-3 font-serif tracking-tight">
                {TOOL_LIST[activeToolIdx].name}
              </h3>
              {/* Placeholder tool bodies */}
              {TOOL_LIST[activeToolIdx].name === "Per Person Splitter" && (
                <div className="grid gap-3 max-w-md">
                  <label className="text-blue-100 text-sm font-semibold">Total Price ($)</label>
                  <input className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" placeholder="e.g., 800" />
                  <label className="text-blue-100 text-sm font-semibold mt-3">People</label>
                  <input className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" placeholder="e.g., 16" />
                  <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg border border-blue-700">
                    Calculate
                  </button>
                </div>
              )}
              {TOOL_LIST[activeToolIdx].name === "BYOB Pack & Ice Calculator" && (
                <div className="grid gap-3 max-w-2xl">
                  <p className="text-blue-100">Estimate drinks/ice for your group.</p>
                  <div className="grid md:grid-cols-3 gap-3">
                    <input className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" placeholder="People" />
                    <input className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" placeholder="Hours" />
                    <select className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white">
                      <option>Mixed</option>
                      <option>Mostly Beer</option>
                      <option>Mostly Spirits</option>
                    </select>
                  </div>
                  <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg border border-blue-700">
                    Estimate
                  </button>
                </div>
              )}
              {TOOL_LIST[activeToolIdx].name === "Seat Space Fit Advisor" && (
                <div className="grid gap-3 max-w-md">
                  <p className="text-blue-100">Check comfort based on passengers.</p>
                  <input className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" placeholder="Passengers" />
                  <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg border border-blue-700">
                    Check Fit
                  </button>
                </div>
              )}
              {TOOL_LIST[activeToolIdx].name === "Bar Hop Route Builder" && (
                <div className="grid gap-3 max-w-5xl">
                  <p className="text-blue-100">Add stops, set durations, and build your route.</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <input className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" placeholder="Stop 1 (address/name)" />
                    <input className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" placeholder="Stop 2" />
                    <input className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" placeholder="Stop 3" />
                    <input className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" placeholder="Stop 4" />
                  </div>
                  <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg border border-blue-700">
                    Build Route
                  </button>
                </div>
              )}
              {TOOL_LIST[activeToolIdx].name === "Vibe Selector" && (
                <div className="grid gap-3 max-w-2xl">
                  <p className="text-blue-100">Choose your vibe and we’ll suggest playlists.</p>
                  <div className="grid md:grid-cols-3 gap-3">
                    <button className="bg-[#12244e] hover:bg-[#143061] border border-blue-800/30 rounded-lg px-4 py-3 text-white">Chill</button>
                    <button className="bg-[#12244e] hover:bg-[#143061] border border-blue-800/30 rounded-lg px-4 py-3 text-white">Club</button>
                    <button className="bg-[#12244e] hover:bg-[#143061] border border-blue-800/30 rounded-lg px-4 py-3 text-white">Throwback</button>
                  </div>
                </div>
              )}
              {TOOL_LIST[activeToolIdx].name === "Stop Timing Planner" && (
                <div className="grid gap-3 max-w-2xl">
                  <p className="text-blue-100">Map your stop durations.</p>
                  <div className="grid md:grid-cols-3 gap-3">
                    <input className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" placeholder="Total hours" />
                    <input className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" placeholder="# of stops" />
                    <input className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" placeholder="Avg drive (min)" />
                  </div>
                  <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg border border-blue-700">
                    Plan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
