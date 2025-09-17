// src/components/HeroHeader.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type CTA = { label: string; href: string };
type Shape = {
  page_slug: string;
  title: string;
  subtitle?: string;

  // legacy CTA shape (from fallback)
  primary_cta?: CTA;
  secondary_cta?: CTA;
  tertiary_cta?: CTA;

  // gradient fallback
  gradient_from?: string;
  gradient_via?: string;
  gradient_to?: string;
  text_color?: string;
  wave_fill?: string;

  // slideshow config (from heroes1.data)
  ctas?: { label: string; href: string; style?: "primary" | "secondary" | "outline" }[];
  bucket?: string;
  image_keys?: string[];
  autoplay_ms?: number;
  darken?: number;
};

function toPublicUrl(bucket: string | undefined, key: string, baseUrl: string) {
  if (/^https?:\/\//i.test(key)) return key; // full URL already
  const base = baseUrl.replace(/\/+$/, "");
  const enc = (p: string) => p.split("/").map(encodeURIComponent).join("/");
  return `${base}/storage/v1/object/public/${bucket ?? "media"}/${enc(key.replace(/^\/+/, ""))}`;
}

export default function HeroHeader({
  pageSlug,
  fallback,
  initialData,
}: {
  pageSlug: string;
  fallback: Shape;
  initialData?: Shape | null;
}) {
  const [data] = useState<Shape | null>(initialData ?? null);

  // merge precedence: fallback < initialData
  const d = { ...(fallback || {}), ...(data || {}) } as Shape;

  // CTAs (array or legacy 3 fields)
  const ctasFromArray =
    d.ctas?.map(({ label, href, style }) => ({
      label,
      href,
      style: (style ?? "secondary") as "primary" | "secondary" | "outline",
    })) ?? [];

  const ctasFromLegacy: { label: string; href: string; style: "primary" | "secondary" | "outline" }[] = [
    d.tertiary_cta ? { ...d.tertiary_cta, style: "secondary" } : null,
    d.secondary_cta ? { ...d.secondary_cta, style: "primary" } : null,
    d.primary_cta ? { ...d.primary_cta, style: "outline" } : null,
  ].filter(Boolean) as any[];

  const ctas = (ctasFromArray.length ? ctasFromArray : ctasFromLegacy).slice(0, 3);

  // slideshow
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const images = useMemo(() => {
    const keys = (d.image_keys ?? []).filter(Boolean);
    if (!keys.length) return [];
    return keys.map((k) => toPublicUrl(d.bucket, k, baseUrl));
  }, [d.bucket, d.image_keys, baseUrl]);

  const [idx, setIdx] = useState(0);
  const loop = useRef<number | null>(null);

  useEffect(() => {
    if (!images.length) return;
    const ms = Math.max(2500, d.autoplay_ms ?? 6000);
    if (loop.current) window.clearInterval(loop.current);
    loop.current = window.setInterval(() => setIdx((i) => (i + 1) % images.length), ms);
    return () => loop.current && window.clearInterval(loop.current);
  }, [images.length, d.autoplay_ms]);

  // preload
  useEffect(() => {
    images.forEach((src) => { const im = new Image(); im.src = src; });
  }, [images]);

  const darken = Math.min(1, Math.max(0, d.darken ?? 0.35));
  const hasSlides = images.length > 0;

  return (
    <section className="relative min-h-[64vh] sm:min-h-[72vh] flex items-center">
      <style>{css}</style>

      {/* BACKGROUND (absolute so it doesn’t create empty space) */}
      <div className="absolute inset-0 -z-10">
        {hasSlides ? (
          <>
            <div className="absolute inset-0">
              {images.map((src, i) => (
                <div
                  key={i}
                  className={`hero-slide ${i === idx ? "is-active" : ""}`}
                  style={
                    {
                      "--bg": `url('${src}')`,
                      "--darken": String(darken),
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/45" />
          </>
        ) : (
          <>
            <div
              className={`absolute inset-0 bg-gradient-to-b ${d.gradient_from ?? "from-blue-950"} ${
                d.gradient_via ?? "via-blue-900"
              } ${d.gradient_to ?? "to-black"}`}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 mix-blend-overlay" />
          </>
        )}
      </div>

      {/* POLLS BADGE */}
      <a
        href="/polls"
        className="absolute right-4 top-20 md:top-24 z-10 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm bg-emerald-500/90 hover:bg-emerald-500 text-white shadow"
      >
        🔥 New polls & surveys →
      </a>

      {/* CONTENT */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 text-center">
        <h1
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight font-serif ${
            d.text_color ?? "text-white"
          } drop-shadow-[0_6px_20px_rgba(0,0,0,.35)]`}
        >
          {d.title}
        </h1>
        {d.subtitle && (
          <p
            className={`mt-4 text-xl sm:text-2xl md:text-3xl max-w-3xl mx-auto ${
              d.text_color ?? "text-white"
            }/95`}
          >
            {d.subtitle}
          </p>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          {ctas.map((b, i) => (
            <a key={i} href={b.href} className={`btn ${btnClass(b.style)}`}>
              {b.label}
            </a>
          ))}
        </div>
      </div>

      {/* WAVE */}
      <div className="absolute bottom-[-1px] left-0 right-0">
        <svg viewBox="0 0 1440 110" className="w-full h-[110px]" preserveAspectRatio="none">
          <path
            d="M0,80 C240,130 480,20 720,60 C960,100 1200,40 1440,80 L1440,120 L0,120 Z"
            fill={d.wave_fill ?? "#122a56"}
          />
        </svg>
      </div>
    </section>
  );
}

function btnClass(style: "primary" | "secondary" | "outline" | undefined) {
  switch (style) {
    case "primary":
      return "btn-primary";
    case "outline":
      return "btn-outline";
    default:
      return "btn-secondary";
  }
}

const css = `
.hero-slide{
  position:absolute;inset:0;opacity:0;transition:opacity 900ms ease;
  background-image:var(--bg);background-size:cover;background-position:center;
  transform:scale(1.06);
}
.hero-slide::after{
  content:"";position:absolute;inset:0;
  background:linear-gradient(180deg, rgba(0,0,0,calc(var(--darken)*0.7)) 0%, rgba(0,0,0,var(--darken)) 60%, rgba(0,0,0,calc(var(--darken)*0.85)) 100%);
}
.hero-slide.is-active{opacity:1;animation:kenburns 10s ease-in-out forwards}
@keyframes kenburns{0%{transform:scale(1.06)}50%{transform:scale(1.1)}100%{transform:scale(1.13)}}
.btn{border-radius:999px;padding:12px 20px;font-weight:700;display:inline-flex;align-items:center;gap:8px;
     box-shadow:0 8px 24px rgba(0,0,0,.18);border:1px solid transparent;
     transition:transform .12s ease, box-shadow .2s ease, background .2s ease, color .2s ease}
.btn:hover{transform:translateY(-1px);box-shadow:0 12px 30px rgba(0,0,0,.22)}
.btn-primary{background:#2563eb;color:#fff}
.btn-secondary{background:#fff;color:#0f172a}
.btn-outline{background:transparent;border-color:rgba(255,255,255,.7);color:#fff;border-width:1px}
.btn-outline:hover{background:rgba(255,255,255,.1)}
`;
