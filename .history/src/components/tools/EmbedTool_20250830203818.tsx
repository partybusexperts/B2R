"use client";

import React, { useState } from "react";

export default function EmbedTool({ href, label }: { href: string; label?: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="w-full">
      <div className="mb-3 text-blue-100">{label || 'Open tool'}</div>
      <div className="relative w-full rounded-xl overflow-hidden border border-blue-800/30">
        {!loaded && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-[#0f1f46]/60">
            <div className="text-blue-100">Loading…</div>
          </div>
        )}
        <iframe
          src={href}
          title={label || href}
          className="w-full h-[640px] bg-white"
          onLoad={() => setLoaded(true)}
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  );
}
