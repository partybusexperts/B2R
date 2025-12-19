import { FleetList } from "@/components/sections/fleet-list";
import { WhySection } from "@/components/sections/content-features";
import { OtherFleets } from "@/components/sections/content-with-images";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
// import { FaqSection } from "@/components/sections/faq-section";
import { getVehiclesByType } from "@/lib/data/vehicles";
import { getReviews } from "@/lib/data/reviews";
import { BookingProcessSection } from "@/components/sections/content-booking";
import { FaqSearchSection } from "@/components/sections/faq-search-section";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Party Buses",
  description:
    "Browse party buses by size and amenities. Search capacity, compare layouts, and book a chauffeur-driven ride for your event.",
  path: "/party-buses",
});

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
      <section className="bg-[#0E1F46] py-16 px-4 sm:px-6 lg:px-8">
        <h2
          className="text-4xl md:text-5xl font-extrabold text-center text-white
            font-serif tracking-tight"
        >
          Pick Your Party Bus
        </h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mt-3">
          From minis to mega buses—clean, comfy, and ready for your group.
        </p>
      </section>

      {/* Filterable Fleet Inventory */}
      {/* Search Bar + List of Vehicle Cards */}
      <FleetList title="Party Bus Fleet" vehicles={vehicles} />

      {/* Why Party Buses Rock */}
      <WhySection slug="party-buses" />

      {/* Cross Sell */}
      <OtherFleets currentType="party-bus" />

      {/* Booking Process */}
      <BookingProcessSection />

      {/* Reviews */}
      <ReviewsSection reviews={reviews} />

      {/* Polls */}
      <PollsGrid
        columnCategories={["party-bus", "limo", "coach-bus"]}
        hideCities
      />

      {/* Tools (Context: Party Bus) */}
      <ToolsGrid category="party-bus" />

      {/* Events */}
      <EventsGrid />

      {/* FAQ (Context: Party Bus) */}
      {/* <FaqSection category="party-buses" title="Party Bus FAQs" /> */}
      <FaqSearchSection
        category="party-buses"
        title="Everything about party bus bookings"
        aboveTitle="Party Bus FAQ"
        description="Search through the most common questions groups ask about BYOB rules, pricing windows, pickup timing, and post-ride cleanup before locking in a bus."
        inputPlaceholder='Try "BYOB", "pricing", "pickup windows"…'
      />
    </main>
  );
}
