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
// import LocationHeader from "@/components/sections/location-header";
// import LocationWhyBook from "@/components/sections/location-why-book";

export default async function StatePage({
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

  return (
    <main className="pt-16">
      {/* Locations custom header */}
      <LocationCitiesAcross location={location} />
      {/* <LocationHeader location={location} /> */}

      {/* <LocationWhyBook location={location} /> */}

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

      {/* 

      <Hero slug={state_slug} />

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

      <LiveConditions
        city={location.state_name}
        lat={location.coordinates.lat}
        lng={location.coordinates.lng}
      />

      <LocationInfoGrid
        title={`${location.state_name} Events We Love`}
        items={location.local_events}
      />

      <LocationNightOut city={location.state_name} />

      <LocationInfoGrid
        title="Neighborhoods & Seasons"
        items={[...location.neighborhood_vibes, location.seasonal_guide]}
      />

      <LocationTriviaSection
        trivia={location.trivia}
        city={location.state_name}
      />



      <LocationReadyToPlan location={location} /> */}
    </main>
  );
}
