"use client";
import React, { useState } from "react";

interface Props {
  title: string;
  desc: string;
  icon?: string;
  buttonLabel?: string;
  children: React.ReactNode;
}

export default function ToolModalButton({ title, desc, icon, buttonLabel = "TRY ME", children }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="w-full bg-gradient-to-r from-blue-700 to-blue-400 text-white p-2 rounded font-bold mb-2 hover:scale-105 transition-transform shadow-lg"
        onClick={() => setOpen(true)}
        aria-label={buttonLabel}
      >
        {buttonLabel}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-blue-700 text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-2 text-blue-900 flex items-center gap-2">
              {icon && <span className="text-2xl">{icon}</span>}
              {title}
            </h3>
            <p className="text-blue-900 mb-4 font-sans text-center">{desc}</p>
            <div className="text-gray-800 text-base leading-relaxed whitespace-pre-line" style={{ maxHeight: 400, overflowY: 'auto' }}>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
