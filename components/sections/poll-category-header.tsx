"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { getCategoryTitle, getCategoryDescription, getRelatedCategories } from "@/lib/data/poll-recommendations";

interface PollCategoryHeaderProps {
  category: string;
  pollCount: number;
}

export function PollCategoryHeader({ category, pollCount }: PollCategoryHeaderProps) {
  const title = getCategoryTitle(category);
  const description = getCategoryDescription(category);
  const relatedCategories = getRelatedCategories(category);
  
  return (
    <div className="mb-8 animate-fade-up">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-purple-500/20 border border-indigo-500/30 p-6 md:p-8">
        <div className="absolute inset-0 bg-mesh opacity-30" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        
        <div className="relative">
          <Link 
            href="/polls"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all polls
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-indigo-300">
              Selected Category
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-white font-serif mb-3">
            {title}
          </h2>
          
          <p className="text-lg text-white/70 mb-4">
            {description}
          </p>
          
          <div className="flex items-center gap-4 text-sm text-white/60">
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">
              {pollCount.toLocaleString()} polls found
            </span>
          </div>
        </div>
      </div>
      
      {relatedCategories.length > 0 && (
        <div className="mt-6">
          <p className="text-sm text-white/50 mb-3">You might also like:</p>
          <div className="flex flex-wrap gap-2">
            {relatedCategories.slice(0, 6).map((relatedCat) => (
              <Link
                key={relatedCat}
                href={`/polls?category=${relatedCat}`}
                className="px-4 py-2 rounded-full text-sm bg-white/5 text-white/70 border border-white/10 hover:bg-indigo-500/20 hover:border-indigo-500/30 hover:text-white transition-all"
              >
                {relatedCat.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
