import { notFound, redirect } from "next/navigation";
import { getLocationsByCitySlug } from "@/lib/data/locations";
import { VehicleData } from "@/types/vehicle.types";

export default async function LocationCityFleetPage({
  params,
}: {
  params: Promise<{ city_slug: string; fleet_slug: VehicleData["type"] }>;
}) {
  const { city_slug, fleet_slug } = await params;

  const matches = await getLocationsByCitySlug(city_slug);

  if (!matches || matches.length === 0) return notFound();

  if (matches.length === 1) {
    redirect(
      `/locations/state/${matches[0].state_slug}/city/${matches[0].city_slug}/${fleet_slug}`,
    );
  }

  return notFound();
}
