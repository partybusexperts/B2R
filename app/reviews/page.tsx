import Hero from "@/components/layout/hero";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { getReviews } from "@/lib/data/reviews";
import FleetSection from "@/components/sections/fleet-section";
// import { getVehiclesByType } from "@/lib/data/vehicles";
// import { FleetList } from "@/components/sections/fleet-list";

export default async function ReviewsPage() {
  const reviews = (await getReviews(50)) ?? []; // Fetch more reviews for the main page
  // const fleet = (await getVehiclesByType("party-bus")) ?? [];

  return (
    <main>
      <Hero slug="reviews" />

      <ReviewsSection reviews={reviews} title="All Customer Reviews" />

      {/* <FleetList title="Our Fleet" vehicles={fleet} /> */}
      <FleetSection />
      <PollsGrid category="reviews" />
      <EventsGrid />
      <ToolsGrid category="reviews" />
      <FaqSection category="reviews" title="Reviews FAQs" />
    </main>
  );
}
