import { NextRequest, NextResponse } from "next/server";

const ORS_DIRECTIONS_ENDPOINT = "https://api.openrouteservice.org/v2/directions/driving-car";
const METERS_PER_MILE = 1609.34;

interface ORSFeatureSummary { distance: number; duration: number; }
interface ORSSegment { distance: number; duration: number; }

export async function POST(req: NextRequest) {
  try {
    const bodyIn = await req.json();
    // Backwards compatible: allow legacy {start,end} or new {addresses:[...]}
    let addresses: string[] | null = null;
    if (Array.isArray(bodyIn?.addresses)) {
      addresses = bodyIn.addresses.filter((a: unknown) => typeof a === 'string' && a.trim()).map((a: string) => a.trim());
    } else if (bodyIn?.start && bodyIn?.end) {
      addresses = [bodyIn.start, bodyIn.end];
    }
    if (!addresses || addresses.length < 2) {
      return NextResponse.json({ ok: false, error: "Need at least a start and end address" }, { status: 400 });
    }
    if (addresses.length > 12) {
      return NextResponse.json({ ok: false, error: "Too many stops (max 12)" }, { status: 400 });
    }
    const apiKey = process.env.ORS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: "Server missing ORS_API_KEY" }, { status: 500 });
    }

    // Geocode both addresses server-side to avoid exposing key client-side.
    async function geocode(address: string): Promise<[number, number] | null> {
      const geoRes = await fetch(
        `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(address)}&size=1`,
        { cache: "no-store" }
      );
      if (!geoRes.ok) return null;
      const geoData = await geoRes.json();
  const coords = geoData?.features?.[0]?.geometry?.coordinates;
  return Array.isArray(coords) && coords.length === 2 ? [coords[0], coords[1]] as [number, number] : null;
    }

    const coordResults = await Promise.all(addresses.map(a => geocode(a)));
    if (coordResults.some(c => !c)) {
      return NextResponse.json({ ok: false, error: "Could not geocode one or more addresses" }, { status: 404 });
    }
    const coords = coordResults as [number, number][];
    const body = { coordinates: coords };
    const dirRes = await fetch(ORS_DIRECTIONS_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      cache: "no-store"
    });
    if (!dirRes.ok) {
      const text = await dirRes.text();
      console.error("ORS directions error", dirRes.status, text);
      return NextResponse.json({ ok: false, error: "Directions provider error" }, { status: 502 });
    }

    const data = await dirRes.json();
    let summary: ORSFeatureSummary | null = null;
    if (data?.features?.[0]?.properties?.summary) {
      summary = data.features[0].properties.summary;
    } else if (data?.routes?.[0]?.summary) {
      summary = data.routes[0].summary;
    }
    if (!summary) {
      return NextResponse.json({ ok: false, error: "No summary in provider response", raw: data }, { status: 200 });
    }

    const distanceMiles = summary.distance / METERS_PER_MILE;
    const durationMinutes = summary.duration / 60;
    let segments: ORSSegment[] | undefined;
    const rawSegments = data?.features?.[0]?.properties?.segments || data?.routes?.[0]?.segments;
    if (Array.isArray(rawSegments)) {
      segments = rawSegments.map((s: any) => ({ distance: s.distance, duration: s.duration }));
    }

    return NextResponse.json({
      ok: true,
      data: {
        addresses,
        coordinates: coords,
        distanceMeters: summary.distance,
        durationSeconds: summary.duration,
        distanceMiles,
        durationMinutes,
        segments,
        raw: data
      }
    });
  } catch (e) {
    console.error("/api/plan-route exception", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
