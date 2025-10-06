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
  const [showResults, setShowResults] = useState(false);

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
        setShowResults(true);
      }
    } catch (err) {
      console.error("PollInlineCard: vote failed", err);
    }
  }

  async function fetchAndShowResults() {
    if (!pollId) return setShowResults(true);
    try {
      setLoading(true);
      const t = await fetchTotals(pollId);
      setTotals(t ?? new Map());
      setShowResults(true);
    } catch (err) {
      console.error("PollInlineCard: failed to fetch totals", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg bg-white/5 ring-1 ring-white/10 px-2 py-1.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-start gap-2">
          <span className="mt-[3px] inline-block h-2 w-2 rounded-full bg-sky-400 flex-shrink-0" />
          <h4 className="font-semibold leading-tight text-white text-sm md:text-[14px]">{question}</h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchAndShowResults()}
            className="text-xs md:text-sm text-white/80 bg-white/6 hover:bg-white/8 px-2 py-1 rounded-md ring-1 ring-white/10"
          >
            View results
          </button>
        </div>
      </div>

      {loading && <div className="mt-1 text-xs text-white/60">Loading options…</div>}

      {!loading && !opts.length && (
        <div className="mt-1 text-xs text-white/50">No options available for this poll.</div>
      )}

      {!loading && opts.length > 0 && (
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {opts.map((o) => {
            const count = totals.get(o.option_id) ?? 0;
            const pct = (showResults || voted) && totalVotes ? Math.round((count * 100) / totalVotes) : 0;
            const isChosen = selected === o.option_id;

            return (
              <div key={o.option_id} className="w-full">
                <button
                  onClick={() => onVote(o.option_id)}
                  disabled={voted}
                  aria-pressed={isChosen}
                  className={`w-full flex items-center justify-between gap-3 rounded-full px-4 py-3 text-[14px] md:text-[15px] font-semibold transition-all duration-200 ease-out
                      ${isChosen ? "bg-gradient-to-r from-sky-500/80 to-indigo-500/70 text-white shadow-md scale-100" : "bg-white/6 hover:scale-[1.01] hover:shadow-sm text-white/95"}
                      ${voted ? "cursor-not-allowed opacity-80" : "cursor-pointer"}
                    `}
                >
                    <span className="truncate">{o.label}</span>
                    {(showResults || voted) ? (
                      <span className="ml-2 inline-flex items-center gap-3">
                        <span className="text-sm font-semibold text-white/95">{pct}%</span>
                        <span className="text-[11px] text-white/60">{count} vote{count === 1 ? "" : "s"}</span>
                      </span>
                    ) : (
                      <svg className="h-4 w-4 text-white/60" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                </button>

                {/* Animated progress bar shown after voting */}
                {(showResults || voted) && (
                  <div className="mt-2 h-2 w-full rounded-full bg-white/6 overflow-hidden">
                    <div
                      className="h-2 bg-gradient-to-r from-sky-400 to-indigo-400 transition-all duration-700 ease-in-out"
                      style={{ width: `${pct}%` }}
                      aria-hidden
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* total summary when results visible */}
      {(showResults || voted) && (
        <div className="mt-2 text-[11px] text-white/70">
          Total votes: <span className="font-semibold text-white/90">{totalVotes}</span>
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
