"use client";
import React, { useEffect, useState } from "react";
import PollInlineCard from "./PollInlineCard";

type Poll = { id: string; slug: string; question: string };

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PollColumnsClient({ columns }: { columns: Poll[][] }) {
  const flat = columns.flat();
  const [cols, setCols] = useState(columns);

  useEffect(() => {
    if (!flat.length) return;
    const s = shuffle(flat);
    const perCol = columns[0]?.length ?? 0;
    const next: Poll[][] = [];
    for (let i = 0; i < columns.length; i++) next.push(s.slice(i * perCol, (i + 1) * perCol));
    console.log("[polls-client] shuffled sampleIds=", s.slice(0,6).map(p=>p.id));
    setCols(next);
  }, []); // once on mount

  if (!flat.length) return null;

  return (
    <>
      {cols.map((col, i) => (
        <div key={i} className="space-y-4">
          {col.map(p => (
            <PollInlineCard key={p.id} pollId={p.id} slug={p.slug} question={p.question} />
          ))}
        </div>
      ))}
    </>
  );
}
