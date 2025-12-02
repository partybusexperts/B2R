import React from "react";

import { fetchFleetVehicles } from "../../lib/server/fleetData";

import LimousinesClient from "./LimousinesClient";
import GlobalReviewStripServer from "../../components/reviews/GlobalReviewStripServer";
import ToolsSection from "@/components/home/ToolsSection";
import PartyBusEventsSection from "@/components/party-buses/PartyBusEventsSection";
import LimoFaqSection from "@/components/limousines/LimoFaqSection";
import { PollsBoxByTag } from "@/components/PollsBoxByTag";

export default async function LimousinesPage() {
  const fleet = await fetchFleetVehicles();
  const vehicles = [...(fleet["limousines"] ?? [])].sort((a, b) => (a.capacityMax ?? 0) - (b.capacityMax ?? 0));

  return (
    <>
      <LimousinesClient vehicles={vehicles} />
      <GlobalReviewStripServer />
      <section className="mx-auto mt-12 max-w-6xl space-y-6 px-4">
        <PollsBoxByTag
          tag="limo"
          title="Limousine Rider Polls"
          subtitle="See what limo riders say about interiors, chauffeurs, and upgrade-worthy perks."
        />
        <PollsBoxByTag
          tag="weddings"
          title="Wedding Limo Debates"
          subtitle="Ceremony timelines, photo stops, champagne policies—the wedding limo receipts are right here."
        />
        <PollsBoxByTag
          tag="prom"
          title="Prom & Formal Night Polls"
          subtitle="Parents vs. students, curfews vs. after-parties. Real limo bookings for prom season."
        />
      </section>
      <ToolsSection />
      <PartyBusEventsSection category="limousines" />
      <LimoFaqSection />
    </>
  );
}
