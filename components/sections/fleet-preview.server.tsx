import { getVehiclesByType, VehicleData } from "@/lib/data/vehicles";
import { FleetPreview } from "./fleet-preview";

export async function FleetPreviewServer({
  title,
  viewAllLink,
  type,
}: {
  title: string;
  viewAllLink: string;
  type: VehicleData["type"];
}) {
  const vehicles = (await getVehiclesByType(type)) ?? [];

  // Optional: Slice to 3 if you only want a single row
  const randomDisplayVehicles = [...vehicles]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return (
    <FleetPreview
      title={title}
      viewAllLink={viewAllLink}
      vehicles={randomDisplayVehicles}
    />
  );
}
