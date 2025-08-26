"use client";
// Hero.tsx (enhanced)

import React, { useEffect, useRef, useState, useCallback } from "react";

const images = [
  { src: "/images/Bus-1.png", alt: "Luxury coach bus at sunset" },
  { src: "/images/Bus-2.png", alt: "Party bus exterior with LED glow" },
  { src: "/images/Bus-3.png", alt: "Limo interior with leather seating" },
  { src: "/images/Bus-4.png", alt: "Executive coach ready for boarding" },
  { src: "/images/Bus-5.png", alt: "Sprinter limo with mood lighting" },
];

const AUTOPLAY_MS = 5000;

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const raf = useRef<number | null>(null);

  const next = useCallback(
    () => setCurrent((p) => (p + 1) % images.length),
    []
  );
  const prev = useCallback(
    () => setCurrent((p) => (p - 1 + images.length) % images.length),
    []
  );

  // Autoplay with page visibility + hover pause
  useEffect(() => {
    let id: number | null = null;

    const tick = () => {
      if (!paused && !document.hidden) next();
      id = window.setTimeout(tick, AUTOPLAY_MS);
    };

    id = window.setTimeout(tick, AUTOPLAY_MS);
    const onVisibility = () => {
      if (id) window.clearTimeout(id);
      id = window.setTimeout(tick, AUTOPLAY_MS);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (id) window.clearTimeout(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [paused, next]);

  // Keyboard nav (left/right)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Touch swipe (mobile)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 30) return; // deadzone
    if (dx < 0) next();
    else prev();
  };

  // Mouse parallax (subtle; reduced motion-safe)
  const onMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
    const y = (e.clientY - r.top) / r.height - 0.5;
    const translateBg = `translate3d(${x * 10}px, ${y * 8}px, 0)`;
    const translateGlows = `translate3d(${x * 18}px, ${y * 14}px, 0)`;
    document.documentElement.style.setProperty("--hero-bg-tilt", translateBg);
    document.documentElement.style.setProperty("--hero-glow-tilt", translateGlows);

    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      // noop; we just throttle updates via rAF
    });
  };

  const buttonBase =
    "rounded-full font-bold px-8 py-3 text-lg shadow-lg transition border flex items-center justify-center min-w-[220px] text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-700";

  return (
    <section
      ref={heroRef as any}
      className="relative h-[90vh] min-h-[640px] w-full overflow-hidden flex items-center justify-center select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onMouseMove={onMouseMove}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Featured vehicles"
    >
      {/* Image slides */}
      {images.map((img, i) => (
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1200ms] ease-[cubic-bezier(.2,.7,.2,1)] will-change-transform z-0
            ${i === current ? "opacity-100 scale-105" : "opacity-0 scale-100"}
          `}
          style={{ transitionProperty: "opacity, transform" }}
          // Hero is LCP; don't lazy-load the first; others benefit from the browser cache anyway.
          loading={i === 0 ? "eager" : "lazy"}
          fetchPriority={i === 0 ? "high" : "auto"}
        />
      ))}

      {/* Ambient gradient & texture overlays */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          transform: "var(--hero-bg-tilt)",
          transition: "transform 120ms ease-out",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/50" />
        <div className="absolute inset-0 mix-blend-overlay opacity-70 [background-image:radial-gradient(1000px_600px_at_20%_30%,rgba(59,130,246,.25)_0,transparent_60%),radial-gradient(1000px_600px_at_80%_70%,rgba(99,102,241,.25)_0,transparent_60%)]" />
        <div className="absolute inset-0 opacity-[.08] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:10px_10px]" />
      </div>

      {/* Animated glows */}
      <div
        className="absolute -top-40 -left-40 w-[38rem] h-[38rem] rounded-full bg-sky-400/25 blur-3xl z-[1] pointer-events-none animate-pulse"
        style={{ transform: "var(--hero-glow-tilt)", transition: "transform 160ms ease-out" }}
      />
      <div
        className="absolute -bottom-48 -right-48 w-[42rem] h-[42rem] rounded-full bg-indigo-500/25 blur-3xl z-[1] pointer-events-none animate-[pulse_3s_ease-in-out_infinite]"
        style={{ transform: "var(--hero-glow-tilt)", transition: "transform 160ms ease-out" }}
      />

      {/* Content card */}
      <div className="relative z-[3] flex flex-col items-center justify-center h-full w-full px-6 md:px-10 lg:px-16">
        <div className="backdrop-blur-xl bg-black/30 rounded-3xl shadow-2xl px-8 py-10 md:px-16 md:py-14 flex flex-col items-center w-full max-w-3xl border-2 border-blue-800/40">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5 bg-white/90 text-blue-900 border border-blue-200"
            aria-live="polite"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
            </span>
            Live availability • Book in minutes
          </div>

          <h1 className="text-4xl md:text-7xl font-extrabold text-center mb-3 bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent drop-shadow-[0_8px_30px_rgba(0,0,0,.35)] tracking-tight">
            Bus2Ride
          </h1>
          <h2 className="text-lg md:text-2xl font-semibold text-center mb-8 text-blue-100/95 max-w-2xl">
            The Ultimate in Luxury Vehicle Rentals
          </h2>

          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex gap-4 flex-wrap justify-center w-full">
              <a
                href="/quote"
                className={`${buttonBase} bg-white text-blue-800 hover:bg-blue-50 hover:text-blue-900 border-blue-200`}
                style={{ letterSpacing: "0.03em" }}
              >
                ⚡ Get Instant Quote
              </a>
              <a
                href="/fleet"
                className={`${buttonBase} bg-blue-700 text-white hover:bg-blue-800 border-blue-800`}
                style={{ letterSpacing: "0.03em" }}
              >
                View Fleet
              </a>
              <a
                href="tel:8885352566"
                aria-label="Call Bus2Ride at 888-535-2566"
                className={`${buttonBase} bg-white text-blue-800 border-blue-200 hover:bg-blue-50 hover:text-blue-900`}
                style={{ letterSpacing: "0.03em" }}
              >
                <span className="relative text-blue-500 text-xl phone-nudge mr-2">📞</span>
                (888) 535-2566
              </a>
            </div>

            {/* Dots/Pagination */}
            <div
              className="mt-6 flex items-center gap-2.5"
              role="tablist"
              aria-label="Slide selector"
            >
              {images.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === current}
                  aria-controls={`hero-slide-${i}`}
                  tabIndex={i === current ? 0 : -1}
                  onClick={() => setCurrent(i)}
                  className={`h-2.5 rounded-full transition-all ${
                    i === current ? "w-8 bg-white" : "w-2.5 bg-white/60 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Prev/Next arrows (a11y + large touch targets) */}
      <button
        aria-label="Previous slide"
        onClick={prev}
        className="group absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-[4] h-12 w-12 rounded-full bg-white/85 hover:bg-white shadow-lg border border-blue-200 flex items-center justify-center"
      >
        <span className="translate-x-0.5 group-hover:-translate-x-0 transition">←</span>
      </button>
      <button
        aria-label="Next slide"
        onClick={next}
        className="group absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-[4] h-12 w-12 rounded-full bg-white/85 hover:bg-white shadow-lg border border-blue-200 flex items-center justify-center"
      >
        <span className="-translate-x-0.5 group-hover:translate-x-0 transition">→</span>
      </button>

      {/* Scroll cue */}
      <a
        href="#party-buses"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[4] inline-flex flex-col items-center gap-1 text-white/90 hover:text-white"
        aria-label="Scroll to content"
      >
        <span className="text-xs tracking-widest">SCROLL</span>
        <span className="inline-block animate-bounce">▾</span>
      </a>

      {/* Motion & accessibility helpers */}
      <style>{`
        @keyframes nudge {
          0%, 80%, 100% { transform: translateX(0); }
          85% { transform: translateX(-2px); }
          90% { transform: translateX(2px); }
          95% { transform: translateX(-1px); }
        }
        .phone-nudge { display: inline-block; animation: nudge 5s ease-in-out infinite; }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          img { transition: none !important; }
          .phone-nudge { animation: none !important; }
          .animate-bounce, .animate-ping, .animate-pulse { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
