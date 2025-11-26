import React from "react";

import { fetchFleetVehicles } from "../../lib/server/fleetData";

import LimousinesClient from "./LimousinesClient";

export default async function LimousinesPage() {
  const fleet = await fetchFleetVehicles();
  const vehicles = [...(fleet["limousines"] ?? [])].sort((a, b) => (a.capacityMax ?? 0) - (b.capacityMax ?? 0));

  return <LimousinesClient vehicles={vehicles} />;
}
