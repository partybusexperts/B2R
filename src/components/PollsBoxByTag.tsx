"use client";

import React, { useEffect, useState } from "react";

type PollOption = {
  id: string;
  label: string;
  slug: string;
  sort_order: number;
};

type Poll = {
  id: string;
  slug: string;
  question: string;
  options?: PollOption[];
};

interface PollsBoxByTagProps {
  tag: string;
  title?: string;
  subtitle?: string;
}

export const PollsBoxByTag: React.FC<PollsBoxByTagProps> = ({
  tag,
  title,
  subtitle,
}) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    async function loadPolls() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/poll/by-tag?tag=${encodeURIComponent(tag)}`
        );
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json = await res.json();
        setPolls(json.polls || []);
      } catch (err: any) {
        console.error("Error loading polls by tag:", err);
        setError("Sorry, we couldn't load polls right now.");
        setPolls([]);
      } finally {
        setLoading(false);
      }
    }

    loadPolls();
  }, [tag]);

  return (
    <section className="space-y-2">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">
          {title ?? "Wedding Party Bus Polls"}
        </h2>
        <p className="text-xs text-muted-foreground">
          {subtitle ??
            "See what wedding parties loved (or hated) about timelines, routes, and budgets."}
        </p>
      </header>

      {/* Outer box – keeps your navy theme but with clear border + radius */}
      <div className="rounded-2xl border border-slate-200/40 bg-slate-900/40 p-3 text-sm">
        {loading && (
          <p className="text-xs text-slate-200/80">Loading polls…</p>
        )}

        {!loading && error && (
          <p className="text-xs text-red-400">{error}</p>
        )}

        {!loading && !error && polls.length === 0 && (
          <p className="text-xs text-slate-200/70 italic">
            No polls yet for this topic.
          </p>
        )}

        {!loading && !error && polls.length > 0 && (
          <div className="max-h-60 overflow-y-auto pr-2 space-y-1">
            {polls.map((poll) => {
              const isOpen = openId === poll.id;

              return (
                <div key={poll.id} className="space-y-1">
                  {/* Row that looks like your old pills */}
                  <button
                    type="button"
                    onClick={() =>
                      setOpenId(isOpen ? null : poll.id)
                    }
                    className={
                      "w-full flex items-center justify-between rounded-full border px-3 py-1.5 text-xs transition-colors " +
                      (isOpen
                        ? "bg-amber-400 text-slate-900 border-amber-300"
                        : "bg-transparent text-slate-50 border-slate-200/60 hover:bg-slate-700/60")
                    }
                  >
                    <span className="truncate">
                      {poll.question}
                    </span>
                    <span className="ml-2 text-[11px] opacity-80">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {/* Options panel – only when open */}
                  {isOpen && (
                    <div className="ml-4 mr-4 mb-2 rounded-xl border border-slate-200/40 bg-slate-900/70 px-3 py-2">
                      {poll.options && poll.options.length > 0 ? (
                        <ul className="space-y-1 text-[11px] text-slate-100">
                          {poll.options.map((opt) => (
                            <li
                              key={opt.id}
                              className="flex items-center gap-2"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                              <span>{opt.label}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[11px] text-slate-300 italic">
                          No options found for this poll.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!loading && !error && polls.length > 0 && (
          <div className="mt-1 flex justify-between items-center text-[11px] text-slate-200/70">
            <span>{polls.length} polls</span>
            <span className="italic">Scroll for more</span>
          </div>
        )}
      </div>
    </section>
  );
};
