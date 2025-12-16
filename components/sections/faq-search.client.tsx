"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaqClient } from "@/components/sections/faq-client";
import type { FaqData } from "@/lib/data/faqs";

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ");
}

function filterFaqsLocally(faqs: FaqData[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return faqs;

  return faqs.filter((faq) => {
    const question = (faq.question ?? "").toString();
    const answer = stripHtml((faq.answer ?? "").toString());
    const haystack = `${question} ${answer}`.replace(/\s+/g, " ").toLowerCase();
    return haystack.includes(normalized);
  });
}

const mapCategoryToName = {
  home: "home",
  booking: "booking",
  pricing: "pricing",
  vehicles: "vehicles",
  safety: "safety",
  "party-buses": "party buses",
  limousines: "limousines",
  "coach-buses": "coach buses",
} as { [key: string]: string };

export function FaqSearchClient({
  category,
  faqs,
  title = "Frequently Asked Questions",
  aboveTitle = "Got questions?",
  description = "Search answers about booking, pricing, and vehicles.",
  inputPlaceholder = '\'Try "payment", "booking", "safety"…\'',
  initialCount = 8,
  searchMode = "hybrid",
}: {
  category?: string;
  faqs: FaqData[];
  title?: string;
  aboveTitle?: string;
  description?: string;
  inputPlaceholder?: string;
  initialCount?: number;
  searchMode?: "client" | "server" | "hybrid";
}) {
  const [query, setQuery] = React.useState("");
  const [serverFaqs, setServerFaqs] = React.useState<FaqData[] | null>(null);
  const [isSearching, setIsSearching] = React.useState(false);
  const [hasSearchError, setHasSearchError] = React.useState(false);

  const normalizedQuery = query.trim();

  const localResults = React.useMemo(() => {
    return filterFaqsLocally(faqs, normalizedQuery);
  }, [faqs, normalizedQuery]);

  const shouldSearchServer =
    normalizedQuery.length > 0 &&
    searchMode !== "client" &&
    (searchMode === "server" || localResults.length === 0);

  React.useEffect(() => {
    if (!shouldSearchServer) {
      setServerFaqs(null);
      setIsSearching(false);
      setHasSearchError(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        setIsSearching(true);
        setHasSearchError(false);

        const url = new URL("/api/faqs/search", window.location.origin);
        if (category) url.searchParams.set("category", category);
        url.searchParams.set("q", query);
        url.searchParams.set("limit", "200");

        const response = await fetch(url.toString(), {
          signal: controller.signal,
        });

        if (!response.ok) {
          setHasSearchError(true);
          setServerFaqs([]);
          return;
        }

        const body = (await response.json()) as { faqs?: FaqData[] };
        setServerFaqs(body.faqs ?? []);
      } catch (error) {
        if ((error as { name?: string }).name === "AbortError") return;
        setHasSearchError(true);
        setServerFaqs([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [category, query, shouldSearchServer]);

  const visibleFaqs = !normalizedQuery
    ? faqs
    : localResults.length > 0 && searchMode !== "server"
      ? localResults
      : (serverFaqs ?? []);

  const effectiveInitialCount = normalizedQuery
    ? visibleFaqs.length
    : initialCount;

  return (
    <section className="py-20 md:py-24 bg-[#0E1F46]">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">
            {aboveTitle}
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base text-white/70">{description}</p>
        </div>

        <div className="mx-auto max-w-6xl">
          {/* Search */}
          <div className="flex flex-col gap-2 text-center mb-8">
            <label className="text-lg font-medium text-white/80">{`Search any ${mapCategoryToName[category ?? "general"]} FAQ`}</label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full">
                <Search
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2
                    text-muted-foreground"
                />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={inputPlaceholder}
                  className="w-full rounded-2xl border border-white/15
                    bg-white/5 px-5 py-3 text-base text-white
                    placeholder-white/50 shadow focus:outline-none focus:ring-2
                    focus:ring-white/40 pl-9 h-12 focus-visible:ring-white/40
                    focus-visible:ring-2"
                />
              </div>

              {query.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setQuery("")}
                  className="shrink-0 rounded-2xl h-12 bg-blue-100
                    hover:bg-white/70 border-0"
                >
                  <X className="h-4 w-4" /> Clear
                </Button>
              )}
            </div>

            <div className="mt-3 text-sm text-white/60">
              {normalizedQuery ? (
                <span>
                  Showing{" "}
                  <span className="font-semibold">{visibleFaqs.length}</span>{" "}
                  result
                  {visibleFaqs.length === 1 ? "" : "s"} for “{query.trim()}”.
                  {isSearching ? " Searching…" : null}
                  {hasSearchError ? " (Search failed)" : null}
                </span>
              ) : (
                <span>
                  Browse <span className="font-semibold">{faqs.length}</span>{" "}
                  questions.
                </span>
              )}
            </div>
          </div>

          {/* Grid */}
          <div className="space-y-3">
            {visibleFaqs.length > 0 ? (
              <FaqClient
                faqs={visibleFaqs}
                initialCount={effectiveInitialCount}
              />
            ) : (
              <div
                className="rounded-3xl border border-dashed border-border
                  bg-muted/20 py-16 text-center"
              >
                <h3 className="text-lg font-semibold text-white">
                  No FAQs found
                </h3>
                <p className="mt-4 text-blue-100">
                  Try a different search (or clear filters).
                </p>
                <Button
                  variant="link"
                  onClick={() => setQuery("")}
                  className="mt-2 text-white"
                >
                  Clear search
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
