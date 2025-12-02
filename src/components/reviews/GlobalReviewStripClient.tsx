"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Stars from "./Stars";

type Review = {
  id: string;
  rating?: number | null;
  body?: string | null;
  source?: string | null;
  author_display?: string | null;
};

type Aggregate = {
  avg?: number | null;
  count?: number | null;
};

type ApiResponse = {
  reviews: Review[];
  agg?: Aggregate;
  aggregate?: Aggregate;
};

export default function GlobalReviewStripClient() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [agg, setAgg] = useState<Aggregate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetch("/api/reviews/featured", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load reviews");
        const data: ApiResponse = await res.json();
        if (!alive) return;
        setReviews(data.reviews || []);
        setAgg(data.agg || data.aggregate || null);
      } catch (error) {
        console.error(error);
        if (!alive) return;
        setReviews([]);
        setAgg(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <section aria-label="Customer reviews loading" className="relative w-full border-t border-white/5 bg-[#051127]">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <p className="text-center text-sm text-white/60">Loading reviews…</p>
        </div>
      </section>
    );
  }

  if (!reviews.length) return null;

  const avg = agg?.avg ? Math.round(agg.avg * 10) / 10 : null;
  const visible = reviews.slice(0, 6);

  const shouldShowSource = (s?: string | null) => !!s && !/^(\s*)(import|unknown|n\/a)(\s*)$/i.test(s);

  return (
    <section aria-label="Customer reviews" className="relative w-full border-t border-white/5 bg-[#051127]">
      <div className="absolute inset-0 opacity-40" aria-hidden>
        <div className="mx-auto h-full max-w-5xl bg-[radial-gradient(circle_at_top,_rgba(58,105,255,0.35),_transparent_55%)]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">Verified riders</p>
            <h2 className="mt-3 text-3xl font-bold text-white">People can’t stop talking about us</h2>
            <div className="mt-4 flex items-center gap-3 text-white/80">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-sm font-semibold">
                <Stars value={avg ?? 5} size={16} />
                <span>{avg ? `${avg} / 5` : "5 / 5"}</span>
              </div>
              <span className="text-sm text-white/60">Based on {agg?.count ?? reviews.length} reviews</span>
            </div>
          </div>
          <Link
            href="/reviews"
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 shadow-[0_10px_30px_rgba(3,7,18,0.65)] transition hover:border-white/40 hover:bg-white/15"
          >
            Read all reviews
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((r) => (
            <article
              key={r.id}
              className="group relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-white/12 via-white/6 to-transparent p-6 text-white shadow-[0_25px_60px_rgba(3,7,18,0.4)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/35"
            >
              <div className="absolute inset-0 opacity-0 transition group-hover:opacity-30" aria-hidden>
                <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(86,156,255,0.45),_transparent_60%)]" />
              </div>
              <div className="relative flex items-center justify-between gap-3">
                <Stars value={r.rating ?? 5} />
                {shouldShowSource(r.source) && (
                  <span className="text-[11px] uppercase tracking-wide text-white/50">{r.source}</span>
                )}
              </div>

              {r.body && (
                <p
                  className="relative mt-4 text-[15px] leading-relaxed text-white/90"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  “{r.body}”
                </p>
              )}

              <div className="relative mt-4 flex items-center gap-2 text-[13px] text-white/75">
                <span className="inline-block h-[6px] w-[6px] rounded-full bg-emerald-400" />
                — {r.author_display ?? "Verified rider"}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/reviews"
            className="inline-flex items-center justify-center rounded-full bg-white/95 px-7 py-3 text-sm font-semibold text-[#04132d] shadow-[0_15px_40px_rgba(10,27,54,0.35)] transition hover:translate-y-0.5 hover:bg-white"
          >
            See more reviews
          </Link>
        </div>
      </div>
    </section>
  );
}
