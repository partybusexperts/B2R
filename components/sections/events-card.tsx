"use client";

import Image from "next/image";
import Link from "next/link";
import {
  // CalendarDays,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRandomImage } from "@/lib/helpers/storage";
import { EventData } from "@/lib/data/events";
// import { Badge } from "@/components/ui/badge";

export function EventCard({ event }: { event: EventData }) {
  // const eventDate = event.date_range
  //   ? new Date(event.date_range).toLocaleDateString()
  //   : "Upcoming";

  const relatedPollCategory = (event.slug || event.category || "").trim();

  return (
    <Card
      className="group relative isolate flex h-full flex-col overflow-hidden
        rounded-[32px] border border-blue-500/20 bg-[#0E1F46]
        shadow-[0_18px_60px_rgba(3,7,18,0.45)] transition-all duration-300
        hover:-translate-y-1"
    >
      {/* Image */}
      <div className="p-6 pb-0">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image
            src={getRandomImage(event.images, "Events1")}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-700
              group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />

          {/* Category badge */}
          {/* <div className="absolute left-4 top-4">
            <Badge
              className="rounded-full border border-white/25 bg-white/10 px-3
                py-1 text-[11px] font-bold uppercase tracking-wide text-white
                backdrop-blur"
            >
              {event.category || "Event"}
            </Badge>
          </div> */}
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col px-8 pb-8 pt-2 text-center">
        {/* Date line (kept, subtle) */}
        {/* <div
          className="mb-3 flex items-center justify-center gap-2 text-xs
            font-semibold text-white/70"
        >
          <CalendarDays className="h-3.5 w-3.5" />
          <span>{eventDate}</span>
        </div> */}

        {/* Title (links to details) */}
        <h3
          className="font-serif text-4xl font-extrabold tracking-tight
            text-white leading-none"
        >
          <Link
            href={`/events/${event.slug}`}
            className="focus:outline-none hover:opacity-95"
          >
            {event.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="mt-5 text-base leading-relaxed text-white/75 line-clamp-4">
          {event.description}
        </p>

        {/* Actions */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Button
            asChild
            className="h-12 w-full rounded-full bg-primary font-bold
              text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/quote">Quote</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-12 w-full rounded-full border-white/30 bg-white/95
              font-bold text-[#04132d] hover:bg-white"
          >
            <a href="tel:8885352566">
              <Phone className="mr-2 h-4 w-4" /> (888) 535-2566
            </a>
          </Button>

          <Button
            asChild
            className="h-12 w-full rounded-full bg-primary font-bold
              text-primary-foreground hover:bg-primary/90"
          >
            <a href="mailto:info@bus2ride.com">
              <Mail className="mr-2 h-4 w-4" /> Email
            </a>
          </Button>

          <Button
            asChild
            className="h-12 w-full rounded-full bg-primary font-bold
              text-primary-foreground hover:bg-primary/90"
          >
            <Link
              href={
                relatedPollCategory
                  ? `/polls?category=${encodeURIComponent(relatedPollCategory)}`
                  : "/polls"
              }
            >
              Related Polls
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
