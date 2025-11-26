import React from "react";
import { getFaqsForPage } from "@/lib/server/faqs";
import FaqSearchClient from "@/components/faqs/FaqSearchClient";

export default async function PricingFaqSection() {
  const faqs = await getFaqsForPage("pricing", 150);

  if (!faqs.length) {
    return null;
  }

  return (
    <section className="bg-[#050f25] py-16 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#101f42] via-[#0a1733] to-[#050c1f] px-6 py-10 shadow-[0_35px_70px_rgba(4,10,26,0.65)] md:px-10">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-white/60">Pricing FAQ</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
              Search every cost question right at the top
            </h2>
            <p className="mt-4 text-base text-white/75 md:text-lg">
              Supabase keeps this list synced nightly so the same set of pricing questions that used to live in the old hero search
              are still here—just richer. Type a keyword to slice through deposits, hourly minimums, fees, or how to split payments with friends.
            </p>
          </div>

          <div className="mt-10">
            <FaqSearchClient
              faqs={faqs.slice(0, 120)}
              searchInputId="pricing-faq-search"
              searchLabel="Search 100+ pricing answers"
              searchPlaceholder='Try "deposit", "fuel surcharge", "split payment"…'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
