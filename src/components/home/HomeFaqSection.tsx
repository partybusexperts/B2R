import React from "react";
import { getFaqsForPage } from "@/lib/server/faqs";
import FaqSearchClient from "@/components/faqs/FaqSearchClient";

export default async function HomeFaqSection() {
  const faqs = await getFaqsForPage("home", 60);

  if (!faqs.length) {
    return null;
  }

  return (
    <section className="mt-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">Got questions?</p>
          <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Homepage FAQ</h2>
          <p className="mt-4 text-base text-white/70">
            Search across the 50 most common things riders ask before they book. Everything is curated directly from real conversations, so you get honest answers fast.
          </p>
        </div>

        <FaqSearchClient faqs={faqs.slice(0, 50)} />
      </div>
    </section>
  );
}
