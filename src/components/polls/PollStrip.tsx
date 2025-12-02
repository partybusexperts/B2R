'use client';

import { useEffect, useState } from 'react';

type PollOption = {
  id: string;
  label: string;
  sort_order: number;
};

type Poll = {
  id: string;
  slug: string;
  question: string;
  options: PollOption[];
};

interface PollStripProps {
  tag: string;
  title?: string;
  limit?: number;
}

export function PollStrip({ tag, title = 'Quick Polls', limit = 3 }: PollStripProps) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/poll/by-tag?tag=${encodeURIComponent(tag)}`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const payload = await res.json();
        const data: Poll[] = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.polls)
            ? payload.polls
            : [];

        if (!cancelled) {
          setPolls(data.slice(0, limit));
        }
      } catch (err) {
        if (!cancelled) {
          setError('Could not load polls right now.');
          console.error('PollStrip error', err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [tag, limit]);

  if (loading) {
    return (
      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
        Loading polls…
      </div>
    );
  }

  if (error || polls.length === 0) {
    return (
      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">
        No polls to show here yet.
      </div>
    );
  }

  return (
    <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <h2 className="mb-3 text-lg font-semibold text-slate-50">{title}</h2>

      <div className="space-y-4">
        {polls.map((poll) => (
          <div key={poll.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="mb-3 text-sm font-medium text-slate-100">{poll.question}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {poll.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-left text-xs text-slate-200 hover:border-emerald-500 hover:bg-slate-900/80"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
