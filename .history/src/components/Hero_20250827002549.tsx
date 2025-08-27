"use client";
// src/components/Hero.tsx

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { heroSet, bestSrc, findByFileName } from "../utils/optimizedImages";

// Pull top large party bus images for hero (fallback to default array if empty)
const heroImages = heroSet("partyBuses", 5);
const fallbackImages: { src: string; alt: string }[] = [
  { src: "/images/party-buses/Bus-1.png", alt: "Party bus exterior" },
  { src: "/images/party-buses/Bus-2.png", alt: "Party bus exterior" },
  { src: "/images/party-buses/Bus-3.png", alt: "Party bus interior" },
  { src: "/images/party-buses/Bus-4.png", alt: "Party bus lighting" },
  { src: "/images/party-buses/Bus-6.png", alt: "Party bus seating" },
];
// Build initial slides
let slides = heroImages.length
  ? heroImages.map(h => ({
      key: h.original,
      src: bestSrc(h),
      alt: h.alt,
      width: h.width,
      height: h.height,
      blur: h.blurDataURL,
    }))
  : fallbackImages.map(f => ({ key: f.src, src: f.src, alt: f.alt, width: 1920, height: 1080 }));

// Explicit override: ensure final slide uses the requested image if available
const OVERRIDE_FINAL = '30 Passenger Party Bus.png';
const overrideEntry = findByFileName?.(OVERRIDE_FINAL);
if (overrideEntry) {
  const overrideSlide = {
    key: overrideEntry.original + '-forced',
    src: bestSrc(overrideEntry),
    alt: overrideEntry.alt || '30 passenger party bus interior',
    width: overrideEntry.width,
    height: overrideEntry.height,
    blur: overrideEntry.blurDataURL
  };
  // If it's already among slides, move it to end; else replace last
  const existingIdx = slides.findIndex(s => s.key === overrideEntry.original);
  if (existingIdx >= 0) {
    slides = slides.filter((_,i)=>i!==existingIdx);
    slides.push(overrideSlide);
  } else if (slides.length) {
    slides[slides.length - 1] = overrideSlide;
  } else {
    slides.push(overrideSlide);
  }
}

type Slide = {
  key: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
};

type RawSlide = {
  key: string; src: string; alt: string; width: number; height: number; blur?: string; blurDataURL?: string;
};
const slidesTyped: Slide[] = (slides as RawSlide[]).map((s) => ({
  key: s.key,
  src: s.src,
  alt: s.alt,
  width: s.width,
  height: s.height,
  blurDataURL: s.blurDataURL || s.blur,
}));

// ---- Hero behavior toggles ----
// Set to false to disable automatic slide rotation (or use env var at build time)
const ENABLE_AUTOPLAY = process.env.NEXT_PUBLIC_HERO_AUTOPLAY !== '0';
// Progress bar visibility
const SHOW_PROGRESS = process.env.NEXT_PUBLIC_HERO_SHOW_PROGRESS !== '0';
// Autoplay interval
const AUTOPLAY_MS = 4500;

/**
 * Award-level hero slideshow:
 * - Crossfade + subtle Ken Burns (respects prefers-reduced-motion)
 * - Gradient beams + diagonal sheen (no dot texture)
 * - Glass CTA panel
 * - Progress bar for slide timing
 * - Keyboard arrows + swipe gestures + pause on hover
 * - Thumbnail strip for quick jump
 * - Smooth bottom wave divider
 */
export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [isHover, setIsHover] = useState(false);
  const [progress, setProgress] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const tickStartRef = useRef<number | null>(null);

  // Hydration-safe reduced motion detection: start false (matches SSR) then update after mount.
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setPrefersReducedMotion(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const goTo = useCallback(
    (idx: number) => {
  setCurrent((idx + slides.length) % slides.length);
      setProgress(0);
      tickStartRef.current = null;
    },
    [setCurrent]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Autoplay + progress (paused on hover or reduce-motion)
  useEffect(() => {
    if (!ENABLE_AUTOPLAY) return; // hard disable
    if (isHover || prefersReducedMotion) return;

    const step = (now: number) => {
      if (!tickStartRef.current) tickStartRef.current = now;
      const elapsed = now - tickStartRef.current;
      const pct = Math.min(100, (elapsed / AUTOPLAY_MS) * 100);
      setProgress(pct);
      if (pct >= 100) {
        next();
        tickStartRef.current = now;
        setProgress(0);
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [current, isHover, next, prefersReducedMotion]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Swipe navigation
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) {
        next();
      } else {
        prev();
      }
    }
    touchStartX.current = null;
  };

  // Shared CTA button classes
  const buttonBase =
    "rounded-full font-bold px-8 py-3 text-lg shadow-lg transition border flex items-center justify-center min-w-[220px] text-center";

  // Optional: replace last slide if last two look similar (pink) with a non-pink party bus image not already used
  useEffect(() => {
    if (slidesTyped.length < 2) return;
    const last = slidesTyped[slidesTyped.length - 1];
    const prev = slidesTyped[slidesTyped.length - 2];
    const looksPink = (s: Slide) => /pink/i.test(s.alt || '') || /pink/i.test(s.src);
    if (!(looksPink(last) && looksPink(prev))) return;
    (async () => {
      try {
        const mod = await import('../utils/optimizedImages');
        const allParty = mod.getCategoryImages('partyBuses');
        const existingKeys = new Set(slidesTyped.map(s => s.key));
        const replacement = allParty.find(e => !/pink/i.test(e.alt) && !existingKeys.has(e.original));
        if (replacement) {
          slidesTyped[slidesTyped.length - 1] = {
            key: replacement.original + '-replacement',
            src: bestSrc(replacement),
            alt: replacement.alt,
            width: replacement.width,
            height: replacement.height,
            blurDataURL: replacement.blurDataURL
          };
        }
      } catch {/* ignore */}
    })();
  }, [slidesTyped]);

  return (
    <section
  className="relative h-[88vh] min-h-[600px] w-full overflow-hidden"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
  aria-label="Featured vehicles hero preview"
    >
      {/* Slides */}
      <div className="absolute inset-0">
  {slidesTyped.map((s, i) => {
          const isActive = i === current;
          return (
            <div
              key={s.key}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out will-change-opacity ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={s.src}
                alt={s.alt}
                width={s.width}
                height={s.height}
                priority={i === 0}
                placeholder={s.blurDataURL ? "blur" : undefined}
                blurDataURL={s.blurDataURL}
                className={`w-full h-full object-cover ${
                  prefersReducedMotion
                    ? ""
                    : "will-change-transform transition-transform duration-[5000ms]"
                } ${isActive && !prefersReducedMotion ? "scale-[1.06]" : "scale-100"}`}
                style={{ transformOrigin: "center" }}
                sizes="100vw"
              />
            </div>
          );
        })}
      </div>

      {/* Cinematic overlays (no dots) */}
      {/* Deep base vignettes */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/40" />
      {/* Color beams */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-1/4 -left-1/4 h-[160%] w-[60%] bg-gradient-to-br from-blue-400/30 via-transparent to-transparent blur-3xl" />
        <div className="absolute -bottom-1/3 -right-1/5 h-[150%] w-[55%] bg-gradient-to-tl from-indigo-500/25 via-transparent to-transparent blur-[90px]" />
      </div>
      {/* Diagonal sheen sweep */}
      <div className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_right,transparent,black_35%,black_65%,transparent)]">
        <div className="absolute inset-y-0 -left-1/3 w-1/2 rotate-12 bg-white/5 blur-xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full w-full flex items-center justify-center px-6 md:px-10 lg:px-16">
        {/* Floating fleet preview badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold text-white border border-white/20 shadow-lg">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Fleet Preview
          <a href="/fleet" className="ml-2 text-blue-200 hover:text-white underline decoration-dotted" data-hero-interactive="true">View All →</a>
        </div>
        <div className="backdrop-blur-xl bg-black/35 rounded-3xl shadow-2xl px-8 py-10 md:px-16 md:py-14 w-full max-w-4xl border border-white/15 ring-1 ring-white/10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="text-white/90 font-semibold tracking-wide">
              Live availability • Book in minutes
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-center mb-4 bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent drop-shadow-[0_2px_24px_rgba(59,130,246,.25)]">
            Bus2Ride
          </h1>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-center mb-8 text-white/95">
            Luxury Party Buses • Limousines • Coach Buses
          </h2>

          {/* Primary CTAs */}
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex gap-4 flex-wrap justify-center w-full">
              <a
                href="/quote#instant"
                data-hero-interactive="true"
                className={`${buttonBase} bg-white text-blue-800 hover:bg-blue-50 hover:text-blue-900 border-blue-200`}
              >
                Get Instant Quote
              </a>
              <a
                href="/fleet"
                data-hero-interactive="true"
                className={`${buttonBase} bg-blue-700 text-white hover:bg-blue-800 border-blue-800`}
              >
                View Fleet
              </a>
              <a
                href="tel:8885352566"
                data-hero-interactive="true"
                aria-label="Call Bus2Ride at 888-535-2566"
                className={`${buttonBase} bg-white text-blue-800 border-blue-200 hover:bg-blue-50 hover:text-blue-900`}
              >
                <span className="relative mr-2 text-xl inline-block">📞</span>(888) 535-2566
              </a>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap justify-center gap-3 mt-3 text-xs md:text-sm">
              {[
                "4.9★ Average Rating",
                "On-Time Promise",
                "Clean Vehicle Guarantee",
                "Transparent Pricing",
              ].map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/90 backdrop-blur"
                >
                  {t}
                </span>
              ))}
            </div>
            {/* Hero footnote to clarify preview */}
            <div className="mt-6 text-center text-[13px] md:text-sm text-white/75">
              Showing a rotating preview of vehicles. For full searchable list visit
              {' '}<a href="/fleet" className="text-blue-200 hover:text-white underline" data-hero-interactive="true">the fleet page</a>.
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-5 z-20 mx-auto max-w-6xl px-6">
        {/* Progress bar (toggle via SHOW_PROGRESS) */}
        {SHOW_PROGRESS && ENABLE_AUTOPLAY && (
          <div className="h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-100 rounded-full transition-[width]"
              style={{ width: `${progress}%` }}
              aria-hidden
            />
          </div>
        )}

        {/* Thumbnails & arrows */}
        <div className="mt-4 flex items-center justify-between gap-3">
          {/* Prev */}
          {ENABLE_AUTOPLAY && (
            <button
              onClick={prev}
              data-hero-interactive="true"
              aria-label="Previous slide"
              className="hidden md:inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/80 hover:bg-white text-blue-900 border border-white/60 shadow-lg"
            >
              ‹
            </button>
          )}

          {/* Thumbs */}
          <div className="flex-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:'none'] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-3 justify-center min-w-max">
              {slidesTyped.map((s, i) => (
                ENABLE_AUTOPLAY ? (
                  <button
                    key={s.key}
                    onClick={(e) => { e.stopPropagation(); goTo(i); }}
                    data-hero-interactive="true"
                    aria-label={`Go to slide ${i + 1}`}
                    className={`relative h-16 w-24 rounded-xl overflow-hidden border ${
                      i === current
                        ? "border-white ring-2 ring-blue-300"
                        : "border-white/40 hover:border-white/70"
                    } transition`}
                  >
                    <Image
                      src={s.src}
                      alt={s.alt}
                      width={160}
                      height={100}
                      className="h-full w-full object-cover"
                      placeholder={s.blurDataURL ? 'blur' : undefined}
                      blurDataURL={s.blurDataURL}
                      loading="lazy"
                    />
                    {i === current && (
                      <span className="absolute inset-0 ring-1 ring-white/80 rounded-xl pointer-events-none" />
                    )}
                  </button>
                ) : (
                  <div
                    key={s.key}
                    className={`relative h-16 w-24 rounded-xl overflow-hidden border ${
                      i === current ? 'border-white' : 'border-white/30'
                    }`}
                  >
                    <Image
                      src={s.src}
                      alt={s.alt}
                      width={160}
                      height={100}
                      className="h-full w-full object-cover"
                      placeholder={s.blurDataURL ? 'blur' : undefined}
                      blurDataURL={s.blurDataURL}
                      loading="lazy"
                    />
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Next */}
          {ENABLE_AUTOPLAY && (
            <button
              onClick={next}
              data-hero-interactive="true"
              aria-label="Next slide"
              className="hidden md:inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/80 hover:bg-white text-blue-900 border border-white/60 shadow-lg"
            >
              ›
            </button>
          )}
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-[-1px] left-0 right-0 z-10">
        <svg viewBox="0 0 1440 120" className="w-full h-[120px]" preserveAspectRatio="none" aria-hidden>
          <path
            d="M0,80 C240,130 480,20 720,60 C960,100 1200,40 1440,80 L1440,120 L0,120 Z"
            fill="rgba(18,42,86,1)"
          />
        </svg>
      </div>

      {/* A11y live region (announce slide changes for screen readers) */}
      <div className="sr-only" role="status" aria-live="polite">
  Slide {current + 1} of {slidesTyped.length}
      </div>
    </section>
  );
}
