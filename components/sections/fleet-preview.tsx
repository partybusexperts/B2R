"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
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

        {/* Grid Layout (3 Columns) */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <FleetCard
              key={vehicle.id}
              vehicle={vehicle}
              cardLink={viewAllLink}
            />
          ))}
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
