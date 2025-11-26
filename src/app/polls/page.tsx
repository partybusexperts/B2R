
export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from 'react';
import HeroHeaderServer from "../../components/HeroHeaderServer";
import HomePollsSection from "../../components/polls/HomePollsSection";
import PollsClient from "./PollsClient";
import { getHeroFallback } from "../../data/heroFallbacks";

export default function PollsPage() {
  return (
    <main className="text-white bg-[#0f1f46] min-h-screen">
      <HeroHeaderServer pageSlug="polls" fallback={getHeroFallback("polls")} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold">All Polls</h1>
        <p className="mt-2 text-white/70">Full polls directory coming soon.</p>
      </div>

      <PollsClient />

      <HomePollsSection />
    </main>
  );
}




