import { NextResponse } from "next/server";
import { spotifyFetch } from "../_lib/spotify";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const q = (body?.q || "").toString().trim();
    if (!q || q.length < 2) {
      return NextResponse.json({ ok: false, error: "query_too_short" }, { status: 400 });
    }

    const params = new URLSearchParams({ q, type: "playlist", limit: "12" });
    const res = await spotifyFetch(`/v1/search?${params.toString()}`);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json({ ok: false, error: "spotify_error", status: res.status, detail: text }, { status: 502 });
    }

    const json = await res.json();
    const items = (json?.playlists?.items || []).map((p: any) => ({
      id: p?.id,
      name: p?.name ?? "",
      description: p?.description ?? "",
      image: Array.isArray(p?.images) && p.images[0]?.url ? p.images[0].url : undefined,
      url: p?.external_urls?.spotify ?? (p?.id ? `https://open.spotify.com/playlist/${p.id}` : undefined),
    }));

    return NextResponse.json({ ok: true, items });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: "server_error", detail: String(e?.message || e) }, { status: 500 });
  }
}
