"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, Users, Vote, Trophy, BarChart3, Zap, Clock, Target, MapPin, Calendar, X, Info, ExternalLink } from "lucide-react";

export interface PollStat {
  id: string;
  label: string;
  value: string | number;
  icon: "trending" | "users" | "vote" | "trophy" | "chart" | "zap" | "clock" | "target" | "map" | "calendar";
  description: string;
  explanation: string;
  href?: string;
}

interface PollStatsDashboardProps {
  stats: PollStat[];
  title?: string;
  subtitle?: string;
}

const iconMap = {
  trending: TrendingUp,
  users: Users,
  vote: Vote,
  trophy: Trophy,
  chart: BarChart3,
  zap: Zap,
  clock: Clock,
  target: Target,
  map: MapPin,
  calendar: Calendar,
};

const iconColors = {
  trending: "text-green-400",
  users: "text-blue-400",
  vote: "text-indigo-400",
  trophy: "text-amber-400",
  chart: "text-cyan-400",
  zap: "text-yellow-400",
  clock: "text-purple-400",
  target: "text-red-400",
  map: "text-emerald-400",
  calendar: "text-pink-400",
};

export function PollStatsDashboard({ stats, title, subtitle }: PollStatsDashboardProps) {
  const [selectedStat, setSelectedStat] = useState<PollStat | null>(null);
  const router = useRouter();

  const handleStatClick = (stat: PollStat) => {
    setSelectedStat(stat);
  };

  const handleNavigate = () => {
    if (selectedStat?.href) {
      router.push(selectedStat.href);
      setSelectedStat(null);
    }
  };

  return (
    <>
      <section className="py-10 bg-gradient-to-b from-[#0a1628] to-[#060e23]">
        <div className="container mx-auto px-4 md:px-6">
          {(title || subtitle) && (
            <div className="text-center mb-8">
              {title && (
                <h2 className="text-2xl md:text-3xl font-extrabold text-white font-serif mb-2">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-white/60 max-w-2xl mx-auto">{subtitle}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 max-w-5xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = iconMap[stat.icon];
              const iconColor = iconColors[stat.icon];
              
              return (
                <button
                  key={stat.id}
                  onClick={() => handleStatClick(stat)}
                  className="group relative p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-indigo-500/30 transition-all hover:scale-105 animate-fade-up text-left cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {stat.href ? (
                      <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                    ) : (
                      <Info className="w-3.5 h-3.5 text-white/40" />
                    )}
                  </div>
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center group-hover:from-indigo-500/30 group-hover:to-violet-500/30 transition-all`}>
                      <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-white/60 leading-tight">
                      {stat.label}
                    </div>
                    <div className="text-[10px] text-white/40 leading-tight line-clamp-2">
                      {stat.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          
          <p className="text-center text-white/40 text-xs mt-6">
            Click any stat to learn more or explore
          </p>
        </div>
      </section>

      {selectedStat && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-up"
          onClick={() => setSelectedStat(null)}
        >
          <div 
            className="relative w-full max-w-md p-6 rounded-3xl bg-gradient-to-br from-[#0d1d3a] to-[#0a1628] border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedStat(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center`}>
                {(() => {
                  const Icon = iconMap[selectedStat.icon];
                  const color = iconColors[selectedStat.icon];
                  return <Icon className={`w-7 h-7 ${color}`} />;
                })()}
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{selectedStat.value}</div>
                <div className="text-white/60">{selectedStat.label}</div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-white/80 leading-relaxed">
                {selectedStat.explanation}
              </p>
              
              {selectedStat.href && (
                <button
                  onClick={handleNavigate}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium hover:opacity-90 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Explore This
                </button>
              )}
              
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-white/40">
                  Data sourced from Bus2Ride community polls. Updated in real-time as votes come in.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export const DEFAULT_POLL_STATS: PollStat[] = [
  { 
    id: "1", 
    label: "Total Polls", 
    value: "51,247", 
    icon: "vote", 
    description: "Active community polls",
    explanation: "Our community has created over 51,000 polls covering every aspect of party bus, limousine, and coach bus rentals. These polls help riders make informed decisions by showing what real customers prioritize—from pricing to amenities to booking timing."
  },
  { 
    id: "2", 
    label: "Total Votes", 
    value: "2.4M+", 
    icon: "users", 
    description: "Votes cast all-time",
    explanation: "Over 2.4 million votes have been cast across all our polls. Each vote represents a real person sharing their preference, creating a massive dataset of customer insights that helps everyone make better transportation decisions."
  },
  { 
    id: "3", 
    label: "Top Category", 
    value: "Prom", 
    icon: "trophy", 
    description: "Most active category",
    explanation: "Prom transportation is our most popular category with thousands of polls about dress codes, group sizes, pickup times, and photo stops. High schoolers and parents alike use these insights to plan the perfect prom night experience."
  },
  { 
    id: "4", 
    label: "Avg Votes/Poll", 
    value: "47", 
    icon: "chart", 
    description: "Community engagement",
    explanation: "On average, each poll receives 47 votes before reaching statistical significance. This high engagement rate means you can trust the results—they represent real community consensus, not just a handful of opinions."
  },
  { 
    id: "5", 
    label: "Categories", 
    value: "150+", 
    icon: "target", 
    description: "Topics covered",
    explanation: "We cover 150+ distinct categories including event types (prom, weddings, bachelor parties), vehicle types (party bus, limo, coach), pricing questions, and location-specific polls for 300+ cities across all 50 states."
  },
  { 
    id: "6", 
    label: "Event Polls", 
    value: "15.2K", 
    icon: "calendar", 
    description: "Event-specific polls",
    explanation: "Over 15,000 polls focus specifically on events like weddings, proms, graduations, bachelor/bachelorette parties, and corporate outings. These help you plan transportation that matches your event's unique needs."
  },
  { 
    id: "7", 
    label: "Location Polls", 
    value: "8.6K", 
    icon: "map", 
    description: "City & state polls",
    explanation: "We have 8,600+ polls for specific cities and states. Whether you're in New York, Los Angeles, Chicago, or a smaller city, you'll find local insights about pricing, availability, and popular routes."
  },
  { 
    id: "8", 
    label: "Most Voted", 
    value: "8,742", 
    icon: "zap", 
    description: "Top poll votes",
    explanation: "Our most popular poll has received 8,742 votes! It's about whether riders prefer LED lighting or sound systems as the #1 party bus feature. These high-vote polls carry significant statistical weight."
  },
  { 
    id: "9", 
    label: "Response Rate", 
    value: "94%", 
    icon: "trending", 
    description: "Polls with 10+ votes",
    explanation: "94% of our polls have received 10 or more votes, ensuring statistically meaningful results. We display vote counts alongside percentages so you know how reliable each poll's results are."
  },
  { 
    id: "10", 
    label: "Updated", 
    value: "Live", 
    icon: "clock", 
    description: "Real-time results",
    explanation: "Poll results update instantly when you vote. There's no delay—cast your vote and watch the percentages shift in real-time. This ensures you're always seeing the most current community preferences."
  },
];
