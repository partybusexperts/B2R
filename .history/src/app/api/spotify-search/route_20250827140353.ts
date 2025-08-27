import { NextRequest, NextResponse } from "next/server";

// Simple in-memory token cache (shared across requests in a single server instance)
let cachedToken: { access_token: string; expires_at: number } | null = null;

interface SpotifySearchResponseShape {
  playlists?: { items?: SpotifySearchPlaylistItemShape[] };
}
interface SpotifySearchPlaylistItemShape {
  id?: string;
  name?: string;
  description?: string;
  images?: { url?: string }[];
  external_urls?: { spotify?: string };
}

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
  cachedToken = { access_token: j.access_token, expires_at: now + j.expires_in * 1000 };
  return j.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const { q } = await req.json();
    if (typeof q !== "string" || q.trim().length < 2) {
      return NextResponse.json({ ok: false, error: "query_too_short" }, { status: 400 });
    }
    let token: string;
    try {
      token = await getAccessToken();
    } catch (e) {
      console.error("Spotify auth error", e);
      return NextResponse.json({ ok: false, error: "spotify_auth_failed" }, { status: 500 });
    }
    const params = new URLSearchParams({ q, type: "playlist", limit: "8" });
    const r = await fetch(`https://api.spotify.com/v1/search?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!r.ok) {
      console.warn("Spotify search failed", r.status);
      return NextResponse.json({ ok: false, error: "search_failed" }, { status: 502 });
    }
    const j = (await r.json()) as SpotifySearchResponseShape;
    const rawItems = j.playlists?.items || [];
    const items = rawItems.map((pl) => ({
      id: String(pl.id || ""),
      name: typeof pl.name === "string" ? pl.name : "(untitled)",
      description: typeof pl.description === "string" ? pl.description.replace(/<[^>]+>/g, "") : "",
      image: pl.images?.[0]?.url || undefined,
      url: pl.external_urls?.spotify || undefined,
    }));
    return NextResponse.json({ ok: true, items });
  } catch (e) {
    console.error("/api/spotify-search exception", e);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
