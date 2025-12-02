"use client";

import React, { useState } from "react";

type FAQ = { q: string; a: string };

const sampleFaqs: FAQ[] = [
  {
    q: "What should I wear to a haunted house?",
    a: "Wear comfortable, closed-toe shoes and clothing you can move freely in. Avoid long jewelry or costumes that drag — you might need to run!",
  },
  {
    q: "Are haunted houses actually scary?",
    a: "Yes — but in a fun way! Expect jump scares, fog, eerie lighting, and creepy sound effects. You can always tell actors you don’t want to be touched.",
  },
  {
    q: "Can kids attend haunted houses?",
    a: "Most haunted houses are recommended for ages 12 and up, but family-friendly options exist. Check the event’s website or contact organizers before bringing young kids.",
  },
  {
    q: "How long does a haunted house take to go through?",
    a: "Most take between 15 and 45 minutes depending on crowd size and attraction length. VIP passes usually help you skip the line.",
  },
  {
    q: "Is alcohol allowed or available at haunted houses?",
    a: "Some events offer themed bars or beer gardens, while others prohibit alcohol entirely. Always check local open-container laws before planning BYOB nights.",
  },
  {
    q: "Can I bring my phone or record inside?",
    a: "Most venues allow phones for photos in designated areas, but recording inside scares can ruin surprises. Use your phone sparingly and keep your flashlight off.",
  },
];

export default function HauntedFaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  const toggle = (i: number) => setOpen(open === i ? null : i);

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-14">
      <div className="rounded-3xl border border-blue-800/30 bg-gradient-to-b from-[#101e3f] to-[#061024] p-6 md:p-10 shadow-xl">
        <h2 className="text-3xl font-bold text-white text-center mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-blue-200/80 text-center max-w-2xl mx-auto mb-10">
          Everything you’ve wondered before screaming your way through a haunted house night.
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
    </section>
  );
}
