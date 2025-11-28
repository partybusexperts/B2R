"use client";

import { useState } from "react";

type FaqItem = {
  id: number | string;
  question: string;
  answer: string;
};

const SECTION_INITIAL = 4;
const SECTION_STEP = 4;

type Props = {
  faqs: FaqItem[];
  initialCount?: number;
  step?: number;
};

export default function FaqSectionList({ faqs, initialCount = SECTION_INITIAL, step = SECTION_STEP }: Props) {
  const [visible, setVisible] = useState(initialCount);
  const visibleFaqs = faqs.slice(0, visible);
  const canLoadMore = visible < faqs.length;
  const remaining = Math.max(0, faqs.length - visible);

  return (
    <>
      <div className="space-y-4">
        {visibleFaqs.map((faq) => (
          <details key={faq.id} className="group rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-left text-base font-semibold text-white">
              <span>{faq.question}</span>
              <span className="text-sm text-white/60 transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="px-5 pb-5 text-sm text-white/80">{faq.answer}</div>
          </details>
        ))}

        {!visibleFaqs.length && (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-6 text-sm text-white/70">No questions yet—coming soon.</div>
        )}
      </div>

      {canLoadMore && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setVisible((prev) => Math.min(faqs.length, prev + step))}
            className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/80 hover:bg-white/15"
          >
            Load {remaining < step ? remaining : step} more
          </button>
        </div>
      )}
    </>
  );
}
