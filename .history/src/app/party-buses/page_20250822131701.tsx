"use client";

import React, { useMemo, useState } from "react";

type Feature = { label: string; icon: string; description: string };
type Tool = { name: string; icon: string; desc: string };

const PARTY_BUS_FEATURES: Feature[] = [
  { label: "More Space to Move Around", icon: "🕺", description: "Spacious interiors let you dance, mingle, and move around safely—no cramped seating here!" },
  { label: "Better for Socializing, Less Claustrophobic", icon: "🫂", description: "Wrap-around seating means everyone faces each other and can actually talk; great group energy." },
  { label: "Wet bars with ice & bottled water", icon: "🧊", description: "Built-in wet bars with ice and complimentary bottled water. Bring your own drinks (21+ where legal)." },
  { label: "Easy to Get In and Out Of", icon: "🚪", description: "Wide doors and low steps make boarding and exiting the bus a breeze for all guests." },
  { label: "BYOB Friendly", icon: "🍾", description: "Bring your own beverages and keep the party going your way. Just no glass bottles, please!" },
  { label: "Some Restrooms on Big Party Buses", icon: "🚻", description: "Select larger party buses include onboard restrooms for maximum comfort and convenience during your trip." },
];

const TOOL_LIST: Tool[] = [
  { name: "Per Person Splitter", icon: "🧮", desc: "Easily split the total cost among your group—no math headaches." },
  { name: "BYOB Pack & Ice Calculator", icon: "🥤", desc: "Figure out how much to bring so nobody runs dry (or warm) on the bus." },
  { name: "Seat Space Fit Advisor", icon: "🪑", desc: "Check if your group will fit comfortably—no squishing, no surprises." },
  { name: "Bar Hop Route Builder", icon: "🗺️", desc: "Plan your stops and build the perfect party route for the night." },
  { name: "Vibe Selector", icon: "🎶", desc: "Pick your party mood—chill, club, throwback, or wild—and get playlist ideas." },
  { name: "Stop Timing Planner", icon: "⏱️", desc: "Map out how long to spend at each stop so you never feel rushed (or bored)." },
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
    <main className="text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[480px] md:min_h-[600px] py-24 md:py-36">
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700/30 via-blue-900/10 to-black" />
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg tracking-tight font-serif bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
          Bus2Ride Party Bus Fleet
        </h1>
        <p className="text-2xl md:text-3xl max-w-3xl mx-auto mb-10 text-blue-100 font-medium">
          Explore our full lineup of luxury party buses—perfect for any celebration, big or small. This page features only our party bus options. For limos or coach buses, see the links below.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4 z-10 w-full max-w-2xl">
          <a
            href="#book"
            className="rounded-full font-bold px-8 py-3 text-lg shadow-lg transition border flex items-center justify-center min-w-[220px] text-center bg-white text-blue-800 hover:bg-blue-50 hover:text-blue-900 border-blue-200"
            style={{ letterSpacing: "0.03em" }}
          >
            Get Instant Quote
          </a>
          <a
            href="/fleet"
            className="rounded-full font-bold px-8 py-3 text-lg shadow-lg transition border flex items-center justify-center min-w-[220px] text-center bg-blue-700 text-white hover:bg-blue-800 border-blue-800"
            style={{ letterSpacing: "0.03em" }}
          >
            View Fleet
          </a>
          <a
            href="/contact"
            className="rounded-full font-bold px-8 py-3 text-lg shadow-lg transition border flex items-center justify-center min-w-[220px] text-center bg-white text-blue-800 border-blue-200 hover:bg-blue-50 hover:text-blue-900"
            style={{ letterSpacing: "0.03em" }}
          >
            <span className="relative text-blue-500 text-xl phone-nudge mr-2">📞</span>
            <span className="relative">Contact Us</span>
          </a>
        </div>

        <style>{`
          @keyframes nudge {
            0%, 80%, 100% { transform: translateX(0); }
            85% { transform: translateX(-2px); }
            90% { transform: translateX(2px); }
            95% { transform: translateX(-1px); }
          }
          .phone-nudge {
            display: inline-block;
            animation: nudge 5s ease-in-out infinite;
          }
        `}</style>

        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[120vw] h-40 bg-gradient-to-r from-blue-500/30 via-blue-500/20 to-blue-800/10 blur-2xl opacity-60" />
      </section>

      {/* Tools Section */}
      <section className="w-full bg-gradient-to-br from-blue-950 via-blue-900 to-black py-20 md:py-24 px-0">
        <div className="max-w-6xl mx-auto flex flex-col items-center px-4 md:px-0">
          <h2 className="text-5xl md:text-6xl font-extrabold text-center mb-4 font-serif tracking-tight bg-gradient-to-r from-blue-300 via-blue-200 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
            Limo & Party Bus Tools
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 text-center max-w-2xl font-medium mb-8">
            Instantly calculate, plan, and optimize your ride. Use our suite of tools for quotes, cost splits, routes, and more.
          </p>

          <div className="w-full flex justify-center mb-10">
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

          <div className="flex justify-center mt-12">
            <a
              href="/tools"
              className="rounded-full font-bold px-10 py-5 text-xl shadow-xl transition border flex items-center justify-center bg-gradient-to-r from-blue-700 to-blue-500 text-white border-blue-800 hover:bg-blue-800"
              style={{ letterSpacing: "0.03em" }}
            >
              <span className="text-2xl mr-2">➕</span>
              More Tools
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-500/30">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
          Why Party Buses Rock
        </h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PARTY_BUS_FEATURES.map((f) => (
            <li
              key={f.label}
              className="bg-white rounded-lg shadow px-4 py-3 border border-blue-200 text-blue-900 flex flex-col items-start"
            >
              <span className="text-2xl mb-1">{f.icon}</span>
              <div className="font-semibold text-lg mb-1">{f.label}</div>
              <div className="text-blue-800 text-sm">{f.description}</div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
