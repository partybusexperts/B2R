import Hero from "@/components/layout/hero";
import { FleetList } from "@/components/sections/fleet-list";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { EventsGrid } from "@/components/sections/events-grid";
import { getVehicles } from "@/lib/data/vehicles";
import { getReviews } from "@/lib/data/reviews";
import FleetSection from "@/components/sections/fleet-section";
import { FaqSearchSection } from "@/components/sections/faq-search-section";

export default async function PricingPage() {
  const vehicles = (await getVehicles(100)) ?? [];
  const reviews = (await getReviews()) ?? [];

  return (
    <main>
      <Hero slug="pricing" />

      {/* Main Content: Fleet with Prices */}
      <FleetList title="Vehicle Pricing" vehicles={vehicles} />

      <FaqSearchSection
        category="pricing"
        title="Search every cost question right at the top"
        description="Get instant answers to your most common pricing questions. Filter by
      vehicle type, location, or event to find exactly what you need."
      />
      <ReviewsSection reviews={reviews} />
      <PollsGrid category="pricing" />
      <FleetSection />
      <ToolsGrid category="pricing" />
      <FaqSection category="pricing" title="Pricing FAQs" />
      <EventsGrid />
    </main>
  );
}
