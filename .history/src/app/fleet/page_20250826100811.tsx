"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import Image from "next/image";

/** ---------- Contact constants ---------- */
const PHONE_DISPLAY = "(888) 535-2566";
const PHONE_TEL = "8885352566";
const EMAIL = "info@bus2ride.com";

/** ---------- Tools (like Party Buses page) ---------- */
type Tool = { name: string; icon: string; desc: string; size: "sm" | "md" | "lg" };
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

/** ---------- Reviews & Polls (like Party Buses page) ---------- */
const REVIEWS = [
  { name: "Paul P.", text: "Absolutely excellent! Great customer service! The price was very good. The driver was professional. The limo looked pristine." },
  { name: "Jessie A.", text: "The limo company you need to call for any event. Prices and vehicles are like no other." },
  { name: "Dee C.", text: "Used them for our bachelorette/bachelor parties and our wedding—fantastic! Even let me extend an hour. Highly recommend." },
  { name: "Halee H.", text: "Great price, clean inside, super friendly driver. Will never use another company!" },
  { name: "Rachel L.", text: "We had the best time! Driver was so fun and amazing. Would recommend them 100%!" },
  { name: "Becky B.", text: "Made us feel like movie stars! Highly recommend." },
];

const POLLS = [
  { question: "What’s the most important factor in party bus pricing?", options: ["Group size", "Date/season", "Trip length", "Vehicle type"] },
  { question: "Would you pay more for a newer party bus?", options: ["Yes", "No"] },
  { question: "How much extra would you pay for a party bus with a restroom?", options: ["$0", "$50", "$100", "$200+"] },
  { question: "What’s a fair hourly rate for a 20-passenger limo?", options: ["$100", "$150", "$200", "$250+"] },
  { question: "Would you split the cost of a party bus with friends?", options: ["Always", "Sometimes", "Never"] },
  { question: "Do you prefer all-inclusive pricing or itemized fees?", options: ["All-inclusive", "Itemized", "No preference"] },
];

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
  // Tools modal + searches for reviews/polls/tools
  const [activeToolIdx, setActiveToolIdx] = useState<number | null>(null);
  const [toolSearch, setToolSearch] = useState("");
  const [reviewSearch, setReviewSearch] = useState("");
  const [pollSearch, setPollSearch] = useState("");

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
        {/* Primary bright gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-blue-600 to-indigo-900" />
        {/* Subtle sheen overlay */}
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
            Instant Live Quote
          </a>
        </div>

        {/* wave divider */}
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

      {/* ---------- FLEET GRID ---------- */}
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
                      Quote
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

      {/* ---------- PROMO ---------- */}
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
            Get an Instant Quote
          </a>
          <a
            href={`tel:${PHONE_TEL}`}
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-bold bg-white text-blue-900 hover:bg-blue-50 border border-blue-200 transition"
          >
            Call {PHONE_DISPLAY}
          </a>
        </div>
      </section>

      {/* ---------- REVIEWS (added below promo) ---------- */}
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
            <div
              key={i}
              className="relative bg-[#12244e] border border-blue-800/30 rounded-2xl shadow-xl p-7 flex flex-col gap-3 hover:scale-[1.02] transition-transform overflow-hidden"
            >
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

      {/* ---------- POLLS (added below reviews) ---------- */}
      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-2 text-white font-serif tracking-tight">
          Party Bus Polls
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
            <div
              key={idx}
              className="bg-[#12244e] rounded-2xl shadow-xl border border-blue-800/30 p-6 flex flex-col items-center"
            >
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

      {/* ---------- TOOLS (added below polls, like Party Buses) ---------- */}
      <section className="w-full bg-gradient-to-br from-[#122a5c] to-[#0f2148] py-16 md:py-20 border-t border-blue-800/30">
        <div className="max-w-6xl mx-auto flex flex-col items-center px-4 md:px-0">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-3 font-serif tracking-tight text-white">
            Limo & Party Bus Tools
          </h2>
          <p className="text-lg md:text-xl text-blue-100 text-center max-w-2xl font-medium mb-8">
            Click a tool to open it in a perfectly-sized modal—some are compact, others full-width. Use them right here.
          </p>
          <div className="w-full flex justify-center mb-8">
            <input
              type="text"
              placeholder="Search tools..."
              value={toolSearch}
              onChange={(e) => setToolSearch(e.target.value)}
              className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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

      {/* ---------- TOOL MODAL ---------- */}
      {activeToolIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
        >
          <div
            className={`w-full ${TOOL_SIZE_CLASS[TOOL_LIST[activeToolIdx].size]} bg-gradient-to-br from-[#13306a] to-[#0e2250] border border-blue-800/40 rounded-2xl shadow-2xl relative`}
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

              {/* Placeholder tool bodies (same as reference) */}
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
