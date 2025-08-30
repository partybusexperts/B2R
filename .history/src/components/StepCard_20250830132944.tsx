"use client";

import React from "react";

interface StepCardProps {
  icon: string;
  label: string;
  title: string;
  body: React.ReactNode;
  stepIndex: number;
}

export default function StepCard({ icon, label, title, body, stepIndex }: StepCardProps) {
  const [open, setOpen] = React.useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  return (
    <div className="relative">
      {/* connector dot (desktop) */}
      <div className="hidden md:block absolute -top-[11px] left-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-white border-2 border-blue-300 shadow" />
      <div
        role="button"
        tabIndex={0}
        aria-label={`${label} details`}
        onClick={openModal}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); } }}
        className="group cursor-pointer bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center border-2 border-blue-100 hover:shadow-2xl transition relative h-full focus:outline-none focus:ring-4 focus:ring-blue-400/40"
      >
        <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-blue-400/0 group-hover:ring-blue-400/30 transition" />
        <span className="text-4xl mb-3 select-none" aria-hidden="true">{icon}</span>
        <span className="text-blue-900 font-bold text-base tracking-tight mb-1 text-center">{label}</span>
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 text-2xl pointer-events-none">→</span>
        <div className="absolute -top-3 left-3">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white border border-blue-300/40 tracking-wide">
            STEP {stepIndex + 1}
          </span>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-blue-700 text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-4 text-blue-900">{title}</h3>
            <div className="text-gray-800 text-base leading-relaxed space-y-3">
              {body}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
