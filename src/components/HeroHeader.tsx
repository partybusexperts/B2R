// src/components/HeroHeader.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type CTA = { label: string; href: string };
type Shape = {
  page_slug?: string;
  title?: string;
  subtitle?: string;

  // legacy CTAs (supported)
  primary_cta?: CTA;
  secondary_cta?: CTA;
  tertiary_cta?: CTA;

  // gradients / colors
  gradient_from?: string;
  gradient_via?: string;
  gradient_to?: string;
  text_color?: string;
  wave_fill?: string;

  // slideshow config
  images?: string[];         // full URLs (your current JSON)
  bucket?: string;           // storage bucket name (if using image_keys)
  image_keys?: string[];     // storage paths (e.g. "Folder/Name.png")
  autoplay_ms?: number;
  darken?: number;

  // optional unified CTAs
  ctas?: { label: string; href: string; style?: "primary" | "secondary" | "outline" }[];
};

function toPublicUrl(bucket: string | undefined, key: string, baseUrl: string) {
  if (/^https?:\/\//i.test(key)) return key; // already a full URL
  const b = baseUrl.replace(/\/+$/, "");
  const encodePath = (p: string) => p.split("/").map(encodeURIComponent).join("/");
  return `${b}/storage/v1/object/public/${bucket ?? "media"}/${encodePath(
    key.replace(/^\/+/, "")
  )}`;
}

// prefer non-empty array A over B
function pickImages(a?: string[] | null, b?: string[] | null) {
  const clean = (arr?: string[] | null) => (Array.isArray(arr) ? arr.filter(Boolean) : []);
  const A = clean(a);
  if (A.length) return A;
  const B = clean(b);
  if (B.length) return B;
  return [];
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
  // Merge with protection against empty arrays overwriting good ones
  const merged: Shape = { ...(fallback || {}), ...(initialData || {}) };

  // Build slideshow sources from `images` or `image_keys`
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const fromFullUrls = pickImages(merged.images, fallback.images);

  const fromKeys = useMemo(() => {
    const keys = (merged.image_keys ?? []).filter(Boolean);
    if (!keys.length) return [];
    return keys.map((k) => toPublicUrl(merged.bucket, k, baseUrl));
  }, [merged.bucket, merged.image_keys, baseUrl]);

  const images = fromFullUrls.length ? fromFullUrls : fromKeys;

  // DEBUG (fires only when list size changes)
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("[HeroHeader] page:", pageSlug, {
      fromFullUrlsCount: fromFullUrls.length,
      fromKeysCount: fromKeys.length,
      imagesCount: images.length,
      sample: images.slice(0, 2),
    });
  }, [pageSlug, images.length]);

  // Rotate
  const [idx, setIdx] = useState(0);
  const loop = useRef<number | null>(null);

  useEffect(() => {
    if (!images.length) return;
    const ms = Math.max(2500, merged.autoplay_ms ?? 6000);
    if (loop.current) window.clearInterval(loop.current);
    loop.current = window.setInterval(() => setIdx((i) => (i + 1) % images.length), ms);
    return () => {
      if (loop.current) window.clearInterval(loop.current);
    };
  }, [images.length, merged.autoplay_ms]);

  // Preload
  useEffect(() => {
    images.forEach((src) => {
      const im = new Image();
      im.src = src;
    });
  }, [images]);

  // BRIGHTER default
  const darken = Math.min(1, Math.max(0, merged.darken ?? 0.15));
  const hasSlides = images.length > 0;

  return (
    <section className="relative overflow-hidden min-h-[520px] md:min-h-[600px] flex flex-col items-center justify-center text-center">
      <style>{css}</style>

      {/* Background */}
      {hasSlides ? (
        <>
          <div className="hero-slides">
            {images.map((src, i) => (
              <div
                key={i}
                className={`hero-slide ${i === idx ? "is-active" : ""}`}
                style={{
                  backgroundImage: `url("${src}")`,
                  "--darken": String(darken),
                } as React.CSSProperties}
              />
            ))}
          </div>
          {/* Lighter overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/20 pointer-events-none" />
        </>
      ) : (
        <>
          <div
            className={`absolute inset-0 bg-gradient-to-b ${
              merged.gradient_from ?? "from-blue-950"
            } ${merged.gradient_via ?? "via-blue-900"} ${merged.gradient_to ?? "to-black"}`}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 mix-blend-overlay pointer-events-none" />
        </>
      )}

      {/* Content */}
      <div className="pt-16" />
      {merged.title && (
        <h1
          className={`relative z-10 text-5xl md:text-7xl font-extrabold mb-6 tracking-tight font-serif ${
            merged.text_color ?? "text-white"
          } drop-shadow-[0_6px_20px_rgba(0,0,0,.35)]`}
        >
          {merged.title}
        </h1>
      )}
      {merged.subtitle && (
        <p
          className={`relative z-10 text-2xl md:text-3xl max-w-3xl mx-auto mb-10 ${
            merged.text_color ?? "text-white"
          } font-medium drop-shadow`}
        >
          {merged.subtitle}
        </p>
      )}

      <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center w-full max-w-3xl pb-10">
        {pickCtas(merged, fallback).map((b, i) => (
          <a key={i} href={b.href} className={`btn ${btnClass(b.style)}`}>
            {b.label}
          </a>
        ))}
      </div>

      <div className="absolute bottom-[-1px] left-0 right-0">
        <svg viewBox="0 0 1440 110" className="w-full h-[110px]" preserveAspectRatio="none">
          <path
            d="M0,80 C240,130 480,20 720,60 C960,100 1200,40 1440,80 L1440,120 L0,120 Z"
            fill={merged.wave_fill ?? "#122a56"}
          />
        </svg>
      </div>
    </section>
  );
}

function pickCtas(d: Shape, fb: Shape) {
  const fromArray =
    d.ctas?.map(({ label, href, style }) => ({
      label,
      href,
      style: (style ?? "secondary") as "primary" | "secondary" | "outline",
    })) ?? [];

  const fromLegacy = [
    (d.primary_cta ?? fb.primary_cta) ? { ...(d.primary_cta ?? fb.primary_cta)!, style: "outline" as const } : null,
    (d.secondary_cta ?? fb.secondary_cta) ? { ...(d.secondary_cta ?? fb.secondary_cta)!, style: "primary" as const } : null,
    (d.tertiary_cta ?? fb.tertiary_cta) ? { ...(d.tertiary_cta ?? fb.tertiary_cta)!, style: "secondary" as const } : null,
  ].filter(Boolean) as { label: string; href: string; style: "primary" | "secondary" | "outline" }[];

  return (fromArray.length ? fromArray : fromLegacy).slice(0, 3);
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
/* Slides fill the section so they actually paint behind content */
.hero-slides{position:absolute;inset:0;z-index:0}
.hero-slide{
  position:absolute;inset:0;opacity:0;transition:opacity 900ms ease;
  background-size:cover;background-position:center;transform:scale(1.08);
}
.hero-slide::after{
  content:"";position:absolute;inset:0;
  /* Use only the --darken value (default 0.15 set in JS) */
  background:linear-gradient(
    180deg,
    rgba(0,0,0,calc(var(--darken,0.15)*0.6)) 0%,
    rgba(0,0,0,var(--darken,0.15)) 40%,
    rgba(0,0,0,calc(var(--darken,0.15)*0.8)) 100%
  );
}
.hero-slide.is-active{opacity:1;animation:kenburns 10s ease-in-out forwards}
@keyframes kenburns{0%{transform:scale(1.08)}50%{transform:scale(1.12)}100%{transform:scale(1.15)}}
.btn{border-radius:999px;padding:12px 20px;font-weight:700;display:inline-flex;align-items:center;gap:8px;box-shadow:0 8px 24px rgba(0,0,0,.18);border:1px solid transparent;transition:transform .12s ease, box-shadow .2s ease, background .2s ease, color .2s ease}
.btn:hover{transform:translateY(-1px);box-shadow:0 12px 30px rgba(0,0,0,.22)}
.btn-primary{background:#2563eb;color:#fff}
.btn-secondary{background:#fff;color:#0f172a}
.btn-outline{background:transparent;border-color:rgba(255,255,255,.7);color:#fff}
.btn-outline:hover{background:rgba(255,255,255,.1)}
`;
