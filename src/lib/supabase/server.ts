import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!url || !key) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[createClient] Missing Supabase env; returning client with empty creds.");
    }
  }

  return createSupabaseClient(url, key);
}
