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
    // If no ORS key and we're in development, provide a simple mocked route
    // using approximate coordinates so the frontend can be tested offline.
    if (!apiKey) {
      if (process.env.NODE_ENV === 'development') {
        // simple mock geocode mapping (lon, lat)
        const known: Record<string, [number, number]> = {
          'wheaton': [-88.1035, 41.8658],
          'chicago': [-87.6298, 41.8781],
          'cupertino': [-122.0326, 37.3229],
          'mountain view': [-122.0838, 37.3861]
        };

        function mockGeocode(addr: string): [number, number] {
          const low = addr.toLowerCase();
          for (const k of Object.keys(known)) if (low.includes(k)) return known[k];
          // fallback to Chicago
          return known['chicago'];
        }

        function haversineMeters(a: [number, number], b: [number, number]) {
          // a and b are [lon, lat]
          const toRad = (deg: number) => deg * Math.PI / 180;
          const [lon1, lat1] = a;
          const [lon2, lat2] = b;
          const R = 6371000; // meters
          const dLat = toRad(lat2 - lat1);
          const dLon = toRad(lon2 - lon1);
          const la1 = toRad(lat1);
          const la2 = toRad(lat2);
          const sinDLat = Math.sin(dLat/2);
          const sinDLon = Math.sin(dLon/2);
          const c = 2 * Math.asin(Math.sqrt(sinDLat*sinDLat + Math.cos(la1)*Math.cos(la2)*sinDLon*sinDLon));
          return R * c;
        }

        const coords = addresses.map(a => mockGeocode(a));
        const segments = [] as { distance: number; duration: number }[];
        let totalDist = 0;
        let totalDur = 0;
        const speedMetersPerSec = 13.8889; // ~50 km/h
        for (let i = 1; i < coords.length; i++) {
          const d = haversineMeters(coords[i-1], coords[i]);
          const dur = d / speedMetersPerSec;
          segments.push({ distance: d, duration: dur });
          totalDist += d;
          totalDur += dur;
        }

        return NextResponse.json({ ok: true, data: {
          addresses,
          coordinates: coords,
          distanceMeters: totalDist,
          durationSeconds: totalDur,
          distanceMiles: totalDist / 1609.34,
          durationMinutes: totalDur / 60,
          segments,
          raw: { mock: true }
        } });
      }
      return NextResponse.json({ ok: false, error: "Server missing ORS_API_KEY" }, { status: 500 });
    }

    // Geocode both addresses server-side to avoid exposing key client-side.
    async function geocode(address: string): Promise<[number, number] | null> {
      // Try ORS first
      try {
        const geoRes = await fetch(
          `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(address)}&size=1`,
          { cache: "no-store" }
        );
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          const coords = geoData?.features?.[0]?.geometry?.coordinates;
          if (Array.isArray(coords) && coords.length === 2) return [coords[0], coords[1]] as [number, number];
        }
      } catch (e) {
        console.warn("ORS geocode error for", address, e);
      }

      // Fallback: try Nominatim (OpenStreetMap) when ORS fails to find coordinates.
      // This is a best-effort fallback for improving success with free-form addresses.
      try {
        const nomRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`, {
          headers: { 'User-Agent': 'b2r-route-planner/1.0 (dev)' },
          cache: 'no-store'
        });
        if (nomRes.ok) {
          const nom = await nomRes.json();
          if (Array.isArray(nom) && nom.length > 0 && nom[0].lon && nom[0].lat) {
            return [parseFloat(nom[0].lon), parseFloat(nom[0].lat)];
          }
        }
      } catch (e) {
        console.warn("Nominatim geocode error for", address, e);
      }

      return null;
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
      segments = rawSegments.map((s: { distance: number; duration: number }) => ({ distance: s.distance, duration: s.duration }));
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
