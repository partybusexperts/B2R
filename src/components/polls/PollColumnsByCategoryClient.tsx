"use client";
import React, { useEffect, useState } from "react";
import PollInlineCard from "./PollInlineCard";
import type { HomePollColumn } from "../../lib/home-polls";

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PollColumnsByCategoryClient({ columns }: { columns: HomePollColumn[] }) {
  const [cols, setCols] = useState(columns);

  useEffect(() => {
    // Shuffle items within each category so the visible few aren’t always the same
    setCols(columns.map(c => ({ ...c, items: shuffle(c.items) })));
  }, [columns]);

  if (!cols.length) return null;

  return (
    <>
      {cols.map((col) => (
        <div key={col.key} className="space-y-3">
          {/* Header row: bigger category title + scroll cue */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl md:text-2xl font-semibold">{col.title}</h3>
            <span
              className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white/80"
              aria-hidden
              title="Scroll this column to see more polls"
            >
              Scroll for more ↓
            </span>
          </div>

          {/* Scrollable column */}
          <div
            className="relative rounded-xl border border-white/10 bg-white/5 p-2"
            aria-label={`${col.title} polls (scroll to see more)`}
          >
            <div className="max-h-[680px] overflow-y-auto pr-2 space-y-4 scrollable">
              {col.items.map(p => (
                <PollInlineCard key={p.id} pollId={p.id} slug={p.slug} question={p.question} />
              ))}
            </div>

            {/* Bottom gradient hint */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/35 to-transparent rounded-b-xl" />
          </div>
        </div>
      ))}
    </>
  );
}
