// pages/api/vote.js
import { createClient } from '@supabase/supabase-js';

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supa = createClient(SUPA_URL, SUPA_SERVICE);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST' });

  const { poll_id, option_id, voter_key } = req.body;
  if (!poll_id || !option_id) return res.status(400).json({ error: 'Missing poll_id or option_id' });

  const payload = { poll_id, option_id, voter_key: voter_key || null, created_at: new Date().toISOString() };

  const { data, error } = await supa.from('poll_votes1').insert([payload]);

  if (error) {
    if (error.code === '23505' || /duplicate/i.test(error.message || '')) {
      return res.status(409).json({ error: 'Already voted' });
    }
    return res.status(500).json({ error: error.message || 'Insert failed' });
  }
  return res.status(200).json({ ok: true, data });
}
