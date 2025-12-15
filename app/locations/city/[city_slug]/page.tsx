import { notFound, redirect } from "next/navigation";
import { getLocationsByCitySlug } from "@/lib/data/locations";

export default async function CityPage({
  params,
}: {
  params: Promise<{ city_slug: string }>;
}) {
  const { city_slug } = await params;
  const matches = await getLocationsByCitySlug(city_slug);

  if (!matches || matches.length === 0) return notFound();

  // `city_slug` is not globally unique (e.g. Springfield exists in multiple states).
  // Only redirect if we can do it safely.
  if (matches.length === 1) {
    redirect(
      `/locations/state/${matches[0].state_slug}/city/${matches[0].city_slug}`,
    );
  }

  return notFound();
}
