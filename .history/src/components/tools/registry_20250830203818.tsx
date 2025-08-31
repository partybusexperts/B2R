"use client";

import React from "react";
import PerPersonSplitter from "./PerPersonSplitter";
import SeatFit from "./SeatFit";
import BYOBPlanner from "./BYOBPlanner";
import ItineraryBuilder from "./ItineraryBuilder";
import EventMatchmaker from "./EventMatchmaker";
import WeatherAlert from "./WeatherAlert";
import VehicleComparisonTool from "../VehicleComparisonTool";
import CapacityFinder from "./CapacityFinder";
import EmbedTool from "./EmbedTool";

export type ToolCategory =
  | "Compare & Choose"
  | "Pricing & Savings"
  | "Route & Timing"
  | "Venues & Logistics"
  | "Policies & Risk"
  | "Capacity & Seating"
  | "Amenities & Experience"
  | "Planning & Coordination";

export const CATEGORY_ORDER: ToolCategory[] = [
  "Compare & Choose",
  "Pricing & Savings",
  "Route & Timing",
  "Venues & Logistics",
  "Policies & Risk",
  "Capacity & Seating",
  "Amenities & Experience",
  "Planning & Coordination",
];

export type ToolEntry = {
  id: string;                 // slug (unique)
  title: string;              // display title
  desc: string;               // short description
  category: ToolCategory;     // section
  href?: string;              // optional route to open
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: React.FC<any>;  // optional component to render in modals/pages
  keywords?: string[];        // extra search terms
};

function makeLinkComponent(href: string, label?: string): React.FC {
  return function LinkToolComponent() {
    return <EmbedTool href={href} label={label} />;
  };
}
const route = (id: string) => `/tools/${id}`;
const L = (
  id: string,
  title: string,
  desc: string,
  category: ToolCategory,
  extraHref?: string
): ToolEntry => ({
  id,
  title,
  desc,
  category,
  href: extraHref || route(id),
  component: makeLinkComponent(extraHref || route(id), `Open ${title}`),
});

// ===== All 60 tools (fixed order) =====
const tools: ToolEntry[] = [
  // Compare & Choose
  { id: "vehicle-compare", title: "Vehicle Comparison", desc: "Compare vehicle types side-by-side.", category: "Compare & Choose", component: VehicleComparisonTool },
  L("special-request-matcher", "Special Request Matcher", "Find vehicles that allow poles, restrooms, ADA, etc.", "Compare & Choose"),
  L("good-better-best-package-builder", "Good–Better–Best Package Builder", "Offer tiered packages so guests can compare value.", "Compare & Choose"),
  L("event-match", "Event Matchmaker", "Recommend vehicles by occasion and group vibe.", "Compare & Choose", route("event-match")),
  L("return-trip-price-compare", "Return-Trip Price Compare", "1-way vs wait-and-return vs two 1-ways.", "Compare & Choose"),
  L("hours-vs-mileage-optimizer", "Hours vs Mileage Optimizer", "Find the cheapest combo for your itinerary.", "Compare & Choose"),

  // Pricing & Savings
  { id: "cost-split", title: "Cost Split Calculator", desc: "Split the total cost per person.", category: "Pricing & Savings", component: PerPersonSplitter },
  L("budget-guardrail-planner", "Budget Guardrail Planner", "Set a max spend and see best-fit options.", "Pricing & Savings"),
  L("surge-peak-predictor", "Surge & Peak Predictor", "Demand index by date & time.", "Pricing & Savings"),
  L("off-peak-saver-finder", "Off-Peak Saver Finder", "Cheapest days/hours to book.", "Pricing & Savings"),
  L("minimum-hours-calculator", "Minimum Hours Calculator", "Typical market minimums by vehicle/date.", "Pricing & Savings"),
  L("overtime-risk-meter", "Overtime Risk Meter", "Likelihood your plan runs long; plan a buffer.", "Pricing & Savings"),
  L("seasonality-heatmap", "Seasonality Heatmap", "Month × weekday price pressure grid.", "Pricing & Savings"),
  L("local-event-demand-radar", "Local Event Demand Radar", "Nearby events that spike demand/traffic.", "Pricing & Savings"),
  L("rain-plan-builder", "Rain Plan Builder", "Backup timings & savings if weather shifts.", "Pricing & Savings"),
  L("cancellation-flex-score", "Cancellation Flex Score", "Refund vs reschedule friendliness.", "Pricing & Savings"),
  L("pickup-radius-surcharge-checker", "Pickup Radius Surcharge Checker", "Fees beyond base service area.", "Pricing & Savings"),
  L("fuel-surcharge-calculator", "Fuel Surcharge Calculator", "Estimate fuel add-ons by distance/market.", "Pricing & Savings"),
  L("tolls-road-fees-estimator", "Tolls & Road Fees Estimator", "Rough in tolls, bridges, venue fees.", "Pricing & Savings"),
  L("multi-vehicle-split-planner", "Multi-Vehicle Split Planner", "1 big vs multiple smaller vehicles.", "Pricing & Savings"),

  // Route & Timing
  L("drive-time-estimator", "Drive Time Estimator", "Traffic-aware travel time between stops.", "Route & Timing"),
  L("multi-stop-route-optimizer", "Multi-Stop Route Optimizer", "Reorder stops to cut hours & cost.", "Route & Timing"),
  L("pick-up-window-recommender", "Pick-Up Window Recommender", "Best start/end vs traffic & venue rules.", "Route & Timing"),
  L("boarding-time-calculator", "Boarding Time Calculator", "Load/unload time by group size.", "Route & Timing"),
  L("door-to-venue-walking-time", "Door-to-Venue Walking Time", "Drop point to entrance ETA.", "Route & Timing"),
  L("extra-stops-cost-calculator", "Extra Stops Cost Calculator", "Price impact per extra stop.", "Route & Timing"),
  L("deadhead-distance-estimator", "Deadhead Distance Estimator", "Garage-to-pickup miles affecting price.", "Route & Timing"),
  L("bar-hop-time-calculator", "Bar-Hop Time Calculator", "Dwell/travel math for 3–6 stops.", "Route & Timing"),
  L("sunset-timing-advisor", "Sunset Timing Advisor", "Golden hour on your date & city.", "Route & Timing"),
  L("shuttle-frequency-planner", "Shuttle Frequency Planner", "Loops needed to move guests on time.", "Route & Timing"),

  // Venues & Logistics
  L("venue-coordination-script", "Venue Coordination Script", "Call script: staging, entrance, contacts.", "Venues & Logistics"),
  L("curbside-drop-strategy", "Curbside Drop Strategy", "Best drop/pick spots + turnaround plan.", "Venues & Logistics"),
  L("stadium-concert-playbook", "Stadium/Concert Playbook", "Bag rules, exits, traffic tips.", "Venues & Logistics"),
  L("airport-transfer-wizard", "Airport Transfer Wizard", "Terminal rules & timing guidance.", "Venues & Logistics"),
  L("pickup-point-street-view-preview", "Pickup Point Street View Preview", "Peek curb space & entrances.", "Venues & Logistics"),
  L("trailer-add-on-recommender", "Trailer Add-On Recommender", "Add trailer for luggage/gear.", "Venues & Logistics"),

  // Policies & Risk
  L("alcohol-open-container-policy-checker", "Alcohol/Open-Container Policy Checker", "BYOB legality by city/state.", "Policies & Risk"),
  L("family-minors-policy-advisor", "Family & Minors Policy Advisor", "Supervision & car seat rules.", "Policies & Risk"),
  L("driver-break-compliance-planner", "Driver Break & Compliance Planner", "Plan legal rest windows.", "Policies & Risk"),
  L("noise-curfew-checker", "Noise Curfew Checker", "Neighborhood quiet hours.", "Policies & Risk"),
  L("cleaning-fee-risk-checker", "Cleaning Fee Risk Checker", "Glitter, confetti, smoke, mud risks.", "Policies & Risk"),
  L("decorations-policy-checker", "Decorations Policy Checker", "What décor is allowed.", "Policies & Risk"),
  L("pet-policy-checker", "Pet Policy Checker", "Which trips allow pets.", "Policies & Risk"),
  L("ada-accessibility-checker", "ADA Accessibility Checker", "Lifts, steps, aisle clearances.", "Policies & Risk"),

  // Capacity & Seating
  { id: "capacity-finder", title: "Capacity Finder", desc: "Find vehicles by group size.", category: "Capacity & Seating", component: CapacityFinder },
  { id: "seat-fit", title: "Seat Fit Advisor", desc: "Estimate comfort per passenger.", category: "Capacity & Seating", component: SeatFit },
  L("seating-map-designer", "Seating Map Designer", "Lay out seats to balance comfort & weight.", "Capacity & Seating"),
  L("capacity-overflow-planner", "Capacity Overflow Planner", "When to book 2 vehicles vs 1 bigger.", "Capacity & Seating"),
  L("luggage-gear-fit-guide", "Luggage & Gear Fit Guide", "Bags, coolers, instruments that fit.", "Capacity & Seating"),

  // Amenities & Experience
  { id: "byob-ice", title: "BYOB & Ice Planner", desc: "Estimate drinks and ice per person.", category: "Amenities & Experience", component: BYOBPlanner },
  L("qr-playlist-generator", "QR Playlist Generator", "Share your trip playlist via QR code.", "Amenities & Experience"),
  L("lighting-theme-selector", "Lighting & Theme Selector", "Choose interior mood presets.", "Amenities & Experience"),
  L("scenic-photo-stop-recommender", "Scenic Photo-Stop Recommender", "Route-friendly photo ops.", "Amenities & Experience"),
  L("comfort-planner", "Comfort Planner", "Climate, attire, hydration & A/C tips.", "Amenities & Experience"),

  // Planning & Coordination
  { id: "itinerary-builder", title: "Itinerary Builder", desc: "Build a simple multi-stop plan.", category: "Planning & Coordination", component: ItineraryBuilder },
  { id: "event-match", title: "Event Matchmaker", desc: "Suggest vehicle types by event.", category: "Planning & Coordination", component: EventMatchmaker },
  { id: "weather-alert", title: "Weather Alert", desc: "Check weather impact for dates.", category: "Planning & Coordination", component: WeatherAlert },
  L("group-rsvp-headcount-tracker", "Group RSVP & Headcount Tracker", "Confirm riders & auto-update counts.", "Planning & Coordination"),
  L("pickup-readiness-checklist", "Pickup Readiness Checklist", "IDs, attire, ice, chargers—be ready.", "Planning & Coordination"),
  L("event-duration-wizard", "Event Duration Wizard", "Suggested total hours by occasion.", "Planning & Coordination"),
  L("wedding-timeline-builder", "Wedding Timeline Builder", "Ceremony → photos → reception flow.", "Planning & Coordination"),
];

export default tools;
