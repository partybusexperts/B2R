"use client";

import * as React from "react";
import { PollCard } from "./poll-card";
import type { PollWithOptions } from "@/lib/data/polls";

export function PollsColumnsClient({
  columns,
}: {
  columns: PollWithOptions[][];
}) {
  const columnRefs = React.useRef<Array<HTMLDivElement | null>>([]);

  const scrollToNext = React.useCallback(
    (columnIndex: number, pollIndex: number) => {
      const container = columnRefs.current[columnIndex];
      if (!container) return;

      const current = container.querySelector<HTMLElement>(
        `[data-poll-index="${pollIndex}"]`,
      );
      const next = current?.nextElementSibling as HTMLElement | null;
      if (!next) return;

      // Scroll ONLY the column container (avoid scrolling the whole page).
      // Use bounding rect math so we scroll to the *next poll* accurately.
      const containerRect = container.getBoundingClientRect();
      const nextRect = next.getBoundingClientRect();
      const delta = nextRect.top - containerRect.top;
      const targetTop = container.scrollTop + delta;
      container.scrollTo({ top: targetTop, behavior: "smooth" });
    },
    [],
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-6">
      {columns.map((col, colIdx) => (
        <div
          key={colIdx}
          ref={(el) => {
            columnRefs.current[colIdx] = el;
          }}
          className="h-[450px] overflow-y-auto snap-y snap-mandatory rounded-3xl
            border border-white/10 bg-white/5"
        >
          {col.map((poll, idx) => (
            <div
              key={`${poll.id}-${idx}`}
              data-poll-index={idx}
              className="h-[450px] snap-start snap-always p-4"
            >
              <PollCard
                poll={poll}
                advanceDelayMs={2000}
                onAdvance={() => scrollToNext(colIdx, idx)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
