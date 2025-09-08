import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export type StyleTokens = {
  colors?: { primary?: string; accent?: string; bg?: string; muted?: string };
  radius?: { lg?: string };
  font?: { body?: string; heading?: string };
  shadow?: { card?: string };
  spacing?: { section?: string };
};

export async function fetchTokens(site: string, page: string = ''): Promise<StyleTokens> {
  const supabase = createClient(supabaseUrl, supabaseAnon, { auth: { persistSession: false } });
  const { data, error } = await supabase.rpc('get_style', { site, page });
  if (error) {
    console.error('get_style error', error);
    return {};
  }
  return (data ?? {}) as StyleTokens;
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
