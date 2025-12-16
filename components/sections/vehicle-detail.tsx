"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Users, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toPublicStorageUrl } from "@/lib/helpers/storage";
import { VehicleData } from "@/types/vehicle.types";

export function VehicleDetail({ vehicle }: { vehicle: VehicleData }) {
  const [activeImage, setActiveImage] = React.useState(0);

  const images = React.useMemo(() => {
    return (vehicle.images || []).map((key) =>
      toPublicStorageUrl("vehicles1", key),
    );
  }, [vehicle.images]);

  const currentImage = images[activeImage] || "/placeholder-vehicle.jpg";

  return (
    <section className="bg-[#0E1F46]">
      <div className="max-w-6xl mx-auto">
        {/* 1. Header / Title Area */}
        <div className="border-b border-emerald-400/40 pb-6 pt-10 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <Badge
              variant="outline"
              className="text-xs font-semibold uppercase tracking-[0.22em]
                text-emerald-400 border-none mb-4"
            >
              {`Featured ${vehicle?.type?.replace("-", " ")}` || "Vehicle"}
            </Badge>
            <h1
              className="text-2xl md:text-5xl font-extrabold tracking-tight mb-6
                leading-tight"
            >
              {vehicle.name}
            </h1>
            <p
              className="text-2xl md:text-3xl text-primary-foreground/90
                font-medium max-w-3xl mb-4"
            >
              {vehicle.description ??
                `The ultimate ${vehicle?.type?.replace("-", " ") || "Vehicle"} experience for your group.`}
            </p>
            <Button
              className="rounded-full border border-emerald-400/40
                bg-emerald-400/10 px-4 py-2 font-semibold uppercase
                tracking-[0.3em] text-emerald-200 hover:border-emerald-400
                hover:bg-emerald-400/10"
            >
              View Gallery
            </Button>
          </div>
          <div className=""></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 py-12 mt-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            {/* 2. Gallery (Left / Top) */}
            <div className="lg:col-span-8 space-y-4">
              <div
                className="relative aspect-video rounded-3xl overflow-hidden
                  shadow-2xl bg-muted border-4 border-primary/20"
              >
                <Image
                  src={currentImage}
                  alt={vehicle.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={cn(
                        `relative h-20 w-32 shrink-0 rounded-xl overflow-hidden
                        border-2 transition-all`,
                        activeImage === idx
                          ? "border-primary ring-2 ring-primary/30"
                          : "border-transparent opacity-70 hover:opacity-100",
                      )}
                    >
                      <Image
                        src={img}
                        alt="Gallery thumbnail"
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Details & CTA (Right / Sidebar) */}
            <div className="lg:col-span-4 space-y-6">
              <Card
                className="p-6 md:p-8 rounded-3xl shadow-xl border-border/50
                  bg-card relative z-10"
              >
                <div className="space-y-6">
                  {/* Key Stats */}
                  <div className="grid gap-4">
                    <div
                      className="flex items-center gap-4 p-3 rounded-xl
                        bg-primary/10 text-primary"
                    >
                      <Users className="h-6 w-6" />
                      <div>
                        <p className="text-xs font-bold uppercase opacity-70">
                          Capacity
                        </p>
                        <p className="font-bold text-lg">
                          {vehicle.capacity || "Contact Us"}
                        </p>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-4 p-3 rounded-xl bg-muted
                        text-foreground"
                    >
                      <DollarSign className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-bold uppercase opacity-70">
                          Rate
                        </p>
                        <p className="font-bold text-lg">
                          {vehicle.price_hourly || "Custom Quote"}
                        </p>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-4 p-3 rounded-xl bg-muted
                        text-foreground"
                    >
                      <Clock className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-bold uppercase opacity-70">
                          Minimum
                        </p>
                        <p className="font-bold text-lg">
                          {vehicle.min_hours || 4} Hours
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {vehicle.description}
                  </p>

                  {/* Amenities List */}
                  {vehicle.amenities && (
                    <ul className="grid grid-cols-1 gap-2">
                      {vehicle.amenities.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-3 text-foreground
                            font-medium"
                        >
                          <Check className="h-5 w-5 text-success shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* CTAs */}
                  <div className="pt-4 space-y-3">
                    <Button
                      size="lg"
                      className="w-full h-14 text-lg font-bold rounded-xl
                        shadow-lg shadow-primary/25"
                      asChild
                    >
                      <Link href="/quote">Get Instant Quote</Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-12 font-bold rounded-xl"
                      asChild
                    >
                      <a href="tel:8885352566">Call (888) 535-2566</a>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
