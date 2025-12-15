import { notFound } from "next/navigation";
import { LiveConditions } from "@/components/sections/live-conditions";
import { LocationTriviaSection } from "@/components/sections/location-trivia";
import { LocationInfoGrid } from "@/components/sections/location-info-grid";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { getReviews } from "@/lib/data/reviews";
import Hero from "@/components/layout/hero";
import { getLocationBySlugs } from "@/lib/data/locations";
import FleetSection from "@/components/sections/fleet-section";
import { LocationNightOut } from "@/components/sections/location-night-out";
import LocationReadyToPlan from "@/components/sections/location-ready-to-plan";

export default async function StateCityPage({
  params,
}: {
  params: Promise<{ state_slug: string; city_slug: string }>;
}) {
  const { state_slug, city_slug } = await params;
  const location = await getLocationBySlugs(state_slug, city_slug);

  if (!location) return notFound();

  const reviews = (await getReviews(6)) ?? [];

  return (
    <main>
      <Hero slug={city_slug} />

      <LiveConditions
        city={location.city_name}
        lat={location.coordinates.lat}
        lng={location.coordinates.lng}
      />

      <LocationInfoGrid
        title={`${location.city_name} Events We Love`}
        items={location.local_events}
      />

      <LocationNightOut city={location.city_name} />

      <LocationInfoGrid
        title="Neighborhoods & Seasons"
        items={[...location.neighborhood_vibes, location.seasonal_guide]}
      />

      <LocationTriviaSection
        trivia={location.trivia}
        city={location.city_name}
      />

      <ReviewsSection reviews={reviews} />

      <PollsGrid category={location.city_slug} />

      <FleetSection location={{ stateSlug: state_slug, citySlug: city_slug }} />

      <ToolsGrid category={location.city_slug} />

      <EventsGrid />

      <FaqSection
        category={location.city_slug}
        title={`${location.city_name} FAQs`}
      />

      <LocationReadyToPlan
        cityName={location.city_name}
        citySlug={location.city_slug}
        stateSlug={location.state_slug}
      />
    </main>
  );
}
