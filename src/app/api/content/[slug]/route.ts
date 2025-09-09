import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  // Next.js requires awaiting dynamic route params before accessing their properties
  const { slug } = await params;
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE; // server-only key

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    return NextResponse.json({ error: 'Supabase not configured on server' }, { status: 500 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

  try {
  // Prefer canonical header via RPC
  const { data, error } = await supabase.rpc('fetch_header', { p_page_slug: slug });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const row = Array.isArray(data) ? data[0] : data;
  return NextResponse.json(row ?? {});
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
