import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/spotify-playlists
 * Body: { ids: string[] }
 * Returns playlist metadata (name, description, image, url) for each id.
 * Requires env: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET (Client Credentials flow).
 */

interface SpotifyPlaylistApiItem {
  id: string;
  name: string;
  description: string;
  images?: { url: string; width?: number; height?: number }[];
  external_urls?: { spotify?: string };
}

let cachedToken: { access_token: string; expires_at: number } | null = null;

async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && cachedToken.expires_at > now + 30_000) return cachedToken.access_token;
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) throw new Error("Missing Spotify credentials");
  const creds = Buffer.from(`${id}:${secret}`).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Basic ${creds}` },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Spotify token error " + res.status);
  const j = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { access_token: j.access_token, expires_at: now + (j.expires_in * 1000) };
  return j.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const { ids } = await req.json();
    if (!Array.isArray(ids) || !ids.length) {
      return NextResponse.json({ ok: false, error: "ids array required" }, { status: 400 });
    }
    // Deduplicate & basic validate (Spotify IDs are 22 chars base62 typically, but we allow broader pattern)
    const uniqueIds = Array.from(new Set(ids.map(String))).filter((id) => /[A-Za-z0-9]{5,}/.test(id));
    if (!uniqueIds.length) {
      return NextResponse.json({ ok: false, error: "no valid ids" }, { status: 400 });
    }
    let token: string;
    try {
      token = await getAccessToken();
    } catch (e) {
      console.error("Spotify auth error", e);
      return NextResponse.json({ ok: false, error: "spotify_auth_failed" }, { status: 500 });
    }

    // Batch fetch sequentially (could parallel, but keep simple & respect rate limits)
    const results: Record<string, { id: string; name: string; description: string; image?: string; url?: string; fetched: boolean; status: number; reason?: string; }> = {};
    for (const id of uniqueIds) {
      try {
        const r = await fetch(`https://api.spotify.com/v1/playlists/${id}?market=US`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!r.ok) {
          console.warn("Spotify playlist fetch failed", id, r.status);
          let reason = 'http_' + r.status;
          if (r.status === 404) reason = 'not_found_or_private';
          else if (r.status === 403) reason = 'forbidden';
          results[id] = { id, name: id, description: "", image: undefined, url: `https://open.spotify.com/playlist/${id}` , fetched: false, status: r.status, reason };
          continue;
        }
        const pl = (await r.json()) as SpotifyPlaylistApiItem;
        results[id] = {
          id: pl.id,
            name: pl.name,
            description: (pl.description || "").replace(/<[^>]+>/g, ""), // strip any HTML
          image: pl.images?.[0]?.url,
          url: pl.external_urls?.spotify || `https://open.spotify.com/playlist/${id}`,
          fetched: true,
          status: 200,
        };
      } catch (err) {
        console.error("Spotify playlist error", id, err);
        results[id] = { id, name: id, description: "", image: undefined, url: `https://open.spotify.com/playlist/${id}` , fetched: false, status: 500, reason: 'exception' };
      }
    }

  return NextResponse.json({ ok: true, playlists: results });
  } catch (e) {
    console.error("/api/spotify-playlists exception", e);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
