// app/api/quote-vehicles/route.ts
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getCache, setCache } from '@/lib/serverCache';

export const runtime = 'nodejs';

const QuoteReqSchema = z.object({
  category_slug: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  passengers: z.number().int().positive().optional().default(1),
  hours: z.number().int().positive().optional().default(1),
  event_type: z.string().nullable().optional(),
  event_date: z.string().nullable().optional(),
  start_time: z.string().nullable().optional(),
});

type QuoteReq = z.infer<typeof QuoteReqSchema>;

type QuoteResponse = { ok: true; data: unknown } | { ok: false; error: string };

function safeInt(v: unknown, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : fallback;
}

export async function POST(req: NextRequest) {
  try {
    const parsed = QuoteReqSchema.safeParse(await req.json());
    if (!parsed.success) {
      return Response.json(
        { ok: false, error: `Invalid input: ${parsed.error.message}` } satisfies QuoteResponse,
        { status: 400 }
      );
    }
    const body = parsed.data as QuoteReq;

    const passengers = body.passengers ?? 1;
    const hours = body.hours ?? 1;
    const category_slug = body.category_slug ?? null;
    const city = body.city ?? null;
    const event_type = body.event_type ?? null;
    const event_date = body.event_date ?? new Date().toISOString().slice(0, 10);
    const start_time = body.start_time ?? null;

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
