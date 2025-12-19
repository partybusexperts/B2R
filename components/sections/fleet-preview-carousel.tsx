"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FleetCard } from "./fleet-card";
import { VehicleData } from "@/lib/data/vehicles";

interface FleetPreviewCarouselProps {
  title?: string;
  description?: string;
  viewAllLink?: string;
  vehicles: VehicleData[];
  showNavigation?: boolean;
}

export function FleetPreviewCarousel({
  title,
  description,
  viewAllLink = "#",
  vehicles = [],
  showNavigation = true,
}: FleetPreviewCarouselProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [isAtEnd, setIsAtEnd] = React.useState(false);
  const [isAtStart, setIsAtStart] = React.useState(true);

  // 2. Logic to detect if we are at the end
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;

      // Check start
      setIsAtStart(scrollLeft <= 10); // 10px buffer

      // Check end (allow 10px buffer for browser math inconsistencies)
      const atBottom = scrollLeft + clientWidth >= scrollWidth - 10;
      setIsAtEnd(atBottom);
    }
  };

  // 3. Initial check on mount/resize (MOVED BEFORE EARLY RETURN)
  React.useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, [vehicles]);

  if (!vehicles) return null;

  // 1. Scroll Handler
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth * 0.8;

      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-background py-16 md:py-24 relative">
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

        {/* Carousel Container */}
        <div className="relative group/carousel">
          {/* Left Arrow (Hidden if at start) */}
          <button
            onClick={() => scroll("left")}
            className={cn(
              `absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 z-30 hidden
              md:flex h-12 w-12 items-center justify-center rounded-full
              bg-background border border-border/50 shadow-xl text-foreground
              transition-all hover:bg-primary hover:text-primary-foreground
              focus:outline-none focus:ring-2 focus:ring-primary/50`,
              isAtStart ? "opacity-0 pointer-events-none" : "opacity-100",
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Right Arrow (Hidden if at end) */}
          <button
            onClick={() => scroll("right")}
            className={cn(
              `absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 z-30
              hidden md:flex h-12 w-12 items-center justify-center rounded-full
              bg-background border border-border/50 shadow-xl text-foreground
              transition-all hover:bg-primary hover:text-primary-foreground
              focus:outline-none focus:ring-2 focus:ring-primary/50`,
              isAtEnd ? "opacity-0 pointer-events-none" : "opacity-100",
            )}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Scrollable Track */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll} // 👈 Added Listener
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8
              -mx-4 px-4 md:px-0 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Left "View All" */}
            <div
              className="min-w-[15vw] shrink-0 snap-center flex items-center
                justify-center"
            >
              <Link
                href={viewAllLink}
                className="flex flex-col items-center gap-2
                  text-muted-foreground hover:text-primary transition-colors"
              >
                <div
                  className="h-16 w-16 rounded-full border-2 border-current flex
                    items-center justify-center"
                >
                  <ChevronLeft className="h-12 w-12 pr-1" />
                </div>
                <span className="font-bold">View All</span>
              </Link>
            </div>

            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="min-w-[85vw] md:min-w-[45vw] lg:min-w-[30vw] shrink-0
                  snap-center"
              >
                <FleetCard vehicle={vehicle} />
              </div>
            ))}

            {/* Right "View All" */}
            <div
              className="min-w-[15vw] shrink-0 snap-center flex items-center
                justify-center"
            >
              <Link
                href={viewAllLink}
                className="flex flex-col items-center gap-2
                  text-muted-foreground hover:text-primary transition-colors"
              >
                <div
                  className="h-16 w-16 rounded-full border-2 border-current flex
                    items-center justify-center"
                >
                  <ChevronRight className="h-12 w-12 pl-1" />
                </div>
                <span className="font-bold">View All</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile View All */}
        {showNavigation && (
          <div className="mt-4 text-center md:hidden">
            <Button asChild size="lg" className="w-full font-bold">
              <Link href={viewAllLink}>View All Fleet</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
