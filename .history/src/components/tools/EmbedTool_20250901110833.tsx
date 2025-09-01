"use client";

import React, { useState } from "react";
import deadhead_distance_estimator from "./generated/deadhead-distance-estimator";

export default function EmbedTool({ href, label }: { href: string; label?: string }) {
  // Render a modal-friendly shell rather than embedding the tool page inside
  // an iframe. This keeps the Tools page native and accessible while still
  // providing a clear affordance to open the original tool page if needed.
  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <div className="mb-3 text-2xl font-bold text-slate-900">{label || 'Open tool'}</div>
      <div className="rounded-lg bg-slate-50 p-4 border border-slate-200 text-sm text-slate-700">
        This tool doesn't have a native React implementation yet. You can open
        the original tool page in a new tab to view the full interactive
        experience.
      </div>
      <div className="mt-4">
        <a
          className="inline-block rounded bg-slate-900 text-white px-3 py-2 text-sm font-medium"
          href={href}
          target="_blank"
          rel="noreferrer"
        >
          Open original tool page
        </a>
      </div>
    </div>
  );
}
