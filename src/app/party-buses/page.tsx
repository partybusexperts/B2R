import React from "react";

import { fetchFleetVehicles } from "../../lib/server/fleetData";

import PartyBusesPageClient from "./PartyBusesClient";
import GlobalReviewStripServer from "../../components/reviews/GlobalReviewStripServer";
import ToolsSection from "@/components/home/ToolsSection";
import PartyBusEventsSection from "@/components/party-buses/PartyBusEventsSection";
import PartyBusFaqSection from "@/components/party-buses/PartyBusFaqSection";
import { PollsBoxByTag } from "@/components/PollsBoxByTag";

export default async function PartyBusesPage() {
  const fleet = await fetchFleetVehicles();
  const vehicles = [...(fleet["party-buses"] ?? [])].sort((a, b) => (a.capacityMax ?? 0) - (b.capacityMax ?? 0));

  return (
    <>
      <PartyBusesPageClient vehicles={vehicles} />
      <GlobalReviewStripServer />
      <section className="mx-auto mt-12 max-w-6xl space-y-6 px-4">
        <PollsBoxByTag
          tag="party-bus"
          title="Party Bus Trends"
          subtitle="Fresh rider takes on vibes, upgrades, and rules for modern party buses."
        />
        <PollsBoxByTag
          tag="wedding"
          title="Wedding Party Bus Polls"
          subtitle="See what wedding parties loved (or hated) about timelines, routes, and budgets."
        />
        <PollsBoxByTag
          tag="bachelorette"
          title="Bachelor & Bachelorette Polls"
          subtitle="Real groups sharing what they booked, what they skipped, and what they’d change."
        />
      </section>
      <ToolsSection />
      <PartyBusEventsSection />
      <PartyBusFaqSection />
    </>
  );
}



