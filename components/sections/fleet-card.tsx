"use client";

import { toPublicStorageUrl } from "@/lib/helpers/storage";
import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Phone } from "lucide-react";
import { VehicleData } from "@/lib/data/vehicles";

function hashStringToSeed(input: string): number {
  // Deterministic 32-bit hash (FNV-1a)
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function stableShuffle<T>(items: T[], seedKey: string): T[] {
  const rng = mulberry32(hashStringToSeed(seedKey));
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const vehicleNameMap = {
  limo: "Limousine",
  "party-bus": "Party Bus",
  coach: "Coach Bus",
} as const;

interface FleetCardProps {
  vehicle: VehicleData;
  cardLink?: string;
}

export function FleetCard({ vehicle, cardLink }: FleetCardProps) {
  // Local state to toggle between main view and alt view (if available)
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);

  // Memoize images to ensure valid URLs
  const images = React.useMemo(() => {
    if (!vehicle?.images || vehicle.images.length === 0)
      return ["/placeholder-vehicle.jpg"];
    return vehicle.images.map((key) => toPublicStorageUrl("vehicles1", key));
  }, [vehicle]);

  const activeImage = images[activeImageIndex] ?? images[0];

  // Show 4 shuffled features
  const features = React.useMemo(() => {
    const fallbackAmenities = [
      "Pro Driver",
      "Bluetooth",
      "Hourly Rates",
      "BYOB Friendly",
    ];
    const amenities = vehicle.amenities?.slice(0, 4) || fallbackAmenities;
    // NOTE: This component is SSR-ed then hydrated. Any non-determinism
    // (like Math.random) will cause hydration mismatches.
    return stableShuffle(amenities, `${vehicle.id}-amenities`);
  }, [vehicle.amenities, vehicle.id]);

  const fleetPageLink = cardLink || `/vehicles/${vehicle.slug}`;
  const fleetLabel = vehicle.type
    ? `${vehicleNameMap[vehicle.type]} Fleet`
    : "Fleet";

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-3xl border
        border-blue-800/40 bg-gradient-to-b from-[#132a5d] to-[#0a1734]
        shadow-xl transition-transform duration-300 hover:-translate-y-1
        hover:border-blue-500/60"
    >
      {/* Top Section: Main Image */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden bg-muted
          rounded-t-3xl"
      >
        <Image
          src={activeImage}
          alt={vehicle.name}
          fill
          className="object-cover transition-transform duration-700
            group-hover:scale-105"
        />

        {/* Overlay Badges */}
        <div className="absolute left-3 top-3 z-10">
          <Badge
            className="rounded-full border border-white/40 bg-white/10 px-3 py-1
              text-xs font-semibold uppercase tracking-wide text-white
              backdrop-blur hover:bg-white/10"
          >
            CHAUFFEUR INCLUDED
          </Badge>
        </div>

        {vehicle.capacity && (
          <Badge
            className="absolute right-4 top-4 rounded-full bg-blue-600/90 px-3
              py-1 text-xs font-bold uppercase text-white shadow-lg"
          >
            {vehicle.capacity.toUpperCase()}
          </Badge>
        )}

        <div className="absolute right-3 bottom-3 z-10">
          <Button asChild className="text-sm font-bold text-white h-8">
            <Link
              href={cardLink || `/vehicles/${vehicle.slug}`}
              className="pointer-events-auto inline-flex items-center gap-2
                rounded-full border border-emerald-300/80 bg-emerald-400/90 px-4
                py-1.5 text-[0.7rem] font-bold uppercase tracking-wide
                text-slate-900 shadow-lg transition hover:bg-white
                animate-pulse"
            >
              Learn more!
            </Link>
          </Button>
        </div>

        {/* Link overlay for entire image area */}
        <Link
          href={cardLink || `/vehicles/${vehicle.slug}`}
          className="absolute inset-0 z-0"
          aria-label={`View ${vehicle.name}`}
        />

        {/* Overlay for Title and Capacity */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0
            bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4"
        >
          {vehicle.type && (
            <div
              className="text-xs font-semibold uppercase tracking-[0.2em]
                text-blue-200"
            >
              {vehicleNameMap[vehicle.type]}
            </div>
          )}
          <h3 className="mt-1 text-xl font-extrabold text-white">
            {vehicle.name}
          </h3>
          <p className="text-sm text-blue-200/90">
            Seats up to {vehicle.capacity?.replace(" pax", "") || "?"}{" "}
            passengers
          </p>
        </div>
      </div>

      {/* Middle Section: Thumbnails Row (Mini Gallery) */}
      <div
        className="border-t border-blue-900/60 bg-[#050d22]/95 px-4 pb-4 pt-3"
      >
        {images.length > 1 && (
          <div className="grid grid-cols-2 gap-3">
            {images.slice(0, 2).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={cn(
                  `relative aspect-square w-full overflow-hidden rounded-lg
                  border-2 transition-all`,
                  activeImageIndex === idx
                    ? `relative overflow-hidden rounded-2xl border
                      border-blue-400 text-left shadow-sm transition ring-2
                      ring-blue-400/70`
                    : `relative overflow-hidden rounded-2xl border
                      border-blue-800/60 text-left shadow-sm transition
                      hover:border-blue-500/70 hover:opacity-100`,
                )}
              >
                <Image
                  src={img}
                  alt={`View ${idx}`}
                  fill
                  className="object-cover"
                />
                <div
                  className="pointer-events-none absolute left-2 bottom-2
                    rounded-full bg-black/70 px-2 py-0.5 text-[10px]
                    font-semibold uppercase tracking-wide text-white"
                >
                  {idx === 0 ? "Current View" : "Alt View"}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Section: Details */}
      <div className="flex flex-1 flex-col p-5 justify-between">
        {/* Feature Tags Grid */}
        <Link
          href={fleetPageLink}
          aria-label={`Browse the ${fleetLabel}`}
          className="group focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-blue-400 focus-visible:ring-offset-2"
        >
          <div
            className="rounded-2xl border border-blue-800/40 bg-[#0d1e40]/80 p-3
              mb-6 text-sm text-blue-100/90 shadow-inner"
          >
            <div className="mt-auto grid grid-cols-2 gap-2 text-center">
              {features.map((tag, i) => (
                <div
                  key={`${tag}-${i}`}
                  className="truncate rounded-full border border-blue-700/50
                    bg-blue-900/40 px-3 py-1 text-xs font-semibold uppercase
                    tracking-wide text-blue-100"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </Link>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="inline-flex flex-1 items-center justify-center rounded-xl
              border border-blue-300/60 bg-white/95 px-3 py-2 text-xs
              font-extrabold uppercase tracking-wide text-blue-900 shadow-md
              transition hover:shadow-lg"
            asChild
          >
            <a href="tel:8885352566">
              <Phone className="mr-2 h-3 w-3" /> Call
            </a>
          </Button>
          <Button
            className="inline-flex flex-1 items-center justify-center rounded-xl
              border border-blue-700 bg-gradient-to-r from-blue-600
              to-indigo-600 px-3 py-2 text-xs font-extrabold uppercase
              tracking-wide text-white shadow-md transition
              hover:brightness-110"
            asChild
          >
            <Link href={cardLink || `/vehicles/${vehicle.slug}`}>
              Live Quote
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
