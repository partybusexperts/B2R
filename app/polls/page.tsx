import { PollCard } from "@/components/sections/poll-card";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { EventsGrid } from "@/components/sections/events-grid";
import {
  getPolls,
  getPollsByCategory,
  getPollsBySearch,
} from "@/lib/data/polls";
import { getReviews } from "@/lib/data/reviews";
import FleetSection from "@/components/sections/fleet-section";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PollsSearchForm } from "@/components/sections/polls-search-form.client";
import { pageMetadata } from "@/lib/seo/metadata";
import { PollCategorySection } from "@/components/sections/poll-category-section";
import Locations from "@/lib/data/local/locations.json";

const cities = Locations.flatMap((loc) =>
  loc.cities.map((city) => city.toLowerCase()),
);

export const metadata = pageMetadata({
  title: "Community Polls",
  description:
    "Vote on real booking questions and see what riders prioritize — pricing, safety, accessibility, and party bus rules.",
  path: "/polls",
});

export default async function PollsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string | string[];
    category?: string | string[];
  }>;
}) {
  const sp = (await searchParams) ?? {};
  const qRaw = sp.q;
  const q = typeof qRaw === "string" ? qRaw : "";

  const categoryRaw = sp.category;
  const category = typeof categoryRaw === "string" ? categoryRaw : "";
  const normalizedCategory = category.trim();

  // const hasSearch = q.trim().length > 0 || normalizedCategory.length > 0;

  const pollSections = [
    { category: "party-bus", title: "Party Buses" },
    { category: "limo", title: "Limousines" },
    { category: "coach-bus", title: "Coach Buses" },
    { category: "pricing", title: "Pricing" },
    { category: "booking-experience", title: "Booking Experience" },
    { category: "booking-lead-times", title: "Booking Lead Times" },
    { category: "events", title: "Events" },
  ] as const;

  let polls = q.trim()
    ? ((await getPollsBySearch(q, 90)) ?? [])
    : normalizedCategory
      ? ((await getPollsByCategory(normalizedCategory, 150)) ?? [])
      : ((await getPolls(81)) ?? []);

  // Default view: hide city-specific polls (users can still search for them)
  if (!q.trim() && !normalizedCategory) {
    polls = polls.filter((poll) => {
      const question = poll.question?.toLowerCase() ?? "";
      return !cities.some((city) => question.includes(city));
    });
  }

  if (q.trim() && normalizedCategory) {
    const needle = normalizedCategory.toLowerCase();
    polls = polls.filter((p) =>
      (p.category_slug ?? "").toLowerCase().includes(needle),
    );
  }
  const reviews = (await getReviews()) ?? [];

  return (
    <main>
      {/* No Hero */}
      <section className="py-16 md:py-24 bg-[#0C163A]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em]
                text-white/70"
            >
              Rider intelligence
            </p>
            <h1
              className="mt-4 text-4xl font-semibold tracking-tight text-white
                sm:text-5xl"
            >
              Community Polls
            </h1>
            <p className="mt-3 text-base text-white/75 sm:text-lg">
              Real riders share what matters most—pricing, safety, vibes,
              accessibility, and rules. Tap into the nation&apos;s largest party
              bus panel, vote on new questions, and watch results shift in real
              time.
            </p>

            {normalizedCategory && (
              <div
                className="flex flex-wrap items-center justify-center gap-3
                  text-sm"
              >
                <span className="text-muted-foreground">Filtered by:</span>
                <span className="font-semibold text-foreground">
                  {normalizedCategory}
                </span>
                <Button asChild variant="link" className="text-primary">
                  <Link href="/polls">Clear filter</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="mx-auto max-w-7xl mb-10">
            <PollsSearchForm
              defaultQuery={q}
              defaultCategory={normalizedCategory || undefined}
              resultsCount={polls.length}
            >
              {polls.length > 0 ? (
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
                    gap-8"
                >
                  {polls.map((poll) => (
                    <PollCard
                      key={poll.id}
                      poll={poll}
                      backgroundClassName="shadow-[0_35px_120px_rgba(5,10,35,0.65)]
          border border-white/10 bg-gradient-to-r from-slate-900/80
          to-slate-950/90"
                      noLoadSpinner
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="rounded-3xl border border-dashed border-border
                    bg-transparent py-16 text-center"
                >
                  <h3 className="text-lg font-semibold text-white">
                    No polls found
                  </h3>
                  <p className="text-blue-200/85">Try a different search.</p>
                  <Button asChild variant="link" className="mt-2 text-primary">
                    <Link href="/polls">Clear search</Link>
                  </Button>
                </div>
              )}
            </PollsSearchForm>
          </div>
        </div>
      </section>

      {
        <section className="bg-[#0E1F46]">
          <div className="container mx-auto px-4 md:px-6 pt-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">
              Browse by category
            </h2>
            <p className="mt-2 text-sm text-white/70">
              Jump into a topic and vote on the most popular questions.
            </p>
          </div>

          {pollSections.map((section) => (
            <div key={section.category} id={`polls-${section.category}`}>
              <PollCategorySection
                category={section.category}
                title={section.title}
              />
            </div>
          ))}
        </section>
      }

      <ReviewsSection reviews={reviews} />
      <FleetSection />
      <ToolsGrid category="polls" />
      <FaqSection category="polls" title="Poll FAQs" />
      <EventsGrid />
    </main>
  );
}
