import { Suspense } from "react";
import Hero from "@/components/layout/hero";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { getReviews } from "@/lib/data/reviews";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
// import { FaqSection } from "@/components/sections/faq-section";
import FleetSection from "@/components/sections/fleet-section";
import { FaqSearchSection } from "@/components/sections/faq-search-section";
import { pageMetadata } from "@/lib/seo/metadata";
// import { BookingProcessSection } from "@/components/sections/content-booking";

export default async function Home() {
  // const [partyBus, limo, coach, reviews] = await Promise.all([
  //   getFeaturedVehicle("party-bus"),
  //   getFeaturedVehicle("limo"),
  //   getFeaturedVehicle("coach"),
  //   getRecentReviews(), // Fetch reviews
  // ]);

  const reviews = (await getReviews()) ?? [];

  return (
    <>
      {/* 1. Hero Section */}
      <Suspense fallback={<div className="h-[600px] bg-muted animate-pulse" />}>
        <Hero slug="home" />
      </Suspense>

      {/* 2. Fleet Section Previews */}

      <FleetSection />

      {/* Smart Reviews Section */}
      <ReviewsSection
        reviews={reviews}
        // defaultFilters={["party-bus", "limo"]}
      />

      {/* Polls Section */}
      <PollsGrid category="home" />

      {/* Tools Section */}
      <ToolsGrid category="home" />

      {/* FAQ Section */}
      {/* <FaqSection category="home" title="Homepage FAQ" /> */}
      <FaqSearchSection
        category="home"
        title="Homepage FAQ"
        description="Search across the 50 most common things riders ask before they book. Everything is curated directly from real conversations, so you get honest answers fast."
      />

      {/* Events Section */}
      <EventsGrid />

      {/* Booking Process */}
      {/* <BookingProcessSection /> */}
    </>
  );
}

export const metadata = pageMetadata({
  title: "Party Bus, Limo & Coach Bus Rentals",
  description:
    "Browse premium party buses, limousines, and coach buses. Get a fast quote, confirm capacity, and book with a professional driver.",
  path: "/",
});
