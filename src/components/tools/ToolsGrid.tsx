"use client";

import React, { useState } from "react";
import tools from "./registry";
import type { ToolEntry } from "./registry";
import ToolRunner from "@/components/ToolRunner";
import calculators from "@/lib/tools/calculators";

type ToolWithFlags = ToolEntry & {
  comingSoon?: boolean;
  modalSize?: string;
};

const getBadgeText = (t: ToolWithFlags) => {
  const anyTool = t as ToolWithFlags & { badge?: string };
  if (anyTool.badge && anyTool.badge.trim()) return anyTool.badge.trim();

  const firstWord = t.title.split(" ")[0] || "";
  return firstWord.length > 8 ? firstWord.slice(0, 7) + "…" : firstWord;
};

function Modal({
  open,
  onClose,
  title,
  children,
  sizeClass,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  sizeClass?: string;
}) {
  if (!open) return null;
  const maxW = sizeClass || "max-w-2xl";
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxW} rounded-2xl shadow-2xl border border-blue-700/60 bg-[#050b1f] text-slate-100 overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-blue-900/60 bg-[#050b26]">
          <div className="flex-1 min-w-0">
            {title ? (
              <h3 className="text-2xl font-semibold text-white truncate">
                {title}
              </h3>
            ) : null}
          </div>
          <div className="flex items-start">
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full bg-blue-900/40 hover:bg-blue-800/80 text-slate-100 w-9 h-9 leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto text-slate-100">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ToolsGrid({
  className,
  limit,
  filter,
  items,
  randomize,
}: {
  className?: string;
  limit?: number;
  filter?: string;
  items?: ToolEntry[];
  randomize?: boolean;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const [candidates, setCandidates] = useState<ToolWithFlags[]>(() => {
    const normalizedFilter = (filter || "").trim().toLowerCase();
    const base = (items && items.length ? items : tools).filter((t) => {
      const tt = t as ToolWithFlags;
      return (
        !normalizedFilter ||
        tt.title.toLowerCase().includes(normalizedFilter) ||
        tt.desc.toLowerCase().includes(normalizedFilter)
      );
    }) as ToolWithFlags[];
    if (typeof limit === "number" && limit > 0) return base.slice(0, limit);
    return base;
  });

  const openTool = (i: number) => setOpenIdx(i);
  const closeTool = () => setOpenIdx(null);

  const copyEmbed = async (id: string, i: number) => {
    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
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

  const modalSizeFor = (t: ToolWithFlags) => {
    if (t.modalSize) return t.modalSize;
    const map: Record<string, string> = {
      "capacity-finder": "max-w-md",
      "cleaning-fee-risk-checker": "max-w-md",
      "seating-map-designer": "max-w-lg",
      "vehicle-compare": "max-w-3xl",
    };
    return map[t.id] || "max-w-2xl";
  };

  React.useEffect(() => {
    if (!randomize && !(typeof limit === "number" && limit > 0)) return;
    const base = ((items && items.length) ? items : tools) as ToolWithFlags[];
    const copy = [...base];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    const newCandidates =
      typeof limit === "number" && limit > 0 ? copy.slice(0, limit) : copy;
    setCandidates(newCandidates);
  }, [randomize, limit, filter, items]);

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates.map((t, i) => {
          const tt = t as ToolWithFlags;
          const isComingSoon = !!tt.comingSoon;
          return (
            <div
              key={tt.id}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") openTool(i);
              }}
              onClick={() => openTool(i)}
              className={`relative text-left rounded-2xl p-3 md:p-4 border transition-transform focus:outline-none focus:ring-2 focus:ring-blue-400
                bg-[#0c1a3a] border-blue-800/50 hover:scale-[1.02]`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center px-1">
                  <span className="w-full text-[10px] font-semibold leading-tight text-blue-100 text-center truncate">
                    {getBadgeText(tt)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold text-white truncate">
                      {tt.title}
                    </div>
                    {isComingSoon && (
                      <span className="inline-flex items-center rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/40 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <div className="text-blue-200/90 text-sm mt-1 line-clamp-2">
                    {tt.desc}
                  </div>
                  {!isComingSoon && (
                    <div className="mt-3 text-[11px] uppercase tracking-[0.2em] text-blue-300/70">
                      Click to open tool
                    </div>
                  )}
                  {isComingSoon && (
                    <div className="mt-3 text-[11px] uppercase tracking-[0.2em] text-amber-300/80">
                      Preview · Not yet live
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {openIdx !== null && candidates[openIdx] && (
        <Modal
          open={true}
          onClose={closeTool}
          title={candidates[openIdx].title}
          sizeClass={modalSizeFor(candidates[openIdx])}
        >
          {(() => {
            const entry = candidates[openIdx] as ToolWithFlags;
            const isComingSoon = !!entry.comingSoon;

            return (
              <div className="mb-2 space-y-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="text-sm text-blue-100/80 max-w-xl">
                    {entry.desc}
                  </div>
                  {!isComingSoon && (
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => copyEmbed(entry.id, openIdx)}
                        className="text-xs bg-blue-900/40 border border-blue-500/60 px-3 py-1 rounded-full hover:bg-blue-800/80"
                      >
                        Copy link
                      </button>
                    </div>
                  )}
                </div>

                {isComingSoon ? (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 px-4 py-3">
                      <div className="text-sm font-semibold text-amber-200">
                        This tool is almost ready.
                      </div>
                      <p className="text-sm text-amber-100/90 mt-1">
                        We’re finishing up testing on this calculator so it’s
                        accurate for busy nights and edge cases. Check back
                        soon—or ask your planner and we’ll run the numbers for
                        you manually.
                      </p>
                    </div>
                    <p className="text-sm text-blue-100/80">
                      In the meantime, you can {" "}
                      <a
                        href="/contact"
                        className="text-blue-300 underline hover:text-blue-200"
                      >
                        message our team
                      </a>{" "}
                      with your event details, and we’ll help you pick hours,
                      vehicle size, and a budget range.
                    </p>
                  </div>
                ) : entry.component ? (
                  (() => {
                    const C = entry.component as React.FC | undefined;
                    return C ? <C /> : null;
                  })()
                ) : calculators[entry.id] ? (
                  <div className="mt-2">
                    <ToolRunner toolId={entry.id} />
                  </div>
                ) : entry.href ? (
                  <div className="mt-3">
                    <a
                      href={entry.href}
                      className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-bold bg-white text-blue-900 border border-blue-200 hover:bg-blue-50 transition"
                    >
                      Open Tool
                    </a>
                  </div>
                ) : null}
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
}
