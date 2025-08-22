"use client";

import React, { useMemo, useState } from "react";

type Feature = { label: string; icon: string; description: string };
type Tool = { name: string; icon: string; desc: string };
type Bus = {
  name: string;
  capacity: number;
  type: "Party Bus" | "Limo" | "Coach" | "Sprinter";
  highlights: string[];
  image?: string;
  badge?: string;
};

const PHONE_DISPLAY = "(312) 555-1234";
const PHONE_TEL = "3125551234";
const EMAIL = "info@bus2ride.com";

/* ---------- Features ---------- */
const PARTY_BUS_FEATURES: Feature[] = [
  { label: "More Space to Move Around", icon: "🕺", description: "Spacious interiors let you dance, mingle, and move around safely—no cramped seating here!" },
  { label: "Better for Socializing, Less Claustrophobic", icon: "🫂", description: "Wrap-around seating means everyone faces each other and can actually talk; great group energy." },
  { label: "Wet bars with ice & bottled water", icon: "🧊", description: "Built-in wet bars with ice and complimentary bottled water. Bring your own drinks (21+ where legal)." },
  { label: "Easy to Get In and Out Of", icon: "🚪", description: "Wide doors and low steps make boarding and exiting the bus a breeze for all guests." },
  { label: "BYOB Friendly", icon: "🍾", description: "Bring your own beverages and keep the party going your way. Just no glass bottles, please!" },
  { label: "Some Restrooms on Big Party Buses", icon: "🚻", description: "Select larger party buses include onboard restrooms for maximum comfort and convenience during your trip." },
];

/* ---------- Tools ---------- */
const TOOL_LIST: Tool[] = [
  { name: "Per Person Splitter", icon: "🧮", desc: "Easily split the total cost among your group—no math headaches." },
  { name: "BYOB Pack & Ice Calculator", icon: "🥤", desc: "Figure out how much to bring so nobody runs dry (or warm) on the bus." },
  { name: "Seat Space Fit Advisor", icon: "🪑", desc: "Check if your group will fit comfortably—no squishing, no surprises." },
  { name: "Bar Hop Route Builder", icon: "🗺️", desc: "Plan your stops and build the perfect party route for the night." },
  { name: "Vibe Selector", icon: "🎶", desc: "Pick your party mood—chill, club, throwback, or wild—and get playlist ideas." },
  { name: "Stop Timing Planner", icon: "⏱️", desc: "Map out how long to spend at each stop so you never feel rushed (or bored)." },
];

/* ---------- Fleet (images larger, uniform cards) ---------- */
const BUSES: Bus[] = [
  {
    name: "Mercedes Sprinter Limo Party Bus",
    capacity: 14,
    type: "Sprinter",
    highlights: ["Wrap-around seating", "LED ceiling & floor", "Bluetooth sound"],
    image: "/images/sprinter.jpg",
    badge: "Most Popular",
  },
  {
    name: "H2 Hummer Stretch Limousine",
    capacity: 18,
    type: "Limo",
    highlights: ["Premium sound", "Bar setup", "Disco lighting"],
    image: "/images/hummer.jpg",
    badge: "Iconic",
  },
  {
    name: "Luxury Party Bus (24–26 Pax)",
    capacity: 26,
    type: "Party Bus",
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
    highlights: ["Restroom (select models)", "Subwoofer system", "Ambient LEDs"],
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

/* ---------- Polls & Reviews ---------- */
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
    <main className="text-white bg-[#05070f]">
      {/* ---------- HERO (blue/black, crisp text) ---------- */}
      <section className="relative overflow-hidden min-h-[520px] md:min-h-[600px] flex flex-col items-center justify-center text-center py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c1835] via-[#09122a] to-black" />
        <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold mb-6 tracking-tight font-serif text-white drop-shadow-[0_3px_12px_rgba(30,58,138,.4)]">
          Bus2Ride Party Bus Fleet
        </h1>
        <p className="relative z-10 text-2xl md:text-3xl max-w-3xl mx-auto mb-10 text-blue-100/95 font-medium">
          Explore luxury party buses—big energy, smooth rides, quotes in seconds.
        </p>
        <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center w-full max-w-3xl">
          <a
            href={`tel:${PHONE_TEL}`}
            className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] whitespace-nowrap bg-white text-blue-900 hover:bg-blue-50 border-blue-200"
          >
            Call {PHONE_DISPLAY}
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] whitespace-nowrap bg-blue-700 text-white hover:bg-blue-800 border-blue-800"
          >
            Email Us
          </a>
          <a
            href="/quote#instant"
            className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] whitespace-nowrap bg-blue-900 text-white hover:bg-blue-950 border-blue-900"
          >
            ⚡ Instant Live Quote
          </a>
        </div>
      </section>

      {/* ---------- FLEET (uniform, bigger images, blue styling) ---------- */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 my-10 md:my-14">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-white font-serif tracking-tight">
          Pick Your Party Machine
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {BUSES.map((bus) => (
            <div
              key={bus.name}
              className="bg-[#0b142b]/90 border border-blue-900/50 rounded-[24px] shadow-[0_10px_30px_rgba(2,6,23,.5)] overflow-hidden"
            >
              {/* Fixed-height header row to keep cards equal */}
              <div className="flex items-center justify-between px-6 pt-5 min-h-[28px]">
                <span className="text-xs font-semibold text-blue-200/80">{bus.type}</span>
                {bus.badge ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-700 text-white border border-blue-400/30">
                    {bus.badge}
                  </span>
                ) : (
                  <span className="h-[18px]" />
                )}
              </div>

              {/* Bigger image */}
              <div className="px-6 mt-3">
                <div className="h-56 md:h-64 w-full overflow-hidden rounded-2xl border border-blue-900/40 bg-[#0e1a39] flex items-center justify-center">
                  {bus.image ? (
                    <img
                      src={bus.image}
                      alt={bus.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-blue-300/80">Vehicle preview</div>
                  )}
                </div>
              </div>

              {/* Title + capacity */}
              <div className="px-6 mt-4">
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  {bus.name}
                </h3>
                <div className="mt-1 mb-3 text-sm font-semibold text-blue-300">
                  Seats up to {bus.capacity}
                </div>

                {/* Highlights: fixed block height for uniform cards */}
                <ul className="text-blue-200/90 text-[0.95rem] space-y-1 min-h-[72px]">
                  {bus.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <span className="mt-[2px]">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom buttons (only) */}
              <div className="px-6 pb-6 pt-4">
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`tel:${PHONE_TEL}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 font-bold bg-blue-700 text-white hover:bg-blue-800 border border-blue-800 transition"
                    aria-label="Call now"
                  >
                    Call
                  </a>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 font-bold bg-blue-900 text-white hover:bg-blue-950 border border-blue-900 transition"
                    aria-label="Email now"
                  >
                    Email
                  </a>
                  <a
                    href="/quote#instant"
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 font-bold bg-white text-blue-900 hover:bg-blue-50 border border-blue-200 transition"
                    aria-label="Instant live quote"
                  >
                    ⚡ Quote
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- WHY PARTY BUSES ROCK ---------- */}
      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#0e1a39] to-[#080e1f] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-900/40">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-white font-serif tracking-tight">
          Why Party Buses Rock
        </h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PARTY_BUS_FEATURES.map((f) => (
            <li key={f.label} className="bg-[#f8fbff] rounded-lg shadow px-4 py-3 border border-blue-200 text-blue-900 flex flex-col items-start">
              <span className="text-2xl mb-1">{f.icon}</span>
              <div className="font-semibold text-lg mb-1">{f.label}</div>
              <div className="text-blue-800 text-sm">{f.description}</div>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- POLLS ---------- */}
      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#0e1a39] to-[#080e1f] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-900/40">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-white font-serif tracking-tight">
          Party Bus Polls
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {POLLS.map((poll, idx) => (
            <div key={idx} className="bg-[#0b142b] rounded-2xl shadow-xl border border-blue-900/40 p-6 flex flex-col items-center">
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
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-800"
          >
            More Polls
          </a>
        </div>
      </section>

      {/* ---------- TOOLS (moved after polls) ---------- */}
      <section className="w-full bg-gradient-to-br from-[#0e1a39] to-[#080e1f] py-16 md:py-20 border-t border-blue-900/40">
        <div className="max-w-6xl mx-auto flex flex-col items-center px-4 md:px-0">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 font-serif tracking-tight text-white">
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
              className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-[#0b142b] border border-blue-900/50 text-white placeholder-blue-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              aria-label="Search tools"
            />
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 justify-center items-stretch">
            {filteredTools.map((tool) => (
              <div
                key={tool.name}
                className="flex flex-col items-center bg-[#0b142b] rounded-2xl shadow-xl px-8 py-8 w-full max-w-xs mx-auto border border-blue-900/40 hover:scale-105 transition-transform"
              >
                <span className="text-4xl mb-2">{tool.icon}</span>
                <span className="font-bold text-lg mb-1 text-white">{tool.name}</span>
                <span className="text-blue-200 text-center text-base">{tool.desc}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <a
              href="/tools"
              className="rounded-full font-bold px-10 py-4 text-lg shadow-xl transition border flex items-center justify-center bg-blue-700 text-white hover:bg-blue-800 border-blue-800"
              style={{ letterSpacing: "0.02em" }}
            >
              <span className="text-2xl mr-2">➕</span>
              More Tools
            </a>
          </div>
        </div>
      </section>

      {/* ---------- REVIEWS ---------- */}
      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#0e1a39] to-[#080e1f] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-900/40">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-white font-serif tracking-tight">
          Customer Reviews
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((review, i) => (
            <div key={i} className="relative bg-[#0b142b] border border-blue-900/40 rounded-2xl shadow-xl p-7 flex flex-col gap-3 hover:scale-[1.02] transition-transform overflow-hidden">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-700 rounded-full w-11 h-11 flex items-center justify-center text-2xl font-bold text-white shadow-lg border border-blue-400/30">
                  {review.name[0]}
                </div>
                <span className="font-bold text-blue-100 text-lg">{review.name}</span>
                <span className="ml-auto text-yellow-400 text-xl">★★★★★</span>
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
            className="inline-block bg-white hover:bg-blue-50 text-blue-900 font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-200"
          >
            More Reviews
          </a>
        </div>
      </section>
    </main>
  );
}
