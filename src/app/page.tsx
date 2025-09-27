// app/page.tsx
import React from "react";
import HeroHeaderServer from "../components/HeroHeaderServer";
import VehiclePreviewSection from "../components/sections/VehiclePreviewSection";
import CTA from "../components/sections/CTA";

import { getWhySections, pickWhyByType } from "../lib/server/why";
import WhyVehicleCard from "../components/sections/WhyVehicleCard";

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

      <CTA data={{ title: "Ready to roll?", subtitle: "Book your ride today", buttons: [{ label: "Contact us", href: "/contact" }] }} />
    </main>
  );
}
