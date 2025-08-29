"use client";

import React from "react";
import PerPersonSplitter from "./PerPersonSplitter";
import SeatFit from './SeatFit';
import BYOBPlanner from './BYOBPlanner';
import ItineraryBuilder from './ItineraryBuilder';
import EventMatchmaker from './EventMatchmaker';
import WeatherAlert from './WeatherAlert';
import VehicleComparisonTool from '../VehicleComparisonTool';

export type ToolEntry = {
  id: string;
  title: string;
  desc: string;
  href?: string;
  component?: React.FC<any>;
};

function makeLinkComponent(href: string, label?: string): React.FC {
  return function LinkTool() {
    return (
      <div className="space-y-4">
        <p>{label || 'Open external tool'}</p>
        <a href={href} target="_blank" rel="noreferrer">Open Tool</a>
      </div>
    );
  };
}

const tools: ToolEntry[] = [
  { id: "instant-quote", title: "Instant Quote Tool", desc: "Get a real-time quote for your trip in seconds.", href: "/quote", component: makeLinkComponent('/quote', 'Open Instant Quote') },
  { id: "capacity-finder", title: "Vehicle Capacity Finder", desc: "Enter group size and see recommended vehicles.", href: "/tools", component: makeLinkComponent('/tools', 'Open Capacity Finder') },
  { id: "cost-split", title: "Cost Split Calculator", desc: "Know your per-person cost instantly.", component: PerPersonSplitter },
  { id: "vehicle-compare", title: "Vehicle Comparison", desc: "Compare prices & features across vehicle types.", component: VehicleComparisonTool },
  { id: "seat-fit", title: "Seat Fit Advisor", desc: "Estimate comfort per passenger.", component: SeatFit },
  { id: "byob-ice", title: "BYOB & Ice Planner", desc: "Estimate drinks and ice per person.", component: BYOBPlanner },
  { id: "itinerary-builder", title: "Itinerary Builder", desc: "Create a simple multi-stop timeline.", component: ItineraryBuilder },
  { id: "event-match", title: "Event Matchmaker", desc: "Suggest vehicle types by event.", component: EventMatchmaker },
  { id: "weather-alert", title: "Weather Alert", desc: "Check weather impact on your trip.", component: WeatherAlert },
];

export default tools;
  {
    id: "capacity-finder",
    title: "🚌 Vehicle Capacity Finder",
    desc: "Enter group size and see recommended vehicles.",
    href: "/tools",
    component: makeLinkComponent('/tools', 'Open Capacity Finder')
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
    component: makeLinkComponent('/tools', 'Open Date Price Checker')
  },
  {
    id: "vehicle-compare",
    title: "� Vehicle Comparison",
    desc: "Compare prices & features across party bus, limo, and coach.",
    href: "/tools",
    component: makeLinkComponent('/tools', 'Open Vehicle Comparison')
  },
  {
    id: "ask-expert",
    title: "💬 Ask a Pricing Expert",
    desc: "Get personalized help balancing budget and features.",
    href: "/tools",
    component: makeLinkComponent('/tools', 'Ask an Expert')
  },

  // New replacement / high-value tools
  {
    id: "seat-fit",
    title: "🪑 Quick Seat-Fit Advisor",
    desc: "Estimate comfort and recommended vehicle size per passenger.",
    component: SeatFit,
  },
  {
    id: "itinerary-builder",
    title: "�️ Group Itinerary Builder",
    desc: "Create a printable multi-stop timeline with durations and buffer times.",
    component: ItineraryBuilder,
  },
  {
    id: "byob-ice",
    title: "🍹 BYOB & Ice Planner",
    desc: "Estimate drinks and ice per person with preset party profiles.",
    component: BYOBPlanner,
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
  // Removed some legacy tools per request. Added a set of new utility tools below.
  {
    id: "group-scheduler",
    title: "⏱️ Group Scheduler",
    desc: "Auto-suggest start times and durations for multi-stop trips.",
    href: "/tools",
    component: makeLinkComponent('/tools', 'Open Group Scheduler')
  },
  {
    id: "pickup-optimizer",
    title: "� Pickup Optimizer",
    desc: "Optimize pickup order and reduce idle time between stops.",
    href: "/tools",
    component: makeLinkComponent('/tools', 'Open Pickup Optimizer')
  },
  {
    id: "accessibility-check",
    title: "♿ Accessibility Checker",
    desc: "Assess vehicle suitability for mobility or ADA needs.",
    href: "/tools",
    component: makeLinkComponent('/tools', 'Open Accessibility Checker')
  },
  {
    id: "storage-estimator",
    title: "📦 Luggage & Storage Estimator",
    desc: "Estimate cargo and luggage space needed for your group.",
    href: "/tools",
    component: makeLinkComponent('/tools', 'Open Storage Estimator')
  },
  {
    id: "music-setup",
    title: "🎵 Music & AV Planner",
    desc: "Recommend speaker setup, playlists, and AUX/BT options.",
    href: "/tools",
    component: makeLinkComponent('/tools', 'Open Music & AV Planner')
  },
  {
    id: "lighting-plan",
    title: "💡 Lighting & Ambience Planner",
    desc: "Suggest lighting presets for mood and safety on board.",
    href: "/tools",
    component: makeLinkComponent('/tools', 'Open Lighting Planner')
  },
  {
    id: "security-check",
    title: "🔒 Event Security Checklist",
    desc: "Quick risk checklist and vendor/hiring tips for large groups.",
    href: "/tools",
    component: makeLinkComponent('/tools', 'Open Security Checklist')
  },
  {
    id: "driver-tip-calc",
    title: "🙌 Driver Tip Calculator",
    desc: "Suggest gratuity amounts per party and per-person breakdowns.",
    href: "/tools",
    component: makeLinkComponent('/tools', 'Open Tip Calculator')
  },
  {
    id: "cancellation-policy",
    title: "❗ Cancellation Policy Finder",
    desc: "Compare common cancellation windows and refund rules.",
    href: "/tools",
    component: makeLinkComponent('/tools', 'Open Cancellation Finder')
  },
  {
    id: "permit-helper",
    title: "📝 Venue Permit Helper",
    desc: "Notes & links for permits, loading zones and venue contact tips.",
    href: "/resources",
    component: makeLinkComponent('/resources', 'Open Permit Helper')
  },
  {
    id: "pet-policy",
    title: "🐾 Pet & Service Animal Policy",
    desc: "Guidance on traveling with pets and service animals.",
    href: "/help",
    component: makeLinkComponent('/help', 'Open Pet Policy')
  },
  {
    id: "photo-permissions",
    title: "📸 Photo & Media Permissions",
    desc: "Quick release templates and venue photo tips.",
    href: "/resources",
    component: makeLinkComponent('/resources', 'Open Photo Permissions')
  },
  {
    id: "crew-size",
    title: "👥 Crew & Staff Estimator",
    desc: "Estimate additional staff or chaperones needed for events.",
    href: "/tools",
    component: makeLinkComponent('/tools', 'Open Crew Estimator')
  },
  {
    id: "alcohol-safety",
    title: "🛡️ Alcohol Safety Guide",
    desc: "Recommendations for responsible alcohol service and liability reduction.",
    href: "/help",
    component: makeLinkComponent('/help', 'Open Alcohol Safety Guide')
  },
  {
    id: "green-choice",
    title: "� Green Travel Advisor",
    desc: "Suggest eco-friendly vehicle and routing choices to reduce footprint.",
    href: "/tools",
    component: makeLinkComponent('/tools', 'Open Green Travel Advisor')
  },
  {
    id: "local-venues",
    title: "📍 Local Venues & Parking Tips",
    desc: "Quick notes on popular venues and parking/entry tips.",
    href: "/resources",
    component: makeLinkComponent('/resources', 'Open Local Venues')
  },
  {
    id: "faq-popper",
    title: "❓ Quick FAQ Popper",
    desc: "Contextual answers for the most common booking questions.",
    href: "/help",
    component: makeLinkComponent('/help', 'Open FAQs')
  },
];

export default tools;
