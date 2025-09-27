// src/components/sections/PartyFeatures.tsx
"use client";
import React from "react";

type PartyFeature = { label?: string; description?: string; icon?: React.ReactNode };
type PartyFeaturesData = { title?: string; subtitle?: string; items?: PartyFeature[] } | null;

export default function PartyFeatures({ data }: { data: PartyFeaturesData }) {
  const { title, subtitle, items = [] } = (data ?? {}) as PartyFeaturesData;

  return (
    <section className="relative max-w-7xl mx-auto my-16 px-6">
      <div className="text-center mb-12">
        {title && (
          <h2 className="text-4xl md:text-5xl font-extrabold text-white font-serif tracking-tight drop-shadow-lg">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="mt-4 text-lg md:text-xl text-blue-100/90 max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((f: PartyFeature, i: number) => (
          <div
            key={i}
            className="group relative bg-gradient-to-br from-[#122a5c] to-[#0f2148] 
                       rounded-3xl shadow-xl border border-blue-800/30 
                       p-8 hover:from-blue-700/40 hover:to-indigo-900/40 
                       hover:scale-[1.03] transition-all duration-300"
          >
            {/* Icon placeholder */}
            <div className="w-14 h-14 flex items-center justify-center 
                            rounded-2xl bg-blue-900/40 border border-blue-700/50 
                            text-white text-2xl font-bold mb-6 group-hover:bg-blue-600/40">
              {f.icon ? f.icon : "★"}
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{f.label}</h3>
            <p className="text-blue-200 text-base leading-relaxed">
              {f.description}
            </p>

            {/* Subtle glow on hover */}
            <div className="absolute inset-0 rounded-3xl 
                            bg-gradient-to-tr from-blue-500/10 to-purple-500/10 
                            opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
          </div>
        ))}
      </div>
    </section>
  );
}
