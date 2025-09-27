"use client";

import React, { useState } from "react";
import type { WhySection, WhyPoint } from "../../lib/server/why";
import { Button } from "../ui/button";
import { X } from "lucide-react";

function getLabel(p: WhyPoint) { return typeof p === "string" ? p : p?.label ?? ""; }
function getDetail(p: WhyPoint) { return typeof p === "string" ? "" : (p?.detail ?? ""); }

type ModalState = { open: boolean; title: string; label: string; detail: string };

export default function WhyVehicleCard({ section }: { section?: WhySection }) {
  const [modal, setModal] = useState<ModalState>({ open: false, title: "", label: "", detail: "" });
  if (!section) return null;

  const close = () => setModal((m) => ({ ...m, open: false }));

  return (
    <section className="w-full">
      {/* CARD — darker navy gradient, subtle glass + ring to match site */}
      <article
        className={[
          "mx-auto max-w-4xl rounded-2xl p-6 md:p-8 shadow-lg",
          "bg-gradient-to-b from-[#0F2347] to-[#0A1B36]",
          "ring-1 ring-white/10 backdrop-blur-sm",
        ].join(" ")}
      >
        {/* Title — centered & bigger, crisp white */}
        <h3 className="text-center text-2xl md:text-3xl font-extrabold tracking-tight text-white">
          {section.title}
        </h3>

        {/* Intro — lighter slate to avoid gray cast */}
        {section.intro && (
          <p className="mt-2 text-center text-[15px] md:text-base text-white/80">
            {section.intro}
          </p>
        )}

        {/* Chips — brand-ish navy with blue accent, not gray */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {section.points?.map((p, i) => {
            const label = getLabel(p);
            const detail = getDetail(p);
            return (
              <Button
                key={i}
                onClick={() => setModal({ open: true, title: section.title, label, detail })}
                className={[
                  "h-9 rounded-full px-3 text-[13px] md:text-sm leading-none",
                  "bg-white/8 hover:bg-white/12 text-white/90",
                  "ring-1 ring-white/15 hover:ring-white/25",
                  "shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]",
                ].join(" ")}
                variant="ghost"
              >
                {label}
              </Button>
            );
          })}
        </div>
      </article>

      {/* MODAL — centered, navy overlay, premium card */}
      {modal.open && (
        <div className="fixed inset-0 z-[100]">
          {/* navy overlay (not flat black) */}
          <div
            className="absolute inset-0 bg-[#06142A]/80 backdrop-blur-[2px]"
            onClick={close}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            className={[
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              "w-[92vw] max-w-lg rounded-2xl p-6 md:p-8 shadow-2xl",
              // glassy navy panel with a soft ring to match site cards
              "bg-[#0B1E3A]/90 backdrop-blur-md ring-1 ring-white/10 text-white",
            ].join(" ")}
          >
            <button
              onClick={close}
              className="absolute right-3 top-3 rounded-md p-1 text-white/60 hover:text-white"
              aria-label="Close"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl md:text-2xl font-bold">{modal.title}</h2>
            <p className="mt-1 text-sm font-medium text-white/70">{modal.label}</p>

            <div className="mt-4 max-h-[55vh] overflow-y-auto text-[15px] md:text-base leading-relaxed text-white/85">
              {modal.detail?.trim() ? modal.detail : "More info coming soon."}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
