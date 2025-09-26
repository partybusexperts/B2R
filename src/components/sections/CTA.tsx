// src/components/sections/CTA.tsx
"use client";
import React from "react";

type Button = { label: string; href: string; style?: "primary" | "secondary" | "outline" };
type CTAData = {
  slug?: string;            // optional identifier (useful later)
  title?: string;
  subtitle?: string;
  buttons?: Button[];
  bg?: string | null;       // optional background image (url or storage key)
};

function btnClass(style?: "primary" | "secondary" | "outline") {
  switch (style) {
    case "primary":
      return "bg-blue-600 text-white hover:bg-blue-700";
    case "outline":
      return "bg-transparent border border-white/70 text-white hover:bg-white/10";
    default:
      return "bg-white text-slate-900 hover:bg-slate-100";
  }
}

export default function CTA({ data }: { data: CTAData }) {
  const { title, subtitle, buttons = [] } = data ?? {};

  return (
    <section className="relative py-16 text-center overflow-hidden">
      {/* If you add a background later, uncomment: */}
      {/* {data.bg && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${data.bg})` }} />
          <div className="absolute inset-0 bg-black/10" />
        </div>
      )} */}

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        {title && <h2 className="text-3xl md:text-4xl font-extrabold mb-3">{title}</h2>}
        {subtitle && <p className="text-lg md:text-xl text-slate-600 mb-8">{subtitle}</p>}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {buttons.map((b, i) => (
            <a
              key={i}
              href={b.href}
              className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold shadow ${btnClass(b.style)}`}
            >
              {b.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
