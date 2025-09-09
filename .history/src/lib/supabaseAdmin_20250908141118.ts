import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  // In server code we don't want to throw on import; functions should guard.
}

export function getAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    throw new Error('Supabase admin credentials not configured');
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, { auth: { persistSession: false } });
}

export async function createContentPoint(key: string, title?: string, body: unknown = {}, metadata: unknown = {}) {
  const supabase = getAdminClient();
  const { data, error } = await supabase.from('content_points').insert([{ key, title, body, metadata }]).select().limit(1).single();
  if (error) throw error;
  return data;
}

export async function addNote(pointId: string, note: string, createdBy?: string) {
  const supabase = getAdminClient();
  const { data, error } = await supabase.from('content_notes').insert([{ point_id: pointId, note, created_by: createdBy }]).select().limit(1).single();
  if (error) throw error;
  return data;
}
