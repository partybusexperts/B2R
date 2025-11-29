"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import type { HomepageVehicle } from "../types/homepageVehicles";
import type { ResolvedVehicle } from "../data/vehicles";

type VehicleCardVehicle = HomepageVehicle | ResolvedVehicle;

interface Props {
  vehicle: VehicleCardVehicle;
  amenityLabels?: string[];
  showCTA?: boolean;
  phoneDisplay?: string;
  phoneTel?: string;
  quoteHref?: string;
  cardHref?: string;
  highlightDetailCta?: boolean;
}

const CATEGORY_LABEL: Record<"party-buses" | "limousines" | "coach-buses", string> = {
  "party-buses": "Party Bus",
  "limousines": "Limo",
  "coach-buses": "Coach Bus",
};

const EXTRA_HIGHLIGHTS = [
  "Pro driver included",
  "BYOB friendly",
  "Hourly & flat-rate",
  "LED glow interior",
  "Chilled coolers",
  "Bluetooth sound",
  "VIP door service",
  "Privacy shades",
  "USB + outlets",
  "Premium sound",
];

const THUMB_LABELS = ["Current View", "Alt View", "Lounge"];

export default function VehicleGalleryCard({
  vehicle,
  amenityLabels,
  showCTA = true,
  phoneDisplay,
  phoneTel,
  quoteHref,
  cardHref,
  highlightDetailCta = false,
}: Props) {
  const capacity = vehicle.capacityMax ?? vehicle.capacityMin;
  const router = useRouter();
  const detailHref = getVehicleDetailHref(vehicle);
  const destinationHref = cardHref ?? detailHref;
  const clickable = Boolean(destinationHref);

  const fallbackAmenities = getVehicleAmenities(vehicle);
  const normalizedAmenities = normalizeAmenities(amenityLabels?.length ? amenityLabels : fallbackAmenities);
  const randomizedHighlights = pickAmenitySlice(EXTRA_HIGHLIGHTS, `${vehicle.id}-extras`, 4);
  const amenityPool = normalizedAmenities.length ? normalizedAmenities.concat(randomizedHighlights) : randomizedHighlights;
  const featuredAmenities = pickAmenitySlice(amenityPool, vehicle.id, 4);

  const capacityLabel = capacity
    ? capacity === vehicle.capacityMin || !vehicle.capacityMin
      ? `Seats up to ${capacity}`
      : `Seats ${vehicle.capacityMin}–${vehicle.capacityMax}`
    : "Capacity on request";


  const telDisplay = phoneDisplay ?? process.env.NEXT_PUBLIC_PRIMARY_PHONE_DISPLAY ?? "(888) 535-2566";
  const telNumber = phoneTel ?? process.env.NEXT_PUBLIC_PRIMARY_PHONE_TEL ?? "8885352566";
  const quoteTarget = quoteHref ?? "/free-instant-estimates";

  // --- gallery: main image + up to 2 thumbs from props ---
  const imageUrls = getVehicleImages(vehicle);

  const [activeIndex, setActiveIndex] = useState(0);
  const mainImage = imageUrls[activeIndex] ?? imageUrls[0] ?? null;
  const hasAltImage = imageUrls.length > 1;
  const altIndex = hasAltImage ? (activeIndex + 1) % imageUrls.length : null;
  const altImage = typeof altIndex === "number" ? imageUrls[altIndex] : null;

  useEffect(() => {
    setActiveIndex(0);
  }, [vehicle.id, imageUrls.length]);

  const handleCardNavigate = () => {
    if (!destinationHref) return;
    router.push(destinationHref);
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!clickable) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardNavigate();
    }
  };

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-blue-800/40 bg-gradient-to-b from-[#132a5d] to-[#0a1734] shadow-xl transition-transform duration-300 hover:-translate-y-1 hover:border-blue-500/60"
      onClick={clickable ? handleCardNavigate : undefined}
      onKeyDown={clickable ? handleCardKeyDown : undefined}
      role={clickable ? "link" : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      {/* TOP: main image */}
      <div className="w-full overflow-hidden rounded-t-3xl">
        <div className="relative h-64 w-full md:h-72 lg:h-80">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={vehicle.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#0c1a39] text-blue-100">{vehicle.name}</div>
          )}

          {/* overlay label */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">{CATEGORY_LABEL[vehicle.category]}</div>
            <h3 className="mt-1 text-2xl font-extrabold text-white">{vehicle.name}</h3>
            <p className="text-sm text-blue-200/90">{capacityLabel}</p>
          </div>
          {/* badges */}
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            <span className="rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
              Chauffeur Included
            </span>
          </div>

          {/* capacity pill */}
          <div className="absolute right-4 top-4 rounded-full bg-blue-600/90 px-3 py-1 text-xs font-bold uppercase text-white shadow-lg">
            {capacity ? `${capacity} Pax` : "Ask Us"}
          </div>

          {highlightDetailCta && destinationHref && (
            <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-end px-4">
              <a
                href={destinationHref}
                onClick={(event) => event.stopPropagation()}
                className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-emerald-300/80 bg-emerald-400/90 px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-wide text-slate-900 shadow-lg transition hover:bg-white animate-pulse"
              >
                Learn More!
              </a>
            </div>
          )}
        </div>

        <div className="border-t border-blue-900/60 bg-[#050d22]/95 px-4 pb-4 pt-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setActiveIndex(0);
              }}
              className="relative overflow-hidden rounded-2xl border border-blue-400 text-left shadow-sm transition ring-2 ring-blue-400/70"
            >
              <div className="relative w-full aspect-square">
                {mainImage ? (
                  <Image src={mainImage} alt={`${vehicle.name} current`} fill sizes="140px" className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#0b1533]/60 text-[10px] font-semibold uppercase tracking-wide text-blue-200/60">
                    Preview coming soon
                  </div>
                )}
              </div>
              <span className="pointer-events-none absolute left-2 bottom-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                {THUMB_LABELS[0]}
              </span>
            </button>

            {altImage ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveIndex(altIndex ?? 0);
                }}
                className="relative overflow-hidden rounded-2xl border border-blue-800/60 text-left shadow-sm transition hover:border-blue-500/70 hover:opacity-100"
              >
                <div className="relative w-full aspect-square">
                  <Image src={altImage} alt={`${vehicle.name} alternate view`} fill sizes="140px" className="object-cover" />
                </div>
                <span className="pointer-events-none absolute left-2 bottom-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  {THUMB_LABELS[1]}
                </span>
              </button>
            ) : (
              <div className="relative flex aspect-square items-center justify-center rounded-2xl border border-blue-900/40 bg-[#0b1533]/60 text-[10px] font-semibold uppercase tracking-wide text-blue-200/60" onClick={(event) => event.stopPropagation()}>
                More photos soon
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM: text + amenities + CTAs */}
      <div className="flex flex-1 flex-col gap-4 p-5 pt-4">
        <div className="rounded-2xl border border-blue-800/40 bg-[#0d1e40]/80 p-3 text-sm text-blue-100/90 shadow-inner min-h-[82px]">
          {featuredAmenities.length ? (
            <div className="flex flex-wrap gap-2">
              {featuredAmenities.map((label) => (
                <span key={label} className="rounded-full border border-blue-700/50 bg-blue-900/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100">
                  {label}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-blue-200/70 text-xs">Ask for the full amenities list—LED, sound, BYOB, and more available.</p>
          )}
        </div>

        {showCTA && (
          <div className="flex flex-col gap-2 pt-1 sm:flex-row">
            <a
              href={`tel:${telNumber}`}
              onClick={(event) => event.stopPropagation()}
              className="inline-flex flex-1 items-center justify-center rounded-xl border border-blue-300/60 bg-white/95 px-3 py-2 text-xs font-extrabold uppercase tracking-wide text-blue-900 shadow-md transition hover:shadow-lg"
            >
              Call · {telDisplay}
            </a>
            <a
              href={quoteTarget}
              onClick={(event) => event.stopPropagation()}
              className="inline-flex flex-1 items-center justify-center rounded-xl border border-blue-700 bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-xs font-extrabold uppercase tracking-wide text-white shadow-md transition hover:brightness-110"
            >
              Live Quote
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function getVehicleAmenities(vehicle: VehicleCardVehicle): string[] {
  if (isHomepageVehicle(vehicle)) {
    return vehicle.amenities ?? [];
  }
  if (isResolvedVehicle(vehicle)) {
    return vehicle.highlights ?? [];
  }
  return [];
}

function getVehicleImages(vehicle: VehicleCardVehicle): string[] {
  if (isHomepageVehicle(vehicle)) {
    return [vehicle.imageUrl, vehicle.secondaryImageUrl, vehicle.thirdImageUrl].filter(isNonEmptyString);
  }

  if (isResolvedVehicle(vehicle)) {
    const ordered = [vehicle.primary?.entry?.original ?? null, ...vehicle.images.map((img) => img.entry?.original ?? null)];
    return Array.from(new Set(ordered.filter(isNonEmptyString)));
  }

  return [];
}

function isHomepageVehicle(vehicle: VehicleCardVehicle): vehicle is HomepageVehicle {
  return "imageUrl" in vehicle;
}

function isResolvedVehicle(vehicle: VehicleCardVehicle): vehicle is ResolvedVehicle {
  return "images" in vehicle;
}

function isNonEmptyString(value: string | null | undefined): value is string {
  return typeof value === "string" && value.length > 0;
}

function normalizeAmenities(input: unknown): string[] {
  if (!input) return [];
  const arr = Array.isArray(input) ? input : [input];
  return arr
    .map((value) => (typeof value === "string" ? value.trim() : String(value)))
    .filter((value) => value.length > 0);
}

function pickAmenitySlice(values: string[], seed: number | string | undefined, count: number) {
  if (!values.length) return [];
  const normalizedSeed = typeof seed === "number" ? seed : Math.abs(hashString(String(seed ?? "")));
  const start = normalizedSeed % values.length;
  const doubled = [...values.slice(start), ...values.slice(0, start)];
  return Array.from(new Set(doubled)).slice(0, Math.min(count, values.length));
}

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function getVehicleDetailHref(vehicle: VehicleCardVehicle): string | undefined {
  const id = typeof vehicle.id === "string" ? vehicle.id.toLowerCase() : "";
  const name = (vehicle.name ?? "").toLowerCase();

  const idMatches = [
    "limo-chrysler-300-10",
    "limo-esc-10-chrysler",
    "10-passenger-white-chrysler-300-limo",
  ].some((needle) => id === needle);

  const nameMatchesChrysler300 = name.includes("chrysler 300");
  const mentionsTenPassenger = name.includes("10 passenger") || name.includes("10-passenger");
  const mentionsChryslerPage = name.includes("white chrysler") || name.includes("white limo") || name.includes("white stretch");
  const fuzzyMatch = nameMatchesChrysler300 && mentionsTenPassenger;

  if (idMatches || (fuzzyMatch && (mentionsChryslerPage || nameMatchesChrysler300))) {
    return "/vehicles/10-passenger-white-chrysler-300-limo";
  }

  return undefined;
}


