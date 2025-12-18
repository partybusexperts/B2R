"use client";

import Link from "next/link";
import { LocationsData } from "@/lib/data/locations";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

type StepTile = {
  step: string;
  emoji: string;
  title: string;
  teaser: string;
  modalBody: string;
};

export default function LocationHowToBook({
  location,
  isState = false,
}: {
  location: LocationsData;
  isState?: boolean;
}) {
  const steps: StepTile[] = [
    {
      step: "Step 01",
      emoji: "🗺️",
      title: "Share Trip Details",
      teaser:
        "Tell us your pickup windows, passenger count, luggage, and any aurora or cruise timing flex.",
      modalBody:
        "Start with the basics: pickup windows, passenger count, luggage, and your must-hit stops. If you’re working around cruise boarding times or aurora viewing, we’ll build the route and buffers around those constraints.",
    },
    {
      step: "Step 02",
      emoji: "💬",
      title: "Review Your Quote",
      teaser: `We send a written, all-in quote with buffers baked in for ${isState ? location.state_name : location.city_name} roads and weather.`,
      modalBody:
        "Line-item clarity: vehicle type, minimum hours, gratuity, fuel, and overtime policy—no surprise line items later.",
    },
    {
      step: "Step 03",
      emoji: "📝",
      title: "Reserve & Prep",
      teaser:
        "Approve digitally, place your deposit, and we dispatch the right vehicle and chauffeur.",
      modalBody:
        "Once you approve, we reserve the vehicle, lock your pickup windows, and prep the driver notes. We’ll confirm key details like passenger counts, luggage needs, and any timing constraints so the day runs clean.",
    },
    {
      step: "Step 04",
      emoji: "🧭",
      title: "Final Check & Ride",
      teaser:
        "48 hours out we confirm manifests, share driver info, and monitor airport/cruise feeds.",
      modalBody:
        "48 hours out, dispatch reconfirms your plan, shares driver details, and monitors live flight/cruise timing when relevant. On ride day, we keep communication tight so pickups stay smooth even if timing shifts.",
    },
  ];

  return (
    <section
      className="my-24 relative max-w-6xl mx-auto bg-gradient-to-br
        from-[#0e1c3c] to-[#050a15] rounded-3xl
        shadow-[0_50px_140px_rgba(3,8,20,0.55)] border border-white/10 py-14
        px-6 mb-16"
    >
      <h2
        className="text-4xl md:text-5xl font-extrabold text-center mb-4
          font-serif tracking-tight bg-gradient-to-r from-white via-blue-200
          to-blue-500 bg-clip-text text-transparent"
        id={`how-to-book-in-${isState ? location.state_slug : location.city_slug}-1`}
      >
        How to Book in {isState ? location.state_name : location.city_name}
      </h2>
      <p className="text-blue-100/85 text-center max-w-3xl mx-auto mb-10">
        Four fast steps—from your first quote to wheels rolling. Our local
        dispatch team keeps {isState ? location.state_name : location.city_name}{" "}
        timing, road conditions, and fleet prep locked in.
      </p>
      <div className="grid gap-4 md:grid-cols-4">
        {steps.map((step) => (
          <Dialog key={step.step}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="rounded-3xl border border-white/10 bg-white/5 p-5
                  text-center shadow-inner transition hover:border-white/30
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-white/40"
              >
                <div
                  className="text-sm font-semibold uppercase tracking-[0.4em]
                    text-blue-200/80"
                >
                  {step.step}
                </div>
                <div className="mt-4 text-4xl" aria-hidden="true">
                  {step.emoji}
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-blue-100/80">{step.teaser}</p>
                <span
                  className="mt-4 inline-flex items-center gap-2 text-xs
                    font-semibold uppercase tracking-[0.35em] text-blue-100/70"
                >
                  Learn more <span aria-hidden="true">→</span>
                </span>
              </button>
            </DialogTrigger>

            <DialogContent
              showCloseButton={false}
              className="border-0 bg-transparent p-0 shadow-none max-w-xl
                sm:max-w-xl"
            >
              <div
                className="relative z-10 w-full max-w-xl rounded-3xl border
                  border-white/10 bg-gradient-to-br from-slate-900 to-slate-950
                  p-8 shadow-[0_40px_120px_rgba(2,6,23,0.85)]"
              >
                <div
                  className="text-xs font-semibold uppercase tracking-[0.4em]
                    text-blue-200/80"
                >
                  {isState ? location.state_name : location.city_name} BOOKING
                </div>

                <h3 className="mt-3 text-3xl font-extrabold text-white">
                  {step.step} • {step.title}
                </h3>

                <p className="mt-4 text-blue-100/90 leading-relaxed">
                  {step.modalBody}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <DialogClose asChild>
                    <button
                      type="button"
                      className="rounded-full border border-white/30 px-5 py-2
                        text-sm font-semibold text-white hover:bg-white/10"
                    >
                      Close
                    </button>
                  </DialogClose>

                  <Link
                    href="/contact"
                    className="rounded-full bg-white px-5 py-2 text-sm
                      font-semibold text-blue-900 shadow hover:bg-slate-100"
                  >
                    Get an Instant Quote
                  </Link>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <a
          href="/contact"
          className="inline-flex items-center justify-center rounded-full
            bg-white px-8 py-3 text-sm font-bold text-blue-900 shadow-lg
            hover:bg-blue-50"
        >
          Get an Instant Quote
        </a>
        <a
          href="tel:8885352566"
          className="inline-flex items-center justify-center rounded-full border
            border-white/30 px-8 py-3 text-sm font-bold text-white
            hover:bg-white/10"
        >
          Talk to {isState ? location.state_name : location.city_name} Dispatch
        </a>
      </div>
    </section>
  );
}
