"use client";
import React, { useState, useEffect } from "react";
import { SmartImage } from "./SmartImage";

interface SlideItem {
  src: string;
  title?: string;
  caption?: string;
}

const slides: SlideItem[] = [
  { src: "/images/party-buses/18 Passenger White Party Bus Exterior.png", title: "18 Passenger Party Bus", caption: "White exterior • Popular for winter aurora loops" },
  { src: "/images/party-buses/17 Passenger Black Party Bus Exterior.png", title: "17 Passenger Black Party Bus", caption: "Sleek black finish • Night events & brewery loops" },
  { src: "/images/limousines/10 Passenger Lincoln Stretch Limo Exterior 2.png", title: "10 Passenger Stretch Limo", caption: "Formal transfers • Weddings downtown" },
  { src: "/images/sprinter-limo-style/14 Passenger Sprinter Van Limo Style Exterior Door Open.png", title: "14 Passenger Sprinter Limo", caption: "Perimeter seating • USB power & lighting" },
  { src: "/images/sprinter-limo-style/10 Passenger Limo Sprinter Exterior.png", title: "Sprinter Interior", caption: "Leather seating • Overhead effects lighting" },
  { src: "/images/party-buses/18 Passenger White Party Bus Interior.png", title: "Party Bus Interior", caption: "Sound system • Cooler staging area" }
];

export default function AnchorageVehicleSlider() {
  const [index, setIndex] = useState(0);

  // Auto-play every 5s
  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, []);

  const go = (dir: number) => setIndex(i => (i + dir + slides.length) % slides.length);

  return (
    <div className="relative w-full h-80 md:h-[400px] overflow-hidden rounded-2xl group border border-blue-700/40 shadow-lg bg-[#0f1f3a]">
      {slides.map((s, i) => (
        <div
          key={s.src}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
        >
          <SmartImage
            src={s.src}
            alt={s.title || 'Vehicle'}
            className="w-full h-full object-cover object-center brightness-[0.92]"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 flex flex-col gap-1">
            {s.title && <h4 className="text-sm md:text-base font-semibold text-white drop-shadow">{s.title}</h4>}
            {s.caption && <p className="text-[11px] md:text-xs text-blue-100/90 leading-snug max-w-md">{s.caption}</p>}
          </div>
        </div>
      ))}
      {/* Controls */}
      <button aria-label="Previous" onClick={() => go(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">‹</button>
      <button aria-label="Next" onClick={() => go(1)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">›</button>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {slides.map((_, i) => (
          <button key={i} aria-label={`Go to slide ${i + 1}`} onClick={() => setIndex(i)} className={`h-2.5 w-2.5 rounded-full ${i === index ? 'bg-white' : 'bg-white/40'} border border-white/50`} />
        ))}
      </div>
    </div>
  );
}
