import Hero from "@/components/layout/hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { getReviews } from "@/lib/data/reviews";
import { Mail, Phone, Clock } from "lucide-react";
import { BookingProcessSection } from "@/components/sections/content-booking";
import FleetSection from "@/components/sections/fleet-section";
import Link from "next/link";
import { HeaderSection } from "@/components/sections/header-section";

export default async function ContactPage() {
  const reviews = (await getReviews()) ?? [];

  const cardsForHeader = [
    {
      info: "2m 11s",
      label: "Median Reply",
    },
    {
      info: "24 / 7",
      label: "Night Coverage",
    },
    {
      info: "38",
      label: "Live Metros",
    },
    {
      info: "97%",
      label: "Quote Accuracy",
    },
  ] as const;

  return (
    <main>
      <Hero slug="contact" />

      <HeaderSection
        badgeText="Mission Control"
        title="One command center for every question, quote, or curveball."
        description="We route your inquiry to the right human fast—so you get clear options and real availability, not a slow back-and-forth."
        cards={cardsForHeader}
      />

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Contact Form */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-extrabold tracking-tight">
                  Get in Touch
                </h2>
                <p className="text-lg text-muted-foreground">
                  Have a question about a booking or need a custom quote? Fill
                  out the form below and our team will get back to you shortly.
                </p>
              </div>

              <Card className="border-primary/10 bg-background/60 shadow-sm">
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First name</Label>
                        <Input id="first-name" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last name</Label>
                        <Input id="last-name" placeholder="Doe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        placeholder="john@example.com"
                        type="email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        placeholder="(555) 123-4567"
                        type="tel"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your event..."
                        className="min-h-[120px]"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full font-bold text-lg h-12"
                    >
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right: Info & Trivia */}
            <div className="space-y-8">
              {/* Contact Info Cards */}
              <div className="grid gap-6">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div
                      className="h-12 w-12 rounded-full bg-primary/10 flex
                        items-center justify-center shrink-0"
                    >
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Call Us 24/7</h3>
                      <p className="text-muted-foreground">(888) 535-2566</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div
                      className="h-12 w-12 rounded-full bg-primary/10 flex
                        items-center justify-center shrink-0"
                    >
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Email Support</h3>
                      <p className="text-muted-foreground">
                        bookings@bus2ride.com
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div
                      className="h-12 w-12 rounded-full bg-primary/10 flex
                        items-center justify-center shrink-0"
                    >
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Office Hours</h3>
                      <p className="text-muted-foreground">Mon-Sun: 24 Hours</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Ballpark Pricing (Configurable copy later) */}
              <Card className="border-border/60 shadow-sm">
                <CardHeader className="pb-3">
                  <Badge variant="secondary" className="w-fit">
                    BALLPARK
                  </Badge>
                  <CardTitle className="text-2xl">
                    Quick ballpark numbers (no pressure)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Final price depends on date, vehicle class, and drive time.
                    If you tell us your headcount + hours, we can usually narrow
                    it down fast.
                  </p>
                  <div
                    className="rounded-2xl border border-border bg-muted/20 p-4
                      text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Party bus</span>
                      <span className="text-muted-foreground">
                        often $120–$250/hr
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-semibold">Limo</span>
                      <span className="text-muted-foreground">
                        often $90–$200/hr
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-semibold">Coach</span>
                      <span className="text-muted-foreground">
                        often $130–$260/hr
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild size="lg" className="rounded-xl font-bold">
                      <Link href="/contact">Request a quote</Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="rounded-xl border-primary/20 hover:bg-primary/5
                        hover:text-primary"
                    >
                      <Link href="/pricing">See pricing guides</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Response (replace SLA with facts + trivia) */}
              <div className="grid gap-6">
                <Card className="border-border/60 shadow-sm">
                  <CardHeader className="pb-3">
                    <Badge variant="secondary" className="w-fit">
                      FAST REPLY
                    </Badge>
                    <CardTitle className="text-xl">
                      What to send for speed
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Date + start time window</li>
                      <li>Pickup + drop-off areas</li>
                      <li>Headcount + hours needed</li>
                      <li>Event type (wedding, prom, night out)</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-border/60 shadow-sm">
                  <CardHeader className="pb-3">
                    <Badge variant="secondary" className="w-fit">
                      TRIVIA
                    </Badge>
                    <CardTitle className="text-xl">
                      Quick facts riders love
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Weekday + daytime bookings often price lower than peak
                        Saturdays
                      </li>
                      <li>Extra stops are the #1 driver of overtime</li>
                      <li>Minimum hours vary by date more than by distance</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Coverage locks (make it related) */}
              <Card className="border-border/60 shadow-sm">
                <CardHeader className="pb-3">
                  <Badge variant="secondary" className="w-fit">
                    COVERAGE
                  </Badge>
                  <CardTitle className="text-xl">Where we can help</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Party buses, limos, and coaches for events and shuttles
                    </li>
                    <li>
                      Local + multi-city coordination for complex itineraries
                    </li>
                    <li>
                      Venue rules, staging plans, and pickup logistics support
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why our replies feel instant */}
      <section
        className="py-16 md:py-24 border-b border-border/40 bg-primary/5
          dark:bg-background"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
            <Badge variant="secondary" className="w-fit mx-auto">
              WORKFLOW
            </Badge>
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight
                text-foreground"
            >
              Why our replies feel instant
            </h2>
            <p className="text-lg text-muted-foreground">
              Dispatch + concierge share the same context, so your quote doesn’t
              bounce between inboxes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border/60 bg-background/60 p-6 shadow-sm">
              <div className="text-sm font-bold text-muted-foreground">
                LIVE ROUTE INTELLIGENCE
              </div>
              <p className="mt-2 text-muted-foreground">
                We sanity-check pickup/drop routes for traffic patterns and
                staging constraints so the itinerary works in real life.
              </p>
            </Card>
            <Card className="border-border/60 bg-background/60 p-6 shadow-sm">
              <div className="text-sm font-bold text-muted-foreground">
                VEHICLE READINESS
              </div>
              <p className="mt-2 text-muted-foreground">
                We match the right vehicle class for your headcount and event
                expectations—then confirm availability before quoting.
              </p>
            </Card>
            <Card className="border-border/60 bg-background/60 p-6 shadow-sm">
              <div className="text-sm font-bold text-muted-foreground">
                DOCS + DETAILS
              </div>
              <p className="mt-2 text-muted-foreground">
                Once your plan is set, we keep updates centralized: route
                changes, venue notes, and timing tweaks stay consistent.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How to book (below “Why our replies feel instant”) */}
      <BookingProcessSection className="m-0 my-16 md:my-20 rounded-none" />

      {/* Additional Sections */}
      <FleetSection />
      <ReviewsSection reviews={reviews} />
      <PollsGrid category="contact" />
      <EventsGrid />
      <FaqSection category="contact" title="Booking FAQs" />
    </main>
  );
}
