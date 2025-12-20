"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FleetCard } from "./fleet-card";
import { cn } from "@/lib/utils";
import { VehicleData } from "@/lib/data/vehicles";

interface FleetPreviewProps {
  title?: string;
  viewAllLink?: string;
  vehicles: VehicleData[];
  showNavigation?: boolean;
  sectionClassName?: string;
}

export function FleetPreview({
  title,
  viewAllLink,
  vehicles = [],
  showNavigation = true,
  sectionClassName,
}: FleetPreviewProps) {
  if (!vehicles) return null;

  return (
    <section className={cn("bg-[#0E1F46]", sectionClassName)}>
      <div className="py-16 md:py-24 max-w-7xl mx-auto">
        {/* Header Section */}
        {title && (
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-white">{title}</h2>

            {showNavigation && viewAllLink && (
              <Link
                href={viewAllLink}
                className="text-blue-400 hover:underline font-semibold"
              >
                View all →
              </Link>
            )}
          </div>
        )}

        {/* Grid Layout (3 Columns) */}
        <div className="relative">
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <FleetCard
                key={vehicle.id}
                vehicle={vehicle}
                cardLink={viewAllLink}
              />
            ))}
          </div>

          {viewAllLink && (
            <>
              <Link
                href={viewAllLink}
                aria-label={`View all ${title ?? "fleet"} vehicles`}
                className="hidden md:flex absolute left-[-3rem] top-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white/70 bg-white/20 p-3 text-white shadow-2xl transition hover:border-white hover:bg-white/30 focus-visible:outline-none focus-visible:ring focus-visible:ring-white/80 h-16 w-16 text-2xl"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <Link
                href={viewAllLink}
                aria-label={`View all ${title ?? "fleet"} vehicles`}
                className="hidden md:flex absolute right-[-3rem] top-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white/70 bg-white/20 p-3 text-white shadow-2xl transition hover:border-white hover:bg-white/30 focus-visible:outline-none focus-visible:ring focus-visible:ring-white/80 h-16 w-16 text-2xl"
              >
                <ArrowRight className="h-6 w-6" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile "View All" Button (Only shows on small screens) */}
        {showNavigation && viewAllLink && (
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
