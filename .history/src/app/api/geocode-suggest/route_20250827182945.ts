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
      const suggestions: string[] =
        (j.features || []).map((f: any) => f.place_name).filter(Boolean);
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
      const suggestions: string[] =
        (j.features || []).map((f: any) => f.properties?.name || f.properties?.country)
          .map((_, i) => j.features[i]?.properties)
          .filter(Boolean)
          .map((p: any) => {
            // Build a readable address line
            const parts = [p.name, p.street, p.housenumber, p.city, p.state, p.postcode, p.country]
              .filter(Boolean);
            return parts.join(", ");
          })
          .filter(Boolean);
      return Response.json({ ok: true, suggestions } satisfies SuggestResponse, {
        headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
      });
    }
  } catch (err: any) {
    return Response.json(
      { ok: false, error: err?.message || "Geocode suggest failed" } as SuggestResponse,
      { status: 500 }
    );
  }
}
