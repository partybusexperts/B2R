"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
// Link intentionally not used here; page is results-only
import PageLayout from "../../components/PageLayout";
import Section from "../../components/Section";
import { ORDERED_CATEGORIES_BY_GROUP } from "../../data/polls/taxonomy";

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

// Friendly category titles (override short tag names)
const NICE_TITLES: Record<string, string> = {
  airport: "Aviation Polls",
  "party-bus": "Party Bus Polls",
  "partybus": "Party Bus Polls",
  limo: "Limousine Polls",
  limousines: "Limousine Polls",
  fun: "Fun Polls",
  suv: "SUV Polls",
  "vehicle-choice": "Vehicle Choice Polls",
  events: "Event Polls",
  features: "Feature Polls",
  safety: "Safety Polls",
  style: "Style & Aesthetics Polls",
  uncategorized: "Other Polls",
};

function titleFor(cat?: string | null) {
  if (!cat) return "Polls";
  if (NICE_TITLES[cat]) return NICE_TITLES[cat];
  // Default: turn dashed/underscored names into Title Case + ' Polls'
  const words = cat.replace(/[-_]/g, " ").split(/\s+/).filter(Boolean);
  const title = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return title.endsWith("Polls") ? title : `${title} Polls`;
}

/** If a poll question was auto-generated ("Auto-fill poll for tag ..."), render a nicer label. */
function displayQuestion(poll: { question: string }, catTitle: string) {
  const m = poll.question.match(/^auto-?fill poll for tag\s+([\w-]+)/i);
  if (m) {
    // Use the category title root (without the trailing word 'Polls')
    const root = catTitle.replace(/\s*Polls$/i, "");
    return `Example poll — ${root}`;
  }
  return poll.question;
}

// CSV export utilities removed; Copy JSON provides the flattened rows if needed.

/* --------------------------------- Page --------------------------------- */
export default function PollResultsPage() {
  const [results, setResults] = useState<PollResults>({});
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");
  const [q, setQ] = useState("");
  const [sortBy] = useState<"registry" | "votes_desc" | "alpha">("registry");
  const [jumpSlug] = useState<string>("");
  const catRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // maxOptions no longer needed (we render stacked option rows)

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setErr("");
    // Poll list is cacheable at CDN/edge; request the lightweight polls payload
    // (the API now returns only { polls }) and then fetch results for the
    // visible subset to avoid transferring the whole votes map.
    fetch("/api/poll/all", { cache: "force-cache", signal: ac.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(async (data) => {
        if (!data || !Array.isArray(data.polls)) throw new Error('unexpected');
        setPolls(data.polls as Poll[]);
        // compute visible ids (first 6 per category) and fetch bulk results
        const groupedIds: string[] = [];
        const tmpMap = new Map<string, Poll[]>();
        for (const p of data.polls) {
          const tag = (p.tags && p.tags[0]) || 'uncategorized';
          if (!tmpMap.has(tag)) tmpMap.set(tag, []);
          tmpMap.get(tag)!.push(p);
        }
        for (const arr of tmpMap.values()) {
          const slice = arr.slice(0, 6).map(p => p.id);
          groupedIds.push(...slice);
        }
        if (groupedIds.length) {
          try {
            const r = await fetch('/api/poll/results/bulk', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: groupedIds }) });
            if (r.ok) {
              const j = await r.json();
              if (j && j.data) setResults((prev) => ({ ...prev, ...j.data }));
            }
          } catch {
            // swallow bulk errors — UI will show zeros
          }
        }
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

  // Build category chips & ordered entries similar to /polls page for stable ordering
  const entries = useMemo(() => {
    // map tag -> rows
  const itemsByKey: Record<string, Poll[]> = {};
  for (const g of grouped) itemsByKey[g.category] = (itemsByKey[g.category] || []).concat(g.rows.map((r) => r.poll as Poll));

  const out: { slug: string; raw: string; pretty: string; items: Poll[]; count: number }[] = [];
    for (const group of Object.keys(ORDERED_CATEGORIES_BY_GROUP)) {
      const cats = ORDERED_CATEGORIES_BY_GROUP[group] || [];
      for (const cat of cats) {
        const raw = cat.key;
        const items = itemsByKey[raw] || [];
        const slug = (raw || "misc").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "misc";
        out.push({ slug, raw, pretty: cat.label || (raw.replace(/[-_]/g, ' ').replace(/\b\w/g, (c:string)=>c.toUpperCase()) + ' Polls'), items, count: items.length });
      }
    }
    // include any remaining categories not covered by taxonomy
    for (const k of Object.keys(itemsByKey)) {
      if (!out.find((o) => o.raw === k)) {
        const slug = (k || "misc").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "misc";
        out.push({ slug, raw: k, pretty: k.replace(/[-_]/g, ' '), items: itemsByKey[k] || [], count: (itemsByKey[k] || []).length });
      }
    }
    return out;
  }, [grouped]);

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

  const toggleCategory = async (cat: string) => {
    setExpanded((s) => ({ ...s, [cat]: !s[cat] }));
    // If expanding, ensure we have results for this category's polls (first 24)
    if (!expanded[cat]) {
      const group = grouped.find((g) => g.category === cat);
      if (!group) return;
      const ids = group.rows.slice(0, 24).map(r => r.poll.id).filter(Boolean);
      const missing = ids.filter(id => !results[id]);
      if (missing.length) {
        try {
          const r = await fetch('/api/poll/results/bulk', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: missing }) });
          if (r.ok) {
            const j = await r.json();
            if (j && j.data) setResults(prev => ({ ...prev, ...j.data }));
          }
          } catch {
          // ignore failures — UI will show zeros
        }
      }
    }
  };
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
      {/* HERO / HEADER - polls-like */}
      <Section className="bg-[#122a56] pt-8 pb-10 relative">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(2,6,23,0.25),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-white font-serif tracking-tight">Community Poll Results</h1>
          <p className="text-blue-100/90 text-center max-w-3xl mx-auto mt-3 mb-6">Browse all-time poll totals. Use the search and category jump to find results quickly.</p>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="md:col-span-2">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search polls, options, or tags…" className="w-full rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-end gap-2">
              <button onClick={() => expandAll(true)} className="h-[52px] w-full rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold border border-blue-700 transition">Expand all</button>
              <button onClick={() => expandAll(false)} className="h-[52px] whitespace-nowrap rounded-2xl bg-[#173264] px-4 text-sm font-bold text-white border border-blue-800/40 hover:border-blue-500 transition">Collapse all</button>
            </div>
          </div>

          <div className="mt-4">
            <div className="no-scrollbar flex gap-2 overflow-x-auto py-2">
              {entries.map((c) => (
                <button key={c.slug} onClick={() => { const el = catRefs.current[c.slug]; if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="group flex items-center gap-2 rounded-full border border-blue-800/30 bg-[#173264] px-3 py-1.5 text-sm text-blue-100 hover:border-blue-500 transition" title={`${c.pretty}`}>
                  <span className="font-semibold text-white">{c.pretty}</span>
                  <span className="rounded-full bg-blue-600 text-white text-[11px] px-2 py-0.5 tabular-nums border border-blue-700">{c.count}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 text-blue-100/90 text-sm text-center"><span className="font-semibold text-white">{polls.length}</span> polls total {q ? <span className="ml-2">· Filtering by “{q}”.</span> : null}</div>
        </div>
      </Section>

      {/* Sticky jump/select bar */}
      <div className="sticky top-0 z-30 border-y border-blue-800/30 bg-[#122a56]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="w-full md:w-96">
            <select value={jumpSlug} onChange={(e) => { const val = e.target.value; if (val) setTimeout(() => { const el = catRefs.current[val]; if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 0); }} className="w-full rounded-xl border border-blue-800/30 bg-[#173264] px-4 py-2.5 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Jump to a category…</option>
              {entries.map((c) => (<option key={c.slug} value={c.slug}>{c.pretty} ({c.count})</option>))}
            </select>
          </div>

          <div className="flex-1" />
          <div className="flex flex-wrap gap-2">
            <button onClick={() => expandAll(true)} className="rounded-xl border border-blue-800/40 bg-[#173264] px-3 py-2 text-sm font-bold text-white hover:border-blue-500">Expand all</button>
            <button onClick={() => expandAll(false)} className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-bold text-white hover:bg-blue-700 border border-blue-700">Collapse all</button>
          </div>
        </div>
      </div>

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
                        <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">{titleFor(category)}</h3>
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
                            <div className="font-semibold text-blue-100 mb-2">{displayQuestion(poll, titleFor(category))}</div>
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
                    <h4 className="text-lg md:text-xl font-bold text-blue-100">{titleFor(modalCategory)}</h4>
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
