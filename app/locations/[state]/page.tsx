import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { getReviews } from "@/lib/data/reviews";
import {
  getLocationsByState,
  getLocationWithContent,
} from "@/lib/data/locations";
import { notFound } from "next/navigation";
import LocationReadyToPlan from "@/components/sections/location-ready-to-plan";
import LocationCitiesAcross from "@/components/sections/location-cities-across";
import LocationHowToBook from "@/components/sections/location-how-to-book";
import LocationPlanningGuide from "@/components/sections/location-planning-guide";
import FleetSection from "@/components/sections/fleet-section";
import LocationHeader from "@/components/sections/location-header";
import LocationWhyBook from "@/components/sections/location-why-book";
import Hero from "@/components/layout/hero";
import { FaqSearchSection } from "@/components/sections/faq-search-section";
import LocationComfortChecklist from "@/components/sections/location-comfort-checklist";
import LocationCompleteGuide from "@/components/sections/location-complete-guide";
import LocationExtraPlanningNotes from "@/components/sections/location-extra-planning-notes";
import LocationPlanningChecklist from "@/components/sections/location-planning-checklist";
import LocationTopHotspots from "@/components/sections/location-top-hotspots";
import LocationTransportationOverview from "@/components/sections/location-transportation-overview";
import { Link } from "lucide-react";

export default async function StatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const locations = await getLocationsByState(state);

  if (!locations) return notFound();

  const location = await getLocationWithContent({
    slug: `${locations?.[0].city_slug}-${state}`,
    fleetType: "party-buses",
  });

  if (!location) return notFound();

  const reviews = (await getReviews(6)) ?? [];

  return (
    // <main className="pt-16">
    //   <LocationCitiesAcross location={location} />

    //   <FleetSection />

    //   <LocationHowToBook location={location} isState />

    //   <LocationPlanningGuide location={location} />

    //   <ReviewsSection reviews={reviews} />

    //   <PollsGrid category={location.state_slug} />

    //   <ToolsGrid category={location.state_slug} />

    //   <EventsGrid />

    //   <FaqSection
    //     category={location.state_slug}
    //     title={`${location.state_name} FAQs`}
    //   />

    //   <LocationReadyToPlan location={location} />
    // </main>

    <main>
      {/* Once we have cities images, we need to show them in the hero.  */}
      <Hero slug={location.state_slug} />

      <LocationCitiesAcross location={location} />
      <LocationHeader location={location} />

      <LocationWhyBook location={location} />

      <FleetSection
        location={{ stateSlug: state, citySlug: locations?.[0].city_slug }}
      />

      <LocationHowToBook location={location} />

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
              📞 Call (888) 535-2566
            </Link>
          </div>
        </div>
      </section>

      <ReviewsSection reviews={reviews} />

      <LocationPlanningChecklist location={location} />

      <LocationTransportationOverview location={location} />

      <LocationExtraPlanningNotes location={location} />

      <LocationTopHotspots location={location} />

      <LocationComfortChecklist location={location} vehicles_images={[]} />

      <PollsGrid category={location.city_slug} />

      <ToolsGrid category={location.city_slug} />

      <EventsGrid />

      <FaqSearchSection
        category={location.slug ?? "home"}
        title={`${location.city_name} FAQs`}
      />

      <LocationReadyToPlan location={location} />
    </main>
  );
}
