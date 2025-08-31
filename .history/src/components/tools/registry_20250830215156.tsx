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
// EmbedTool (iframe) is intentionally not used for tools on the Tools page
// because tools should render as native modal content. Keep the file import if
// other parts of the app still rely on it.
// EmbedTool intentionally not used for modal-based tools on the Tools page.
// Keep the file around for other pages which still render external iframes.
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
  modalSize?: string;         // optional tailwind max-w class for modal sizing
  keywords?: string[];        // extra search terms
};

// ToolPlaceholder is rendered when a tool has no native React component yet.
function ToolPlaceholder({ href, title, desc }: { href: string; title?: string; desc?: string }) {
  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <h3 className="text-2xl font-extrabold text-blue-900 mb-2">{title || 'Tool'}</h3>
      {desc && <p className="text-blue-700 mb-4">{desc}</p>}
      <div className="rounded-lg bg-blue-50 p-4 border border-blue-100 text-sm text-blue-800">
        This tool doesn&apos;t have an embedded React implementation yet. You can
        open the tool page in a new tab if you need to view the original
        content.
      </div>
      <div className="mt-4">
        <a
          className="inline-block rounded px-3 py-2 bg-blue-700 text-white font-medium"
          href={href}
          target="_blank"
          rel="noreferrer"
        >
          Open tool page
        </a>
      </div>
    </div>
  );
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

// makeLinkComponent now returns a modal-friendly React component. If the
// tool already has a native component in componentMap we render that; if not
// we render the ToolPlaceholder (no iframe / external page inside modal).
function makeLinkComponent(id: string, href: string, title?: string, desc?: string): React.FC {
  return function LinkToolComponent() {
    const C = componentMap[id];
    if (C) return <C />;
    return <ToolPlaceholder href={href} title={title} desc={desc} />;
  };
}

const tools: ToolEntry[] = (registryData || []).map((d: ToolData) => {
  const href = d.href || route(d.id);
  const component = componentMap[d.id] || makeLinkComponent(d.id, href, d.title, d.desc);
  return {
    id: d.id,
    title: d.title,
    desc: d.desc,
    category: d.category as ToolCategory,
    href,
  modalSize: (d as any).modalSize,
    component,
    keywords: d.keywords || [],
  } as ToolEntry;
});

export default tools;
