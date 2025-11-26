import React from "react";

import { fetchFleetVehicles } from "../../lib/server/fleetData";

import CoachBusesClient from "./CoachBusesClient";
import GlobalReviewStripServer from "../../components/reviews/GlobalReviewStripServer";
import CoachBusPollsSection from "../../components/polls/CoachBusPollsSection";
import ToolsSection from "@/components/home/ToolsSection";
import PartyBusEventsSection from "@/components/party-buses/PartyBusEventsSection";
import CoachFaqSection from "@/components/coach-buses/CoachFaqSection";

export default async function CoachBusesPage() {
  const fleet = await fetchFleetVehicles();
  const vehicles = [...(fleet["coach-buses"] ?? [])].sort((a, b) => (a.capacityMax ?? 0) - (b.capacityMax ?? 0));

  return (
    <>
      <CoachBusesClient vehicles={vehicles} />
      <GlobalReviewStripServer />
      <CoachBusPollsSection />
      <ToolsSection />
      <PartyBusEventsSection category="coach-buses" />
      <CoachFaqSection />
    </>
  );
}
