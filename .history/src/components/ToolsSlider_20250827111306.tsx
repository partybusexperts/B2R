"use client";
// ...existing code...
import React, { useState, Suspense, lazy } from "react";
import type { JSX } from "react";

// Lazy-load heavy tools so they don't affect card sizing/layout
const CapacityFinderTool = lazy(() => import("../components/CapacityFinderTool"));
const VehicleComparisonTool = lazy(() => import("../components/VehicleComparisonTool"));
const BudgetEstimator = lazy(() => import("../components/BudgetEstimator"));
const PlaylistStarter = lazy(() => import("../components/PlaylistStarter"));
const TailgateChecklist = lazy(() => import("../components/TailgateChecklist"));

const RoutePlanner = lazy(() => import("../components/RoutePlanner"));
const WeatherChecker = lazy(() => import("../components/WeatherChecker"));
const AccessibilityGuide = lazy(() => import("../components/AccessibilityGuide"));
const EventSync = lazy(() => import("../components/EventSync"));

type ToolId =
  | "capacity"
  | "compare"
  | "budget"
  | "playlist"
  | "tailgate"
  | "route"
  | "weather"
  | "accessibility"
  | "eventsync";

const TOOLS: {
  id: ToolId;
  title: string;
  icon: string;
  desc: string;
  render: () => JSX.Element;
}[] = [
  {
    id: "capacity",
    title: "Vehicle Capacity Finder",
    icon: "🚌",
    desc: "Enter your group size to see best-fit vehicles.",
    render: () => <CapacityFinderTool />,
  },
  {
    id: "compare",
    title: "Vehicle Comparison",
    icon: "⚖️",
    desc: "Pick two vehicle types and compare quickly.",
    render: () => <VehicleComparisonTool />,
  },
  {
    id: "budget",
    title: "Budget Estimator",
    icon: "💰",
    desc: "Get a fast ballpark price for your trip.",
    render: () => <BudgetEstimator />,
  },
  {
    id: "playlist",
    title: "Playlist Starter",
    icon: "🎶",
    desc: "One-click Spotify vibes for any occasion.",
    render: () => <PlaylistStarter />,
  },
  {
    id: "tailgate",
    title: "Tailgate Checklist",
    icon: "🏈",
    desc: "Everything you need for game day.",
    render: () => <TailgateChecklist />,
  },
  {
    id: "route",
    title: "Route Planner",
    icon: "🗺️",
    desc: "Map your trip and optimize stops easily.",
    render: () => <RoutePlanner />,
  },
  {
    id: "weather",
    title: "Weather Checker",
    icon: "🌤️",
    desc: "Check the forecast for your trip dates.",
    render: () => <WeatherChecker />,
  },
  {
    id: "accessibility",
    title: "Accessibility Guide",
    icon: "♿",
    desc: "Find accessible vehicles and trip tips.",
    render: () => <AccessibilityGuide />,
  },
  {
    id: "eventsync",
    title: "Event Sync",
    icon: "📅",
    desc: "Sync your trip with calendars and events.",
    render: () => <EventSync />,
  },
];


export default function ToolsShowcase() {
  const [openId, setOpenId] = useState<ToolId | null>(null);
  const current = TOOLS.find(t => t.id === openId);

  return (
    <section
      id="tools"
      data-section-title="Tools"
      className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl my-12 py-12"
    >
      {/* Visible heading for TOC + accessibility (was missing -> section omitted from nav) */}
      <h2 className="text-3xl font-extrabold tracking-tight text-white px-6 mb-8">
        Trip Planning Tools
      </h2>
      {/* Mobile: horizontal scroll */}
      <div className="md:hidden -mx-4 px-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-4">
          {TOOLS.map(tool => (
            <ToolCard key={tool.id} tool={tool} onOpen={() => setOpenId(tool.id)} />
          ))}
        </div>
      </div>
      {/* Desktop: grid view */}
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {TOOLS.map(tool => (
          <ToolCard key={tool.id} tool={tool} onOpen={() => setOpenId(tool.id)} />
        ))}
      </div>
      {/* Modal for tool details */}
      {openId && current && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" role="dialog" aria-modal="true">
          <div className="relative z-10 w-full max-w-3xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                <span className="mr-2 animate-bounce-slow">{current.icon}</span>
                {current.title}
              </h3>
              <button
                className="rounded-md px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200"
                onClick={() => setOpenId(null)}
                aria-label="Close"
              >
                Close
              </button>
            </div>
            <div className="p-4">
              <Suspense fallback={<div className="text-sm text-gray-500">Loading…</div>}>
                {current.render()}
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


function ToolCard({
  tool,
  onOpen,
}: {
  tool: {
    id: string;
    title: string;
    icon: string;
    desc: string;
  };
  onOpen: () => void;
}) {
  return (
    <div
      className="flex flex-col bg-blue-950/90 rounded-2xl shadow-2xl border border-blue-500/20 p-8 hover:scale-105 transition-transform text-white min-h-[340px] cursor-pointer"
      onClick={onOpen}
    >
      <div>
        <h3 className="text-2xl font-bold mb-2 text-blue-200 font-serif flex items-center gap-2">
          <span className="text-2xl group-hover:animate-bounce">{tool.icon}</span>
          <span className="line-clamp-1">{tool.title}</span>
        </h3>
        <p className="text-blue-100 mb-4 font-sans text-base leading-snug line-clamp-3">
          {tool.desc}
        </p>
      </div>
      <div className="pt-3 mt-auto">
        <button
          onClick={onOpen}
          className="w-full bg-gradient-to-r from-blue-700 to-green-500 text-white p-2 rounded font-bold mb-2 hover:scale-105 transition-transform shadow-lg"
        >
          Open
        </button>
      </div>
    </div>
  );
}

/* Optional: hide scrollbars for mobile strip (add to globals.css if needed)
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
*/

/*
TODO:
- Implement the new tool components: RoutePlanner, WeatherChecker, AccessibilityGuide, EventSync in ../components/
- If icons or descriptions need refinement, update as needed.
*/
