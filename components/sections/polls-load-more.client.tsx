"use client";

import * as React from "react";
import { Loader2, ChevronDown, TrendingUp, Vote, Users, Zap, Lightbulb, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PollCard } from "./poll-card";
import type { PollWithOptions } from "@/lib/data/polls";

interface PollsLoadMoreProps {
  initialPolls: PollWithOptions[];
  category?: string;
  searchQuery?: string;
  totalCount?: number;
  showSidebar?: boolean;
}

const FUN_FACTS = [
  { icon: PartyPopper, text: "Most popular party bus feature? LED lighting wins with 42% of votes!", color: "text-pink-400" },
  { icon: TrendingUp, text: "Weekend rentals cost 30% more than weekday bookings on average.", color: "text-green-400" },
  { icon: Users, text: "The sweet spot for group size is 15-20 passengers for the best energy.", color: "text-blue-400" },
  { icon: Lightbulb, text: "Booking 6 weeks ahead gives you the best price and availability combo.", color: "text-amber-400" },
  { icon: Vote, text: "89% of riders say they'd pay extra for a newer vehicle.", color: "text-indigo-400" },
  { icon: Zap, text: "Saturday 7PM is the most popular departure time for events.", color: "text-purple-400" },
];

const QUICK_TIPS = [
  "Always ask about gratuity policies upfront",
  "Request photos of the actual vehicle you'll get",
  "Check if overtime fees are per 15min or 30min",
  "Ask about ice, cups, and cooler policies",
  "Confirm the address and any parking restrictions",
  "Get the driver's contact info before the event",
];

export function PollsLoadMore({ 
  initialPolls, 
  category, 
  searchQuery,
  totalCount,
  showSidebar = false
}: PollsLoadMoreProps) {
  const [polls, setPolls] = React.useState<PollWithOptions[]>(initialPolls);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(initialPolls.length >= 9);
  const [offset, setOffset] = React.useState(initialPolls.length);

  const loadMore = async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      const batchSize = showSidebar ? 9 : 24;
      const params = new URLSearchParams({
        offset: offset.toString(),
        limit: batchSize.toString(),
      });
      if (category) params.set("category", category);
      if (searchQuery) params.set("q", searchQuery);

      const res = await fetch(`/api/polls?${params}`);
      if (!res.ok) throw new Error("Failed to load more polls");
      
      const data = await res.json();
      const newPolls = data.polls || [];
      
      setPolls(prev => [...prev, ...newPolls]);
      setOffset(prev => prev + newPolls.length);
      setHasMore(newPolls.length >= batchSize);
    } catch (error) {
      console.error("Error loading more polls:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const displayedPolls = showSidebar ? polls.slice(0, 9) : polls;
  const remainingPolls = showSidebar ? polls.slice(9) : [];

  if (showSidebar && category) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="max-h-[800px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-500/30 scrollbar-track-white/5 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {displayedPolls.map((poll) => (
                  <PollCard
                    key={poll.id}
                    poll={poll}
                    backgroundClassName="shadow-[0_35px_120px_rgba(5,10,35,0.65)] border border-white/10 bg-gradient-to-r from-slate-900/80 to-slate-950/90"
                    noLoadSpinner
                  />
                ))}
              </div>
            </div>
            
            {displayedPolls.length > 0 && (
              <p className="text-center text-white/40 text-sm mt-4">
                {displayedPolls.length} polls shown {totalCount ? `of ${totalCount.toLocaleString()}` : ""}
              </p>
            )}
          </div>

          <div className="lg:col-span-1 space-y-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Fun Facts
              </h3>
              <div className="space-y-3">
                {FUN_FACTS.slice(0, 3).map((fact, i) => {
                  const Icon = fact.icon;
                  return (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${fact.color}`} />
                      <p className="text-sm text-white/70 leading-relaxed">{fact.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-emerald-400" />
                Quick Tips
              </h3>
              <ul className="space-y-2">
                {QUICK_TIPS.slice(0, 4).map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                    <span className="text-emerald-400 mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Vote className="w-5 h-5 text-violet-400" />
                Your Voice Matters
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Every vote helps future riders make better decisions. Share your experience!
              </p>
            </div>
          </div>
        </div>

        {remainingPolls.length > 0 && (
          <div className="pt-4 border-t border-white/10">
            <h3 className="text-xl font-bold text-white mb-6">More {category.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")} Polls</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {remainingPolls.map((poll) => (
                <PollCard
                  key={poll.id}
                  poll={poll}
                  backgroundClassName="shadow-[0_35px_120px_rgba(5,10,35,0.65)] border border-white/10 bg-gradient-to-r from-slate-900/80 to-slate-950/90"
                  noLoadSpinner
                />
              ))}
            </div>
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center">
            <Button
              onClick={loadMore}
              disabled={isLoading}
              variant="outline"
              size="lg"
              className="rounded-full px-8 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 hover:border-indigo-500/50 gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Load More Polls
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {polls.map((poll) => (
          <PollCard
            key={poll.id}
            poll={poll}
            backgroundClassName="shadow-[0_35px_120px_rgba(5,10,35,0.65)] border border-white/10 bg-gradient-to-r from-slate-900/80 to-slate-950/90"
            noLoadSpinner
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={loadMore}
            disabled={isLoading}
            variant="outline"
            size="lg"
            className="rounded-full px-8 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 hover:border-indigo-500/50 gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Load More Polls
              </>
            )}
          </Button>
        </div>
      )}

      <div className="mt-4 text-center text-sm text-white/40">
        Showing {polls.length.toLocaleString()} of {totalCount?.toLocaleString() || "51,000+"} polls
      </div>
    </div>
  );
}
