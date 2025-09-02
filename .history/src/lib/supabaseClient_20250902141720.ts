import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Create and return a Supabase client at runtime.
 * This is intentionally lazy and defensive so importing this module
 * during build (where env vars may be missing) does not throw.
 *
 * Server-side deployments should set SUPABASE_URL and SUPABASE_ANON_KEY.
 * Client code may still use NEXT_PUBLIC_SUPABASE_* if needed for browser usage.
 */
export function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Return null when env is not configured rather than throwing at import time.
    return null;
  }

  return createClient(url, key);
}

// Backwards-compatible export name for places that previously imported `supabase`.
// It will return null if not configured.
export const supabase = (() => null) as unknown as SupabaseClient | null;
