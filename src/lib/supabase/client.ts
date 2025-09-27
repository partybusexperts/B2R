import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

  if (!url || !key) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[createClient] Missing Supabase client env; returning client with empty creds.");
    }
  }

  return createSupabaseClient(url, key);
}
