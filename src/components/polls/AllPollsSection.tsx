import React from "react";
import HomePollsSection from "./HomePollsSection";
import ToolsSection from "../home/ToolsSection";
import EventsSection from "../EventsSection";
import ReviewsSearchSection, { SimpleReview } from "./ReviewsSearchSection";
import { getFeaturedReviews } from "../../lib/server/reviews";

export type MegaPollGroup = {
  key: string;
  title: string;
  tagline: string;
  blurb: string;
  icon: string;
  accentFrom: string;
  accentTo: string;
  highlights: string[];
  polls: Array<{
    id: string;
    question: string;
    slug?: string | null;
    options?: string[] | null;
    tags?: string[] | null;
  }>;
};

const FALLBACK_REVIEWS: SimpleReview[] = [
  {
    id: "kara",
    author: "Kara M.",
    body: "Winter corporate shuttle—driver pre-heated the bus & tracked our delayed flight. Dispatch kept us calm the whole time.",
    rating: 5,
    source: "Google",
  },
  {
    id: "owen",
    author: "Owen P.",
    body: "Aurora chase extended an hour and dispatch approved it instantly. Worth every minute watching lights over Anchorage.",
    rating: 5,
    source: "Anchorage",
  },
  {
    id: "lisa",
    author: "Lisa M.",
    body: "Booked a 32 passenger bus for our cruise group. Plenty of luggage room and the driver knew every tunnel timing.",
    rating: 5,
  },
  {
    id: "brian",
    author: "Brian S.",
    body: "Cruise transfer ANC hotel → Whittier with glacier photo stop. Coach was spotless and on schedule.",
    rating: 5,
  },
  {
    id: "lia",
    author: "Lia R.",
    body: "Prom party bus had premium sound and lighting. Parents felt safe and the teens couldn’t stop smiling.",
    rating: 5,
  },
  {
    id: "joel",
    author: "Joel K.",
    body: "Fishing group charter had room for all coolers—driver helped stage loading efficiently and had hot coffee ready.",
    rating: 5,
  },
];

type FieldIntel = {
  badge: string;
  title: string;
  stat: string;
  detail: string;
};

const FIELD_INTEL: FieldIntel[] = [
  {
    badge: "Aurora surge",
    title: "Lights-watch windows",
    stat: "7p – 2a",
    detail:
      "Quote requests spike midweek when the forecast index is above Kp4. Dispatch is pre-staging sprinters near Eagle River during those bursts.",
  },
  {
    badge: "Cruise flow",
    title: "Whittier transfers",
    stat: "73% noon departures",
    detail:
      "Poll voters overwhelmingly pick midday departures so we block 10a – 1p coaches for cruise docks from May through August to keep dwell low.",
  },
  {
    badge: "Corporate ops",
    title: "ANC campus loops",
    stat: "18 min lap",
    detail:
      "Shuttle loops around Midtown tech campuses average 18 minutes including badge checks. Staggering boarding by 90 seconds keeps the loop green.",
  },
  {
    badge: "Peak weekends",
    title: "Wedding convoys",
    stat: "+32% fleet load",
    detail:
      "Late July weddings layer sprinters plus 47-passenger coaches. Two-unit convoys cut photo-stop delays compared to single large buses.",
  },
];

type DispatchMetric = {
  label: string;
  value: string;
  detail: string;
};

const DISPATCH_METRICS: DispatchMetric[] = [
  {
    label: "Median quote turn",
    value: "11m 24s",
    detail: "Average time from form submit to staffed quote when Anchorage tags are selected.",
  },
  {
    label: "Same-day approvals",
    value: "82%",
    detail: "Trips requested before 2 p.m. AKDT are confirmed the same day inside busy season windows.",
  },
  {
    label: "Flex extensions",
    value: "+47",
    detail: "Aurora nights extended last month; dispatch keeps a roaming sprinter staged for hand-offs.",
  },
];

const SIGNAL_NOTES = [
  {
    time: "07:40",
    title: "Cruise luggage surge",
    summary: "Back-to-back Princess + Norwegian arrivals trigger extra luggage trailers at the port yard.",
  },
  {
    time: "15:10",
    title: "School dismissal",
    summary: "Midtown arterials slow 12–20 minutes; we reroute corporate loops via Old Seward.",
  },
  {
    time: "22:30",
    title: "Aurora standby",
    summary: "On-call drivers rotate to Eagle River fuel stop before KP spikes so heaters stay running.",
  },
];

const MICRO_UPDATES = [
  {
    label: "Fleet health",
    value: "98% ready",
    note: "Only one coach in maintenance rotation this week.",
  },
  {
    label: "Buffer adds",
    value: "+12 min",
    note: "Average padding per trip after AK 511 advisories.",
  },
  {
    label: "Crew on-call",
    value: "4 sprinters",
    note: "Night crew staged between Midtown + Eagle River.",
  },
];

export default async function AllPollsSection() {
  const featured = await getFeaturedReviews(48);
  const mapped: SimpleReview[] = featured.length
    ? featured.map((review, idx) => ({
        id: String(review.id ?? `featured-${idx}`),
        author: review.author_display || "Verified rider",
        body: review.body || "",
        rating: review.rating ?? 5,
        source: review.source ?? undefined,
      }))
    : FALLBACK_REVIEWS;

  return (
    <div className="bg-gradient-to-b from-[#040916] via-[#050c1f] to-[#02040a] py-16 text-white space-y-16">
      <ReviewsSearchSection reviews={mapped} />

      <HomePollsSection />

      <section className="mx-auto max-w-7xl rounded-[40px] border border-white/10 bg-gradient-to-br from-[#08132b] via-[#050d1f] to-[#030712] px-4 py-12 shadow-[0_60px_160px_rgba(2,6,23,0.65)]">
        <div className="text-center space-y-3 mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">Plan faster</p>
          <h2 className="text-4xl md:text-5xl font-extrabold">Tools</h2>
          <p className="text-white/70 max-w-3xl mx-auto">
            Cost splitters, buffer planners, weather snapshots, and more—exactly like the homepage tools rail, all ready to launch.
          </p>
        </div>
        <ToolsSection />
      </section>

      <section className="mx-auto max-w-7xl rounded-[40px] border border-lime-400/10 bg-gradient-to-br from-[#0a1b34] via-[#071023] to-[#03050b] px-6 py-12 shadow-[0_40px_120px_rgba(2,6,23,0.6)]">
        <div className="text-center space-y-3 mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-lime-200/70">Field intel</p>
          <h2 className="text-4xl md:text-5xl font-extrabold">Anchorage Ops Snapshot</h2>
          <p className="text-white/70 max-w-4xl mx-auto">
            Live playbook notes from dispatch—when requests spike, how we stage vehicles, and the timing patterns we watch so your quote lands faster.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {FIELD_INTEL.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-200/80">
                  {card.badge}
                </span>
                <span className="text-3xl font-black text-white">{card.stat}</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white">{card.title}</h3>
              <p className="text-white/70 leading-relaxed">{card.detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {MICRO_UPDATES.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm">
              <p className="text-xs uppercase tracking-[0.35em] text-lime-200/70">{item.label}</p>
              <p className="text-2xl font-black text-white mt-1">{item.value}</p>
              <p className="text-white/70 text-xs mt-2 leading-relaxed">{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl rounded-[40px] border border-cyan-400/10 bg-gradient-to-br from-[#04152f] via-[#050f24] to-[#020712] px-6 py-12 shadow-[0_35px_120px_rgba(0,8,20,0.55)]">
        <div className="text-center space-y-3 mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-200/70">Signal board</p>
          <h2 className="text-4xl md:text-5xl font-extrabold">Dispatch Metrics & Rhythm</h2>
          <p className="text-white/70 max-w-4xl mx-auto">
            We monitor cadence data the same way we watch polls—quote velocity, approval rates, and when the city pulses. Here’s the latest Anchorage rhythm map.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70 mb-4">Core metrics</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {DISPATCH_METRICS.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/60">{metric.label}</p>
                  <p className="text-2xl font-black text-white mt-2">{metric.value}</p>
                  <p className="text-xs text-white/70 mt-2 leading-relaxed">{metric.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#071737] to-[#030915] p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70 mb-4">Daily signals</p>
            <div className="space-y-5">
              {SIGNAL_NOTES.map((note) => (
                <div key={note.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{note.title}</span>
                    <span className="text-xs uppercase tracking-[0.3em] text-cyan-200">{note.time}</span>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/80">{note.summary}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-white/70">
              Need to mirror this timing for your charter? Note it in the quote and dispatch will align fueling, driver swaps, and staging.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl rounded-[40px] border border-white/10 bg-gradient-to-br from-[#08132b] via-[#050d1f] to-[#030712] px-4 py-12 shadow-[0_60px_160px_rgba(2,6,23,0.65)]">
        <div className="text-center space-y-3 mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">Ideas board</p>
          <h2 className="text-4xl md:text-5xl font-extrabold">Events & Occasions</h2>
          <p className="text-white/70 max-w-3xl mx-auto">
            Browse popular trip types, see photos, and jump straight into a quote, call, or email.
          </p>
        </div>
        <EventsSection limit={9} />
      </section>
    </div>
  );
}
