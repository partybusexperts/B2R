"use client";
import React, { useEffect, useState } from "react";
import { castVote, fetchTotals, fetchOptionsForPoll } from "../../lib/client-helpers";

type Option = { id: string; label: string };

export default function PollInlineCard({ pollId, question }: { pollId: string; question: string }) {
  const [options, setOptions] = useState<Option[]>([]);
  const [totals, setTotals] = useState<Record<string, number>>({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const [opts, agg] = await Promise.all([
        fetchOptionsForPoll(pollId),
        fetchTotals(pollId),
      ]);
      setOptions(opts);
      setTotals(agg.totals);
      setTotalVotes(agg.totalVotes);
    })();
  }, [pollId]);

  async function handleVote(optionId: string) {
    try {
      setBusy(true);
      await castVote(pollId, optionId);
      const agg = await fetchTotals(pollId);
      setTotals(agg.totals);
      setTotalVotes(agg.totalVotes);
      setShowResults(true); // instantly reveal results
    } finally {
      setBusy(false);
    }
  }

  function pctFor(optionId: string) {
    const v = totals[optionId] ?? 0;
    return totalVotes > 0 ? Math.round((v / totalVotes) * 100) : 0;
  }

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
      <div className="mb-3 font-semibold">{question}</div>

      {!showResults ? (
        <div className="grid gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              disabled={busy}
              onClick={() => handleVote(opt.id)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left hover:bg-white/10 transition"
            >
              {opt.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {options.map((opt) => {
            const votes = totals[opt.id] ?? 0;
            const pct = pctFor(opt.id);
            return (
              <div key={opt.id} className="w-full">
                <div className="flex justify-between text-sm mb-1">
                  <span>{opt.label}</span>
                  <span>{pct}% • {votes.toLocaleString()} {votes === 1 ? "vote" : "votes"}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-white/60"
                    style={{ width: `${pct}%` }}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={pct}
                  />
                </div>
              </div>
            );
          })}
          <div className="text-xs text-white/70 pt-1">
            Total votes: {totalVotes.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
