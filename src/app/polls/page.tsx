"use client";

import React, { useEffect, useMemo, useState } from "react";
import PollCardPro from "@/components/PollCardPro";

type Poll = {
  id: string;
  question: string;
  options: string[];
  tags?: string[];
  active?: boolean;
  slug?: string | null;
};

type VotesMap = Record<string, Record<string, number>>;

type PollsPayload = {
  polls: Poll[];
  votes: VotesMap;
};

async function fetchAll(): Promise<PollsPayload> {
  const r = await fetch("/api/poll/all", { cache: "no-store" });
  if (!r.ok) throw new Error("Failed to load polls");
  const body = await r.json();

  const polls = Array.isArray(body.polls) ? (body.polls as Poll[]) : [];

  const ids = polls.map((p) => p.id);
  let votes: VotesMap = {};

  if (ids.length) {
    try {
      const br = await fetch("/api/poll/results/bulk", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (br.ok) {
        const j = await br.json();
        votes = j && j.data ? (j.data as VotesMap) : {};
      }
    } catch {
      votes = {};
    }
  }

  return { polls, votes };
}

function formatLabel(label?: string) {
  if (!label) return "";
  return String(label)
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((s) => (s.length ? s[0].toUpperCase() + s.slice(1).toLowerCase() : ""))
    .join(" ");
}

const SUPER_GROUPS: {
  id: string;
  label: string;
  tagSubstrings: string[];
  description?: string;
}[] = [
  {
    id: "all",
    label: "All topics",
    tagSubstrings: [],
    description: "Everything in one place (filtered by search if you use it).",
  },
  {
    id: "vehicles",
    label: "Vehicles",
    tagSubstrings: [
      "vehicle",
      "transport",
      "party-bus",
      "party bus",
      "bus",
      "limousine",
      "limo",
      "coach",
      "shuttle",
      "sprinter",
      "van",
      "sedan",
      "fleet",
      "features",
      "capacity",
      "comfort",
      "option",
      "technology",
      "integration",
      "style",
      "type",
      "logistics",
      "service",
      "music",
      "airport",
    ],
    description: "Party buses, limos, sprinters, coaches, and more.",
  },
  {
    id: "events",
    label: "Events & Occasions",
    tagSubstrings: [
      "event",
      "events",
      "wedding",
      "prom",
      "concert",
      "birthday",
      "bachelor",
      "bachelorette",
      "night-out",
      "night out",
      "airport",
      "corporate",
      "tour",
      "bar-hop",
      "brewery",
      "winery",
      "haunted",
      "holiday",
      "family",
      "fun",
      "community",
      "stories",
      "nightmare",
      "itinerary",
      "purpose",
      "use-case",
      "experience",
      "entertainment",
      "booking",
      "timing",
      "duration",
      "operations",
      "tourism",
    ],
    description: "Weddings, proms, haunted houses, light tours, nights out.",
  },
  {
    id: "regions",
    label: "States & Regions",
    tagSubstrings: [
      "arizona",
      "texas",
      "california",
      "florida",
      "colorado",
      "midwest",
      "southwest",
      "northwest",
      "southeast",
      "northeast",
      "vegas",
      "phoenix",
      "dallas",
      "denver",
      "chicago",
      "nyc",
      "atlanta",
      "miami",
      "houston",
      "seattle",
      "boston",
      "la",
      "los angeles",
      "sf",
      "san francisco",
    ],
    description: "Polls about local cities, states, and regional preferences.",
  },
  {
    id: "pricing",
    label: "Pricing & Budget",
    tagSubstrings: [
      "price",
      "pricing",
      "budget",
      "cost",
      "deposit",
      "gratuity",
      "fee",
      "payment",
      "payments",
      "quote",
      "rate",
      "hourly",
      "tip",
      "value",
    ],
    description: "What riders think is fair, cheap, or expensive.",
  },
  {
    id: "policies",
    label: "Policies & BYOB",
    tagSubstrings: [
      "byob",
      "alcohol",
      "drink",
      "drinks",
      "beverage",
      "beverages",
      "policy",
      "policies",
      "rules",
      "rule",
      "cleaning",
      "damage",
      "safety",
      "accessibility",
      "trust",
      "privacy",
      "insurance",
      "requirement",
    ],
    description: "BYOB, rules, cleaning fees, expectations.",
  },
  {
    id: "other",
    label: "Everything else",
    tagSubstrings: [],
    description: "Catch-all for tags that didn’t fit above.",
  },
];

const DEFAULT_GROUP_ID = "all";

type TagBucket = {
  tag: string;
  polls: Poll[];
};

export default function PollsPage() {
  const [data, setData] = useState<PollsPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(DEFAULT_GROUP_ID);
  const [search, setSearch] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetchAll()
      .then((d) => {
        if (!alive) return;
        setData(d);
      })
      .catch((err) => {
        console.error(err);
        if (!alive) return;
        setError("Unable to load polls right now.");
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const tag = params.get("tag");
    const groupParam = params.get("group");

    if (groupParam && SUPER_GROUPS.some((g) => g.id === groupParam)) {
      setSelectedGroupId(groupParam);
    }

    if (tag) {
      setSearch(tag);
      const normalized = tag.toLowerCase();
      const inferred = SUPER_GROUPS.find((group) =>
        group.tagSubstrings.some((sub) => sub && normalized.includes(sub.toLowerCase()))
      );
      if (inferred) {
        setSelectedGroupId(inferred.id);
      }
    }
  }, []);

  const polls = data?.polls ?? [];
  const votes = data?.votes ?? {};
  const loading = !data && !error;
  const ready = !!data;

  const activePolls = useMemo(() => polls.filter((p) => p.active !== false), [polls]);

  const tagBuckets = useMemo(() => {
    const map = new Map<string, Poll[]>();

    activePolls.forEach((p) => {
      const tags = p.tags && p.tags.length ? p.tags : ["general"];
      tags.forEach((raw) => {
        const tag = raw.toLowerCase();
        if (!map.has(tag)) map.set(tag, []);
        map.get(tag)!.push(p);
      });
    });

    return Array.from(map.entries())
      .map(([tag, groupedPolls]) => ({ tag, polls: groupedPolls }))
      .sort((a, b) => {
        const diff = b.polls.length - a.polls.length;
        if (diff !== 0) return diff;
        return a.tag.localeCompare(b.tag);
      });
  }, [activePolls]);

  const filteredBuckets = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tagBuckets;

    return tagBuckets
      .map((bucket) => {
        const filtered = bucket.polls.filter((p) => {
          const text = `${p.question || ""} ${(p.tags || []).join(" ")} ${bucket.tag}`;
          return text.toLowerCase().includes(q);
        });
        return { ...bucket, polls: filtered };
      })
      .filter((bucket) => bucket.polls.length > 0);
  }, [tagBuckets, search]);

  const activeSuperGroup = SUPER_GROUPS.find((g) => g.id === selectedGroupId) ?? SUPER_GROUPS[0];

  const bucketsForGroup = useMemo(() => {
    if (!filteredBuckets.length) return [];
    if (search.trim()) return filteredBuckets;
    if (activeSuperGroup.id === "all") return filteredBuckets;

    const wantedSubs = activeSuperGroup.tagSubstrings.map((s) => s.toLowerCase());

    const matchesGroup = (tag: string) =>
      wantedSubs.length === 0 ? false : wantedSubs.some((sub) => tag.includes(sub));

    let primary = filteredBuckets.filter((bucket) => matchesGroup(bucket.tag));

    if (!primary.length && activeSuperGroup.id === "other") {
      const allSubs = SUPER_GROUPS.flatMap((g) => g.tagSubstrings).map((s) => s.toLowerCase());
      primary = filteredBuckets.filter((bucket) => !allSubs.some((sub) => bucket.tag.includes(sub)));
    }

    if (!primary.length) return filteredBuckets;
    return primary;
  }, [filteredBuckets, activeSuperGroup, search]);

  const totalPollCountInGroup = useMemo(() => bucketsForGroup.reduce((sum, bucket) => sum + bucket.polls.length, 0), [bucketsForGroup]);

  useEffect(() => {
    if (!ready) return;
    if (search.trim()) return;
    if (selectedGroupId === DEFAULT_GROUP_ID) return;
    if (bucketsForGroup.length) return;
    setSelectedGroupId(DEFAULT_GROUP_ID);
  }, [ready, search, selectedGroupId, bucketsForGroup.length]);

  const handleCopyEmbed = async (poll: Poll) => {
    try {
      if (typeof window === "undefined") return;
      const origin = window.location.origin;
      const slugOrId = poll.slug || poll.id;
      const url = `${origin}/polls/${slugOrId}?embed=1`;
      await navigator.clipboard.writeText(url);
      setCopiedId(poll.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore copy failures
    }
  };

  return (
    <main className="min-h-screen bg-[#050b1e] text-slate-100">
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="mb-6 md:mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">Live rider intel</p>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">Polls & rider opinions</h1>
          <p className="mt-3 text-blue-200/85 max-w-3xl">
            All Bus2Ride polls in one place. Choose a topic lane below, or search anything—vehicles, cities, BYOB rules, pricing, and more. Each tile is a mini lab with dozens of live votes.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="w-full md:max-w-md">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-blue-300/70">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search polls by question, tag, city, vehicle, etc."
                className="w-full rounded-full bg-[#050b26] border border-blue-800/60 pl-9 pr-4 py-2 text-sm text-blue-50 placeholder:text-blue-300/60 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
              />
            </div>
            {search.trim() && (
              <p className="mt-1 text-[11px] text-blue-200/75">Showing results that mention “{search.trim()}”.</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {SUPER_GROUPS.map((group) => {
              const active = group.id === activeSuperGroup.id;
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setSelectedGroupId(group.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs md:text-sm font-semibold border transition ${active ? "bg-white text-blue-900 border-blue-200 shadow-lg" : "bg-white/5 text-blue-100 border-white/10 hover:bg-white/10"}`}
                >
                  {group.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <p className="text-xs text-blue-200/80 max-w-xl">
            {search.trim()
              ? "Search results across all categories."
              : activeSuperGroup.description || "Pick a lane and scroll through multiple poll categories at once."}
          </p>
          <p className="text-xs text-blue-200/80">
            {bucketsForGroup.length} topic{bucketsForGroup.length === 1 ? "" : "s"} • {totalPollCountInGroup.toLocaleString()} poll{totalPollCountInGroup === 1 ? "" : "s"}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-100">
            <h2 className="text-lg font-semibold mb-2">Unable to load polls</h2>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading && (
          <div className="mb-4 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-6 text-blue-100">
            <p className="text-sm">Loading polls…</p>
          </div>
        )}

        {ready && (
          <>
            {bucketsForGroup.length === 0 ? (
              <div className="rounded-2xl border border-blue-800/30 bg-[#071022] p-6 text-sm text-blue-200/85">
                No polls match your filters yet. Try clearing the search or picking a different lane.
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {bucketsForGroup.map((bucket) => (
                  <article
                    key={bucket.tag}
                    className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/7 via-white/3 to-transparent p-3 md:p-4 flex flex-col shadow-[0_20px_50px_rgba(3,7,18,0.8)]"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <h2 className="text-sm md:text-base font-semibold text-white">{formatLabel(bucket.tag)}</h2>
                      <span className="text-[11px] text-blue-200/80">
                        {bucket.polls.length} poll{bucket.polls.length === 1 ? "" : "s"}
                      </span>
                    </div>

                    <div className="relative rounded-xl border border-white/10 bg-[#050b24]/80 p-2">
                      <div className="max-h-[640px] overflow-y-auto space-y-3 pr-1">
                        {bucket.polls.map((poll) => (
                          <div key={poll.id} className="rounded-xl border border-white/10 bg-white/5 p-2">
                            <PollCardPro
                              poll={poll}
                              initialCounts={votes[poll.id] || {}}
                              variant="compact"
                              showFooterActions={false}
                            />
                            <div className="mt-2 flex items-center justify-between gap-2 border-t border-white/10 pt-1">
                              <button
                                type="button"
                                onClick={() => handleCopyEmbed(poll)}
                                className="text-[10px] inline-flex items-center rounded-full bg-white/90 text-blue-900 px-3 py-1 font-semibold hover:bg-white"
                              >
                                {copiedId === poll.id ? "Embed link copied" : "Copy embed link"}
                              </button>
                              <a
                                href={`/polls/${poll.slug || poll.id}`}
                                className="text-[10px] text-blue-200 underline decoration-blue-300/80 hover:text-white"
                              >
                                Open
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 rounded-b-xl bg-gradient-to-t from-[#050b24] to-transparent" />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}



