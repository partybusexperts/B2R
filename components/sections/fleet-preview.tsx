import Link from "next/link";
import { cn } from "@/lib/utils";
import { FleetCard } from "./fleet-card";
import { Button } from "../ui/button";
import { VehicleData } from "@/lib/data/vehicles";
import { ArrowRight, Sparkles } from "lucide-react";

interface FleetPreviewProps {
  title?: string;
  viewAllLink?: string;
  vehicles?: VehicleData[];
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
    <section className={cn("relative overflow-hidden bg-[#0a1628]", sectionClassName)}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_50%)]" />
      
      <div className="relative py-12 md:py-16 max-w-7xl mx-auto px-4">
        {title && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 rounded-full bg-gradient-to-b from-blue-400 to-indigo-600" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {title}
              </h2>
            </div>

            {showNavigation && viewAllLink && (
              <Link
                href={viewAllLink}
                className="group inline-flex items-center gap-2 text-sm font-medium text-blue-300 hover:text-white transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle, idx) => (
            <div 
              key={vehicle.id}
              className="animate-fade-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <FleetCard
                vehicle={vehicle}
                cardLink={viewAllLink}
              />
            </div>
          ))}
        </div>

        {showNavigation && viewAllLink && (
          <div className="mt-8 text-center sm:hidden">
            <Button 
              asChild 
              className="w-full max-w-xs rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 
                text-white font-semibold
                shadow-[0_10px_30px_rgba(59,130,246,0.3)]
                hover:shadow-[0_15px_40px_rgba(59,130,246,0.4)]
                transition-all duration-300"
            >
              <Link href={viewAllLink}>
                <Sparkles className="w-4 h-4 mr-2" />
                View All
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
