import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { getReviews } from "@/lib/data/reviews";
import { getEventBySlug } from "@/lib/data/events";
import { notFound } from "next/navigation";
import FleetSection from "@/components/sections/fleet-section";
import Hero from "@/components/layout/hero";
import EventQuickPlanner from "@/components/sections/event-quick-planner.client";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";
import { toPublicStorageUrl } from "@/lib/helpers/storage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return pageMetadata({
      title: "Event Not Found",
      description: "This event page doesn’t exist or may have moved.",
      noIndex: true,
    });
  }

  const ogImage = event.images?.[0]
    ? toPublicStorageUrl("Events1", event.images[0])
    : undefined;

  return pageMetadata({
    title: event.title ?? "Event",
    description: (event.description ?? "").trim() || undefined,
    path: `/events/${event.slug}`,
    openGraphImages: ogImage ? [ogImage] : undefined,
  });
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) return notFound();

  const reviews = (await getReviews()) ?? [];

  return (
    <main>
      <Hero slug={event.slug} />

      <section className="bg-[#122a56] py-10 px-4 md:px-6">
        <div
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8
            items-start"
        >
          {/* Event content */}
          <article
            className="lg:col-span-2 rounded-3xl border border-blue-800/30
              bg-[#173264] p-6 shadow-xl prose prose-lg prose-invert max-w-none
              text-justify prose-headings:font-bold
              prose-headings:tracking-tight prose-headings:text-white
              prose-p:text-slate-200 prose-a:text-sky-300 prose-a:no-underline
              hover:prose-a:underline prose-strong:text-white
              prose-hr:border-white/10 prose-img:rounded-2xl prose-img:shadow-lg
              space-y-6"
            dangerouslySetInnerHTML={{ __html: event.page_content ?? "" }}
          ></article>

          {/* Quick Planner */}
          <EventQuickPlanner eventSlug={event.slug} />
        </div>
      </section>

      {/* TODO: what kind of event are you planning */}

      {/* TODO: sample itineraries */}

      <EventsGrid />
      <FleetSection />

      {/* Event Intel */}
      <section className="relative overflow-hidden py-20 md:py-24 bg-[#122a56]">
        <div className="absolute inset-0">
          <div
            className="h-full w-full bg-gradient-to-b from-[#122a56]
              via-[#0f1f46] to-[#122a56]"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-4 text-center mb-12">
            <p
              className="text-xs font-semibold uppercase tracking-[0.4em]
                text-blue-100/60"
            >
              EVENT INTEL
            </p>
            <h2
              className="text-4xl md:text-5xl font-extrabold tracking-tight
                text-white"
            >
              Make the scares fun not stressful
            </h2>
            <p className="text-base md:text-lg text-blue-100/80">
              Real-world timing, comfort, and safety tips to keep your group
              together—and keep the night moving.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* BLUE */}
            <div
              className="rounded-3xl border border-blue-700/60 bg-[#07132b] p-8
                shadow-[0_20px_60px_rgba(3,7,18,0.45)]"
            >
              <p
                className="text-xs uppercase tracking-[0.25em] text-blue-300/80
                  mb-2"
              >
                QUICK FACTS
              </p>
              <h3 className="text-lg font-semibold text-white mb-3">
                Haunted house by the numbers
              </h3>
              <ul className="space-y-3 text-sm text-blue-100/90">
                <li className="flex gap-3">
                  <span
                    className="mt-1 h-[7px] w-[7px] rounded-full bg-emerald-400
                      flex-shrink-0"
                  ></span>
                  <span>
                    Most popular haunted house nights: the last 2 Fridays &amp;
                    Saturdays before Halloween.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    className="mt-1 h-[7px] w-[7px] rounded-full bg-emerald-400
                      flex-shrink-0"
                  ></span>
                  <span>
                    Average walkthrough time: 20–35 minutes per attraction, not
                    counting the line.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    className="mt-1 h-[7px] w-[7px] rounded-full bg-emerald-400
                      flex-shrink-0"
                  ></span>
                  <span>
                    Top add-ons: photo ops, themed bars, escape rooms, and
                    “no-scare” zones.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    className="mt-1 h-[7px] w-[7px] rounded-full bg-emerald-400
                      flex-shrink-0"
                  ></span>
                  <span>
                    Rain usually doesn’t cancel haunts—just expect muddier paths
                    and longer lines.
                  </span>
                </li>
              </ul>
            </div>

            {/* VIOLET */}
            <div
              className="rounded-3xl border border-violet-700/60 bg-[#0b1030]
                p-8 shadow-[0_20px_60px_rgba(3,7,18,0.45)]"
            >
              <p
                className="text-xs uppercase tracking-[0.25em]
                  text-violet-300/80 mb-2"
              >
                TRIVIA CORNER
              </p>
              <h3 className="text-lg font-semibold text-white mb-3">
                Bus-ride conversation starters
              </h3>
              <div className="space-y-4 text-sm text-blue-100/90">
                <div>
                  <p className="font-semibold text-white/95 mb-1">
                    What’s the busiest hour of the night for most haunted
                    houses?
                  </p>
                  <p className="text-blue-200/85">
                    Usually 8:30–10:00 PM—perfect time to already be inside, not
                    still parking.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-white/95 mb-1">
                    What’s the #1 thing people say they regret?
                  </p>
                  <p className="text-blue-200/85">
                    Booking too few hours and having to cut the last stop or
                    rush the food break.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-white/95 mb-1">
                    Which scares people more: chainsaws or clowns?
                  </p>
                  <p className="text-blue-200/85">
                    In most polls, clowns win by a hair. Chainsaws just make
                    everybody run.
                  </p>
                </div>
              </div>
            </div>

            {/* GREEN */}
            <div
              className="rounded-3xl border border-emerald-600/60 bg-[#051a19]
                p-8 shadow-[0_20px_60px_rgba(3,7,18,0.45)]"
            >
              <p
                className="text-xs uppercase tracking-[0.25em]
                  text-emerald-300/80 mb-2"
              >
                PRO TIPS &amp; SAFETY
              </p>
              <h3 className="text-lg font-semibold text-white mb-3">
                Keep everyone laughing, not panicking
              </h3>
              <ul className="space-y-3 text-sm text-emerald-100/90 mb-3">
                <li className="flex gap-3">
                  <span
                    className="mt-1 h-[7px] w-[7px] rounded-sm bg-emerald-400
                      flex-shrink-0"
                  ></span>
                  <span>
                    Pick a “calm buddy” in each friend group to watch for
                    anxiety or motion sickness.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    className="mt-1 h-[7px] w-[7px] rounded-sm bg-emerald-400
                      flex-shrink-0"
                  ></span>
                  <span>
                    Take a group photo before the first haunt—faces get
                    progressively more destroyed.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    className="mt-1 h-[7px] w-[7px] rounded-sm bg-emerald-400
                      flex-shrink-0"
                  ></span>
                  <span>
                    Keep the bus as the “safe zone”: music, snacks, and a place
                    to breathe between scares.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    className="mt-1 h-[7px] w-[7px] rounded-sm bg-emerald-400
                      flex-shrink-0"
                  ></span>
                  <span>
                    Save the most intense haunt for the middle of the night, not
                    the very end.
                  </span>
                </li>
              </ul>
              <p className="mt-6 text-sm text-emerald-200/80">
                If anyone in your group has epilepsy, heart conditions, or
                strong sensory triggers, let your planner know so we can suggest
                calmer routes and quiet breaks.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PollsGrid
        columnCategories={["party-bus", "limo", "coach-bus"]}
        // columnCategories={[slug, "events", "concerts"]}
        hideCities
      />
      <ToolsGrid category="events" />
      <ReviewsSection reviews={reviews} />
      <FaqSection category="events" title="Event Transport FAQs" />

      {/* Ready to ride */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-12">
        <div
          className="rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-800
            border border-blue-400/30 shadow-[0_6px_18px_-2px_rgba(0,0,0,.4)]
            p-6 md:p-7 text-center"
        >
          <h3
            className="text-2xl md:text-3xl font-extrabold text-white font-serif
              tracking-tight mb-2"
          >
            Ready to ride?
          </h3>
          <p className="text-blue-100/90 mb-4">
            Lock in your haunted itinerary before the crowds. Weekends fill up
            fast.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/pricing"
              className="rounded-full font-bold px-6 py-3 text-base shadow-lg
                transition border flex items-center justify-center bg-white
                text-blue-900 border-blue-200 hover:bg-blue-50"
            >
              ⚡ Get Instant Quote
            </a>
            <a
              href="/contact"
              className="rounded-full font-bold px-6 py-3 text-base shadow-lg
                transition border flex items-center justify-center bg-blue-600
                text-white border-blue-700 hover:bg-blue-700"
            >
              Talk to a Planner
            </a>
            <a
              href="/fleet"
              className="rounded-full font-bold px-6 py-3 text-base shadow-lg
                transition border flex items-center justify-center bg-blue-800
                text-white border-blue-900 hover:bg-blue-900"
            >
              See Vehicles
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
