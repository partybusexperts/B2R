"use client";

import React, { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';

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
  // live client state (RPC) — initialData may be provided by the server
  const [data, setData] = useState<FallbackShape | null>(null);

  useEffect(() => {
    if (initialData) return; // server already provided canonical data
    let mounted = true;

  (async () => {
      try {
        const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!SUPABASE_URL || !SUPABASE_ANON) return;

        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

        // Use the headers RPC suggested in Option A
        type RpcResult = Record<string, unknown> | { data?: unknown } | null;
        const rpc: RpcResult = await supabase.rpc('fetch_header', { p_page_slug: pageSlug }) as RpcResult;
        const rpcData = (rpc && typeof rpc === 'object' && 'data' in rpc) ? (rpc as any).data : rpc;
        if (!rpcData || typeof rpcData !== 'object') return;

        // try common container keys or assume object
        const candidate = (rpcData as any)?.body ?? (rpcData as any)?.data ?? (rpcData as any)?.content ?? (rpcData as any)?.json ?? rpcData ?? null;
        let parsed: Record<string, unknown> | null = null;
        if (typeof candidate === 'string') {
          try { parsed = JSON.parse(candidate); } catch { parsed = null; }
        } else if (typeof candidate === 'object') {
          parsed = candidate as Record<string, unknown>;
        }

        if (mounted && parsed) setData(parsed as FallbackShape);
      } catch {
        // keep silent — fallback/initialData will be used
      }
    })();

    return () => { mounted = false; };
  }, [pageSlug, initialData]);

  // merge order: fallback < initialData < live
  const d = { ...(fallback || {}), ...(initialData || {}), ...(data || {}) } as FallbackShape;

  return (
    <section className="relative overflow-hidden min-h-[520px] md:min-h-[600px] flex flex-col items-center justify-center text-center !p-0 !py-0">
      {/* Use DB tokens here */}
      <div className={`absolute inset-0 bg-gradient-to-b ${d.gradient_from ?? 'from-blue-950'} ${d.gradient_via ?? 'via-blue-900'} ${d.gradient_to ?? 'to-black'}`} />
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 mix-blend-overlay pointer-events-none" />

      <div className="pt-16" />
      <h1 className={`relative z-10 text-5xl md:text-7xl font-extrabold mb-6 tracking-tight font-serif ${d.text_color ?? 'text-white'} drop-shadow-[0_6px_20px_rgba(0,0,0,.35)]`}>
        {d.title}
      </h1>
      {d.subtitle && (
        <p className={`relative z-10 text-2xl md:text-3xl max-w-3xl mx-auto mb-10 ${d.text_color ?? 'text-white'} font-medium drop-shadow`}>
          {d.subtitle}
        </p>
      )}

      <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center w-full max-w-3xl pb-10">
        {d.tertiary_cta && (
          <a href={d.tertiary_cta.href} className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] whitespace-nowrap bg-white/95 text-blue-900 hover:bg-white border-blue-200">
            {d.tertiary_cta.label}
          </a>
        )}
        {d.secondary_cta && (
          <a href={d.secondary_cta.href} className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] whitespace-nowrap bg-blue-600 text-white hover:bg-blue-700 border-blue-700">
            {d.secondary_cta.label}
          </a>
        )}
        {d.primary_cta && (
          <a href={d.primary_cta.href} className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] whitespace-nowrap bg-blue-800 text-white hover:bg-blue-900 border-blue-900">
            {d.primary_cta.label}
          </a>
        )}
      </div>

      <div className="absolute bottom-[-1px] left-0 right-0">
        <svg viewBox="0 0 1440 110" className="w-full h-[110px]" preserveAspectRatio="none">
          <path
            d="M0,80 C240,130 480,20 720,60 C960,100 1200,40 1440,80 L1440,120 L0,120 Z"
            fill={d.wave_fill ?? '#122a56'}
            opacity="1"
          />
        </svg>
      </div>
    </section>
  );
}
