import { NextRequest, NextResponse } from 'next/server';

// Lightweight geocode suggestion proxy (OpenRouteService) to keep key server-side.
// Query: /api/geocode-suggest?q=partial text
// Returns: { ok, suggestions: string[] }

export async function GET(req: NextRequest) {
  const apiKey = process.env.ORS_API_KEY;
  // If no ORS API key is configured, in development return canned suggestions
  // so the UI can be tested locally without an external key. In production
  // we still surface an error to avoid silently returning fake data.
  if (!apiKey) {
    if (process.env.NODE_ENV === 'development') {
      const demo = [
        '1600 Amphitheatre Pkwy, Mountain View, CA',
        '1 Infinite Loop, Cupertino, CA',
        '1600 Pennsylvania Ave NW, Washington, DC',
        '350 5th Ave, New York, NY'
      ];
      return NextResponse.json({ ok: true, suggestions: demo });
    }
    return NextResponse.json({ ok: false, error: 'Server missing ORS_API_KEY' }, { status: 500 });
  }
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  if (!q) return NextResponse.json({ ok: false, suggestions: [] });
  try {
    const geoRes = await fetch(`https://api.openrouteservice.org/geocode/autocomplete?api_key=${apiKey}&text=${encodeURIComponent(q)}&size=5`, { cache: 'no-store' });
    if (!geoRes.ok) return NextResponse.json({ ok: false, error: 'Upstream error', status: geoRes.status }, { status: 502 });
    const data = await geoRes.json();
  interface GeoFeature { properties?: { label?: string } }
  const suggestions: string[] = Array.isArray(data?.features)
    ? (data.features as GeoFeature[])
      .map(f => f?.properties?.label)
      .filter((v): v is string => typeof v === 'string' && !!v.trim())
    : [];
    return NextResponse.json({ ok: true, suggestions });
  } catch (e) {
    console.error('/api/geocode-suggest exception', e);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
