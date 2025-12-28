"use client";

import { toPublicStorageUrl } from "@/lib/helpers/storage";
import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { Phone, Sparkles, Users, ChevronRight } from "lucide-react";
import { VehicleData } from "@/lib/data/vehicles";
import { openLiveChat } from "@/lib/livechat";

function hashStringToSeed(input: string): number {
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

const vehicleNameMap: Record<string, string> = {
  limo: "Limousine",
  "stretch-limo": "Stretch Limo",
  "party-bus": "Party Bus",
  "party-bus-lux": "Luxury Party Bus",
  coach: "Coach Bus",
  "coach-bus": "Coach Bus",
  sprinter: "Sprinter Van",
  "sprinter-van": "Sprinter Van",
  sedan: "Luxury Sedan",
  suv: "SUV",
};

const typeGradients: Record<string, string> = {
  limo: "from-amber-500 via-yellow-400 to-amber-500",
  "stretch-limo": "from-amber-500 via-yellow-400 to-amber-500",
  "party-bus": "from-pink-500 via-purple-500 to-blue-500",
  "party-bus-lux": "from-pink-500 via-fuchsia-500 to-purple-500",
  coach: "from-emerald-500 via-teal-400 to-emerald-500",
  "coach-bus": "from-emerald-500 via-teal-400 to-emerald-500",
  sprinter: "from-sky-500 via-cyan-400 to-sky-500",
  "sprinter-van": "from-sky-500 via-cyan-400 to-sky-500",
  sedan: "from-slate-500 via-gray-400 to-slate-500",
  suv: "from-indigo-500 via-violet-400 to-indigo-500",
};

function getVehicleLabel(type: string): string {
  return vehicleNameMap[type] || type.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function getVehicleGradient(type: string): string {
  if (typeGradients[type]) return typeGradients[type];
  if (type.includes("limo")) return typeGradients["limo"];
  if (type.includes("party") || type.includes("bus")) return typeGradients["party-bus"];
  if (type.includes("coach")) return typeGradients["coach"];
  if (type.includes("sprinter") || type.includes("van")) return typeGradients["sprinter"];
  return typeGradients["party-bus"];
}

interface FleetCardProps {
  vehicle: VehicleData;
  cardLink?: string;
}

export function FleetCard({ vehicle, cardLink }: FleetCardProps) {
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  const images = React.useMemo(() => {
    if (!vehicle?.images || vehicle.images.length === 0)
      return ["/placeholder-vehicle.jpg"];
    return vehicle.images.map((key) => toPublicStorageUrl("vehicles1", key));
  }, [vehicle]);

  const activeImage = images[activeImageIndex] ?? images[0];

  const features = React.useMemo(() => {
    const fallbackAmenities = [
      "Pro Driver",
      "Bluetooth",
      "Hourly Rates",
      "BYOB Friendly",
    ];
    const amenities = vehicle.amenities?.slice(0, 4) || fallbackAmenities;
    return stableShuffle(amenities, `${vehicle.id}-amenities`);
  }, [vehicle.amenities, vehicle.id]);

  const vehicleType = vehicle.type || "party-bus";
  const typeGradient = getVehicleGradient(vehicleType);
  const vehicleLabel = getVehicleLabel(vehicleType);

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl
        bg-gradient-to-b from-slate-900/95 to-slate-950
        border border-white/10 shadow-2xl
        transition-all duration-500 
        hover:border-white/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={activeImage}
          alt={vehicle.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={90}
          priority={false}
          className={cn(
            "object-cover transition-all duration-700",
            isHovered && "scale-110"
          )}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        <div className="absolute top-3 left-3 z-10">
          <div className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
            "bg-gradient-to-r", typeGradient, "text-white shadow-lg"
          )}>
            {vehicleLabel}
          </div>
        </div>

        {vehicle.capacity && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/20">
            <Users className="w-3 h-3 text-white/80" />
            <span className="text-xs font-semibold text-white">
              {vehicle.capacity.replace(" pax", "")}
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">
            {vehicle.name}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {features.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium
                  bg-white/10 backdrop-blur-sm text-white/90 border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <Link
          href={cardLink || `/vehicles/${vehicle.slug}`}
          className="absolute inset-0 z-0"
          aria-label={`View ${vehicle.name}`}
        />
      </div>

      {images.length > 1 && (
        <div className="px-3 py-2 bg-slate-950/80 border-t border-white/5">
          <div className="flex gap-2">
            {images.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={cn(
                  "relative flex-1 aspect-[4/3] rounded-lg overflow-hidden transition-all duration-300",
                  activeImageIndex === idx
                    ? "ring-2 ring-white/60 scale-[1.02]"
                    : "opacity-60 hover:opacity-100"
                )}
              >
                <Image
                  src={img}
                  alt={`View ${idx + 1}`}
                  fill
                  sizes="80px"
                  quality={75}
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 pt-3 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 rounded-lg border-white/20 bg-white/5 text-white text-xs font-semibold
            hover:bg-white hover:text-slate-900 transition-all"
          asChild
        >
          <a href="tel:8885352566">
            <Phone className="w-3 h-3 mr-1.5" />
            Call Now
          </a>
        </Button>
        <Button
          size="sm"
          className={cn(
            "flex-1 rounded-lg text-xs font-bold bg-gradient-to-r cursor-pointer",
            typeGradient,
            "text-white border-0 hover:brightness-110 transition-all"
          )}
          onClick={() => openLiveChat(`Fleet Card - ${vehicle.name}`, `/vehicles/${vehicle.slug}`)}
        >
          <Sparkles className="w-3 h-3 mr-1.5" />
          Get Quote
          <ChevronRight className="w-3 h-3 ml-0.5" />
        </Button>
      </div>
    </div>
  );
}
