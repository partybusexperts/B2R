"use client";

import React, { useMemo, useRef, useState } from 'react';

/* ===== Types (robust to varied registry shapes) ===== */
type Poll = {
  id?: string | number;
  question?: string;
  title?: string;
 
  const title = (raw || 'Misc')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return `${title} Polls`;
}

/* ===== Small Poll Card ===== */
function PollCard({ poll }: { poll: Poll }) {
  const [answer, setAnswer] = useState<string>('');
  const opts = Array.isArray(poll.options) && poll.options.length > 0 ? poll.options : ['Yes', 'No'];

  return (
    <div className="rounded-xl border border-slate-200 bg-white/70 p-3 shadow-sm hover:shadow transition">
      <div className="text-sm font-semibold text-slate-800 leading-snug mb-2">
        {getQuestion(poll)}
      </div>
      <div className="flex flex-wrap gap-2">
        {opts.map((opt, i) => {
          const id = String(poll.id ?? getQuestion(poll)) + '-' + i;
          const selected = answer === opt;
          return (
            <label
              key={id}
              className={`cursor-pointer rounded-full px-3 py-1 text-sm border ${
                selected
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-900 border-slate-300 hover:border-slate-500'
              }`}
            >
              <input
                type="radio"
                name={`poll-${poll.id ?? getQuestion(poll)}`}
                value={opt}
                className="sr-only"
                onChange={() => setAnswer(opt)}
              />
              {opt}
            </label>
          );
        })}
      </div>
    </div>
  );
}

/* ===== Main Component ===== */
export default function ClientPolls({ polls }: { polls: Poll[] }) {
  const [q, setQ] = useState('');
  const [jumpSlug, setJumpSlug] = useState<string>('');

  // Build categories -> items
  const data = useMemo(() => {
    const byCat: Record<string, { raw: string; items: Poll[] }> = {};
    for (const p of polls || []) {
      const raw = getCategoryRaw(p);
      const slug = slugify(raw);
      if (!byCat[slug]) byCat[slug] = { raw, items: [] };
      byCat[slug].items.push(p);
    }
    const entries = Object.entries(byCat).map(([slug, { raw, items }]) => ({
      slug,
      raw,
      pretty: prettifyCategory(raw),
      items,
      count: items.length,
    }));
    // Sort by biggest categories first
    entries.sort((a, b) => b.count - a.count || a.pretty.localeCompare(b.pretty));
    const total = polls?.length || 0;
    return { entries, total };
  }, [polls]);

  // Refs for jump-to-category scroll
  const catRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const handleJump = (slug: string) => {
    setJumpSlug(slug);
    const el = catRefs.current[slug];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Filter fn for search
  const matches = (p: Poll) => {
    if (!q.trim()) return true;
    const hay = [
      getQuestion(p),
      getCategoryRaw(p),
      ...(Array.isArray(p.options) ? p.options : []),
      ...(Array.isArray(p.tags) ? p.tags : []),
    ]
      .join(' ')
      .toLowerCase();
    return hay.includes(q.toLowerCase());
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky header: search + categories */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col md:flex-row gap-3 md:items-center">
          {/* Search */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-600 mb-1">Search Polls</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Type to filter by question, options, tags…"
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          {/* Categories dropdown (with counts) */}
          <div className="w-full md:w-80">
            <label className="block text-xs font-medium text-slate-600 mb-1">Categories</label>
            <select
              value={jumpSlug}
              onChange={(e) => {
                const val = e.target.value;
                if (val) handleJump(val);
              }}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <option value="">Jump to a category…</option>
              {data.entries.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.pretty} ({c.count})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary bar */}
      <div className="mx-auto max-w-7xl px-4 pt-4 pb-2 text-slate-600 text-sm">
        <span className="font-semibold text-slate-900">{data.total}</span> polls total.
        {q ? (
          <span className="ml-2">Filtering by “{q}”.</span>
        ) : null}
      </div>

      {/* Grid of scrollable category boxes */}
      <div className="mx-auto max-w-7xl px-4 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.entries.map((cat) => {
          const filtered = cat.items.filter(matches);
          const showing = filtered.length;
          const headerNote =
            q && showing !== cat.count
              ? `${cat.count} total · ${showing} match`
              : `${cat.count} total`;

          return (
            <div
              key={cat.slug}
              ref={(el) => (catRefs.current[cat.slug] = el)}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/60">
                <div className="text-base font-bold text-slate-900">{cat.pretty}</div>
                <div className="text-xs text-slate-600">{headerNote}</div>
              </div>

              {/* Scrollable area */}
              <div className="max-h-[28rem] overflow-y-auto p-4 space-y-3">
                {filtered.length === 0 ? (
                  <div className="text-sm text-slate-500">No polls match your search in this category.</div>
                ) : (
                  filtered.map((p, idx) => (
                    <PollCard key={(p.id ?? `${cat.slug}-${idx}`) as React.Key} poll={p} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
'use client';

import React, { useState, useMemo } from 'react';
import PollCardPro from './PollCardPro';
import type { PollReg as Poll } from '@/data/pollsRegistry';

interface ClientPollsProps {
  polls: Poll[];
}

export default function ClientPolls({ polls }: ClientPollsProps) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    polls.forEach((p) => p.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [polls]);

  const filtered = useMemo(() => {
    return polls.filter((p) => {
      const matchTag = selectedTag ? p.tags?.includes(selectedTag) : true;
      const q = query.toLowerCase().trim();
      const matchQuery = !q || p.question.toLowerCase().includes(q);
      return matchTag && matchQuery;
    });
  }, [polls, selectedTag, query]);

  return (
    <main className="p-6">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search polls..."
          className="flex-1 px-4 py-2 border rounded"
        />
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Categories</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((poll) => (
          <PollCardPro key={poll.id} poll={poll} initialCounts={{}} />
        ))}
      </div>
    </main>
  );
}
