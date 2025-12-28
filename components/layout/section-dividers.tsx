"use client";

import { cn } from "@/lib/utils";

interface DividerProps {
  className?: string;
  flip?: boolean;
}

export function WaveDivider({ className, flip = false }: DividerProps) {
  return (
    <div className={cn("absolute left-0 right-0 z-20 pointer-events-none", flip ? "top-0 rotate-180" : "bottom-0", className)}>
      <svg
        viewBox="0 0 1440 100"
        className="h-[60px] w-full md:h-[100px]"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0a1628" />
            <stop offset="50%" stopColor="#0d1d3a" />
            <stop offset="100%" stopColor="#0a1628" />
          </linearGradient>
        </defs>
        <path
          d="M0,60 C240,110 480,10 720,50 C960,90 1200,30 1440,70 L1440,100 L0,100 Z"
          fill="url(#waveGradient)"
        />
      </svg>
    </div>
  );
}

export function DiagonalDivider({ className, flip = false }: DividerProps) {
  return (
    <div className={cn("absolute left-0 right-0 z-10 pointer-events-none overflow-hidden", flip ? "top-0" : "bottom-0", className)}>
      <svg
        viewBox="0 0 1440 80"
        className={cn("h-[40px] w-full md:h-[80px]", flip && "rotate-180")}
        preserveAspectRatio="none"
      >
        <polygon
          points="0,80 1440,0 1440,80"
          fill="#0a1628"
        />
      </svg>
    </div>
  );
}

export function GlowLine({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-px w-full max-w-4xl mx-auto my-8", className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent blur-sm" />
    </div>
  );
}

export function GlowSeparator({ className }: { className?: string }) {
  return (
    <div className={cn("py-8 relative", className)}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-blue-500/10 blur-3xl animate-glow-pulse" />
      </div>
    </div>
  );
}

export function FloatingOrbs({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl animate-float" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-1/4 left-1/3 w-48 h-48 rounded-full bg-blue-400/5 blur-3xl animate-float" style={{ animationDelay: "4s" }} />
    </div>
  );
}

export function SectionDivider({ variant = "glow" }: { variant?: "glow" | "gradient" | "dots" }) {
  if (variant === "gradient") {
    return (
      <div className="relative h-24 bg-gradient-to-b from-[#0a1628] via-[#0d1d3a] to-[#0a1628]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2/3 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        </div>
      </div>
    );
  }
  
  if (variant === "dots") {
    return (
      <div className="relative py-12 bg-[#0a1628]">
        <div className="flex items-center justify-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500/40" />
          <div className="w-2 h-2 rounded-full bg-blue-500/60" />
          <div className="w-2 h-2 rounded-full bg-blue-500/40" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative py-6 bg-[#0a1628]">
      <div className="section-divider-glow max-w-4xl mx-auto" />
    </div>
  );
}

export function PremiumDivider({ className }: { className?: string }) {
  return (
    <div className={cn("relative py-16 bg-[#0a1628] overflow-hidden", className)}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[800px] h-[2px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-4 h-4 rounded-full bg-blue-500/50 blur-sm" />
        <div className="absolute inset-0 w-4 h-4 rounded-full bg-blue-400/30 animate-ping" />
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl animate-glow-pulse" />
    </div>
  );
}
