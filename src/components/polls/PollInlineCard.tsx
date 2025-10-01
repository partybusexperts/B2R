"use client"
import React, { useEffect, useMemo, useState } from "react";
import { fetchOptionsForPoll, castVote, fetchTotals } from "../../lib/polls/client-helpers";

type Option = { option_id: string; label: string };
type Props = { pollId: string | null; slug: string | null; question: string };

export default function PollInlineCard({ pollId, slug, question }: Props) {
  const [loading, setLoading] = useState(true);
  const [opts, setOpts] = useState<Option[]>([]);
  const [totals, setTotals] = useState<Map<string, number>>(new Map());
  const [selected, setSelected] = useState<string | null>(null);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const [o, t] = await Promise.all([
          fetchOptionsForPoll(pollId, slug).catch(() => []),
          pollId ? fetchTotals(pollId).catch(() => new Map()) : Promise.resolve(new Map()),
        ]);
        if (!alive) return;
        setOpts(o ?? []);
        setTotals(t ?? new Map());
      } catch (err) {
        console.error("PollInlineCard: failed to load options/totals", err);
        if (!alive) return;
        setOpts([]);
        setTotals(new Map());
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [pollId, slug]);

  const totalVotes = useMemo(() => Array.from(totals.values()).reduce((a, b) => a + b, 0), [totals]);

  async function onVote(optionId: string) {
    if (!pollId || voted) return;
    setSelected(optionId);
    try {
      const res = await castVote(pollId, optionId);
      if (res?.ok) {
        const t = await fetchTotals(pollId);
        setTotals(t ?? new Map());
        setVoted(true);
      }
    } catch (err) {
      console.error("PollInlineCard: vote failed", err);
    }
  }

  return (
    <div className="rounded-lg bg-white/5 ring-1 ring-white/10 px-2 py-1.5">
      <div className="flex items-start gap-1.5">
        <span className="mt-[3px] inline-block h-1 w-1 rounded-full bg-sky-400 flex-shrink-0" />
        <h4 className="font-medium leading-tight text-white text-[12px]">{question}</h4>
      </div>

      {loading && <div className="mt-1 text-xs text-white/60">Loading options…</div>}

      {!loading && !opts.length && (
        <div className="mt-1 text-xs text-white/50">No options available for this poll.</div>
      )}

      {!loading && opts.length > 0 && (
        <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-1">
          {opts.map((o) => {
            const count = totals.get(o.option_id) ?? 0;
            const pct = voted && totalVotes ? Math.round((count * 100) / totalVotes) : 0;
            const isChosen = selected === o.option_id;

            return (
              <button
                key={o.option_id}
                onClick={() => onVote(o.option_id)}
                disabled={voted}
                className={`w-full text-left rounded-md px-2 py-1 text-[11px] transition
                  ${isChosen && voted ? "bg-sky-500/20 ring-1 ring-sky-400" : "bg-white/6 hover:bg-white/8 ring-1 ring-white/10"}
                  ${voted ? "cursor-not-allowed opacity-75" : "cursor-pointer"}
                `}
              >
                <div className="text-white leading-tight">{o.label}</div>
                {voted && (
                  <>
                    <div className="mt-0.5 h-1 w-full rounded bg-white/10 overflow-hidden">
                      <div className="h-1 bg-sky-400" style={{ width: `${pct}%` }} aria-hidden />
                    </div>
                    <div className="mt-0.5 text-[9px] text-white/60 leading-tight">
                      {pct}% • {count} vote{count === 1 ? "" : "s"}
                    </div>
                  </>
                )}
              </button>
            );
          })}
        </div>
      )}

      {(pollId || slug) && (
        <div className="mt-1 text-[9px] text-white/50">
          Use this data on your site? {" "}
          <a
            href={`/embed/poll?${pollId ? `poll_id=${encodeURIComponent(pollId)}` : `slug=${encodeURIComponent(slug ?? "")}`}`}
            className="underline underline-offset-1 hover:text-white/80"
            target="_blank"
            rel="noreferrer noopener"
          >
            Get embed code
          </a>
          .
        </div>
      )}
    </div>
  );
}
