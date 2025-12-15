import { notFound } from "next/navigation";
import { LiveConditions } from "@/components/sections/live-conditions";
import { LocationTriviaSection } from "@/components/sections/location-trivia";
import { LocationInfoGrid } from "@/components/sections/location-info-grid";
import { FleetList } from "@/components/sections/fleet-list";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { getReviews } from "@/lib/data/reviews";
import { getVehiclesByType } from "@/lib/data/vehicles";
import Hero from "@/components/layout/hero";
import { getLocationFleetPage } from "@/lib/data/locations";
import { VehicleData } from "@/types/vehicle.types";
import { LocationNightOut } from "@/components/sections/location-night-out";
import LocationReadyToPlan from "@/components/sections/location-ready-to-plan";

function fleetSlugToType(fleetSlug: string): VehicleData["type"] | null {
  if (fleetSlug === "party-buses") return "party-bus";
  if (fleetSlug === "limousines") return "limo";
  if (fleetSlug === "coach-buses") return "coach";
  if (
    fleetSlug === "party-bus" ||
    fleetSlug === "limo" ||
    fleetSlug === "coach"
  ) {
    return fleetSlug;
  }
  return null;
}

function fleetTypeLabel(type: VehicleData["type"]) {
  if (type === "party-bus") return "Party Buses";
  if (type === "limo") return "Limousines";
  return "Coach Buses";
}

export default async function StateCityFleetPage({
  params,
}: {
  params: Promise<{
    state_slug: string;
    city_slug: string;
    fleet_slug: string;
  }>;
}) {
  const { state_slug, city_slug, fleet_slug } = await params;

  const vehicleType = fleetSlugToType(fleet_slug);
  if (!vehicleType) return notFound();

  const location = await getLocationFleetPage(
    state_slug,
    city_slug,
    vehicleType,
  );

  if (!location) return notFound();

  const reviews = (await getReviews(6)) ?? [];
  const fleet = (await getVehiclesByType(vehicleType, "min_hours", 12)) ?? [];
  const label = fleetTypeLabel(vehicleType);

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

      <div id="fleet" className="pt-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-3">
          {label} in {location.city_name}
        </h2>
        <p className="text-center text-muted-foreground mb-10">
          Search by capacity and amenities to find the right fit.
        </p>
        <FleetList title={`${label} Fleet`} vehicles={fleet} />
      </div>

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
