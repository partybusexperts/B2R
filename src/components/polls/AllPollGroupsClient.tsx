"use client";

import React, { useMemo, useRef, useState } from "react";
import type { MegaPollGroup } from "@/components/polls/AllPollsSection";
import type { RawPoll } from "../../lib/home-polls";

function slugForPoll(id?: string | null, slug?: string | null) {
  return slug || id || "poll";
}

function chunkIntoColumns<T>(items: T[]): [T[], T[]] {
  const half = Math.ceil(items.length / 2);
  return [items.slice(0, half), items.slice(half)];
}

function deriveChips(poll: { slug?: string | null; tags?: string[] | null }): string[] {
  if (poll.tags?.length) {
    return poll.tags.slice(0, 3);
  }
  const slug = poll.slug ?? "";
  return slug
    .split("-")
    .map((token) => token.trim())
    .filter((token) => token.length >= 3)
    .slice(0, 3);
}

function renderOptions(options?: string[] | null) {
  const safeOptions = options && options.length ? options : ["Yes", "No"];
  return safeOptions.slice(0, 5);
}

export default function AllPollGroupsClient({
  groups,
  totalCount,
  resultsHref,
}: {
  groups: MegaPollGroup[];
  totalCount: number;
  resultsHref: string;
}) {
  const [query, setQuery] = useState("");
  const [embedPoll, setEmbedPoll] = useState<{ id: string; slug: string | null; question: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const groupRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((group) => ({
        ...group,
        polls: group.polls.filter((poll) => {
          const haystack = `${poll.question} ${poll.slug ?? ""}`.toLowerCase();
          return haystack.includes(q);
        }),
      }))
      .filter((group) => group.polls.length > 0);
  }, [groups, query]);

  const visibleCount = useMemo(
    () => filteredGroups.reduce((sum, group) => sum + group.polls.length, 0),
    [filteredGroups]
  );

  const handleJump = (key: string) => {
    const node = groupRefs.current[key];
    if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const embedOrigin = typeof window !== "undefined" ? window.location.origin : "https://partybus.com";
  const embedCode = embedPoll
    ? `<iframe src="${embedOrigin}/embed/poll/${slugForPoll(embedPoll.id, embedPoll.slug)}" width="100%" height="420" style="border:0;border-radius:16px;overflow:hidden" loading="lazy" referrerpolicy="no-referrer"></iframe>`
    : "";

  async function copyEmbed() {
    if (!embedCode) return;
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-12 space-y-10">
      <div className="rounded-3xl border border-white/15 bg-white/5 p-6 text-white shadow-[0_25px_70px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">Search the library</p>
            <h3 className="mt-2 text-2xl font-semibold">Dial in on any topic instantly</h3>
            <p className="text-sm text-white/70">
              Filtering {visibleCount.toLocaleString()} of {totalCount.toLocaleString()} polls
            </p>
          </div>
          <div className="w-full md:w-96">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by keyword, city, vehicle, or tag…"
              className="w-full rounded-2xl border border-white/20 bg-[#050c1f] px-4 py-3 text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/70">
          <span className="rounded-full border border-white/20 px-3 py-1 text-[11px] uppercase tracking-[0.25em]">
            {groups.length} major categories
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1">
            {visibleCount.toLocaleString()} visible
          </span>
        </div>
      </div>

      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
        {groups.map((group) => (
          <button
            key={group.key}
            type="button"
            onClick={() => handleJump(group.key)}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-white/40"
          >
            <span>{group.title}</span>
            <span className="rounded-full border border-white/20 px-2 py-0.5 text-[11px] text-white/70">
              {group.polls.length}
            </span>
          </button>
        ))}
      </div>

      {filteredGroups.map((group) => {
        const [left, right] = chunkIntoColumns<RawPoll>(group.polls);
        return (
          <section
            key={group.key}
            id={group.key}
            ref={(node: HTMLDivElement | null) => {
              groupRefs.current[group.key] = node;
            }}
            className="scroll-mt-24 rounded-[36px] border border-white/10 bg-gradient-to-br p-6 md:p-8"
            style={{ backgroundImage: `linear-gradient(135deg, ${group.accentFrom}, ${group.accentTo})` }}
          >
            <header className="flex flex-col gap-5 text-white md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">{group.tagline}</p>
                <h3 className="mt-2 text-3xl font-semibold">{group.title}</h3>
                <p className="mt-3 max-w-2xl text-white/80">{group.blurb}</p>
                {group.highlights.length ? (
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/70">
                    {group.highlights.map((chip) => (
                      <span key={chip} className="rounded-full border border-white/20 bg-white/10 px-3 py-1">
                        {chip}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-center">
                <div className="text-4xl" aria-hidden>
                  {group.icon}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60">Polls</p>
                  <p className="text-2xl font-semibold">{group.polls.length}</p>
                </div>
              </div>
            </header>

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {[left, right].map((column, idx) => (
                <div key={idx} className="space-y-4">
                  {column.length ? (
                    column.map((poll) => {
                      const focus = slugForPoll(poll.id, poll.slug);
                      const resultsUrl = `${resultsHref}?focus=${encodeURIComponent(focus)}`;
                      return (
                        <article
                          key={`${poll.id}-${idx}`}
                          className="rounded-3xl border border-white/15 bg-white/5 p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                        >
                          <p className="text-sm font-semibold leading-snug text-white/90">{poll.question}</p>

                          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/50">
                            <span className="rounded-full border border-white/15 px-2 py-0.5">{group.title}</span>
                            {deriveChips(poll).map((chip) => (
                              <span key={chip} className="rounded-full border border-white/10 px-2 py-0.5 text-white/60">
                                {chip}
                              </span>
                            ))}
                          </div>

                          <ul className="mt-4 space-y-1 text-sm text-white/80">
                            {renderOptions(poll.options).map((option) => (
                              <li key={option} className="flex items-center gap-2">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/60" aria-hidden />
                                <span>{option}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <a
                              href={resultsUrl}
                              className="inline-flex items-center gap-1 rounded-full border border-emerald-300/70 bg-emerald-400/20 px-4 py-1.5 text-xs font-semibold text-emerald-50 shadow-inner animate-pulse"
                            >
                              See live results
                              <span aria-hidden>↗</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => setEmbedPoll({ id: poll.id, slug: poll.slug ?? null, question: poll.question })}
                              className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80 hover:border-white/50"
                            >
                              Embed live poll
                            </button>
                            <a
                              href={resultsUrl}
                              className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/60 hover:text-white"
                            >
                              Go to page
                            </a>
                          </div>
                        </article>
                      );
                    })
                  ) : (
                    <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-white/70">
                      No polls match your search in this column.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {embedPoll && (
        <div className="fixed inset-0 z-[1000]">
          <div className="absolute inset-0 bg-black/70" aria-hidden onClick={() => setEmbedPoll(null)} />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="w-full max-w-3xl rounded-3xl border border-white/15 bg-[#040b1c] p-6 text-white shadow-[0_40px_160px_rgba(0,0,0,0.65)]">
              <header className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">Embed live poll</p>
                  <h3 className="mt-2 text-2xl font-semibold">{embedPoll.question}</h3>
                  <p className="mt-2 text-sm text-white/70">
                    This iframe renders the same Supabase-backed poll anywhere. Votes sync instantly back to the shared dataset.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmbedPoll(null)}
                  className="rounded-full border border-white/30 px-3 py-1 text-sm text-white/70 hover:text-white"
                >
                  Close
                </button>
              </header>

              <pre className="mt-6 max-h-[300px] overflow-x-auto rounded-2xl bg-black/40 p-4 text-xs text-emerald-200">
{embedCode}
              </pre>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={copyEmbed}
                  className="rounded-full border border-emerald-300/70 bg-emerald-400/20 px-5 py-2 text-sm font-semibold text-emerald-100 hover:bg-emerald-400/30"
                >
                  {copied ? "Copied!" : "Copy embed code"}
                </button>
                <a
                  href="mailto:data@partybus.com?subject=Poll%20data%20access"
                  className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50 hover:text-white"
                >
                  Need API access?
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
