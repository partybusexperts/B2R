"use client";

import React, { useState } from "react";

type Poll = {
  id: string;
  question: string;
  options: string[];
  tags?: string[];
  active?: boolean;
};

async function castVote(poll_id: string, option: string) {
  const r = await fetch("/api/poll/vote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ poll_id, option }),
  });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(j?.error || "Vote failed");
  }
  return r.json() as Promise<{ ok: true; results: Record<string, number>; total: number }>;
}

function alreadyVoted(pollId: string): boolean {
  if (typeof document === "undefined") return false;
  const ck = document.cookie.split("; ").find((x) => x.startsWith(`pv_${pollId}=`));
  const ls = typeof localStorage !== "undefined" && localStorage.getItem(`pv_${pollId}`) === "1";
  return Boolean(ck || ls);
}
function markVoted(pollId: string) {
  try { localStorage.setItem(`pv_${pollId}`, "1"); } catch {}
}

function copyEmbedToClipboard(pollId: string) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const code = `<iframe src="${origin}/embed/poll/${pollId}" width="420" height="300" frameborder="0" scrolling="no"></iframe>`;
  navigator.clipboard.writeText(code);
}

export default function PollCardPro({
  poll,
  initialCounts,
  onCopied,
}: {
  poll: Poll;
  initialCounts: Record<string, number>;
  onCopied?: () => void;
}) {
  const [counts, setCounts] = useState<Record<string, number>>(initialCounts || {});
  const [total, setTotal] = useState<number>(() => Object.values(initialCounts || {}).reduce((a, b) => a + b, 0));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);

  const voted = alreadyVoted(poll.id);
  const pct = (opt: string) => {
    const c = counts?.[opt] || 0;
    if (!total) return 0;
    return Math.round((c / total) * 100);
  };

  const onVote = async (opt: string) => {
    if (busy || voted) return;
    setBusy(true); setErr("");
    try {
      const res = await castVote(poll.id, opt);
      setCounts(res.results);
      setTotal(res.total);
      markVoted(poll.id);
      // fire-and-forget analytics
      fetch("/api/analytics", { method: "POST", body: JSON.stringify({ event: "vote", pollId: poll.id, option: opt }) }).catch(() => {});
    } catch (e: any) {
      setErr(e?.message || "Vote failed");
    } finally {
      setBusy(false);
    }
  };

  const onCopy = () => {
    copyEmbedToClipboard(poll.id);
    setCopied(true);
    onCopied?.();
    // analytics
    fetch("/api/analytics", { method: "POST", body: JSON.stringify({ event: "copy_embed", pollId: poll.id }) }).catch(() => {});
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div id={`poll-${poll.id}`} className="bg-[#12244e] rounded-2xl shadow-xl border border-blue-800/30 p-6">
      <h3 className="text-lg font-bold text-blue-50 mb-3">{poll.question}</h3>
      <div className="space-y-2">
        {poll.options.map((opt) => {
          const percentage = pct(opt);
          return (
            <button
              key={opt}
              disabled={busy || voted}
              onClick={() => onVote(opt)}
              className="w-full text-left bg-[#0f1f46] hover:bg-[#0d1b3a] disabled:opacity-60 border border-blue-800/40 rounded-lg p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-blue-100">{opt}</span>
                <span className="text-blue-300 text-sm">{percentage}%</span>
              </div>
              <div className="mt-2 h-2 rounded bg-blue-900/40">
                <div className="h-2 rounded bg-blue-500" style={{ width: `${percentage}%` }} />
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <div className="text-blue-300">Total votes: {total}</div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCopy}
            className="px-3 py-1 rounded-lg bg-white text-blue-900 font-semibold border border-blue-200 hover:bg-blue-50"
            aria-label="Copy embed code"
            title="Copy embed code"
          >
            {copied ? "Copied!" : "Copy Embed"}
          </button>
          <a
            href={`/poll-results`}
            className="px-3 py-1 rounded-lg bg-blue-600 text-white font-semibold border border-blue-700 hover:bg-blue-700"
            title="See combined results"
          >
            Results
          </a>
        </div>
      </div>
      {err && <div className="mt-2 text-red-300 text-sm">{err}</div>}
    </div>
  );
}
