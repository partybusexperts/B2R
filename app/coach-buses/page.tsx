import { FleetList } from "@/components/sections/fleet-list";
import { WhySection } from "@/components/sections/content-features";
import { OtherFleets } from "@/components/sections/content-with-images";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { getVehiclesByType } from "@/lib/data/vehicles";
import { getReviews } from "@/lib/data/reviews";
import { BookingProcessSection } from "@/components/sections/content-booking";
import { FaqSearchSection } from "@/components/sections/faq-search-section";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Coach Buses",
  description:
    "Find coach buses for comfortable group transportation. Compare capacity and amenities for longer routes, tours, and event shuttles.",
  path: "/coach-buses",
});

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
      <section className="bg-[#0E1F46] py-16 px-4 sm:px-6 lg:px-8">
        <h2
          className="text-4xl md:text-5xl font-extrabold text-center text-white
            font-serif tracking-tight"
        >
          Choose Your Coach Bus
        </h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mt-3">
          From 24-passenger mini coaches to double-axle motorcoaches—pick the
          capacity and amenities your run demands.
        </p>
      </section>

      {/* 1. Filterable Fleet Inventory */}
      {/* Search Bar + List of Vehicle Cards */}
      <FleetList title="Coach Bus Fleet" vehicles={vehicles} />

      {/* 2. "Why Coach Buses Rock" (Legacy V2 Style - Grid) */}
      <WhySection slug="coach-buses" />

      {/* 3. Cross-Sell Text (We also have party buses...) */}
      <OtherFleets currentType="coach" />

      {/* 4. Booking Process */}
      <BookingProcessSection />

      {/* 5. Reviews */}
      <ReviewsSection reviews={reviews} />

      {/* 6. Polls */}
      <PollsGrid
        columnCategories={["coach-bus", "party-bus", "limo"]}
        hideCities
      />

      {/* 7. Tools (Context: Coach buses) */}
      <ToolsGrid category="coach" />

      {/* 8. Events */}
      <EventsGrid />

      {/* 9. FAQ (Context: Coach Bus) */}
      <FaqSearchSection
        category="coach-buses"
        title="Coach bus logistics, timing & compliance"
        aboveTitle="Coach & Charter FAQ"
        description="Search answers about driver hours, luggage staging, ADA requests, rest stops, and multi-day itineraries before you submit your manifest."
        inputPlaceholder='Try "driver hours", "rest stops", "luggage"…'
      />
    </main>
  );
}
