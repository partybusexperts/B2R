"use client";

import * as React from "react";
import { Search, DollarSign, Car, Bus, Crown, Calendar, Percent, Clock, X, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const PRICING_CATEGORIES = [
  { id: "all", label: "All Questions", icon: DollarSign, color: "from-green-500 to-emerald-500" },
  { id: "party-bus", label: "Party Bus", icon: Bus, color: "from-pink-500 to-purple-500" },
  { id: "limo", label: "Limousines", icon: Crown, color: "from-amber-500 to-yellow-500" },
  { id: "coach", label: "Coach Bus", icon: Car, color: "from-emerald-500 to-teal-500" },
  { id: "timing", label: "Timing & Booking", icon: Calendar, color: "from-blue-500 to-indigo-500" },
  { id: "discounts", label: "Discounts & Deals", icon: Percent, color: "from-orange-500 to-red-500" },
  { id: "fees", label: "Fees & Extras", icon: Clock, color: "from-slate-500 to-gray-500" },
];

const PRICING_QUESTIONS = [
  { id: "1", question: "How much does a party bus cost per hour?", answer: "Party buses range from $150-$400 per hour depending on size and amenities. Smaller 15-passenger buses start around $150/hr, while 50-passenger mega buses can reach $400+/hr.", categories: ["party-bus"] },
  { id: "2", question: "What's the minimum rental time for a party bus?", answer: "Most companies require a 4-5 hour minimum on weekends, with 2-3 hour minimums available on weekdays.", categories: ["party-bus", "timing"] },
  { id: "3", question: "How much do limousines cost?", answer: "Limousine rates range from $100-$300 per hour. Sedan limos start at $100/hr, stretch limos average $150-200/hr, and specialty vehicles like Hummer limos reach $250-300/hr.", categories: ["limo"] },
  { id: "4", question: "Are weekday rentals cheaper?", answer: "Yes! Weekday rentals typically cost 15-30% less than weekend rates. Daytime hours (10am-4pm) offer additional savings of 20-30%.", categories: ["discounts", "timing"] },
  { id: "5", question: "Is gratuity included in the price?", answer: "Gratuity is usually NOT included. Industry standard is 15-20% of the total rental cost. Always ask if gratuity is included in your quote.", categories: ["fees"] },
  { id: "6", question: "How much is a deposit?", answer: "Most companies require a 25-50% deposit to secure your booking, with the balance due before or on the day of service.", categories: ["timing"] },
  { id: "7", question: "What are the hidden costs I should know about?", answer: "Common additional costs include: gratuity (15-20%), fuel surcharges, overtime charges (1.5x rate), cleaning fees for excessive mess, tolls, parking, and airport pickup fees ($20-75).", categories: ["fees"] },
  { id: "8", question: "How much does a coach bus cost?", answer: "Coach buses range from $125-$350 per hour. Mini coaches (25-35 passengers) start at $125/hr, while executive coaches with premium amenities can reach $300+/hr.", categories: ["coach"] },
  { id: "9", question: "When is the best time to book for savings?", answer: "Book 4-6 weeks ahead for best rates. Off-peak times (weekdays, daytime, non-peak seasons) offer 15-30% savings. Avoid prom season (April-June) and wedding season (May-October) for lower prices.", categories: ["timing", "discounts"] },
  { id: "10", question: "Do prices go up during prom season?", answer: "Yes, prom season (late April to early June) can see rates 30-50% higher than normal due to extreme demand. Booking 6-8 weeks early often locks in pre-season rates.", categories: ["timing"] },
  { id: "11", question: "How can I get the best price?", answer: "Book early (4-6 weeks ahead), choose off-peak times, right-size your vehicle, compare multiple quotes, ask about packages, and negotiate for large bookings or repeat business.", categories: ["discounts"] },
  { id: "12", question: "What's the cost per person for a party bus?", answer: "Despite higher total costs, party buses often provide the best per-person value. A $300/hour bus for 30 guests over 5 hours costs only $50 per person for the entire experience.", categories: ["party-bus"] },
  { id: "13", question: "Are there daily rates for coach buses?", answer: "Yes! For extended use, many companies offer daily rates ($1,200-$2,500) that provide better value than hourly billing. Multi-day tours receive additional discounts.", categories: ["coach", "discounts"] },
  { id: "14", question: "What are overtime charges?", answer: "Exceeding your contracted time typically incurs overtime at 1.5x the hourly rate. Build buffer time into your reservation to avoid surprises.", categories: ["fees"] },
  { id: "15", question: "Is there a cancellation fee?", answer: "Cancellation policies vary by company. Most allow free cancellation 2-4 weeks before the event. Closer cancellations may forfeit the deposit or incur a percentage of the total.", categories: ["fees", "timing"] },
];

export function PricingFaqClient() {
  const [query, setQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");

  const filteredQuestions = React.useMemo(() => {
    let filtered = PRICING_QUESTIONS;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter((q) => q.categories.includes(selectedCategory));
    }
    
    if (query.trim()) {
      const normalized = query.trim().toLowerCase();
      filtered = filtered.filter((q) => 
        q.question.toLowerCase().includes(normalized) ||
        q.answer.toLowerCase().includes(normalized)
      );
    }
    
    return filtered;
  }, [query, selectedCategory]);

  const questionsByCategory = React.useMemo(() => {
    const grouped: Record<string, typeof PRICING_QUESTIONS> = {};
    
    PRICING_QUESTIONS.forEach((q) => {
      q.categories.forEach((cat) => {
        if (!grouped[cat]) grouped[cat] = [];
        if (!grouped[cat].find(item => item.id === q.id)) {
          grouped[cat].push(q);
        }
      });
    });
    
    return grouped;
  }, []);

  return (
    <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#101f42] via-[#0a1733] to-[#050c1f] px-6 py-10 shadow-[0_35px_70px_rgba(4,10,26,0.65)] md:px-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 mb-4">
          <Sparkles className="w-4 h-4 text-green-400" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-green-300">
            Pricing FAQ
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
          Search Every Cost Question
        </h2>
        <p className="text-blue-200/60 max-w-xl mx-auto text-sm">
          Get instant answers to your most common pricing questions
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-300/50" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pricing questions..."
            className="h-14 w-full rounded-full bg-[#0f1f46] text-blue-50 text-lg border-2 border-green-500/30 pl-14 pr-14 placeholder:text-blue-300/40 focus:border-green-400/60 focus:ring-green-400/20"
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

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {PRICING_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          const count = cat.id === "all" ? PRICING_QUESTIONS.length : (questionsByCategory[cat.id]?.length || 0);
          
          if (cat.id !== "all" && count < 2) return null;
          
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                isActive
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                  : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="w-3 h-3" />
              <span>{cat.label}</span>
              <span className={cn(
                "px-1.5 py-0.5 rounded-full text-[10px]",
                isActive ? "bg-white/20" : "bg-white/10"
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q) => (
            <details key={q.id} className="group rounded-xl border border-white/10 bg-white/5 overflow-hidden">
              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors">
                <span className="font-medium text-white text-sm pr-4">{q.question}</span>
                <span className="text-white/50 group-open:rotate-180 transition-transform">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="px-4 pb-4 text-sm text-white/70 border-t border-white/10 pt-3">
                {q.answer}
              </div>
            </details>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-white/50">No questions found matching your search</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery("");
                setSelectedCategory("all");
              }}
              className="mt-3 rounded-full border-white/20 text-white hover:bg-white/10"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {(query || selectedCategory !== "all") && filteredQuestions.length > 0 && (
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("");
              setSelectedCategory("all");
            }}
            className="text-blue-300 hover:text-white text-xs"
          >
            Clear filters ({filteredQuestions.length} of {PRICING_QUESTIONS.length} shown)
          </Button>
        </div>
      )}
    </div>
  );
}
