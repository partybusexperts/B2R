"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageLayout from "../../components/PageLayout";
import Section from "../../components/Section";

/* ------------------------------- Registry ------------------------------- */
/** Local list so we don't rely on a hidden/unknown registry. */
const POLL_QUESTIONS = [
  { id: "partybus_vs_limo", question: "Party Bus vs Limo — which would you pick?", options: ["Party Bus", "Limo"] },
  { id: "event_type", question: "What’s your event?", options: ["Prom", "Wedding", "Gameday", "Birthday", "Corporate"] },
  { id: "matters_most", question: "What matters most?", options: ["Price", "Space", "Lighting", "Sound", "Luggage"] },
  { id: "partybus_safer", question: "True or False: Party buses are safer than limos.", options: ["True", "False"] },
  { id: "rent_partybus_birthday", question: "Would you rent a party bus for a birthday?", options: ["Yes", "No"] },
  { id: "important_partybus_feature", question: "Which party bus feature is most important?", options: ["Sound System", "Lighting", "Bar", "TV Screens"] },
  { id: "rent_limo_birthday", question: "Would you rent a limousine for a birthday?", options: ["Yes", "No"] },
  { id: "favorite_limo_color", question: "What’s your favorite limo color?", options: ["Black", "White", "Pink", "Silver"] },
  { id: "limo_best_wedding", question: "True or False: Limousines are best for weddings.", options: ["True", "False"] },
  { id: "suv_vs_sedan_airport", question: "Do you prefer SUVs or sedans for airport transfers?", options: ["SUV", "Sedan"] },
  { id: "coachbus_feature", question: "Which feature matters most on a coach bus?", options: ["WiFi", "Reclining Seats", "Restroom", "Outlets"] },
  { id: "shuttle_concert", question: "Have you ever used a shuttle for a concert?", options: ["Yes", "No"] },
] as const;

type Poll = typeof POLL_QUESTIONS[number];
type PollResults = Record<string, Record<string, number>>;

/* -------------------------------- Utils --------------------------------- */
const fmt = (n: number) => n.toLocaleString();
const pct = (num: number, den: number) => (den > 0 ? Math.round((num / den) * 100) : 0);

/** Export CSV for CURRENT CATEGORY rows only */
function buildCSV(rows: { poll: Poll; counts: Record<string, number>; total: number }[]) {
  const lines: string[] = [
    ["poll_id", "question", "option", "votes", "percent", "total_votes"].join(","),
  ];
  for (const { poll, counts, total } of rows) {
    for (const opt of poll.options) {
      const v = counts[opt] ?? 0;
      const p = pct(v, total);
      lines.push(
        [JSON.stringify(poll.id), JSON.stringify(poll.question), JSON.stringify(opt), v, `${p}%`, total].join(",")
      );
    }
  }
  return lines.join("\n");
}
function download(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click();
  a.remove(); URL.revokeObjectURL(url);
}

/* ----------------------------- Categories ------------------------------- */
/** No external registry? No problem. We categorize heuristically + explicitly. */
type Category = { id: string; label: string; match: (p: Poll) => boolean };
const CATS: Category[] = [
  { id: "vehicle-choice", label: "Vehicle Choice", match: p =>
      /partybus_vs_limo/.test(p.id) || /SUV|Sedan/i.test(p.question) },
  { id: "events", label: "Events", match: p =>
      /event_type|wedding|prom|birthday|concert/i.test(p.id + " " + p.question) },
  { id: "features", label: "Features & Comfort", match: p =>
      /feature|matters_most|coachbus_feature/i.test(p.id) },
  { id: "safety", label: "Safety & Policy", match: p =>
      /safer|safety|policy/i.test(p.id + " " + p.question) },
  { id: "style", label: "Style & Aesthetics", match: p =>
      /favorite_limo_color/i.test(p.id) },
  { id: "airport", label: "Airport & Shuttle", match: p =>
      /airport|shuttle/i.test(p.id + " " + p.question) },
];

/* --------------------------------- Page --------------------------------- */
export default function PollResultsPage() {
  const [results, setResults] = useState<PollResults>({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");

  // show one category at a time (avoid endless scrolling)
  const [activeCat, setActiveCat] = useState<string>(CATS[0].id);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setErr("");
    fetch("/api/poll/all", { cache: "no-store", signal: ac.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => setResults(data || {}))
      .catch((e) => {
        if ((e as { name?: string }).name !== "AbortError") setErr("Failed to load poll results.");
      })
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, []);

  // Build category → rows map once we have results
  const catMap = useMemo(() => {
    const map: Record<string, { poll: Poll; counts: Record<string, number>; total: number }[]> = {};
    for (const cat of CATS) map[cat.id] = [];
    for (const poll of POLL_QUESTIONS) {
      const cat = CATS.find(c => c.match(poll)) || CATS[0];
      const counts = results[poll.id] || {};
      const total = Object.values(counts).reduce((a, b) => a + Number(b || 0), 0);
      map[cat.id].push({ poll, counts, total });
    }
    // keep registry order inside each category
    return map;
  }, [results]);

  const visibleRows = catMap[activeCat] || [];

  return (
    <PageLayout
      gradientFrom="from-blue-950"
      gradientVia="via-blue-900"
      gradientTo="to-black"
      textColor="text-white"
    >
      {/* HERO / HEADER */}
      <Section className="relative overflow-hidden text-center !pt-20 !pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,#2563eb_0%,#0b1934_55%,#030712_100%)]" />
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight font-serif bg-gradient-to-r from-blue-200 via-blue-300 to-blue-500 bg-clip-text text-transparent drop-shadow">
            Poll Results
          </h1>
          <p className="text-xl md:text-2xl text-blue-100/90 mt-6">
            Clean, category-first view of all-time totals.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none">
          <svg viewBox="0 0 1440 160" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,96 C240,160 480,32 720,80 C960,128 1200,64 1440,112 L1440,160 L0,160 Z" fill="#0c2344" />
          </svg>
        </div>
      </Section>

      {/* CATEGORY TABS + ACTIONS (no search/autofill) */}
      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl mt-6 mb-4 py-6 px-6 border border-blue-800/30 sticky top-0 z-20">
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="flex flex-wrap gap-2">
            {CATS.map((c) => {
              const isActive = c.id === activeCat;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCat(c.id)}
                  className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${
                    isActive
                      ? "bg-white text-blue-900 border-blue-200"
                      : "bg-[#12244e] text-blue-100 border-blue-800/30 hover:text-white"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
          <div className="flex gap-3">
            <Link
              href="/polls"
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-5 py-3 rounded-xl shadow text-base"
            >
              Do More Polls
            </Link>
            <button
              onClick={() =>
                download(`poll-${activeCat}-${new Date().toISOString().slice(0,10)}.csv`, buildCSV(visibleRows))
              }
              className="bg-white hover:bg-blue-50 text-blue-900 font-bold px-5 py-3 rounded-xl shadow text-base border border-blue-200"
            >
              Export CSV
            </button>
            <button
              onClick={() =>
                navigator.clipboard.writeText(JSON.stringify({ category: activeCat, rows: visibleRows }, null, 2))
              }
              className="bg-[#12244e] hover:text-white text-blue-100 font-bold px-5 py-3 rounded-xl shadow text-base border border-blue-800/30"
            >
              Copy JSON
            </button>
          </div>
        </div>
      </Section>

      {/* RESULTS (compact card grid; one category at a time) */}
      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl my-6 py-8 px-6 border border-blue-800/30">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse h-40 rounded-2xl bg-blue-950/60 border border-blue-800/30" />
            ))}
          </div>
        ) : err ? (
          <div className="bg-blue-950/80 rounded-2xl shadow p-8 text-center text-blue-200 font-semibold">
            {err}
          </div>
        ) : visibleRows.length === 0 ? (
          <div className="bg-blue-950/60 rounded-2xl shadow p-8 text-center text-blue-200">
            No polls matched this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleRows.map(({ poll, counts, total }) => (
              <div key={poll.id} className="bg-[#12244e] rounded-2xl shadow-xl border border-blue-800/30 p-6">
                <h3 className="text-base font-bold text-blue-50 mb-2">{poll.question}</h3>
                <div className="space-y-2">
                  {poll.options.map((opt) => {
                    const v = Number(counts[opt] || 0);
                    const p = pct(v, total);
                    return (
                      <div key={opt} className="bg-[#0f1f46] border border-blue-800/40 rounded-lg p-2.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-blue-100">{opt}</span>
                          <span className="text-blue-300">{p}% • {fmt(v)}</span>
                        </div>
                        <div className="mt-1 h-2 rounded bg-blue-900/40 overflow-hidden">
                          <div className="h-2 rounded bg-blue-500" style={{ width: `${p}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 text-xs text-blue-300">Total votes: {fmt(total)}</div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </PageLayout>
  );
}
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageLayout from "../../components/PageLayout";
import Section from "../../components/Section";

/* ------------------------------- Runtime Polls ------------------------------- */
type Poll = {
  id: string;
  question: string;
  options: string[];
  tags?: string[];
  active?: boolean;
};

type PollResults = Record<string, Record<string, number>>;

/* -------------------------------- Utils --------------------------------- */
const fmt = (n: number) => n.toLocaleString();
const percent = (num: number, den: number) => (den > 0 ? Math.round((num / den) * 100) : 0);

// CSV export utilities removed; Copy JSON provides the flattened rows if needed.

/* --------------------------------- Page --------------------------------- */
export default function PollResultsPage() {
  const [results, setResults] = useState<PollResults>({});
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState<"registry" | "votes_desc" | "alpha">("registry");

  // maxOptions no longer needed (we render stacked option rows)

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setErr("");
    fetch("/api/poll/all", { cache: "no-store", signal: ac.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        // API returns { polls, votes }
        if (data && data.polls) setPolls(data.polls as Poll[]);
        if (data && data.votes) setResults(data.votes as PollResults);
      })
      .catch((e: unknown) => {
        const name = (e as { name?: string })?.name;
        if (name !== "AbortError") setErr("Failed to load poll results.");
      })
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, []);

  /** Join fetched polls with counts, then filter/sort and group by category. */
  const grouped = useMemo(() => {
    // Build rows
    const joined = polls.map((poll) => {
      const counts = results[poll.id] || {};
      const total = Object.values(counts).reduce((a, b) => a + Number(b || 0), 0);
      return { poll, counts, total };
    });

    const ql = q.trim().toLowerCase();
    let visible = ql
      ? joined.filter(
          ({ poll }) =>
            poll.question.toLowerCase().includes(ql) || poll.options.some((o) => o.toLowerCase().includes(ql))
        )
      : joined;

    if (sortBy === "votes_desc") visible = [...visible].sort((a, b) => b.total - a.total);
    else if (sortBy === "alpha") visible = [...visible].sort((a, b) => a.poll.question.localeCompare(b.poll.question));

    // Group by primary tag (first tag) for categorical order
    const map = new Map<string, typeof visible>();
    for (const row of visible) {
      const tag = (row.poll.tags && row.poll.tags[0]) || "uncategorized";
      if (!map.has(tag)) map.set(tag, []);
      map.get(tag)!.push(row);
    }

    // Sort categories alphabetically, with 'uncategorized' last
    const cats = Array.from(map.keys()).sort((a, b) => {
      if (a === "uncategorized") return 1;
      if (b === "uncategorized") return -1;
      return a.localeCompare(b);
    });

    return cats.map((cat) => ({ category: cat, rows: map.get(cat)! }));
  }, [polls, results, q, sortBy]);

  // UI state: which categories are expanded
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Initialize expanded state when grouped changes: expand first 4 categories by default
  useEffect(() => {
    const init: Record<string, boolean> = {};
    grouped.forEach((g, i) => {
      init[g.category] = i < 4; // expand first 4 categories
    });
    setExpanded((prev) => ({ ...init, ...prev }));
  }, [grouped]);

  const toggleCategory = (cat: string) => setExpanded((s) => ({ ...s, [cat]: !s[cat] }));
  const expandAll = (val: boolean) => {
    const next: Record<string, boolean> = {};
    grouped.forEach((g) => (next[g.category] = val));
    setExpanded(next);
  };

  // Modal to view a single category without scrolling the whole page
  const [modalCategory, setModalCategory] = useState<string | null>(null);
  const [modalQ, setModalQ] = useState<string>("");
  const openModal = (cat: string) => {
    setModalCategory(cat);
    setModalQ("");
    // lock body scroll
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    setModalCategory(null);
    document.body.style.overflow = "";
  };

  // Close modal on ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <PageLayout
      gradientFrom="from-blue-950"
      gradientVia="via-blue-900"
      gradientTo="to-black"
      textColor="text-white"
    >
      {/* HERO / HEADER */}
      <Section className="relative overflow-hidden text-center !pt-20 !pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,#2563eb_0%,#0b1934_55%,#030712_100%)]" />
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight font-serif bg-gradient-to-r from-blue-200 via-blue-300 to-blue-500 bg-clip-text text-transparent drop-shadow">
            Limo Industry Poll Results
          </h1>
          <p className="text-xl md:text-2xl text-blue-100/90 mt-6">
            Explore all-time totals from our polls. Clean, simple, fast.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none">
          <svg viewBox="0 0 1440 160" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,96 C240,160 480,32 720,80 C960,128 1200,64 1440,112 L1440,160 L0,160 Z" fill="#0c2344" />
          </svg>
        </div>
      </Section>

      {/* CONTROLS */}
      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl mt-6 mb-4 py-6 px-6 border border-blue-800/30">
        <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search questions or options…"
              className="w-full md:w-[420px] rounded-full px-5 py-3 text-base bg-[#12244e] border border-blue-800/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search polls"
            />
            <select
              value={sortBy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as "registry" | "votes_desc" | "alpha")}
              className="rounded-full px-5 py-3 text-base bg-[#12244e] border border-blue-800/30 text-white"
              aria-label="Sort"
            >
              <option value="registry">Sort: Registry</option>
              <option value="votes_desc">Sort: Votes (High → Low)</option>
              <option value="alpha">Sort: A → Z</option>
            </select>
          </div>
          <div className="flex gap-3 items-center">
              <Link
                href="/polls"
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-5 py-3 rounded-xl shadow text-base"
              >
                Do More Polls
              </Link>
              <button
                onClick={() => {
                  const rowsFlat = grouped.flatMap(g => g.rows);
                  navigator.clipboard.writeText(JSON.stringify({ rows: rowsFlat }, null, 2));
                }}
                className="bg-[#12244e] hover:text-white text-blue-100 font-bold px-5 py-3 rounded-xl shadow text-base border border-blue-800/30"
              >
                Copy JSON
              </button>
              <div className="hidden md:flex items-center gap-2 ml-2">
                <button
                  onClick={() => expandAll(true)}
                  className="px-3 py-2 rounded-md bg-blue-800 text-blue-100 text-sm"
                >
                  Expand all
                </button>
                <button
                  onClick={() => expandAll(false)}
                  className="px-3 py-2 rounded-md bg-transparent border border-blue-800 text-blue-100 text-sm"
                >
                  Collapse all
                </button>
              </div>
            </div>
        </div>
      </Section>

      {/* RESULTS TABLE */}
      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-6 py-8 px-6 border border-blue-800/30 relative">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse h-12 rounded-lg bg-blue-950/60 border border-blue-800/30" />
            ))}
          </div>
        ) : err ? (
          <div className="bg-blue-950/80 rounded-2xl shadow p-8 text-center text-blue-200 font-semibold">
            {err}
          </div>
        ) : (
          <div className="relative">
            {/* Sticky TOC for quick jumps */}
            <aside className="hidden md:block absolute right-[-220px] top-12 w-56">
              <div className="bg-blue-950/70 p-3 rounded-lg border border-blue-800/30 shadow-md sticky top-24">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-blue-200">Categories</div>
                </div>
                <div className="text-sm space-y-1 max-h-[60vh] overflow-auto pr-1">
                  {grouped.map((g) => (
                    <div key={g.category} className="flex items-center justify-between">
                      <a href={`#${encodeURIComponent(g.category)}`} className="text-blue-100 hover:underline block truncate">
                        {g.category.replace(/[-_]/g, ' ')}
                      </a>
                      <button onClick={() => toggleCategory(g.category)} aria-label={`Toggle ${g.category}`} className="text-xs text-blue-300 ml-2">{expanded[g.category] ? '−' : '+'}</button>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <div>
              {grouped.length === 0 ? (
                <div className="p-8 text-center text-blue-200">No polls found.</div>
              ) : (
                grouped.map(({ category, rows }) => {
                  const isExpanded = !!expanded[category];
                  const limit = 6;
                  const visibleRows = isExpanded ? rows : rows.slice(0, limit);
                  return (
                    <div id={category} key={category} className="mb-8">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-blue-200 mb-3 capitalize">{category.replace(/[-_]/g, ' ')}</h3>
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-blue-300 mr-2">{rows.length} polls</div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => toggleCategory(category)} aria-expanded={isExpanded} className="text-sm px-3 py-1 bg-blue-800 text-blue-100 rounded">
                              {isExpanded ? 'Collapse' : `Show ${Math.max(0, rows.length - limit)} more`}
                            </button>
                            <button onClick={() => openModal(category)} className="text-sm px-3 py-1 bg-transparent border border-blue-800 text-blue-100 rounded">View all</button>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {visibleRows.map(({ poll, counts, total }) => (
                          <div key={poll.id} className="p-4 bg-blue-950/60 rounded-lg border border-blue-800/30 shadow-sm">
                            <div className="font-semibold text-blue-100 mb-2">{poll.question}</div>
                            <div className="space-y-2">
                              {poll.options.map((opt) => {
                                const c = Number(counts[opt] || 0);
                                const p = percent(c, total);
                                return (
                                  <div key={opt} className="flex items-center gap-3">
                                    <div className="flex-1">
                                      <div className="flex justify-between text-sm text-blue-200">
                                        <div className="font-medium">{opt}</div>
                                        <div className="font-mono text-blue-100">{fmt(c)}{total>0?` (${p}%)`:''}</div>
                                      </div>
                                      <div className="mt-1 h-2 rounded bg-blue-900/40">
                                        <div className="h-2 rounded bg-blue-500" style={{ width: `${p}%` }} />
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="mt-3 text-sm text-blue-300">Total votes: <span className="font-bold text-blue-100">{fmt(total)}</span></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal for full category view */}
            {modalCategory && (
              <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
                <div className="absolute inset-0 bg-black/60" onClick={closeModal} />
                <div className="relative bg-blue-900/80 rounded-lg max-w-4xl w-full mx-auto p-6 overflow-auto max-h-[80vh] border border-blue-800/40">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-blue-100">{modalCategory.replace(/[-_]/g, ' ')}</h4>
                    <div className="flex items-center gap-2">
                      <input
                        value={modalQ}
                        onChange={(e) => setModalQ(e.target.value)}
                        placeholder="Filter category polls…"
                        className="rounded px-3 py-2 bg-[#0c1a33] text-blue-100 border border-blue-800/30"
                      />
                      <button onClick={closeModal} className="px-3 py-2 bg-blue-800 rounded text-blue-100">Close</button>
                    </div>
                  </div>
                  {(() => {
                    const group = grouped.find((g) => g.category === modalCategory);
                    const rows = group
                      ? group.rows.filter(({ poll }) => {
                          const ql = modalQ.trim().toLowerCase();
                          return (
                            !ql || poll.question.toLowerCase().includes(ql) || poll.options.some((o) => o.toLowerCase().includes(ql))
                          );
                        })
                      : [];
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {rows.map(({ poll, counts, total }) => (
                          <div key={poll.id} className="p-4 bg-blue-950/60 rounded-lg border border-blue-800/30 shadow-sm">
                            <div className="font-semibold text-blue-100 mb-2">{poll.question}</div>
                            <div className="space-y-2">
                              {poll.options.map((opt) => {
                                const c = Number(counts[opt] || 0);
                                const p = percent(c, total);
                                return (
                                  <div key={opt} className="flex items-center gap-3">
                                    <div className="flex-1">
                                      <div className="flex justify-between text-sm text-blue-200">
                                        <div className="font-medium">{opt}</div>
                                        <div className="font-mono text-blue-100">{fmt(c)}{total>0?` (${p}%)`:''}</div>
                                      </div>
                                      <div className="mt-1 h-2 rounded bg-blue-900/40">
                                        <div className="h-2 rounded bg-blue-500" style={{ width: `${p}%` }} />
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="mt-3 text-sm text-blue-300">Total votes: <span className="font-bold text-blue-100">{fmt(total)}</span></div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        )}
      </Section>
    </PageLayout>
  );
}
