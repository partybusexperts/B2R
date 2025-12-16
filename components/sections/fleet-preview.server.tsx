import { VehicleData } from "@/types/vehicle.types";
import { getVehiclesByType } from "@/lib/data/vehicles";
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

  // return (
  //   <FleetPreviewCarousel
  //     title={title}
  //     description={description}
  //     viewAllLink={viewAllLink}
  //     vehicles={randomDisplayVehicles}
  //   />
  // );

  return (
    <FleetPreview
      title={title}
      viewAllLink={viewAllLink}
      vehicles={randomDisplayVehicles}
    />
  );
}
