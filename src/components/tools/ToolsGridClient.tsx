"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";

export type ToolLite = { slug: string; name: string };

export default function ToolsGridClient({ tools }: { tools: ToolLite[] }) {
  // Always render 12 tiles; pad if fewer
  const items = useMemo(() => {
    const padCount = Math.max(0, 12 - tools.length);
    const padded = [
      ...tools,
      ...Array.from({ length: padCount }, (_, i) => ({
        slug: `coming-soon-${i + 1}`,
        name: `Coming Soon ${i + 1}`,
      })),
    ];
    return padded.slice(0, 12);
  }, [tools]);

  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const active = items.find((t) => t.slug === openSlug) || null;

  const close = useCallback(() => setOpenSlug(null), []);

  // close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((t) => {
          const coming = t.slug.startsWith("coming-soon");
          return (
            <button
              key={t.slug}
              onClick={() => setOpenSlug(t.slug)}
              className="group rounded-2xl border border-white/10 bg-white/5 p-4 text-left hover:bg-white/10 transition focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center text-sm">
                  {emojiFor(t.slug)}
                </div>
                <div className="min-w-0">
                  <div className="font-medium truncate">{t.name}</div>
                  <div className="text-xs text-white/60 truncate">
                    {coming ? "Coming soon" : "Tap to learn more"}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Modal */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/60" onClick={close} />
          <div className="relative z-10 w-full sm:max-w-md sm:rounded-2xl sm:border sm:border-white/10 sm:bg-neutral-900 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-base">
                  {emojiFor(active.slug)}
                </div>
                <div className="font-semibold">{active.name}</div>
              </div>
              <button
                onClick={close}
                className="rounded-lg px-2 py-1 text-sm bg-white/10 hover:bg-white/15"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 text-sm leading-6 text-white/80">
              {modalCopy(active.slug, active.name)}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-xs rounded-full bg-white/10 px-2.5 py-1">
                🚧 Coming soon
              </span>
              <button
                onClick={close}
                className="rounded-xl bg-white/20 hover:bg-white/30 px-3 py-1.5 text-sm"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function emojiFor(slug: string) {
  if (slug.includes("airport")) return "✈️";
  if (slug.includes("map")) return "🗺️";
  if (slug.includes("trip") || slug.includes("travel")) return "🧭";
  if (slug.includes("event")) return "🎟️";
  if (slug.includes("weather")) return "🌤️";
  return "🛠️";
}

function modalCopy(slug: string, name: string) {
  if (slug.includes("airport")) {
    return (
      <>
        This tool will let you search airports by city, IATA/ICAO code, and
        view nearby routes and distance/time estimates. Integration planned
        with your polls for destination planning.
      </>
    );
  }
  return (
    <>
      <span className="font-medium">{name}</span> is in development. It will
      appear here as a guided tool with a simple form and real-time results.
      If you want to prioritize this tool, tell me its rough scope and we’ll
      wire it up to Supabase next.
    </>
  );
}
