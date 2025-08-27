import { NextRequest, NextResponse } from 'next/server';

// Lightweight geocode suggestion proxy (OpenRouteService) to keep key server-side.
// Query: /api/geocode-suggest?q=partial text
// Returns: { ok, suggestions: string[] }

export async function GET(req: NextRequest) {
  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) return NextResponse.json({ ok: false, error: 'Server missing ORS_API_KEY' }, { status: 500 });
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  if (!q) return NextResponse.json({ ok: false, suggestions: [] });
  try {
    const geoRes = await fetch(`https://api.openrouteservice.org/geocode/autocomplete?api_key=${apiKey}&text=${encodeURIComponent(q)}&size=5`, { cache: 'no-store' });
    if (!geoRes.ok) return NextResponse.json({ ok: false, error: 'Upstream error', status: geoRes.status }, { status: 502 });
    const data = await geoRes.json();
    const suggestions: string[] = Array.isArray(data?.features)
      ? data.features.map((f: any) => f?.properties?.label).filter((v: any): v is string => typeof v === 'string')
      : [];
    return NextResponse.json({ ok: true, suggestions });
  } catch (e) {
    console.error('/api/geocode-suggest exception', e);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
