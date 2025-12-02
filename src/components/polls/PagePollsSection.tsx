"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import PollCardPro from "@/components/PollCardPro";

type RemotePoll = {
  id: string | number;
  slug?: string | null;
  question: string;
  options?: string[] | null;
  option_ids?: Array<string | number | null> | null;
  options_id?: Array<string | number | null> | null;
  options_json?: Array<Record<string, unknown>> | null;
  results?: Array<{ option_id?: string | number | null; votes?: number | null }> | null;
};

type NormalizedPoll = {
  id: string;
  slug?: string;
  question: string;
  options: string[];
  optionIds?: Array<string | number>;
  results?: Array<{ option_id: string | number; votes: number }>;
};

type SlotConfig = {
  title: string;
  subtitle?: string;
  tag: string;
  limit?: number;
};

interface PagePollsSectionProps {
  heading?: string;
  slots: SlotConfig[];
}

function makeFallbackId() {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    // ignore
  }
  return `poll-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function mapRemotePoll(poll: RemotePoll): NormalizedPoll | null {
  if (!poll) return null;

  const optionLabels = Array.isArray(poll.options)
    ? poll.options.filter((opt): opt is string => typeof opt === "string" && opt.trim().length > 0)
    : [];

  if (!optionLabels.length) return null;

  const idsSource = Array.isArray(poll.option_ids)
    ? poll.option_ids
    : Array.isArray(poll.options_id)
      ? poll.options_id
      : undefined;
  const metaSource = Array.isArray(poll.options_json) ? poll.options_json : [];

  const optionIds = optionLabels.map((_, idx) => {
    const metaItem = metaSource[idx] as Record<string, unknown> | undefined;
    const metaId = metaItem && (metaItem.id as string | number | null | undefined);
    const rawId = idsSource?.[idx] ?? metaId;
    if (typeof rawId === "string" || typeof rawId === "number") return rawId;
    return `${idx}`;
  });

  const normalizedResults = Array.isArray(poll.results)
    ? poll.results
        .map((entry) => {
          if (!entry || entry.option_id === undefined || entry.option_id === null) return null;
          const votes = typeof entry.votes === "number" ? entry.votes : Number(entry.votes ?? 0);
          if (!Number.isFinite(votes)) return null;
          return { option_id: entry.option_id, votes };
        })
        .filter((entry): entry is { option_id: string | number; votes: number } => Boolean(entry))
    : undefined;

  return {
    id: String(poll.id ?? poll.slug ?? makeFallbackId()),
    slug: poll.slug ?? undefined,
    question: poll.question ?? "",
    options: optionLabels,
    optionIds,
    results: normalizedResults,
  };
}

function SlotPolls({ tag, limit = 3, onLoaded }: { tag: string; limit?: number; onLoaded?: (tag: string, polls: NormalizedPoll[]) => void }) {
  const [polls, setPolls] = useState<RemotePoll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/poll/by-tag?tag=${encodeURIComponent(tag)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const payload = await res.json();
        const remotePolls: RemotePoll[] = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.polls)
            ? payload.polls
            : [];

        if (!cancelled) {
          setPolls(remotePolls.slice(0, limit));
        }
      } catch (err) {
        console.error('SlotPolls error', err);
        if (!cancelled) setError('Could not load polls right now.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [tag, limit]);

  const normalizedPolls = useMemo(() => polls.map(mapRemotePoll).filter((poll): poll is NormalizedPoll => Boolean(poll)), [polls]);

  useEffect(() => {
    onLoaded?.(tag, normalizedPolls);
  }, [normalizedPolls, onLoaded, tag]);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
        Loading polls…
      </div>
    );
  }

  if (error || !normalizedPolls.length) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-400">
        No polls to show here yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-h-[520px] overflow-y-auto pr-2">
      {normalizedPolls.map((poll) => (
        <PollCardPro key={poll.id} poll={poll} showFooterActions={false} variant="compact" />
      ))}
    </div>
  );
}

export function PagePollsSection({ heading = "Polls & Rider Stories", slots }: PagePollsSectionProps) {
  if (!slots || slots.length === 0) return null;

  const [loadedPolls, setLoadedPolls] = useState<Record<string, NormalizedPoll[]>>({});

  const handleSlotLoaded = useCallback((tag: string, polls: NormalizedPoll[]) => {
    setLoadedPolls((prev) => {
      const prevPolls = prev[tag] ?? [];
      if (prevPolls.length === polls.length && prevPolls.every((poll, idx) => poll.id === polls[idx].id)) {
        return prev;
      }
      return { ...prev, [tag]: polls };
    });
  }, []);

  const aggregatedPolls = useMemo(() => {
    const seen = new Set<string>();
    const combined: NormalizedPoll[] = [];
    slots.forEach((slot) => {
      (loadedPolls[slot.tag] ?? []).forEach((poll) => {
        if (seen.has(poll.id)) return;
        seen.add(poll.id);
        combined.push(poll);
      });
    });
    return combined;
  }, [loadedPolls, slots]);

  return (
    <section className="mt-14 w-full px-3 md:px-4">
      <div className="mx-auto w-full max-w-6xl rounded-3xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
        <h2 className="mb-5 text-2xl font-semibold text-slate-50">{heading}</h2>

        <div className="grid gap-5 md:grid-cols-3">
          {slots.map((slot) => (
            <div key={slot.title} className="flex flex-col gap-3">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-400">{slot.title}</h3>
                {slot.subtitle && <p className="mt-1 text-xs text-slate-300">{slot.subtitle}</p>}
              </div>

              <SlotPolls tag={slot.tag} limit={slot.limit ?? 3} onLoaded={handleSlotLoaded} />
            </div>
          ))}
        </div>

        {aggregatedPolls.length > 0 && (
          <div className="mt-10 border-t border-slate-800 pt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-400">
              All polls in this section
            </h3>
            <div className="mt-4 space-y-4">
              {aggregatedPolls.map((poll) => (
                <PollCardPro key={`all-${poll.id}`} poll={poll} showFooterActions={false} variant="compact" />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
