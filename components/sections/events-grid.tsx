import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EventCard } from "./events-card";
import { shuffle } from "@/lib/utils";
import { getEvents } from "@/lib/data/events";

export async function EventsGrid() {
  // 1. Fetch events
  // We fetch a batch (e.g., 20) to ensure we have enough to randomize effectively
  const events = await getEvents();

  if (!events || events.length === 0) return null;

  // 2. Randomize and Pick 6
  // This runs on the server on every request (if dynamic) or build (if static).
  // For a homepage, sticking to Next.js default caching is usually fine,
  // but if you want true random on refresh, you might need `export const revalidate = 0` in page.tsx
  const displayEvents = shuffle(events).slice(0, 6);

  return (
    <section className="py-20 md:py-24 bg-muted/30 border-b border-border/40">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2
            className="text-3xl md:text-4xl font-extrabold tracking-tight
              text-foreground"
          >
            Upcoming Events & Experiences
          </h2>
          <p className="text-lg text-muted-foreground">
            Don{"'"}t miss out on the action. Book your ride for the hottest
            concerts, games, and festivals in town.
          </p>
        </div>

        {/* The Grid: 1 col mobile, 2 tablet, 3 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* "See More" Footer */}
        <div className="mt-12 text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-xl px-8 font-bold border-primary/20
              hover:bg-primary/5 hover:text-primary transition-colors"
          >
            <Link href="/events">See More Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
