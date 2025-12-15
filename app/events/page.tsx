import Hero from "@/components/layout/hero";
import { EventCard } from "@/components/sections/events-card";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { getEvents } from "@/lib/data/events";
import { getReviews } from "@/lib/data/reviews";
import FleetSection from "@/components/sections/fleet-section";

export default async function EventsPage() {
  const events = (await getEvents()) ?? [];
  const reviews = (await getReviews()) ?? [];

  return (
    <main>
      <Hero slug="events" />

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight
                text-foreground"
            >
              All Upcoming Events
            </h2>
            <p className="text-lg text-muted-foreground">
              Browse our curated list of events and book your ride today.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      <ReviewsSection reviews={reviews} />
      <PollsGrid category="events" />

      <FleetSection />
      {/* <FleetList title="Our Fleet" vehicles={fleet} /> */}

      <ToolsGrid category="events" />

      <FaqSection category="events" title="Events FAQs" />
    </main>
  );
}
