"use client";
import React, { useState, useEffect, useCallback } from "react";

interface Props {
  title: string;
  content: React.ReactNode;
  label: string;
}

export default function PartyBusFeatureModalButton({ title, content, label }: Props) {
  const [open, setOpen] = useState(false);

  // lock scroll when open
  useEffect(() => {
    if (open) {
      const original = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.documentElement.style.overflow = original;
      };
    }
  }, [open]);

  // close on ESC
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  }, []);

  useEffect(() => {
    if (open) {
      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }
  }, [open, handleKey]);

  return (
    <>
      <button
        type="button"
        className="flex-1 text-left hover:underline focus:underline outline-none bg-transparent border-none p-0 m-0 cursor-pointer inline-flex items-start"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? `${label.replace(/\s+/g, '-').toLowerCase()}-dialog` : undefined}
      >
        <span className="text-blue-500 text-xl mr-2 mt-0.5" aria-hidden="true">★</span>
        <span className="text-blue-900 font-bold drop-shadow-sm leading-snug break-words pr-6">
          {label}
        </span>
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-10"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={() => setOpen(false)}
        >
          <div
            id={`${label.replace(/\s+/g, '-').toLowerCase()}-dialog`}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in focus:outline-none focus-visible:ring-4 ring-blue-400"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-blue-700 text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-4 text-blue-900 pr-8" id={`${label.replace(/\s+/g, '-').toLowerCase()}-title`}>
              {title}
            </h3>
            <div
              className="text-gray-800 text-base leading-relaxed whitespace-pre-line max-h-[400px] overflow-y-auto pr-1"
              role="document"
            >
              {content}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
