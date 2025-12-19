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
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Reviews",
  description:
    "Read verified rider reviews and see why groups trust Bus2Ride for party buses, limos, and coach buses.",
  path: "/reviews",
});

export default async function ReviewsPage() {
  const reviews = (await getReviews(50)) ?? []; // Fetch more reviews for the main page
  // const fleet = (await getVehiclesByType("party-bus")) ?? [];

  return (
    <main>
      <Hero slug="reviews" />

      <ReviewsSection reviews={reviews} title="All Customer Reviews" />

      {/* <FleetList title="Our Fleet" vehicles={fleet} /> */}
      <FleetSection />
      <PollsGrid
        columnCategories={[
          "best-driver-moments",
          "booking-experience",
          "pricing",
        ]}
        hideCities
      />
      <EventsGrid />
      <ToolsGrid category="reviews" />
      <FaqSection category="reviews" title="Reviews FAQs" />
    </main>
  );
}
