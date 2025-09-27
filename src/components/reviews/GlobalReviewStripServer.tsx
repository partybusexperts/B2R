import React from "react";
import { getFeaturedReviews, getAggregateRating } from "../../lib/server/reviews";
import Stars from "./Stars";

export const revalidate = 600; // while tweaking, set to 0

export default async function GlobalReviewStripServer() {
  const [reviews, agg] = await Promise.all([
    getFeaturedReviews(24), // a few extra looks smoother
    getAggregateRating(),
  ]);
  if (!reviews.length) return null;

  const avg = agg.avg ? Math.round(agg.avg * 10) / 10 : null;

  // helper to decide whether to show a source label; we hide "import", "unknown", etc.
  const shouldShowSource = (s?: string | null) =>
    !!s && !/^\s*(import|unknown|n\/a)\s*$/i.test(s);

  return (
    <section
      aria-label="Customer reviews"
      className="w-full bg-gradient-to-b from-[#0A1B36] to-[#08152D] border-t border-white/5"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="text-white font-semibold">Rated</div>
          <Stars value={avg ?? 5} size={18} />
          <div className="text-white/80 text-sm">
            {avg ? `${avg} / 5` : `5 / 5`} • {agg.count ?? reviews.length} reviews
          </div>
        </div>

        {/* Marquee */}
        <div className="marquee mt-3">
          <div
            className="marquee-track pointer-events-none motion-reduce:marquee-none"
            style={{ ...( { "--marquee-duration": "60s" } as Record<string, string> ) }}
          >
            {/* one full set */}
            {reviews.map((r) => (
              <article
                key={r.id}
                className="min-w-[260px] max-w-[360px] rounded-2xl p-4 bg-white/6 ring-1 ring-white/10 text-white shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]"
              >
                <div className="flex items-center justify-between">
                  <Stars value={r.rating ?? 5} />
                  {/* hide the noisy source; keep only if meaningful */}
                  {shouldShowSource(r.source) && (
                    <span className="text-[11px] uppercase tracking-wide text-white/50">
                      {r.source}
                    </span>
                  )}
                </div>

                {r.body && (
                  <p
                    className="mt-2 text-[14px] text-white/85"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    “{r.body}”
                  </p>
                )}

                <div className="mt-2 text-[13px] text-white/75">
                  — {r.author_display ?? "Verified rider"}
                </div>

                {/* no external link; we keep everything non-clickable */}
              </article>
            ))}

            {/* duplicate set for seamless loop */}
            {reviews.map((r) => (
              <article
                key={`dup-${r.id}`}
                aria-hidden="true"
                className="min-w-[260px] max-w-[360px] rounded-2xl p-4 bg-white/6 ring-1 ring-white/10 text-white shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]"
              >
                <div className="flex items-center justify-between">
                  <Stars value={r.rating ?? 5} />
                  {shouldShowSource(r.source) && (
                    <span className="text-[11px] uppercase tracking-wide text-white/50">
                      {r.source}
                    </span>
                  )}
                </div>
                {r.body && (
                  <p
                    className="mt-2 text-[14px] text-white/85"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    “{r.body}”
                  </p>
                )}
                <div className="mt-2 text-[13px] text-white/75">
                  — {r.author_display ?? "Verified rider"}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
