import React from "react";

import { fetchFleetVehicles } from "../../lib/server/fleetData";

import PartyBusesPageClient from "./PartyBusesClient";

export default async function PartyBusesPage() {
  const fleet = await fetchFleetVehicles();
  const vehicles = [...(fleet["party-buses"] ?? [])].sort((a, b) => (a.capacityMax ?? 0) - (b.capacityMax ?? 0));

  return <PartyBusesPageClient vehicles={vehicles} />;
}
