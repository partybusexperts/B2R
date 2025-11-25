import React from "react";
import { Metadata } from "next";
import { getFaqsForPage } from "@/lib/server/faqs";

const FAQ_GROUPS = [
  { slug: "home", title: "Homepage" },
  { slug: "party-buses", title: "Party Bus Fleet" },
  { slug: "limousines", title: "Limousine Fleet" },
  { slug: "coach-buses", title: "Coach Bus Fleet" },
  { slug: "events", title: "Events" },
  { slug: "pricing", title: "Pricing" },
  { slug: "locations", title: "Locations" },
  { slug: "polls", title: "Polls" },
  { slug: "blog", title: "Blog" },
  { slug: "tools", title: "Tools" },
  { slug: "industry-secrets", title: "Industry Secrets" },
  { slug: "poll-results", title: "Poll Results" },
  { slug: "reviews", title: "Reviews" },
  { slug: "contact", title: "Contact" },
];

export const metadata: Metadata = {
  title: "Bus2Ride FAQs",
  description: "All of the most common Bus2Ride questions in one place—spanning booking, pricing, locations, polls, reviews, and more.",
};

export default async function FaqPage() {
  const sections = await Promise.all(
    FAQ_GROUPS.map(async (group) => ({
      ...group,
      faqs: await getFaqsForPage(group.slug, 200),
    }))
  );

  const hasFaqs = sections.some((section) => section.faqs.length);

  return (
    <main className="px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-200">FAQ Library</p>
        <h1 className="mt-2 text-4xl font-serif font-bold text-white">Frequently Asked Questions</h1>
        <p className="mt-4 text-white/70">
          Browse every question our riders ask most—from pricing, policies, and safety to polls, reviews, and special events. Use your browser search (Ctrl+F) to
          jump straight to what you need while we finish the full FAQ search experience here.
        </p>

        {!hasFaqs && (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-white/70">
            No FAQs are available yet. Check back soon.
          </div>
        )}

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.slug} id={section.slug}>
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
                <span className="text-sm text-white/50">{section.faqs.length} entries</span>
              </div>

              {!section.faqs.length && (
                <p className="mt-4 text-white/60">No questions yet—coming soon.</p>
              )}

              <div className="mt-6 space-y-3">
                {section.faqs.map((faq) => (
                  <details key={faq.id} className="rounded-2xl border border-white/10 bg-white/5">
                    <summary className="cursor-pointer list-none px-5 py-4 text-lg font-semibold text-white">
                      {faq.question}
                    </summary>
                    <div className="px-5 pb-5 text-white/80">{faq.answer}</div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
