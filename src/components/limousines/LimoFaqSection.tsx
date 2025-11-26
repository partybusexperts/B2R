import React from "react";
import FleetFaqSection from "@/components/fleet/FleetFaqSection";

export default function LimoFaqSection() {
  return (
    <FleetFaqSection
      pageSlug="limousines"
      eyebrow="Limousine FAQ"
      heading="Everything about limo timelines &amp; etiquette"
      description="Find answers about photo timing, multi-stop routes, gratuity, and formal arrival etiquette before you lock in your limo."
      searchInputId="limousine-faq-search"
      searchLabel="Search limousine FAQ"
      searchPlaceholder='Try "prom rules", "wedding photo buffer", "pickup windows"…'
    />
  );
}
