// import { notFound } from "next/navigation";
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
import { getLocationsByState } from "@/lib/data/locations";
import { notFound } from "next/navigation";
import FleetSection from "@/components/sections/fleet-section";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LocationNightOut } from "@/components/sections/location-night-out";
import LocationReadyToPlan from "@/components/sections/location-ready-to-plan";
// import { FleetList } from "@/components/sections/fleet-list";
// import { getRandomVehicles } from "@/lib/data/vehicles";

export default async function LocationStatePage({
  params,
}: {
  params: Promise<{ state_slug: string }>;
}) {
  const { state_slug } = await params;
  const locations = await getLocationsByState(state_slug);

  if (!locations || locations.length === 0) return notFound();

  // Fetch standard data for footer stack
  const location = locations[0]; // FIXME: fallback, I should really build a new state page showing many cities
  const reviews = (await getReviews(6)) ?? [];
  // const fleet = (await getRandomVehicles(3)) ?? [];

  return (
    <main>
      {/* 1. Dynamic Hero */}
      <Hero slug={state_slug} />

      {/* Cities in this state */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-8 max-w-3xl text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Cities in {location.state_name}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Pick a city to see events, vibes, live conditions, and local tips.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((city) => (
              <Link
                key={city.id}
                href={`/locations/state/${city.state_slug}/city/${city.city_slug}`}
                className="group"
              >
                <Card
                  className="h-full border-border/60 bg-card p-6 shadow-sm
                    transition-all hover:-translate-y-1 hover:border-primary/50
                    hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <h3
                        className="text-lg font-bold leading-tight
                          group-hover:text-primary transition-colors"
                      >
                        {city.city_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {city.name}
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                      {city.available_fleet_types?.slice(0, 3).map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">
                          {t === "party-bus"
                            ? "Party Bus"
                            : t === "limo"
                              ? "Limo"
                              : "Coach"}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Live Conditions (Weather/Traffic) */}
      <LiveConditions
        city={location.state_name}
        lat={location.coordinates.lat}
        lng={location.coordinates.lng}
      />

      {/* 3. "Events that love party buses" (Modals) */}
      <LocationInfoGrid
        title={`${location.state_name} Events We Love`}
        items={location.local_events}
      />

      <LocationNightOut city={location.state_name} />

      {/* 5. Vibes & Seasonal (Modals) */}
      <LocationInfoGrid
        title="Neighborhoods & Seasons"
        items={[...location.neighborhood_vibes, location.seasonal_guide]}
      />

      {/* 6. Spicy Trivia */}
      <LocationTriviaSection
        trivia={location.trivia}
        city={location.state_name}
      />

      {/* Local Fleet Section (Filtered) */}
      {/* <div id="fleet" className="pt-16">
        <h2 className="text-3xl font-extrabold text-center mb-8">
            Available in {location.name}
          </h2>
          <FleetList title="Anchorage Fleet" vehicles={fleet} />
        </div> */}

      <ReviewsSection reviews={reviews} />

      <PollsGrid category={location.state_slug} />

      <FleetSection />

      <ToolsGrid category={location.state_slug} />

      <EventsGrid />

      <FaqSection
        category={location.state_slug}
        title={`${location.state_name} FAQs`}
      />

      <LocationReadyToPlan
        cityName={location.city_name}
        citySlug={location.city_slug}
        stateSlug={location.state_slug}
      />
    </main>
  );
}
