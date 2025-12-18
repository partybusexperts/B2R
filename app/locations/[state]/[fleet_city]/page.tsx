import { notFound } from "next/navigation";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { getReviews } from "@/lib/data/reviews";
import { getLocationBySlugs } from "@/lib/data/locations";
import FleetSection from "@/components/sections/fleet-section";
import LocationReadyToPlan from "@/components/sections/location-ready-to-plan";
import LocationHeader from "@/components/sections/location-header";
import LocationWhyBook from "@/components/sections/location-why-book";
import LocationHowToBook from "@/components/sections/location-how-to-book";
import LocationCitiesAcross from "@/components/sections/location-cities-across";
import LocationPlanningGuide from "@/components/sections/location-planning-guide";
import LocationCompleteGuide from "@/components/sections/location-complete-guide";
import LocationPlanningChecklist from "@/components/sections/location-planning-checklist";
import LocationTransportationOverview from "@/components/sections/location-transportation-overview";
import LocationExtraPlanningNotes from "@/components/sections/location-extra-planning-notes";
import LocationTopHotspots from "@/components/sections/location-top-hotspots";
import LocationLiveWeather from "@/components/sections/location-live-weather";
import Hero from "@/components/layout/hero";
import Link from "next/link";
import { OtherFleets } from "@/components/sections/content-with-images";

type FleetType = "party-buses" | "limousines" | "coach-buses";

export default async function FleetCityPage({
  params,
}: {
  params: Promise<{ state: string; fleet_city: string }>;
}) {
  const { state, fleet_city } = await params;

  const fleetType =
    (fleet_city.match(
      /(party-buses)|(limousines)|(coach-buses)/g,
    )?.[0] as FleetType) ?? "party-buses";

  const city = fleet_city.replace(`${fleetType}-`, "");

  const location = await getLocationBySlugs(state, city);

  if (!location) return notFound();

  const reviews = (await getReviews(6)) ?? [];

  const fleetTypeMap = {
    "party-buses": "party-bus",
    limousines: "limo",
    "coach-buses": "coach",
  } as const;

  return (
    <main>
      {/* Once we have cities images, we need to show them in the hero.  */}
      <Hero slug={location.city_slug} />

      <OtherFleets currentType={fleetTypeMap[fleetType]} location={location} />

      <LocationHeader location={location} />

      <LocationWhyBook location={location} />

      <FleetSection
        showPartyBuses={fleetType === "party-buses"}
        showLimousines={fleetType === "limousines"}
        showCoachBuses={fleetType === "coach-buses"}
        location={{ stateSlug: state, citySlug: city }}
      />

      <LocationHowToBook location={location} />

      <LocationCitiesAcross location={location} />

      <LocationPlanningGuide location={location} />

      <LocationCompleteGuide location={location} />

      <section className="max-w-7xl mx-auto my-8 px-6 space-y-8">
        <div
          className="rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-400
            text-black p-6 shadow-lg flex flex-col sm:flex-row items-center
            justify-between gap-4"
        >
          <div className="text-sm sm:text-base font-semibold">
            Ready to lock a vehicle for {location.city_name}? Get an instant
            quote with driver notes and aurora-flex options.
          </div>
          <div className="flex gap-3">
            <Link
              href="/contact"
              aria-label="Get an instant quote"
              className="inline-block rounded-full bg-black text-yellow-300
                font-bold px-5 py-3 shadow hover:brightness-95 transition"
            >
              ⚡ Instant Quote
            </Link>
            <Link
              href="tel:8885352566"
              aria-label="Call to book"
              className="inline-block rounded-full bg-white text-blue-900
                font-bold px-5 py-3 shadow hover:opacity-95 transition text-sm"
            >
              📞 Call (888) 535‑2566
            </Link>
          </div>
        </div>
      </section>

      <ReviewsSection reviews={reviews} />

      <LocationPlanningChecklist location={location} />

      <LocationTransportationOverview location={location} />

      <LocationExtraPlanningNotes location={location} />

      <LocationTopHotspots location={location} />

      <LocationLiveWeather location={location} />

      <PollsGrid category={location.city_slug} />

      <ToolsGrid category={location.city_slug} />

      <EventsGrid />

      <FaqSection
        category={location.city_slug}
        title={`${location.city_name} FAQs`}
      />

      <LocationReadyToPlan location={location} />
    </main>
  );
}
