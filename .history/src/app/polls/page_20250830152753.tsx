"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/* ===== Types (robust to varied registry shapes) ===== */
type Poll = {
  id?: string | number;
  question?: string;
  title?: string;
  prompt?: string;
  category?: string;
  tags?: string[];
  options?: string[];
  // Optional pre-existing tallies if you have them
  votes?: Record<string, number>;
};

/* ===== Helpers ===== */
function getQuestion(p: Poll): string {
  return (
    (typeof p.question === "string" && p.question) ||
    (typeof p.title === "string" && p.title) ||
    (typeof p.prompt === "string" && p.prompt) ||
    "Untitled Poll"
  );
}
function getCategoryRaw(p: Poll): string {
  if (p.category && p.category.trim()) return p.category;
  if (p.tags && p.tags.length) return String(p.tags[0]);
  return "Misc";
}
function slugify(s: string) {
  return (
    (s || "misc")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "misc"
  );
}
const COOL_NAMES: Record<string, string> = {
  birthday: "Birthday Bangers",
  wedding: "Wedding Vibes",
  bachelorette: "Bachelorette Bash",
  bachelor: "Bachelor Bash",
  prom: "Prom Night Pulse",
  sports: "Game Day Hype",
  work: "Office Vibe Check",
  corporate: "Corporate Crowd-Pleasers",
  kids: "Kiddo Chaos",
  school: "Campus Crowd",
  holiday: "Holiday Hype",
  nightlife: "Night-Out Picks",
  road: "Road-Trip Raves",
  travel: "Travel Tunes",
  party: "Party Starters",
  classic: "Timeless Classics",
  edm: "Bass-Drop Central",
  country: "Country Cookout",
  hiphop: "Hip-Hop Heat",
  latin: "Latin Fiesta",
  chill: "Chill & Vibey",
  misc: "Wildcard Wonders",
};
function prettifyCategory(raw: string): string {
  const key = (raw || "").toLowerCase();
  for (const k of Object.keys(COOL_NAMES)) {
    if (key.includes(k)) return COOL_NAMES[k];
  }
  const title = (raw || "Misc")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return `${title} Polls`;
}
function formatNumber(n: number) {
  return Intl.NumberFormat().format(n);
}
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}

/* ===== Mini Toast (top-right) ===== */
function useToasts() {
  const [toasts, setToasts] = useState<Array<{ id: number; text: string }>>([]);
  const add = (text: string, ms = 1600) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ms);
  };
  const node = (
    <div className="pointer-events-none fixed right-4 top-4 z-[9999] space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto rounded-xl bg-slate-900 text-white text-sm px-4 py-2 shadow-lg/50 shadow-slate-900/40"
        >
          {t.text}
        </div>
      ))}
    </div>
  );
  return { add, node };
}

/* ===== Result Bars ===== */
function ResultBar({ label, pct, count }: { label: string; pct: number; count: number }) {
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
        <span className="truncate">{label}</span>
        <span className="tabular-nums">{Math.round(pct)}% · {formatNumber(count)}</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-slate-900 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ===== Poll Card (vote + results + share) ===== */
function PollCard({ poll, onGlobalShare }: { poll: Poll; onGlobalShare: (embed: string) => void }) {
  const initialOpts = Array.isArray(poll.options) && poll.options.length > 0 ? poll.options : ["Yes", "No"];
  const [answer, setAnswer] = useState<string>("");
  const [showResults, setShowResults] = useState(false);
  // Local tallies (seed with poll.votes if provided, else zero)
  const [tallies, setTallies] = useState<Record<string, number>>(() => {
    const seed: Record<string, number> = {};
    for (const o of initialOpts) seed[o] = Math.max(0, poll.votes?.[o] ?? 0);
    return seed;
  });

  const totalVotes = Object.values(tallies).reduce((a, b) => a + b, 0);
  const embedCode = (() => {
    const id = encodeURIComponent(String(poll.id ?? slugify(getQuestion(poll))));
    // Simple embed suggestion (adjust to your actual embed route if different)
    return `<iframe src="${typeof window !== "undefined" ? window.location.origin : ""}/embed/poll/${id}" width="100%" height="420" style="border:0;border-radius:12px;overflow:hidden" loading="lazy" referrerpolicy="no-referrer"></iframe>`;
  })();

  const handleVote = (opt: string) => {
    setAnswer(opt);
    // increment and reveal results
    setTallies((t) => ({ ...t, [opt]: (t[opt] ?? 0) + 1 }));
    setShowResults(true);
  };

  const handleShare = async () => {
    const ok = await copyToClipboard(embedCode);
    if (ok) onGlobalShare("Copied poll embed code!");
  };

  const opts = initialOpts;
  const pctFor = (opt: string) =>
    totalVotes > 0 ? (100 * (tallies[opt] ?? 0)) / totalVotes : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm hover:shadow transition">
      <div className="text-[15px] font-semibold text-slate-900 leading-snug mb-3">
        {getQuestion(poll)}
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-2 mb-3">
        {opts.map((opt, i) => {
          const id = String(poll.id ?? getQuestion(poll)) + "-" + i;
          const selected = answer === opt;
          return (
            <button
              key={id}
              onClick={() => handleVote(opt)}
              className={`rounded-full px-3 py-1.5 text-sm border transition ${
                selected
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-900 border-slate-300 hover:border-slate-500"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => setShowResults((v) => !v)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-800 hover:border-slate-500"
        >
          {showResults ? "Hide Results" : "View Results"}
        </button>
        <button
          onClick={handleShare}
          className="rounded-lg bg-slate-900 text-white px-3 py-1.5 text-xs font-semibold hover:opacity-90"
        >
          Share This Poll On Your Website
        </button>
        <span className="ml-auto text-[11px] text-slate-500 tabular-nums">
          {formatNumber(totalVotes)} vote{totalVotes === 1 ? "" : "s"}
        </span>
      </div>

      {/* Results */}
      {showResults && (
        <div className="mt-2">
          {opts.map((o) => (
            <ResultBar key={o} label={o} pct={pctFor(o)} count={tallies[o] ?? 0} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ===== Category Reminder Card ===== */
function ResultsReminder({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 ${
        compact ? "p-4" : "p-6"
      } shadow-sm`}
    >
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-xl bg-slate-900 text-white grid place-items-center text-sm font-bold">
          %
        </div>
        <div className="text-sm text-slate-700">
          Curious how people are voting? Use{" "}
          <span className="font-semibold text-slate-900">“Show Results”</span> at the top,
          or the <span className="font-semibold text-slate-900">“View Results”</span> button
          on any poll. You can also{" "}
          <span className="font-semibold text-slate-900">share these polls on your site</span>—just click
          <span className="font-semibold"> Share This Poll On Your Website</span>.
        </div>
      </div>
    </div>
  );
}

/* ===== Main Component ===== */
export default function ClientPolls() {
  const [q, setQ] = useState("");
  const [jumpSlug, setJumpSlug] = useState<string>("");
  const [showGlobalResults, setShowGlobalResults] = useState(false);
  const { add, node: Toasts } = useToasts();

  // Start with any passed polls or window global; if none, we'll fetch /polls.json client-side
  const [pollsData, setPollsData] = useState<Poll[] | null>(() => {
    if (typeof window !== "undefined") {
      const w = (window as unknown as { __POLLS__?: Poll[] }).__POLLS__;
      return w ?? null;
    }
    return null;
  });

  useEffect(() => {
    // If no data yet, fetch from public/polls.json
    if (!pollsData) {
      fetch('/polls.json')
        .then((r) => r.ok ? r.json() : [])
        .then((j) => {
          if (Array.isArray(j)) setPollsData(j as Poll[]);
        })
        .catch(() => setPollsData([]));
    }
  }, [pollsData]);

  const data = useMemo(() => {
    const byCat: Record<string, { raw: string; items: Poll[] }> = {};
    for (const p of pollsData || []) {
      const raw = getCategoryRaw(p);
      const slug = slugify(raw);
      if (!byCat[slug]) byCat[slug] = { raw, items: [] };
      byCat[slug].items.push(p);
    }
    const entries = Object.entries(byCat).map(([slug, { raw, items }]) => ({
      slug,
      raw,
      pretty: prettifyCategory(raw),
      items,
      count: items.length,
    }));
    entries.sort((a, b) => b.count - a.count || a.pretty.localeCompare(b.pretty));
    const total = pollsData?.length || 0;
    return { entries, total };
  }, [pollsData]);

  // Refs for jump-to-category scroll
  const catRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const handleJump = (slug: string) => {
    setJumpSlug(slug);
    const el = catRefs.current[slug];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Filter fn for search
  const matches = (p: Poll) => {
    if (!q.trim()) return true;
    const hay = [
      getQuestion(p),
      getCategoryRaw(p),
      ...(Array.isArray(p.options) ? p.options : []),
      ...(Array.isArray(p.tags) ? p.tags : []),
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q.toLowerCase());
  };

  // Category chips (visible & scrollable)
  const categoryChips = (
    <div className="no-scrollbar flex gap-2 overflow-x-auto py-2">
      {data.entries.map((c) => (
        <button
          key={c.slug}
          onClick={() => handleJump(c.slug)}
          className="group flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 hover:border-slate-500 transition"
          title={`${c.pretty}`}
        >
          <span className="font-medium">{c.pretty}</span>
          <span className="rounded-full bg-slate-900 text-white text-[11px] px-2 py-0.5 tabular-nums">
            {c.count}
          </span>
        </button>
      ))}
    </div>
  );

  // Back to top button
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {Toasts}

      {/* Hero Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(2,6,23,0.10),transparent)]" />
        <div className="mx-auto max-w-7xl px-4 pt-10 pb-8">
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent">
              Community Polls Hub
            </h1>
            <p className="mt-2 text-slate-700 max-w-2xl">
              Vote fast. See results instantly. Embed any poll on your site in one click.
            </p>
          </div>

          {/* Search + quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">Search Polls</label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Type to filter by question, options, tags…"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white/90"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={() => setShowGlobalResults(true)}
                className="h-[44px] w-full rounded-xl bg-slate-900 text-white text-sm font-semibold hover:opacity-90"
              >
                Show Results (Global)
              </button>
              <button
                onClick={async () => {
                  const ok = await copyToClipboard(
                    "<!-- Pro tip: paste this where you want your poll to appear -->\n<!-- Replace POLL_ID with a real id from your registry -->\n<iframe src=\"https://yourdomain.com/embed/poll/POLL_ID\" width=\"100%\" height=\"420\" style=\"border:0;border-radius:12px;overflow:hidden\" loading=\"lazy\" referrerpolicy=\"no-referrer\"></iframe>"
                  );
                  if (ok) add("Copied sample embed!");
                }}
                className="h-[44px] whitespace-nowrap rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 hover:border-slate-500"
              >
                How To Embed
              </button>
            </div>
          </div>

          {/* Visible category chips */}
          <div className="mt-4">{categoryChips}</div>

          {/* Summary */}
          <div className="mt-3 text-slate-600 text-sm">
            <span className="font-semibold text-slate-900">{data.total}</span> polls total
            {q ? <span className="ml-2">· Filtering by “{q}”.</span> : null}
          </div>
        </div>
      </header>

      {/* Sticky Utility Bar */}
      <div className="sticky top-0 z-30 border-y border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center">
          {/* Category select (accessible alternative to chips) */}
          <div className="w-full md:w-96">
            <label className="block text-xs font-medium text-slate-600 mb-1">Jump To Category</label>
            <select
              value={jumpSlug}
              onChange={(e) => {
                const val = e.target.value;
                if (val) setTimeout(() => handleJump(val), 0);
              }}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <option value="">Choose…</option>
              {data.entries.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.pretty} ({c.count})
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1" />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowGlobalResults(true)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:border-slate-500"
            >
              Show Results
            </button>
            <button
              onClick={async () => {
                const ok = await copyToClipboard(
                  "<!-- Embed any poll in seconds -->\n<iframe src=\"https://yourdomain.com/embed/poll/POLL_ID\" width=\"100%\" height=\"420\" style=\"border:0;border-radius:12px;overflow:hidden\" loading=\"lazy\" referrerpolicy=\"no-referrer\"></iframe>"
                );
                if (ok) add("Copied embed instructions!");
              }}
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Share Polls On Your Site
            </button>
          </div>
        </div>
      </div>

      {/* Gentle reminder near top */}
      <div className="mx-auto max-w-7xl px-4 pt-4 pb-2">
        <ResultsReminder compact />
      </div>

      {/* Grid of scrollable category boxes */}
      <div className="mx-auto max-w-7xl px-4 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.entries.map((cat) => {
          const filtered = cat.items.filter(matches);
          const showing = filtered.length;
          const headerNote =
            q && showing !== cat.count
              ? `${cat.count} total · ${showing} match`
              : `${cat.count} total`;

          return (
            <div
              key={cat.slug}
              ref={(el) => {
                catRefs.current[cat.slug] = el;
              }}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
                <div>
                  <div className="text-base font-extrabold text-slate-900">{cat.pretty}</div>
                  <div className="text-xs text-slate-600">{headerNote}</div>
                </div>
                <div className="rounded-full bg-slate-900 text-white text-[11px] px-2 py-0.5 tabular-nums">
                  {cat.count}
                </div>
              </div>

              {/* Scrollable area */}
              <div className="max-h-[28rem] overflow-y-auto p-4 space-y-3">
                {filtered.length === 0 ? (
                  <div className="text-sm text-slate-500">
                    No polls match your search in this category.
                  </div>
                ) : (
                  filtered.map((p, i) => (
                    <PollCard
                      key={(p.id ?? `${cat.slug}-${i}`) as React.Key}
                      poll={p}
                      onGlobalShare={(msg) => add(msg)}
                    />
                  ))
                )}

                {/* In-stream reminder every few rows */}
                <div className="mt-3">
                  <ResultsReminder compact />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Back to Top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 rounded-full bg-slate-900 text-white shadow-lg px-4 py-2 text-sm font-semibold hover:opacity-90"
        >
          ↑ Back to Top
        </button>
      )}

      {/* Global Results Drawer (simple modal) */}
      {showGlobalResults && (
        <div className="fixed inset-0 z-[10000]">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setShowGlobalResults(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-extrabold text-slate-900">Live Results</h2>
              <button
                onClick={() => setShowGlobalResults(false)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:border-slate-500"
              >
                Close
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Quick peek at popular polls. (Tie this to your real results API when ready.)
            </p>

            {/* Showcase a few top polls by size (client-side-only heuristic) */}
            <div className="space-y-4">
              {data.entries
                .flatMap((c) => c.items.slice(0, 3)) // top 3 per category (tweak as desired)
                .slice(0, 12) // cap
                .map((p, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 p-4">
                    <div className="text-sm font-semibold text-slate-900 mb-2">
                      {getQuestion(p)}
                    </div>
                    <div className="text-xs text-slate-600 mb-3">
                      {prettifyCategory(getCategoryRaw(p))}
                    </div>
                    {/* Placeholder bars (no backend here) */}
                    {(p.options && p.options.length ? p.options : ["Yes", "No"]).map((o, j) => (
                      <ResultBar key={j} label={o} pct={50 - (j * 7) % 20 + 30} count={1000 - j * 123} />
                    ))}
                  </div>
                ))}
            </div>

            <div className="mt-6">
              <ResultsReminder />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== Utilities: hide scrollbars on chips row (optional) =====
Add this to your globals if you want the horizontal chips to hide scrollbars:

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

*/



