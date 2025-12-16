"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VehicleData } from "@/types/vehicle.types";
import { FleetCard } from "./fleet-card";

interface FleetPreviewProps {
  title?: string;
  viewAllLink?: string;
  vehicles: VehicleData[];
  showNavigation?: boolean;
}

export function FleetPreview({
  title,
  viewAllLink,
  vehicles = [],
  showNavigation = true,
}: FleetPreviewProps) {
  if (!vehicles || vehicles.length === 0) return null;

  return (
    <section className="bg-[#0E1F46]">
      <div className="bg-[#0E1F46] py-16 md:py-24 max-w-7xl mx-auto">
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
