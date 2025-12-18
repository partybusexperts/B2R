"use client";

import Link from "next/link";
import { LocationsWithContentData } from "@/lib/data/locations";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function LocationWhyBook({
  location,
}: {
  location: LocationsWithContentData;
}) {
  const infoTiles = [
    location.why_book?.box1,
    location.why_book?.box2,
    location.why_book?.box3,
  ] as const;

  const benefitTiles = [
    location.why_book?.row1,
    location.why_book?.row2,
    location.why_book?.row3,
    location.why_book?.row4,
  ] as const;

  return (
    <section
      className="relative py-16 px-4 max-w-6xl mx-auto mt-12 mb-16 rounded-3xl
        border border-white/10 bg-slate-950/60
        shadow-[0_30px_90px_rgba(3,7,18,0.55)] bg-gradient-to-b from-blue-900/90
        to-black"
    >
      <div className="grid gap-6 md:grid-cols-3">
        {infoTiles.map((tile) => (
          <Dialog key={tile?.title}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="rounded-2xl border border-white/10 bg-white/5 p-6
                  text-left shadow-inner transition hover:border-white/30
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-blue-300"
              >
                <div
                  className="text-xs font-semibold uppercase tracking-[0.4em]
                    text-blue-200/80"
                >
                  {tile?.label}
                </div>

                <div className="mt-3 text-2xl font-extrabold text-white">
                  {tile?.title}
                </div>
                <p className="mt-2 text-sm text-blue-100/80 leading-relaxed">
                  {tile?.description}
                </p>
                <span
                  className="mt-4 inline-flex items-center gap-2 text-xs
                    font-semibold uppercase tracking-[0.3em] text-blue-100/70"
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
                  {tile?.label}
                </div>

                <DialogTitle className="mt-3 text-3xl font-extrabold text-white">
                  {tile?.title}
                </DialogTitle>

                <p className="mt-4 text-blue-100/90 leading-relaxed">
                  {tile?.modal_content}
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

      <div className="mt-12 text-center space-y-4">
        <h2
          className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r
            from-white via-blue-200 to-blue-500 bg-clip-text text-transparent
            drop-shadow font-serif tracking-tight"
          id={`why-book-in-${location.city_slug}-with-bus2ride-0`}
        >
          Why Book in {location.city_name} with Bus2Ride?
        </h2>
        <p className="mx-auto max-w-3xl text-blue-100/90">
          {location.why_book?.description}
        </p>
      </div>
      <div className="mt-10">
        <ul className="space-y-4 text-blue-900 text-lg">
          {benefitTiles.map((item) => (
            <Dialog key={item?.title}>
              <li
                className="flex item?s-center bg-white rounded-lg shadow px-4
                  py-3 hover:bg-blue-50 transition border border-blue-200
                  cursor-pointer"
              >
                <span className="text-blue-500 text-xl mr-2" aria-hidden="true">
                  ★
                </span>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="flex-1 text-left hover:underline focus:underline
                      outline-none bg-transparent border-none p-0 m-0
                      cursor-pointer"
                    aria-label={item?.title}
                  >
                    {item?.title}
                  </button>
                </DialogTrigger>
              </li>

              <DialogContent
                showCloseButton={false}
                className="border-0 bg-transparent p-0 shadow-none max-w-xl
                  sm:max-w-xl"
              >
                <div
                  className="relative z-10 w-full max-w-xl rounded-3xl border
                    border-white/10 bg-gradient-to-br from-slate-900
                    to-slate-950 p-8 shadow-[0_40px_120px_rgba(2,6,23,0.85)]"
                >
                  <div
                    className="text-xs font-semibold uppercase tracking-[0.4em]
                      text-blue-200/80"
                  >
                    WHY BOOK WITH US
                  </div>

                  <DialogTitle
                    className="mt-3 text-3xl font-extrabold text-white"
                  >
                    {item?.title}
                  </DialogTitle>

                  <p className="mt-4 text-blue-100/90 leading-relaxed">
                    {item?.modal_content}
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
        </ul>
      </div>
    </section>
  );
}
