
export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from "react";
import HeroHeaderServer from "../../components/HeroHeaderServer";
import { getHeroFallback } from "../../data/heroFallbacks";
import AllPollsSection from "@/components/polls/AllPollsSection";

export default function PollsPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-2">
        <div className="text-2xl font-bold text-slate-900">Polls Page Debug</div>
        <p className="text-sm text-slate-500">
          If you can see this, the core Next.js routing is fine.
        </p>
      </div>
    </main>
  );
}




