import PerPersonSplitter from "./PerPersonSplitter";
import React from "react";
import PerPersonSplitter from "./PerPersonSplitter";
import React from "react";
import SeatFit from './SeatFit';
import BYOBPlanner from './BYOBPlanner';
import ItineraryBuilder from './ItineraryBuilder';
import EventMatchmaker from './EventMatchmaker';
import WeatherAlert from './WeatherAlert';

export type ToolEntry = {
  id: string;
  title: string;
  desc: string;
  href?: string;
  component?: React.FC;
};

function makeLinkComponent(href: string, label?: string): React.FC {
  return function LinkTool() {
    return (
      <div className="space-y-4">
        <p className="text-blue-100">{label || 'Open external tool'}</p>
        <a className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-bold bg-white text-blue-900 border border-blue-200 hover:bg-blue-50 transition" href={href} target="_blank" rel="noreferrer">Open Tool</a>
      </div>
    );
  };
}

const tools: ToolEntry[] = [
    title: "⚡ Instant Quote Tool",
    desc: "Get a real-time quote for your trip in seconds.",
    href: "/quote",
  },
    href: "/quote",
    component: makeLinkComponent('/quote', 'Open Instant Quote')
    id: "capacity-finder",
    title: "🚌 Vehicle Capacity Finder",
    desc: "Enter group size and see recommended vehicles.",
    href: "/tools",
  },
    href: "/tools",
    component: makeLinkComponent('/tools', 'Open Capacity Finder')
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
    href: "/tools",
    component: makeLinkComponent('/tools', 'Open Date Price Checker')
    id: "zip-lookup",
    title: "📍 Zip Code Price Lookup",
    desc: "Find pricing for your city or zip code instantly.",
    href: "/tools",
  },
    href: "/tools",
    component: makeLinkComponent('/tools', 'Open Zip Lookup')
    id: "hourly-flat",
    title: "🕒 Hourly vs. Flat Rate",
    desc: "Compare hourly and flat-rate options for your itinerary.",
    href: "/tools",
  },
    href: "/tools",
    component: makeLinkComponent('/tools', 'Open Hourly vs Flat')
    id: "vehicle-compare",
    title: "🚐 Vehicle Comparison",
    desc: "Compare prices & features across party bus, limo, and coach.",
    href: "/tools",
  },
    href: "/tools",
    component: makeLinkComponent('/tools', 'Open Vehicle Comparison')
    id: "fee-estimator",
    title: "🧾 Fee & Tax Estimator",
    desc: "Rough in taxes, fees, and gratuity for a final out-the-door total.",
    href: "/tools",
  },
    href: "/tools",
    component: makeLinkComponent('/tools', 'Open Fee & Tax Estimator')
    id: "ask-expert",
    title: "💬 Ask a Pricing Expert",
    desc: "Get personalized help balancing budget and features.",
    href: "/tools",
  },
    href: "/tools",
    component: makeLinkComponent('/tools', 'Ask an Expert')
  // New replacement / high-value tools
  {
    id: "seat-fit",
    title: "🪑 Quick Seat-Fit Advisor",
    desc: "Estimate comfort and recommended vehicle size per passenger.",
    href: "/tools",
    component: makeLinkComponent('/tools', 'Open Promo Finder')
  },
  {
    id: "itinerary-builder",
    title: "🗺️ Group Itinerary Builder",
    desc: "Create a printable multi-stop timeline with durations and buffer times.",
    href: "/resources",
    component: makeLinkComponent('/resources', 'Open Local Venues')
  },
  {
    id: "byob-ice",
    title: "🍹 BYOB & Ice Planner",
    desc: "Estimate drinks and ice per person with preset party profiles.",
    href: "/help",
    component: makeLinkComponent('/help', 'Open FAQs')
  },
  {
    id: "event-match",
    title: "🎯 Event Matchmaker",
    desc: "Suggest vehicle types by event and group size to simplify choices.",
  component: EventMatchmaker,
  },
  {
    id: "weather-alert",
    title: "🌤️ Weather Impact Alert",
    desc: "Check weather for your event date and get impact advice.",
  component: WeatherAlert,
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
