import React from "react";
import { getLimousinePollColumns } from "@/lib/home-polls";
import PollColumnsByCategoryClient from "./PollColumnsByCategoryClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LimoPollsSection() {
  const columns = await getLimousinePollColumns({ numColumns: 3, perColumn: 45 });

  if (!columns.length) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#0d1f46] to-[#070f26] px-6 py-10 text-white shadow-2xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">Limousine Insights</p>
          <h2 className="mt-3 text-4xl font-extrabold">Limousine Polls &amp; Rider Debates</h2>
          <p className="mt-3 text-blue-100/80 max-w-3xl mx-auto">
            The first column pulls limo-focused votes direct from Supabase. Scroll through all three columns to compare what riders prioritize for weddings, proms,
            black car transfers, and photo-ready arrivals.
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <PollColumnsByCategoryClient columns={columns} />
        </div>

        <div className="mt-10 text-center">
          <a
            href="/polls?tag=limousine"
            className="inline-flex items-center justify-center rounded-full bg-white/95 px-7 py-3 text-sm font-semibold text-[#04132d] shadow-[0_15px_40px_rgba(10,27,54,0.35)] transition hover:translate-y-0.5 hover:bg-white"
          >
            Browse all limo polls
          </a>
        </div>
      </div>
    </section>
  );
}
