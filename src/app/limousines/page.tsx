import React from "react";

import { fetchFleetVehicles } from "../../lib/server/fleetData";

import LimousinesClient from "./LimousinesClient";
import GlobalReviewStripServer from "../../components/reviews/GlobalReviewStripServer";
import LimoPollsSection from "../../components/polls/LimoPollsSection";
import ToolsSection from "@/components/home/ToolsSection";
import PartyBusEventsSection from "@/components/party-buses/PartyBusEventsSection";
import LimoFaqSection from "@/components/limousines/LimoFaqSection";

export default async function LimousinesPage() {
  const fleet = await fetchFleetVehicles();
  const vehicles = [...(fleet["limousines"] ?? [])].sort((a, b) => (a.capacityMax ?? 0) - (b.capacityMax ?? 0));

  return (
    <>
      <LimousinesClient vehicles={vehicles} />
      <GlobalReviewStripServer />
      <LimoPollsSection />
      <ToolsSection />
      <PartyBusEventsSection category="limousines" />
      <LimoFaqSection />
    </>
  );
}
