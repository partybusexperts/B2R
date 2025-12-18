import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { getReviews } from "@/lib/data/reviews";
import { getLocationsByState } from "@/lib/data/locations";
import { notFound } from "next/navigation";
import LocationReadyToPlan from "@/components/sections/location-ready-to-plan";
import LocationCitiesAcross from "@/components/sections/location-cities-across";
import LocationHowToBook from "@/components/sections/location-how-to-book";
import LocationPlanningGuide from "@/components/sections/location-planning-guide";
import FleetSection from "@/components/sections/fleet-section";

export default async function StatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const locations = await getLocationsByState(state);

  if (!locations || locations.length === 0) return notFound();

  const location = locations[0]; // FIXME: Fetch state data instead of select the first city in locations
  const reviews = (await getReviews(6)) ?? [];

  return (
    <main className="pt-16">
      <LocationCitiesAcross location={location} />

      <FleetSection />

      <LocationHowToBook location={location} isState />

      <LocationPlanningGuide location={location} />

      <ReviewsSection reviews={reviews} />

      <PollsGrid category={location.state_slug} />

      <ToolsGrid category={location.state_slug} />

      <EventsGrid />

      <FaqSection
        category={location.state_slug}
        title={`${location.state_name} FAQs`}
      />

      <LocationReadyToPlan location={location} />
    </main>
  );
}
