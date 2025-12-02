"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import PollCardPro from "@/components/PollCardPro";
import { POLL_TOPICS, type TopicNode } from "@/lib/polls/topics";

type RemotePoll = {
  id: string | number;
  slug?: string | null;
  category_slug?: string | null;
  question: string;
  options?: string[] | null;
  option_ids?: Array<string | number | null> | null;
  options_id?: Array<string | number | null> | null;
  options_json?: Array<Record<string, unknown>> | null;
  is_active?: boolean | null;
  results?: Array<{ option_id?: string | number | null; votes?: number | null }> | null;
};

type LeafData = {
  tagId: string;
  polls: RemotePoll[];
  loading: boolean;
  hasMore: boolean;
  nextOffset: number;
  error: string | null;
};

type PollStats = {
  totalPolls: number;
  totalVotes: number;
  lastVoteAt: string | null;
};

function countLeafNodes(node: TopicNode | null | undefined): number {
  if (!node) return 0;
  if (node.kind === "leaf") return 1;
  return (node.children ?? []).reduce((sum, child) => sum + countLeafNodes(child), 0);
}

function formatLabel(label?: string) {
  if (!label) return "";
  return String(label)
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((chunk) => (chunk.length ? chunk[0].toUpperCase() + chunk.slice(1).toLowerCase() : ""))
    .join(" ");
}

async function fetchByTag(tag: string, offset = 0, limit = 25): Promise<{ polls: RemotePoll[]; hasMore: boolean }> {
  const response = await fetch(
    `/api/poll/by-tag?tag=${encodeURIComponent(tag)}&offset=${offset}&limit=${limit}`,
    { cache: "no-store" }
  );
  if (!response.ok) throw new Error(`Failed to load polls for tag ${tag}`);
  const data = await response.json();
  return {
    polls: Array.isArray(data?.polls) ? data.polls : [],
    hasMore: Boolean(data?.hasMore),
  };
}

function makeFallbackId() {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    // ignore
  }
  return `poll-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function mapToPollCard(poll: RemotePoll) {
  const optionLabels = Array.isArray(poll.options)
    ? poll.options.filter((opt): opt is string => typeof opt === "string" && opt.trim().length > 0)
    : [];

  const idsSource = Array.isArray(poll.option_ids)
    ? poll.option_ids
    : Array.isArray(poll.options_id)
      ? poll.options_id
      : undefined;

  const metaSource = Array.isArray(poll.options_json) ? poll.options_json : [];

  const optionIds = optionLabels.map((_, idx) => {
    const metaItem = metaSource[idx] as Record<string, unknown> | undefined;
    const metaId = metaItem && (metaItem.id as string | number | null | undefined);
    const rawId = idsSource?.[idx] ?? metaId;
    if (typeof rawId === "string" || typeof rawId === "number") return rawId;
    return `${idx}`;
  });

  const normalizedResults = Array.isArray(poll.results)
    ? poll.results
        .map((entry) => {
          if (!entry || entry.option_id === undefined || entry.option_id === null) return null;
          const votes = typeof entry.votes === "number" ? entry.votes : Number(entry.votes ?? 0);
          if (!Number.isFinite(votes)) return null;
          return { option_id: entry.option_id, votes };
        })
        .filter((entry): entry is { option_id: string | number; votes: number } => Boolean(entry))
    : undefined;

  return {
    id: String(poll.id ?? poll.slug ?? makeFallbackId()),
    slug: poll.slug ?? undefined,
    question: poll.question ?? "",
    options: optionLabels,
    optionIds,
    results: normalizedResults,
  };
}

function TopicModal({ topic, open, onClose }: { topic: TopicNode | null; open: boolean; onClose: () => void }) {
  const [leafData, setLeafData] = useState<Record<string, LeafData>>({});
  const [nodeStack, setNodeStack] = useState<TopicNode[]>([]);
  const [activeLeaf, setActiveLeaf] = useState<TopicNode | null>(null);

  const loadLeaf = useCallback(async (leafId: string, reset = false) => {
    let offset = 0;
    setLeafData((prev) => {
      const current = prev[leafId];
      offset = reset || !current ? 0 : current.nextOffset;
      return {
        ...prev,
        [leafId]: {
          tagId: leafId,
          polls: reset ? [] : current?.polls ?? [],
          loading: true,
          hasMore: reset ? true : current?.hasMore ?? true,
          nextOffset: reset ? 0 : current?.nextOffset ?? 0,
          error: null,
        },
      };
    });

    try {
      const { polls, hasMore } = await fetchByTag(leafId, offset);
      setLeafData((prev) => {
        const existing = prev[leafId] ?? { tagId: leafId, polls: [], loading: false, hasMore: true, nextOffset: 0, error: null };
        const merged = reset ? polls : [...existing.polls, ...polls];
        return {
          ...prev,
          [leafId]: {
            tagId: leafId,
            polls: merged,
            loading: false,
            hasMore,
            nextOffset: merged.length,
            error: null,
          },
        };
      });
    } catch (err) {
      setLeafData((prev) => ({
        ...prev,
        [leafId]: {
          ...(prev[leafId] ?? { tagId: leafId, polls: [], hasMore: false, nextOffset: 0 }),
          loading: false,
          error: err instanceof Error ? (err as Error).message : "Failed to load polls",
        },
      }));
    }
  }, []);

  useEffect(() => {
    if (!topic || !open) {
      setLeafData({});
      setNodeStack([]);
      setActiveLeaf(null);
      return;
    }

    setLeafData({});
    setNodeStack([topic]);
    if (topic.kind === "leaf") {
      setActiveLeaf(topic);
      void loadLeaf(topic.id, true);
    } else {
      setActiveLeaf(null);
    }
  }, [topic, open, loadLeaf]);

  if (!open || !topic) return null;

  const currentGroup = nodeStack[nodeStack.length - 1];
  const childNodes = currentGroup?.kind === "group" ? currentGroup.children ?? [] : [];
  const activeData = activeLeaf ? leafData[activeLeaf.id] ?? null : null;
  const canGoBack = nodeStack.length > 1;

  const handleNodeSelect = (node: TopicNode) => {
    if (node.kind === "group") {
      setNodeStack((prev) => [...prev, node]);
      setActiveLeaf(null);
      return;
    }

    setActiveLeaf(node);
    const existing = leafData[node.id];
    if (!existing || (!existing.polls.length && !existing.loading && !existing.error)) {
      void loadLeaf(node.id, true);
    }
  };

  const handleBack = () => {
    setNodeStack((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.slice(0, -1);
      return next;
    });
    setActiveLeaf(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 md:p-6" onClick={onClose}>
      <div
        className="relative w-full max-w-6xl overflow-hidden rounded-3xl border border-blue-500/40 bg-[#040921] shadow-[0_40px_120px_rgba(0,0,0,0.95)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
          <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(86,156,255,0.55),_transparent_65%)]" />
        </div>

        <div className="relative border-b border-blue-900/70 bg-gradient-to-r from-[#050b2a] via-[#050b2a] to-[#050b34] px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-blue-200/70">Topic</p>
              <h2 className="mt-1 text-sm md:text-lg font-semibold text-white">{topic.label}</h2>
              <p className="mt-1 text-[11px] md:text-xs text-blue-200/80">Scroll each section and answer as many polls as you like – votes save instantly.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-900/60 text-white hover:bg-blue-700"
              aria-label="Close topic"
            >
              ×
            </button>
          </div>
        </div>

        <div className="relative max-h-[75vh] overflow-y-auto px-3 py-3 md:px-5 md:py-5">
          <div className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-blue-200/60">
            <span>{nodeStack.map((node) => formatLabel(node.label)).join(" / ")}</span>
            {canGoBack ? (
              <button
                type="button"
                onClick={handleBack}
                className="rounded-full border border-blue-400/40 px-3 py-1 text-[10px] normal-case tracking-normal text-blue-100 hover:border-blue-300"
              >
                ← Back
              </button>
            ) : null}
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {childNodes.length === 0 ? (
              <span className="rounded-full border border-dashed border-white/15 px-3 py-1.5 text-xs text-blue-200/70">No subtopics configured yet.</span>
            ) : (
              childNodes.map((node) => {
                const isLeafActive = node.kind === "leaf" && activeLeaf?.id === node.id;
                const baseClasses =
                  node.kind === "group"
                    ? "border-blue-400/40 bg-blue-500/10 text-blue-100 hover:border-blue-300"
                    : "border-white/15 bg-white/5 text-blue-100 hover:border-blue-300/70";
                const activeClasses = isLeafActive ? "border-blue-300 bg-blue-400/20 text-white" : baseClasses;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => handleNodeSelect(node)}
                    className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${activeClasses}`}
                  >
                    {formatLabel(node.label)}
                    {node.kind === "group" ? <span className="text-[10px] text-blue-200/70">→</span> : null}
                  </button>
                );
              })
            )}
          </div>

          {!activeLeaf ? (
            <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-center text-blue-100/80">
              Choose a region, state, or city above to drill into real polls. Groups reveal another layer; leaves trigger the Supabase query.
            </div>
          ) : (
            <section className="space-y-4">
              <header className="flex items-center justify-between text-sm text-blue-100/80">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-blue-300/70">Subtopic</p>
                  <h3 className="mt-1 text-base font-semibold text-white">{formatLabel(activeLeaf.label)}</h3>
                </div>
                {activeData?.polls.length ? (
                  <span>{activeData.polls.length.toLocaleString()} poll{activeData.polls.length === 1 ? "" : "s"}</span>
                ) : null}
              </header>

              {!activeData || activeData.loading ? (
                <div className="rounded-2xl border border-white/10 bg-[#060e25] p-6 text-center text-blue-200/80">Loading polls…</div>
              ) : activeData.error ? (
                <div className="rounded-2xl border border-white/10 bg-[#200808]/80 p-6 text-center text-red-200">{activeData.error}</div>
              ) : !activeData.polls.length ? (
                <div className="rounded-2xl border border-white/10 bg-[#060e25] p-6 text-center text-blue-200/80">No polls yet for this subtopic.</div>
              ) : (
                <div className="space-y-4">
                  {activeData.polls.map((poll) => {
                    const normalized = mapToPollCard(poll);
                    return (
                      <article key={normalized.id} className="rounded-3xl border border-white/5 bg-gradient-to-br from-[#0b1227] to-[#0f1d3d] p-4 shadow-[0_25px_60px_rgba(3,7,18,0.6)]">
                        <PollCardPro poll={normalized} initialCounts={{}} />
                      </article>
                    );
                  })}

                  {activeData?.hasMore && (
                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        onClick={() => loadLeaf(activeLeaf.id, false)}
                        disabled={activeData.loading}
                        className="inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-100 hover:border-blue-300"
                      >
                        {activeData.loading ? "Loading…" : "Load more polls"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PollsPage() {
  const [search, setSearch] = useState("");
  const [openTopicId, setOpenTopicId] = useState<string | null>(null);
  const [stats, setStats] = useState<PollStats | null>(null);
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/poll/stats");
        if (!res.ok) {
          const text = await res.text();
          console.error("Failed to load stats:", res.status, text);
          if (!cancelled) {
            setStatsError(true);
          }
          return;
        }

        const data: PollStats = await res.json();
        if (!cancelled) {
          setStats(data);
          setStatsError(false);
        }
      } catch (err) {
        console.error("Error loading stats:", err);
        if (!cancelled) {
          setStatsError(true);
        }
      }
    };

    fetchStats();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTopics = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return POLL_TOPICS;
    return POLL_TOPICS.filter((topic) => `${topic.label} ${topic.description ?? ""}`.toLowerCase().includes(query));
  }, [search]);

  const openTopic = openTopicId ? (POLL_TOPICS.find((topic) => topic.id === openTopicId) ?? null) : null;

  return (
    <main className="min-h-screen bg-[#050b1e] text-slate-100">
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="mb-8">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900/80 to-slate-950/90 p-6 shadow-[0_35px_120px_rgba(5,10,35,0.65)] md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">Rider intelligence</p>
                  <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">Party Bus Polls</h1>
                </div>
                <p className="text-sm leading-relaxed text-white/75 md:text-base">
                  Real riders share what matters most&mdash;pricing, safety, vibes, accessibility, and rules. Tap into the nation&apos;s largest party bus panel,
                  vote on new questions, and watch results shift in real time.
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-white/60">
                  <span>{(stats?.totalPolls ?? 0).toLocaleString()} polls live</span>
                  <span>{(stats?.totalVotes ?? 0).toLocaleString()} total votes</span>
                  {stats?.lastVoteAt ? <span>Last vote: {new Date(stats.lastVoteAt).toLocaleString()}</span> : <span>Last vote: tracking…</span>}
                </div>
                {statsError && (
                  <p className="text-xs text-slate-500 mt-2">Stats temporarily unavailable.</p>
                )}
              </div>
              <div className="w-full max-w-sm">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Search polls</label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-blue-300/70">🔎</span>
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search regions, vehicles, events..."
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/70 pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>
                <p className="mt-2 text-[11px] text-white/50">{filteredTopics.length.toLocaleString()} topic{filteredTopics.length === 1 ? "" : "s"} match</p>
              </div>
            </div>
          </div>
        </div>

        {filteredTopics.length === 0 ? (
          <div className="py-12 text-center text-blue-200/85">No topics match that search yet. Try a different keyword.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {filteredTopics.map((topic) => {
              const leafCount = countLeafNodes(topic);
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setOpenTopicId(topic.id)}
                  className="relative overflow-hidden rounded-2xl border border-blue-800/40 bg-gradient-to-br from-[#081532] via-[#071129] to-[#050b1f] p-4 text-left shadow-[0_20px_50px_rgba(3,7,18,0.85)] hover:-translate-y-0.5 hover:border-blue-400/60 transition"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-40" aria-hidden>
                    <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(86,156,255,0.45),_transparent_60%)]" />
                  </div>

                  <div className="relative flex flex-col gap-2">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.25em] text-blue-300/70">Topic</p>
                      <h2 className="mt-1 text-base font-semibold text-white">{topic.label}</h2>
                    </div>
                    <p className="text-[13px] leading-snug text-blue-100/85 line-clamp-3">{topic.description}</p>
                    <div className="mt-3 inline-flex items-center justify-between text-[11px] text-blue-200/80">
                      <span>{leafCount.toLocaleString()} subtopic{leafCount === 1 ? "" : "s"}</span>
                      <span className="rounded-full bg-blue-500/15 px-2 py-1 text-[11px] text-blue-200">Open polls →</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <TopicModal topic={openTopic} open={Boolean(openTopic)} onClose={() => setOpenTopicId(null)} />
    </main>
  );
}

