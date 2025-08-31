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
import registryData from "../../../data/toolsRegistry.json";
import GeneratedMap from "./generated";

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

// mapping of known local components
const componentMap: Record<string, React.FC | undefined> = {
  "vehicle-compare": VehicleComparisonTool,
  "cost-split": PerPersonSplitter,
  "capacity-finder": CapacityFinder,
  "seat-fit": SeatFit,
  "byob-ice": BYOBPlanner,
  "itinerary-builder": ItineraryBuilder,
  "event-match": EventMatchmaker,
  "weather-alert": WeatherAlert,
  ...GeneratedMap,
};

const route = (id: string) => `/tools/${id}`;

const tools: ToolEntry[] = (registryData || []).map((d: ToolData) => {
  const href = d.href || route(d.id);
  const component = componentMap[d.id] || makeLinkComponent(href, `Open ${d.title}`);
  return {
    id: d.id,
    title: d.title,
    desc: d.desc,
    category: d.category as ToolCategory,
    href,
    component,
    keywords: d.keywords || [],
  } as ToolEntry;
});

export default tools;
