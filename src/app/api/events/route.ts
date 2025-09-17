import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { eventDetails as fallbackEventDetails } from '../../events/eventDetails';

// Server API: supports ?limit=&offset=&featured=1&random=1
export async function GET(req: Request) {
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    return NextResponse.json({ ok: false, error: 'Supabase server key not configured' }, { status: 500 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, { auth: { persistSession: false } });

  // Wrap the existing logic into a main worker promise so we can race it against a fast fallback.
  const mainWorker = async () => {
    try {
      const url = new URL(req.url);
      const limit = Math.min(100, Number(url.searchParams.get('limit') || 12));
      const offset = Math.max(0, Number(url.searchParams.get('offset') || 0));
      const featured = url.searchParams.get('featured') === '1' || url.searchParams.get('featured') === 'true';
      const random = url.searchParams.get('random') === '1' || url.searchParams.get('random') === 'true';
      const guaranteeParam = url.searchParams.get('guarantee');
      const guarantee = guaranteeParam ? guaranteeParam.split(',').map((s) => s.trim()).filter(Boolean) : [];
      const tag = url.searchParams.get('tag') || undefined;

      // If user requested random selection or provided guarantees, try RPC for guaranteed+random slots
      if (random || (guarantee && guarantee.length > 0)) {
        try {
          // run the RPC with a short timeout so a slow RPC doesn't stall the API
          const rpcPromise = supabase.rpc('get_events_slot', { p_limit: limit, p_guarantee: guarantee });
          let rpcRes: unknown = null;
          try {
            rpcRes = await Promise.race([
              rpcPromise,
              new Promise((_, rej) => setTimeout(() => rej(new Error('RPC timeout')), 700)),
            ]);
          } catch (raceErr) {
            console.debug('get_events_slot RPC timed out or errored', raceErr instanceof Error ? raceErr.message : String(raceErr));
          }

          function isRpcResult(x: unknown): x is { data?: unknown[]; error?: unknown } {
            return !!x && typeof x === 'object' && ('data' in x || 'error' in x);
          }

          if (isRpcResult(rpcRes) && !rpcRes.error && Array.isArray(rpcRes.data)) {
            type RpcRow = { id?: string | null; name?: string | null; description?: string | null; href?: string | null; slug?: string | null; priority?: number | null };
            const rows = (rpcRes.data as RpcRow[]).map((r) => ({
              id: r.id ? String(r.id) : undefined,
              name: r.name ?? '',
              description: r.description ?? '',
              href: r.href ?? undefined,
              slug: r.slug ?? undefined,
              priority: r.priority ?? 0,
            }));
            const res = NextResponse.json({ ok: true, data: rows, meta: { limit, offset, random: true } });
              res.headers.set('Cache-Control', 'public, max-age=30, s-maxage=60, stale-while-revalidate=120');
              res.headers.set('X-Events-Source', 'rpc');
              return res;
          }
          // fallthrough to standard selection if RPC fails or times out
          console.debug('get_events_slot RPC returned error or unexpected data', JSON.stringify(rpcRes));
        } catch (rpcErr) {
          console.debug('RPC call failed, falling back to standard query', rpcErr instanceof Error ? rpcErr.message : String(rpcErr));
        }
      }

      // Fallback: Use range pagination without requesting an exact total count (faster).
      // For now we use stable ordering by name. Avoid full-table scans.
      let q = supabase
        .from('events')
        .select('id, name, description, href, slug, featured, created_at');

      // server-side tag filter: prefer explicit tag column, fall back to slug/name search
      if (tag) {
        try {
          // try fast equality on a 'tag' column
          q = q.eq('tag', tag);
        } catch {
          // if the table doesn't have 'tag', try a broader OR search on slug/name
          q = q.or(`slug.eq.${tag},name.ilike.%${tag}%`);
        }
      }

      if (featured) q = q.eq('featured', true);

      const start = offset;
      const end = offset + limit - 1;
      // Run the DB query with a short server-side timeout and fallback to a local list
      try {
        const queryPromise = q.order('name', { ascending: true }).range(start, end);
        const result: unknown = await Promise.race([
          queryPromise,
          new Promise((_, rej) => setTimeout(() => rej(new Error('Query timeout')), 700)),
        ]);
        const rr = result as { data?: unknown; error?: unknown } | null;
        const data = rr?.data as Array<Record<string, unknown>> | undefined;
        const error = rr?.error as Error | undefined;
        if (error) throw error;
        const rows = (data ?? []).map((r) => {
          const obj = r as Record<string, unknown>;
          return {
            name: String(obj.name ?? ''),
            description: String(obj.description ?? ''),
            href: obj.href ? String(obj.href) : undefined,
            id: obj.id ? String(obj.id) : undefined,
            slug: obj.slug ? String(obj.slug) : undefined,
          };
        });

  const res = NextResponse.json({ ok: true, data: rows, meta: { limit, offset } });
  // Short caching to speed up repeated requests during development and low-volume traffic
  res.headers.set('Cache-Control', 'public, max-age=60, s-maxage=60, stale-while-revalidate=120');
  res.headers.set('X-Events-Source', 'db');
  return res;
      } catch (qErr) {
        console.debug('Supabase query timed out or failed, returning local fallback', qErr instanceof Error ? qErr.message : String(qErr));
        // Return a small local fallback so clients remain responsive
        const fallbackRows = (fallbackEventDetails || []).slice(0, limit).map((r) => {
          const obj = r as Record<string, unknown>;
          return {
            name: String(obj.name ?? ''),
            description: String(obj.description ?? ''),
            href: obj.href ? String(obj.href) : undefined,
            id: obj.id ?? undefined,
            slug: obj.slug ? String(obj.slug) : undefined,
          };
        });
  const res = NextResponse.json({ ok: true, data: fallbackRows, meta: { limit, offset, fallback: true } });
  res.headers.set('Cache-Control', 'public, max-age=10, s-maxage=10, stale-while-revalidate=30');
  res.headers.set('X-Events-Source', 'fallback');
  return res;
      }
    } catch (e) {
      return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 502 });
    }
  };

  // Fast overall fallback: if the main worker doesn't resolve within 800ms, immediately return the local fallback.
  const fastFallbackMs = 800;
  const fastFallback = new Promise<NextResponse>((resolve) => {
    const t = setTimeout(() => {
      const fallbackRows = (fallbackEventDetails || []).slice(0, 12).map((r) => {
        const obj = r as Record<string, unknown>;
        return {
          name: String(obj.name ?? ''),
          description: String(obj.description ?? ''),
          href: obj.href ? String(obj.href) : undefined,
          id: obj.id ?? undefined,
          slug: obj.slug ? String(obj.slug) : undefined,
        };
      });
  const res = NextResponse.json({ ok: true, data: fallbackRows, meta: { fallback: true } });
  res.headers.set('Cache-Control', 'public, max-age=10, s-maxage=10, stale-while-revalidate=30');
  res.headers.set('X-Events-Source', 'fast-fallback');
  console.debug(`Events API fast fallback triggered after ${fastFallbackMs}ms`);
      clearTimeout(t);
      resolve(res);
    }, fastFallbackMs);
  });

  // Race the full worker against the fast fallback so we always return quickly under slowness.
  return Promise.race([mainWorker(), fastFallback]);
}
