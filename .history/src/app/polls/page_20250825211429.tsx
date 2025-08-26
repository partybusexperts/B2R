"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import PageLayout from "../../components/PageLayout";
import Section from "../../components/Section";
// If your locations export lives elsewhere, adjust this path:
import { locations as LOCATIONS } from "../locations/locationData";

/* -----------------------------------------------------------------------------
   TYPES
----------------------------------------------------------------------------- */
type ScopeFilter =
  | "All"
  | "US Cities"
  | "US States"
  | "Event Transportation"
  | "Vehicles"
  | "Travel & Experience";

interface PollCategory {
  key: string;           // stable id for storage + anchors
  title: string;         // display title
  parent: ScopeFilter;
  polls: string[];       // EXACTLY 30 after generation
}

/* -----------------------------------------------------------------------------
   TAXONOMY
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
   UTILITIES
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
  // Default to ABCD to keep UI lively
  return OPTIONS_ABCD;
}

/* -----------------------------------------------------------------------------
   QUESTION TEMPLATES (we’ll compose to hit 30 per category)
----------------------------------------------------------------------------- */
const COMMON_TEMPLATES = [
  "Have you booked this before? (Yes/No)",
  "How far in advance do you plan? (A: <2wks, B: 2–6wks, C: 2–3mo, D: 4mo+)",
  "Which factor matters most? (A: Price, B: Capacity, C: Luxury, D: Safety)",
  "Will transparent pricing make you book earlier? (Yes/No)",
  "Would you pay for guaranteed on-time pickup? (Yes/No)",
  "Do reviews influence your choice? (Yes/No)",
  "What’s your group size usually? (A: 1–6, B: 7–14, C: 15–24, D: 25+)",
  "Preferred add-on? (A: WiFi, B: Lighting, C: Sound, D: USB)",
  "True or False: Comfort beats price for you.",
  "Do you split payments with your group? (Yes/No)",
  "Do you prefer mid-week to save money? (Yes/No)",
  "What’s your ideal trip length? (A: <2h, B: 2–4h, C: 4–8h, D: Full Day)",
  "Which booking method do you prefer? (A: Online, B: Phone, C: Text, D: Email)",
  "Do you value real-time ETA tracking? (Yes/No)",
  "Would you rebook the same provider? (Yes/No)",
];

const VEHICLE_TEMPLATES = [
  "Have you booked a {{CTX}} before? (Yes/No)",
  "Top reason to choose a {{CTX}}? (A: Price, B: Capacity, C: Luxury, D: Safety)",
  "True or False: {{CTX}} models vary a lot in quality.",
  "What do you value most on a {{CTX}}? (A: WiFi, B: Lights, C: Sound, D: USB)",
  "Is a newer {{CTX}} worth a higher price? (Yes/No)",
  "Which trip fits {{CTX}} best? (A: Wedding, B: Night Out, C: Corporate, D: Airport)",
  "True or False: {{CTX}} rides feel more social than other options.",
  "Which seat layout do you prefer on {{CTX}}? (A: Perimeter, B: Forward, C: Mixed, D: No Preference)",
  "Is luggage space critical for {{CTX}} bookings? (Yes/No)",
  "Would you book a {{CTX}} again? (Yes/No)",
];

const EVENT_TEMPLATES = [
  "Have you booked for {{CTX}} before? (Yes/No)",
  "Preferred vehicle for {{CTX}}? (A: Limo, B: Party Bus, C: Shuttle, D: SUV)",
  "True or False: {{CTX}} planning usually starts 2+ months out.",
  "Most critical factor for {{CTX}}? (A: Price, B: Capacity, C: Luxury, D: Safety)",
  "Add-ons most valued for {{CTX}}? (A: Lighting, B: Sound, C: Drinks, D: WiFi)",
  "Would you bundle return trips for {{CTX}}? (Yes/No)",
  "True or False: A coordinator improves {{CTX}} logistics.",
  "Do you prefer direct routes or scenic stops for {{CTX}}? (A: Direct, B: Scenic)",
  "Would a photo-stop add-on interest you for {{CTX}}? (Yes/No)",
  "True or False: You’d pay for priority vehicle selection for {{CTX}}.",
];

const STATE_TEMPLATES = [
  "Have you booked group transport in {{CTX}}? (Yes/No)",
  "Most popular vehicle in {{CTX}}? (A: Limo, B: Party Bus, C: Shuttle, D: SUV)",
  "True or False: Local {{CTX}} operators beat national brands on service.",
  "Lead time needed in {{CTX}}? (A: <1wk, B: 1–4wks, C: 1–3mo, D: 3mo+)",
  "Top amenity in {{CTX}}? (A: WiFi, B: Sound, C: Lighting, D: USB)",
  "Primary booking reason in {{CTX}}? (A: Wedding, B: Event, C: Airport, D: Night Out)",
  "True or False: Weather impacts timing in {{CTX}}.",
  "Do you compare 3+ quotes in {{CTX}}? (Yes/No)",
  "Preferred booking window in {{CTX}}? (A: Morning, B: Afternoon, C: Evening, D: Late Night)",
  "Would clearer fees increase bookings in {{CTX}}? (Yes/No)",
];

const CITY_TEMPLATES = [
  "Booked transportation in {{CTX}}? (Yes/No)",
  "Primary purpose in {{CTX}}? (A: Event, B: Airport, C: Night Out, D: Tourism)",
  "True or False: Traffic strongly affects pickup windows in {{CTX}}.",
  "Pay for guaranteed on-time pickup in {{CTX}}? (Yes/No)",
  "Most desired upgrade in {{CTX}}? (A: Newer Vehicle, B: Premium Sound, C: WiFi, D: Lighting)",
  "What’s your usual group size in {{CTX}}? (A: 1–6, B: 7–14, C: 15–24, D: 25+)",
  "Do you prefer local companies in {{CTX}}? (Yes/No)",
  "True or False: You’d book earlier with clearer pricing in {{CTX}}.",
  "Do you want real-time driver ETA in {{CTX}}? (Yes/No)",
  "Would you rebook the same provider in {{CTX}}? (Yes/No)",
];

// Filler set to reach 30, lightly contextualized:
const FILLER_TEMPLATES = [
  "Do you care about vehicle year/model? (Yes/No)",
  "Would you pay for a dedicated coordinator? (Yes/No)",
  "Which pickup buffer feels right? (A: 0–5m, B: 5–10m, C: 10–15m, D: 15m+)",
  "True or False: Text updates reduce day-of stress.",
  "Would a photo gallery help you choose faster? (Yes/No)",
  "Which quote style is better? (A: Hourly, B: Flat, C: Hybrid, D: Not Sure)",
  "True or False: You read 3+ reviews before booking.",
  "Do you need ADA options? (Yes/No)",
  "Which interior vibe do you prefer? (A: Classic, B: Modern, C: Party, D: Neutral)",
  "Should we show carbon-offset options? (Yes/No)",
  "Do you want split-payment links? (Yes/No)",
  "Which return strategy do you prefer? (A: One Wave, B: Two Waves, C: On-Call, D: Mixed)",
  "Which route type do you prefer? (A: Fastest, B: Scenic, C: Balanced, D: Flexible)",
  "Do you want curated venue lists? (Yes/No)",
  "Is 24/7 support important? (Yes/No)",
];

/* Compose 30 Qs with context substitution */
function fillTo30(primary: string[], ctx?: string): string[] {
  const sub = (t: string) => (ctx ? t.replaceAll("{{CTX}}", ctx) : t);
  const base = primary.map(sub);
  // mix in some common + filler until we hit 30
  const extrasPool = [...COMMON_TEMPLATES, ...FILLER_TEMPLATES].map(sub);
  const out: string[] = [];
  for (const q of base) out.push(q);
  let i = 0;
  while (out.length < 30) {
    out.push(extrasPool[i % extrasPool.length]);
    i++;
  }
  // de-dup just in case, then top-30
  const uniq = Array.from(new Set(out));
  return uniq.slice(0, 30);
}

/* -----------------------------------------------------------------------------
   CATEGORY BUILDERS
----------------------------------------------------------------------------- */
function buildVehicleCategory(v: string): PollCategory {
  return {
    key: `veh-${slug(v)}`,
    title: `${v} Polls`,
    parent: "Vehicles",
    polls: fillTo30(VEHICLE_TEMPLATES, v),
  };
}
function buildEventCategory(evt: string): PollCategory {
  return {
    key: `evt-${slug(evt)}`,
    title: `${evt} Transportation Polls`,
    parent: "Event Transportation",
    polls: fillTo30(EVENT_TEMPLATES, evt),
  };
}
function buildStateCategory(state: string): PollCategory {
  return {
    key: `state-${slug(state)}`,
    title: `${state} Transportation Polls`,
    parent: "US States",
    polls: fillTo30(STATE_TEMPLATES, state),
  };
}
function buildCityCategory(state: string, city: string): PollCategory {
  const ctx = `${city}, ${state}`;
  return {
    key: `city-${slug(state)}-${slug(city)}`,
    title: `${city}, ${state} Rider Polls`,
    parent: "US Cities",
    polls: fillTo30(CITY_TEMPLATES, ctx),
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
   LIGHTWEIGHT STORE WITH LOCALSTORAGE PERSISTENCE
----------------------------------------------------------------------------- */
type AnswerStore = Record<string, number | null>; // "catKey::idx" -> optionIndex

function useAnswerStore(storageKey = "polls-answers") {
  const [answers, setAnswers] = useState<AnswerStore>({});
  // load once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setAnswers(JSON.parse(raw));
    } catch {}
  }, [storageKey]);
  // persist
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(answers));
    } catch {}
  }, [answers, storageKey]);
  // helpers
  const set = (id: string, idx: number) =>
    setAnswers((a) => ({ ...a, [id]: idx }));
  const resetCat = (catKey: string) =>
    setAnswers((a) => {
      const copy: AnswerStore = {};
      for (const k of Object.keys(a)) if (!k.startsWith(catKey + "::")) copy[k] = a[k];
      return copy;
    });
  return { answers, set, resetCat };
}

function completion(cat: PollCategory, answers: AnswerStore) {
  const total = cat.polls.length; // 30
  const done = cat.polls.filter((_, i) => answers[`${cat.key}::${i}`] != null).length;
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

/* Debounce hook for search */
function useDebounced<T>(value: T, ms = 200) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return v;
}

/* -----------------------------------------------------------------------------
   BASE CURATED (Travel & Experience keeps 30)
----------------------------------------------------------------------------- */
const TRAVEL_COMFORT: PollCategory = {
  key: "tx-comfort",
  title: "Group Travel Comfort",
  parent: "Travel & Experience",
  polls: fillTo30([
    "Is WiFi a must-have on group trips? (Yes/No)",
    "How do you rate your last group trip? (A: Excellent, B: Good, C: Fair, D: Poor)",
    "True or False: Comfort is more important than price.",
    "Which is most comfortable? (A: Limo, B: Party Bus, C: Shuttle, D: SUV)",
  ]),
};

const TRAVEL_SAFETY: PollCategory = {
  key: "tx-safety",
  title: "Safety & Reliability",
  parent: "Travel & Experience",
  polls: fillTo30([
    "Would you pay extra for a safer vehicle? (Yes/No)",
    "Is reliability more important than price? (Yes/No)",
    "Which is safest? (A: Limo, B: Party Bus, C: Shuttle, D: SUV)",
    "True or False: Driver quality matters more than features.",
  ]),
};

const TRAVEL_VALUE: PollCategory = {
  key: "tx-value",
  title: "Pricing & Value",
  parent: "Travel & Experience",
  polls: fillTo30([
    "True or False: Price matters most when booking.",
    "Do you shop for deals before booking? (Yes/No)",
    "Best overall value? (A: Limo, B: Party Bus, C: Shuttle, D: SUV)",
    "What’s the top value feature? (A: Price, B: Comfort, C: Amenities, D: Safety)",
  ]),
};

const BASE_TRAVEL = [TRAVEL_COMFORT, TRAVEL_SAFETY, TRAVEL_VALUE];

/* -----------------------------------------------------------------------------
   MAIN PAGE
----------------------------------------------------------------------------- */
export default function Page() {
  const [scope, setScope] = useState<ScopeFilter>("All");
  const [q, setQ] = useState("");
  const search = useDebounced(q, 200);

  const [openModal, setOpenModal] = useState<string | null>(null);
  const { answers, set: setAnswer, resetCat } = useAnswerStore();
  const datasetRef = useRef<{ states: PollCategory[]; cities: PollCategory[] } | null>(null);

  // Build once from locations
  if (!datasetRef.current) datasetRef.current = buildFromLocations();
  const { states: stateCats, cities: cityCats } = datasetRef.current;

  // Vehicles + Events dynamic (each 30 qs)
  const vehicleCats = useMemo(() => VEHICLES.map(buildVehicleCategory), []);
  const eventCats = useMemo(() => EVENTS.map(buildEventCategory), []);

  // Combine all categories
  const all: PollCategory[] = useMemo(() => {
    const core = [
      ...vehicleCats,
      ...eventCats,
      ...stateCats,
      ...cityCats,
      ...BASE_TRAVEL,
    ];
    const scoped = scope === "All" ? core : core.filter((c) => c.parent === scope);
    const qq = search.trim().toLowerCase();
    if (!qq) return scoped;
    return scoped.filter(
      (c) =>
        c.title.toLowerCase().includes(qq) ||
        c.polls.some((p) => p.toLowerCase().includes(qq))
    );
  }, [vehicleCats, eventCats, stateCats, cityCats, scope, search]);

  // Group by parent for sections + stable order
  const groups = useMemo(() => {
    const order: ScopeFilter[] = [
      "US Cities",
      "US States",
      "Event Transportation",
      "Vehicles",
      "Travel & Experience",
    ];
    const map = new Map<string, PollCategory[]>();
    for (const c of all) map.set(c.parent, [...(map.get(c.parent) || []), c]);
    for (const [k, arr] of map) arr.sort((a, b) => a.title.localeCompare(b.title));
    return order.filter((k) => map.has(k)).map((k) => ({ parent: k, items: map.get(k)! }));
  }, [all]);

  // Command palette suggestions
  const suggestions = useMemo(() => {
    const qq = search.trim().toLowerCase();
    if (!qq) return [];
    const tokens = [
      ...vehicleCats.map((c) => ({ type: "Vehicle", label: c.title, anchor: idFor(c.parent, c.title) })),
      ...eventCats.map((c) => ({ type: "Event", label: c.title, anchor: idFor(c.parent, c.title) })),
      ...stateCats.map((c) => ({ type: "State", label: c.title, anchor: idFor(c.parent, c.title) })),
      ...cityCats.map((c) => ({ type: "City", label: c.title, anchor: idFor(c.parent, c.title) })),
    ];
    return tokens.filter((t) => t.label.toLowerCase().includes(qq)).slice(0, 10);
  }, [search, vehicleCats, eventCats, stateCats, cityCats]);

  // Smooth scroll to anchor + hash support
  const scrollToAnchor = (anchor: string) => {
    const el = document.getElementById(anchor);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (location.hash) {
      const anchor = location.hash.replace(/^#/, "");
      setTimeout(() => scrollToAnchor(anchor), 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lock scroll when modal open
  useEffect(() => {
    document.body.style.overflow = openModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [openModal]);

  return (
    <PageLayout gradientFrom="from-blue-950" gradientVia="via-blue-900" gradientTo="to-black" textColor="text-white">
      {/* HERO / HEADER */}
      <Section className="relative overflow-hidden text-center !pt-20 !pb-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,#1e3a8a_0%,#0b1934_55%,#030712_100%)]" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight font-serif bg-gradient-to-r from-blue-300 via-blue-200 to-blue-400 bg-clip-text text-transparent drop-shadow">
            Nationwide Rider Polls
          </h1>
          <p className="text-xl md:text-2xl text-blue-100/90 mt-4">
            Explore sentiment by <span className="font-semibold">city</span>, <span className="font-semibold">state</span>, <span className="font-semibold">event</span>, and <span className="font-semibold">vehicle</span>. Vote, see what others prefer, and help us improve planning tools.
          </p>

          {/* Controls Row (sticky-feel spacing below) */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 items-stretch justify-center">
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value as ScopeFilter)}
              className="bg-blue-950/70 border border-blue-600/40 rounded-2xl px-4 py-3 text-blue-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-400/60 w-full sm:w-56"
              aria-label="Scope"
            >
              {["All","US Cities","US States","Event Transportation","Vehicles","Travel & Experience"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <div className="relative flex-1">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search (e.g., Anchorage, Alaska, Wedding, Party Bus)…"
                className="w-full bg-blue-950/70 border border-blue-600/40 rounded-2xl px-4 py-3 text-blue-100 placeholder-blue-300/60 shadow focus:outline-none focus:ring-2 focus:ring-blue-400/60"
                aria-label="Search polls"
              />
              {q && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 rounded-2xl overflow-hidden border border-blue-700/40 bg-blue-950/95 backdrop-blur shadow-2xl z-20">
                  {suggestions.map((s) => (
                    <button
                      key={s.anchor}
                      onClick={() => { setQ(""); scrollToAnchor(s.anchor); history.replaceState(null, "", `#${s.anchor}`); }}
                      className="w-full text-left px-4 py-3 hover:bg-blue-900/60 flex items-center gap-2"
                    >
                      <span className="text-xs text-blue-300/80 uppercase tracking-wide">{s.type}</span>
                      <span className="text-blue-100">{s.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 text-sm text-blue-300/80">
            {all.length} categories visible • {all.reduce((n, c) => n + c.polls.length, 0)} polls (30 each)
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
            {items.map((cat) => {
              const anchor = idFor(parent, cat.title);
              const { total, done, pct } = completion(cat, answers);
              const previewCount = 3; // show 3 on card before "More"
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

                  {/* Preview Polls (3) */}
                  <ul className="space-y-4">
                    {cat.polls.slice(0, previewCount).map((poll, i) => {
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
                    <button
                      onClick={() => {
                        const hash = `#${anchor}`;
                        history.replaceState(null, "", hash);
                        resetCat(cat.key);
                      }}
                      className="text-xs px-3 py-2 rounded-full border border-blue-400/50 text-blue-200 hover:bg-blue-900/50"
                      title="Clear your answers for this category"
                    >
                      Reset
                    </button>
                  </div>

                  {/* Modal with ALL 30 (scrollable) */}
                  {isOpen && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur"
                      onClick={() => setOpenModal(null)}
                      role="dialog"
                      aria-modal="true"
                    >
                      <div
                        className="bg-gradient-to-br from-blue-900 via-blue-950 to-black rounded-3xl shadow-2xl p-8 max-w-2xl w-full border-4 border-blue-400/30"
                        onClick={(e) => e.stopPropagation()}
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

                        <div className="max-h-[65vh] overflow-y-auto pr-2 space-y-4">
                          {cat.polls.map((poll, i) => {
                            const pid = `${cat.key}::${i}`;
                            const options = optionsFor(poll);
                            return (
                              <div key={pid} className="bg-blue-900/70 rounded-xl px-4 py-3 border border-blue-400/20">
                                <div className="text-blue-100 font-medium mb-2">
                                  {i + 1}. {poll}
                                </div>
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
                            onClick={() => resetCat(cat.key)}
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
