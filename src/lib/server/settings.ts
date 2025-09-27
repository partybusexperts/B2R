import { createClient } from "../supabase/server";

export type CtaSettings = {
  headline?: string;
  subhead?: string;
  email?: string;
  phone?: string;
  quote_href?: string;
};

const DEFAULTS: CtaSettings = {
  headline: "Ready to roll?",
  subhead: "Book your ride today",
  email: "info@bus2ride.com",
  phone: "888-535-2566",
  quote_href: "/quote",
};

const hasSupabase =
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL) &&
  !!(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY);

export async function getCta(key: string = "cta_global"): Promise<CtaSettings> {
  if (!hasSupabase) return DEFAULTS;
  const db = createClient();
  const { data, error } = await db
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .single();
  if (error || !data?.value) return DEFAULTS;
  return { ...DEFAULTS, ...(data.value as CtaSettings) };
}
