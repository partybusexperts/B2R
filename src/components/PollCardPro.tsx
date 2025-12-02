"use client";

import React, { useEffect, useMemo, useState } from "react";

type PollResultEntry = {
  option_id?: string | number | null;
  votes?: number | null;
};

type Poll = {
  id: string | number;
  slug?: string | null;
  question: string;
  options: string[];
  optionIds?: Array<string | number | null>;
  tags?: string[];
  active?: boolean;
  results?: PollResultEntry[];
};

async function sendVote(pollId: string, option: string, optionId?: string | number | null) {
  const r = await fetch("/api/poll/vote", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      typeof optionId === "string" || typeof optionId === "number"
        ? { poll_id: pollId, option, option_id: optionId }
        : { poll_id: pollId, option }
    ),
  });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(j?.error || "Vote failed");
  }
}

function alreadyVoted(pollId: string): boolean {
  if (typeof document === "undefined") return false;
  const ck = document.cookie.split("; ").find((x) => x.startsWith(`pv_${pollId}=`));
  const ls = typeof localStorage !== "undefined" && localStorage.getItem(`pv_${pollId}`) === "1";
  return Boolean(ck || ls);
}
function markVoted(pollId: string) {
  try { localStorage.setItem(`pv_${pollId}`, "1"); } catch (err) { console.debug("localStorage set failed", err); }
}

type PollCardProProps = {
  poll: Poll;
  initialCounts?: Record<string, number>;
  onCopied?: () => void;
  variant?: "default" | "compact";
  showFooterActions?: boolean;
  mode?: "live" | "results";
};

function normalizeCounts(raw?: Record<string, unknown>) {
  const safe: Record<string, number> = {};
  if (!raw || typeof raw !== "object") return safe;
  for (const [key, value] of Object.entries(raw)) {
    const num = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(num) || num < 0) continue;
    safe[key] = num;
  }
  return safe;
}

type OptionKey = string;

function optionIdKey(optionId?: string | number | null): OptionKey | null {
  if (optionId === null || optionId === undefined) return null;
  return `id:${optionId}`;
}

function makeOptionKey(optionId: string | number | null | undefined, label: string, idx: number): OptionKey {
  const idKey = optionIdKey(optionId);
  if (idKey) return idKey;
  if (label) return `label:${label}`;
  return `idx:${idx}`;
}

function computeStats(
  poll: Poll,
  initialCounts: Record<string, number>,
  optimisticDeltas: Record<OptionKey, number>
) {
  const resultMap = new Map<OptionKey, number>();
  poll.results?.forEach((entry) => {
    if (!entry || entry.option_id === null || entry.option_id === undefined) return;
    const key = optionIdKey(entry.option_id);
    if (!key) return;
    const votes = typeof entry.votes === "number" ? entry.votes : Number(entry.votes ?? 0);
    if (!Number.isFinite(votes) || votes < 0) return;
    resultMap.set(key, votes);
  });

  const counts = poll.options.map((label, idx) => {
    const optionId = poll.optionIds?.[idx] ?? null;
    const key = makeOptionKey(optionId, label, idx);
    const fromResults = resultMap.get(key);
    const fallbackFromInitial =
      initialCounts[label] ?? (optionId !== null && optionId !== undefined ? initialCounts[String(optionId)] : undefined) ?? 0;
    const base = fromResults ?? fallbackFromInitial;
    const optimistic = optimisticDeltas[key] ?? 0;
    return Math.max(0, base + optimistic);
  });

  const total = counts.reduce((sum, val) => sum + val, 0);
  const percentages = counts.map((value) => (total > 0 ? (value / total) * 100 : 0));

  return { counts, percentages, total };
}

export default function PollCardPro({
  poll,
  initialCounts = {},
  onCopied,
  variant = "default",
  showFooterActions = true,
  mode = "live",
}: PollCardProProps) {
  const sanitizedInitialCounts = useMemo(() => normalizeCounts(initialCounts), [initialCounts]);
  const [optimisticDeltas, setOptimisticDeltas] = useState<Record<OptionKey, number>>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [embedMenuOpen, setEmbedMenuOpen] = useState(false);
  const [copiedMode, setCopiedMode] = useState<"live" | "results" | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(() => (mode === "results" ? true : alreadyVoted(String(poll.id))));
  const isCompact = variant === "compact";

  useEffect(() => {
    setHasVoted(mode === "results" ? true : alreadyVoted(String(poll.id)));
    setOptimisticDeltas({});
    setErr("");
    setSelectedIndex(null);
  }, [poll.id, mode]);

  const { counts, percentages, total } = useMemo(
    () => computeStats(poll, sanitizedInitialCounts, optimisticDeltas),
    [poll, sanitizedInitialCounts, optimisticDeltas]
  );

  const showResults = mode === "results" || hasVoted;
  const helperText = showResults
    ? total > 0
      ? `Total votes: ${total.toLocaleString()}`
      : "No votes yet"
    : "Vote to unlock live results";

  const onVote = async (opt: string, idx: number, optId?: string | number | null) => {
    if (busy || hasVoted || mode === "results") return;
    setBusy(true); setErr("");
    setSelectedIndex(idx);
    try {
      const pollId = String(poll.id);
      await sendVote(pollId, opt, optId);
      const key = makeOptionKey(optId ?? null, opt, idx);
      setOptimisticDeltas((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
      markVoted(pollId);
      setHasVoted(true);
      // fire-and-forget analytics
      fetch("/api/analytics", { method: "POST", body: JSON.stringify({ event: "vote", pollId, option: opt }) }).catch((e) => console.debug(e));
    } catch (e: unknown) {
      const msg = e && typeof e === "object" && "message" in e ? String((e as { message?: unknown }).message ?? "") : String(e);
      setErr(msg || "Vote failed");
    } finally {
      setBusy(false);
    }
  };

  const copyEmbedSnippet = async (embedMode: "live" | "results") => {
    const origin = typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || "https://bus2ride.com";
    const normalizedOrigin = origin?.endsWith("/") ? origin.slice(0, -1) : origin;
    const pollId = String(poll.id);
    const slugOrId = encodeURIComponent(String(poll.slug ?? pollId));
    const snippet = `<iframe src="${normalizedOrigin}/embed/poll/${slugOrId}?mode=${embedMode}" width="420" height="320" frameborder="0" scrolling="no"></iframe>`;
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setErr("Clipboard API not available");
      return;
    }
    try {
      await navigator.clipboard.writeText(snippet);
      setCopiedMode(embedMode);
      onCopied?.();
      fetch("/api/analytics", { method: "POST", body: JSON.stringify({ event: "copy_embed", pollId, embedMode }) }).catch(() => {});
      setTimeout(() => setCopiedMode(null), 1500);
    } catch (copyErr) {
      console.error("Failed to copy embed", copyErr);
      setErr("Unable to copy embed code");
    }
  };

  const containerClass = isCompact
    ? "rounded-2xl border border-white/5 bg-gradient-to-br from-[#0b132d] via-[#0f1b3a] to-[#142347] p-4 shadow-[0_20px_50px_rgba(5,8,20,0.65)]"
    : "rounded-3xl border border-white/5 bg-gradient-to-br from-[#0a1024] via-[#0e1630] to-[#162750] p-6 shadow-[0_30px_80px_rgba(5,8,20,0.8)]";

  const optionClass = isCompact
    ? "group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left transition hover:border-blue-400/70 hover:bg-white/10 disabled:opacity-60"
    : "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-blue-400/70 hover:bg-white/10 disabled:opacity-60";

  const headingLabel = mode === "results" ? "Poll results" : "Live poll";

  return (
    <div id={`poll-${poll.id}`} className={containerClass}>
      <div className="mb-4 flex items-start gap-3">
        <div className="flex-1">
          <p className="text-[11px] uppercase tracking-[0.35em] text-blue-300/60">{headingLabel}</p>
          <h3 className={isCompact ? "mt-1 text-base font-semibold text-white" : "mt-1 text-lg font-semibold text-white"}>{poll.question}</h3>
        </div>
        {mode === "live" && !hasVoted && (
          <span className="rounded-full border border-blue-300/30 bg-blue-400/10 px-3 py-1 text-[11px] font-semibold text-blue-100">Tap to vote</span>
        )}
      </div>

      <div className={isCompact ? "space-y-2" : "space-y-3"}>
        {poll.options.map((label, idx) => {
          const optionId = poll.optionIds?.[idx] ?? null;
          const count = counts[idx] ?? 0;
          const pct = Math.min(100, Math.max(0, percentages[idx] ?? 0));
          const isSelected = selectedIndex === idx;
          return (
            <button
              key={`${optionId ?? label ?? idx}`}
              type="button"
              disabled={mode === "results" || hasVoted || busy}
              onClick={() => onVote(label, idx, optionId)}
              className={`group relative flex flex-col rounded-2xl border px-4 py-3 text-left transition-all disabled:opacity-60 ${
                isSelected
                  ? "border-cyan-400/80 bg-cyan-400/10 shadow-lg"
                  : "border-white/5 bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-white">{label}</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-cyan-400/90 transition-[width] duration-300"
                  style={{ width: showResults ? `${pct}%` : "0%" }}
                />
              </div>
              {showResults && (
                <div className="mt-1 flex justify-between text-[11px] text-white/60">
                  <span>{Math.round(pct)}%</span>
                  <span>
                    {count.toLocaleString()} vote{count === 1 ? "" : "s"}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className={isCompact ? "mt-3 flex flex-wrap items-center justify-between gap-2 text-xs" : "mt-4 flex flex-wrap items-center justify-between gap-3 text-sm"}>
        <div className="text-blue-200/80">{helperText}</div>
        {showFooterActions && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setEmbedMenuOpen((prev) => !prev)}
                className={
                  isCompact
                    ? "px-2.5 py-1 rounded-full border border-white/20 bg-white/10 text-xs font-semibold text-blue-50 hover:bg-white/20"
                    : "px-3 py-1.5 rounded-full border border-white/20 bg-white/10 font-semibold text-blue-50 hover:bg-white/20"
                }
                aria-label="Copy embed code"
                title="Copy embed code"
              >
                Copy / Embed
              </button>
              {embedMenuOpen && (
                <div className="absolute right-0 z-20 mt-2 w-60 rounded-2xl border border-white/10 bg-[#0a142e] p-3 shadow-xl">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-blue-300/70">Embed Poll</p>
                  <p className="mt-1 text-xs text-blue-100/70">Choose which version to copy.</p>
                  <div className="mt-3 space-y-2">
                    <button
                      type="button"
                      className="w-full rounded-xl border border-blue-300/40 bg-blue-500/10 px-3 py-2 text-left text-sm font-semibold text-blue-50 hover:border-blue-200"
                      onClick={() => copyEmbedSnippet("live")}
                    >
                      Copy live embed
                    </button>
                    <button
                      type="button"
                      className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-left text-sm font-semibold text-blue-50 hover:border-white/40"
                      onClick={() => copyEmbedSnippet("results")}
                    >
                      Copy results-only embed
                    </button>
                  </div>
                  {copiedMode && (
                    <p className="mt-2 text-[11px] text-green-200/80">
                      {copiedMode === "live" ? "Live" : "Results"} embed copied
                    </p>
                  )}
                </div>
              )}
            </div>
            <a
              href={`/poll-results`}
              className={
                isCompact
                  ? "px-2.5 py-1 rounded-full bg-blue-500 text-xs font-semibold text-white hover:bg-blue-600"
                  : "px-3 py-1.5 rounded-full bg-blue-500 font-semibold text-white hover:bg-blue-600"
              }
              title="See combined results"
            >
              Results
            </a>
          </div>
        )}
      </div>
      {err && <div className={isCompact ? "mt-2 text-red-300 text-xs" : "mt-3 text-red-300 text-sm"}>{err}</div>}
    </div>
  );
}
