"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import PageLayout from "../../components/PageLayout";
import Section from "../../components/Section";
// ⬇️ Adjust this import path if your locations export lives elsewhere.
import { locations as LOCATIONS } from "../locations/locationData";

/* -----------------------------------------------------------------------------
   TYPES
----------------------------------------------------------------------------- */
type ScopeFilter =
  | "All"
  | "Vehicles"
  | "Event Transportation"
  | "US States"
  | "US Cities"
  | "Travel & Experience";

interface PollCategory {
  key: string;           // stable id for anchors / selection
  title: string;         // display title
  parent: ScopeFilter | "Regional & City-Based Transportation"; // legacy parent still groups
  polls: string[];       // list of questions
}

/* -----------------------------------------------------------------------------
   TAXONOMY (vehicles + events)
----------------------------------------------------------------------------- */
const VEHICLES = [
  "Party Bus",
  "Limousine",
  "Coach / Charter Bus",
  "Shuttle / Minibus",
  "SUV / Executive",
  "Black Car / Luxury Sedan",
];

const EVENTS = [
  "Wedding","Prom","Airport Transfer","Corporate Event","Concert","Festival","Sporting Event",
  "Birthday","Bachelor Party","Bachelorette Party","Casino Trip","Wine Tour","Brewery Tour",
  "Holiday / NYE","Quinceañera","Homecoming","Graduation","Shuttle Loop","City Tour","Night Out",
];

/* -----------------------------------------------------------------------------
   UTILS
----------------------------------------------------------------------------- */
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const idFor = (parent: string, title: string) => `${slug(parent)}__${slug(title)}`;

const OPTIONS_YESNO = ["Yes", "No"];
const OPTIONS_TF = ["True", "False"];
const OPTIONS_ABCD = ["A", "B", "C", "D"];

function optionsFor(q: string): string[] {
  if (/true|false/i.test(q)) return OPTIONS_TF;
  if (/\bA:/.test(q)) return OPTIONS_ABCD;
  if (/yes\/?no/i.test(q)) return OPTIONS_YESNO;
  if (/\bYes\b|\bNo\b/i.test(q)) return OPTIONS_YESNO;
  return OPTIONS_ABCD;
}

/* -----------------------------------------------------------------------------
   BASE CURATED CATEGORIES (tightened and merged for brevity)
----------------------------------------------------------------------------- */
const BASE: PollCategory[] = [
  {
    key: "vehicle-black-car",
    title: "Black Car / Luxury Sedan Polls",
    parent: "Vehicles",
    polls: [
      "What’s your favorite luxury sedan brand? (A: Mercedes, B: BMW, C: Audi, D: Lexus)",
      "Do you prefer black or white sedans? (A: Black, B: White)",
      "True or False: Sedans are best for airport transfers.",
      "Would you book a luxury sedan for a business trip? (Yes/No)",
      "Which sedan feature matters most? (A: Comfort, B: Privacy, C: Tech, D: Style)",
    ],
  },
  {
    key: "vehicle-suv",
    title: "SUV / Executive Transport Polls",
    parent: "Vehicles",
    polls: [
      "Do you prefer SUVs or sedans for airport transfers? (A: SUV, B: Sedan)",
      "Would you book an SUV for a night out? (Yes/No)",
      "True or False: SUVs are safer than sedans.",
      "Which SUV feature is most important? (A: Space, B: Comfort, C: Tech, D: Style)",
    ],
  },
  {
    key: "vehicle-minibus",
    title: "Shuttle / Minibus Polls",
    parent: "Vehicles",
    polls: [
      "Have you used a shuttle for a concert? (Yes/No)",
      "Which is better for groups? (A: Shuttle, B: Minibus)",
      "True or False: Minibuses are more fun than shuttles.",
      "Which minibus feature is most important? (A: Space, B: Comfort, C: Tech, D: Style)",
    ],
  },
  {
    key: "tx-comfort",
    title: "Group Travel Comfort",
    parent: "Travel & Experience",
    polls: [
      "Is WiFi a must-have on group trips? (Yes/No)",
      "How do you rate your last group trip? (A: Excellent, B: Good, C: Fair, D: Poor)",
      "True or False: Comfort is more important than price.",
      "Which is most comfortable? (A: Limo, B: Party Bus, C: Shuttle, D: SUV)",
    ],
  },
  {
    key: "tx-safety",
    title: "Safety & Reliability",
    parent: "Travel & Experience",
    polls: [
      "Would you pay extra for a safer vehicle? (Yes/No)",
      "Is reliability more important than price? (Yes/No)",
      "Which is safest? (A: Limo, B: Party Bus, C: Shuttle, D: SUV)",
      "True or False: Driver quality matters more than features.",
    ],
  },
  {
    key: "tx-value",
    title: "Pricing & Value",
    parent: "Travel & Experience",
    polls: [
      "True or False: Price matters most when booking.",
      "Do you shop for deals before booking? (Yes/No)",
      "Best overall value? (A: Limo, B: Party Bus, C: Shuttle, D: SUV)",
      "What’s the top value feature? (A: Price, B: Comfort, C: Amenities, D: Safety)",
    ],
  },
];

/* -----------------------------------------------------------------------------
   DYNAMIC CATEGORY BUILDERS (vehicles, events, states, cities)
----------------------------------------------------------------------------- */
function buildVehicleCategory(v: string): PollCategory {
  return {
    key: `veh-${slug(v)}`,
    title: `${v} Polls`,
    parent: "Vehicles",
    polls: [
      `Have you booked a ${v} before? (Yes/No)`,
      `Top reason to choose a ${v}? (A: Price, B: Capacity, C: Luxury, D: Safety)`,
      `True or False: ${v} models vary a lot in quality.`,
      `What do you value most on a ${v}? (A: WiFi, B: Lights, C: Sound, D: USB)`,
    ],
  };
}

function buildEventCategory(evt: string): PollCategory {
  return {
    key: `evt-${slug(evt)}`,
    title: `${evt} Transportation Polls`,
    parent: "Event Transportation",
    polls: [
      `Have you booked a vehicle for a ${evt}? (Yes/No)`,
      `Preferred vehicle for ${evt}? (A: Limo, B: Party Bus, C: Shuttle, D: SUV)`,
      `True or False: ${evt} planning usually starts 2+ months out.`,
      `Most critical factor for ${evt}? (A: Price, B: Capacity, C: Luxury, D: Safety)`,
      `Add-ons most valued for ${evt}? (A: Lighting, B: Sound, C: Drinks, D: WiFi)`,
    ],
  };
}

function buildStateCategory(state: string): PollCategory {
  return {
    key: `state-${slug(state)}`,
    title: `${state} Transportation Polls`,
    parent: "US States",
    polls: [
      `Have you booked group transport in ${state}? (Yes/No)`,
      `Most popular vehicle in ${state}? (A: Limo, B: Party Bus, C: Shuttle, D: SUV)`,
      `True or False: Local ${state} operators beat national brands on service.`,
      `Lead time needed in ${state}? (A: <1wk, B: 1–4wks, C: 1–3mo, D: 3mo+)`,
      `Top amenity in ${state}? (A: WiFi, B: Sound, C: Lighting, D: USB)`,
    ],
  };
}

function buildCityCategory(state: string, city: string): PollCategory {
  return {
    key: `city-${slug(state)}-${slug(city)}`,
    title: `${city}, ${state} Rider Polls`,
    parent: "US Cities",
    polls: [
      `Booked transportation in ${city}? (Yes/No)`,
      `Primary purpose in ${city}? (A: Event, B: Airport, C: Night Out, D: Tourism)`,
      `True or False: Traffic strongly affects pickup windows in ${city}.`,
      `Pay for guaranteed on-time pickup in ${city}? (Yes/No)`,
      `Most desired upgrade in ${city}? (A: Newer Vehicle, B: Premium Sound, C: WiFi, D: Lighting)`,
    ],
  };
}

/* Build from your LOCATIONS data */
function buildFromLocations(): { states: PollCategory[]; cities: PollCategory[] } {
  const states: PollCategory[] = [];
  const cities: PollCategory[] = [];
  for (const { state, cities: list } of LOCATIONS) {
    if (!state) continue;
    states.push(buildStateCategory(state));
    if (Array.isArray(list)) {
      for (const city of list) {
        if (city && city.toLowerCase() !== "coming soon") {
          cities.push(buildCityCategory(state, city));
        }
      }
    }
  }
  return { states, cities };
}

/* -----------------------------------------------------------------------------
   LIGHTWEIGHT STORE FOR ANSWERS + “GENERATE MORE”
----------------------------------------------------------------------------- */
type AnswerStore = Record<string, number | null>; // pollId => optionIndex
const useAnswerStore = () => {
  const [answers, setAnswers] = useState<AnswerStore>({});
  const set = (id: string, idx: number) => setAnswers(a => ({ ...a, [id]: idx }));
  const resetCat = (catKey: string) =>
    setAnswers(a => {
      const copy: AnswerStore = {};
      for (const k of Object.keys(a)) if (!k.startsWith(catKey + "::")) copy[k] = a[k];
      return copy;
    });
  return { answers, set, resetCat };
};

function completion(cat: PollCategory, answers: AnswerStore) {
  const total = cat.polls.length;
  const done = cat.polls.filter((_, i) => answers[`${cat.key}::${i}`] != null).length;
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

/* Generate a few extra polls when user is ~80% done */
function generateMore(cat: PollCategory): string[] {
  const ctx = cat.title.replace(/ Polls?$/i, "");
  const base = [
    `Would clearer pricing boost bookings for ${ctx}? (Yes/No)`,
    `Top frustration in ${ctx}? (A: Late ETA, B: Vehicle mismatch, C: Fees, D: Support)`,
    `True or False: You’d book earlier if reviews were easier to compare for ${ctx}.`,
    `Do you split payments with friends for ${ctx}? (Yes/No)`,
  ];
  // avoid duplicates
  return base.filter(q => !cat.polls.includes(q));
}

/* -----------------------------------------------------------------------------
   MAIN PAGE
----------------------------------------------------------------------------- */
export default function Page() {
  // “Smart scope” + search
  const [scope, setScope] = useState<ScopeFilter>("All");
  const [q, setQ] = useState("");
  const [openModal, setOpenModal] = useState<string | null>(null);
  const { answers, set: setAnswer, resetCat } = useAnswerStore();
  const datasetRef = useRef<{ states: PollCategory[]; cities: PollCategory[] } | null>(null);

  // Build once from locations
  if (!datasetRef.current) datasetRef.current = buildFromLocations();
  const { states: stateCats, cities: cityCats } = datasetRef.current;

  // Vehicles + Events dynamic
  const vehicleCats = useMemo(() => VEHICLES.map(buildVehicleCategory), []);
  const eventCats = useMemo(() => EVENTS.map(buildEventCategory), []);

  // Full collection
  const all: PollCategory[] = useMemo(() => {
    const core = [...BASE, ...vehicleCats, ...eventCats, ...stateCats, ...cityCats];
    // Scope filter
    const scoped = core.filter(c => scope === "All" ? true : c.parent === scope);
    // Search filter (title or any poll text)
    const qq = q.trim().toLowerCase();
    if (!qq) return scoped;
    return scoped.filter(c =>
      c.title.toLowerCase().includes(qq) ||
      c.polls.some(p => p.toLowerCase().includes(qq))
    );
  }, [scope, q, vehicleCats, eventCats, stateCats, cityCats]);

  // Group by parent for sections + stable order
  const groups = useMemo(() => {
    const order: ScopeFilter[] = ["US Cities","US States","Event Transportation","Vehicles","Travel & Experience"];
    const map = new Map<string, PollCategory[]>();
    for (const c of all) map.set(c.parent, [...(map.get(c.parent) || []), c]);
    // sort each group by title
    for (const [k, arr] of map) arr.sort((a,b)=>a.title.localeCompare(b.title));
    return order.filter(k => map.has(k)).map(k => ({ parent: k, items: map.get(k)! }));
  }, [all]);

  // Command-palette suggestions (top 10)
  const suggestions = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return [];
    const tokens = [
      ...vehicleCats.map(c => ({ type: "Vehicle", label: c.title, anchor: idFor(c.parent, c.title) })),
      ...eventCats.map(c => ({ type: "Event", label: c.title, anchor: idFor(c.parent, c.title) })),
      ...stateCats.map(c => ({ type: "State", label: c.title, anchor: idFor(c.parent, c.title) })),
      ...cityCats.map(c => ({ type: "City", label: c.title, anchor: idFor(c.parent, c.title) })),
    ];
    return tokens.filter(t => t.label.toLowerCase().includes(qq)).slice(0, 10);
  }, [q, vehicleCats, eventCats, stateCats, cityCats]);

  // Smooth scroll to anchor
  const scrollToAnchor = (anchor: string) => {
    const el = document.getElementById(anchor);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Close modal unlock scroll
  useEffect(() => {
    document.body.style.overflow = openModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [openModal]);

  return (
    <PageLayout gradientFrom="from-blue-950" gradientVia="via-blue-900" gradientTo="to-black" textColor="text-white">
      {/* HERO HEADER */}
      <Section className="relative overflow-hidden text-center !pt-20 !pb-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,#1e3a8a_0%,#0b1934_55%,#030712_100%)]" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight font-serif bg-gradient-to-r from-blue-300 via-blue-200 to-blue-400 bg-clip-text text-transparent drop-shadow">
            Nationwide Rider Polls
          </h1>
          <p className="text-xl md:text-2xl text-blue-100/90 mt-4">
            Explore sentiment by <span className="font-semibold">city</span>, <span className="font-semibold">state</span>,
            <span className="font-semibold"> event</span>, and <span className="font-semibold">vehicle</span>. Vote, see what others prefer,
            and help us improve planning tools.
          </p>

          {/* Scope + Command Search */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 items-stretch justify-center">
            <select
              value={scope}
              onChange={e => setScope(e.target.value as ScopeFilter)}
              className="bg-blue-950/70 border border-blue-600/40 rounded-2xl px-4 py-3 text-blue-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-400/60 w-full sm:w-56"
              aria-label="Scope"
            >
              {["All","US Cities","US States","Event Transportation","Vehicles","Travel & Experience"].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <div className="relative flex-1">
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search (e.g., Anchorage, Alaska, Wedding, Party Bus)…"
                className="w-full bg-blue-950/70 border border-blue-600/40 rounded-2xl px-4 py-3 text-blue-100 placeholder-blue-300/60 shadow focus:outline-none focus:ring-2 focus:ring-blue-400/60"
                aria-label="Search polls"
              />
              {/* Command palette suggestions */}
              {q && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 rounded-2xl overflow-hidden border border-blue-700/40 bg-blue-950/95 backdrop-blur shadow-2xl z-20">
                  {suggestions.map(s => (
                    <button
                      key={s.anchor}
                      onClick={() => { setQ(""); scrollToAnchor(s.anchor); }}
                      className="w-full text-left px-4 py-3 hover:bg-blue-900/60 flex items-center gap-2"
                    >
                      <span className="text-xs text-blue-300/80 uppercase tracking-wide">{s.type}</span>
                      <span className="text-blue-100">{s.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => alert("Thanks! Suggestion box coming soon.")}
              className="rounded-2xl bg-white text-blue-900 font-bold px-5 py-3 shadow hover:bg-blue-50"
            >
              ✨ Suggest a Poll
            </button>
          </div>

          <div className="mt-4 text-sm text-blue-300/80">
            {all.length} categories visible • {all.reduce((n, c) => n + c.polls.length, 0)} polls
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none">
          <svg viewBox="0 0 1440 160" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,96 C240,160 480,32 720,80 C960,128 1200,64 1440,112 L1440,160 L0,160 Z" fill="#0c2344" />
          </svg>
        </div>
      </Section>

      {/* GROUPS */}
      {groups.map(({ parent, items }) => (
        <Section key={parent} className="max-w-7xl mx-auto mb-16 bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl py-10 px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-8 font-serif tracking-tight text-center bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">
            {parent}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map(cat => {
              const anchor = idFor(parent, cat.title);
              const { total, done, pct } = completion(cat, answers);
              const showCount = Math.min(3, cat.polls.length);
              const hasMore = cat.polls.length > showCount;
              const isOpen = openModal === cat.key;

              return (
                <div
                  id={anchor}
                  key={cat.key}
                  className={`relative bg-blue-950/90 rounded-2xl shadow-2xl p-6 border border-blue-700/20 text-white ${!isOpen ? "hover:scale-[1.015] transition-transform" : ""}`}
                >
                  {/* Header + progress */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-2" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold font-serif">{cat.title}</h3>
                      <div className="mt-2 h-2 bg-blue-900/60 rounded overflow-hidden">
                        <div style={{ width: `${pct}%` }} className="h-full bg-blue-400" />
                      </div>
                      <div className="mt-1 text-xs text-blue-300/80">{done}/{total} answered</div>
                    </div>
                  </div>

                  {/* First 3 polls */}
                  <ul className="space-y-4">
                    {cat.polls.slice(0, showCount).map((poll, i) => {
                      const pid = `${cat.key}::${i}`;
                      const options = optionsFor(poll);
                      return (
                        <li key={pid} className="bg-blue-900/60 rounded-xl px-4 py-3 border border-blue-700/20">
                          <div className="text-blue-100 font-medium mb-2">{poll}</div>
                          <div className="flex flex-wrap gap-2">
                            {options.map((opt, idx) => (
                              <button
                                key={opt}
                                onClick={() => setAnswer(pid, idx)}
                                className={`px-3 py-1 rounded-full border text-sm ${
                                  answers[pid] === idx
                                    ? "bg-blue-400 text-blue-950 border-blue-300"
                                    : "bg-blue-950/70 text-blue-200 border-blue-700/30 hover:bg-blue-900/80"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Actions */}
                  <div className="mt-5 flex items-center justify-between">
                    <button
                      onClick={() => setOpenModal(cat.key)}
                      className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-blue-950 font-extrabold shadow hover:scale-105"
                    >
                      More Polls →
                    </button>
                    {pct >= 80 && (
                      <button
                        onClick={() => {
                          const extras = generateMore(cat);
                          if (extras.length) {
                            // mutate in place is fine for demo; in prod, lift state
                            cat.polls.push(...extras);
                          }
                        }}
                        className="text-xs px-3 py-2 rounded-full border border-blue-400/50 text-blue-200 hover:bg-blue-900/50"
                      >
                        + Generate more like this
                      </button>
                    )}
                  </div>

                  {/* Modal with all polls */}
                  {isOpen && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur"
                      onClick={() => setOpenModal(null)}
                      role="dialog"
                      aria-modal="true"
                    >
                      <div
                        className="bg-gradient-to-br from-blue-900 via-blue-950 to-black rounded-3xl shadow-2xl p-8 max-w-2xl w-full border-4 border-blue-400/30"
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-2xl font-extrabold font-serif text-blue-200">{cat.title} — All Polls</h3>
                          <button
                            onClick={() => setOpenModal(null)}
                            className="text-3xl text-blue-300 hover:text-blue-100 leading-none"
                            aria-label="Close"
                          >
                            ×
                          </button>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
                          {cat.polls.map((poll, i) => {
                            const pid = `${cat.key}::${i}`;
                            const options = optionsFor(poll);
                            return (
                              <div key={pid} className="bg-blue-900/70 rounded-xl px-4 py-3 border border-blue-400/20">
                                <div className="text-blue-100 font-medium mb-2">{poll}</div>
                                <div className="flex flex-wrap gap-2">
                                  {options.map((opt, idx) => (
                                    <button
                                      key={opt}
                                      onClick={() => setAnswer(pid, idx)}
                                      className={`px-3 py-1 rounded-full border text-sm ${
                                        answers[pid] === idx
                                          ? "bg-blue-400 text-blue-950 border-blue-300"
                                          : "bg-blue-950/70 text-blue-200 border-blue-700/30 hover:bg-blue-900/80"
                                      }`}
                                    >
                                      {opt}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                          <button
                            onClick={() => { resetCat(cat.key); }}
                            className="text-xs px-4 py-2 rounded-full border border-blue-400/50 text-blue-200 hover:bg-blue-900/50"
                          >
                            Reset answers
                          </button>
                          <button
                            onClick={() => setOpenModal(null)}
                            className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-blue-950 font-extrabold shadow"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      ))}
    </PageLayout>
  );
}
