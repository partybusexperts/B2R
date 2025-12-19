"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PollCard } from "@/components/sections/poll-card";
import type { PollWithOptions } from "@/lib/data/polls";

export function PollsSearchClient({ polls }: { polls: PollWithOptions[] }) {
  const [query, setQuery] = React.useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredPolls = React.useMemo(() => {
    if (!normalizedQuery) return polls;

    return polls.filter((poll) => {
      const category = (poll.category_data?.name ?? "").toLowerCase();
      const options = (poll.options ?? [])
        .map((o) => (o.label ?? "").toLowerCase())
        .join(" ");

      const haystack = `${poll.question ?? ""} ${category} ${options}`
        .replace(/\s+/g, " ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [polls, normalizedQuery]);

  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
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
                className="pl-9 bg-background/50 border-border/60"
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
                <span className="font-semibold">{filteredPolls.length}</span>{" "}
                result
                {filteredPolls.length === 1 ? "" : "s"} for “{query.trim()}”.
              </span>
            ) : (
              <span>
                Showing <span className="font-semibold">{polls.length}</span>{" "}
                polls.
              </span>
            )}
          </div>
        </div>
      </div>

      {filteredPolls.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPolls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      ) : (
        <div
          className="rounded-3xl border border-dashed border-border bg-muted/20
            py-16 text-center"
        >
          <h3 className="text-lg font-semibold">No polls found</h3>
          <p className="text-muted-foreground">Try a different search.</p>
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
  );
}
