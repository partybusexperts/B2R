"use client";

import * as React from "react";
import { Search, Check, Filter, Quote } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
      className={cn(
        `py-20 md:py-24 border-b border-border/40 bg-primary/5
        dark:bg-background`,
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
          <h2
            className="text-3xl font-extrabold tracking-tight text-foreground
              md:text-4xl"
          >
            {title || "Trusted by thousands of happy riders"}
          </h2>
          <p className="text-lg text-muted-foreground">
            Don{"'"}t just take our word for it. Read verified reviews from real
            customers.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div
          className="mb-10 flex flex-col items-center justify-between gap-4
            rounded-2xl border border-primary/10 bg-background/60 p-4 shadow-sm
            md:flex-row"
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
              className="border-border/60 bg-background/50 pl-9"
            />
          </div>

          <div
            className="flex w-full flex-wrap items-center justify-center gap-2
              md:justify-end"
          >
            <span
              className="mr-2 flex items-center gap-2 text-sm font-semibold
                text-muted-foreground"
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
                    `inline-flex items-center gap-1.5 rounded-full border px-3
                    py-1.5 text-sm font-medium transition-all duration-200`,
                    isActive
                      ? `border-primary bg-primary text-primary-foreground
                        shadow-md`
                      : `border-border bg-background text-muted-foreground
                        hover:border-primary/50 hover:bg-accent`,
                  )}
                >
                  {isActive && <Check className="h-3 w-3" />}
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        {filteredReviews.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredReviews.map((review, idx) => (
              <Card
                key={`${review.id}-${idx}`}
                className="flex h-full flex-col gap-2 border-border/60 shadow-sm
                  transition-shadow hover:shadow-md hover:border-primary/30"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <div
                        className="flex items-center gap-2 font-bold
                          text-foreground"
                      >
                        {review.author_display}
                      </div>
                      <div
                        className="flex items-center gap-2 text-xs
                          text-muted-foreground"
                      >
                        {/* TODO: make source an ENUM or delete it */}
                        {/* {review.source && (
                          <Badge
                            variant="outline"
                            className="h-5 px-1.5 text-[10px] uppercase
                              font-bold tracking-wider"
                          >
                            {review.source}
                          </Badge>
                        )} */}
                        <span>
                          {review.service_date
                            ? new Date(review.service_date).toLocaleDateString()
                            : new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <StarRating rating={review.rating || 5} />
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4">
                  <div className="relative">
                    <Quote
                      className="absolute -left-1 -top-2 h-6 w-6 rotate-180
                        text-primary/10"
                    />
                    <p
                      className="relative z-10 leading-relaxed
                        text-muted-foreground italic"
                    >
                      &quot;{review.body}&quot;
                    </p>
                  </div>

                  {/* Tags Display (If exists) */}
                  {review.tags && review.tags.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-2 pt-4">
                      {review.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-muted text-xs font-normal
                            text-muted-foreground"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
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
        <div className="mt-12 text-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-xl border-primary/20 px-8 font-bold
              hover:bg-primary/5 hover:text-primary"
          >
            <Link href="/reviews">Read all Reviews</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
