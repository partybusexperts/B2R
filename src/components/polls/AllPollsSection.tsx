import React from "react";
import { createClient } from "../../lib/supabase/server";
import { CategoriesExplorer } from "./CategoriesExplorer";

export default async function AllPollsSection() {
  const supabase = createClient();
  // Batch fetch all rows in increments of 1,000
  let allRows: any[] = [];
  let batchSize = 1000;
  let offset = 0;
  let more = true;
  while (more) {
    const { data: batch, error } = await supabase
      .from("polls1")
      .select("*")
      .range(offset, offset + batchSize - 1);
    if (error) {
      console.error("Error fetching batch from polls1:", error);
      break;
    }
    if (batch && batch.length > 0) {
      allRows = allRows.concat(batch);
      offset += batchSize;
      if (batch.length < batchSize) {
        more = false;
      }
    } else {
      more = false;
    }
  }

  // Find popular polls (top 6 by votes)
  const pollsWithVotes = allRows.filter(row => typeof row.votes === 'number' && row.votes > 0);
  const popularPolls = pollsWithVotes
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 6);

  // Debug: show raw data count and sample
  if (typeof window === "undefined") {
    console.log("Total poll rows:", allRows.length);
    console.log("Sample rows:", allRows.slice(0, 10));
  }

  const categories = allRows
    .map((row: any) => row.category_slug as string)
    .filter(Boolean);

  const unique = Array.from(new Set(categories));
  unique.sort((a, b) => a.localeCompare(b));

  return (
    <section className="bg-gradient-to-b from-[#08112a] via-[#050c1b] to-[#04060f] py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="rounded-[40px] border border-white/10 bg-[#050c1b] px-6 py-12 shadow-[0_60px_160px_rgba(0,0,0,0.6)] md:px-12">
          <header className="text-center space-y-6 mb-12">
            <h1 className="text-5xl font-extrabold tracking-tight text-white mb-2">Poll Category Explorer</h1>
            <p className="mx-auto max-w-2xl text-lg text-white/80 font-medium">
              Instantly browse every poll category in our system. Discover insights, trends, and real rider decisions across cities, states, vehicles, events, and more. Use the search and filters to find what matters most to you.
            </p>
            <div className="mt-6 flex flex-col items-center gap-2">
              <span className="inline-block rounded-full bg-sky-500/20 px-4 py-2 text-base font-semibold text-sky-200 shadow">{unique.length.toLocaleString()} categories indexed</span>
              <span className="inline-block text-xs text-white/50">Updated live from our poll database</span>
            </div>
          </header>
          {/* Popular Polls Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-sky-300 mb-4 text-center">Popular Polls</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {popularPolls.map((poll) => (
                <div key={poll.id} className="rounded-2xl border-2 border-sky-500/30 bg-[#06122a] p-6 shadow-lg flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{poll.question}</h3>
                    <p className="text-sm text-white/70 mb-4">Category: <span className="font-bold text-sky-300">{poll.category_slug}</span></p>
                  </div>
                  <a href={`/polls/results?focus=${encodeURIComponent(poll.id)}`} className="mt-auto inline-block rounded-full bg-sky-500/80 px-4 py-2 text-white font-bold shadow hover:bg-sky-400 transition">See Results →</a>
                </div>
              ))}
            </div>
          </section>
          <CategoriesExplorer categories={unique} />
        </div>
      </div>
    </section>
  );
}
