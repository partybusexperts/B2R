"use client";

import * as React from "react";

type QuickPlannerProps = {
  eventSlug: string;
};

function clampInt(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function parseAndClampInt(
  raw: string,
  min: number,
  max: number,
  fallback: number,
) {
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed)) return fallback;
  return clampInt(parsed, min, max);
}

export default function EventQuickPlanner({ eventSlug }: QuickPlannerProps) {
  // TODO: Customize quick planner for different event types.
  console.log("EventQuickPlanner for event:", eventSlug);

  const [groupSize, setGroupSize] = React.useState("22");
  const [stops, setStops] = React.useState("3");
  const [avgQueueMin, setAvgQueueMin] = React.useState("35");
  const [travelBetweenStopsMin, setTravelBetweenStopsMin] =
    React.useState("20");
  const [onSiteTimeMin, setOnSiteTimeMin] = React.useState("40");

  const computed = React.useMemo(() => {
    const group = parseAndClampInt(groupSize, 1, 200, 22);
    const numStops = parseAndClampInt(stops, 1, 6, 3);
    const queue = parseAndClampInt(avgQueueMin, 10, 120, 35);
    const travel = parseAndClampInt(travelBetweenStopsMin, 5, 60, 20);
    const onsite = parseAndClampInt(onSiteTimeMin, 20, 90, 40);

    // Heuristic timing: per stop = queue + onsite, between stops travel, plus a small coordination buffer.
    const coordinationBufferMin = 20;
    const totalMin =
      numStops * (queue + onsite) +
      Math.max(0, numStops - 1) * travel +
      coordinationBufferMin;
    const hours = Math.max(2, Math.round(totalMin / 60));

    // Simple vehicle recommendation by group size.
    const vehicle =
      group <= 10
        ? "Stretch Limo (8-10)"
        : group <= 22
          ? "Mini Party Bus (15-22)"
          : group <= 30
            ? "Party Bus (24-30)"
            : group <= 40
              ? "Large Party Bus (35-40)"
              : "Coach Bus (40+)";

    return {
      group,
      hours,
      vehicle,
    };
  }, [avgQueueMin, groupSize, onSiteTimeMin, stops, travelBetweenStopsMin]);

  return (
    <aside
      className="rounded-3xl border border-blue-800/30 bg-[#173264] p-6
        shadow-xl"
    >
      <h3
        className="text-2xl font-extrabold text-white font-serif tracking-tight
          mb-1"
      >
        Quick Planner
      </h3>
      <p className="text-blue-100/90 text-sm mb-4">
        Estimate hours + best vehicle for your group.
      </p>
      <div className="space-y-3">
        <label className="block">
          <span className="text-sm text-blue-100/90">Group size</span>
          <input
            type="number"
            min={1}
            max={200}
            className="mt-1 w-full rounded-xl bg-[#0f1f46] border
              border-blue-800/40 px-4 py-2 text-white"
            value={groupSize}
            onChange={(e) => setGroupSize(e.target.value)}
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm text-blue-100/90">Haunted houses</span>
            <input
              type="number"
              min={1}
              max={6}
              className="mt-1 w-full rounded-xl bg-[#0f1f46] border
                border-blue-800/40 px-4 py-2 text-white"
              value={stops}
              onChange={(e) => setStops(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm text-blue-100/90">
              Avg. queue per stop (min)
            </span>
            <input
              type="number"
              min={10}
              max={120}
              className="mt-1 w-full rounded-xl bg-[#0f1f46] border
                border-blue-800/40 px-4 py-2 text-white"
              value={avgQueueMin}
              onChange={(e) => setAvgQueueMin(e.target.value)}
            />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm text-blue-100/90">
              Travel between stops (min)
            </span>
            <input
              type="number"
              min={5}
              max={60}
              className="mt-1 w-full rounded-xl bg-[#0f1f46] border
                border-blue-800/40 px-4 py-2 text-white"
              value={travelBetweenStopsMin}
              onChange={(e) => setTravelBetweenStopsMin(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm text-blue-100/90">
              On-site time per stop (min)
            </span>
            <input
              type="number"
              min={20}
              max={90}
              className="mt-1 w-full rounded-xl bg-[#0f1f46] border
                border-blue-800/40 px-4 py-2 text-white"
              value={onSiteTimeMin}
              onChange={(e) => setOnSiteTimeMin(e.target.value)}
            />
          </label>
        </div>
        <div className="rounded-2xl bg-[#122a56] border border-blue-800/40 p-4">
          <div className="text-sm text-blue-100/90">Recommended Duration</div>
          <div className="text-3xl font-extrabold text-white mt-1">
            {computed.hours} hours
          </div>
          <div className="mt-3 text-sm text-blue-100/90">Suggested Vehicle</div>
          <div className="text-lg font-bold text-white">{computed.vehicle}</div>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={`/pricing`}
              className="rounded-xl bg-blue-600 text-white px-4 py-2
                font-semibold border border-blue-700 hover:bg-blue-700"
            >
              Get Quote
            </a>
            <a
              href="/party-buses"
              className="rounded-xl bg-white text-blue-900 px-4 py-2
                font-semibold border border-blue-200 hover:bg-blue-50"
            >
              See Party Buses
            </a>
          </div>
        </div>
        <p className="text-[11px] text-blue-200/80 mt-2">
          Estimates only; availability, traffic, and venue rules affect final
          routing and price.
        </p>
      </div>
    </aside>
  );
}
