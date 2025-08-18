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
    <section className="mx-auto max-w-6xl relative overflow-hidden py-8 md:py-12 animate-gradient bg-[linear-gradient(120deg,#e0e7ff_0%,#f0f9ff_50%,#e0e7ff_100%)]">
      {/* Decorative Confetti SVGs */}
      <svg className="absolute left-0 top-0 w-32 h-32 opacity-20 pointer-events-none animate-float-slow" viewBox="0 0 128 128" fill="none"><circle cx="32" cy="32" r="12" fill="#60a5fa"/><rect x="80" y="20" width="16" height="16" rx="4" fill="#fbbf24"/><circle cx="110" cy="60" r="8" fill="#f472b6"/></svg>
      <svg className="absolute right-0 bottom-0 w-40 h-40 opacity-20 pointer-events-none animate-float" viewBox="0 0 160 160" fill="none"><circle cx="120" cy="40" r="14" fill="#fbbf24"/><rect x="30" y="120" width="18" height="18" rx="5" fill="#60a5fa"/><circle cx="60" cy="60" r="10" fill="#f472b6"/></svg>
      {/* Mobile: horizontal scroll */}
      <div className="md:hidden -mx-4 px-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-4">
          {TOOLS.map(tool => (
            <ToolCard key={tool.id} tool={tool} onOpen={() => setOpenId(tool.id)} />
          ))}
        </div>
      </div>
      {/* Desktop: grid view */}
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
      className="bg-[#eaf0ff] rounded-2xl shadow-md border border-[#d7e2ff] p-4 flex flex-col justify-between min-w-[260px] w-[280px] md:w-auto md:min-w-0 h-56 transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-400 group cursor-pointer"
    >
      <div>
        <h3 className="text-blue-900 text-lg font-bold mb-1 flex items-center gap-2">
          <span className="text-2xl group-hover:animate-bounce">{tool.icon}</span>
          <span className="line-clamp-1">{tool.title}</span>
        </h3>
        <p className="text-gray-600 text-sm leading-snug line-clamp-3">
          {tool.desc}
        </p>
      </div>
      <div className="pt-3">
        <button
          onClick={onOpen}
          className="w-full rounded-xl bg-blue-700 text-white text-sm font-medium py-2 hover:bg-blue-800 transition shadow group-hover:shadow-lg"
        >
          Open
        </button>
      </div>
    </div>
  );
// Animations for gradient and confetti (add to globals.css if not present)
// .animate-gradient { background-size: 200% 200%; animation: gradientMove 8s ease-in-out infinite; }
// @keyframes gradientMove { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
// .animate-float { animation: float 6s ease-in-out infinite alternate; }
// .animate-float-slow { animation: float 10s ease-in-out infinite alternate; }
// @keyframes float { 0%{transform:translateY(0)} 100%{transform:translateY(-20px)} }
// .animate-bounce-slow { animation: bounce 2.5s infinite; }
// @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
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
