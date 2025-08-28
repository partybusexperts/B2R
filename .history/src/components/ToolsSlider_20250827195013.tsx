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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" role="dialog" aria-modal="true" aria-labelledby="tool-modal-title">
          <div className="relative z-10 w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-gray-200 text-gray-900 dark:bg-neutral-900 dark:text-neutral-100">
            {/* Close button (icon) */}
            <button
              onClick={() => setOpenId(null)}
              aria-label="Close"
              className="absolute top-2 right-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600 dark:hover:text-white"
            >
              ×
            </button>
            <div className="flex items-start gap-3 p-5 pb-4 border-b border-gray-200 dark:border-neutral-700">
              <div className="text-2xl" aria-hidden="true">{current.icon}</div>
              <div>
                <h3 id="tool-modal-title" className="text-xl font-semibold leading-snug">
                  {current.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-neutral-300">
                  {current.desc}
                </p>
              </div>
            </div>
            <div className="p-5 pt-4 overflow-y-auto max-h-[70vh] text-sm leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0">
              <Suspense fallback={<div className="text-sm text-gray-500 dark:text-neutral-400">Loading…</div>}>
                <div className="tool-modal-body">
                  {current.render()}
                </div>
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
  const [shareCopied, setShareCopied] = useState(false);

  function handleShare(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    try {
      const slug = tool.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const url = typeof window !== "undefined" ? `${window.location.origin}/tools#${slug}` : `https://yourdomain.com/tools#${slug}`;
      navigator.clipboard?.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1500);
    } catch {}
  }
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
        <div className="w-full flex items-center justify-center gap-3 mb-2">
          <a
            href="#"
            onClick={handleShare}
            className="text-sm text-blue-200 underline hover:text-blue-100 text-center"
            onMouseDown={e => e.stopPropagation()}
          >
            Share tool on your website
          </a>
          {shareCopied && <span className="text-green-400 text-sm">Copied!</span>}
        </div>
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
