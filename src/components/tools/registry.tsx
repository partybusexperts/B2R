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
    desc: "Know your per-person cost instantly.",
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
];

export default tools;
