import { NextResponse } from "next/server";
import { spotifyFetch, mapPlaylist } from "../_lib/spotify";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const ids: string[] = Array.isArray(body?.ids) ? body.ids : [];
    if (!ids.length) {
      return NextResponse.json({ ok: false, error: "no_ids" }, { status: 400 });
    }

    const entries = await Promise.all(
      ids.map(async (id) => {
        try {
          const res = await spotifyFetch(`/v1/playlists/${encodeURIComponent(id)}?fields=id,name,description,images,external_urls`);
          if (!res.ok) {
            const reason =
              res.status === 404 ? "not_found_or_private" :
              res.status === 403 ? "forbidden" :
              `http_${res.status}`;
            return [id, { fetched: false, reason }] as const;
          }
          const json = await res.json();
          return [id, mapPlaylist(json)] as const;
        } catch {
          return [id, { fetched: false, reason: "exception" }] as const;
        }
      })
    );

    const playlists = Object.fromEntries(entries);
    return NextResponse.json({ ok: true, playlists });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: "server_error", detail: msg }, { status: 500 });
  }
}
