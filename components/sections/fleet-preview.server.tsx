import { VehicleData } from "@/types/vehicle.types";
// import { FleetPreview } from "./fleet-preview";
import { getVehiclesByType } from "@/lib/data/vehicles";
import { FleetPreviewCarousel } from "./fleet-preview-carousel";

export async function FleetPreviewServer({
  title,
  description,
  viewAllLink,
  type,
}: {
  title: string;
  description?: string;
  viewAllLink: string;
  type: VehicleData["type"];
}) {
  const vehicles = (await getVehiclesByType(type)) ?? [];

  // Optional: Slice to 3 if you only want a single row
  const randomDisplayVehicles = [...vehicles]
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);

  return (
    <FleetPreviewCarousel
      title={title}
      description={description}
      viewAllLink={viewAllLink}
      vehicles={randomDisplayVehicles}
    />
  );
}
