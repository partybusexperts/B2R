"use client";

import React, { useMemo, useState } from "react";

export type SimpleReview = {
  id: string;
  author: string;
  body: string;
  rating?: number | null;
  source?: string | null;
};

function formatStars(value?: number | null) {
  const rating = Math.round(value ?? 5);
  return "★".repeat(Math.min(Math.max(rating, 1), 5));
}

export default function ReviewsSearchSection({ reviews }: { reviews: SimpleReview[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return reviews;
    return reviews.filter((review) =>
      `${review.author} ${review.body}`.toLowerCase().includes(q)
    );
  }, [query, reviews]);

  return (
    <section className="mx-auto max-w-7xl rounded-[40px] border border-white/10 bg-gradient-to-br from-[#0b1c3f] via-[#07122a] to-[#040812] px-6 py-12 shadow-[0_60px_160px_rgba(2,6,23,0.65)] text-white">
      <div className="text-center space-y-4 mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">Verified Riders</p>
        <h2 className="text-4xl md:text-5xl font-extrabold">Customer Reviews</h2>
        <p className="text-white/70 max-w-3xl mx-auto">
          Read what groups say before you book. Filter by any keyword to surface relevant experiences instantly.
        </p>
      </div>

      <div className="w-full flex justify-center mb-8">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search reviews by name or keywords…"
          className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-[#0f1f3f] border border-white/15 text-white placeholder-white/50 shadow-inner focus:outline-none focus:ring-2 focus:ring-white/40"
          aria-label="Search reviews"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-white/70">No reviews match that search yet.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((review) => (
            <article
              key={review.id}
              className="relative rounded-2xl border border-white/10 bg-white/5 p-7 shadow-[0_30px_80px_rgba(2,6,23,0.45)]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/15 rounded-full w-11 h-11 flex items-center justify-center text-lg font-bold text-white">
                  {review.author?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">{review.author}</p>
                  {review.source ? (
                    <p className="text-xs uppercase tracking-[0.35em] text-white/50">{review.source}</p>
                  ) : null}
                </div>
                <span className="ml-auto text-yellow-300 text-xl" aria-label={`Rated ${review.rating ?? 5} out of 5`}>
                  {formatStars(review.rating)}
                </span>
              </div>
              <p className="text-white/90 leading-relaxed">“{review.body}”</p>
            </article>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-10">
        <a
          href="/reviews"
          className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-3 text-sm font-semibold text-white hover:border-white/40"
        >
          See all reviews →
        </a>
      </div>
    </section>
  );
}
