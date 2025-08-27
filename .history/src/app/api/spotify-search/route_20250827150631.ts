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
  type RawPlaylist = { id?: string; name?: string; description?: string; images?: { url?: string }[]; external_urls?: { spotify?: string } };
  const items = (json?.playlists?.items || []).map((p: RawPlaylist) => ({
      id: p?.id,
      name: p?.name ?? "",
      description: p?.description ?? "",
      image: Array.isArray(p?.images) && p.images[0]?.url ? p.images[0].url : undefined,
      url: p?.external_urls?.spotify ?? (p?.id ? `https://open.spotify.com/playlist/${p.id}` : undefined),
    }));

    return NextResponse.json({ ok: true, items });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: "server_error", detail: msg }, { status: 500 });
  }
}
