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

      <section className="py-16 md:py-24 bg-[#0C163A]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Contact Form */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2
                  className="text-3xl font-extrabold tracking-tight text-white"
                >
                  Get in Touch
                </h2>
                <p className="text-lg text-white/75">
                  Have a question about a booking or need a custom quote? Fill
                  out the form below and our team will get back to you shortly.
                </p>
              </div>

              <Card
                className="rounded-3xl shadow-[0_35px_120px_rgba(5,10,35,0.65)]
                  border border-white/10 bg-gradient-to-r from-slate-900/80
                  to-slate-950/90 text-white"
              >
                <CardHeader>
                  <CardTitle className="text-white">
                    Send us a message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name" className="text-white/80">
                          First name
                        </Label>
                        <Input
                          id="first-name"
                          placeholder="John"
                          className="border-white/15 bg-white/5 text-white
                            placeholder:text-white/60
                            focus-visible:border-white/40
                            focus-visible:ring-white/15"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name" className="text-white/80">
                          Last name
                        </Label>
                        <Input
                          id="last-name"
                          placeholder="Doe"
                          className="border-white/15 bg-white/5 text-white
                            placeholder:text-white/60
                            focus-visible:border-white/40
                            focus-visible:ring-white/15"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white/80">
                        Email
                      </Label>
                      <Input
                        id="email"
                        placeholder="john@example.com"
                        type="email"
                        className="border-white/15 bg-white/5 text-white
                          placeholder:text-white/60
                          focus-visible:border-white/40
                          focus-visible:ring-white/15"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white/80">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        placeholder="(555) 123-4567"
                        type="tel"
                        className="border-white/15 bg-white/5 text-white
                          placeholder:text-white/60
                          focus-visible:border-white/40
                          focus-visible:ring-white/15"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-white/80">
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your event..."
                        className="min-h-[120px] border-white/15 bg-white/5
                          text-white placeholder:text-white/60
                          focus-visible:border-white/40
                          focus-visible:ring-white/15"
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
                <Card
                  className="rounded-3xl
                    shadow-[0_35px_120px_rgba(5,10,35,0.65)] border
                    border-white/10 bg-gradient-to-r from-slate-900/80
                    to-slate-950/90 text-white"
                >
                  <CardContent className="flex items-center gap-4 p-6">
                    <div
                      className="h-12 w-12 rounded-full bg-primary/10 flex
                        items-center justify-center shrink-0"
                    >
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Call Us 24/7</h3>
                      <p className="text-white/70">(888) 535-2566</p>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="rounded-3xl
                    shadow-[0_35px_120px_rgba(5,10,35,0.65)] border
                    border-white/10 bg-gradient-to-r from-slate-900/80
                    to-slate-950/90 text-white"
                >
                  <CardContent className="flex items-center gap-4 p-6">
                    <div
                      className="h-12 w-12 rounded-full bg-primary/10 flex
                        items-center justify-center shrink-0"
                    >
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Email Support</h3>
                      <p className="text-white/70">bookings@bus2ride.com</p>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="rounded-3xl
                    shadow-[0_35px_120px_rgba(5,10,35,0.65)] border
                    border-white/10 bg-gradient-to-r from-slate-900/80
                    to-slate-950/90 text-white"
                >
                  <CardContent className="flex items-center gap-4 p-6">
                    <div
                      className="h-12 w-12 rounded-full bg-primary/10 flex
                        items-center justify-center shrink-0"
                    >
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Office Hours</h3>
                      <p className="text-white/70">Mon-Sun: 24 Hours</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Ballpark Pricing (Configurable copy later) */}
              <Card
                className="rounded-3xl shadow-[0_35px_120px_rgba(5,10,35,0.65)]
                  border border-white/10 bg-gradient-to-r from-slate-900/80
                  to-slate-950/90 text-white"
              >
                <CardHeader className="pb-3">
                  <Badge
                    variant="outline"
                    className="w-fit border-white/15 bg-white/5 text-white/70"
                  >
                    BALLPARK
                  </Badge>
                  <CardTitle className="text-2xl">
                    Quick ballpark numbers (no pressure)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-white/70">
                    Final price depends on date, vehicle class, and drive time.
                    If you tell us your headcount + hours, we can usually narrow
                    it down fast.
                  </p>
                  <div
                    className="rounded-2xl border border-white/10 bg-white/5 p-4
                      text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Party bus</span>
                      <span className="text-white/65">often $120–$250/hr</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-semibold">Limo</span>
                      <span className="text-white/65">often $90–$200/hr</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-semibold">Coach</span>
                      <span className="text-white/65">often $130–$260/hr</span>
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
                      className="rounded-xl border-white/15 bg-white/5
                        text-white/80 hover:bg-white/10 hover:text-white"
                    >
                      <Link href="/pricing">See pricing guides</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Response (replace SLA with facts + trivia) */}
              <div className="grid gap-6">
                <Card
                  className="rounded-3xl
                    shadow-[0_35px_120px_rgba(5,10,35,0.65)] border
                    border-white/10 bg-gradient-to-r from-slate-900/80
                    to-slate-950/90 text-white"
                >
                  <CardHeader className="pb-3">
                    <Badge
                      variant="outline"
                      className="w-fit border-white/15 bg-white/5 text-white/70"
                    >
                      FAST REPLY
                    </Badge>
                    <CardTitle className="text-xl">
                      What to send for speed
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-white/70">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Date + start time window</li>
                      <li>Pickup + drop-off areas</li>
                      <li>Headcount + hours needed</li>
                      <li>Event type (wedding, prom, night out)</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card
                  className="rounded-3xl
                    shadow-[0_35px_120px_rgba(5,10,35,0.65)] border
                    border-white/10 bg-gradient-to-r from-slate-900/80
                    to-slate-950/90 text-white"
                >
                  <CardHeader className="pb-3">
                    <Badge
                      variant="outline"
                      className="w-fit border-white/15 bg-white/5 text-white/70"
                    >
                      TRIVIA
                    </Badge>
                    <CardTitle className="text-xl">
                      Quick facts riders love
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-white/70">
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
              <Card
                className="rounded-3xl shadow-[0_35px_120px_rgba(5,10,35,0.65)]
                  border border-white/10 bg-gradient-to-r from-slate-900/80
                  to-slate-950/90 text-white"
              >
                <CardHeader className="pb-3">
                  <Badge
                    variant="outline"
                    className="w-fit border-white/15 bg-white/5 text-white/70"
                  >
                    COVERAGE
                  </Badge>
                  <CardTitle className="text-xl">Where we can help</CardTitle>
                </CardHeader>
                <CardContent className="text-white/70">
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
      <section className="py-16 md:py-24 border-y border-white/5 bg-[#0E1F46]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
            <Badge
              variant="outline"
              className="w-fit mx-auto border-white/15 bg-white/5 text-white/70"
            >
              WORKFLOW
            </Badge>
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight
                text-white"
            >
              Why our replies feel instant
            </h2>
            <p className="text-lg text-white/75">
              Dispatch + concierge share the same context, so your quote doesn’t
              bounce between inboxes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              className="rounded-3xl border border-white/10 bg-white/5 p-6
                shadow-[0_35px_120px_rgba(5,10,35,0.45)] text-white"
            >
              <div className="text-sm font-bold text-white/60">
                LIVE ROUTE INTELLIGENCE
              </div>
              <p className="mt-2 text-white/75">
                We sanity-check pickup/drop routes for traffic patterns and
                staging constraints so the itinerary works in real life.
              </p>
            </Card>
            <Card
              className="rounded-3xl border border-white/10 bg-white/5 p-6
                shadow-[0_35px_120px_rgba(5,10,35,0.45)] text-white"
            >
              <div className="text-sm font-bold text-white/60">
                VEHICLE READINESS
              </div>
              <p className="mt-2 text-white/75">
                We match the right vehicle class for your headcount and event
                expectations—then confirm availability before quoting.
              </p>
            </Card>
            <Card
              className="rounded-3xl border border-white/10 bg-white/5 p-6
                shadow-[0_35px_120px_rgba(5,10,35,0.45)] text-white"
            >
              <div className="text-sm font-bold text-white/60">
                DOCS + DETAILS
              </div>
              <p className="mt-2 text-white/75">
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
