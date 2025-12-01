"use client";

import React, { useEffect, useState } from "react";
import PollCardPro from "../components/PollCardPro";
import PollInlineCard from "./polls/PollInlineCard";

type Poll = { id: string; question: string; options: string[]; tags?: string[]; active?: boolean; };
type PollsPayload = { polls: Poll[]; votes: Record<string, Record<string, number>>; };

async function fetchAll(): Promise<PollsPayload> {
  const r = await fetch("/api/poll/all", { cache: "force-cache" });
  if (!r.ok) throw new Error("Failed to load polls");
  const body = await r.json();
  const polls = Array.isArray(body.polls) ? (body.polls as Poll[]) : [];
  const ids = polls.slice(0, 24).map((p) => p.id);
  let votes: Record<string, Record<string, number>> = {};
  if (ids.length) {
    try {
      const br = await fetch('/api/poll/results/bulk', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids }) });
      if (br.ok) {
        const j = await br.json();
        votes = j && j.data ? j.data : {};
      }
    } catch {
      votes = {};
    }
  }
  return { polls, votes };
}

// NOTE: randomness MUST only run on the client after hydration to avoid SSR/client markup mismatch.
const shuffle = <T,>(arr: T[]) => { const c = [...arr]; for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; } return c; };
const sample = <T,>(arr: T[], n: number) => shuffle(arr).slice(0, n);

// Small helper: ensure labels are human-friendly and title-cased like the polls page
function formatLabel(label?: string) {
  if (!label) return "";
  return String(label)
    .replace(/[-_]/g, " ")
    .split(" ")
    .map(s => s.length ? s[0].toUpperCase() + s.slice(1).toLowerCase() : "")
    .join(" ");
}

type HomePollGroup = { tag: string; label?: string };

type HomePollsProps = {
  groups?: HomePollGroup[];
  pickSize?: number;
  visiblePerGroup?: number;
  innerScroll?: boolean;
  innerScrollClass?: string;
  variant?: "grid" | "columns";
};

export default function HomePolls({
  groups,
  pickSize = 8,
  visiblePerGroup = 3,
  innerScroll = false,
  innerScrollClass,
  variant = "grid",
}: HomePollsProps) {
  const [data, setData] = useState<PollsPayload | null>(null);
  const [groupsPicked, setGroupsPicked] = useState<({ label?: string; tag: string; items: { poll: Poll; counts: Record<string, number> }[] }[]) | null>(null);

  // Fetch polls (client-side). Initial server render will show a loading placeholder which keeps SSR vs client deterministic.
  useEffect(() => {
    let alive = true;
    fetchAll().then(d => { if (alive) setData(d); }).catch(() => {});
    return () => { alive = false; };
  }, []);

  // After data is available on the client, compute picks and persist to sessionStorage. All randomness happens here.
  useEffect(() => {
    if (!data) return;

    const all = data.polls.filter(p => p.active !== false);
    const usedIds = new Set<string>();

    const fromSession = (tag: string) => {
      try {
        const s = sessionStorage.getItem(`b2r_home_featured_${tag}`) || "[]";
        return JSON.parse(s) as string[];
      } catch {
        return [];
      }
    };
    const toSession = (tag: string, ids: string[]) => {
      try {
        sessionStorage.setItem(`b2r_home_featured_${tag}`, JSON.stringify(ids));
      } catch {
        // ignore session write failures
      }
    };

    const build = (tag: string, label?: string) => {
      const pool = all.filter(p => (p.tags || []).map(t => t.toLowerCase()).includes(tag.toLowerCase()) && !usedIds.has(p.id));
      let picks: Poll[] = [];
      const prev = fromSession(tag);
      if (prev.length) {
        const map = new Map(pool.map(p => [p.id, p]));
        picks = prev.map(id => map.get(id)).filter(Boolean) as Poll[];
      }
      if (picks.length < pickSize) {
        picks = picks.concat(sample(pool.filter(p => !picks.find(x => x.id === p.id)), pickSize - picks.length));
        toSession(tag, picks.map(p => p.id));
      }
      picks.forEach(p => usedIds.add(p.id));
      return {
        label: label || tag,
        tag,
        items: picks.map(p => ({ poll: p, counts: data.votes[p.id] || {} }))
      };
    };

    const assemble = (collection?: HomePollGroup[]) => {
      if (collection && collection.length) {
        return collection
          .map((g) => build(g.tag, g.label))
          .filter((entry) => entry.items.length);
      }

      const tagCount = new Map<string, number>();
      all.forEach((p) => (p.tags || []).forEach((t) => tagCount.set(t, (tagCount.get(t) || 0) + 1)));
      const sorted = Array.from(tagCount.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([t]) => t);
      const chosen = sorted.slice(0, 3);
      return chosen.map((t) => build(t, t)).filter((entry) => entry.items.length);
    };

    let out = assemble(groups);
    if (!out.length) {
      out = assemble();
    } else if (variant === "columns") {
      const target = 3;
      if (out.length < target) {
        const fallback = assemble();
        const seen = new Set(out.map((entry) => entry.tag.toLowerCase()));
        for (const entry of fallback) {
          if (out.length >= target) break;
          if (seen.has(entry.tag.toLowerCase())) continue;
          out.push(entry);
          seen.add(entry.tag.toLowerCase());
        }
        if (out.length < target && !fallback.length) {
          out = assemble();
        }
      }
    }

    setGroupsPicked(out);
  }, [data, groups, pickSize]);

  if (!data || groupsPicked === null) return <div className="text-center text-blue-200/80 py-6">Loading polls</div>;
  if (!groupsPicked.length) return <div className="text-center text-blue-200/80 py-6">No polls available right now.</div>;

  if (variant === "columns") {
    return (
      <div suppressHydrationWarning className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {groupsPicked.map((g, gi) => (
          <div key={gi} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl md:text-2xl font-semibold text-white">{formatLabel(g.label)}</h3>
              <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white/80" aria-hidden>
                Scroll for more ↓
              </span>
            </div>
            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-2">
              <div className="max-h-[640px] overflow-y-auto pr-2 space-y-3">
                {g.items.map(({ poll }) => (
                  <PollInlineCard key={poll.id} pollId={poll.id} question={poll.question} slug={poll.slug}
                  />
                ))}
              </div>
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 rounded-b-2xl bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div className="text-center">
              <a
                href={`/polls?tag=${encodeURIComponent(g.tag)}`}
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:border-white/40"
              >
                More polls
              </a>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {groupsPicked.map((g, gi) => (
          <div key={gi}>
            <h3 className="text-xl font-bold text-blue-50 mb-4">{formatLabel(g.label)}</h3>
            <div className="grid grid-cols-1 gap-4">
              {innerScroll ? (
                <div className={innerScrollClass || "max-h-[60vh] overflow-y-auto no-scrollbar p-1 -mr-2"}>
                  {g.items.slice(0, visiblePerGroup).map(({ poll, counts }) => (
                    <PollCardPro key={poll.id} poll={poll} initialCounts={counts} />
                  ))}
                </div>
              ) : (
                g.items.slice(0, visiblePerGroup).map(({ poll, counts }) => (
                  <PollCardPro key={poll.id} poll={poll} initialCounts={counts} />
                ))
              )}
            </div>
            {g.items.length > visiblePerGroup && (
              <div className="mt-4">
                <div className="text-blue-200 text-sm mb-2">More in {g.label}</div>
                <div className="overflow-x-auto no-scrollbar">
                  <div className="flex gap-4 min-w-max">
                    {g.items.slice(visiblePerGroup).map(({ poll, counts }) => (
                      <div key={poll.id} className="min-w-[320px] max-w-[360px]">
                        <PollCardPro poll={poll} initialCounts={counts} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="mt-4 text-center">
              <a
                href={`/polls?tag=${encodeURIComponent(g.tag)}`}
                className="inline-block px-4 py-2 rounded-full bg-white text-blue-900 font-semibold hover:bg-blue-50"
              >
                More polls
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
