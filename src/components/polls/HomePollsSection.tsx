import React from "react";
import { getHomepagePollColumns } from "@/lib/server/home-polls";
import Link from "next/link";
import PollInlineCard from "@/components/polls/PollInlineCard";

export const dynamic = "force-dynamic";
export const revalidate = 0; // while testing

export default async function HomePollsSection() {
  const columns = await getHomepagePollColumns(3, 50);

  return (
    <section className="w-full border-t border-white/5 bg-gradient-to-b from-[#08152D] to-[#071328]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">Community Polls</h2>
          <Link
            href="/polls"
            className="text-sm text-sky-300 hover:text-sky-200 underline underline-offset-4"
          >
            Browse all polls →
          </Link>
        </div>

        {columns.length === 0 || columns.every(c => c.polls.length === 0) ? (
          <p className="text-white/60 text-sm">
            No polls found. (If this persists, check table name/columns and RLS.)
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {columns.map((col) => (
              <div
                key={col.topic.slug}
                className="rounded-2xl bg-white/6 ring-1 ring-white/10 shadow-sm text-white"
              >
                <div className="px-4 py-3 border-b border-white/10">
                  <h3 className="font-semibold">{col.topic.name}</h3>
                  <p className="text-xs text-white/60">{col.polls.length} polls</p>
                </div>

                <div className="max-h-[420px] overflow-y-auto thin-scrollbar px-3 py-3">
                  <ol className="space-y-2 text-[14px]">
                    {col.polls.map((p, i) => {
                      const idx = i;

                      // ---------- helpers (self-contained) ----------
                      // Minimal safe searchForOptions helper so the page won't crash while debugging.
                      function searchForOptions(obj: any): any[] {
                        if (!obj) return [];
                        if (Array.isArray(obj.options) && obj.options.length) return obj.options;
                        if (Array.isArray(obj.pollOptions) && obj.pollOptions.length) return obj.pollOptions;
                        // look for any array-valued property that looks like options
                        for (const k of Object.keys(obj)) {
                          const v = (obj as any)[k];
                          if (Array.isArray(v) && v.length && (typeof v[0] === 'object' || typeof v[0] === 'string')) return v;
                        }
                        return [];
                      }

                      // ---------- build poll prop ----------
                      console.log("[poll debug]", { idx, keys: Object.keys(p || {}), sample: p });
                      // First try: direct object p
                      const options = searchForOptions(p);

                      return (
                        <li key={p.id ?? `${col.topic.slug}:${idx}`}>
                          <PollInlineCard pollId={p.id ?? null} slug={p.slug ?? null} question={p.question} />
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 text-right">
          <Link
            href="/polls"
            className="text-sm text-white/70 hover:text-white/90 underline underline-offset-4"
          >
            See more polls →
          </Link>
        </div>
      </div>
    </section>
  );
}
