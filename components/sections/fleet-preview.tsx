"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FleetCard } from "./fleet-card";
import { cn } from "@/lib/utils";
import { VehicleData } from "@/lib/data/vehicles";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
    <section className={cn("bg-[#0E1F46] px-4", sectionClassName)}>
      <div className="py-16 md:py-24 max-w-7xl mx-auto">
        {/* Header Section */}
        {title && (
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl md:text-3xl font-bold text-white">
              {title}
            </h2>

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

        {/* Grid Layout (3 Columns) with floating nav arrows */}
        <div className="relative">
          {/* Left / Right Nav - centered vertically, floating over cards */}
          {viewAllLink && (
            <div className="hidden md:block">
              <Button
                aria-label="Previous"
                asChild
                className="absolute -left-14 top-1/2 z-50 -translate-y-1/2
                  rounded-full shadow-md bg-white/5 border border-white/10
                  text-white hover:bg-white/10 h-12 w-12"
              >
                <Link href={viewAllLink}>
                  <ArrowLeft className="size-6" />
                </Link>
              </Button>

              <Button
                aria-label="Next"
                asChild
                className="absolute -right-14 top-1/2 z-50 -translate-y-1/2
                  rounded-full p-2 shadow-md bg-white/5 border border-white/10
                  text-white hover:bg-white/10 h-12 w-12"
              >
                <Link href={viewAllLink}>
                  <ArrowRight className="size-6" />
                </Link>
              </Button>
            </div>
          )}

          {/* Actual Grid */}
          <div
            className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} data-fleet-card>
                <FleetCard vehicle={vehicle} cardLink={viewAllLink} />
              </div>
            ))}
          </div>
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
