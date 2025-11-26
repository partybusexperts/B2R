import React from "react";
import { getPartyBusPollColumns } from "../../lib/home-polls";
import PollColumnsByCategoryClient from "./PollColumnsByCategoryClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PartyBusPollsSection() {
  const columns = await getPartyBusPollColumns({ numColumns: 3, perColumn: 45 });

  if (!columns.length) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#0d1f46] to-[#070f26] px-6 py-10 text-white shadow-2xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">Party Bus Insights</p>
          <h2 className="mt-3 text-4xl font-extrabold">Party Bus Polls &amp; Rider Debates</h2>
          <p className="mt-3 text-blue-100/80 max-w-3xl mx-auto">
            The left column is locked to party bus polls, refreshed straight from Supabase. Scroll each column to see more votes submitted by riders planning
            nightlife loops, bachelor/ette hops, and club transfers.
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <PollColumnsByCategoryClient columns={columns} />
        </div>

        <div className="mt-10 text-center">
          <a
            href="/polls?tag=party-bus"
            className="inline-flex items-center justify-center rounded-full bg-white/95 px-7 py-3 text-sm font-semibold text-[#04132d] shadow-[0_15px_40px_rgba(10,27,54,0.35)] transition hover:translate-y-0.5 hover:bg-white"
          >
            Browse the full poll library
          </a>
        </div>
      </div>
    </section>
  );
}
