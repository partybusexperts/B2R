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

export default function HeroHeader({ pageSlug, fallback }: { pageSlug: string; fallback: FallbackShape }) {
  const [data, setData] = useState<FallbackShape | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!url || !key) return; // env not configured

        // Prefer key-based lookup: use a deterministic key derived from pageSlug
        // (e.g. 'contact-hero'). This avoids needing the page_slug column to be
        // present. If the key lookup fails, fall back to page_slug-based REST
        // filtering (when the column exists).
        const keyName = `${pageSlug}-hero`;
        const base = url.replace(/\/$/, "");
        const tryKeyUrl = `${base}/rest/v1/content_points?select=*&key=eq.${encodeURIComponent(keyName)}&limit=1`;
        let res = await fetch(tryKeyUrl, {
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
            Accept: "application/json",
          },
        });
        let json = [];
        if (res.ok) {
          json = await res.json();
        }

        // If key lookup returned nothing, try page_slug REST filter as a fallback.
        let row = Array.isArray(json) && json[0] ? json[0] : null;
        if (!row) {
          const tryPageSlugUrl = `${base}/rest/v1/content_points?select=*&page_slug=eq.${encodeURIComponent(pageSlug)}&limit=1`;
          const r2 = await fetch(tryPageSlugUrl, {
            headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: "application/json" },
          });
          if (r2.ok) {
            const j2 = await r2.json();
            row = Array.isArray(j2) && j2[0] ? j2[0] : null;
          }
        }
        if (!row) return;

        // Try common column names that might contain JSON content
        const candidate = row.data ?? row.content ?? row.json ?? row.props ?? row.body ?? row;

        // If candidate is a string, try parse; otherwise assume object/shape
        const parsed = typeof candidate === "string" ? (() => {
          try { return JSON.parse(candidate); } catch { return null; }
        })() : candidate;

        if (mounted && parsed) setData({ ...(fallback || {}), ...(parsed || {}) });
      } catch (err) {
        // silent – fallback will be used
        // console.debug("HeroHeader: fetch failed", err);
      }
    })();
    return () => { mounted = false; };
  }, [pageSlug, fallback]);

  const src = data || fallback;

  const from = src.gradient_from ?? "from-blue-950";
  const via = src.gradient_via ?? "via-blue-900";
  const to = src.gradient_to ?? "to-black";
  const textColor = src.text_color ?? "text-white";
  const waveFill = src.wave_fill ?? "#122a56";

  return (
    <>
      <div className={`absolute inset-0 bg-gradient-to-b ${from} ${via} ${to}`} />
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 mix-blend-overlay pointer-events-none" />

      <div className="pt-16" />
      <h1 className={`relative z-10 text-5xl md:text-7xl font-extrabold mb-6 tracking-tight font-serif ${textColor} drop-shadow-[0_6px_20px_rgba(0,0,0,.35)]`}>
        {src.title}
      </h1>
      {src.subtitle ? <p className={`relative z-10 text-2xl md:text-3xl max-w-3xl mx-auto mb-10 ${textColor} font-medium drop-shadow`}>{src.subtitle}</p> : null}

      <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center w-full max-w-3xl pb-10">
        {src.primary_cta ? (
          <a href={src.primary_cta.href} className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] whitespace-nowrap bg-white/95 text-blue-900 hover:bg-white border-blue-200">
            {src.primary_cta.label}
          </a>
        ) : null}

        {src.secondary_cta ? (
          <a href={src.secondary_cta.href} className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] whitespace-nowrap bg-blue-600 text-white hover:bg-blue-700 border-blue-700">
            {src.secondary_cta.label}
          </a>
        ) : null}

        {src.tertiary_cta ? (
          <a href={src.tertiary_cta.href} className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] whitespace-nowrap bg-blue-800 text-white hover:bg-blue-900 border-blue-900">
            {src.tertiary_cta.label}
          </a>
        ) : null}
      </div>

      <div className="absolute bottom-[-1px] left-0 right-0">
        <svg viewBox="0 0 1440 110" className="w-full h-[110px]" preserveAspectRatio="none">
          <path d="M0,80 C240,130 480,20 720,60 C960,100 1200,40 1440,80 L1440,120 L0,120 Z" fill={waveFill} />
        </svg>
      </div>
    </>
  );
}
