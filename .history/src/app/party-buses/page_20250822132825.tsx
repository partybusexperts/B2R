"use client";

import React, { useMemo, useState } from "react";

/* =========================
   Types
========================= */
type Feature = { label: string; icon: string; description: string };
type Tool = { name: string; icon: string; desc: string };
type Bus = {
  name: string;
  capacity: number;
  type: "Party Bus" | "Limo" | "Coach" | "Sprinter";
  highlights: string[];
  badge?: string;
  image?: string;
};

/* =========================
   Site Contact (shown in each card)
========================= */
const PHONE_DISPLAY = "(312) 555-1234";
const PHONE_TEL = "3125551234";
const EMAIL = "info@bus2ride.com";

/* =========================
   Data: Features
========================= */
const PARTY_BUS_FEATURES: Feature[] = [
  { label: "More Space to Move Around", icon: "🕺", description: "Spacious interiors let you dance, mingle, and move around safely—no cramped seating here!" },
  { label: "Better for Socializing, Less Claustrophobic", icon: "🫂", description: "Wrap-around seating means everyone faces each other and can actually talk; great group energy." },
  { label: "Wet bars with ice & bottled water", icon: "🧊", description: "Built-in wet bars with ice and complimentary bottled water. Bring your own drinks (21+ where legal)." },
  { label: "Easy to Get In and Out Of", icon: "🚪", description: "Wide doors and low steps make boarding and exiting the bus a breeze for all guests." },
  { label: "BYOB Friendly", icon: "🍾", description: "Bring your own beverages and keep the party going your way. Just no glass bottles, please!" },
  { label: "Some Restrooms on Big Party Buses", icon: "🚻", description: "Select larger party buses include onboard restrooms for maximum comfort and convenience during your trip." },
];

/* =========================
   Data: Tools
========================= */
const TOOL_LIST: Tool[] = [
  { name: "Per Person Splitter", icon: "🧮", desc: "Easily split the total cost among your group—no math headaches." },
  { name: "BYOB Pack & Ice Calculator", icon: "🥤", desc: "Figure out how much to bring so nobody runs dry (or warm) on the bus." },
  { name: "Seat Space Fit Advisor", icon: "🪑", desc: "Check if your group will fit comfortably—no squishing, no surprises." },
  { name: "Bar Hop Route Builder", icon: "🗺️", desc: "Plan your stops and build the perfect party route for the night." },
  { name: "Vibe Selector", icon: "🎶", desc: "Pick your party mood—chill, club, throwback, or wild—and get playlist ideas." },
  { name: "Stop Timing Planner", icon: "⏱️", desc: "Map out how long to spend at each stop so you never feel rushed (or bored)." },
];

/* =========================
   Data: Fleet (bigger, flashier cards)
========================= */
const BUSES: Bus[] = [
  {
    name: "Mercedes Sprinter Limo Party Bus",
    capacity: 14,
    type: "Sprinter",
    badge: "Most Popular",
    highlights: ["Wrap-around seating", "LED ceiling & floor", "Bluetooth sound"],
    image: "/images/sprinter.jpg",
  },
  {
    name: "H2 Hummer Stretch Limousine",
    capacity: 18,
    type: "Limo",
    badge: "Iconic",
    highlights: ["Premium sound", "Bar setup", "Disco lighting"],
    image: "/images/hummer.jpg",
  },
  {
    name: "Luxury Party Bus (24–26 Pax)",
    capacity: 26,
    type: "Party Bus",
    badge: "Birthday Favorite",
    highlights: ["Dance lighting", "BYOB-friendly", "Dual coolers"],
    image: "/images/partybus-26.jpg",
  },
  {
    name: "Executive Party Bus (30–34 Pax)",
    capacity: 34,
    type: "Party Bus",
    highlights: ["Spacious interior", "USB charging", "TV screens"],
    image: "/images/partybus-34.jpg",
  },
  {
    name: "Mega Party Bus (40–45 Pax)",
    capacity: 45,
    type: "Party Bus",
    badge: "Big Group King",
    highlights: ["*Restroom* (select models)", "Subwoofer system", "Ambient LEDs"],
    image: "/images/partybus-45.jpg",
  },
  {
    name: "Mini Coach (22–28 Pax)",
    capacity: 28,
    type: "Coach",
    highlights: ["Forward seating", "Comfort ride", "Great for tours"],
    image: "/images/minicoach.jpg",
  },
];

/* =========================
   Data: Polls & Reviews
========================= */
const POLLS = [
  { question: "What’s the most important factor in party bus pricing?", options: ["Group size", "Date/season", "Trip length", "Vehicle type"] },
  { question: "Would you pay more for a newer party bus?", options: ["Yes", "No"] },
  { question: "How much extra would you pay for a party bus with a restroom?", options: ["$0", "$50", "$100", "$200+"] },
  { question: "What’s a fair hourly rate for a 20-passenger limo?", options: ["$100", "$150", "$200", "$250+"] },
  { question: "Would you split the cost of a party bus with friends?", options: ["Always", "Sometimes", "Never"] },
  { question: "Do you prefer all-inclusive pricing or itemized fees?", options: ["All-inclusive", "Itemized", "No preference"] },
];

const REVIEWS = [
  { name: "Paul P.", text: "Absolutely excellent! Great customer service! The price was very good. The driver was professional. The limo looked pristine." },
  { name: "Jessie A.", text: "The limo company you need to call for any event. Prices and vehicles are like no other." },
  { name: "Dee C.", text: "Used them for our bachelorette/bachelor parties and our wedding—fantastic! Even let me extend an hour. Highly recommend." },
  { name: "Halee H.", text: "Great price, clean inside, super friendly driver. Will never use another company!" },
  { name: "Rachel L.", text: "We had the best time! Driver was so fun and amazing. Would recommend them 100%!" },
  { name: "Becky B.", text: "Made us feel like movie stars! Highly recommend." },
];

/* =========================
   Page
========================= */
export default function PartyBusesPage() {
  const [toolSearch, setToolSearch] = useState("");

  const filteredTools = useMemo(
    () =>
      TOOL_LIST.filter(
        (t) =>
          t.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
          t.desc.toLowerCase().includes(toolSearch.toLowerCase())
      ),
    [toolSearch]
  );

  return (
    <main className="text-white">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[520px] md:min-h-[620px] py-24 md:py-36">
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-600/20 via-blue-900/20 to-black" />
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg tracking-tight font-serif bg-gradient-to-r from-fuchsia-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
          Bus2Ride Party Bus Fleet
        </h1>
        <p className="text-2xl md:text-3xl max-w-3xl mx-auto mb-10 text-blue-100/90 font-medium">
          Go big. Go bold. Choose your vibe and roll out—quotes in seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4 z-10 w-full max-w-2xl">
          <a
            href="#book"
            className="rounded-full font-bold px-8 py-3 text-lg shadow-[0_0_20px_rgba(168,85,247,.45)] transition border flex items-center justify-center min-w-[220px] text-center bg-white text-blue-900 hover:bg-blue-50 border-blue-200"
            style={{ letterSpacing: "0.03em" }}
          >
            Get Instant Quote
          </a>
          <a
            href="/fleet"
            className="rounded-full font-bold px-8 py-3 text-lg shadow-[0_0_22px_rgba(59,130,246,.45)] transition border flex items-center justify-center min-w-[220px] text-center bg-blue-700 text-white hover:bg-blue-800 border-blue-800"
            style={{ letterSpacing: "0.03em" }}
          >
            View Fleet
          </a>
          <a
            href={`tel:${PHONE_TEL}`}
            className="rounded-full font-bold px-8 py-3 text-lg shadow-[0_0_22px_rgba(6,182,212,.45)] transition border flex items-center justify-center min-w-[220px] text-center bg-cyan-50 text-blue-900 border-cyan-200 hover:bg-cyan-100"
            style={{ letterSpacing: "0.03em" }}
          >
            📞 {PHONE_DISPLAY}
          </a>
        </div>

        <style>{`
          @keyframes nudge { 0%, 80%, 100% { transform: translateX(0); } 85% { transform: translateX(-2px); } 90% { transform: translateX(2px); } 95% { transform: translateX(-1px); } }
          .phone-nudge { display: inline-block; animation: nudge 5s ease-in-out infinite; }
        `}</style>

        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[120vw] h-40 bg-gradient-to-r from-fuchsia-500/30 via-blue-500/20 to-cyan-400/10 blur-2xl opacity-70" />
      </section>

      {/* Fleet Rows — FLASHY CARDS */}
      <section className="max-w-7xl mx-auto my-10 md:my-14 px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-white via-fuchsia-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
          Pick Your Party Machine
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {BUSES.map((bus) => (
            <div key={bus.name} className="relative group">
              {/* Animated gradient frame */}
              <div className="rounded-[28px] p-[2px] bg-gradient-to-r from-fuchsia-500 via-blue-500 to-cyan-400 animate-gradient-x shadow-[0_0_30px_rgba(99,102,241,.35)]">
                <div className="rounded-[26px] bg-[#0b1020]/90 backdrop-blur p-6 md:p-7 h-full flex flex-col min-h-[420px]">
                  {/* Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-200/80">{bus.type}</span>
                    {bus.badge && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-fuchsia-600/80 text-white shadow">
                        {bus.badge}
                      </span>
                    )}
                  </div>

                  {/* Image (optional) */}
                  <div className="mt-3 mb-4 overflow-hidden rounded-2xl border border-blue-900/40 bg-gradient-to-tr from-blue-900/40 to-blue-700/10 h-40 flex items-center justify-center">
                    {bus.image ? (
                      <img
                        src={bus.image}
                        alt={bus.name}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-blue-300/80">Vehicle preview</div>
                    )}
                  </div>

                  {/* Title & capacity */}
                  <h3 className="text-2xl font-extrabold text-blue-50 tracking-tight">
                    {bus.name}
                  </h3>
                  <div className="mt-1 mb-3">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300">
                      <span className="text-lg">🧍‍♂️</span> Seats up to {bus.capacity}
                    </span>
                  </div>

                  {/* Highlights */}
                  <ul className="text-blue-200/90 text-[0.95rem] space-y-1 mb-5">
                    {bus.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <span className="mt-[2px]">✨</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Contact info (inside card) */}
                  <div className="mt-auto grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center justify-between rounded-xl bg-blue-950/60 border border-blue-800/40 px-3 py-2">
                      <span className="text-blue-200/90">Phone</span>
                      <a href={`tel:${PHONE_TEL}`} className="font-semibold text-cyan-300 hover:text-cyan-200">
                        {PHONE_DISPLAY}
                      </a>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-blue-950/60 border border-blue-800/40 px-3 py-2">
                      <span className="text-blue-200/90">Email</span>
                      <a href={`mailto:${EMAIL}`} className="font-semibold text-cyan-300 hover:text-cyan-200">
                        {EMAIL}
                      </a>
                    </div>
                  </div>

                  {/* Buttons row */}
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <a
                      href={`tel:${PHONE_TEL}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 font-bold bg-gradient-to-br from-fuchsia-600 to-fuchsia-500 text-white shadow-[0_6px_20px_rgba(168,85,247,.35)] hover:scale-[1.02] active:scale-[0.98] transition"
                      aria-label="Call now"
                    >
                      📞 Call
                    </a>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 font-bold bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-[0_6px_20px_rgba(59,130,246,.35)] hover:scale-[1.02] active:scale-[0.98] transition"
                      aria-label="Email now"
                    >
                      ✉️ Email
                    </a>
                    <a
                      href="/quote#instant"
                      className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 font-bold bg-gradient-to-br from-cyan-500 to-teal-400 text-blue-950 shadow-[0_6px_20px_rgba(34,211,238,.35)] hover:scale-[1.02] active:scale-[0.98] transition"
                      aria-label="Instant live quote"
                    >
                      ⚡ Quote
                    </a>
                  </div>
                </div>
              </div>

              {/* Glow / particles */}
              <div className="pointer-events-none absolute -inset-1 rounded-[30px] opacity-0 group-hover:opacity-100 transition duration-500 blur-2xl bg-gradient-to-r from-fuchsia-600/20 via-blue-600/10 to-cyan-400/20" />
            </div>
          ))}
        </div>

        {/* Card animation helpers */}
        <style>{`
          @keyframes gradientMove { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradientMove 8s ease infinite;
          }
        `}</style>
      </section>

      {/* Tools */}
      <section className="w-full bg-gradient-to-br from-blue-950 via-blue-900 to-black py-16 md:py-20">
        <div className="max-w-6xl mx-auto flex flex-col items-center px-4 md:px-0">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 font-serif tracking-tight bg-gradient-to-r from-fuchsia-200 via-blue-200 to-cyan-200 bg-clip-text text-transparent drop-shadow-lg">
            Limo & Party Bus Tools
          </h2>
          <p className="text-lg md:text-xl text-blue-100 text-center max-w-2xl font-medium mb-8">
            Instantly calculate, plan, and optimize your ride—quotes, cost splits, routes, and more.
          </p>
          <div className="w-full flex justify-center mb-8">
            <input
              type="text"
              placeholder="Search tools..."
              value={toolSearch}
              onChange={(e) => setToolSearch(e.target.value)}
              className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-blue-950/80 border border-blue-700/40 text-white placeholder-blue-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              aria-label="Search tools"
            />
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 justify-center items-stretch">
            {filteredTools.map((tool) => (
              <div
                key={tool.name}
                className="flex flex-col items-center bg-gradient-to-br from-blue-800/90 via-blue-700/90 to-blue-600/80 rounded-2xl shadow-xl px-8 py-8 w-full max-w-xs mx-auto hover:scale-105 transition-transform border border-blue-400/20"
              >
                <span className="text-4xl mb-2">{tool.icon}</span>
                <span className="font-bold text-lg mb-1">{tool.name}</span>
                <span className="text-blue-100 text-center text-base">{tool.desc}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <a
              href="/tools"
              className="rounded-full font-bold px-10 py-4 text-lg shadow-xl transition border flex items-center justify-center bg-gradient-to-r from-blue-700 to-blue-500 text-white border-blue-800 hover:bg-blue-800"
              style={{ letterSpacing: "0.03em" }}
            >
              <span className="text-2xl mr-2">➕</span>
              More Tools
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-500/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
          Why Party Buses Rock
        </h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PARTY_BUS_FEATURES.map((f) => (
            <li key={f.label} className="bg-white rounded-lg shadow px-4 py-3 border border-blue-200 text-blue-900 flex flex-col items-start">
              <span className="text-2xl mb-1">{f.icon}</span>
              <div className="font-semibold text-lg mb-1">{f.label}</div>
              <div className="text-blue-800 text-sm">{f.description}</div>
            </li>
          ))}
        </ul>
      </section>

      {/* Polls */}
      <section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-500/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
          Party Bus Polls
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {POLLS.map((poll, idx) => (
            <div key={idx} className="bg-blue-950/90 rounded-2xl shadow-xl border border-blue-500/20 p-6 flex flex-col items-center">
              <h3 className="text-xl font-bold text-blue-100 mb-2 text-center">{poll.question}</h3>
              <ul className="text-blue-200 mb-2 text-center">
                {poll.options.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
              <span className="text-blue-400 text-sm">
                Vote on our <a href="/polls" className="underline hover:text-blue-200">polls page</a>!
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <a
            href="/polls"
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition"
          >
            More Polls
          </a>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-500/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-200 via-blue-500 to-blue-800 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
          Customer Reviews
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((review, i) => (
            <div key={i} className="relative bg-gradient-to-br from-[#232f5c] via-[#1a237e] to-black border-2 border-blue-800/40 rounded-2xl shadow-xl p-7 flex flex-col gap-3 hover:scale-[1.02] transition-transform group overflow-hidden">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 rounded-full w-11 h-11 flex items-center justify-center text-2xl font-bold text-white shadow-lg border-2 border-blue-300/40">
                  {review.name[0]}
                </div>
                <span className="font-bold text-blue-100 text-lg drop-shadow">{review.name}</span>
                <span className="ml-auto text-yellow-400 text-xl">★★★★★</span>
              </div>
              <div className="text-blue-50 text-base leading-relaxed font-medium drop-shadow-lg relative z-10">
                {review.text}
              </div>
              <svg className="absolute right-0 bottom-0 opacity-10 w-24 h-24 pointer-events-none group-hover:opacity-20 transition" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="url(#grad)" />
                <defs>
                  <radialGradient id="grad">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <a
            href="/reviews"
            className="inline-block bg-white hover:bg-blue-50 text-blue-900 font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border-2 border-blue-100"
          >
            More Reviews
          </a>
        </div>
      </section>

      {/* Book / CTA */}
      <section id="book" className="max-w-2xl mx-auto text-center bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-12 py-10 px-6 border border-blue-500/30">
        <h2 className="text-5xl font-extrabold mb-6 text-blue-200 font-serif tracking-tight">
          Transparent Pricing
        </h2>
        <p className="mb-8 text-xl text-blue-100 font-sans">
          Get a real-time quote in seconds. No hidden fees, no surprises. Just awesome rides.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/quote#instant"
            className="inline-block px-12 py-5 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 text-blue-950 font-bold text-2xl shadow-[0_10px_30px_rgba(34,211,238,.35)] hover:scale-105 transition-transform"
          >
            ⚡ Instant Live Quote
          </a>
          <a
            href={`tel:${PHONE_TEL}`}
            className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-fuchsia-600 to-fuchsia-500 text-white font-bold text-lg shadow-[0_10px_30px_rgba(168,85,247,.35)] hover:scale-105 transition-transform"
          >
            📞 Call {PHONE_DISPLAY}
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-lg shadow-[0_10px_30px_rgba(59,130,246,.35)] hover:scale-105 transition-transform"
          >
            ✉️ Email Us
          </a>
        </div>
      </section>
    </main>
  );
}
