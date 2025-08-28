"use client";

import React, { useEffect, useState } from 'react';

type Props = { params: { id: string } };

export default function EmbedPoll({ params }: Props) {
  const pollId = params?.id || '';
  const [results, setResults] = useState<Record<string, number>>({});
  const [options, setOptions] = useState<string[]>([]);
  const [question, setQuestion] = useState<string>(pollId);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/poll/results/${encodeURIComponent(pollId)}`);
        if (!res.ok) throw new Error('no');
        const j = await res.json();
        if (!mounted) return;
        const r = j.results || {};
        setResults(r);
        // derive options from results if present
        const opts = Object.keys(r);
        if (opts.length) {
          setOptions(opts);
          setQuestion(pollId.replaceAll('__', ' — '));
        }
      } catch (e) {
        // leave empty
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [pollId]);

  const total = Object.values(results).reduce((a, b) => a + Number(b), 0);

  const handleVote = async (opt: string) => {
    setSelected(opt);
    try {
      await fetch('/api/poll/vote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ poll_id: pollId, option: opt }) });
      setVoted(true);
      // refresh
      const r = await fetch(`/api/poll/results/${encodeURIComponent(pollId)}`);
      if (r.ok) {
        const j = await r.json();
        setResults(j.results || {});
      }
    } catch { /* ignore */ }
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, Arial', background: 'white', padding: 12, borderRadius: 8, width: 320, color: '#0b2545' }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>{question}</div>
      {loading && <div style={{ fontSize: 12, color: '#61759a' }}>Loading…</div>}
      {!loading && !voted && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(options.length ? options : ['A','B']).map((o) => (
            <button key={o} onClick={() => handleVote(o)} style={{ padding: '6px 10px', background: '#0f6adc', color: 'white', borderRadius: 6, border: 'none', cursor: 'pointer' }}>{o}</button>
          ))}
        </div>
      )}
      {!loading && voted && (
        <div style={{ marginTop: 8 }}>
          {(options.length ? options : Object.keys(results)).map((o) => {
            const count = Number(results[o] || 0);
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const mine = selected === o;
            return (
              <div key={o} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 90, fontSize: 13 }}>{o}{mine ? ' ✓' : ''}</div>
                <div style={{ flex: 1, background: '#e6f0ff', height: 10, borderRadius: 6 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: mine ? '#18a558' : '#0f6adc', borderRadius: 6 }} />
                </div>
                <div style={{ width: 40, textAlign: 'right', fontSize: 12 }}>{count} {total>0?`(${pct}%)`:''}</div>
              </div>
            );
          })}
        </div>
      )}
      <div style={{ marginTop: 10, fontSize: 12, color: '#8aa0d6' }}>Powered by Bus2Ride — embed this iframe on your site</div>
    </div>
  );
}
