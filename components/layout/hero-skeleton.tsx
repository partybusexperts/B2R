"use client";

export function HeroSkeleton() {
  return (
    <section
      className="relative flex min-h-[550px] flex-col items-center
        justify-center overflow-hidden bg-[#0E1F46] md:min-h-[650px]"
    >
      {/* Background Pulse */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#122a56]/60
          via-[#0E1F46] to-[#0B1938] animate-pulse"
      />

      <div
        className="relative z-10 flex w-full max-w-4xl flex-col items-center
          gap-8 px-4 pt-16"
      >
        {/* Title Placeholder */}
        <div
          className="h-14 w-3/4 rounded-xl bg-white/10 md:h-20 md:w-2/3
            animate-pulse"
        />

        {/* Subtitle Placeholder */}
        <div className="flex w-full max-w-2xl flex-col items-center gap-3">
          <div className="h-6 w-full rounded-full bg-white/10 animate-pulse" />
          <div className="h-6 w-5/6 rounded-full bg-white/10 animate-pulse" />
        </div>

        {/* Buttons Placeholder */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <div className="h-12 w-40 rounded-xl bg-white/15 animate-pulse" />
          <div className="h-12 w-40 rounded-xl bg-white/10 animate-pulse" />
        </div>
      </div>

      {/* Bottom Wave (Keeps layout consistent even during loading) */}
      <div className="absolute bottom-[-1px] left-0 right-0 z-20">
        <svg
          viewBox="0 0 1440 100"
          className="h-[60px] w-full text-[#0B1938] md:h-[100px]"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C240,110 480,10 720,50 C960,90 1200,30 1440,70 L1440,100 L0,100 Z"
            fill="#0B1938"
          />
        </svg>
      </div>
    </section>
  );
}
