import { NextRequest, NextResponse } from "next/server";

const ORS_GEOCODE_ENDPOINT = "https://api.openrouteservice.org/geocode/search";

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();
    if (!address || typeof address !== "string" || address.trim().length < 3) {
      return NextResponse.json({ ok: false, error: "Invalid address" }, { status: 400 });
    }
    const apiKey = process.env.ORS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: "Server missing ORS_API_KEY" }, { status: 500 });
    }
    const url = `${ORS_GEOCODE_ENDPOINT}?api_key=${apiKey}&text=${encodeURIComponent(address)}&size=1`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const text = await res.text();
      console.error("ORS geocode error", res.status, text);
      return NextResponse.json({ ok: false, error: "Geocode provider error" }, { status: 502 });
    }
    const data = await res.json();
    if (data?.features?.[0]?.geometry?.coordinates) {
      return NextResponse.json({ ok: true, coords: data.features[0].geometry.coordinates });
    }
    return NextResponse.json({ ok: false, error: "No results" }, { status: 404 });
  } catch (e) {
    console.error("/api/geocode exception", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
