import React from "react";

import { fetchFleetVehicles } from "../../lib/server/fleetData";

import CoachBusesClient from "./CoachBusesClient";
import GlobalReviewStripServer from "../../components/reviews/GlobalReviewStripServer";
import ToolsSection from "@/components/home/ToolsSection";
import PartyBusEventsSection from "@/components/party-buses/PartyBusEventsSection";
import CoachFaqSection from "@/components/coach-buses/CoachFaqSection";
import { PollsBoxByTag } from "@/components/PollsBoxByTag";

export default async function CoachBusesPage() {
  const fleet = await fetchFleetVehicles();
  const vehicles = [...(fleet["coach-buses"] ?? [])].sort((a, b) => (a.capacityMax ?? 0) - (b.capacityMax ?? 0));

  return (
    <>
      <CoachBusesClient vehicles={vehicles} />
      <GlobalReviewStripServer />
      <section className="mx-auto mt-12 max-w-6xl space-y-6 px-4">
        <PollsBoxByTag
          tag="motorcoach"
          title="Motorcoach Planner Polls"
          subtitle="Team travel, rest-stop timing, luggage hacks—straight from large charter groups."
        />
        <PollsBoxByTag
          tag="mini-coach"
          title="Mini Coach & Shuttle Polls"
          subtitle="See how mid-size groups set pickup windows, ADA needs, and multi-stop shuttles."
        />
        <PollsBoxByTag
          tag="corporate"
          title="Corporate Charter Debates"
          subtitle="Executives and admins weighing in on budgets, onboard WiFi, and multi-city itineraries."
        />
      </section>
      <ToolsSection />
      <PartyBusEventsSection category="coach-buses" />
      <CoachFaqSection />
    </>
  );
}
