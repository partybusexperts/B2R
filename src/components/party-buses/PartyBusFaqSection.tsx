import React from "react";
import FleetFaqSection from "@/components/fleet/FleetFaqSection";

export default function PartyBusFaqSection() {
  return (
    <FleetFaqSection
      pageSlug="party-buses"
      eyebrow="Party Bus FAQ"
      heading="Everything about party bus bookings"
      description="Search through the most common questions groups ask about BYOB rules, pricing windows, pickup timing, and post-ride cleanup before locking in a bus."
      searchInputId="party-bus-faq-search"
      searchLabel="Search party bus FAQ"
      searchPlaceholder='Try "BYOB", "pricing", "pickup windows"…'
    />
  );
}
