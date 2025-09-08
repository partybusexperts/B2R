// app/api/quote-vehicles/route.ts
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

type QuoteReq = {
  category_slug?: string | null;
  city?: string | null;
  passengers: number;
  hours: number;
  event_type?: string | null;
  event_date?: string | null; // YYYY-MM-DD
  start_time?: string | null; // HH:MM
};

type QuoteResponse = { ok: true; data: unknown } | { ok: false; error: string };

function safeInt(v: unknown, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : fallback;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<QuoteReq> | undefined;
    if (!body) return Response.json({ ok: false, error: 'Missing body' } satisfies QuoteResponse, { status: 400 });

    const passengers = safeInt(body.passengers, 1);
    const hours = safeInt(body.hours, 1);
    const category_slug = body.category_slug ?? null;
    const city = body.city ?? null;
    const event_type = body.event_type ?? null;
    const event_date = body.event_date ?? new Date().toISOString().slice(0, 10);
    const start_time = body.start_time ?? null;

    // Validate basic ranges
    if (passengers <= 0 || hours <= 0) {
      return Response.json({ ok: false, error: 'passengers and hours must be > 0' } satisfies QuoteResponse, { status: 400 });
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
      return Response.json({ ok: false, error: 'Server misconfigured: missing Supabase service role' } satisfies QuoteResponse, { status: 500 });
    }

    // Call RPC directly from server using service role
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
    return Response.json({ ok: true, data } satisfies QuoteResponse);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ ok: false, error: message } satisfies QuoteResponse, { status: 500 });
  }
}
