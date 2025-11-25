"use client";

import { useEffect, useMemo, useState } from "react";
import type { FaqItem } from "@/lib/server/faqs";

type Props = {
  faqs: FaqItem[];
};

const INITIAL_BATCH = 10;
const BATCH_SIZE = 10;

export default function FaqSearchClient({ faqs }: Props) {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH);

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter((faq) => faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q));
  }, [faqs, query]);

  const isSearching = query.trim().length > 0;
  const visibleFaqs = isSearching ? filteredFaqs : filteredFaqs.slice(0, visibleCount);
  const canLoadMore = !isSearching && visibleCount < filteredFaqs.length;
  const allConsumed = !isSearching && !canLoadMore && filteredFaqs.length >= INITIAL_BATCH;

  useEffect(() => {
    if (isSearching) {
      setVisibleCount(filteredFaqs.length);
    } else {
      setVisibleCount((count) => Math.max(INITIAL_BATCH, Math.min(count, filteredFaqs.length)));
    }
  }, [filteredFaqs.length, isSearching]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-2 text-center mb-8">
        <label htmlFor="home-faq-search" className="text-lg font-medium text-white/80">
          Search any home FAQ
        </label>
        <input
          id="home-faq-search"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder='Try "payment", "booking", "safety"...'
          className="w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-base text-white placeholder-white/50 shadow focus:outline-none focus:ring-2 focus:ring-white/40"
        />
        <p className="text-sm text-white/60">Showing {visibleFaqs.length} of {faqs.length} answers</p>
      </div>

      <div className="space-y-3">
        {visibleFaqs.map((faq) => (
          <details
            key={faq.id}
            className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-shadow hover:shadow-lg"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-left text-lg font-semibold text-white">
              <span>{faq.question}</span>
              <span className="text-sm text-white/70 transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="px-6 pb-6 text-base text-white/80">{faq.answer}</div>
          </details>
        ))}

        {!visibleFaqs.length && (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-center text-white/70">
            No answers found. Try a different keyword.
          </div>
        )}
      </div>

      {!isSearching && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {canLoadMore && (
            <button
              type="button"
              onClick={() => setVisibleCount((count) => Math.min(count + BATCH_SIZE, filteredFaqs.length))}
              className="rounded-2xl border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Show 10 more
            </button>
          )}

          {allConsumed && (
            <a
              href="/faq"
              className="rounded-2xl border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              View all FAQs
            </a>
          )}
        </div>
      )}
    </div>
  );
}
