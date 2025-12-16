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

  let polls = q.trim()
    ? ((await getPollsBySearch(q, 90)) ?? [])
    : normalizedCategory
      ? ((await getPollsByCategory(normalizedCategory, 150)) ?? [])
      : ((await getPolls(30)) ?? []);

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
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h1
              className="text-4xl md:text-5xl font-extrabold tracking-tight
                text-foreground"
            >
              Community Polls
            </h1>
            <p className="text-xl text-muted-foreground">
              Vote on the hottest topics in luxury transportation.
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
                    <PollCard key={poll.id} poll={poll} />
                  ))}
                </div>
              ) : (
                <div
                  className="rounded-3xl border border-dashed border-border
                    bg-muted/20 py-16 text-center"
                >
                  <h3 className="text-lg font-semibold">No polls found</h3>
                  <p className="text-muted-foreground">
                    Try a different search.
                  </p>
                  <Button asChild variant="link" className="mt-2 text-primary">
                    <Link href="/polls">Clear search</Link>
                  </Button>
                </div>
              )}
            </PollsSearchForm>
          </div>
        </div>
      </section>

      <ReviewsSection reviews={reviews} />
      <FleetSection />
      <ToolsGrid category="polls" />
      <FaqSection category="polls" title="Poll FAQs" />
      <EventsGrid />
    </main>
  );
}
