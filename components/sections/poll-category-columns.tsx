"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Music, GraduationCap, TrendingUp, ArrowRight, Heart, Sparkles, Car } from "lucide-react";
import { PollCard } from "./poll-card";
import type { PollWithOptions } from "@/lib/data/polls";

interface CategoryColumn {
  title: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  polls: PollWithOptions[];
}

interface PollCategoryColumnsProps {
  partyBusPolls: PollWithOptions[];
  promPolls: PollWithOptions[];
  pricingPolls: PollWithOptions[];
  weddingPolls: PollWithOptions[];
  limousinePolls: PollWithOptions[];
  bachelorettePolls: PollWithOptions[];
  bachelorPolls?: PollWithOptions[];
  corporatePolls?: PollWithOptions[];
  coachBusPolls?: PollWithOptions[];
}

export function PollCategoryColumns({
  partyBusPolls,
  promPolls,
  pricingPolls,
  weddingPolls,
  limousinePolls,
  bachelorettePolls,
}: PollCategoryColumnsProps) {
  const columns: CategoryColumn[] = [
    {
      title: "Party Bus Polls",
      category: "party-bus",
      icon: <Music className="w-5 h-5" />,
      color: "from-indigo-500 to-purple-500",
      polls: partyBusPolls,
    },
    {
      title: "Prom Polls",
      category: "prom",
      icon: <GraduationCap className="w-5 h-5" />,
      color: "from-pink-500 to-rose-500",
      polls: promPolls,
    },
    {
      title: "Pricing Polls",
      category: "pricing",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "from-green-500 to-emerald-500",
      polls: pricingPolls,
    },
    {
      title: "Wedding Polls",
      category: "weddings",
      icon: <Heart className="w-5 h-5" />,
      color: "from-rose-400 to-pink-500",
      polls: weddingPolls,
    },
    {
      title: "Limousine Polls",
      category: "limousines",
      icon: <Car className="w-5 h-5" />,
      color: "from-amber-400 to-yellow-500",
      polls: limousinePolls,
    },
    {
      title: "Bachelorette Polls",
      category: "bachelorette-parties",
      icon: <Sparkles className="w-5 h-5" />,
      color: "from-fuchsia-500 to-purple-500",
      polls: bachelorettePolls,
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-[#0a1628] to-[#060e23]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-serif mb-2">
            Explore Popular Poll Categories
          </h2>
          <p className="text-white/60">
            See what riders are voting on across different topics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <CategoryColumnCard key={column.category} column={column} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryColumnCard({ column }: { column: CategoryColumn }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setCanScrollUp(scrollTop > 10);
      setCanScrollDown(scrollTop < scrollHeight - clientHeight - 10);
    }
  };

  const scrollTo = (direction: "up" | "down") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        top: direction === "down" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent overflow-hidden">
      <div className={`p-4 bg-gradient-to-r ${column.color} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
            {column.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{column.title}</h3>
            <p className="text-xs text-white/80">{column.polls.length} polls</p>
          </div>
        </div>
        <Link
          href={`/polls?category=${column.category}`}
          className="text-white/90 hover:text-white text-sm flex items-center gap-1 transition-colors"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="relative">
        {canScrollUp && (
          <button
            onClick={() => scrollTo("up")}
            className="absolute top-0 left-0 right-0 z-10 h-8 bg-gradient-to-b from-[#0a1628] to-transparent flex items-center justify-center"
          >
            <ChevronUp className="w-5 h-5 text-white/60" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-[400px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
          style={{ scrollbarWidth: "thin" }}
        >
          {column.polls.length > 0 ? (
            column.polls.map((poll) => (
              <div key={poll.id} className="transform scale-[0.95] origin-top">
                <PollCard poll={poll} compact />
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-white/40">
              <p>No polls available</p>
            </div>
          )}
        </div>

        {canScrollDown && column.polls.length > 2 && (
          <button
            onClick={() => scrollTo("down")}
            className="absolute bottom-0 left-0 right-0 z-10 h-8 bg-gradient-to-t from-[#0a1628] to-transparent flex items-center justify-center"
          >
            <ChevronDown className="w-5 h-5 text-white/60" />
          </button>
        )}
      </div>
    </div>
  );
}
