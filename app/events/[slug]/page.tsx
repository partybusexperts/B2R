import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { getReviews } from "@/lib/data/reviews";
import { getEventBySlug } from "@/lib/data/events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin, Ticket } from "lucide-react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getRandomImage } from "@/lib/helpers/storage";
import FleetSection from "@/components/sections/fleet-section";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) return notFound();

  const reviews = (await getReviews()) ?? [];

  const eventDate = event.date_range
    ? new Date(event.date_range).toLocaleDateString()
    : "Upcoming";

  return (
    <main>
      {/* Custom Hero for Event */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        <Image
          src={getRandomImage(event.images, "Events1")}
          alt={event.title}
          fill
          className="object-cover opacity-95"
          priority
        />
        <div className="absolute inset-0" />
        <div
          className="absolute inset-0 bg-gradient-to-t from-background
            via-background/40 to-transparent"
        />

        <div className="absolute bottom-0 left-0 right-0 pb-16 md:pb-24">
          <div className="container mx-auto px-4 md:px-6">
            <Badge
              className="mb-6 bg-primary text-primary-foreground
                hover:bg-primary/90 px-4 py-1 text-sm"
            >
              {event.category ?? "Event"}
            </Badge>
            <h1
              className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6
                leading-tight text-foreground max-w-4xl"
            >
              {event.title}
            </h1>
            <div
              className="flex flex-wrap items-center gap-6 text-foreground/80
                text-lg font-medium"
            >
              <span className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                {eventDate}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                City Center & Venues
              </span>
            </div>
          </div>
        </div>
      </div>
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8">
              <Button
                variant="ghost"
                asChild
                className="pl-0 hover:pl-2 transition-all gap-2
                  text-muted-foreground hover:text-primary mb-4"
              >
                <Link href="/events">
                  <ArrowLeft className="h-4 w-4" /> Back to Events
                </Link>
              </Button>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h2 className="text-3xl font-bold mb-4">About This Event</h2>
                <p
                  className="text-xl leading-relaxed text-muted-foreground mb-8"
                >
                  {event.description}
                </p>
                <p>
                  Make your {event.title} experience unforgettable with luxury
                  transportation. Avoid parking hassles, designated driver
                  worries, and traffic stress. Our fleet is perfect for groups
                  of all sizes heading to this event.
                </p>
                <h3>Why Book With Us?</h3>
                <ul>
                  <li>Door-to-door service</li>
                  <li>Professional chauffeurs</li>
                  <li>Premium sound systems to get the party started</li>
                  <li>BYOB allowed on board</li>
                </ul>
              </div>
            </div>

            {/* TODO: quick planner */}
            {/* Sidebar CTA */}
            <div className="lg:col-span-4 space-y-6">
              <div
                className="bg-card border border-border/50 rounded-3xl p-8
                  shadow-lg sticky top-24"
              >
                <h3 className="text-2xl font-bold mb-2">Ride in Style</h3>
                <p className="text-muted-foreground mb-6">
                  Don&apos;t wait until the last minute. Vehicles sell out fast
                  for major events.
                </p>

                <div className="space-y-4">
                  <Button
                    size="lg"
                    className="w-full font-bold text-lg h-14 rounded-xl"
                    asChild
                  >
                    <Link href="/quote">Get Instant Quote</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full font-bold h-12 rounded-xl"
                    asChild
                  >
                    <a href="tel:8885352566">Call (888) 535-2566</a>
                  </Button>
                </div>

                <div className="mt-8 pt-8 border-t border-border/50">
                  <div
                    className="flex items-center gap-3 text-sm
                      text-muted-foreground"
                  >
                    <Ticket className="h-5 w-5 text-primary" />
                    <span>
                      Tickets for the event must be purchased separately from
                      the venue.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* TODO: what kind of event are you planning */}
      {/* TODO: sample itineraries */}
      <EventsGrid />
      <FleetSection />

      <section className="py-20 md:py-24 bg-primary/5 border-b border-border/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-4 text-center mb-12">
            <p className="text-sm font-semibold tracking-wider text-primary">
              EVENT INTEL
            </p>
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight
                text-foreground"
            >
              Make the fun not stressful
            </h2>
            <p className="text-lg text-muted-foreground">
              Real-world timing, comfort, and safety tips to keep your group
              together—and keep the night moving.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div
              className="rounded-2xl border border-border/60 bg-background p-6"
            >
              <h3 className="text-lg font-bold mb-3">Quick facts</h3>
              <ul
                className="space-y-2 text-sm text-muted-foreground list-disc
                  pl-5"
              >
                <li>
                  Groups run smoother with one pickup spot and one drop-off
                  plan.
                </li>
                <li>
                  Build in buffer time for bathrooms, tickets, and regrouping.
                </li>
                <li>
                  If you’re doing multiple stops, plan one “reset” break in the
                  middle.
                </li>
              </ul>
            </div>
            <div
              className="rounded-2xl border border-border/60 bg-background p-6"
            >
              <h3 className="text-lg font-bold mb-3">Comfort & pacing</h3>
              <ul
                className="space-y-2 text-sm text-muted-foreground list-disc
                  pl-5"
              >
                <li>
                  Keep a jacket/water stash onboard so nobody slows the group
                  down.
                </li>
                <li>
                  Short hops + more stops usually beats one long cross-town
                  drive.
                </li>
                <li>
                  Assign a “meet-point captain” so the driver isn’t hunting
                  people.
                </li>
              </ul>
            </div>
            <div
              className="rounded-2xl border border-border/60 bg-background p-6"
            >
              <h3 className="text-lg font-bold mb-3">Safety reminders</h3>
              <ul
                className="space-y-2 text-sm text-muted-foreground list-disc
                  pl-5"
              >
                <li>
                  If anyone has sensory triggers, tell your planner so we can
                  pace stops.
                </li>
                <li>
                  Keep phone chargers handy—lost phones are the #1 night-ender.
                </li>
                <li>
                  Confirm the venue’s pickup zone ahead of time to avoid traffic
                  loops.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <PollsGrid category="events" />
      <ToolsGrid category="events" />
      <ReviewsSection reviews={reviews} />
      <FaqSection category="events" title="Event Transport FAQs" />
    </main>
  );
}
