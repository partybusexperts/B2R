// app/api/plan-route/route.ts
import { NextRequest } from "next/server";

export const runtime = "nodejs";

type PlanRouteReq = { addresses: string[] };
type Segment = { distance: number; duration: number };
type PlanRouteData = {
  addresses: string[];
  coordinates: [number, number][]; // [lng, lat]
  distanceMeters: number;
  durationSeconds: number;
  distanceMiles: number;
  durationMinutes: number;
  segments: Segment[];
  raw: unknown;
};
type PlanRouteResponse =
  | { ok: true; data: PlanRouteData }
  | { ok: false; error: string };

function metersToMiles(m: number) {
  return m / 1609.344;
}
function secondsToMinutes(s: number) {
  return s / 60;
}

/** Geocode one address to [lng, lat] */
async function geocodeOne(addr: string): Promise<[number, number]> {
  const token = process.env.MAPBOX_TOKEN;

  if (token) {
    const url = new URL(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(addr)}.json`
    );
    url.searchParams.set("limit", "1");
    url.searchParams.set("access_token", token);
    const r = await fetch(url.toString(), { cache: "no-store" });
    if (!r.ok) throw new Error(`Mapbox geocode ${r.status}`);
    const j = await r.json();
    const feature = j.features?.[0];
    if (!feature?.center) throw new Error(`No result for "${addr}"`);
    const [lng, lat] = feature.center;
    return [lng, lat];
  } else {
    // Photon fallback
    const url = new URL("https://photon.komoot.io/api/");
    url.searchParams.set("q", addr);
    url.searchParams.set("limit", "1");
    const r = await fetch(url.toString(), { cache: "no-store" });
    if (!r.ok) throw new Error(`Photon geocode ${r.status}`);
    const j = await r.json();
    const f = j.features?.[0];
    const coords = f?.geometry?.coordinates; // [lng, lat]
    if (!coords) throw new Error(`No result for "${addr}"`);
    return coords;
  }
}

/** Directions between two points (lng, lat) */
async function routePair(a: [number, number], b: [number, number]) {
  const token = process.env.MAPBOX_TOKEN;
  if (token) {
    const url = new URL(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${a[0]},${a[1]};${b[0]},${b[1]}`
    );
    url.searchParams.set("overview", "false");
    url.searchParams.set("alternatives", "false");
    url.searchParams.set("geometries", "geojson");
    url.searchParams.set("access_token", token);

    const r = await fetch(url.toString(), { cache: "no-store" });
    if (!r.ok) throw new Error(`Mapbox directions ${r.status}`);
    const j = await r.json();
    const route = j.routes?.[0];
    if (!route) throw new Error("No route found");
    return { distance: route.distance as number, duration: route.duration as number, raw: j };
  } else {
    // OSRM public demo server fallback
    const url = new URL(
      `https://router.project-osrm.org/route/v1/driving/${a[0]},${a[1]};${b[0]},${b[1]}`
    );
    url.searchParams.set("overview", "false");
    url.searchParams.set("alternatives", "false");
    url.searchParams.set("steps", "false");

    const r = await fetch(url.toString(), { cache: "no-store" });
    if (!r.ok) throw new Error(`OSRM directions ${r.status}`);
    const j = await r.json();
    if (j.code !== "Ok") throw new Error(`OSRM: ${j.code || "error"}`);
    const route = j.routes?.[0];
    if (!route) throw new Error("No route found");
    return { distance: route.distance as number, duration: route.duration as number, raw: j };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PlanRouteReq;
    const inputAddrs = (body.addresses || []).map(s => String(s || "").trim()).filter(Boolean);

    if (inputAddrs.length < 2) {
      return Response.json(
        { ok: false, error: "Need at least start and end addresses" } satisfies PlanRouteResponse,
        { status: 400 }
      );
    }

    // Geocode all addresses
    const coords: [number, number][] = [];
    for (const a of inputAddrs) {
      // serial geocoding to be gentle on free-tier services
      const c = await geocodeOne(a);
      coords.push(c);
    }

    // Build pairwise segments in-order (no TSP optimization)
  const segments: Segment[] = [];
  let totalDistance = 0;
  let totalDuration = 0;
  const rawChunks: unknown[] = [];

    for (let i = 0; i < coords.length - 1; i++) {
  const seg = await routePair(coords[i], coords[i + 1]);
      segments.push({ distance: seg.distance, duration: seg.duration });
      totalDistance += seg.distance;
      totalDuration += seg.duration;
      rawChunks.push(seg.raw);
    }

    const data: PlanRouteData = {
      addresses: inputAddrs,
      coordinates: coords,
      distanceMeters: totalDistance,
      durationSeconds: totalDuration,
      distanceMiles: metersToMiles(totalDistance),
      durationMinutes: secondsToMinutes(totalDuration),
      segments,
      raw: rawChunks,
    };

    return Response.json({ ok: true, data } satisfies PlanRouteResponse);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // Normalize as a 200 with ok:false so your UI shows the message (and not a 502)
    return Response.json({ ok: false, error: (message.includes("Mapbox") || message.includes("OSRM") || message.includes("Photon")) ? `Directions provider error: ${message}` : (message || "Route planning failed") } satisfies PlanRouteResponse);
  }
}
