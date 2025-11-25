"use client";

import { useMemo, useState } from "react";
import type { FaqItem } from "@/lib/server/faqs";

type Props = {
  faqs: FaqItem[];
};

export default function FaqSearchClient({ faqs }: Props) {
  const [query, setQuery] = useState("");

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter((faq) => faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q));
  }, [faqs, query]);

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
        <p className="text-sm text-white/60">Showing {filteredFaqs.length} of {faqs.length} answers</p>
      </div>

      <div className="space-y-3">
        {filteredFaqs.map((faq) => (
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

        {!filteredFaqs.length && (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-center text-white/70">
            No answers found. Try a different keyword.
          </div>
        )}
      </div>
    </div>
  );
}
