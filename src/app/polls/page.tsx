
export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from "react";
import HeroHeaderServer from "../../components/HeroHeaderServer";
import { getHeroFallback } from "../../data/heroFallbacks";
import AllPollsSection from "@/components/polls/AllPollsSection";

export default function PollsPage() {
  return (
    <main className="min-h-screen bg-[#050f25] text-white">
      <HeroHeaderServer pageSlug="polls" fallback={getHeroFallback("polls")} />
      <AllPollsSection />
    </main>
  );
}




