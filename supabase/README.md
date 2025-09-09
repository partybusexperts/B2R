Usage

1) Run migration
- Open your Supabase project SQL editor and paste `supabase/migrations/0001_create_content_points_and_notes.sql` or run via psql against the DB.

2) Configure env vars (server)
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE

3) Use the admin helper in server-side code

Example usage in a server route (Next.js app dir route):

import { createContentPoint, addNote } from '@/lib/supabaseAdmin';

export async function POST(req) {
  const { key, title, body } = await req.json();
  const point = await createContentPoint(key, title, body);
  return new Response(JSON.stringify(point));
}

Notes
- Service role key must never be exposed to client-side code.
- Consider adding RLS policies and a dedicated admin-only service role for production.
