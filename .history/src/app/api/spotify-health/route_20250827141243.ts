import { NextResponse } from "next/server";

// Lightweight health check for Spotify credentials + token retrieval.
// GET /api/spotify-health
// Response shape:
// { ok: boolean, auth?: string, error?: string, details?: string }
// auth: 'present' | 'missing' | 'token_ok' | 'token_failed'

let cachedToken: { access_token: string; expires_at: number } | null = null;

async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && cachedToken.expires_at > now + 30_000) return cachedToken.access_token;
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) throw new Error("missing_creds");
  const creds = Buffer.from(`${id}:${secret}`).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Basic ${creds}` },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("token_http_" + res.status);
  const j = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { access_token: j.access_token, expires_at: now + j.expires_in * 1000 };
  return j.access_token;
}

export async function GET() {
  const haveId = !!process.env.SPOTIFY_CLIENT_ID;
  const haveSecret = !!process.env.SPOTIFY_CLIENT_SECRET;
  if (!haveId || !haveSecret) {
    return NextResponse.json({ ok: false, auth: 'missing', error: 'missing_env', details: 'Set SPOTIFY_CLIENT_ID & SPOTIFY_CLIENT_SECRET then restart server.' }, { status: 200 });
  }
  try {
    await getAccessToken();
    return NextResponse.json({ ok: true, auth: 'token_ok' });
  } catch (e) {
    const msg = (e instanceof Error && e.message) ? e.message : 'unknown_error';
    if (msg === 'missing_creds') {
      return NextResponse.json({ ok: false, auth: 'missing', error: 'missing_env' });
    }
    return NextResponse.json({ ok: false, auth: 'token_failed', error: msg });
  }
}
