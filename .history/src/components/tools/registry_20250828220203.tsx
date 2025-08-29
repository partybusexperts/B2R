import PerPersonSplitter from "./PerPersonSplitter";
import React from "react";

export type ToolEntry = {
  id: string;
  title: string;
  desc: string;
  href?: string;
  component?: React.FC;
};

const tools: ToolEntry[] = [
  {
    id: "instant-quote",
    title: "⚡ Instant Quote Tool",
    desc: "Get a real-time quote for your trip in seconds.",
    href: "/quote",
  },
  {
    id: "capacity-finder",
    title: "🚌 Vehicle Capacity Finder",
    desc: "Enter group size and see recommended vehicles.",
    href: "/tools",
  },
  {
    id: "cost-split",
    title: "💸 Cost Split Calculator",
    desc: "Know your per-person cost instantly, with tip/fees/rounding options.",
    component: PerPersonSplitter,
  },
  {
    id: "date-checker",
    title: "📅 Date Price Checker",
    desc: "See how prices shift by weekday, season, or holiday.",
    href: "/tools",
  },
  {
    id: "zip-lookup",
    title: "📍 Zip Code Price Lookup",
    desc: "Find pricing for your city or zip code instantly.",
    href: "/tools",
  },
  {
    id: "hourly-flat",
    title: "🕒 Hourly vs. Flat Rate",
    desc: "Compare hourly and flat-rate options for your itinerary.",
    href: "/tools",
  },
  {
    id: "vehicle-compare",
    title: "🚐 Vehicle Comparison",
    desc: "Compare prices & features across party bus, limo, and coach.",
    href: "/tools",
  },
  {
    id: "fee-estimator",
    title: "🧾 Fee & Tax Estimator",
    desc: "Rough in taxes, fees, and gratuity for a final out-the-door total.",
    href: "/tools",
  },
  {
    id: "ask-expert",
    title: "💬 Ask a Pricing Expert",
    desc: "Get personalized help balancing budget and features.",
    href: "/tools",
  },

  // New replacement / high-value tools
  {
    id: "seat-fit",
    title: "🪑 Quick Seat-Fit Advisor",
    desc: "Estimate comfort and recommended vehicle size per passenger.",
    href: "/tools",
  },
  {
    id: "itinerary-builder",
    title: "🗺️ Group Itinerary Builder",
    desc: "Create a printable multi-stop timeline with durations and buffer times.",
    href: "/tools",
  },
  {
    id: "byob-ice",
    title: "🍹 BYOB & Ice Planner",
    desc: "Estimate drinks and ice per person with preset party profiles.",
    href: "/tools",
  },
  {
    id: "event-match",
    title: "🎯 Event Matchmaker",
    desc: "Suggest vehicle types by event and group size to simplify choices.",
    href: "/tools",
  },
  {
    id: "weather-alert",
    title: "🌤️ Weather Impact Alert",
    desc: "Check weather for your event date and get impact advice.",
    href: "/tools",
  },
  {
    id: "promo-finder",
    title: "🏷️ Promo Finder",
    desc: "Apply available company promos—admin-controlled discounts.",
    href: "/tools",
  },
  {
    id: "local-venues",
    title: "📍 Local Venues & Parking Tips",
    desc: "Quick notes on popular venues and parking/entry tips.",
    href: "/resources",
  },
  {
    id: "faq-popper",
    title: "❓ Quick FAQ Popper",
    desc: "Contextual answers for the most common booking questions.",
    href: "/help",
  },
];

export default tools;
