// app/api/geocode-suggest/route.ts
import { NextRequest } from "next/server";

type SuggestResponse =
  | { ok: true; suggestions: string[] }
  | { ok: false; error: string };

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    if (q.length < 3) {
      return Response.json({ ok: true, suggestions: [] } as SuggestResponse);
    }

    const token = process.env.MAPBOX_TOKEN;

    if (token) {
      // Force address-level results first, then POIs as fallback.
      const url = new URL(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json`
      );
      url.searchParams.set("autocomplete", "true");
      url.searchParams.set("limit", "6");
      url.searchParams.set("types", "address,poi"); // <- prioritize house-number addresses
      url.searchParams.set("country", "US");        // <- keep it cleaner/shorter
      url.searchParams.set("access_token", token);

      const r = await fetch(url.toString(), { next: { revalidate: 60 } });
      if (!r.ok) throw new Error(`Mapbox error ${r.status}`);
      const j = await r.json();

      const suggestions = (j.features || [])
        .map((f: unknown) => (f && typeof f === "object" && "place_name" in f ? (f as any).place_name : undefined))
        .filter(Boolean) as string[];

      return Response.json({ ok: true, suggestions } as SuggestResponse, {
        headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
      });
    }

    // ---------- Photon (OSM) fallback ----------
    // Ask specifically for house/address layers first (they include house numbers when available)
    const url = new URL("https://photon.komoot.io/api/");
    url.searchParams.set("q", q);
    url.searchParams.set("limit", "8");
    url.searchParams.set("lang", "en");
    // Photon supports 'layer' to filter; we request house/address plus street as a last resort
    // (When house/address exists, we’ll rank it higher below.)
    // NOTE: Photon ignores multiple 'layer' params, so we just pull everything and rank ourselves.

    const r = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!r.ok) throw new Error(`Photon error ${r.status}`);
    const j = await r.json();

    // Rank: house > address > street > others; build readable lines with housenumber when present.
    const features = Array.isArray(j.features) ? j.features : [];
    const scored = features.map((f: any) => {
      const p = f?.properties || {};
      // Prefer explicit 'house' or 'address' from Photon (when present)
      const rawLayer = String(p?.osm_value || p?.type || p?.type || "").toLowerCase();

      const rank =
        /house|addr|address/.test(rawLayer) ? 3
        : /street|road|highway/.test(rawLayer) ? 2
        : 1;

      // Build a nice label
      const line =
        [
          // if we have housenumber+street, start with that
          p.housenumber && p.street ? `${p.housenumber} ${p.street}` : null,
          // else fall back to name or street
          !p.housenumber || !p.street ? (p.name || p.street || null) : null,
          p.city || p.district || p.county || null,
          p.state || null,
          p.postcode || null,
          p.country || null,
        ]
          .filter(Boolean)
          .join(", ");

      return { line, rank };
    });

    const suggestions = scored
      .filter(s => s.line)
      .sort((a, b) => b.rank - a.rank)   // highest rank first (house/address first)
      .map(s => s.line)
      // remove near-duplicates
      .filter((val, i, arr) => arr.indexOf(val) === i)
      .slice(0, 6);

    return Response.json({ ok: true, suggestions } as SuggestResponse, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (err) {
    const e = err instanceof Error ? err : new Error(String(err));
    return Response.json(
      { ok: false, error: e.message || "Geocode suggest failed" } as SuggestResponse,
      { status: 500 }
    );
  }
}
