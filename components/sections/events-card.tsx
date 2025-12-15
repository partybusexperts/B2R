"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRandomImage } from "@/lib/helpers/storage";
import { EventData } from "@/lib/data/events";

export function EventCard({ event }: { event: EventData }) {
  const eventDate = event.date_range
    ? new Date(event.date_range).toLocaleDateString()
    : "Upcoming";

  return (
    <Card
      className="group h-full flex flex-col overflow-hidden isolate
        border-border/50 bg-card transition-all duration-300 hover:shadow-lg
        hover:-translate-y-1 relative pt-0"
    >
      {/* Image Header */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted
        rounded-t-lg">
        <Image
          src={getRandomImage(event.images, "Events1")}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500
            group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge
            variant="secondary"
            className="bg-background/80 backdrop-blur text-foreground
              font-semibold shadow-sm"
          >
            {event.category || "Event"}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardHeader className="p-5 pb-2">
        <div
          className="flex items-center gap-2 text-xs font-medium text-primary
            mb-2"
        >
          <CalendarDays className="h-3.5 w-3.5" />
          <span>{eventDate}</span>
        </div>
        <h3
          className="font-bold text-xl leading-tight text-foreground
            line-clamp-2 group-hover:text-primary transition-colors"
        >
          <Link href={`/events/${event.slug}`} className="focus:outline-none">
            {/* Absolute overlay for card clickability, excluding buttons */}
            <span className="absolute inset-0 z-10" aria-hidden="true" />
            {event.title}
          </Link>
        </h3>
      </CardHeader>

      <CardContent className="p-5 pt-2 flex-1">
        <p
          className="text-muted-foreground text-sm line-clamp-3 leading-relaxed"
        >
          {event.description}
        </p>
      </CardContent>

      {/* Footer / Actions */}
      <CardFooter className="p-5 pt-0 flex gap-3 relative z-20">
        <Button
          asChild
          className="flex-1 font-bold rounded-xl"
          variant="default"
        >
          <Link href="/quote">Live Quote</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="flex-1 font-bold rounded-xl"
        >
          <Link href={`/events/${event.slug}`}>Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
