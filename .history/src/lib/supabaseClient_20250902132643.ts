// Lightweight Supabase client wrapper for use in the app
// Reads NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from env
// TODO: install `@supabase/supabase-js` and add types if you want full typed support

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // For local development we prefer failing fast so missing config is obvious
  // But avoid throwing in serverless environments — adjust as needed.
  console.warn('Supabase URL or ANON KEY missing. Supabase client will still be created but may fail at runtime.');
}

export const supabaseClient: SupabaseClient = createClient(url || '', anonKey || '');

export default supabaseClient;
