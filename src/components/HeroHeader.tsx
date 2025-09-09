"use client";

import React, { useEffect, useState } from "react";

type CTA = { label: string; href: string };
type FallbackShape = {
  page_slug: string;
  title: string;
  subtitle?: string;
  phone_display?: string;
  phone_tel?: string;
  email?: string;
  primary_cta?: CTA;
  secondary_cta?: CTA;
  tertiary_cta?: CTA;
  gradient_from?: string;
  gradient_via?: string;
  gradient_to?: string;
  text_color?: string;
  wave_fill?: string;
};

export default function HeroHeader({ pageSlug, fallback, initialData }: { pageSlug: string; fallback: FallbackShape; initialData?: FallbackShape | null }) {
  // If server provided initialData, use that and skip the client fetch
  const [data, setData] = useState<FallbackShape | null>(initialData ?? null);

  useEffect(() => {
    if (initialData) return; // already provided by server — no client fetch needed
    let mounted = true;
    (async () => {
      try {
        // Fetch via server-side proxy so anon/service keys are not embedded in the client bundle
        const apiUrl = `/api/content/${encodeURIComponent(pageSlug)}`;
        const res = await fetch(apiUrl, { headers: { Accept: 'application/json' } });
        if (!res.ok) return;
        const row = await res.json();
        if (!row) return;

        // Try common column names that might contain JSON content
        const candidate = row.data ?? row.content ?? row.json ?? row.props ?? row.body ?? row;

        // If candidate is a string, try parse; otherwise assume object/shape
        const parsed = typeof candidate === 'string' ? (() => {
          try { return JSON.parse(candidate); } catch { return null; }
        })() : candidate;

        if (mounted && parsed) setData({ ...(fallback || {}), ...(parsed || {}) });
      } catch {
        // silent – fallback will be used
      }
    })();
    return () => { mounted = false; };
  }, [pageSlug, fallback, initialData]);

  const src = data || fallback;

  const from = src.gradient_from ?? "from-blue-950";
  const via = src.gradient_via ?? "via-blue-900";
  const to = src.gradient_to ?? "to-black";
  const textColor = src.text_color ?? "text-white";
  const waveFill = src.wave_fill ?? "#122a56";

  return (
    <div className="relative">
      <div className={`absolute inset-0 bg-gradient-to-b ${from} ${via} ${to}`} />
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 mix-blend-overlay pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center px-4 pt-16 md:pt-28">
        <h1 className={`text-5xl md:text-7xl font-extrabold mb-6 tracking-tight font-serif ${textColor} drop-shadow-[0_6px_20px_rgba(0,0,0,.35)]`}>
          {src.title}
        </h1>

        {src.subtitle && (
          <p className={`text-2xl md:text-3xl max-w-3xl mx-auto mb-10 ${textColor} font-medium drop-shadow`}>
            {src.subtitle}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center w-full">
          {src.primary_cta && (
            <a href={src.primary_cta.href} className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] whitespace-nowrap bg-white/95 text-blue-900 hover:bg-white border-blue-200">
              {src.primary_cta.label}
            </a>
          )}

          {src.secondary_cta && (
            <a href={src.secondary_cta.href} className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] whitespace-nowrap bg-blue-600 text-white hover:bg-blue-700 border-blue-700">
              {src.secondary_cta.label}
            </a>
          )}

          {src.tertiary_cta && (
            <a href={src.tertiary_cta.href} className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] whitespace-nowrap bg-blue-800 text-white hover:bg-blue-900 border-blue-900">
              {src.tertiary_cta.label}
            </a>
          )}
        </div>

        <div className="pt-10" />
      </div>

      <div className="absolute bottom-[-1px] left-0 right-0">
        <svg viewBox="0 0 1440 110" className="w-full h-[110px]" preserveAspectRatio="none">
          <path d="M0,80 C240,130 480,20 720,60 C960,100 1200,40 1440,80 L1440,120 L0,120 Z" fill={waveFill} />
        </svg>
      </div>
    </div>
  );
}
