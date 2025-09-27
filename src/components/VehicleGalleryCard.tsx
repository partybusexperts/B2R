"use client";

import React, { useState, useEffect } from "react";
import OptimizedImage from "./OptimizedImage";
import { ResolvedVehicle } from "../data/vehicles";

interface Props {
  vehicle: ResolvedVehicle;
  amenityLabels?: string[]; // NEW
  showCTA?: boolean;
}

export default function VehicleGalleryCard({ vehicle, amenityLabels, showCTA = true }: Props) {
  const images = vehicle.images || [];
  const [activeIdx, setActiveIdx] = useState(0);
  const active = images[activeIdx] || vehicle.primary;

  // auto-rotate main image every 6s if >1 image
  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(
      () => setActiveIdx((prev) => (prev + 1) % images.length),
      6000
    );
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div
      className="relative rounded-3xl overflow-hidden shadow-xl
                 border border-blue-800/40 bg-[#122a5c] group hover:shadow-2xl
                 transition-all duration-300 hover:scale-[1.02]"
    >
      {/* Main Image */}
      <div className="relative h-60">
        {active?.entry ? (
          <OptimizedImage
            entry={active.entry}
            alt={vehicle.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            minDesiredWidth={900}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-blue-100">
            {vehicle.name}
          </div>
        )}

        {/* Overlay title + capacity */}
        <div
          className="absolute bottom-0 left-0 right-0
                     bg-gradient-to-t from-black/70 via-black/30 to-transparent
                     px-4 py-3"
        >
          <h3 className="text-lg font-extrabold text-white">{vehicle.name}</h3>
          <p className="text-blue-200 text-sm">
            Seats up to {vehicle.capacityMax}
          </p>
        </div>
      </div>

      {/* Amenity bullets (from DB) or fall back to vehicle.highlights */}
      <ul className="text-blue-100/95 text-sm space-y-1 px-4 py-3 bg-[#0f2148]">
        {(amenityLabels ?? vehicle.highlights ?? []).slice(0, 3).map((txt) => (
          <li key={txt}>• {txt}</li>
        ))}
      </ul>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 p-3 bg-[#0f2148]">
          {images.slice(0, 3).map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`h-14 w-20 rounded-lg overflow-hidden border-2
                          ${
                            i === activeIdx
                              ? "border-blue-400"
                              : "border-blue-700/50"
                          }`}
            >
              {img.entry && (
                <OptimizedImage
                  entry={img.entry}
                  alt=""
                  className="h-full w-full object-cover"
                  minDesiredWidth={200}
                />
              )}
            </button>
          ))}
        </div>
      )}
      {/* Optional CTA placeholder to satisfy showCTA prop (render nothing if false) */}
      {showCTA && <div className="px-4 pb-4" />}
    </div>
  );
}

