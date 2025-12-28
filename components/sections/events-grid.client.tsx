"use client";

import * as React from "react";
import { Search, PartyPopper, Heart, Users, Briefcase, GraduationCap, Cake, Wine, Music, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EventData } from "@/lib/data/events";
import { EventCard } from "./events-card";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const EVENT_CATEGORIES = [
  { id: "all", label: "Browse All", icon: PartyPopper, color: "from-purple-500 to-pink-500" },
  { id: "celebrations", label: "Celebrations", icon: Heart, color: "from-pink-500 to-rose-500", keywords: ["wedding", "anniversary", "engagement", "bridal"] },
  { id: "parties", label: "Parties", icon: Wine, color: "from-pink-500 to-purple-500", keywords: ["bachelor", "bachelorette", "birthday", "sweet 16", "party"] },
  { id: "school", label: "School Events", icon: GraduationCap, color: "from-indigo-500 to-purple-500", keywords: ["prom", "homecoming", "graduation", "school"] },
  { id: "nightlife", label: "Nightlife", icon: Music, color: "from-violet-500 to-indigo-500", keywords: ["night out", "bar", "club", "concert", "casino"] },
  { id: "corporate", label: "Corporate", icon: Briefcase, color: "from-slate-500 to-gray-500", keywords: ["corporate", "business", "conference", "meeting", "retreat"] },
  { id: "sports", label: "Sports & Games", icon: Users, color: "from-emerald-500 to-teal-500", keywords: ["game", "sport", "tailgate", "stadium", "match"] },
];

function categorizeEvent(event: EventData): string[] {
  const title = (event.title ?? "").toLowerCase();
  const slug = (event.slug ?? "").toLowerCase();
  const description = (event.description ?? "").toLowerCase();
  const searchText = `${title} ${slug} ${description}`;
  const categories: string[] = [];
  
  EVENT_CATEGORIES.forEach((cat) => {
    if (cat.id === "all") return;
    const keywords = (cat as { keywords?: string[] }).keywords || [];
    if (keywords.some((kw) => searchText.includes(kw))) {
      categories.push(cat.id);
    }
  });
  
  return categories;
}

export function EventsGridClient({ events }: { events: EventData[] }) {
  const [query, setQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const filteredEvents = React.useMemo(() => {
    let filtered = events;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter((event) => {
        const eventCategories = categorizeEvent(event);
        return eventCategories.includes(selectedCategory);
      });
    }
    
    if (query.trim()) {
      const normalized = query.trim().toLowerCase();
      filtered = filtered.filter((event) => {
        const title = (event.title ?? "").toString().toLowerCase();
        const description = (event.description ?? "").toString().toLowerCase();
        return title.includes(normalized) || description.includes(normalized);
      });
    }
    
    return filtered;
  }, [events, query, selectedCategory]);

  const eventsByCategory = React.useMemo(() => {
    const grouped: Record<string, EventData[]> = {};
    
    events.forEach((event) => {
      const categories = categorizeEvent(event);
      categories.forEach((cat) => {
        if (!grouped[cat]) grouped[cat] = [];
        if (!grouped[cat].find(e => e.id === event.id)) {
          grouped[cat].push(event);
        }
      });
    });
    
    return grouped;
  }, [events]);

  return (
    <div className="relative">
      <div className="sticky top-0 z-20 bg-gradient-to-b from-[#0a1628] via-[#0a1628] to-transparent pb-8 pt-4">
        <div className="max-w-4xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-300/50" />
            <Input
              ref={searchInputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events by name or keyword..."
              className="h-14 w-full rounded-full bg-[#122a56] text-blue-50 text-lg border-2 border-blue-500/30 pl-14 pr-14 placeholder:text-blue-300/40 focus:border-blue-400/60 focus:ring-blue-400/20"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-blue-300/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {EVENT_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            const count = cat.id === "all" ? events.length : (eventsByCategory[cat.id]?.length || 0);
            
            if (cat.id !== "all" && count < 2) return null;
            
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                  isActive
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                    : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
                <span className={cn(
                  "ml-1 px-1.5 py-0.5 rounded-full text-xs",
                  isActive ? "bg-white/20" : "bg-white/10"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedCategory === "all" && !query ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-blue-200/70">
              Showing all {events.length} event guides
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-blue-200/70">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} found
              {selectedCategory !== "all" && ` in ${EVENT_CATEGORIES.find(c => c.id === selectedCategory)?.label}`}
              {query && ` matching "${query}"`}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery("");
                setSelectedCategory("all");
              }}
              className="text-blue-300 hover:text-white"
            >
              Clear filters
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/50 text-lg">No events found matching your criteria</p>
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-4 rounded-full border-white/20 text-white hover:bg-white/10"
              >
                Browse all events
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
