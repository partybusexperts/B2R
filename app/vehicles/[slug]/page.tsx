import { notFound } from "next/navigation";
import { VehicleDetail } from "@/components/sections/vehicle-detail";
import { FleetPreview } from "@/components/sections/fleet-preview"; // Reusing for "3 other limos"
import { WhySection } from "@/components/sections/content-features";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { FaqSection } from "@/components/sections/faq-section";
import {
  getSimilarVehiclesByType,
  getVehiclebySlug,
} from "@/lib/data/vehicles";
import { getReviews } from "@/lib/data/reviews";
import FleetSection from "@/components/sections/fleet-section";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { toPublicStorageUrl } from "@/lib/helpers/storage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehiclebySlug(slug);

  if (!vehicle) {
    return pageMetadata({
      title: "Vehicle Not Found",
      description: "This vehicle doesn’t exist or may have moved.",
      noIndex: true,
    });
  }

  const primaryImage = vehicle.images?.[0]
    ? toPublicStorageUrl("vehicles1", vehicle.images[0])
    : undefined;

  const typeLabel =
    vehicle.type === "party-bus"
      ? "Party Bus"
      : vehicle.type === "limo"
        ? "Limo"
        : "Coach Bus";

  return pageMetadata({
    title: `${vehicle.name ?? typeLabel} Rental`,
    description:
      (vehicle.description ?? "").trim() ||
      `Browse details, photos, and amenities for this ${typeLabel.toLowerCase()}.`,
    path: `/vehicles/${vehicle.slug}`,
    openGraphImages: primaryImage ? [primaryImage] : undefined,
  });
}

async function getVehicleData(slug: string) {
  // 1. Fetch Main Vehicle
  const vehicle = await getVehiclebySlug(slug);

  if (!vehicle) return null;

  // 2. Fetch "3 Other Vehicles" of same type (Cross-sell)
  const related =
    (await getSimilarVehiclesByType(vehicle.type, vehicle.id, 3)) ?? [];

  // 3. Fetch Reviews
  const reviews = (await getReviews()) ?? [];

  return { vehicle, related, reviews };
}

export default async function VehiclePage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getVehicleData(slug);

  if (!data) return notFound();

  const { vehicle, related, reviews } = data;

  const categoryTitle =
    vehicle.type === "party-bus"
      ? "Party Buses"
      : vehicle.type === "limo"
        ? "Limousines"
        : "Coach Buses";

  const categorySlug = categoryTitle.toLowerCase().replace(" ", "-");

  const pollCategories =
    vehicle.type === "party-bus"
      ? (["party-bus", "pricing", "events"] as const)
      : vehicle.type === "coach"
        ? (["coach-bus", "airport-procedures", "sporting-events"] as const)
        : (["stretch-limo", "suv-limo", "weddings"] as const);

  return (
    <main>
      {/* 1. Main Vehicle Details */}
      <VehicleDetail vehicle={vehicle} />

      {/* 2. "Why This Category Rocks" */}
      {/* Dynamic slug: why-limo-rocks-v2, why-party-bus-rocks-v2 */}
      <WhySection slug={categorySlug} />

      {/* 3. Related Vehicles (Cross Sell) */}
      {related.length > 0 && (
        <section className="bg-[#0E1F46]">
          <div className="container mx-auto px-4 md:px-6 py-16">
            <h2
              className="mt-2 text-3xl font-semibold text-white md:text-4xl
                text-center"
            >
              Explore Other {categoryTitle}
            </h2>
            <div className="space-y-4">
              <FleetPreview
                vehicles={related}
                // Reuse the preview card but hide navigation arrows for this context
                showNavigation={false}
                viewAllLink={related[0].type as string}
                // sectionClassName="bg-[#050F25]"
              />
            </div>
          </div>
        </section>
      )}

      {/* Other 2 sections for different types */}
      <FleetSection
        showCoachBuses={vehicle.type !== "coach"}
        showLimousines={vehicle.type !== "limo"}
        showPartyBuses={vehicle.type !== "party-bus"}
      />

      <ReviewsSection reviews={reviews} />
      <PollsGrid columnCategories={[...pollCategories]} hideCities />
      <ToolsGrid category="pricing" />
      <EventsGrid />
      <FaqSection
        category={vehicle.type as string}
        title={`${categoryTitle} FAQs`}
      />
    </main>
  );
}
