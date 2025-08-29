"use client";

import React, { useEffect, useMemo, useState } from "react";
import PageLayout from "../../components/PageLayout";
import Section from "../../components/Section";
import { Poll } from "../../components/PollsSection";

type PollData = {
  id: string;
  question: string;
  options: string[];
  votes: Record<string, number>;
  category?: string;
};

type ApiPoll = {
  id: string;
  question?: string;
  title?: string;
  options?: string[];
  category?: string;
  tags?: string[];
};

type ApiResponse = {
  polls?: ApiPoll[];
  votes?: Record<string, Record<string, number>>;
};

export default function PollsPage() {
  const [allPolls, setAllPolls] = useState<PollData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<"popular" | "new">("popular");

  // Fetch (works with Next.js rewrite proxy OR absolute API)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const r = await fetch("/api/poll/all", { cache: "no-store" });
        if (!r.ok) throw new Error(`Failed to fetch polls (${r.status})`);
  const json = (await r.json()) as ApiResponse | ApiPoll[];
  // expected shape: { polls: [...], votes: { pollId: { option: count } } }
  const pollsList: ApiPoll[] = Array.isArray(json) ? (json as ApiPoll[]) : (json.polls || [] as ApiPoll[]);
  const votesMap: Record<string, Record<string, number>> = (Array.isArray(json) ? {} : (json.votes || {}));

        function firstTag(p: ApiPoll): string | undefined {
          if (!p || !('tags' in p)) return undefined;
          const t = (p as any).tags;
          if (!Array.isArray(t) || t.length === 0) return undefined;
          return String(t[0]);
        }

        const merged: PollData[] = pollsList.map(p => ({
          id: String(p.id),
          question: String(p.question || p.title || ''),
          options: Array.isArray(p.options) ? p.options : [],
          votes: votesMap[p.id] || {},
          // Prefer explicit category, fall back to the first tag so registry tags show up in the UI
          category: p.category || firstTag(p),
        }));
        if (!cancelled) setAllPolls(merged);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Build categories from data
  const categories = useMemo(() => {
    const set = new Set<string>();
    allPolls.forEach(p => p.category && set.add(p.category));
    return ["All", ...Array.from(set).sort()];
  }, [allPolls]);

  // Filter + sort
  const visiblePolls = useMemo(() => {
    let items = allPolls;
    if (category !== "All") {
      items = items.filter(p => (p.category || "Uncategorized") === category);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(p =>
        p.question.toLowerCase().includes(q) ||
        p.options.some(o => o.toLowerCase().includes(q))
      );
    }
    // sort: popular by total votes desc, new by id desc (or add createdAt)
    if (sort === "popular") {
      items = [...items].sort((a, b) => {
        const ta = Object.values(a.votes || {}).reduce((s, n) => s + (n || 0), 0);
        const tb = Object.values(b.votes || {}).reduce((s, n) => s + (n || 0), 0);
        return tb - ta;
      });
    } else {
      items = [...items].sort((a, b) => String(b.id).localeCompare(String(a.id)));
    }
    return items;
  }, [allPolls, category, search, sort]);

  return (
    <PageLayout gradientFrom="from-blue-950" gradientVia="via-blue-900" gradientTo="to-black" textColor="text-white">
      {/* HERO / HEADER */}
      <Section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-0">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-300 via-blue-200 to-blue-400 bg-clip-text text-transparent">
              Interactive Polls
            </h1>
            <p className="text-blue-100 text-lg md:text-xl mt-3">
              Vote, see results, and explore what travelers prefer.
            </p>
          </div>

          {/* CONTROLS BAR */}
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between bg-blue-950/50 border border-blue-700/30 rounded-2xl p-4">
            {/* Search */}
            <div className="flex-1">
              <label className="block text-xs font-semibold text-blue-200 mb-1">Search polls</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="e.g., party bus, wedding, Dallas…"
                className="w-full rounded-lg px-3 py-2 bg-blue-950/70 border border-blue-700/40 text-blue-50 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Category */}
            <div className="md:w-56">
              <label className="block text-xs font-semibold text-blue-200 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg px-3 py-2 bg-blue-950/70 border border-blue-700/40 text-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Sort */}
            <div className="md:w-48">
              <label className="block text-xs font-semibold text-blue-200 mb-1">Sort by</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as "popular" | "new")}
                className="w-full rounded-lg px-3 py-2 bg-blue-950/70 border border-blue-700/40 text-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="popular">Most votes</option>
                <option value="new">Newest</option>
              </select>
            </div>
          </div>

          {/* STATES */}
          {loading && (
            <div className="text-center py-10">
              <div className="animate-pulse text-blue-200">Loading polls…</div>
            </div>
          )}
          {error && (
            <div className="text-center py-10">
              <div className="text-red-300">Error: {error}</div>
            </div>
          )}
          {!loading && !error && visiblePolls.length === 0 && (
            <div className="text-center py-10 text-blue-100">No polls match your filters.</div>
          )}

          {/* GRID */}
          {!loading && !error && visiblePolls.length > 0 && (
            <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8">
              {visiblePolls.map((poll) => (
                <div key={poll.id} className="bg-blue-950/60 border border-blue-700/30 rounded-2xl p-4">
                  <Poll
                    poll={{ id: poll.id, question: poll.question, options: poll.options }}
                    initialResults={poll.votes}
                  />
                  {poll.category && (
                    <div className="mt-3 text-[11px] text-blue-300 uppercase tracking-wide">
                      {poll.category}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>
    </PageLayout>
  );
}
