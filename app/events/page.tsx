import Hero from "@/components/layout/hero";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { getEvents } from "@/lib/data/events";
import { getReviews } from "@/lib/data/reviews";
import FleetSection from "@/components/sections/fleet-section";
import { EventSearchClient } from "@/components/sections/events-search.client";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Events",
  description:
    "Browse event guides for weddings, bachelor(ette) parties, proms, nights out, and more — with route tips and booking playbooks.",
  path: "/events",
});

export default async function EventsPage() {
  const events = (await getEvents()) ?? [];
  const reviews = (await getReviews()) ?? [];

  return (
    <main>
      <Hero slug="events" />

      <section className="relative isolate py-24 sm:py-28 bg-[#0C163A]">
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="mb-10 text-center">
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em]
                text-white/70"
            >
              Event playbook
            </p>
            <h2
              className="mt-4 text-4xl font-semibold tracking-tight text-white
                sm:text-5xl"
            >
              Browse every party bus event idea
            </h2>
            <p className="mt-3 text-base text-white/75 sm:text-lg">
              Filter popular use cases, search by name, or jump straight into a
              curated event guide. All the tiles below link to a ready-to-book
              walkthrough.
            </p>
          </div>

          <EventSearchClient
            events={events}
            cardCustomStyles={{
              // text-xs
              fontSize: ".75rem",
              lineHeight: "1rem",
            }}
          />
        </div>
      </section>

      <ReviewsSection reviews={reviews} />
      <PollsGrid
        columnCategories={["party-bus", "limo", "coach-bus"]}
        hideCities
      />

      <FleetSection />
      {/* <FleetList title="Our Fleet" vehicles={fleet} /> */}

      <ToolsGrid category="events" />

      <FaqSection category="events" title="Events FAQs" />
    </main>
  );
}
