"use client";

import React, { useEffect, useMemo, useState } from "react";
import { PollCard } from "./PollsSection";

type Poll = {
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
  const r = await fetch("/api/poll", { cache: "no-store" });
  if (!r.ok) throw new Error("Failed to load polls");
  return r.json();
}

function sampleArray<T>(arr: T[], n: number) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

export default function HomePolls({ groups }: { groups?: { tag: string; label?: string }[] }) {
  const [data, setData] = useState<PollsPayload | null>(null);

  useEffect(() => {
    let alive = true;
    fetchAll().then(d => { if (alive) setData(d); }).catch(() => {});
    return () => { alive = false; };
  }, []);

  const groupsPicked = useMemo(() => {
    if (!data) return [] as { label?: string; tag: string; items: { poll: Poll; counts: Record<string, number> }[] }[];
    const all = data.polls.filter(p => p.active !== false);

    // If explicit groups provided, use them (backwards compatibility)
    if (groups && groups.length) {
      return groups.map(g => {
        const pool = all.filter(p => (p.tags || []).map(t => t.toLowerCase()).includes(g.tag.toLowerCase()));
        const picks = sampleArray(pool, 8).map(p => ({ poll: p, counts: data.votes[p.id] || {} }));
        return { label: g.label || g.tag, tag: g.tag, items: picks };
      });
    }

    // Build tag counts
    const tagCount = new Map<string, number>();
    all.forEach(p => {
      (p.tags || []).forEach(t => tagCount.set(t, (tagCount.get(t) || 0) + 1));
    });

    // Candidate tags with at least 8 polls
  const candidates = Array.from(tagCount.keys()).filter(tag => (tagCount.get(tag) || 0) >= 8);
  // Fallback: tags with >=4 if not enough
  const fallback = Array.from(tagCount.keys()).filter(tag => (tagCount.get(tag) || 0) >= 4);

    let chosenTags: string[] = [];
    const poolTags = candidates.length >= 3 ? candidates : (candidates.concat(fallback)).filter(Boolean);
    // unique shuffle
    const shuffledTags = sampleArray(poolTags, poolTags.length);
    chosenTags = shuffledTags.slice(0, 3);
    // If still less than 3, pad with any tags
    if (chosenTags.length < 3) {
      const anyTags = Array.from(tagCount.keys()).filter(t => !chosenTags.includes(t));
      chosenTags = chosenTags.concat(sampleArray(anyTags, Math.max(0, 3 - chosenTags.length))).slice(0, 3);
    }

    return chosenTags.map(t => {
      const pool = all.filter(p => (p.tags || []).map(x => x.toLowerCase()).includes(t.toLowerCase()));
      const picks = sampleArray(pool, 8).map(p => ({ poll: p, counts: data.votes[p.id] || {} }));
      return { label: t, tag: t, items: picks };
    });
  }, [data, groups]);

  if (!data) return <div className="text-center text-blue-200/80 py-6">Loading polls…</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {groupsPicked.map((g, gi) => (
          <div key={gi}>
            <h3 className="text-xl font-bold text-blue-50 mb-4">{g.label}</h3>
            <div className="grid grid-cols-1 gap-4">
              {g.items.map(({ poll, counts }) => (
                <PollCard key={poll.id} poll={poll} initialCounts={counts} />
              ))}
            </div>
            <div className="mt-4 text-center">
              <a href={`/polls?tag=${encodeURIComponent(g.tag)}`} className="inline-block px-4 py-2 rounded-full bg-white text-blue-900 font-semibold hover:bg-blue-50">More polls</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
