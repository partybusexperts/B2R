import React from "react";
import FleetFaqSection from "@/components/fleet/FleetFaqSection";

export default function CoachFaqSection() {
  return (
    <FleetFaqSection
      pageSlug="coach-buses"
      eyebrow="Coach & Charter FAQ"
      heading="Coach bus logistics, timing &amp; compliance"
      description="Search answers about driver hours, luggage staging, ADA requests, rest stops, and multi-day itineraries before you submit your manifest."
      searchInputId="coach-faq-search"
      searchLabel="Search coach & charter FAQ"
      searchPlaceholder='Try "driver hours", "rest stops", "luggage"…'
    />
  );
}
