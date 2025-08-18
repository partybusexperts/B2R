// Hero.tsx

import React, { useEffect, useState } from "react";

const images = [
  "/images/Bus-1.png",
  "/images/Bus-2.png",
  "/images/Bus-3.png",
  "/images/Bus-4.png",
  "/images/Bus-5.png"
];

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCurrent(p => (p + 1) % images.length), 4000);
    return () => clearInterval(id);
  }, []);

  // Shared button classes for consistent sizing
  const buttonBase =
    "rounded-full font-bold px-8 py-3 text-lg shadow-lg transition border flex items-center justify-center min-w-[220px] text-center";

  return (
    <section className="relative h-[90vh] min-h-[600px] w-full overflow-hidden flex items-center justify-center">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Slide ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out z-0 ${
            i === current ? "opacity-100 scale-105" : "opacity-0 scale-100"
          }`}
          style={{ transitionProperty: "opacity, transform" }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40 z-10" />

      <div className="relative z-20 flex flex-col items-center justify-center h-full w-full px-6 md:px-10 lg:px-16">
        <h1 className="text-4xl md:text-7xl font-extrabold text-center mb-4 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
          Bus 2 Ride
        </h1>
        <h2 className="text-xl md:text-3xl font-semibold text-center mb-8 opacity-90 max-w-2xl bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
          The Ultimate in Luxury Vehicle Rentals
        </h2>

        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex gap-4 flex-wrap justify-center">
            <a
              href="/quote"
              className={`${buttonBase} bg-white text-blue-800 hover:bg-blue-50 hover:text-blue-900 border-blue-200`}
              style={{ letterSpacing: "0.03em" }}
            >
              Get Instant Quote
            </a>
            <a
              href="/fleet"
              className={`${buttonBase} bg-blue-700 text-white hover:bg-blue-800 border-blue-800`}
              style={{ letterSpacing: "0.03em" }}
            >
              View Fleet
            </a>
            <a
              href="tel:8885352566"
              aria-label="Call Bus2Ride at 888-535-2566"
              className={`${buttonBase} bg-white text-blue-800 border-blue-200 hover:bg-blue-50 hover:text-blue-900`}
              style={{ letterSpacing: "0.03em" }}
            >
              <span className="relative text-blue-500 text-xl phone-nudge mr-2">📞</span>
              <span className="relative">(888) 535-2566</span>
            </a>
          </div>
        </div>
      </div>

      {/* Keyframes for subtle phone icon nudge */}
      <style jsx>{`
        @keyframes nudge {
          0%, 80%, 100% { transform: translateX(0); }
          85% { transform: translateX(-2px); }
          90% { transform: translateX(2px); }
          95% { transform: translateX(-1px); }
        }
        .phone-nudge {
          display: inline-block;
          animation: nudge 5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
