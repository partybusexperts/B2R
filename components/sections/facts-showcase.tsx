"use client";

import { useState } from "react";
import { 
  TrendingUp, 
  Clock, 
  Users, 
  MapPin, 
  Star, 
  Zap,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type FactItem = {
  id: string;
  stat: string;
  label: string;
  description?: string;
  icon?: string;
  category?: "stat" | "insight" | "tip";
};

interface FactsShowcaseProps {
  facts: FactItem[];
  title?: string;
  subtitle?: string;
  variant?: "grid" | "marquee" | "stacked";
  className?: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  trending: TrendingUp,
  clock: Clock,
  users: Users,
  location: MapPin,
  star: Star,
  zap: Zap,
};

function FactCard({ 
  fact, 
  index,
  onOpenModal 
}: { 
  fact: FactItem; 
  index: number;
  onOpenModal: () => void;
}) {
  const Icon = fact.icon ? ICON_MAP[fact.icon] || Zap : Zap;

  const categoryColors = {
    stat: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    insight: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
    tip: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
  };

  const category = fact.category || "stat";

  return (
    <button
      onClick={onOpenModal}
      className={cn(
        "group relative rounded-2xl p-6 border transition-all duration-300 text-left w-full",
        "bg-gradient-to-br backdrop-blur-sm cursor-pointer",
        categoryColors[category],
        "hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]",
        "animate-fade-up"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              category === "stat" && "bg-blue-500/20 text-blue-400",
              category === "insight" && "bg-purple-500/20 text-purple-400",
              category === "tip" && "bg-amber-500/20 text-amber-400"
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">
              {category}
            </span>
          </div>

          <div className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
            {fact.stat}
          </div>
          <div className="text-sm text-white/70 font-medium">
            {fact.label}
          </div>

          <div className="mt-3 text-xs text-white/50 group-hover:text-white/80 transition flex items-center gap-1">
            Tap to learn more
            <span className="text-blue-400">→</span>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
        <Icon className="w-full h-full" />
      </div>
    </button>
  );
}

function FactModal({ 
  fact, 
  isOpen, 
  onClose 
}: { 
  fact: FactItem | null; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  if (!fact) return null;
  
  const Icon = fact.icon ? ICON_MAP[fact.icon] || Zap : Zap;
  const category = fact.category || "stat";
  
  const categoryBgColors = {
    stat: "from-blue-600 to-cyan-600",
    insight: "from-purple-600 to-pink-600",
    tip: "from-amber-600 to-orange-600",
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-white/10 text-white">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
              categoryBgColors[category]
            )}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 block mb-1">
                {category}
              </span>
              <DialogTitle className="text-3xl font-extrabold text-white">
                {fact.stat}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-white mb-3">{fact.label}</h3>
          
          {fact.description && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white/80 leading-relaxed">{fact.description}</p>
            </div>
          )}
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function FactsShowcase({
  facts,
  title = "By The Numbers",
  subtitle = "Fascinating statistics about group transportation",
  variant = "grid",
  className,
}: FactsShowcaseProps) {
  const [selectedFact, setSelectedFact] = useState<FactItem | null>(null);
  
  if (!facts.length) return null;

  return (
    <section
      className={cn(
        "relative py-20 overflow-hidden",
        "bg-gradient-to-b from-[#060e23] via-[#0a1628] to-[#060e23]",
        className
      )}
    >
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-6">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-blue-300">
              Industry Insights
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white font-serif mb-3">
            {title}
          </h2>
          <p className="text-blue-200/70 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {variant === "grid" && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {facts.map((fact, idx) => (
              <FactCard 
                key={fact.id} 
                fact={fact} 
                index={idx} 
                onOpenModal={() => setSelectedFact(fact)}
              />
            ))}
          </div>
        )}

        {variant === "marquee" && (
          <div className="relative overflow-hidden">
            <div className="flex gap-6 animate-marquee">
              {[...facts, ...facts].map((fact, idx) => (
                <div key={`${fact.id}-${idx}`} className="flex-shrink-0 w-72">
                  <FactCard 
                    fact={fact} 
                    index={0} 
                    onOpenModal={() => setSelectedFact(fact)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {variant === "stacked" && (
          <div className="space-y-4 max-w-2xl mx-auto">
            {facts.map((fact, idx) => (
              <FactCard 
                key={fact.id} 
                fact={fact} 
                index={idx} 
                onOpenModal={() => setSelectedFact(fact)}
              />
            ))}
          </div>
        )}
      </div>
      
      <FactModal 
        fact={selectedFact} 
        isOpen={!!selectedFact} 
        onClose={() => setSelectedFact(null)} 
      />
    </section>
  );
}
