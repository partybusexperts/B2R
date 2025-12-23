import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo/site";
import { getBlogPosts } from "@/lib/data/blog";
import { getEvents } from "@/lib/data/events";
import { getLocations } from "@/lib/data/locations";
import { getTools } from "@/lib/data/tools";
import { getVehicles } from "@/lib/data/vehicles";

export const revalidate = 3600; // 1 hour

type BlogPost = NonNullable<Awaited<ReturnType<typeof getBlogPosts>>>[number];
type VehicleRow = NonNullable<Awaited<ReturnType<typeof getVehicles>>>[number];
type EventRow = NonNullable<Awaited<ReturnType<typeof getEvents>>>[number];
type ToolRow = Awaited<ReturnType<typeof getTools>>[number];
type LocationRow = Awaited<ReturnType<typeof getLocations>>[number];

function toDate(value: unknown, fallback: Date) {
  if (typeof value === "string" && value.trim().length > 0) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return fallback;
}

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/fleet"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/party-buses"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/limousines"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/coach-buses"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/pricing"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/reviews"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/events"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/tools"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/locations"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/faq"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/industry-secrets"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/polls"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/polls/results"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.6,
    },
  ];

  const [posts, vehicles, events, tools, locations] = await Promise.all([
    safe(async () => (await getBlogPosts()) ?? [], [] as BlogPost[]),
    safe(async () => (await getVehicles(1000)) ?? [], [] as VehicleRow[]),
    safe(async () => (await getEvents(1000)) ?? [], [] as EventRow[]),
    safe(async () => (await getTools(1000)) ?? [], [] as ToolRow[]),
    safe(async () => (await getLocations()) ?? [], [] as LocationRow[]),
  ]);

  const blogRoutes: MetadataRoute.Sitemap = (posts ?? [])
    .filter((post) => typeof post?.slug === "string" && post.slug.length > 0)
    .map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: toDate(post.updated_at ?? post.published_at, now),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const vehicleRoutes: MetadataRoute.Sitemap = (vehicles ?? [])
    .filter(
      (vehicle) =>
        typeof vehicle?.slug === "string" && vehicle.slug.trim().length > 0,
    )
    .map((vehicle) => ({
      url: absoluteUrl(`/vehicles/${vehicle.slug}`),
      lastModified: toDate(vehicle.updated_at ?? vehicle.created_at, now),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  const eventRoutes: MetadataRoute.Sitemap = (events ?? [])
    .filter(
      (event) =>
        typeof event?.slug === "string" && event.slug.trim().length > 0,
    )
    .map((event) => ({
      url: absoluteUrl(`/events/${event.slug}`),
      lastModified: toDate(event.updated_at ?? event.created_at, now),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const toolRoutes: MetadataRoute.Sitemap = (tools ?? [])
    .filter((tool) => typeof tool?.slug === "string" && tool.slug.length > 0)
    .map((tool) => ({
      url: absoluteUrl(`/tools/${tool.slug}`),
      lastModified: toDate(tool.updated_at ?? tool.created_at, now),
      changeFrequency: "yearly",
      priority: 0.6,
    }));

  const fleetTypes = ["party-buses", "limousines", "coach-buses"] as const;

  const stateSlugs = new Set<string>();
  for (const location of locations ?? []) {
    if (typeof location?.state_slug === "string" && location.state_slug) {
      stateSlugs.add(location.state_slug);
    }
  }

  const stateRoutes: MetadataRoute.Sitemap = Array.from(stateSlugs).map(
    (stateSlug) => ({
      url: absoluteUrl(`/locations/${stateSlug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  );

  const cityFleetRoutes: MetadataRoute.Sitemap = (locations ?? [])
    .filter(
      (location) =>
        typeof location?.state_slug === "string" &&
        location.state_slug.length > 0 &&
        typeof location?.city_slug === "string" &&
        location.city_slug.length > 0,
    )
    .flatMap((location) =>
      fleetTypes.map((fleetType) => ({
        url: absoluteUrl(
          `/locations/${location.state_slug}/${fleetType}-${location.city_slug}`,
        ),
        // lastModified: toDate(location.updated_at ?? location.created_at, now), // ADD updated_at LATER
        lastModified: toDate(location.created_at, now),
        changeFrequency: "weekly",
        priority: 0.75,
      })),
    );

  return [
    ...staticRoutes,
    ...stateRoutes,
    ...cityFleetRoutes,
    ...vehicleRoutes,
    ...eventRoutes,
    ...blogRoutes,
    ...toolRoutes,
  ];
}
