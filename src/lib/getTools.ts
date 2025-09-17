import { createClient } from '@supabase/supabase-js';
import registryData from '../../data/toolsRegistry.json'

export type ToolRow = {
  id: string;
  title?: string;
  desc?: string;
  category?: string;
  href?: string;
  modalSize?: string | null;
  configured?: boolean | null;
};

export async function getTools(limit = 200): Promise<ToolRow[]> {
  const useLocal = process.env.USE_LOCAL_REGISTRY === '1'
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const key = serviceRole || anon;

  // If explicitly requested or missing Supabase creds, use the local registry JSON
  if (useLocal || !url || !key) {
    return (registryData as any[]).slice(0, limit).map((r) => ({
      id: String(r.id),
      title: r.title,
      desc: r.desc || r.description || null,
      category: r.category || null,
      href: r.href || `/tools/${r.id}`,
      modalSize: r.modalSize ?? r.modal_size ?? null,
      configured: null,
    }))
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  try {
    const { data, error } = await supabase.from('tools').select('*').limit(limit);
    if (error) return [];
    return (data || []).map((r: Record<string, unknown>) => ({
      id: String(r.id),
      title: r.title as string | undefined,
      desc: (r.desc as string) || (r.description as string) || (r.summary as string) || undefined,
      category: r.category as string | undefined,
      href: r.href as string | undefined,
      modalSize: (r.modalSize as string) ?? (r.modal_size as string) ?? null,
      configured: (r.configured as boolean) ?? null,
    }));
  } catch {
    return [];
  }
}
