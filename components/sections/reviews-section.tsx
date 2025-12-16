"use client";

import * as React from "react";
import { Search, Check, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { cn } from "@/lib/utils";
import { ReviewsData } from "@/types/reviews.types";
import Link from "next/link";

interface ReviewsSectionProps {
  reviews: ReviewsData[];
  title?: string;
  defaultFilters?: (typeof FILTERS)[number]["tag"][];
}

const FILTERS = [
  { label: "Party Bus", tag: "party-bus" },
  { label: "Limo", tag: "limo" },
  { label: "Weddings", tag: "wedding" },
  { label: "Drivers", tag: "driver" },
  { label: "On Time", tag: "punctuality" },
] as const;

export function ReviewsSection({
  reviews,
  title,
  defaultFilters,
}: ReviewsSectionProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeFilters, setActiveFilters] = React.useState<string[]>(
    defaultFilters || [],
  );

  const toggleFilter = (tag: string) => {
    setActiveFilters((prev) =>
      prev.includes(tag) ? prev.filter((f) => f !== tag) : [...prev, tag],
    );
  };

  const filteredReviews = React.useMemo(() => {
    return reviews.filter((review) => {
      // 1. Text Search
      const matchesSearch =
        review.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.author_display.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Tag Filter
      const matchesTags =
        activeFilters.length === 0 ||
        activeFilters.some((filterTag) => {
          const reviewLabels = [];

          if (review.tags) reviewLabels.push(...review.tags);
          if (review.city_slug) reviewLabels.push(review.city_slug);
          if (review.state_slug) reviewLabels.push(review.state_slug);
          if (review.event_slug) reviewLabels.push(review.event_slug);

          reviewLabels.push(...review.body.toLowerCase().split(" "));

          return reviewLabels.includes(filterTag);
        });

      return matchesSearch && matchesTags;
    });
  }, [reviews, searchQuery, activeFilters]);

  return (
    <section
      className={cn("relative w-full border-t border-white/5 bg-[#051127]")}
    >
      {/* Background effect */}
      <div className="absolute inset-0 opacity-40">
        <div
          className="mx-auto h-full max-w-5xl
            bg-[radial-gradient(circle_at_top,_rgba(58,105,255,0.35),_transparent_55%)]"
        ></div>
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14">
        {/* Header */}
        <div
          className="flex flex-col gap-6 md:flex-row md:items-center
            md:justify-between mb-5"
        >
          <div>
            {" "}
            <p
              className="text-xs font-semibold uppercase tracking-[0.4em]
                text-white/50"
            >
              Verified riders
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white">
              {title || "People can’t stop talking about us"}
            </h2>
            <div className="mt-4 flex items-center gap-3 text-white/80">
              <div
                className="inline-flex items-center gap-2 rounded-full border
                  border-white/15 bg-white/5 px-4 py-1 text-sm font-semibold"
              >
                <StarRating rating={5} />
                <span>5 / 5</span>
              </div>
            </div>
          </div>
          <Link
            href={"/reviews"}
            className="inline-flex items-center justify-center rounded-full
              border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold
              text-white/90 shadow-[0_10px_30px_rgba(3,7,18,0.65)] transition
              hover:border-white/40 hover:bg-white/15"
          >
            Read all reviews
          </Link>
        </div>

        {/* Search & Filter Toolbar */}
        <div
          className="mb-10 flex flex-col items-center justify-between gap-4 p-4
            md:flex-row from-white/12 via-white/6 rounded-3xl border
            border-white/15 bg-gradient-to-br from-white/12 via-white/6
            to-transparent text-white shadow-[0_25px_60px_rgba(3,7,18,0.4)]
            backdrop-blur-sm transition duration-300 hover:-translate-y-1
            hover:border-white/35"
        >
          <div className="relative w-full md:max-w-sm">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2
                text-muted-foreground"
            />
            <Input
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-white/15 bg-gradient-to-br from-white/12
                via-white/6 to-transparent pl-9 text-black"
            />
          </div>

          <div
            className="flex w-full flex-wrap items-center justify-center gap-2
              md:justify-end"
          >
            <span
              className="mr-2 flex items-center gap-2 text-sm font-semibold
                text-white/80"
            >
              <Filter className="h-4 w-4" /> Filter:
            </span>
            {FILTERS.map((filter) => {
              const isActive = activeFilters.includes(filter.tag);
              return (
                <button
                  key={filter.tag}
                  onClick={() => toggleFilter(filter.tag)}
                  className={cn(
                    `inline-flex items-center justify-center rounded-full border
                    border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold
                    text-white/90 shadow-[0_10px_30px_rgba(3,7,18,0.65)]
                    transition hover:border-white/40 hover:bg-white/15`,
                    isActive ? "border-white/40 bg-white/15 shadow-md" : "",
                  )}
                >
                  {isActive && <Check className="h-3 w-3 pr-1" />}
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        {filteredReviews.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredReviews.map((review, idx) => (
              <Card
                key={`${review.id}-${idx}`}
                className="py-0 gap-0 group relative overflow-hidden rounded-3xl
                  border border-white/15 bg-gradient-to-br from-white/12
                  via-white/6 to-transparent p-6 text-white
                  shadow-[0_25px_60px_rgba(3,7,18,0.4)] backdrop-blur-sm
                  transition duration-300 hover:-translate-y-1
                  hover:border-white/35"
              >
                <div
                  className="absolute inset-0 opacity-0 transition
                    group-hover:opacity-30"
                >
                  <div
                    className="h-full w-full
                      bg-[radial-gradient(circle_at_top,_rgba(86,156,255,0.45),_transparent_60%)]"
                  ></div>
                </div>
                <div
                  className="relative flex items-center justify-between gap-3"
                >
                  <StarRating rating={review.rating || 5} />
                </div>
                <p
                  className="relative mt-4 text-[15px] leading-relaxed
                    text-white/90 line-clamp-4 overflow-hidden"
                >
                  &quot;{review.body}&quot;
                </p>
                <div
                  className="relative mt-4 flex items-center gap-2 text-[13px]
                    text-white/75"
                >
                  <span
                    className="inline-block h-[6px] w-[6px] rounded-full
                      bg-emerald-400"
                  ></span>
                  {"— "}
                  {review.author_display || "Anonymous"}
                </div>

                {/* Tags Display (If exists) */}
              </Card>
            ))}
          </div>
        ) : (
          <div
            className="rounded-3xl border border-dashed border-border
              bg-muted/20 py-20 text-center"
          >
            <h3 className="text-lg font-semibold">No reviews found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters.
            </p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("");
                setActiveFilters([]);
              }}
              className="mt-2 text-primary"
            >
              Clear all filters
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 text-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="inline-flex items-center justify-center rounded-full
              bg-white/95 px-7 py-3 text-sm font-semibold text-[#04132d]
              shadow-[0_15px_40px_rgba(10,27,54,0.35)] transition
              hover:translate-y-0.5 hover:bg-white"
          >
            <Link href="/reviews">See more reviews</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
