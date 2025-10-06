// app/page.tsx
import React from "react";
import HeroHeaderServer from "../components/HeroHeaderServer";
import VehiclePreviewSection from "../components/sections/VehiclePreviewSection";
import CTAFromDbServer from "../components/sections/CTAFromDbServer";
import HomePollsSection from "../components/polls/HomePollsSection";

import { getWhySections, pickWhyByType } from "../lib/server/why";
import WhyVehicleCard from "../components/sections/WhyVehicleCard";
import GlobalReviewStripServer from "../components/reviews/GlobalReviewStripServer";

export default async function Home() {
  const why = await getWhySections();

  return (
    <main>
      <HeroHeaderServer pageSlug="home" fallback={{ page_slug: "home" }} />

      <VehiclePreviewSection category="party-buses" title="Party Buses" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-4">
        <WhyVehicleCard section={pickWhyByType(why, "party-buses")} />
      </div>

      <VehiclePreviewSection category="limousines" title="Limousines" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-4">
        <WhyVehicleCard section={pickWhyByType(why, "limousines")} />
      </div>

      <VehiclePreviewSection category="coach-buses" title="Coach Buses" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-4">
        <WhyVehicleCard section={pickWhyByType(why, "coach-buses")} />
      </div>

  <CTAFromDbServer vehicleHint="coach-buses" />
      <GlobalReviewStripServer />
      <HomePollsSection />
    </main>
  );
}
