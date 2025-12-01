"use client";

import React, { useState } from "react";

export type RoadmapTool = {
  key: string;
  name: string;
  eta: string;
  summary: string;
  bullets: string[];
};

export default function ToolsComingSoonGrid({ tools }: { tools: RoadmapTool[] }) {
  const [active, setActive] = useState<RoadmapTool | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <button
            key={tool.key}
            onClick={() => setActive(tool)}
            className="group rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
              <span>{tool.eta}</span>
              <span>Tap for intel</span>
            </div>
            <h3 className="mt-3 text-xl font-semibold text-white">{tool.name}</h3>
            <p className="mt-2 text-sm text-white/70 line-clamp-3">{tool.summary}</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80">
              <span aria-hidden>🚧</span>
              <span>Coming soon</span>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            aria-hidden
            onClick={() => setActive(null)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/15 bg-[#050b1a] p-6 shadow-[0_40px_120px_rgba(2,6,23,0.8)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">{active.eta}</p>
                <h3 className="mt-2 text-2xl font-bold text-white">{active.name}</h3>
                <p className="mt-3 text-sm text-white/80">{active.summary}</p>
              </div>
              <button
                onClick={() => setActive(null)}
                className="rounded-full border border-white/15 px-3 py-1 text-sm text-white/80 hover:bg-white/10"
                aria-label="Close tool details"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 space-y-2 text-sm text-white/85">
              {active.bullets.map((bullet) => (
                <div key={bullet} className="flex gap-3">
                  <span className="text-white/40" aria-hidden>
                    •
                  </span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                🚧 Build window {active.eta}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">
                💡 Drop requests via quote notes
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
