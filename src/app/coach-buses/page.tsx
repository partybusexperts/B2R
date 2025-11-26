import React from "react";

import { fetchFleetVehicles } from "../../lib/server/fleetData";

import CoachBusesClient from "./CoachBusesClient";

export default async function CoachBusesPage() {
  const fleet = await fetchFleetVehicles();
  const vehicles = [...(fleet["coach-buses"] ?? [])].sort((a, b) => (a.capacityMax ?? 0) - (b.capacityMax ?? 0));

  return <CoachBusesClient vehicles={vehicles} />;
}
