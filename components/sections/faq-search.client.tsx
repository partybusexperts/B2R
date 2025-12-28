"use client";

import * as React from "react";
import { Search, X, HelpCircle, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaqClient } from "@/components/sections/faq-client";
import type { FaqData } from "@/lib/data/faqs";
import { capitalize, cn } from "@/lib/utils";

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
  inputPlaceholder = 'Try "payment", "booking", "safety"…',
  initialCount = 8,
  searchMode = "hybrid",
  className,
}: {
  category?: string;
  faqs: FaqData[];
  title?: string;
  aboveTitle?: string;
  description?: string;
  inputPlaceholder?: string;
  initialCount?: number;
  searchMode?: "client" | "server" | "hybrid";
  className?: string;
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
    <section className={cn("relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-[#0d1d3a] to-[#0a1628]", className)}>
      <div className="absolute inset-0 bg-mesh opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-500/5 blur-[200px] pointer-events-none" />
      
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              {aboveTitle}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-serif text-glow-white">
            {title}
          </h2>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">{description}</p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="glass-panel rounded-3xl p-6 md:p-8 mb-8 animate-fade-up-delay-1">
            <label className="block text-center text-lg font-medium text-white/80 mb-4">
              {`Search any ${mapCategoryToName[category ?? "general"] || capitalize(category ?? "general")} FAQ`}
            </label>
            
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={inputPlaceholder}
                  className="w-full h-14 rounded-2xl border-white/10 bg-white/5 px-12 text-white text-lg
                    placeholder:text-white/40 focus:border-blue-500/50 focus:ring-blue-500/20
                    transition-all duration-300"
                />
                {query.length > 0 && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X className="h-4 w-4 text-white/60" />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4 text-center text-sm text-white/60">
              {normalizedQuery ? (
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  Showing <span className="font-semibold text-white">{visibleFaqs.length}</span> result{visibleFaqs.length === 1 ? "" : "s"} for &quot;{query.trim()}&quot;
                  {isSearching && <span className="text-blue-400">Searching...</span>}
                  {hasSearchError && <span className="text-red-400">(Search failed)</span>}
                </span>
              ) : (
                <span>
                  Browse <span className="font-semibold text-white">{faqs.length}</span> questions
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4 animate-fade-up-delay-2">
            {visibleFaqs.length > 0 ? (
              <FaqClient
                faqs={visibleFaqs}
                initialCount={effectiveInitialCount}
              />
            ) : (
              <div className="glass-panel rounded-3xl py-16 text-center">
                <HelpCircle className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white">No FAQs found</h3>
                <p className="mt-2 text-white/60">Try a different search or clear your filters.</p>
                <Button
                  variant="link"
                  onClick={() => setQuery("")}
                  className="mt-4 text-blue-400 hover:text-blue-300"
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
