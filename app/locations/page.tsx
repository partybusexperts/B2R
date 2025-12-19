import { LocationsDirectory } from "@/components/sections/locations-directory";
import { PollsGrid } from "@/components/sections/polls-grid";
// import { FleetList } from "@/components/sections/fleet-list";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { FaqSection } from "@/components/sections/faq-section";
import Hero from "@/components/layout/hero";
import { getReviews } from "@/lib/data/reviews";
import { getLocations } from "@/lib/data/locations";
import FleetSection from "@/components/sections/fleet-section";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Locations",
  description:
    "Find party bus, limo, and coach bus service by city and state. Browse coverage and get a fast quote for your route.",
  path: "/locations",
});

// Helper to fetch generic fleet data for the bottom section
async function getData() {
  const locations = await getLocations();
  const reviews = await getReviews();

  return {
    reviews: reviews || [],
    locations: locations || [],
  };
}

export default async function LocationsIndexPage() {
  const { reviews, locations } = await getData();

  return (
    <main>
      {/* 1. Hero */}
      <Hero slug="locations" />

      {/* 2. Directory (Search & Grid) */}
      <LocationsDirectory locations={locations} />

      {/* 3. Polls (Requested Order: Polls -> Fleet -> Tools -> Reviews -> FAQ) */}
      <PollsGrid
        columnCategories={["events", "pricing", "booking-experience"]}
        hideCities
      />

      {/* 4. Fleet Section option A with filters */}
      {/* <div className="py-12 pb-6 bg-slate-50 dark:bg-slate-900/20">
        <div className="container mx-auto px-4 mb-8 text-center">
          <h2 className="text-4xl font-bold">Our National Fleet</h2>
          <p className="text-muted-foreground">
            Standardized luxury across all locations.
          </p>
        </div>
      </div>
      <FleetList title="" vehicles={fleet} /> */}

      {/* 4. Fleet Section option B "static" */}
      <FleetSection />

      {/* 5. Tools */}
      <ToolsGrid category="locations" />

      {/* 6. Reviews */}
      <ReviewsSection reviews={reviews} />

      {/* 7. FAQ */}
      <FaqSection category="locations" title="Common Questions" />
    </main>
  );
}
