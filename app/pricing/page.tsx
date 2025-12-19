import Hero from "@/components/layout/hero";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { EventsGrid } from "@/components/sections/events-grid";
import { getReviews } from "@/lib/data/reviews";
import FleetSection from "@/components/sections/fleet-section";
import { FaqSearchSection } from "@/components/sections/faq-search-section";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Pricing",
  description:
    "Get clear pricing guidance for party buses, limos, and coach buses — plus instant answers to common cost questions before you book.",
  path: "/pricing",
});

export default async function PricingPage() {
  const reviews = (await getReviews()) ?? [];

  return (
    <main>
      <Hero slug="pricing" />

      <section className="bg-[#050f25] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div
            className="rounded-[32px] border border-white/10 bg-gradient-to-br
              from-[#101f42] via-[#0a1733] to-[#050c1f] px-6 py-10
              shadow-[0_35px_70px_rgba(4,10,26,0.65)] md:px-10"
          >
            <FaqSearchSection
              category="pricing"
              title="Search every cost question right at the top"
              aboveTitle="Pricing FAQ"
              description="Get instant answers to your most common pricing questions. Filter by
      vehicle type, location, or event to find exactly what you need."
              className="bg-transparent py-0 md:py-0"
            />
          </div>
        </div>
      </section>

      <ReviewsSection reviews={reviews} />
      <PollsGrid
        columnCategories={[
          "pricing",
          "booking-experience",
          "booking-lead-times",
        ]}
        hideCities
      />
      <FleetSection />
      <ToolsGrid category="pricing" />
      <FaqSection category="pricing" title="Pricing FAQs" />
      <EventsGrid />
    </main>
  );
}
