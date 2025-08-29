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

export default function HomePolls({ groups }: { groups: { tag: string; label?: string }[] }) {
  const [data, setData] = useState<PollsPayload | null>(null);

  useEffect(() => {
    let alive = true;
    fetchAll().then(d => { if (alive) setData(d); }).catch(() => {});
    return () => { alive = false; };
  }, []);

  const groupsPicked = useMemo(() => {
    if (!data) return [] as { label?: string; items: { poll: Poll; counts: Record<string, number> }[] }[];
    const all = data.polls.filter(p => p.active !== false);
    return groups.map(g => {
      const pool = all.filter(p => (p.tags || []).map(t => t.toLowerCase()).includes(g.tag.toLowerCase()));
      const picks = sampleArray(pool, 4).map(p => ({ poll: p, counts: data.votes[p.id] || {} }));
      return { label: g.label || g.tag, items: picks };
    });
  }, [data, groups]);

  if (!data) {
    return <div className="text-center text-blue-200/80 py-6">Loading polls…</div>;
  }

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
          </div>
        ))}
      </div>
    </div>
  );
}
