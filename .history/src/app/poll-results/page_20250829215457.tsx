"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageLayout from "../../components/PageLayout";
import Section from "../../components/Section";

/* ------------------------------- Registry ------------------------------- */
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
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState<"registry" | "votes_desc" | "alpha">("registry");

  const maxOptions = useMemo(
    () => POLL_QUESTIONS.reduce((max, poll) => Math.max(max, poll.options.length), 0),
    []
  );

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
      .catch((e: any) => {
        if (e.name !== "AbortError") setErr("Failed to load poll results.");
      })
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, []);

  /** Join registry with counts once, then filter/sort. */
  const rows = useMemo(() => {
    const joined = POLL_QUESTIONS.map((poll) => {
      const counts = results[poll.id] || {};
      const total = Object.values(counts).reduce((a, b) => a + Number(b || 0), 0);
      return { poll, counts, total };
    });

    // Filter by question text or any option matching the query
    const ql = q.trim().toLowerCase();
    let visible = ql
      ? joined.filter(
          ({ poll }) =>
            poll.question.toLowerCase().includes(ql) ||
            poll.options.some((o) => o.toLowerCase().includes(ql))
        )
      : joined;

    // Sort
    if (sortBy === "votes_desc") {
      visible = [...visible].sort((a, b) => b.total - a.total);
    } else if (sortBy === "alpha") {
      visible = [...visible].sort((a, b) => a.poll.question.localeCompare(b.poll.question));
    }
    // "registry" keeps the original order
    return visible;
  }, [results, q, sortBy]);

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
              onChange={(e) => setSortBy(e.target.value as any)}
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
              onClick={() => download(`poll-results-${new Date().toISOString().slice(0,10)}.csv`, buildCSV(rows))}
              className="bg-white hover:bg-blue-50 text-blue-900 font-bold px-5 py-3 rounded-xl shadow text-base border border-blue-200"
            >
              Export CSV
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(JSON.stringify({ rows }, null, 2))}
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
          <div className="overflow-x-auto">
            <table className="min-w-full bg-blue-950/70 rounded-2xl shadow border border-blue-700/20 text-white">
              <thead className="sticky top-0 bg-blue-950/90 backdrop-blur supports-[backdrop-filter]:bg-blue-950/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-blue-200 uppercase">Poll Question</th>
                  {Array.from({ length: maxOptions }).map((_, idx) => (
                    <th key={idx} className="px-4 py-3 text-xs font-bold text-blue-200 uppercase text-center">
                      Option {idx + 1}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-xs font-bold text-blue-200 uppercase text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ poll, counts, total }) => (
                  <tr key={poll.id} className="border-t border-blue-700/20 hover:bg-blue-900/60">
                    <td className="px-4 py-3 align-top text-blue-100 font-semibold text-base max-w-xs whitespace-normal">
                      {poll.question}
                    </td>
                    {Array.from({ length: maxOptions }).map((_, idx) => {
                      const opt = poll.options[idx];
                      if (!opt) return <td key={`empty-${poll.id}-${idx}`} className="px-4 py-3" />;
                      const c = Number(counts[opt] || 0);
                      const p = percent(c, total);
                      return (
                        <td key={`${poll.id}-${opt}`} className="px-4 py-3 text-blue-100 text-base text-center align-top">
                          <div className="font-bold">{opt}</div>
                          <div className="text-sm text-blue-200">{fmt(c)} {total > 0 ? <span className="text-xs text-blue-300">({p}%)</span> : null}</div>
                          {/* little percent bar */}
                          <div className="mt-2 h-2 rounded bg-blue-900/40">
                            <div className="h-2 rounded bg-blue-500" style={{ width: `${p}%` }} />
                          </div>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-blue-100 text-center font-bold">{fmt(total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </PageLayout>
  );
}
