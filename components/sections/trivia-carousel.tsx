"use client";

import { useState, useEffect } from "react";
import { Sparkles, ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export type TriviaItem = {
  id: string;
  question: string;
  answer: string;
  category?: string;
  source?: string;
};

interface TriviaCarouselProps {
  items: TriviaItem[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function TriviaCarousel({
  items,
  title = "Fun Facts & Trivia",
  subtitle = "Discover surprising things about party transportation",
  className,
}: TriviaCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setIsFlipped(false);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % items.length);
      }, 300);
    }, 8000);
    return () => clearInterval(timer);
  }, [autoPlay, items.length]);

  const goTo = (index: number) => {
    setAutoPlay(false);
    setIsFlipped(false);
    setTimeout(() => setActiveIndex(index), 150);
  };

  const prev = () => goTo((activeIndex - 1 + items.length) % items.length);
  const next = () => goTo((activeIndex + 1) % items.length);

  if (!items.length) return null;

  const current = items[activeIndex];

  return (
    <section
      className={cn(
        "relative py-20 overflow-hidden",
        "bg-gradient-to-br from-[#0a1628] via-[#0d1d3a] to-[#0a1628]",
        className
      )}
    >
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-float" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-purple-300">
              Did You Know?
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white font-serif mb-3">
            {title}
          </h2>
          <p className="text-blue-200/70 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="relative">
          <div
            className={cn(
              "relative mx-auto max-w-2xl perspective-1000",
              "transition-transform duration-500"
            )}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className={cn(
                "relative cursor-pointer rounded-3xl p-8 md:p-10 min-h-[280px]",
                "border border-white/10 shadow-[0_25px_80px_rgba(139,92,246,0.15)]",
                "transition-all duration-500",
                isFlipped
                  ? "bg-gradient-to-br from-purple-900/80 to-indigo-900/80"
                  : "bg-gradient-to-br from-[#0f1f45] to-[#0a152d]",
                "hover:border-purple-500/40 hover:shadow-[0_30px_100px_rgba(139,92,246,0.25)]"
              )}
            >
              <div className="absolute top-4 right-4">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {isFlipped ? "Answer" : "Tap to reveal"}
                </span>
              </div>

              {current.category && (
                <div className="absolute top-4 left-4">
                  <span className="text-xs font-bold tracking-wider uppercase text-white/50">
                    {current.category}
                  </span>
                </div>
              )}

              <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
                <div className="mb-4">
                  <div className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center",
                    isFlipped 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-purple-500/20 text-purple-400"
                  )}>
                    <Lightbulb className="w-7 h-7" />
                  </div>
                </div>

                <p className={cn(
                  "text-xl md:text-2xl font-semibold leading-relaxed",
                  isFlipped ? "text-white" : "text-white/90"
                )}>
                  {isFlipped ? current.answer : current.question}
                </p>

                {isFlipped && current.source && (
                  <p className="mt-4 text-xs text-white/40">
                    Source: {current.source}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="p-3 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition"
              aria-label="Previous trivia"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all",
                    idx === activeIndex
                      ? "bg-purple-500 w-8"
                      : "bg-white/20 hover:bg-white/40"
                  )}
                  aria-label={`Go to trivia ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-3 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition"
              aria-label="Next trivia"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
