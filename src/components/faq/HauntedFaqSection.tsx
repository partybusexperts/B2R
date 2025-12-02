"use client";

import React, { useState } from "react";

type FAQ = { q: string; a: string };

const sampleFaqs: FAQ[] = [
  {
    q: "How early should we arrive for a haunted house?",
    a: "Plan to arrive 20–30 minutes before your ticket time, especially on Fridays and Saturdays. Parking, wristbands, and bathroom breaks always take longer than you think.",
  },
  {
    q: "What should we wear for a haunted house crawl?",
    a: "Closed-toe shoes, layers you can tie around your waist, and pockets or a small crossbody bag. Avoid heels, dragging costumes, and anything you’d be sad to get fake blood on.",
  },
  {
    q: "Can actors touch you?",
    a: "Most haunted houses are strictly “no-touch” and will say so in their rules. Extreme haunts might allow limited contact. Always check the attraction’s guidelines before booking.",
  },
  {
    q: "What if someone in our group gets too scared?",
    a: "Most venues have clearly marked exits or staff who can escort someone out. On Bus2Ride trips, your driver and planner can help set a regroup point to keep everybody safe.",
  },
  {
    q: "Are haunted houses okay for kids or teens?",
    a: "Many haunts recommend 12+ or 13+. Some offer earlier, “lights-on” or kid-friendly hours. If you’re unsure, call the venue and ask how intense their scares are.",
  },
  {
    q: "Can we bring drinks or snacks between stops?",
    a: "Many party buses are BYOB for 21+ guests, but venues often ban outside drinks. Local open-container and venue rules always apply—your planner can walk you through what’s allowed.",
  },
];

const quickFacts = [
  "Most popular haunted house nights: the last 2 Fridays & Saturdays before Halloween.",
  "Average walkthrough time: 20–35 minutes per attraction, not counting the line.",
  "Top add-ons: photo ops, themed bars, escape rooms, and “no-scare” zones.",
  "Rain usually doesn’t cancel haunts—just expect muddier paths and longer lines.",
];

const trivia = [
  {
    q: "What’s the busiest hour of the night for most haunted houses?",
    a: "Usually 8:30–10:00 PM—perfect time to already be inside, not still parking.",
  },
  {
    q: "What’s the #1 thing people say they regret?",
    a: "Booking too few hours and having to cut the last stop or rush the food break.",
  },
  {
    q: "Which scares people more: chainsaws or clowns?",
    a: "In most polls, clowns win by a hair. Chainsaws just make everybody run.",
  },
];

const proTips = [
  "Pick a “calm buddy” in each friend group to watch for anxiety or motion sickness.",
  "Take a group photo before the first haunt—faces get progressively more destroyed.",
  "Keep the bus as the “safe zone”: music, snacks, and a place to breathe between scares.",
  "Save the most intense haunt for the middle of the night, not the very end.",
];

export default function HauntedFaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  const toggle = (i: number) => setOpen(open === i ? null : i);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-14">
      <div className="rounded-3xl border border-blue-800/30 bg-gradient-to-b from-[#101e3f] to-[#050b1e] p-6 md:p-10 shadow-xl">
        {/* Top intro */}
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">Haunted intel</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white">Make the scares fun, not stressful</h2>
          <p className="mt-3 text-blue-200/85 max-w-3xl mx-auto">
            Real-world timing, comfort, and safety tips from thousands of fall trips—plus a few just-for-fun facts to share on the bus.
          </p>
        </div>

        {/* BIG TOP GRID: facts + trivia + tips */}
        <div className="grid gap-6 lg:grid-cols-3 mb-12">
          {/* Quick facts */}
          <div className="rounded-3xl border border-blue-700/60 bg-[#07132b] p-6 md:p-7 flex flex-col">
            <p className="text-xs uppercase tracking-[0.25em] text-blue-300/80 mb-2">Quick facts</p>
            <h3 className="text-lg font-semibold text-white mb-3">Haunted house by the numbers</h3>
            <ul className="space-y-3 text-sm text-blue-100/90">
              {quickFacts.map((fact, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="mt-1 h-[7px] w-[7px] rounded-full bg-emerald-400 flex-shrink-0" />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Trivia */}
          <div className="rounded-3xl border border-violet-700/60 bg-[#0b1030] p-6 md:p-7 flex flex-col">
            <p className="text-xs uppercase tracking-[0.25em] text-violet-300/80 mb-2">Trivia corner</p>
            <h3 className="text-lg font-semibold text-white mb-3">Bus-ride conversation starters</h3>
            <div className="space-y-4 text-sm text-blue-100/90">
              {trivia.map((item, idx) => (
                <div key={idx}>
                  <p className="font-semibold text-white/95 mb-1">{item.q}</p>
                  <p className="text-blue-200/85">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pro tips / safety */}
          <div className="rounded-3xl border border-emerald-600/60 bg-[#051a19] p-6 md:p-7 flex flex-col">
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-300/80 mb-2">Pro tips & safety</p>
            <h3 className="text-lg font-semibold text-white mb-3">Keep everyone laughing, not panicking</h3>
            <ul className="space-y-3 text-sm text-emerald-100/90 mb-3">
              {proTips.map((tip, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="mt-1 h-[7px] w-[7px] rounded-sm bg-emerald-400 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-emerald-200/80">
              If anyone in your group has epilepsy, heart conditions, or strong sensory triggers, let your planner know so we can suggest calmer routes and quiet breaks.
            </p>
          </div>
        </div>

        {/* Original-style FAQ below */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Haunted House FAQ</h3>
          <p className="text-blue-200/85 max-w-2xl mb-7">
            First-timers, thrill-seekers, and “I’m only here because my friends made me” riders—here’s what people ask us the most.
          </p>

          <div className="space-y-4">
            {sampleFaqs.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.07] transition-colors"
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex justify-between items-center text-left px-5 py-4"
                >
                  <span className="text-white font-semibold">{item.q}</span>
                  <span
                    className={`transform transition-transform text-blue-300 ${
                      open === i ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                {open === i && (
                  <div className="px-5 pb-5 text-blue-200 text-sm leading-relaxed border-t border-white/10">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
