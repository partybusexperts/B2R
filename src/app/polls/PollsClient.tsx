"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { normalizeToCategoryKeys, ORDERED_CATEGORIES_BY_GROUP } from "../../data/polls/taxonomy";

/* ===== Types ===== */
type Poll = {
  id?: string | number;
  question?: string;
  title?: string;
  prompt?: string;
  category?: string;
  tags?: string[];
  options?: string[];
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
  for (const k of Object.keys(COOL_NAMES)) if (key.includes(k)) return COOL_NAMES[k];
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

/* ===== Toasts (blue) ===== */
function useToasts() {
  const [toasts, setToasts] = useState<Array<{ id: number; text: string }>>([]);
  const counterRef = React.useRef(1);
  const add = (text: string, ms = 1600) => {
    const id = counterRef.current++;
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ms);
  };
  const node = (
    <div className="pointer-events-none fixed right-4 top-4 z-[9999] space-y-2">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto rounded-xl bg-blue-600 text-white text-sm px-4 py-2 shadow-xl border border-blue-700">
          {t.text}
        </div>
      ))}
    </div>
  );
  return { add, node };
}

/* ===== Result Bars (blue) ===== */
function ResultBar({ label, pct, count }: { label: string; pct: number; count: number }) {
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between text-xs text-blue-100/90 mb-1">
        <span className="truncate">{label}</span>
        <span className="tabular-nums">{Math.round(pct)}% · {formatNumber(count)}</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-blue-900/40 overflow-hidden">
        <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ===== Poll Card (themed) ===== */
function PollCard({ poll, onGlobalShare }: { poll: Poll; onGlobalShare: (s: string) => void }) {
  const initialOpts = Array.isArray(poll.options) && poll.options.length ? poll.options : ["Yes", "No"];
  const [answer, setAnswer] = useState<string>("");
  const [showResults, setShowResults] = useState(false);
  const [tallies, setTallies] = useState<Record<string, number>>(() => {
    const seed: Record<string, number> = {};
    for (const o of initialOpts) seed[o] = Math.max(0, poll.votes?.[o] ?? 0);
    return seed;
  });

  const totalVotes = Object.values(tallies).reduce((a, b) => a + b, 0);
  const pctFor = (opt: string) => (totalVotes > 0 ? (100 * (tallies[opt] ?? 0)) / totalVotes : 0);

  const embedCode = (() => {
    const id = encodeURIComponent(String(poll.id ?? slugify(getQuestion(poll))));
    return `<iframe src="${typeof window !== "undefined" ? window.location.origin : ""}/embed/poll/${id}" width="100%" height="420" style="border:0;border-radius:12px;overflow:hidden" loading="lazy" referrerpolicy="no-referrer"></iframe>`;
  })();

  const handleVote = (opt: string) => {
    setAnswer(opt);
    // Optimistically update UI
    setTallies((t) => ({ ...t, [opt]: (t[opt] ?? 0) + 1 }));
    setShowResults(true);

    // Persist vote to server; fall back to optimistic-only on error
    (async () => {
      try {
        const body = { poll_id: String(poll.id ?? slugify(getQuestion(poll))), option: opt };
        const res = await fetch('/api/poll/vote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!res.ok) return; // keep optimistic UI
        const j = await res.json();
        if (j && j.results) {
          // Replace tallies with authoritative counts from server
          setTallies((t) => {
            const merged: Record<string, number> = {};
            const keys = new Set<string>([...Object.keys(t), ...Object.keys(j.results || {})]);
            keys.forEach((k) => { merged[k] = Math.max(0, Number((j.results || {})[k] ?? t[k] ?? 0)); });
            return merged;
          });
        }
  } catch {
        // noop - keep optimistic update
      }
    })();
  };
  const handleShare = async () => {
    const ok = await copyToClipboard(embedCode);
    if (ok) onGlobalShare("Copied embed!");
  };

  return (
    <div className="rounded-3xl border border-blue-800/30 bg-[#173264] shadow-lg p-4 hover:shadow-2xl transition">
      <div className="text-[15px] font-semibold text-white leading-snug mb-3">{getQuestion(poll)}</div>

      <div className="flex flex-wrap gap-2 mb-3">
        {initialOpts.map((opt, i) => {
          const id = String(poll.id ?? getQuestion(poll)) + "-" + i;
          const selected = answer === opt;
          return (
            <button
              key={id}
              onClick={() => handleVote(opt)}
              className={`rounded-full px-3 py-1.5 text-sm border transition ${
                selected ? "bg-blue-600 text-white border-blue-700" : "bg-[#12244e] text-blue-100 border-blue-800/40 hover:border-blue-500"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <button onClick={() => setShowResults((v) => !v)} className="rounded-xl border border-blue-800/40 bg-[#12244e] px-3 py-1.5 text-xs font-medium text-blue-100 hover:border-blue-500">
          {showResults ? "Hide Results" : "View Results"}
        </button>
        <button onClick={handleShare} className="rounded-xl bg-blue-600 text-white px-3 py-1.5 text-xs font-semibold hover:bg-blue-700 border border-blue-700">
          Share This Poll On Your Website
        </button>
        <span className="ml-auto text-[11px] text-blue-200 tabular-nums">{formatNumber(totalVotes)} vote{totalVotes === 1 ? "" : "s"}</span>
      </div>

      {showResults && (
        <div className="mt-2">
          {initialOpts.map((o) => (
            <ResultBar key={o} label={o} pct={pctFor(o)} count={tallies[o] ?? 0} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ===== Reminder (themed) ===== */
function ResultsReminder({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`rounded-3xl border border-blue-800/30 bg-[#12244e] ${compact ? "p-4" : "p-6"} shadow-lg`}>
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-xl bg-blue-600 text-white grid place-items-center text-sm font-bold">%</div>
        <div className="text-sm text-blue-100/90">Curious how people are voting? Use <span className="font-semibold text-white">Show Results</span> at the top, or the <span className="font-semibold text-white">View Results</span> button on any poll. You can also <span className="font-semibold text-white">share these polls on your site</span>.</div>
      </div>
    </div>
  );
}

/* ===== Main (blue/black themed) ===== */
export default function PollsClient() {
  const [q, setQ] = useState("");
  const [jumpSlug, setJumpSlug] = useState<string>("");
  const [showGlobalResults, setShowGlobalResults] = useState(false);
  const { add, node: Toasts } = useToasts();

  const [pollsData, setPollsData] = useState<Poll[] | null>(() => {
    if (typeof window !== "undefined") {
      const w = (window as unknown as { __POLLS__?: Poll[] }).__POLLS__;
      return w ?? null;
    }
    return null;
  });

  useEffect(() => {
    if (!pollsData) {
      fetch('/polls.json')
        .then((r) => (r.ok ? r.json() : []))
        .then((j) => { if (Array.isArray(j)) setPollsData(j as Poll[]); })
        .catch(() => setPollsData([]));
    }
  }, [pollsData]);

  const data = useMemo(() => {
    const total = pollsData?.length || 0;
    const itemsByKey: Record<string, Poll[]> = {};
    const unmatched: Poll[] = [];

    for (const p of pollsData || []) {
      const keys = normalizeToCategoryKeys({ category: p.category, tags: p.tags, title: p.title, question: p.question, prompt: p.prompt });
      if (Array.isArray(keys) && keys.length) {
        let matched = false;
        for (const k of keys) {
          if (!itemsByKey[k]) itemsByKey[k] = [];
          itemsByKey[k].push(p);
          matched = true;
        }
        if (!matched) unmatched.push(p);
      } else {
        unmatched.push(p);
      }
    }

    // Build ordered entries from taxonomy groups so the UI order is stable and logical
    const entries: { slug: string; raw: string; pretty: string; items: Poll[]; count: number }[] = [];
    for (const group of Object.keys(ORDERED_CATEGORIES_BY_GROUP)) {
      const cats = ORDERED_CATEGORIES_BY_GROUP[group] || [];
      for (const cat of cats) {
        const raw = cat.key;
        const items = itemsByKey[raw] || [];
        const slug = slugify(raw);
        entries.push({ slug, raw, pretty: cat.label || prettifyCategory(raw), items, count: items.length });
      }
    }

    // finally include any matched keys that weren't in the taxonomy as 'Other' bucket
    const otherKey = "other:misc";
    const usedKeys = new Set(entries.map((e) => e.raw));
    const leftoverItems: Poll[] = [];
    for (const k of Object.keys(itemsByKey)) {
      if (!usedKeys.has(k) && k !== otherKey) {
        leftoverItems.push(...(itemsByKey[k] || []));
      }
    }
    const otherItems = (itemsByKey[otherKey] || []).concat(unmatched).concat(leftoverItems);
    entries.push({ slug: slugify(otherKey), raw: otherKey, pretty: "Other / Misc", items: otherItems, count: otherItems.length });

    return { entries, total };
  }, [pollsData]);

  const catRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const handleJump = (slug: string) => { setJumpSlug(slug); const el = catRefs.current[slug]; if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  const matches = (p: Poll) => {
    if (!q.trim()) return true;
    const hay = [getQuestion(p), getCategoryRaw(p), ...(Array.isArray(p.options) ? p.options : []), ...(Array.isArray(p.tags) ? p.tags : [])].join(' ').toLowerCase();
    return hay.includes(q.toLowerCase());
  };

  const categoryChips = (
    <div className="no-scrollbar flex gap-2 overflow-x-auto py-2">
      {data.entries.map((c) => (
        <button key={c.slug} onClick={() => handleJump(c.slug)} className="group flex items-center gap-2 rounded-full border border-blue-800/30 bg-[#173264] px-3 py-1.5 text-sm text-blue-100 hover:border-blue-500 transition" title={`${c.pretty}`}>
          <span className="font-semibold text-white">{c.pretty}</span>
          <span className="rounded-full bg-blue-600 text-white text-[11px] px-2 py-0.5 tabular-nums border border-blue-700">{c.count}</span>
        </button>
      ))}
    </div>
  );

  const [showTop, setShowTop] = useState(false);
  useEffect(() => { const onScroll = () => setShowTop(window.scrollY > 600); onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll); }, []);

  return (
    <div className="text-slate-100 bg-[#0f1f46]">
      {Toasts}

      {/* Search + chips area (reinserted so polls search remains available) */}
      <section className="bg-[#122a56] pt-6 pb-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(2,6,23,0.18),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="md:col-span-2">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search polls, options, or tags…" className="w-full rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-end gap-2">
              <button onClick={() => setShowGlobalResults(true)} className="h-[52px] w-full rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold border border-blue-700 transition">Show Results (Global)</button>
              <button onClick={async () => { const ok = await copyToClipboard("<!-- Paste where you want a poll to appear; replace POLL_ID -->\n<iframe src=\"https://yourdomain.com/embed/poll/POLL_ID\" width=\"100%\" height=\"420\" style=\"border:0;border-radius:12px;overflow:hidden\" loading=\"lazy\" referrerpolicy=\"no-referrer\"></iframe>"); if (ok) add('Copied sample embed!'); }} className="h-[52px] whitespace-nowrap rounded-2xl bg-[#173264] px-4 text-sm font-bold text-white border border-blue-800/40 hover:border-blue-500 transition">How To Embed</button>
            </div>
          </div>

          <div className="mt-4">{categoryChips}</div>
          <div className="mt-3 text-blue-100/90 text-sm text-center"><span className="font-semibold text-white">{data.total}</span> polls total {q ? <span className="ml-2">· Filtering by “{q}”.</span> : null}</div>
        </div>
      </section>

      {/* Sticky bar */}
      <div className="sticky top-0 z-30 border-y border-blue-800/30 bg-[#122a56]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="w-full md:w-96">
            <select value={jumpSlug} onChange={(e) => { const val = e.target.value; if (val) setTimeout(() => handleJump(val), 0); }} className="w-full rounded-xl border border-blue-800/30 bg-[#173264] px-4 py-2.5 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Jump to a category…</option>
              {data.entries.map((c) => (<option key={c.slug} value={c.slug}>{c.pretty} ({c.count})</option>))}
            </select>
          </div>

          <div className="flex-1" />
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setShowGlobalResults(true)} className="rounded-xl border border-blue-800/40 bg-[#173264] px-3 py-2 text-sm font-bold text-white hover:border-blue-500">Show Results</button>
            <button onClick={async () => { const ok = await copyToClipboard("<!-- Embed any poll in seconds; replace POLL_ID -->\n<iframe src=\"https://yourdomain.com/embed/poll/POLL_ID\" width=\"100%\" height=\"420\" style=\"border:0;border-radius:12px;overflow:hidden\" loading=\"lazy\" referrerpolicy=\"no-referrer\"></iframe>"); if (ok) add('Copied!'); }} className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-bold text-white hover:bg-blue-700 border border-blue-700">Share Polls On Your Site</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4 pb-2"><ResultsReminder compact /></div>

      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.entries.map((cat) => {
            const filtered = cat.items.filter(matches);
            const showing = filtered.length;
            const headerNote = q && showing !== cat.count ? `${cat.count} total · ${showing} match` : `${cat.count} total`;
            return (
              <div key={cat.slug} ref={(el) => { catRefs.current[cat.slug] = el; }} className="rounded-3xl overflow-hidden border border-blue-800/30 shadow-xl bg-[#173264] flex flex-col">
                <div className="px-4 py-3 border-b border-blue-800/30 bg-[#122a56] flex items-center justify-between">
                  <div>
                    <div className="text-base font-extrabold text-white">{cat.pretty}</div>
                    <div className="text-xs text-blue-100/90">{headerNote}</div>
                  </div>
                  <div className="rounded-full bg-blue-600 text-white text-[11px] px-2 py-0.5 tabular-nums border border-blue-700">{cat.count}</div>
                </div>

                <div className="max-h-[28rem] overflow-y-auto p-4 space-y-3">
                  {filtered.length === 0 ? (<div className="text-sm text-blue-100/90">No polls match your search in this category.</div>) : (filtered.map((p, i) => (<PollCard key={(p.id ?? `${cat.slug}-${i}`) as React.Key} poll={p} onGlobalShare={(msg) => add(msg)} />)))}
                  <div className="mt-3"><ResultsReminder compact /></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {showTop && (<button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 z-40 rounded-full bg-blue-600 text-white shadow-xl px-4 py-2 text-sm font-bold border border-blue-700 hover:bg-blue-700">↑ Back to Top</button>)}

      {showGlobalResults && (
        <div className="fixed inset-0 z-[10000]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowGlobalResults(false)} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-[#122a56] border-l border-blue-800/30 shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-extrabold text-white">Live Results</h2>
              <button onClick={() => setShowGlobalResults(false)} className="rounded-xl border border-blue-800/40 bg-[#173264] px-3 py-1.5 text-sm text-white hover:border-blue-500">Close</button>
            </div>
            <p className="text-sm text-blue-100/90 mb-4">Quick peek at popular polls. (Wire to your real results API when ready.)</p>

            <div className="space-y-4">
              {data.entries.flatMap((c) => c.items.slice(0, 3)).slice(0, 12).map((p, i) => (
                <div key={i} className="rounded-2xl border border-blue-800/30 p-4 bg-[#173264]">
                  <div className="text-sm font-semibold text-white mb-2">{getQuestion(p)}</div>
                  <div className="text-xs text-blue-100/90 mb-3">{prettifyCategory(getCategoryRaw(p))}</div>
                  {(p.options && p.options.length ? p.options : ["Yes", "No"]).map((o, j) => (<ResultBar key={j} label={o} pct={50 - (j * 7) % 20 + 30} count={1000 - j * 123} />))}
                </div>
              ))}
            </div>

            <div className="mt-6"><ResultsReminder /></div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Optional: hide scrollbars on chips row */
/* Optional: hide scrollbars on chips row (add to global CSS if desired)
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
*/
