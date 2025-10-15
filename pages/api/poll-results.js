// pages/api/poll-results.js
import { createClient } from '@supabase/supabase-js';
const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  const { poll_id } = req.query;
  if (!poll_id) return res.status(400).json({ error: 'Missing poll_id' });

  const { data: options } = await supa.from('poll_options1').select('id,label').eq('poll_id', poll_id);
  if (!options) return res.status(500).json({ error: 'No options' });

  const { data: votes } = await supa.from('poll_votes1').select('option_id');
  if (!votes) return res.status(500).json({ error: 'No votes' });

  const counts = options.map(o => {
    const c = votes.filter(v => v.option_id === o.id).length;
    return { option_id: o.id, option_label: o.label, votes: c };
  });

  res.status(200).json({ ok: true, results: counts });
}
