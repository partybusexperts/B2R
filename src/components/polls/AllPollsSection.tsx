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
    <section className="bg-[#030817] py-14 text-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="rounded-[40px] border border-white/10 bg-gradient-to-b from-[#08112a] via-[#050c1b] to-[#04060f] px-6 py-10 shadow-[0_60px_160px_rgba(0,0,0,0.6)] md:px-12">
          <header className="text-center space-y-3 mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-white/50">
              The Poll Observatory
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold">
              Explore every poll category
            </h2>
            <p className="mx-auto max-w-3xl text-sm md:text-base text-white/70">
              {unique.length.toLocaleString()}+ categories pulled straight
              from our Supabase firehose. Tap a category to drill down. For now,
              this page is your master index of everything.
            </p>
          </header>
          <CategoriesExplorer categories={unique} />
        </div>
      </div>
    </section>
  );
}
