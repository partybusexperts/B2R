"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toPublicStorageUrl } from "@/lib/helpers/storage";
import { VehicleData } from "@/types/vehicle.types";
import { cn } from "@/lib/utils";

interface FleetCardProps {
  vehicle: VehicleData;
}

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

export function FleetCard({ vehicle }: FleetCardProps) {
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

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border
        border-border/50 bg-card shadow-lg transition-all
        hover:border-primary/50 hover:shadow-xl"
    >
      {/* Top Section: Main Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
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
            className="bg-white/90 text-xs font-bold text-black backdrop-blur-sm
              hover:bg-white"
          >
            CHAUFFEUR INCLUDED
          </Badge>
        </div>

        {vehicle.capacity && (
          <div className="absolute right-3 top-3 z-10">
            <Badge
              className="bg-primary px-3 py-1 text-xs font-bold text-background
                hover:bg-primary/90"
            >
              {vehicle.capacity}
            </Badge>
          </div>
        )}

        <div className="absolute right-3 bottom-3 z-10">
          <Button
            asChild
            className="bg-primary rounded-xl px-6 py-1 text-sm font-bold
              text-background hover:bg-primary/90"
          >
            <Link href={`/vehicles/${vehicle.slug}`}>Learn more</Link>
          </Button>
        </div>

        {/* Link overlay for entire image area */}
        <Link
          href={`/vehicles/${vehicle.slug}`}
          className="absolute inset-0 z-0"
          aria-label={`View ${vehicle.name}`}
        />
      </div>

      {/* Bottom Section: Details */}
      <div className="flex flex-1 flex-col p-5">
        {/* Title & Subtitle */}
        <div className="mb-6">
          <Link href={`/vehicles/${vehicle.slug}`} className="block">
            <h3
              className="mb-1 text-xl font-extrabold leading-tight
                text-foreground transition-colors group-hover:text-primary"
            >
              {vehicle.name}
            </h3>
          </Link>
          <p className="text-sm font-medium text-muted-foreground">
            Seats up to {vehicle.capacity?.replace(" pax", "") || "?"}{" "}
            passengers
          </p>
        </div>

        {/* Thumbnails Row (Mini Gallery) */}
        {images.length > 1 && (
          <div className="mb-6 grid grid-cols-2 gap-3">
            {images.slice(0, 2).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={cn(
                  `relative h-24 overflow-hidden rounded-lg border-2
                  transition-all`,
                  activeImageIndex === idx
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent opacity-70 hover:opacity-100",
                )}
              >
                <Image
                  src={img}
                  alt={`View ${idx}`}
                  fill
                  className="object-cover"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 bg-black/60 py-1
                    text-center text-[10px] font-bold uppercase text-white
                    backdrop-blur-[2px]"
                >
                  {idx === 0 ? "Current View" : "Alt View"}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Feature Tags Grid */}
        <div className="mb-6 mt-auto grid grid-cols-2 gap-2">
          {features.map((tag, i) => (
            <div
              key={i}
              className="flex items-center justify-center rounded-md
                bg-accent/50 px-2 py-2 text-center text-[10px] font-bold
                uppercase text-accent-foreground/80 md:text-xs"
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="w-full border-border bg-background font-bold
              hover:bg-accent hover:text-accent-foreground"
            asChild
          >
            <a href="tel:8885352566">
              <Phone className="mr-2 h-3 w-3" /> Call
            </a>
          </Button>
          <Button
            className="w-full bg-primary font-bold text-white
              hover:bg-primary/90"
            asChild
          >
            <Link href={`/vehicles/${vehicle.slug}`}>Live Quote</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- 2. MAIN CONTAINER COMPONENT ---
interface FleetPreviewProps {
  title?: string;
  description?: string;
  viewAllLink?: string;
  vehicles: VehicleData[];
  showNavigation?: boolean;
}

export function FleetPreview({
  title,
  description,
  viewAllLink = "#",
  vehicles = [],
  showNavigation = true,
}: FleetPreviewProps) {
  if (!vehicles || vehicles.length === 0) return null;

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        {title && (
          <div
            className="mb-12 flex flex-col items-start justify-between gap-4
              md:flex-row md:items-end"
          >
            <div className="max-w-2xl space-y-4">
              <h2
                className="text-3xl font-extrabold tracking-tight
                  text-foreground md:text-4xl lg:text-5xl"
              >
                {title}
              </h2>
              {description && (
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {description}
                </p>
              )}
            </div>

            {showNavigation && (
              <Button
                asChild
                variant="ghost"
                className="group hidden gap-2 text-base font-bold text-primary
                  hover:bg-primary/10 md:inline-flex"
              >
                <Link href={viewAllLink}>
                  View All Fleet{" "}
                  <ChevronRight
                    className="h-4 w-4 transition-transform
                      group-hover:translate-x-1"
                  />
                </Link>
              </Button>
            )}
          </div>
        )}

        {/* Grid Layout (3 Columns) */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <FleetCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {/* Mobile "View All" Button (Only shows on small screens) */}
        {showNavigation && (
          <div className="mt-12 text-center md:hidden">
            <Button asChild size="lg" className="w-full font-bold">
              <Link href={viewAllLink}>View All Fleet</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
