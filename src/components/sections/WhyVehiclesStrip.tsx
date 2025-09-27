"use client";
import React, { useState } from "react";
import type { WhySection, WhyPoint } from "../../lib/server/why";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { X } from "lucide-react";
import Button from "../ui/button";

function getLabel(p: WhyPoint) {
  return typeof p === "string" ? p : p?.label ?? "";
}
function getDetail(p: WhyPoint) {
  return typeof p === "string" ? "" : p?.detail ?? "";
}

type ModalState = { open: boolean; title: string; label: string; detail: string };

export default function WhyVehiclesStrip({ sections }: { sections: WhySection[] }) {
  const [modal, setModal] = useState<ModalState>({ open: false, title: "", label: "", detail: "" });
  if (!sections?.length) return null;

  return (
    <section className="w-full border-t border-white/10 bg-slate-900 text-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex gap-3 py-4 overflow-x-auto md:grid md:grid-cols-3 md:gap-4 md:overflow-visible no-scrollbar">
          {sections.map((it) => (
            <article key={it.id} className="min-w-[280px] flex-1 rounded-2xl border border-white/10 bg-slate-800/70 p-4 shadow-sm">
              <h3 className="text-base font-semibold tracking-tight">{it.title}</h3>

              <div className="mt-2 flex flex-wrap gap-2">
                {it.points?.map((p, i) => {
                  const label = getLabel(p);
                  const detail = getDetail(p);
                  return (
                    <Button
                      key={i}
                      variant="secondary"
                      className="h-8 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-50 border border-white/10 px-3 text-[13px] leading-none"
                      onClick={() => setModal({ open: true, title: it.title, label, detail })}
                    >
                      {label}
                    </Button>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </div>

      <Dialog open={modal.open} onOpenChange={(o) => setModal((m) => ({ ...m, open: o }))}>
        <DialogContent className="sm:max-w-md rounded-lg bg-slate-900 text-white p-6 shadow-2xl relative">
          {/* Close button */}
          <button
            onClick={() => setModal((m) => ({ ...m, open: false }))}
            className="absolute right-3 top-3 rounded-md p-1 text-slate-400 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-bold">{modal.title}</DialogTitle>
            <p className="text-sm font-medium text-slate-300">{modal.label}</p>
          </DialogHeader>

          <div className="mt-4 max-h-[55vh] overflow-y-auto text-[15px] leading-relaxed text-slate-200">
            {modal.detail?.trim() ? modal.detail : "More info coming soon."}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
