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
    // Shuffle each column's items independently (keeps categories intact)
    const next = columns.map(c => ({ ...c, items: shuffle(c.items) }));
    console.log("[polls-client] categories=", next.map(c => c.key));
    setCols(next);
  }, [columns]);

  if (!cols.length) return null;

  return (
    <>
      {cols.map((col) => (
        <div key={col.key} className="space-y-4">
          <h3 className="text-lg font-semibold">{col.title}</h3>
          {col.items.map(p => (
            <PollInlineCard key={p.id} pollId={p.id} slug={p.slug} question={p.question} />
          ))}
        </div>
      ))}
    </>
  );
}
