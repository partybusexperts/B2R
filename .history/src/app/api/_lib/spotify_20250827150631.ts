// app/api/_lib/spotify.ts
let cachedToken: { access_token: string; expires_at: number } | null = null;

export async function getAccessToken() {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) throw new Error("missing_credentials");

  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expires_at - 15 > now) {
    return cachedToken.access_token;
  }

  const basic = Buffer.from(`${id}:${secret}`).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`token_failed:${res.status}:${text}`);
  }

  const json = (await res.json()) as { access_token: string; token_type: string; expires_in: number };
  const expires_at = Math.floor(Date.now() / 1000) + (json.expires_in || 3600);
  cachedToken = { access_token: json.access_token, expires_at };
  return json.access_token;
}

export async function spotifyFetch(path: string, init?: RequestInit) {
  const token = await getAccessToken();
  const url = path.startsWith("http") ? path : `https://api.spotify.com${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  return res;
}

export function mapPlaylist(p: any) {
  return {
    fetched: true as const,
    id: p?.id,
    name: p?.name ?? "",
    description: p?.description ?? "",
    image: Array.isArray(p?.images) && p.images[0]?.url ? p.images[0].url : undefined,
    url: p?.external_urls?.spotify ?? (p?.id ? `https://open.spotify.com/playlist/${p.id}` : undefined),
  };
}