// app/api/quote-vehicles/route.ts
import { NextRequest } from 'next/server';
import { getCache, setCache } from '../../../lib/serverCache';

export const runtime = 'nodejs';

type QuoteResponse = { ok: true; data: unknown } | { ok: false; error: string };

function safeInt(v: unknown, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : fallback;
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json().catch(() => null);
    if (!raw || typeof raw !== 'object') return Response.json({ ok: false, error: 'Missing or invalid JSON body' } satisfies QuoteResponse, { status: 400 });
    const b = raw as Record<string, unknown>;

    const passengers = safeInt(b.passengers, 1) || 1;
    const hours = safeInt(b.hours, 1) || 1;
    const category_slug = b.category_slug == null ? null : String(b.category_slug);
    const city = b.city == null ? null : String(b.city);
    const event_type = b.event_type == null ? null : String(b.event_type);
    const event_date = b.event_date == null ? new Date().toISOString().slice(0, 10) : String(b.event_date);
    const start_time = b.start_time == null ? null : String(b.start_time);

    // Basic validation
    if (passengers <= 0 || hours <= 0) {
      return Response.json({ ok: false, error: 'passengers and hours must be > 0' } satisfies QuoteResponse, { status: 400 });
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
      return Response.json({ ok: false, error: 'Server misconfigured: missing Supabase service role' } satisfies QuoteResponse, { status: 500 });
    }

    // Call RPC directly from server using service role
  // Check cache first (cache key uses input JSON)
  const cacheKey = `quote:${SUPABASE_URL}:${JSON.stringify({ category_slug, city, passengers, hours, event_type, event_date, start_time })}`;
  const cached = getCache(cacheKey);
  if (cached) return Response.json({ ok: true, data: cached } satisfies QuoteResponse);

  const r = await fetch(`${SUPABASE_URL}/rpc/quote_vehicles_legacy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_SERVICE_ROLE,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE}`,
      },
      body: JSON.stringify({
        p_category_slug: category_slug,
        p_city: city,
        p_passengers: passengers,
        p_hours: hours,
        p_event_type: event_type,
        p_event_date: event_date,
        p_start_time: start_time,
      }),
    });

    if (!r.ok) {
      const txt = await r.text().catch(() => 'no body');
      return Response.json({ ok: false, error: `Supabase RPC failed: ${r.status} ${txt}` } satisfies QuoteResponse, { status: 502 });
    }

  const data = await r.json();
  // cache for short TTL to protect Supabase from repeated calls
  setCache(cacheKey, data, 20);
  return Response.json({ ok: true, data } satisfies QuoteResponse);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ ok: false, error: message } satisfies QuoteResponse, { status: 500 });
  }
}
