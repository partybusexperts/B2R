"use client";

import React, { useEffect, useState } from "react";
import PageLayout from "../../components/PageLayout";
import Section from "../../components/Section";
import { Poll } from "../../components/PollsSection";

const PHONE_DISPLAY = "(888) 535-2566";
const PHONE_TEL = "8885352566";
const EMAIL = "info@bus2ride.com";

interface PollData {
  id: string;
  question: string;
  options: string[];
  votes: Record<string, number>;
}

export default function PollsPage() {
  const [polls, setPolls] = useState<PollData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPolls() {
      try {
        const response = await fetch('/api/poll/all');
        if (!response.ok) throw new Error('Failed to fetch polls');
        const data = await response.json();
        setPolls(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchPolls();
  }, []);

  return (
    <PageLayout 
      headerCta={{
        phone: { display: PHONE_DISPLAY, tel: PHONE_TEL },
        email: EMAIL,
      }}
      title="Interactive Polls" 
      description="Vote on polls and see live results"
    >
      <Section
        title="Polls"
        subtitle="Vote and see what others think"
        className="py-20"
      >
        {loading && (
          <div className="text-center py-8">
            <div className="animate-pulse text-gray-600">Loading polls...</div>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8">
            <div className="text-red-600">Error: {error}</div>
          </div>
        )}
        
        {!loading && !error && polls.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-600">No polls available</div>
          </div>
        )}

        {!loading && !error && polls.length > 0 && (
          <div className="grid gap-8 max-w-4xl mx-auto">
            {polls.map((poll) => (
              <Poll
                key={poll.id}
                id={poll.id}
                question={poll.question}
                options={poll.options}
                initialResults={poll.votes}
              />
            ))}
          </div>
        )}
      </Section>
    </PageLayout>
  );
}
  "Birthday","Bachelor Party","Bachelorette Party","Casino Trip","Wine Tour","Brewery Tour",
  "Holiday / NYE","Quinceañera","Homecoming","Graduation","Shuttle Loop","City Tour","Night Out",
];

/* ---------------------------------------------------------------------------
   UTILITIES
--------------------------------------------------------------------------- */
const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
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

/* ---------------------------------------------------------------------------
   QUESTION TEMPLATES
--------------------------------------------------------------------------- */
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

/* ---------------------------------------------------------------------------
   COMPOSE TO 30
--------------------------------------------------------------------------- */
function fillTo30(primary: string[], ctx?: string): string[] {
  const sub = (t: string) => (ctx ? t.replaceAll("{{CTX}}", ctx) : t);
  const base = primary.map(sub);
  const extrasPool = [...COMMON_TEMPLATES, ...FILLER_TEMPLATES].map(sub);
  const out: string[] = [...base];
  let i = 0;
  while (out.length < 30) {
    out.push(extrasPool[i % extrasPool.length]);
    i++;
  }
  const uniq = Array.from(new Set(out));
  return uniq.slice(0, 30);
}

/* ---------------------------------------------------------------------------
   CATEGORY BUILDERS
--------------------------------------------------------------------------- */
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

/* Build from your LOCATIONS dataset */
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

/* ---------------------------------------------------------------------------
   ANSWER STORE (localStorage)
--------------------------------------------------------------------------- */
type AnswerStore = Record<string, number | null>; // "catKey::idx" -> optionIndex

function useAnswerStore(storageKey = "polls-answers") {
  const [answers, setAnswers] = useState<AnswerStore>({});
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setAnswers(JSON.parse(raw));
    } catch { /* ignore */ }
  }, [storageKey]);
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(answers));
    } catch { /* ignore */ }
  }, [answers, storageKey]);
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

/* ---------------------------------------------------------------------------
   TRAVEL & EXPERIENCE BASE (each filled to 30)
--------------------------------------------------------------------------- */
const BASE_TRAVEL: PollCategory[] = [
  {
    key: "tx-comfort",
    title: "Group Travel Comfort",
    parent: "Travel & Experience",
    polls: fillTo30([
      "Is WiFi a must-have on group trips? (Yes/No)",
      "How do you rate your last group trip? (A: Excellent, B: Good, C: Fair, D: Poor)",
      "True or False: Comfort is more important than price.",
      "Which is most comfortable? (A: Limo, B: Party Bus, C: Shuttle, D: SUV)",
    ]),
  },
  {
    key: "tx-safety",
    title: "Safety & Reliability",
    parent: "Travel & Experience",
    polls: fillTo30([
      "Would you pay extra for a safer vehicle? (Yes/No)",
      "Is reliability more important than price? (Yes/No)",
      "Which is safest? (A: Limo, B: Party Bus, C: Shuttle, D: SUV)",
      "True or False: Driver quality matters more than features.",
    ]),
  },
  {
    key: "tx-value",
    title: "Pricing & Value",
    parent: "Travel & Experience",
    polls: fillTo30([
      "True or False: Price matters most when booking.",
      "Do you shop for deals before booking? (Yes/No)",
      "Best overall value? (A: Limo, B: Party Bus, C: Shuttle, D: SUV)",
      "What’s the top value feature? (A: Price, B: Comfort, C: Amenities, D: Safety)",
    ]),
  },
];

/* ---------------------------------------------------------------------------
   MAIN PAGE
--------------------------------------------------------------------------- */
export default function Page() {
  // filters & search
  const [scope, setScope] = useState<ScopeFilter>("All");
  const [q, setQ] = useState("");
  const search = useDebounced(q, 200);

  // modal + answers
  const [openModal, setOpenModal] = useState<string | null>(null);
  const { answers, resetCat } = useAnswerStore();

  // one-time build from locations
  const datasetRef = useRef<{ states: PollCategory[]; cities: PollCategory[] } | null>(null);
  if (!datasetRef.current) datasetRef.current = buildFromLocations();
  const { states: stateCats, cities: cityCats } = datasetRef.current;

  const vehicleCats = useMemo(() => VEHICLES.map(buildVehicleCategory), []);
  const eventCats   = useMemo(() => EVENTS.map(buildEventCategory), []);

  // full list -> scope -> search
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

  // group for sections
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
  map.forEach((arr) => arr.sort((a, b) => a.title.localeCompare(b.title)));
  return order.filter((key) => map.has(key)).map((key) => ({ parent: key, items: map.get(key)! }));
  }, [all]);

  // suggestions for the input dropdown
  const suggestions = useMemo(() => {
    const qq = search.trim().toLowerCase();
    if (!qq) return [];
    const tokens = [
      ...vehicleCats.map((c) => ({ type: "Vehicle", label: c.title, anchor: idFor(c.parent, c.title) })),
      ...eventCats.map((c)   => ({ type: "Event",   label: c.title, anchor: idFor(c.parent, c.title) })),
      ...stateCats.map((c)   => ({ type: "State",   label: c.title, anchor: idFor(c.parent, c.title) })),
      ...cityCats.map((c)    => ({ type: "City",    label: c.title, anchor: idFor(c.parent, c.title) })),
    ];
    return tokens.filter((t) => t.label.toLowerCase().includes(qq)).slice(0, 10);
  }, [search, vehicleCats, eventCats, stateCats, cityCats]);

  // anchor scroll
  const scrollToAnchor = (anchor: string) => {
    const el = document.getElementById(anchor);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = openModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [openModal]);

  // No page-level prefetch or per-poll state here — each Poll component manages results, selection, and voting.

  return (
    <PageLayout gradientFrom="from-blue-950" gradientVia="via-blue-900" gradientTo="to-black" textColor="text-white">
      {/* ---------- HERO / HEADER (matches the bright one you liked) ---------- */}
      <section className="relative overflow-hidden min-h-[520px] md:min-h-[600px] flex flex-col items-center justify-center text-center py-20">
        {/* Primary bright gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-blue-600 to-indigo-900" />
        {/* Sheen overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 mix-blend-overlay pointer-events-none" />
        <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold mb-6 tracking-tight font-serif text-white drop-shadow-[0_6px_20px_rgba(0,0,0,.35)]">
          Nationwide Rider Polls
        </h1>
        <p className="relative z-10 text-2xl md:text-3xl max-w-3xl mx-auto mb-8 text-blue-50 font-medium drop-shadow">
          Explore sentiment by city, state, event, and vehicle. Vote and see what others prefer.
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

        {/* Controls row (scope + search) */}
        <div className="relative z-10 w-full max-w-5xl mt-8 px-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch justify-center">
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value as ScopeFilter)}
              className="bg-white/90 text-blue-900 border border-white/60 rounded-full px-5 py-3 shadow focus:outline-none focus:ring-2 focus:ring-white/70 w-full md:w-56"
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
                className="w-full bg-white/90 text-blue-900 border border-white/60 rounded-full px-5 py-3 placeholder-blue-900/60 shadow focus:outline-none focus:ring-2 focus:ring-white/70"
                aria-label="Search polls"
              />
              {q && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 rounded-xl overflow-hidden border border-blue-700/40 bg-blue-950/95 shadow-2xl z-20">
                  {suggestions.map((s) => (
                    <button
                      key={s.anchor}
                      onClick={() => { setQ(""); scrollToAnchor(s.anchor); history.replaceState(null, "", `#${s.anchor}`); }}
                      className="w-full text-left px-4 py-3 hover:bg-blue-900/60 flex items-center gap-2"
                    >
                      <span className="text-xs text-blue-300/80 uppercase">{s.type}</span>
                      <span className="text-blue-100">{s.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 text-sm text-blue-50/90">
            {all.length} categories visible • {all.reduce((n, c) => n + c.polls.length, 0)} polls (30 each)
          </div>
        </div>

        {/* Decorative wave divider */}
        <div className="absolute bottom-[-1px] left-0 right-0">
          <svg viewBox="0 0 1440 110" className="w-full h-[110px]" preserveAspectRatio="none">
            <path
              d="M0,80 C240,130 480,20 720,60 C960,100 1200,40 1440,80 L1440,120 L0,120 Z"
              fill="#0b1934"
              opacity="1"
            />
          </svg>
        </div>
      </section>

      {/* ---------- GROUPS (unchanged) ---------- */}
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
                  className="relative bg-blue-950/90 rounded-2xl shadow-2xl p-6 border border-blue-700/20 text-white hover:scale-[1.015] transition-transform"
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

                  {/* Preview: 3 polls */}
                  <ul className="space-y-4">
                    {cat.polls.slice(0, previewCount).map((poll, i) => {
                      const pollObj = { id: `${cat.key}__${i}`, question: poll, options: optionsFor(poll) };
                      return (
                        <li key={pollObj.id} className="bg-blue-900/60 rounded-xl px-4 py-3 border border-blue-700/20">
                          <Poll poll={pollObj} />
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
                            const pollObj = { id: `${cat.key}__${i}`, question: `${i + 1}. ${poll}`, options: optionsFor(poll) };
                            return (
                              <div key={pollObj.id} className="bg-blue-900/70 rounded-xl px-4 py-3 border border-blue-400/20">
                                <Poll poll={pollObj} />
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
