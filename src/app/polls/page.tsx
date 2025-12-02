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

function TopicModal({
  open,
  onClose,
  topicLabel,
  polls,
  votes,
}: {
  open: boolean;
  onClose: () => void;
  topicLabel: string;
  polls: Poll[];
  votes: VotesMap;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-md md:p-6" onClick={onClose}>
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-blue-500/40 bg-[#040921] shadow-[0_40px_120px_rgba(0,0,0,0.95)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
          <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(86,156,255,0.55),_transparent_65%)]" />
        </div>

        <div className="relative border-b border-blue-900/70 bg-gradient-to-r from-[#050b2a] via-[#050b2a] to-[#050b34] px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-blue-200/70">Topic</p>
              <h2 className="mt-1 text-sm font-semibold text-white md:text-lg">{topicLabel}</h2>
              <p className="mt-1 text-[11px] text-blue-200/80 md:text-xs">
                {polls.length} poll{polls.length === 1 ? "" : "s"} in this topic &bull; scroll to answer as many as you like.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-900/60 text-white hover:bg-blue-700"
              aria-label="Close topic"
            >
              &times;
            </button>
          </div>
        </div>

        <div className="relative max-h-[75vh] space-y-4 overflow-y-auto px-3 py-3 md:px-5 md:py-5">
          {polls.map((poll) => {
            const countsRaw = votes[poll.id];
            const initialCounts = countsRaw && typeof countsRaw === "object" ? countsRaw : {};

            return (
              <article
                key={poll.id}
                className="rounded-2xl border border-white/10 bg-[#070f2a]/95 p-3 shadow-[0_24px_60px_rgba(3,7,18,0.8)] md:p-4"
              >
                <PollCardPro poll={poll} initialCounts={initialCounts} />
              </article>
            );
          })}

          {!polls.length && <p className="py-10 text-center text-sm text-blue-200/85">No polls yet for this topic.</p>}
        </div>
      </div>
    </div>
  );
}

export default function PollsPage() {
  const [data, setData] = useState<PollsPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [openTag, setOpenTag] = useState<string | null>(null);

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
    if (tag) {
      setSearch(tag);
    }
  }, []);

  const polls = data?.polls ?? [];
  const votes = data?.votes ?? {};
  const loading = !data && !error;
  const hasError = Boolean(error);

  const activePolls = useMemo(() => polls.filter((p) => p.active !== false), [polls]);

  const tagMap = useMemo(() => {
    const map = new Map<string, Poll[]>();
    activePolls.forEach((p) => {
      const tags = (p.tags && p.tags.length ? p.tags : ["general"]) as string[];
      tags.forEach((raw) => {
        const tag = raw.toLowerCase();
        if (!map.has(tag)) map.set(tag, []);
        map.get(tag)!.push(p);
      });
    });
    return map;
  }, [activePolls]);

  const topics = useMemo(() => {
    const list: { tag: string; label: string; count: number; sampleQuestion: string }[] = [];
    for (const [tag, pollsForTag] of tagMap.entries()) {
      if (!pollsForTag.length) continue;
      const baseLabel = formatLabel(tag);
      const sample = pollsForTag[0]?.question || "";
      list.push({
        tag,
        label: `${baseLabel} polls`,
        count: pollsForTag.length,
        sampleQuestion: sample,
      });
    }
    list.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
    return list;
  }, [tagMap]);

  const filteredTopics = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter((t) => {
      const hay = `${t.label} ${t.sampleQuestion}`.toLowerCase();
      return hay.includes(q);
    });
  }, [topics, search]);

  const openTopicPolls = openTag && tagMap.has(openTag) ? tagMap.get(openTag)! : [];

  const openTopicLabel = openTag
    ? topics.find((t) => t.tag === openTag)?.label || `${formatLabel(openTag)} polls`
    : "Topic polls";

  return (
    <main className="min-h-screen bg-[#050b1e] text-slate-100">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="mb-6 md:mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">Live rider intel</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">Polls & rider opinions</h1>
          <p className="mt-3 max-w-3xl text-blue-200/85">
            Browse topic cards like <em>Vehicles polls</em>, <em>Pricing polls</em>, or <em>ADA polls</em>. Click any card and a dark modal opens with every poll in that
            topic so you can answer them rapid-fire.
          </p>
        </div>

        {hasError ? (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-red-100">{error}</div>
        ) : loading ? (
          <p className="text-blue-200/80">Loading polls&hellip;</p>
        ) : (
          <>
            <div className="mb-6 max-w-xl">
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-blue-300/70">&#128269;</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search topics by vehicle, city, event, BYOB, pricing, ADA, etc."
                  className="w-full rounded-full border border-blue-800/60 bg-[#050b26] px-9 py-2 text-sm text-blue-50 placeholder:text-blue-300/60 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                />
              </div>
              <p className="mt-1 text-[11px] text-blue-200/75">
                {filteredTopics.length.toLocaleString()} topic{filteredTopics.length === 1 ? "" : "s"} &bull; {activePolls.length.toLocaleString()} poll
                {activePolls.length === 1 ? "" : "s"} total
              </p>
            </div>

            {filteredTopics.length === 0 ? (
              <div className="py-12 text-center text-blue-200/85">No topics match that search yet. Try a different keyword.</div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
                {filteredTopics.map((topic) => (
                  <button
                    key={topic.tag}
                    type="button"
                    onClick={() => setOpenTag(topic.tag)}
                    className="group relative overflow-hidden rounded-2xl border border-blue-800/40 bg-gradient-to-br from-[#081532] via-[#071129] to-[#050b1f] p-4 text-left shadow-[0_20px_50px_rgba(3,7,18,0.85)] transition hover:-translate-y-0.5 hover:border-blue-400/60"
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-40" aria-hidden>
                      <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(86,156,255,0.45),_transparent_60%)]" />
                    </div>

                    <div className="relative flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-blue-300/70">Topic</p>
                        <h2 className="mt-1 text-base font-semibold text-white">{topic.label}</h2>
                        <p className="mt-1 text-[11px] text-blue-200/75">
                          {topic.count.toLocaleString()} poll{topic.count === 1 ? "" : "s"}
                        </p>
                      </div>
                      <div className="mt-1 inline-flex items-center justify-center rounded-full bg-blue-500/15 px-2.5 py-1 text-[11px] text-blue-200">
                        Open polls &rarr;
                      </div>
                    </div>

                    {topic.sampleQuestion && (
                      <p className="relative mt-3 line-clamp-3 text-[13px] leading-snug text-blue-100/90">&ldquo;{topic.sampleQuestion}&rdquo;</p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {!hasError && !loading && (
        <TopicModal
          open={Boolean(openTag)}
          onClose={() => setOpenTag(null)}
          topicLabel={openTopicLabel || "Topic polls"}
          polls={openTopicPolls}
          votes={votes}
        />
      )}
    </main>
  );
}
