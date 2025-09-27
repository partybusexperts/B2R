
export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from 'react';
import HomePollsSection from "../../components/polls/HomePollsSection";
import PollsClient from "./PollsClient";

export default function PollsPage() {
  return (
    <main className="min-h-[60vh] bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold">All Polls</h1>
        <p className="mt-2 text-white/70">Full polls directory coming soon.</p>
      </div>

      {/* Client wrapper for interactive UI (hooks, filters, etc.) */}
      <PollsClient />

      {/* Server-rendered section showing homepage polls */}
      <HomePollsSection />
    </main>
  );
}




