"use client";

import * as React from "react";
import Image from "next/image";

type Props = {
  imageUrls: string[];
  intervalMs?: number;
};

export default function VehicleImageGallery({
  imageUrls,
  intervalMs = 4500,
}: Props) {
  const urls = React.useMemo(
    () =>
      (imageUrls ?? []).filter(
        (u): u is string => typeof u === "string" && u.length > 0,
      ),
    [imageUrls],
  );

  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    // Keep index valid if images change.
    if (activeIndex >= urls.length) setActiveIndex(0);
  }, [activeIndex, urls.length]);

  React.useEffect(() => {
    if (urls.length <= 1) return;

    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % urls.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [urls.length, intervalMs]);

  const goPrev = React.useCallback(() => {
    if (urls.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + urls.length) % urls.length);
  }, [urls.length]);

  const goNext = React.useCallback(() => {
    if (urls.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % urls.length);
  }, [urls.length]);

  if (urls.length === 0) {
    return (
      <div
        className="relative w-full h-80 md:h-[400px] overflow-hidden rounded-2xl
          group border border-blue-700/40 shadow-lg bg-[#0f1f3a]"
      />
    );
  }

  return (
    <div
      className="relative w-full h-80 md:h-[400px] overflow-hidden rounded-2xl
        group border border-blue-700/40 shadow-lg bg-[#0f1f3a]"
    >
      {urls.map((url, idx) => (
        <div
          key={`${url}-${idx}`}
          className={`absolute inset-0 transition-opacity duration-700
          ease-in-out ${idx === activeIndex ? "opacity-100" : "opacity-0"}`}
        >
          <Image
            src={url}
            alt="Vehicle"
            fill
            sizes="(min-width: 768px) 700px, 100vw"
            className="object-cover"
            priority={idx === 0}
          />
        </div>
      ))}

      <button
        type="button"
        aria-label="Previous"
        onClick={goPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40
          hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center
          justify-center opacity-0 group-hover:opacity-100 transition"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={goNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40
          hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center
          justify-center opacity-0 group-hover:opacity-100 transition"
      >
        ›
      </button>

      {urls.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {urls.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setActiveIndex(idx)}
              className={`h-2.5 w-2.5 rounded-full border border-white/50 ${
                idx === activeIndex ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
