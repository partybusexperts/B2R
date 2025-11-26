import React from "react";
import { cache } from "react";

import VehiclePreviewGrid from "./VehiclePreviewGrid";
import type { HomepageVehicle, HomepageVehicleCategory } from "../../types/homepageVehicles";
import { fetchFleetVehicles } from "../../lib/server/fleetData";

export default async function VehiclePreviewSection({
  category,
  title,
  linkHref = "/",
  labelsMap = {},
}: {
  category: "party-buses" | "limousines" | "coach-buses";
  title: string;
  linkHref?: string;
  labelsMap?: Record<string, string[]>; // NEW
}) {
  const fleet = await loadFleet();
  const source = fleet[category] ?? [];

  const processed = prioritizeVehicles(source, category);

  if (!processed.length) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-white">{title}</h2>
          <a href={linkHref} className="text-blue-400 hover:underline font-semibold">
            View all →
          </a>
        </div>

        <VehiclePreviewGrid vehicles={processed} category={category} slots={3} labelsMap={labelsMap} />
      </div>
    </section>
  );
}

const loadFleet = cache(fetchFleetVehicles);

const CHRYSLER_MATCH = /black\s+chrysler\s+300/i;

function prioritizeVehicles(source: HomepageVehicle[], category: HomepageVehicleCategory) {
  if (category !== "limousines") return source;
  const chrysler = source.filter((vehicle) => CHRYSLER_MATCH.test(vehicle.name ?? ""));
  const remainder = source.filter((vehicle) => !CHRYSLER_MATCH.test(vehicle.name ?? ""));
  return [...chrysler, ...remainder];
}

