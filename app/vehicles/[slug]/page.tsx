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

interface PageProps {
  params: Promise<{ slug: string }>;
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

  return (
    <main>
      {/* 1. Main Vehicle Details */}
      <VehicleDetail vehicle={vehicle} />

      {/* 2. "Why This Category Rocks" */}
      {/* Dynamic slug: why-limo-rocks-v2, why-party-bus-rocks-v2 */}
      <WhySection slug={categorySlug} />

      {/* 3. Related Vehicles (Cross Sell) */}
      {related.length > 0 && (
        <section className="bg-slate-50 dark:bg-slate-900/30">
          <div className="container mx-auto px-4 md:px-6 py-16">
            <h2 className="text-5xl font-extrabold text-center">
              Explore Other {categoryTitle}
            </h2>
            <div className="space-y-4">
              <FleetPreview
                vehicles={related}
                // Reuse the preview card but hide navigation arrows for this context
                showNavigation={false}
                viewAllLink={related[0].type as string}
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
      <PollsGrid category={vehicle.type as string} />
      <ToolsGrid category="pricing" />
      <EventsGrid />
      <FaqSection
        category={vehicle.type as string}
        title={`${categoryTitle} FAQs`}
      />
    </main>
  );
}
