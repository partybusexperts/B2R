import { createClient as createSupabaseClient } from "@supabase/supabase-js";

console.log("[env-check]", {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 20),
  serverUrl: process.env.SUPABASE_URL,
  service: process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 20),
});

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
