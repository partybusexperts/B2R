import React from "react";
import { getFaqsForPage } from "@/lib/server/faqs";
import FaqSearchClient from "@/components/faqs/FaqSearchClient";

export default async function EventsFaqSection() {
  const faqs = await getFaqsForPage("events", 80);

  if (!faqs.length) {
    return null;
  }

  return (
    <section className="mt-16 border-t border-white/5 bg-[#0b1d3d]/70 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">Event Planning FAQ</p>
          <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Answers for every occasion</h2>
          <p className="mt-4 text-base text-white/70">
            These curated questions come straight from Supabase and cover timelines, policies, pricing, and rider etiquette for weddings, proms, festivals, corporate events, and more.
          </p>
        </div>

        <FaqSearchClient
          faqs={faqs.slice(0, 60)}
          searchInputId="events-faq-search"
          searchLabel="Search the events FAQ"
          searchPlaceholder='Try "wedding shuttle", "prom", "after-parties"…'
        />
      </div>
    </section>
  );
}
