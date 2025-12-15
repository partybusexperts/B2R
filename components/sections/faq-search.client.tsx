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

export function FaqSearchClient({
  category,
  faqs,
  title = "Frequently Asked Questions",
  description = "Search answers about booking, pricing, and vehicles.",
  initialCount = 8,
  searchMode = "hybrid",
}: {
  category?: string;
  faqs: FaqData[];
  title?: string;
  description?: string;
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
    <section className="py-20 md:py-24 bg-card border-b border-border/40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto mb-10 max-w-3xl space-y-4 text-center">
          <h2
            className="text-3xl md:text-4xl font-extrabold tracking-tight
              text-foreground"
          >
            {title}
          </h2>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>

        <div className="mx-auto mb-8 max-w-3xl">
          <div
            className="rounded-2xl border border-border bg-background/60 p-4
              shadow-sm"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full">
                <Search
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2
                    text-muted-foreground"
                />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search FAQs (e.g. pricing, deposit, minimum hours)…"
                  className="pl-9"
                />
              </div>

              {query.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setQuery("")}
                  className="shrink-0 rounded-xl"
                >
                  <X className="h-4 w-4 mr-2" /> Clear
                </Button>
              )}
            </div>

            <div className="mt-3 text-sm text-muted-foreground">
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
        </div>

        <div className="mx-auto max-w-3xl">
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
              <h3 className="text-lg font-semibold">No FAQs found</h3>
              <p className="text-muted-foreground">
                Try a different search (or clear filters).
              </p>
              <Button
                variant="link"
                onClick={() => setQuery("")}
                className="mt-2 text-primary"
              >
                Clear search
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
