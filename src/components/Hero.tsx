
// Hero.tsx
// This component renders a professional background slideshow from static PNG images
// in /public/images using fade/zoom transitions. No <video> element is used.
"use client";

import { useEffect, useState } from "react";

// Match file names exactly, including uppercase "B"
const images = [
  "/images/Bus-1.png",
  "/images/Bus-2.png",
  "/images/Bus-3.png",
  "/images/Bus-4.png",
  "/images/Bus-5.png",
];

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrent((prev) => (prev + 1) % images.length),
      4000 // change slide every 4 seconds
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[90vh] min-h-[600px] w-full overflow-hidden flex items-center justify-center">
      {/* Slideshow images */}
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Slide ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out z-0
            ${i === current ? "opacity-100 scale-105" : "opacity-0 scale-100"}`}
          style={{ transitionProperty: 'opacity, transform' }}
        />
      ))}
  {/* Overlay for readability (lightened) */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40 z-10" />
      {/* Hero content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full w-full px-6 md:px-10 lg:px-16">
        <h1 className="text-4xl md:text-7xl font-extrabold text-white text-center drop-shadow-lg mb-4">
          Bus 2 Ride
        </h1>
        <h2 className="text-xl md:text-3xl font-semibold text-white text-center mb-8 opacity-90 max-w-2xl">
          The Ultimate in Luxury Vehicle Rentals
        </h2>
        <div className="flex gap-4 flex-wrap justify-center">
          <a
            href="/quote"
            className="rounded-2xl bg-white px-8 py-4 font-semibold text-black text-lg shadow-lg hover:shadow-xl transition"
          >
            Get Instant Quote
          </a>
          <a
            href="/fleet"
            className="rounded-2xl bg-white/10 px-8 py-4 font-semibold text-white text-lg backdrop-blur hover:bg-white/15 transition border border-white/20"
          >
            View Fleet
          </a>
        </div>
      </div>
    </section>
  );
}
