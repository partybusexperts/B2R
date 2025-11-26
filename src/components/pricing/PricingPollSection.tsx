import React from "react";
import { getPricingPollColumns } from "@/lib/home-polls";
import PollColumnsByCategoryClient from "@/components/polls/PollColumnsByCategoryClient";

export default async function PricingPollSection() {
  const columns = await getPricingPollColumns({ numColumns: 3, perColumn: 60 });

  if (!columns.length) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20">
      <div className="rounded-[32px] border border-white/10 bg-gradient-to-b from-[#020817] via-[#050f25] to-[#020817] px-6 py-10 text-white shadow-[0_35px_80px_rgba(3,8,20,0.7)] md:px-12">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-white/60">Live rider data</p>
          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Pricing Polls &amp; Budget Benchmarks</h2>
          <p className="mx-auto mt-4 max-w-3xl text-base text-white/75 md:text-lg">
            Same layout you see on home, fleet, and events pages—just filtered down to pricing keywords. Scroll each column
            to see how riders plan deposits, split tips, and upgrade without blowing the budget.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <PollColumnsByCategoryClient columns={columns} />
        </div>

        <div className="mt-12 text-center">
          <a
            href="/polls?tag=pricing"
            className="inline-flex items-center justify-center rounded-full bg-white/95 px-7 py-3 text-sm font-semibold text-[#04112b] shadow-[0_15px_45px_rgba(5,15,35,0.4)] transition hover:translate-y-0.5 hover:bg-white"
          >
            Browse the full pricing poll library
          </a>
        </div>
      </div>
    </section>
  );
}
