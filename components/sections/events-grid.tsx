import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EventCard } from "./events-card";
import { capitalize, shuffle } from "@/lib/utils";
import { getEvents } from "@/lib/data/events";

interface EventsGridProps {
  category?: string;
}

export async function EventsGrid({ category }: EventsGridProps) {
  // 1. Fetch events
  // We fetch a batch (e.g., 20) to ensure we have enough to randomize effectively
  const events = await getEvents();

  if (!events) return null;

  // 2. Randomize and Pick 6
  // This runs on the server on every request (if dynamic) or build (if static).
  // For a homepage, sticking to Next.js default caching is usually fine,
  // but if you want true random on refresh, you might need `export const revalidate = 0` in page.tsx
  const displayEvents = shuffle(events).slice(0, 6);

  return (
    <section className="py-20 md:py-24 w-full bg-[#122a56] px-4">
      <div className="w-full max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm uppercase tracking-[0.2em] text-blue-200">
            {category && capitalize(category)} Event Playbook
          </p>
          <h2
            className="mt-2 text-4xl font-extrabold text-white font-serif
              tracking-tight"
          >
            6 rotating nights we book every week
          </h2>
          <p className="mt-3 text-blue-100/90">
            These cards rotate on every refresh so you always see fresh
            inspiration from the party bus calendar.
          </p>
        </div>

        {/* The Grid: 1 col mobile, 2 tablet, 3 desktop */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* "See More" Footer */}
        <div className="mt-12 text-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="inline-flex items-center justify-center rounded-full
              bg-white/95 px-9 py-4 text-md font-semibold text-[#04132d]
              shadow-[0_15px_40px_rgba(10,27,54,0.35)] transition
              hover:translate-y-0.5 hover:bg-white"
          >
            <Link href="/events">See more events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
