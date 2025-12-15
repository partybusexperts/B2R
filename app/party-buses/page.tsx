import { FleetList } from "@/components/sections/fleet-list";
import { WhySection } from "@/components/sections/content-features";
import { OtherFleets } from "@/components/sections/content-with-images";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { getVehiclesByType } from "@/lib/data/vehicles";
import { getReviews } from "@/lib/data/reviews";
import { BookingProcessSection } from "@/components/sections/content-booking";

// Helper to fetch page-specific data
async function getPageData() {
  // 1. Fetch Fleet
  const vehicles =
    (await getVehiclesByType("party-bus", "min_hours", 10)) ?? []; // Good heuristic for size/price ordering

  // 2. Fetch Reviews (Generic top reviews for now, later filter by tag)
  const reviews = (await getReviews()) ?? [];

  return {
    vehicles: vehicles,
    reviews: reviews,
  };
}

export default async function PartyBusPage() {
  const { vehicles, reviews } = await getPageData();

  return (
    <main>
      {/* Filterable Fleet Inventory */}
      {/* Search Bar + List of Vehicle Cards */}
      <FleetList title="Party Bus Fleet" vehicles={vehicles} />

      {/* Why Party Buses Rock */}
      <WhySection
        slug="party-buses"
        className="bg-background border-t border-border/40"
      />

      {/* Cross Sell */}
      <OtherFleets currentType="party-bus" />

      {/* Booking Process */}
      <BookingProcessSection />

      {/* Reviews */}
      <ReviewsSection reviews={reviews} />

      {/* Polls */}
      <PollsGrid category="party-bus" />

      {/* Tools (Context: Party Bus) */}
      <ToolsGrid category="party-bus" />

      {/* Events */}
      <EventsGrid />

      {/* FAQ (Context: Party Bus) */}
      <FaqSection category="party-buses" title="Party Bus FAQs" />
    </main>
  );
}
