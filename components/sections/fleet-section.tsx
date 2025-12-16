import { Suspense } from "react";
import { WhySection } from "./content-features";
import { FleetPreviewServer } from "./fleet-preview.server";

interface FleetSectionProps {
  showPartyBuses?: boolean;
  showLimousines?: boolean;
  showCoachBuses?: boolean;
  location?: {
    stateSlug: string;
    citySlug: string;
  };
}

export default async function FleetSection({
  showPartyBuses = true,
  showLimousines = true,
  showCoachBuses = true,
  location,
}: FleetSectionProps) {
  const linkFor = (fleet: "party-bus" | "limo" | "coach") => {
    if (!location) {
      if (fleet === "party-bus") return "/party-buses";
      if (fleet === "limo") return "/limousines";
      return "/coach-buses";
    }

    const fleetSlug =
      fleet === "party-bus"
        ? "party-buses"
        : fleet === "limo"
          ? "limousines"
          : "coach-buses";
    return `/locations/state/${location.stateSlug}/city/${location.citySlug}/${fleetSlug}`;
  };

  return (
    <>
      {/* Party Buses */}
      {showPartyBuses && (
        <>
          <Suspense
            fallback={<div className="h-[600px] bg-muted animate-pulse" />}
          >
            <FleetPreviewServer
              title="Party Buses"
              description="Turn the journey into the destination. Our party buses come equipped with premium sound systems, LED lighting, and ample space for your entire group."
              viewAllLink={linkFor("party-bus")}
              type="party-bus"
            />
          </Suspense>

          {/* Why Party Buses Rock */}
          <WhySection slug="party-buses" />
        </>
      )}

      {/* Limousines */}
      {showLimousines && (
        <>
          <Suspense
            fallback={<div className="h-[600px] bg-muted animate-pulse" />}
          >
            <FleetPreviewServer
              title="Luxury Limousines"
              description="Arrive in style and sophistication. Perfect for weddings, corporate events, or an intimate night out on the town."
              viewAllLink={linkFor("limo")}
              type="limo"
            />
          </Suspense>

          {/* Why Limousines Rock */}
          <WhySection slug="limousines" />
        </>
      )}

      {/* Coach Buses */}
      {showCoachBuses && (
        <>
          <Suspense
            fallback={<div className="h-[600px] bg-muted animate-pulse" />}
          >
            <FleetPreviewServer
              title="Coach Buses"
              description="Reliable and comfortable transport for large groups. Ideal for corporate shuttles, team travel, and long-distance trips."
              viewAllLink={linkFor("coach")}
              type="coach"
            />
          </Suspense>

          {/* Why Coach Buses Work Best */}
          <WhySection slug="coach-buses" />
        </>
      )}
    </>
  );
}
