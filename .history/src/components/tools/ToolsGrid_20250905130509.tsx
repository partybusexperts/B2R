"use client";

import React, { useState } from "react";
import tools from "./registry";
import type { ToolEntry } from "./registry";
import ToolRunner from '@/components/ToolRunner';
import calculators from '@/lib/tools/calculators';

function Modal({ open, onClose, title, children, sizeClass }: { open: boolean; onClose: () => void; title?: string; children?: React.ReactNode; sizeClass?: string }) {
  if (!open) return null;
  const maxW = sizeClass || 'max-w-2xl';
  return (
    // clicking the overlay will close the modal; clicking inside content won't
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6" onClick={onClose}>
      <div className={`relative w-full ${maxW} bg-white rounded-2xl shadow-2xl ring-1 ring-slate-200 overflow-hidden`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-5 border-b border-slate-100">
          <div className="flex-1 min-w-0">
            {title ? <h3 className="text-2xl font-semibold text-slate-900 truncate">{title}</h3> : null}
            {/* optional subtitle / small desc can render in body */}
          </div>
          <div className="flex items-start">
            <button onClick={onClose} className="inline-flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 w-9 h-9 leading-none" aria-label="Close">×</button>
          </div>
        </div>

        {/* Body: scrollable if tall */}
        <div className="p-6 max-h-[75vh] overflow-y-auto text-slate-700">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ToolsGrid({ className, limit, filter, items, randomize }: { className?: string; limit?: number; filter?: string; items?: ToolEntry[]; randomize?: boolean }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  // limit: optionally show a random subset of tools (useful on non-canonical pages)
  // filter: optional prefilter text applied to tool titles/desc

  const openTool = (i: number) => setOpenIdx(i);
  const closeTool = () => setOpenIdx(null);

  const copyEmbed = async (id: string, i: number) => {
    try {
      // Copy the public tool URL (no raw embed code shown)
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const url = `${origin}/tools/${id}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        setCopiedIdx(i);
        setTimeout(() => setCopiedIdx(null), 2000);
      }
    } catch {
      // ignore
    }
  };

  const modalSizeFor = (t: ToolEntry) => {
    if ((t as any).modalSize) return (t as any).modalSize as string;
    const map: Record<string, string> = {
      'capacity-finder': 'max-w-md',
      'cleaning-fee-risk-checker': 'max-w-md',
      'seating-map-designer': 'max-w-lg',
      'vehicle-compare': 'max-w-3xl',
    };
    return map[t.id] || 'max-w-2xl';
  };

  // apply optional filter
  const normalizedFilter = (filter || "").trim().toLowerCase();
  let candidates = (items && items.length ? items : tools).filter(t =>
    !normalizedFilter || t.title.toLowerCase().includes(normalizedFilter) || t.desc.toLowerCase().includes(normalizedFilter)
  );

  // apply random selection if limit is provided and less than total
  // optionally shuffle candidates (randomize true) or when a limit is provided
  if ((randomize || (typeof limit === 'number' && limit > 0)) && candidates.length > 1) {
    const copy = [...candidates];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    candidates = typeof limit === 'number' && limit > 0 ? copy.slice(0, limit) : copy;
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {candidates.map((t, i) => (
          <div key={t.id} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openTool(i); }} onClick={() => openTool(i)} className="relative text-left bg-[#12244e] rounded-2xl p-3 md:p-4 border border-blue-800/30 hover:scale-102 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-900/20 flex items-center justify-center text-lg">{t.title.split(" ")[0]}</div>
              <div className="flex-1">
                <div className="font-semibold text-white">{t.title}</div>
                <div className="text-blue-200 text-sm">{t.desc}</div>
              </div>
              <div className="ml-2">
                <button type="button" onClick={(e) => { e.stopPropagation(); copyEmbed(t.id, i); }} className="text-sm bg-white/5 px-2 py-1 rounded-md hover:bg-white/10" aria-label={`Share ${t.title}`}>{copiedIdx === i ? 'Copied' : 'Share'}</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {openIdx !== null && candidates[openIdx] && (
        <Modal open={true} onClose={closeTool} title={candidates[openIdx].title} sizeClass={modalSizeFor(candidates[openIdx])}>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-blue-200">{candidates[openIdx].desc}</div>
              <div>
                <button type="button" onClick={() => copyEmbed(candidates[openIdx].id, openIdx)} className="text-sm bg-white/5 px-3 py-1 rounded-md hover:bg-white/10">Copy Embed</button>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs text-slate-500 block mb-2">Share this tool</label>
              <div className="flex items-center gap-2 mb-2">
                <button type="button" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(candidates[openIdx].title + ' - ' + window.location.origin + '/tools/' + candidates[openIdx].id)}`,'_blank') } className="px-3 py-1 rounded-md bg-blue-500 text-white text-sm">Share on Twitter</button>
                <button type="button" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/tools/' + candidates[openIdx].id)}`,'_blank') } className="px-3 py-1 rounded-md bg-blue-700 text-white text-sm">Share on Facebook</button>
                <button type="button" onClick={() => { navigator.clipboard?.writeText(window.location.origin + '/tools/' + candidates[openIdx].id); setCopiedIdx(openIdx); setTimeout(()=>setCopiedIdx(null),2000); }} className="px-3 py-1 rounded-md bg-gray-200 text-slate-900 text-sm">{copiedIdx === openIdx ? 'Copied' : 'Copy link'}</button>
              </div>
              <div className="text-sm text-slate-600 flex items-center gap-3">
                <span>Embed on your site:</span>
                <button type="button" onClick={() => { const url = (typeof window !== 'undefined' ? window.location.origin : '') + '/tools/' + candidates[openIdx].id; navigator.clipboard?.writeText(url); setCopiedIdx(openIdx); setTimeout(()=>setCopiedIdx(null),2000); }} className="px-3 py-1 rounded-md bg-gray-200 text-slate-900 text-sm">{copiedIdx === openIdx ? 'Copied' : 'Copy link'}</button>
                <a className="text-blue-600 underline text-sm" href={`${typeof window !== 'undefined' ? window.location.origin : ''}/tools/${candidates[openIdx].id}`} target="_blank" rel="noreferrer">Open</a>
              </div>
            </div>

            {candidates[openIdx].component ? (
              (() => {
                const C = candidates[openIdx].component as React.FC | undefined;
                return C ? <C /> : null;
              })()
            ) : (
              <div className="space-y-4">
                <p>{candidates[openIdx].desc}</p>
                {calculators[candidates[openIdx].id] ? (
                  // Render calculator inline when available
                  <div>
                    <ToolRunner toolId={candidates[openIdx].id} />
                  </div>
                ) : candidates[openIdx].href ? (
                  <a href={candidates[openIdx].href} className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-bold bg-white text-blue-900 border border-blue-200 hover:bg-blue-50 transition">Open Tool</a>
                ) : null}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
