"use client";

import React, { useState } from "react";
import tools from "./registry";

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children?: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-blue-800/40 bg-gradient-to-br from-[#13306a] to-[#0e2250] p-8 shadow-2xl text-blue-100">
        <button onClick={onClose} className="absolute top-3 right-3 text-blue-100 hover:text-white text-2xl font-bold" aria-label="Close">×</button>
        {title ? <h3 className="text-2xl font-extrabold mb-3 font-serif tracking-tight text-white">{title}</h3> : null}
        <div className="text-blue-100 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export default function ToolsGrid({ className }: { className?: string }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const openTool = (i: number) => setOpenIdx(i);
  const closeTool = () => setOpenIdx(null);

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((t, i) => (
          <button key={t.id} onClick={() => openTool(i)} className="text-left bg-[#12244e] rounded-2xl p-4 border border-blue-800/30 hover:scale-105 transition-transform">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-900/20 flex items-center justify-center text-xl">{t.title.split(" ")[0]}</div>
              <div>
                <div className="font-semibold text-white">{t.title}</div>
                <div className="text-blue-200 text-sm">{t.desc}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {openIdx !== null && (
        <Modal open={true} onClose={closeTool} title={tools[openIdx].title}>
          {tools[openIdx].component ? (
            (() => {
              const C = tools[openIdx].component as React.FC | undefined;
              return C ? <C /> : null;
            })()
          ) : (
            <div className="space-y-4">
              <p>{tools[openIdx].desc}</p>
              {tools[openIdx].href ? (
                <a href={tools[openIdx].href} className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-bold bg-white text-blue-900 border border-blue-200 hover:bg-blue-50 transition">Open Tool</a>
              ) : null}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
