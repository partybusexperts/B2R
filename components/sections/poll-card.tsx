"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { capitalize, cn } from "@/lib/utils";
import { PollWithOptions } from "@/lib/data/polls";

interface PollCardProps {
  poll: PollWithOptions;
}

export function PollCard({ poll }: PollCardProps) {
  const [hasVoted, setHasVoted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const options = poll.options ?? [];

  const [votes, setVotes] = React.useState<Record<string, number>>(() => {
    return options.reduce<Record<string, number>>((acc, opt) => {
      acc[opt.id] = Number(opt.vote_count ?? 0);
      return acc;
    }, {});
  });

  const categoryLabel = React.useMemo(() => {
    const raw = (poll.category_data?.name ?? "general").trim();
    if (!raw) return "General";

    return raw
      .split("-")
      .filter(Boolean)
      .map((part) => capitalize(part))
      .join(" ");
  }, [poll.category_data?.name]);

  // Calculate total votes for percentages
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const handleVote = async (optionId: string) => {
    if (hasVoted || isSubmitting) return;
    setIsSubmitting(true);

    // 1. Optimistic Update
    setVotes((prev) => ({
      ...prev,
      [optionId]: (prev[optionId] ?? 0) + 1,
    }));
    setHasVoted(true);

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
      className="h-full border-border/60 gap-2 shadow-sm flex flex-col
        bg-card/50"
    >
      <CardHeader className="pb-3">
        <Badge
          variant="outline"
          className="w-fit mb-2 text-xs font-bold text-primary border-primary/20
            bg-primary/5"
        >
          {categoryLabel}
        </Badge>
        <CardTitle className="text-lg leading-tight text-foreground">
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
                      <span className="font-medium text-foreground">
                        {option.label}
                      </span>
                      <span className="text-muted-foreground">{percent}%</span>
                    </div>
                    <Progress value={percent} className="h-2" />
                    <p
                      className="text-xs text-muted-foreground text-right
                        mt-0.5"
                    >
                      {count} votes
                    </p>
                  </div>
                ) : (
                  // VOTING VIEW
                  <Button
                    variant="outline"
                    className={cn(
                      `w-full justify-between h-auto py-3 px-4 rounded-xl
                        font-normal border-border/60 hover:border-primary/50
                        hover:bg-primary/5 hover:text-primary transition-all
                        text-left whitespace-normal`,
                      isSubmitting && "opacity-50 pointer-events-none",
                    )}
                    onClick={() => handleVote(option.id)}
                    disabled={isSubmitting}
                  >
                    <span className="mr-2">{option.label}</span>
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
          <p className="text-xs text-center text-muted-foreground mt-2">
            Click an option to vote and see results
          </p>
        )}
      </CardContent>
    </Card>
  );
}
