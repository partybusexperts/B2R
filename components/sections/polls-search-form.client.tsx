"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function PollsSearchForm({
  defaultQuery,
  defaultCategory,
  resultsCount,
  children,
}: {
  defaultQuery: string;
  defaultCategory?: string;
  resultsCount: number;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState(defaultQuery);
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    setQuery(defaultQuery);
  }, [defaultQuery]);

  const submit = (nextQuery: string) => {
    const q = nextQuery.trim();
    const category = (defaultCategory ?? "").trim();

    startTransition(() => {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (q) params.set("q", q);

      const queryString = params.toString();
      router.push(queryString ? `/polls?${queryString}` : "/polls");
    });
  };

  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl p-4 shadow-[0_35px_120px_rgba(5,10,35,0.65)]
          border border-white/10 bg-gradient-to-r from-slate-900/80
          to-slate-950/90"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(query);
          }}
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
                placeholder="Search polls (e.g. party bus, pricing, drivers)…"
                className="pl-9 rounded-2xl border border-white/10
                  bg-slate-900/70 text-white placeholder:text-white/50
                  focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>

            <Button
              type="submit"
              className="shrink-0 rounded-xl"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Searching
                </>
              ) : (
                "Search"
              )}
            </Button>

            {defaultQuery.trim().length > 0 && (
              <Button
                type="button"
                variant="outline"
                className="shrink-0 rounded-xl"
                onClick={() => {
                  setQuery("");
                  submit("");
                }}
                disabled={isPending}
              >
                <X className="h-4 w-4 mr-2" /> Clear
              </Button>
            )}
          </div>
        </form>

        <div className="mt-3 text-sm text-muted-foreground">
          {isPending ? (
            <span>Loading results…</span>
          ) : defaultQuery.trim().length > 0 ? (
            <span>
              Showing <span className="font-semibold">{resultsCount}</span>{" "}
              result
              {resultsCount === 1 ? "" : "s"} for “{defaultQuery.trim()}”.
            </span>
          ) : (
            <span>
              Showing <span className="font-semibold">{resultsCount}</span>{" "}
              polls.
            </span>
          )}
        </div>
      </div>

      {isPending ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 9 }).map((_, idx) => (
            <Skeleton
              key={idx}
              className="h-[340px] w-full rounded-xl bg-slate-800/70"
            />
          ))}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
