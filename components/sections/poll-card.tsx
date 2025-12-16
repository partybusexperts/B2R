"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import type { PollWithOptions } from "@/lib/data/polls";
// import { Badge } from "@/components/ui/badge";
import {
  //  capitalize,
  cn,
} from "@/lib/utils";

interface PollCardProps {
  poll: PollWithOptions;
  onAdvance?: () => void;
  advanceDelayMs?: number;
}

export function PollCard({
  poll,
  onAdvance,
  advanceDelayMs = 5000,
}: PollCardProps) {
  const [hasVoted, setHasVoted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isAdvancing, setIsAdvancing] = React.useState(false);
  const options = poll.options ?? [];

  const advanceTimeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) {
        window.clearTimeout(advanceTimeoutRef.current);
      }
    };
  }, []);

  const [votes, setVotes] = React.useState<Record<string, number>>(() => {
    return options.reduce<Record<string, number>>((acc, opt) => {
      acc[opt.id] = Number(opt.vote_count ?? 0);
      return acc;
    }, {});
  });

  // const categoryLabel = React.useMemo(() => {
  //   const raw = (poll.category_data?.name ?? "general").trim();
  //   if (!raw) return "General";

  //   return raw
  //     .split("-")
  //     .filter(Boolean)
  //     .map((part) => capitalize(part))
  //     .join(" ");
  // }, [poll.category_data?.name]);

  // Calculate total votes for percentages
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const handleVote = async (optionId: string) => {
    if (hasVoted || isSubmitting || isAdvancing) return;
    setIsSubmitting(true);

    // 1. Optimistic Update
    setVotes((prev) => ({
      ...prev,
      [optionId]: (prev[optionId] ?? 0) + 1,
    }));
    setHasVoted(true);

    // Auto-advance after a short delay so users can see results.
    setIsAdvancing(true);
    advanceTimeoutRef.current = window.setTimeout(() => {
      setIsAdvancing(false);
      onAdvance?.();
    }, advanceDelayMs);

    // 2. Submit to Supabase
    const supabase = createClient();
    const { error } = await supabase.rpc("increment_poll_vote1", {
      p_option_id: optionId,
    });

    if (error) {
      console.error("Vote failed:", error);
      // Revert if error (optional, usually overkill for polls)
    }
    setIsSubmitting(false);
  };

  return (
    <Card
      className="h-full rounded-2xl border border-white/10 bg-white/5 gap-2
        shadow-sm flex flex-col bg-[#273659]"
    >
      <CardHeader className="pb-3">
        {/* <Badge
          variant="outline"
          className="w-fit mb-2 text-xs font-bold text-primary border-primary/20
            bg-primary/5"
        >
          {categoryLabel}
        </Badge> */}
        <CardTitle className="text-lg leading-tight text-white">
          {poll.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col gap-3 h-auto">
          {options.map((option) => {
            const count = votes[option.id] ?? Number(option.vote_count ?? 0);
            const percent =
              totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

            return (
              <div key={option.id} className="space-y-1.5 group">
                {hasVoted ? (
                  // RESULT VIEW
                  <div className="animate-in fade-in duration-500">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-white">
                        {option.label}
                      </span>
                      <span className="text-blue-100">{percent}%</span>
                    </div>
                    <Progress value={percent} className="h-2" />
                    <p className="text-xs text-blue-100 text-right mt-0.5">
                      {count} votes
                    </p>
                  </div>
                ) : (
                  // VOTING VIEW
                  <Button
                    variant="outline"
                    className={cn(
                      `w-full justify-between h-auto py-3 px-4 rounded-2xl
                        font-normal transition-all text-left whitespace-normal
                        border border-white/10 bg-white/5 hover:bg-white/10
                        focus:outline-none focus:ring-2 focus:ring-white/30`,
                      isSubmitting && "opacity-50 pointer-events-none",
                    )}
                    onClick={() => handleVote(option.id)}
                    disabled={isSubmitting}
                  >
                    <span className="mr-2 text-white">{option.label}</span>
                    {isSubmitting && (
                      <Loader2 className="h-4 w-4 animate-spin ml-auto" />
                    )}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {!hasVoted && (
          <p className="text-xs text-center text-blue-100 mt-2">
            Click an option to vote and see results
          </p>
        )}

        {hasVoted && isAdvancing && (
          <div className="mt-3 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
