import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Prefer server-only service role for server-side calls; fall back to anon key
const supabaseAnon = process.env.SUPABASE_SERVICE_ROLE || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export type StyleTokens = {
  colors?: { primary?: string; accent?: string; bg?: string; muted?: string };
  radius?: { lg?: string };
  font?: { body?: string; heading?: string };
  shadow?: { card?: string };
  spacing?: { section?: string };
};

export async function fetchTokens(site: string, page: string = ''): Promise<StyleTokens> {
  // If env is not configured, return fast to avoid blocking render
  if (!supabaseUrl || !supabaseAnon) return {};

  const supabase = createClient(supabaseUrl, supabaseAnon, { auth: { persistSession: false } });

  try {
    // Race the RPC call against a short timeout to fail-fast in dev or if network is problematic
    const rpcPromise = supabase.rpc('get_style', { site, page });
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase get_style timeout')), 2000));
    const res = await Promise.race([rpcPromise, timeout]) as unknown;

    // normalize shapes: Supabase RPC may return { data } or the value directly
    let data: unknown = undefined;
    let error: unknown = undefined;
    if (res && typeof res === 'object') {
      const r = res as Record<string, unknown>;
      if ('error' in r) error = r.error;
      if ('data' in r) data = r.data;
    } else {
      // direct value
      data = res;
    }

    if (error) {
      try {
        console.error('get_style error', JSON.stringify(error));
      } catch {
        console.error('get_style error', String(error));
      }
      // also log the whole response for debugging
      try { console.debug('get_style raw response:', JSON.stringify(res)); } catch { console.debug('get_style raw response non-serializable'); }
      return {};
    }

    return (data ?? {}) as StyleTokens;
  } catch (err) {
    console.error('fetchTokens failed:', err instanceof Error ? err.message : String(err));
    return {};
  }
}

export function toCssVars(tokens: StyleTokens) {
  const c = tokens.colors ?? {};
  const r = tokens.radius ?? {};
  const f = tokens.font ?? {};
  const s = tokens.shadow ?? {};
  const sp = tokens.spacing ?? {};
  return `
  :root{
    --color-primary:${c.primary ?? '#1d4ed8'};
    --color-accent:${c.accent ?? '#22c55e'};
    --color-muted:${c.muted ?? '#6b7280'};
    --color-bg:${c.bg ?? '#ffffff'};
    --radius-lg:${r.lg ?? '1rem'};
    --font-body:${f.body ?? 'Inter, ui-sans-serif, system-ui'};
    --font-heading:${f.heading ?? 'Poppins, ui-sans-serif, system-ui'};
    --shadow-card:${s.card ?? '0 10px 25px rgba(0,0,0,0.08)'};
    --spacing-section:${sp.section ?? '4rem'};
  }`.trim();
}
