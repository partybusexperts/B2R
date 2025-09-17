// src/lib/getHero.ts
import { createClient } from '@supabase/supabase-js';

/**
 * Server-side helper: fetch hero JSON for a page slug from heroes1 via RPC.
 * Safe to import in server components / loaders only (no "use client").
 */
export async function getHeroInitialData(pageSlug: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY; // server-only
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Prefer service role on the server (not required since reads are public, but allowed).
  const key = serviceRole || anon;
  if (!url || !key) return null;

  const supabase = createClient(url, key, {
    auth: { persistSession: false },
  });

  try {
    // Call the RPC that returns jsonb (your fetch_hero1 function)
    const res: unknown = await supabase.rpc('fetch_hero1', { p_page_slug: pageSlug }) as unknown;

    // Some versions return { data }, others return the value directly
    let hero: unknown = null;
    if (res && typeof res === 'object' && 'data' in (res as Record<string, unknown>)) {
      hero = (res as Record<string, unknown>).data;
    } else {
      hero = res;
    }

    if (hero && typeof hero === 'string') {
      try {
        return JSON.parse(hero);
      } catch {
        // ignore parse error, return raw
      }
    }
    return hero || null;
  } catch {
    return null;
  }
}
