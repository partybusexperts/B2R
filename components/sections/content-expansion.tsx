"use client";

import { useState } from "react";
import { ChevronDown, BookOpen, Clock, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export type ContentBlock = {
  id: string;
  title: string;
  content: string;
  icon?: React.ReactNode;
};

interface ContentExpansionProps {
  blocks: ContentBlock[];
  title?: string;
  subtitle?: string;
  readTime?: string;
  wordCount?: number;
  className?: string;
}

export function ContentExpansion({
  blocks,
  title = "Everything You Need to Know",
  subtitle,
  readTime,
  wordCount,
  className,
}: ContentExpansionProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const toggleBlock = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setShowAll(true);
    setExpandedIds(new Set(blocks.map((b) => b.id)));
  };

  const collapseAll = () => {
    setShowAll(false);
    setExpandedIds(new Set());
  };

  if (!blocks.length) return null;

  return (
    <section
      className={cn(
        "relative py-20 overflow-hidden",
        "bg-gradient-to-b from-[#060e23] to-[#0a1628]",
        className
      )}
    >
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-6">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-blue-300">
              Complete Guide
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white font-serif mb-3">
            {title}
          </h2>

          {subtitle && (
            <p className="text-blue-200/70 max-w-2xl mx-auto mb-6">
              {subtitle}
            </p>
          )}

          <div className="flex items-center justify-center gap-6 text-sm text-white/50">
            {readTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readTime} read</span>
              </div>
            )}
            {wordCount && (
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{wordCount.toLocaleString()} words</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={expandAll}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition",
              showAll
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
            )}
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition",
              !showAll && expandedIds.size === 0
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
            )}
          >
            Collapse All
          </button>
        </div>

        <div className="space-y-4">
          {blocks.map((block, idx) => {
            const isExpanded = expandedIds.has(block.id);

            return (
              <div
                key={block.id}
                className={cn(
                  "rounded-2xl border transition-all duration-300",
                  isExpanded
                    ? "bg-gradient-to-br from-[#0f1f45] to-[#0a152d] border-blue-500/30"
                    : "bg-white/5 border-white/10 hover:border-white/20"
                )}
              >
                <button
                  onClick={() => toggleBlock(block.id)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                        isExpanded
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-white/10 text-white/60"
                      )}
                    >
                      {idx + 1}
                    </div>
                    <h3
                      className={cn(
                        "text-lg font-semibold transition",
                        isExpanded ? "text-white" : "text-white/80"
                      )}
                    >
                      {block.title}
                    </h3>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-white/50 transition-transform duration-300",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>

                {isExpanded && (
                  <div className="px-5 pb-6 animate-fade-up">
                    <div className="pl-12">
                      <div
                        className="prose prose-invert prose-sm max-w-none
                          prose-headings:text-white prose-headings:font-semibold
                          prose-p:text-white/70 prose-p:leading-relaxed
                          prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                          prose-strong:text-white prose-strong:font-semibold
                          prose-ul:text-white/70 prose-ol:text-white/70
                          prose-li:marker:text-blue-500"
                        dangerouslySetInnerHTML={{ __html: block.content }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
