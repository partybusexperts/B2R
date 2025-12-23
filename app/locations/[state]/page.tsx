import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { getReviews } from "@/lib/data/reviews";
import { getLocations, getState } from "@/lib/data/locations";
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
import { getRandomVehiclesImages } from "@/lib/data/vehicles";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const stateData = await getState(state);

  if (!stateData) {
    return pageMetadata({
      title: "Location Not Found",
      description: "This location page doesn’t exist or may have moved.",
      noIndex: true,
    });
  }

  const title = `${stateData.name} Group Transportation`;
  const description =
    stateData.header?.description ??
    `Browse cities across ${stateData.name} and compare party buses, limos, and coach buses for your group.`;

  return pageMetadata({
    title,
    description,
    path: `/locations/${stateData.slug}`,
  });
}

export async function generateStaticParams() {
  const locations = await getLocations();

  // Get unique state slugs
  const stateSlugs = new Set<string>();
  locations?.forEach((loc) => {
    if (loc.state_slug) stateSlugs.add(loc.state_slug);
  });

  return Array.from(stateSlugs).map((slug) => ({
    state: slug,
  }));
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;

  const stateData = await getState(state);

  if (!stateData) return notFound();

  const reviews = (await getReviews(6)) ?? [];

  const vehicles_images = await getRandomVehiclesImages(12);

  return (
    <main>
      {/* Once we have cities images, we need to show them in the hero.  */}
      <Hero slug={stateData.slug} />

      <LocationCitiesAcross state={stateData} />

      <LocationHeader state={stateData} />

      <LocationWhyBook state={stateData} />

      <FleetSection />

      <LocationHowToBook state={stateData} />

      <LocationPlanningGuide state={stateData} />

      <LocationCompleteGuide state={stateData} />

      <section className="max-w-7xl mx-auto my-8 px-6 space-y-8">
        <div
          className="rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-400
            text-black p-6 shadow-lg flex flex-col sm:flex-row items-center
            justify-between gap-4"
        >
          <div className="text-sm sm:text-base font-semibold">
            Ready to lock a vehicle for {stateData.name}? Get an instant quote
            with driver notes and aurora-flex options.
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

      <LocationPlanningChecklist state={stateData} />

      <LocationTransportationOverview state={stateData} />

      <LocationExtraPlanningNotes state={stateData} />

      <LocationTopHotspots state={stateData} />

      <LocationComfortChecklist
        state={stateData}
        vehicles_images={vehicles_images}
      />

      <PollsGrid
        columnCategories={["party-bus", "limo", "coach-bus"]}
        // columnCategories={[stateData.slug ?? "", "events", "pricing"]}
        hideCities
      />

      <ToolsGrid category={stateData.slug} />

      <EventsGrid />

      <FaqSearchSection
        category={stateData.slug ?? "home"}
        title={`${stateData.name} FAQs`}
      />

      <LocationReadyToPlan state={stateData} />
    </main>
  );
}
