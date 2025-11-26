"use client";

import React, { useEffect, useState } from "react";
import type { HomePollColumn } from "@/lib/home-polls";
import PollInlineCard from "@/components/polls/PollInlineCard";

function shuffle<T>(arr: T[]) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function PricingPollColumnsClient({ columns }: { columns: HomePollColumn[] }) {
  const [cols, setCols] = useState(columns);

  useEffect(() => {
    setCols(columns.map((col) => ({ ...col, items: shuffle(col.items) })));
  }, [columns]);

  if (!cols.length) return null;

  const [primary, ...rest] = cols;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      {primary ? (
        <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-blue-800/40 via-blue-900/40 to-indigo-900/40 shadow-[0_25px_60px_rgba(4,11,25,0.55)]">
          <header className="flex flex-col gap-2 border-b border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">Pricing spotlight</p>
              <h3 className="text-2xl font-semibold text-white">{primary.title}</h3>
            </div>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] text-white/80" aria-hidden>
              Scroll for more ↓
            </span>
          </header>
          <div className="max-h-[780px] overflow-y-auto px-4 py-5 space-y-4">
            {primary.items.map((poll) => (
              <PollInlineCard key={poll.id} pollId={poll.id} slug={poll.slug} question={poll.question} />
            ))}
          </div>
          <div className="flex justify-end border-t border-white/10 px-6 py-4">
            <a
              href={`/polls?tag=${encodeURIComponent(primary.key)}`}
              className="inline-flex items-center gap-1 rounded-full border border-white/30 px-4 py-1.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              More {primary.title}
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      ) : null}

      <div className="space-y-6">
        {rest.map((column) => (
          <div
            key={column.key}
            className="rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_40px_rgba(4,11,25,0.4)]"
          >
            <header className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-4">
              <h4 className="text-lg font-semibold text-white/90">{column.title}</h4>
              <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.3em] text-white/60" aria-hidden>
                Scroll ↓
              </span>
            </header>
            <div className="max-h-[420px] overflow-y-auto px-4 py-4 space-y-3">
              {column.items.map((poll) => (
                <PollInlineCard key={poll.id} pollId={poll.id} slug={poll.slug} question={poll.question} />
              ))}
            </div>
            <div className="flex justify-end border-t border-white/5 px-4 py-3">
              <a
                href={`/polls?tag=${encodeURIComponent(column.key)}`}
                className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/80 hover:bg-white/10"
              >
                More polls
                <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
