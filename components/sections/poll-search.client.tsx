"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, Loader2, X } from "lucide-react";

type PollWithOptions = {
  id: string;
  question: string;
  category_slug: string | null;
  options: { id: string; label: string; vote_count: number }[];
};

export function PollSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PollWithOptions[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchPolls = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    
    const supabase = createClient();
    const escaped = query.trim().replace(/%/g, "\\%").replace(/_/g, "\\_");
    
    const { data, error } = await supabase
      .from("polls1")
      .select(`
        id,
        question,
        category_slug,
        options:poll_options1 (
          id,
          label,
          vote_count
        )
      `)
      .or(`question.ilike.%${escaped}%,category_slug.ilike.%${escaped}%`)
      .limit(20);
    
    if (data && !error) {
      setResults(data as PollWithOptions[]);
    }
    setLoading(false);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
  };

  return (
    <section className="py-12 bg-gradient-to-b from-[#060e23] to-[#0a1628]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-serif mb-3">
            Search All Polls
          </h2>
          <p className="text-white/60">Find specific polls by keyword</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchPolls()}
                placeholder="Search by keyword, category, or event..."
                className="w-full pl-12 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-indigo-500/50"
              />
              {query && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={searchPolls}
              disabled={loading || !query.trim()}
              className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Search
            </button>
          </div>

          {hasSearched && (
            <div className="mt-8">
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mx-auto" />
                  <p className="text-white/60 mt-2">Searching...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-white/60 text-sm">{results.length} polls found</p>
                  {results.map((poll) => (
                    <div key={poll.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h3 className="text-white font-medium mb-2">{poll.question}</h3>
                      <div className="flex flex-wrap gap-2">
                        {poll.options.map((opt) => {
                          const total = poll.options.reduce((sum, o) => sum + (o.vote_count || 0), 0);
                          const pct = total > 0 ? Math.round((opt.vote_count / total) * 100) : 0;
                          return (
                            <span key={opt.id} className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm">
                              {opt.label} ({pct}%)
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-white/60">No polls found for "{query}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
