"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  clampDarkenIntensity,
  getButtonVariant,
} from "@/lib/helpers/hero.helpers";
import { HeroData } from "@/types/hero.types";

type HeroHeasderProps = {
  hero: HeroData | null;
  slideImageUrls: string[];
};

export function HeroHeader({ hero, slideImageUrls }: HeroHeasderProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slideIntervalRef = useRef<number | null>(null);
  const autoplayDurationMs = useMemo(
    () => Math.max(2500, hero?.autoplay_ms ?? 6000),
    [hero?.autoplay_ms],
  );

  useEffect(() => {
    if (!slideImageUrls.length) return;
    const startInterval = () => {
      slideIntervalRef.current = window.setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % slideImageUrls.length);
      }, autoplayDurationMs);
    };
    startInterval();
    return () => {
      if (slideIntervalRef.current)
        window.clearInterval(slideIntervalRef.current);
    };
  }, [slideImageUrls.length, autoplayDurationMs]);

  useEffect(() => {
    slideImageUrls.forEach((imageUrl) => {
      const img = new Image();
      img.src = imageUrl;
    });
  }, [slideImageUrls]);

  const darkenIntensity = clampDarkenIntensity(hero?.darken);
  const hasSlideImages = slideImageUrls.length > 0;

  const overlayGradient = {
    background: `linear-gradient(
        180deg,
        rgba(0,0,0,${darkenIntensity * 0.6}) 0%,
        rgba(0,0,0,${darkenIntensity}) 40%,
        rgba(0,0,0,${darkenIntensity * 0.8}) 100%
      )`,
  };

  return (
    <section
      className="relative flex min-h-[550px] flex-col items-center
        justify-center overflow-hidden text-center md:min-h-[650px]"
    >
      {/* Background Layer */}
      {hasSlideImages ? (
        <div className="absolute inset-0 z-0 bg-foreground/70 mix-blend-overlay">
          {slideImageUrls.map((imageUrl, slideIndex) => {
            const isActive = slideIndex === currentSlideIndex;

            return (
              <div
                key={slideIndex}
                className={cn(
                  // BASE: Scale 1.08 ensures no jump when animation starts/ends
                  "absolute inset-0 bg-cover bg-center scale-[1.08] ease-in-out",

                  isActive
                    ? // ACTIVE STATE:
                      // 1. 'transition-opacity' ONLY. If we used 'transition-all', it would
                      //    force the 10s zoom to play in 900ms (the conflict).
                      // 2. 'animate-kenburns' runs freely on the transform property.
                      "z-10 opacity-100 animate-kenburns transition-opacity"
                    : // INACTIVE STATE:
                      // 1. 'transition-all' catches the transform reset.
                      //    Instead of snapping from 1.15 -> 1.08 instantly, it smooths it over 900ms.
                      "z-0 opacity-0 transition-all",
                )}
                style={{
                  backgroundImage: `url("${imageUrl}")`,
                  // Force exact 900ms duration for the transitions (opacity & reset)
                  // This overrides any Tailwind utility conflicts.
                  transitionDuration: "900ms",
                }}
              >
                <div className="absolute inset-0" style={overlayGradient} />
              </div>
            );
          })}
          <div
            className="absolute inset-0 pointer-events-none bg-primary/10
              mix-blend-overlay"
          />
        </div>
      ) : (
        <div
          className="absolute inset-0 z-0 bg-gradient-to-b from-primary/90
            via-primary/70 to-background"
        />
      )}

      {/* Content Layer */}
      <div
        className="relative z-10 flex w-full max-w-8xl flex-col items-center
          gap-6 px-4 pb-0"
      >
        {hero?.title && (
          <h1
            className="text-4xl font-extrabold tracking-tight text-white
              font-serif drop-shadow-lg sm:text-5xl md:text-7xl
              lg:leading-[1.1]"
          >
            {"Hows it going"}
          </h1>
        )}
        {hero?.subtitle && (
          <p
            className="max-w-2xl text-lg font-medium text-white/90
              drop-shadow-md sm:text-xl md:text-3xl"
          >
            {hero?.subtitle}
          </p>
        )}
        {hero?.ctas && hero.ctas.length > 0 && (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
            {hero.ctas.map((cta) => (
              <Button
                key={cta.href}
                asChild
                size="lg"
                variant={getButtonVariant(cta.style)}
                className="h-12 px-8 text-base font-bold shadow-xl"
              >
                <Link href={cta.href}>{cta.label}</Link>
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-[-1px] left-0 right-0 z-20">
        <svg
          viewBox="0 0 1440 100"
          className="h-[60px] w-full text-background md:h-[100px]"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C240,110 480,10 720,50 C960,90 1200,30 1440,70 L1440,100 L0,100 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}
