"use client";
import React from "react";

export default function TrustStatModalCard({ stat, label, title, content }: { stat: string; label: string; title: string; content: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        type="button"
        className="bg-white/95 text-blue-900 rounded-2xl border border-blue-200 shadow p-4 hover:-translate-y-0.5 transition will-change-transform text-left"
        aria-label={`${label} details`}
        onClick={() => setOpen(true)}
      >
        <div className="text-2xl font-extrabold tracking-tight">{stat}</div>
        <div className="text-blue-700 text-xs font-semibold uppercase tracking-wide">{label}</div>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-blue-700 text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-4 text-blue-900">{title}</h3>
            <div className="text-gray-800 text-base leading-relaxed space-y-3 max-h-[400px] overflow-y-auto">
              {content}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
