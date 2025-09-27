import React from "react";
import VehiclePreviewGrid from "./VehiclePreviewGrid";
import { ResolvedVehicle } from "../../data/vehicles";
import { resolveVehicles } from "../../data/vehicles";
import { findByFileName } from "../../utils/optimizedImages";

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
  const vehicles = resolveVehicles(findByFileName)
    .filter((v) => v.category === category)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-white">{title}</h2>
          <a href={linkHref} className="text-blue-400 hover:underline font-semibold">
            View all →
          </a>
        </div>

  <VehiclePreviewGrid vehicles={vehicles as ResolvedVehicle[]} category={category} slots={3} labelsMap={labelsMap} />
      </div>
    </section>
  );
}

