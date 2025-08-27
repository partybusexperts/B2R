// app/api/geocode-suggest/route.ts
import { NextRequest } from "next/server";

type SuggestResponse = { ok: true; suggestions: string[] } | { ok: false; error: string };

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    if (!q || q.length < 3) {
      return Response.json({ ok: true, suggestions: [] } satisfies SuggestResponse);
    }

    const token = process.env.MAPBOX_TOKEN;

    if (token) {
      // Mapbox forward geocoding with autocomplete
      const url = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json`);
      url.searchParams.set("autocomplete", "true");
      url.searchParams.set("limit", "5");
      url.searchParams.set("access_token", token);

      const r = await fetch(url.toString(), { next: { revalidate: 60 } });
      if (!r.ok) throw new Error(`Mapbox error ${r.status}`);
      const j = await r.json();
      interface MapboxFeature { place_name?: string }
      const features = Array.isArray((j as unknown as { features?: unknown }).features) ? (j as unknown as { features?: MapboxFeature[] }).features as MapboxFeature[] : [];
      const suggestions: string[] = features.map((f: MapboxFeature) => f.place_name).filter((s): s is string => Boolean(s));
      return Response.json({ ok: true, suggestions } satisfies SuggestResponse, {
        headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
      });
    } else {
      // Photon (OpenStreetMap) fallback — no API key
      const url = new URL("https://photon.komoot.io/api/");
      url.searchParams.set("q", q);
      url.searchParams.set("limit", "5");

      const r = await fetch(url.toString(), { next: { revalidate: 60 } });
      if (!r.ok) throw new Error(`Photon error ${r.status}`);
      const j = await r.json();
      interface PhotonProps { name?: string; street?: string; housenumber?: string; city?: string; state?: string; postcode?: string; country?: string }
      interface PhotonFeature { properties?: PhotonProps }
      const features2 = Array.isArray((j as unknown as { features?: unknown }).features) ? (j as unknown as { features?: PhotonFeature[] }).features as PhotonFeature[] : [];
      let suggestions: string[] = features2
        .map(f => f.properties)
        .filter((p): p is PhotonProps => Boolean(p))
        .map((p: PhotonProps) => {
          const parts = [p.name, p.street, p.housenumber, p.city, p.state, p.postcode, p.country].filter(Boolean);
          return parts.join(", ");
        })
        .filter(Boolean);

      // If suggestions are empty or lack house-number detail, try Nominatim as an additional fallback
      if (suggestions.length < 1 || !suggestions.some(s => /\d+/.test(s))) {
        try {
          const nomUrl = new URL('https://nominatim.openstreetmap.org/search');
          nomUrl.searchParams.set('q', q);
          nomUrl.searchParams.set('format', 'json');
          nomUrl.searchParams.set('limit', '5');
          const nomRes = await fetch(nomUrl.toString(), { headers: { 'User-Agent': 'b2r-route-planner/1.0 (dev)' }, next: { revalidate: 60 } });
          if (nomRes.ok) {
            const nom = await nomRes.json();
            if (Array.isArray(nom) && nom.length > 0) {
              const nomSug = nom.map((it: any) => it.display_name).filter(Boolean) as string[];
              // Merge unique suggestions, prefer nominatim results first
              suggestions = Array.from(new Set([...nomSug, ...suggestions])).slice(0, 5);
            }
          }
        } catch (e) {
          // ignore nominatim errors, keep Photon suggestions
        }
      }
      return Response.json({ ok: true, suggestions } satisfies SuggestResponse, {
        headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
      });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ ok: false, error: message || "Geocode suggest failed" } as SuggestResponse, { status: 500 });
  }
}
