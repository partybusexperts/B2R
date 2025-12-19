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
  title: "Limousines",
  description:
    "Explore sleek limousines for weddings, proms, corporate transfers, and VIP nights. Compare options and get a fast quote.",
  path: "/limousines",
});

// Helper to fetch page-specific data
async function getPageData() {
  // 1. Fetch Fleet
  const vehicles = (await getVehiclesByType("limo", "min_hours", 10)) ?? [];

  // 2. Fetch Reviews (Generic top reviews for now, later filter by tag)
  const reviews = (await getReviews()) ?? [];

  return {
    vehicles: vehicles,
    reviews: reviews,
  };
}

export default async function LimousinesPage() {
  const { vehicles, reviews } = await getPageData();

  return (
    <main>
      <section className="bg-[#0E1F46] py-16 px-4 sm:px-6 lg:px-8">
        <h2
          className="text-4xl md:text-5xl font-extrabold text-center text-white
            font-serif tracking-tight"
        >
          Pick Your Limousine
        </h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mt-3">
          Sleek sedans, SUV stretches, and Sprinter limos tuned for weddings,
          corporate transfers, and VIP arrivals.
        </p>
      </section>

      {/* 1. Filterable Fleet Inventory */}
      {/* Search Bar + List of Vehicle Cards */}
      <FleetList title="Limousine Fleet" vehicles={vehicles} />

      {/* 2. "Why Limousines Rock" (Legacy V2 Style - Grid) */}
      <WhySection slug="limousines" />

      {/* 3. Cross-Sell Text (We also have party buses...) */}
      <OtherFleets currentType="limo" />

      {/* 4. Booking Process */}
      <BookingProcessSection />

      {/* 5. Reviews */}
      <ReviewsSection reviews={reviews} />

      {/* 6. Polls */}
      <PollsGrid category="limo" />

      {/* 7. Tools (Context: Limo) */}
      <ToolsGrid category="limo" />

      {/* 8. Events */}
      <EventsGrid />

      {/* 9. FAQ (Context: Limousines) */}
      <FaqSearchSection
        category="limousines"
        title="Everything about limo timelines & etiquette"
        aboveTitle="Limousine FAQ"
        description="Find answers about photo timing, multi-stop routes, gratuity, and formal arrival etiquette before you lock in your limo."
        inputPlaceholder='Try "prom rules", "wedding photo buffer", "pickup windows"…'
      />
    </main>
  );
}
