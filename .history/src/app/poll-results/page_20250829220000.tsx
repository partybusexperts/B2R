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

/** Build CSV of the current visible rows. */
function buildCSV(rows: { poll: Poll; counts: Record<string, number>; total: number }[]) {
  const lines: string[] = [
    ["poll_id", "question", "option", "votes", "percent", "total_votes"].join(","),
  ];
  for (const { poll, counts, total } of rows) {
    for (const opt of poll.options) {
      const v = counts[opt] ?? 0;
      const p = percent(v, total);
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
          <div className="flex gap-3">
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
          </div>
        </div>
      </Section>

      {/* RESULTS TABLE */}
      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl my-6 py-8 px-6 border border-blue-800/30">
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
          <div>
            {grouped.length === 0 ? (
              <div className="p-8 text-center text-blue-200">No polls found.</div>
            ) : (
              grouped.map(({ category, rows }) => (
                <div key={category} className="mb-8">
                  <h3 className="text-xl font-bold text-blue-200 mb-3 capitalize">{category.replace(/[-_]/g, ' ')}</h3>
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
                </div>
              ))
            )}
          </div>
        )}
      </Section>
    </PageLayout>
  );
}
