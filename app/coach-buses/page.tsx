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
  const vehicles = await getVehiclesByType("coach", "min_hours", 10);

  // 2. Fetch Reviews (Generic top reviews for now, later filter by tag)
  const reviews = await getReviews();

  return {
    vehicles: vehicles ?? [],
    reviews: reviews ?? [],
  };
}

export default async function CoachBusesPage() {
  const { vehicles, reviews } = await getPageData();

  return (
    <main>
      {/* 1. Filterable Fleet Inventory */}
      {/* Search Bar + List of Vehicle Cards */}
      <FleetList title="Coach Bus Fleet" vehicles={vehicles} />

      {/* 2. "Why Coach Buses Rock" (Legacy V2 Style - Grid) */}
      <WhySection
        slug="coach-buses"
        className="bg-background border-t border-border/40"
      />

      {/* 3. Cross-Sell Text (We also have party buses...) */}
      <OtherFleets currentType="coach" />

      {/* 4. Booking Process */}
      <BookingProcessSection />

      {/* 5. Reviews */}
      <ReviewsSection reviews={reviews} />

      {/* 6. Polls */}
      <PollsGrid category="coach" />

      {/* 7. Tools (Context: Coach buses) */}
      <ToolsGrid category="coach" />

      {/* 8. Events */}
      <EventsGrid />

      {/* 9. FAQ (Context: Coach Bus) */}
      <FaqSection category="coach-buses" title="Coach Buses FAQs" />
    </main>
  );
}
