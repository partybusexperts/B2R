"use client";

import React, { useEffect, useMemo, useState } from "react";

export type Poll = {
  id: string;
  question: string;
  options: string[];
  tags?: string[];
  active?: boolean;
};
type PollsPayload = {
  polls: Poll[];
  votes: Record<string, Record<string, number>>;
};

async function fetchAll(): Promise<PollsPayload> {
  // /api/poll returns lightweight { polls } and is cached at the edge. Load
  // the polls list and then request bulk results for the initial visible set.
  const r = await fetch("/api/poll/all", { cache: "force-cache" });
  if (!r.ok) throw new Error("Failed to load polls");
  const body = await r.json();
  const polls = Array.isArray(body.polls) ? body.polls : [];
  // pick top N ids for initial results (limit to 12 to avoid big payloads)
  const ids = polls.slice(0, 12).map((p: any) => p.id);
  let votes: Record<string, Record<string, number>> = {};
  if (ids.length) {
    try {
  const br = await fetch('/api/poll/results/bulk', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids }) });
      if (br.ok) {
        const j = await br.json();
        votes = j && j.data ? j.data : {};
      }
    } catch (e) {
      votes = {};
    }
  }
  return { polls, votes };
}

async function castVote(poll_id: string, option: string) {
  const r = await fetch("/api/poll/vote", {
    method: "POST",
    credentials: 'same-origin',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ poll_id, option }),
  });
  if (!r.ok) throw new Error("Vote failed");
  return r.json() as Promise<{ ok: true; results: Record<string, number>; total: number }>;
}

function alreadyVoted(pollId: string): boolean {
  if (typeof document === "undefined") return false;
  const ck = document.cookie.split("; ").find((x) => x.startsWith(`pv_${pollId}=`));
  const ls = typeof localStorage !== "undefined" && localStorage.getItem(`pv_${pollId}`) === "1";
  return Boolean(ck || ls);
}

function markVoted(pollId: string) {
  try { localStorage.setItem(`pv_${pollId}`, "1"); } catch {}
}

export function PollCard({ poll, initialCounts }: { poll: Poll; initialCounts?: Record<string, number> }) {
  const [counts, setCounts] = useState<Record<string, number>>(initialCounts || {});
  const [total, setTotal] = useState<number>(() => Object.values(initialCounts || {}).reduce((a, b) => a + b, 0));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");

  const voted = alreadyVoted(poll.id);

  const onVote = async (opt: string) => {
    if (busy || voted) return;
    setBusy(true); setError("");
    try {
      const res = await castVote(poll.id, opt);
      setCounts(res.results);
      setTotal(res.total);
      markVoted(poll.id);
    } catch (e: any) {
      setError(e?.message || "Vote failed");
    } finally {
      setBusy(false);
    }
  };

  const pct = (opt: string) => {
    const c = counts?.[opt] || 0;
    if (!total) return 0;
    return Math.round((c / total) * 100);
  };

  return (
    <div className="bg-[#12244e] rounded-2xl shadow-xl border border-blue-800/30 p-6">
      <h3 className="text-xl font-bold text-blue-50 mb-3">{poll.question}</h3>
      <div className="space-y-2">
        {poll.options.map((opt) => {
          const percentage = pct(opt);
          return (
            <button
              key={opt}
              disabled={busy || voted}
              onClick={() => onVote(opt)}
              className="w-full text-left bg-[#0f1f46] hover:bg-[#0d1b3a] disabled:opacity-60 border border-blue-800/40 rounded-lg p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-blue-100">{opt}</span>
                <span className="text-blue-300 text-sm">{percentage}%</span>
              </div>
              <div className="mt-2 h-2 rounded bg-blue-900/40">
                <div className="h-2 rounded bg-blue-500" style={{ width: `${percentage}%` }} />
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-3 text-blue-300 text-sm">Total votes: {total}</div>
      {error && <div className="mt-2 text-red-300 text-sm">{error}</div>}
      <div className="mt-3 text-blue-200 text-sm">
        <a className="underline hover:text-blue-50" href={`/poll-results`}>See all results</a>
      </div>
    </div>
  );
}

// Backwards compatibility: some pages import { Poll } from this module
function PollLegacy({ poll, initialResults }: { poll: Poll; initialResults?: Record<string, number> }) {
  return <PollCard poll={poll} initialCounts={initialResults} />;
}

export { PollLegacy as Poll };

export default function PollsSection({
  mode = "scoped",
  tags,
  limit,
  randomize = mode === "scoped",
  enableSearch = mode === "canonical",
}: {
  mode?: "canonical" | "scoped";
  tags?: string[];
  limit?: number;
  randomize?: boolean;
  enableSearch?: boolean;
}) {
  const [data, setData] = useState<PollsPayload | null>(null);
  const [q, setQ] = useState("");
  // Items state holds the final list rendered. We compute a deterministic
  // ordering for SSR and then optionally shuffle on the client inside useEffect
  // to avoid Math.random during render which can cause hydration mismatches.
  const [itemsState, setItemsState] = useState<{ poll: Poll; counts: Record<string, number> }[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetchAll().then((d) => { if (alive) setData(d); }).catch(() => {});
    return () => { alive = false; };
  }, []);

  const itemsDeterministic = useMemo(() => {
    if (!data?.polls) return [];
    let arr = [...data.polls];

    if (mode === "canonical") {
      if (q.trim()) {
        const qq = q.toLowerCase();
        arr = arr.filter(p =>
          p.question.toLowerCase().includes(qq) ||
          (p.tags || []).some(t => t.toLowerCase().includes(qq))
        );
      }
      return arr.map(p => ({ poll: p, counts: data.votes[p.id] || {} }));
    }

    if (tags && tags.length) {
      const wanted = new Set(tags.map(t => t.toLowerCase()));
      arr = arr.filter(p => (p.tags || []).some(t => wanted.has(t.toLowerCase())));
    }
    // Deterministic fallback ordering for SSR: sort by id string to avoid randomness on render
    arr.sort((a, b) => String(a.id).localeCompare(String(b.id)));
    if (limit) arr = arr.slice(0, limit);
    return arr.map(p => ({ poll: p, counts: data.votes[p.id] || {} }));
  }, [data, mode, q, tags, limit]);

  // When data or options change, ensure itemsState is set and apply client-only randomization.
  useEffect(() => {
    // Start from the deterministic set
    let next = itemsDeterministic.slice();
    if (randomize && typeof window !== "undefined") {
      // shuffle in-place using Fisher-Yates
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
    }
    setItemsState(next);
  }, [itemsDeterministic, randomize]);

  return (
    <div className="space-y-6">
      {enableSearch && (
        <div className="flex justify-center">
          <input
            className="w-full max-w-xl rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search polls…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(itemsState || []).map(({ poll, counts }) => (
          <PollCard key={poll.id} poll={poll} initialCounts={counts} />
        ))}
      </div>
    </div>
  );
}
