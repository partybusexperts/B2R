import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PollCard } from "./poll-card";
import type { PollWithOptions } from "@/lib/data/polls";

interface RelatedPollsSectionProps {
  title: string;
  category: string;
  polls: PollWithOptions[];
  viewAllHref?: string;
}

export function RelatedPollsSection({ title, category, polls, viewAllHref }: RelatedPollsSectionProps) {
  if (polls.length === 0) return null;

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-white font-serif">
            {title}
          </h3>
          <p className="text-sm text-white/50 mt-1">
            {polls.length} polls in this category
          </p>
        </div>
        {viewAllHref && (
          <Link 
            href={viewAllHref}
            className="inline-flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View all
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {polls.slice(0, 6).map((poll) => (
          <PollCard
            key={poll.id}
            poll={poll}
            backgroundClassName="shadow-lg border border-white/10 bg-gradient-to-r from-slate-900/80 to-slate-950/90"
            noLoadSpinner
          />
        ))}
      </div>
    </section>
  );
}
