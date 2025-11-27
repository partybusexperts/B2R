import React from "react";

import { fetchFleetVehicles } from "../../lib/server/fleetData";

import PartyBusesPageClient from "./PartyBusesClient";
import GlobalReviewStripServer from "../../components/reviews/GlobalReviewStripServer";
import PartyBusPollsSection from "../../components/polls/PartyBusPollsSection";
import ToolsSection from "@/components/home/ToolsSection";
import PartyBusEventsSection from "@/components/party-buses/PartyBusEventsSection";
import PartyBusFaqSection from "@/components/party-buses/PartyBusFaqSection";

export default async function PartyBusesPage() {
  const fleet = await fetchFleetVehicles();
  const vehicles = [...(fleet["party-buses"] ?? [])].sort((a, b) => (a.capacityMax ?? 0) - (b.capacityMax ?? 0));

  return (
    <>
      <PartyBusesPageClient vehicles={vehicles} />
      <GlobalReviewStripServer />
      <PartyBusPollsSection />
      <ToolsSection />
      <PartyBusEventsSection />
      <PartyBusFaqSection />
    </>
  );
}



