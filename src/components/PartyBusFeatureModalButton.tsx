"use client";
import React, { useState } from "react";

interface Props {
  title: string;
  content: React.ReactNode;
  label: string;
}

export default function PartyBusFeatureModalButton({ title, content, label }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="flex-1 text-left hover:underline focus:underline outline-none bg-transparent border-none p-0 m-0 cursor-pointer"
        onClick={() => setOpen(true)}
        aria-label={label}
      >
        <span className="text-blue-500 text-xl mr-2">★</span>
        <span className="text-blue-900 font-bold drop-shadow-sm">{label}</span>
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
            <h3 className="text-2xl font-bold mb-4 text-blue-900">{title}</h3>
            <div className="text-gray-800 text-base leading-relaxed whitespace-pre-line" style={{ maxHeight: 400, overflowY: 'auto' }}>
              {content}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
