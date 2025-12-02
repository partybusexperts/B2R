"use client";
import React, { useEffect, useMemo, useState } from "react";
import SmartImage from "../../../components/SmartImage";
import ToolsGrid from "../../../components/tools/ToolsGrid";
import HeroHeader from "../../../components/HeroHeader";
import EventCard from "../../../components/events/EventCard";
import HomePolls from "../../../components/HomePolls";
import GlobalReviewStripClient from "@/components/reviews/GlobalReviewStripClient";
import HauntedFaqSection from "@/components/faq/HauntedFaqSection";
import { getHeroFallback } from "@/data/heroFallbacks";
import { resolveVehicles } from "@/data/vehicles";
import { findByFileName, getCategoryImages } from "@/utils/optimizedImages";
import { eventDetails as allEventDetails } from "../eventDetails";

/* ===== Contact constants ===== */
const PHONE_DISPLAY = "(888) 535-2566";
const PHONE_TEL = "8885352566";
const EMAIL = "info@bus2ride.com";

/* ===== Vehicle showcase (auto-rotating from vehicles1 manifest) ===== */
const VEHICLE_ROTATE_INTERVAL = 3000;
const VEHICLE_VISIBLE_COUNT = 4;
const VEHICLE_FALLBACK_IMAGE = "/images/party-buses/30 Passenger Party Bus Exterior.png";
const VEHICLE_LINKS: Record<string, string> = {
  "party-buses": "/fleet#party-bus",
  limousines: "/fleet#limousines",
  "coach-buses": "/fleet#coach",
};

const optimizedEventImages = getCategoryImages("eventImages");
const EVENT_IMAGE_FALLBACKS = [
  "/images/party-buses/18 Passenger White Party Bus Exterior.png",
  "/images/party-buses/30 Passenger Party Bus Exterior.png",
  "/images/party-buses/36 Passenger Party Bus Inside.png",
];

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

type ShowcaseVehicle = {
  id: string;
  title: string;
  desc: string;
  image: string;
  href: string;
};

function buildShowcaseVehicles(): ShowcaseVehicle[] {
  const resolved = resolveVehicles(findByFileName);
  return resolved
    .filter((vehicle) => vehicle.category === "party-buses" || vehicle.category === "coach-buses")
    .map((vehicle) => {
      const capacity = vehicle.capacityMin === vehicle.capacityMax
        ? `${vehicle.capacityMax} riders`
        : `${vehicle.capacityMin}–${vehicle.capacityMax} riders`;
      const highlight = vehicle.highlights.slice(0, 2).join(" · ");
      const desc = highlight ? `${capacity}. ${highlight}.` : capacity;
      return {
        id: vehicle.id,
        title: vehicle.name,
        desc,
        image: vehicle.primary?.entry?.original || VEHICLE_FALLBACK_IMAGE,
        href: VEHICLE_LINKS[vehicle.category] || "/fleet",
      };
    });
}

function RotatingVehicleShowcase() {
  const vehicles = useMemo(() => buildShowcaseVehicles(), []);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (vehicles.length <= VEHICLE_VISIBLE_COUNT) return;
    const id = window.setInterval(() => {
      setOffset((prev) => (prev + 1) % vehicles.length);
    }, VEHICLE_ROTATE_INTERVAL);
    return () => window.clearInterval(id);
  }, [vehicles.length]);

  const count = Math.min(VEHICLE_VISIBLE_COUNT, vehicles.length);
  const visible = useMemo(() => {
    if (!vehicles.length) return [] as ShowcaseVehicle[];
    return Array.from({ length: count }, (_, idx) => vehicles[(offset + idx) % vehicles.length]);
  }, [vehicles, offset, count]);

  if (!vehicles.length) {
    return <p className="text-blue-100/80 text-center">Vehicles are loading…</p>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {visible.map((vehicle) => (
          <article
            key={vehicle.id}
            className="rounded-3xl border border-blue-800/30 bg-[#173264] p-4 shadow-xl flex flex-col"
          >
            <SmartImage
              src={vehicle.image}
              alt={vehicle.title}
              className="w-full h-48 object-cover rounded-2xl border border-blue-800/40 mb-4"
            />
            <h3 className="text-xl font-bold text-white">{vehicle.title}</h3>
            <p className="text-sm text-blue-100/90 mt-1 flex-1">{vehicle.desc}</p>
            <a
              href={vehicle.href}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-blue-600 text-white border border-blue-700 px-4 py-2 font-semibold hover:bg-blue-700"
            >
              View fleet option →
            </a>
          </article>
        ))}
      </div>
      <div className="text-center text-xs uppercase tracking-[0.4em] text-blue-200/70">
        Rotating every 3 seconds
      </div>
    </div>
  );
}

function pickEventImage(name: string, idx: number) {
  if (optimizedEventImages.length) {
    const norm = slugify(name);
    const exact = optimizedEventImages.find((entry) =>
      entry.original.toLowerCase().includes("/" + norm) ||
      entry.original.toLowerCase().endsWith("/" + norm + ".webp") ||
      entry.original.toLowerCase().includes(norm)
    );
    if (exact) return exact.original;
    const tokens = norm.split("-").filter(Boolean);
    for (const token of tokens) {
      const found = optimizedEventImages.find((entry) => entry.original.toLowerCase().includes(token));
      if (found) return found.original;
    }
    return optimizedEventImages[idx % optimizedEventImages.length].original;
  }
  return EVENT_IMAGE_FALLBACKS[idx % EVENT_IMAGE_FALLBACKS.length];
}

function FeaturedEventsGrid({ limit = 6 }: { limit?: number }) {
  const featured = useMemo(() => {
    return allEventDetails
      .filter((event) => event.name.toLowerCase() !== "haunted house tours")
      .slice(0, limit);
  }, [limit]);

  if (!featured.length) return null;

  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        {featured.map((event, idx) => {
          const slug = slugify(event.name);
          const href = event.href || `/events/${slug}`;
          return (
            <EventCard
              key={event.name}
              name={event.name}
              description={event.description}
              href={href}
              imageSrc={pickEventImage(event.name, idx)}
              slug={slug}
            />
          );
        })}
      </div>
      <div className="text-center mt-10">
        <a
          href="/events"
          className="inline-flex items-center justify-center rounded-full px-8 py-3 text-base font-bold text-white bg-blue-600 border border-blue-500 shadow-lg hover:bg-blue-500"
        >
          More events
        </a>
      </div>
    </>
  );
}

/* ===== Quick planner (simple estimator) ===== */
function clamp(n: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, n)); }
function vehicleSuggestion(size: number) {
  if (size <= 14) return { label: "Sprinter Van (≤14)", key: "sprinter" };
  if (size <= 22) return { label: "Mini Party Bus (15–22)", key: "party-bus-22" };
  if (size <= 30) return { label: "Party Bus (23–30)", key: "party-bus-30" };
  if (size <= 40) return { label: "Shuttle / Mini Coach (31–40)", key: "mini-coach" };
  if (size <= 56) return { label: "Motorcoach (41–56)", key: "motorcoach" };
  return { label: "Multiple Vehicles / Staggered Trips", key: "multi" };
}
function calcRecommendedHours(stops: number, avgQueueMin: number, travelMin: number, dwellMin: number) {
  const bufferPickup = 15, bufferDrop = 15;
  const queue = stops * avgQueueMin;
  const travel = clamp((stops - 1) * travelMin, 0, 999);
  const dwell = stops * dwellMin;
  const totalMin = bufferPickup + queue + travel + dwell + bufferDrop;
  const hours = Math.ceil(totalMin / 60);
  return clamp(hours, 3, 10);
}

/* ===== Page ===== */
export default function HauntedHouseToursRichPage() {
  // planner state
  const [groupSize, setGroupSize] = useState(22);
  const [stops, setStops] = useState(3);
  const [avgQueue, setAvgQueue] = useState(35);
  const [travel, setTravel] = useState(20);
  const [dwell, setDwell] = useState(40);

  const recHours = useMemo(() => calcRecommendedHours(stops, avgQueue, travel, dwell), [stops, avgQueue, travel, dwell]);
  const recVehicle = useMemo(() => vehicleSuggestion(groupSize), [groupSize]);
  const quoteHref = useMemo(() => {
    const params = new URLSearchParams({ hrs: String(recHours), group: String(groupSize), event: "haunted-house-tour" }).toString();
    return `/quote#instant?${params}`;
  }, [recHours, groupSize]);

  return (
    <main className="text-slate-100 bg-[#0f1f46]">
      <HeroHeader
        pageSlug="events/haunted-house-tours"
        fallback={getHeroFallback("events/haunted-house-tours", {
          primary_cta: { label: "Instant Quote", href: quoteHref },
          secondary_cta: { label: "View Fleet", href: "/fleet" },
          tertiary_cta: { label: `Call ${PHONE_DISPLAY}`, href: `tel:${PHONE_TEL}` },
        })}
      />

      {/* INTRO + LONG-FORM CONTENT + PLANNER */}
      <section className="bg-[#122a56] py-10 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content */}
          <article className="lg:col-span-2 rounded-3xl border border-blue-800/30 bg-[#173264] p-6 shadow-xl prose prose-invert max-w-none">
            <h2 className="text-white font-serif tracking-tight">The Smart Way to Do Scare Season</h2>
            <p>
              Haunted houses are more popular than ever—and that means long lines, tight parking, and a lot of split-up
              rideshare chaos. With Bus2Ride, your crew travels together, keeps warm between stops, and rolls straight to
              the maze entrance with a driver who knows the plan. We help you sequence stops, choose the right meet-points,
              and keep the energy up with music and lighting on board. Want photos? We can stage the vehicle at the best
              set piece so you get that “we survived” shot before you head home.
            </p>
            <p>
              Not sure how many hours to book? A good rule: every stop needs time for <em>queue + walkthrough + regroup</em>.
              Popular Saturday nights can add 20–40 minutes of line time. If you’re doing two or three haunts, plan for
              food at the midpoint to keep the group happy (and warm). We’ll help fine-tune the route so you don’t waste
              time cross-town.
            </p>
            <p>
              Picking the right vehicle matters. Sprinters turn quickly in tight lots; party buses add space to mingle and
              store jackets; shuttles and motorcoaches move bigger groups without sacrificing comfort. Explore our{" "}
              <a href="/fleet" className="underline decoration-blue-300 hover:text-white">fleet</a>, or hit{" "}
              <a href={quoteHref} className="underline decoration-blue-300 hover:text-white">Instant Quote</a> to see options for
              your date. If you’re building a theme night—costume contest, “best scream” awards—tell our team and we’ll
              build in time for it.
            </p>
            <h3 className="text-white font-serif tracking-tight">Pro Tips to Max Out the Fun</h3>
            <ul>
              <li><strong>Buy timed-entry tickets</strong> where available and align your pickup time to the first entry.</li>
              <li><strong>Set meet-points</strong> 1–2 blocks away from exits to dodge traffic choke points.</li>
              <li><strong>Dress for lines</strong>: closed-toe shoes + a layer. Keep spare items onboard between stops.</li>
              <li><strong>Food first, fear second</strong>: quick eats before the longest haunt keeps morale high.</li>
              <li><strong>Photos</strong>: we’ll stage the vehicle at the best set; bring a ring light for bonus points.</li>
              <li><strong>Safety</strong>: strobe/fog sensitivity? We’ll plan quiet cooldowns between attractions.</li>
            </ul>
            <p>
              Want inspiration? Browse national haunt directories like{" "}
              <a href="https://www.hauntworld.com" target="_blank" rel="noopener noreferrer" className="underline decoration-blue-300">HauntWorld</a>{" "}
              or venue calendars at parks like{" "}
              <a href="https://fright-fest.sixflags.com/" target="_blank" rel="noopener noreferrer" className="underline decoration-blue-300">Six Flags Fright Fest</a>{" "}
              and {" "}
              <a href="https://www.universalorlando.com/web/en/us/things-to-do/events/halloween-horror-nights" target="_blank" rel="noopener noreferrer" className="underline decoration-blue-300">Halloween Horror Nights</a>.
              For safety ideas, check{" "}
              <a href="https://www.cdc.gov/family/halloween/index.htm" target="_blank" rel="noopener noreferrer" className="underline decoration-blue-300">CDC Halloween tips</a>.
              We’ll tailor the transport plan to your picks.
            </p>
            <p>
              Beyond haunted houses, our fall season favorites include <a href="/events/wine-tours" className="underline decoration-blue-300">wine tours</a>,{" "}
              <a href="/events/brewery-tours" className="underline decoration-blue-300">brewery crawls</a>,{" "}
              <a href="/events/night-out-on-the-town" className="underline decoration-blue-300">night-out routes</a>, and{" "}
              <a href="/events/holiday-lights" className="underline decoration-blue-300">holiday lights</a> once November hits.
              If you’re planning a school fright night, see our{" "}
              <a href="/events/prom" className="underline decoration-blue-300">prom & school guidelines</a> and{" "}
              <a href="/policies" className="underline decoration-blue-300">full policies</a>.
            </p>
            <p>
              Ready to lock it in? Hit{" "}
              <a href={quoteHref} className="underline decoration-blue-300">Instant Quote</a>, call{" "}
              <a href={`tel:${PHONE_TEL}`} className="underline decoration-blue-300">{PHONE_DISPLAY}</a>, or{" "}
              <a href={`mailto:${EMAIL}`} className="underline decoration-blue-300">email us</a>. We make the ride part of the
              show—so the scary part stays where it belongs.
            </p>
          </article>

          {/* Planner */}
          <aside className="rounded-3xl border border-blue-800/30 bg-[#173264] p-6 shadow-xl">
            <h3 className="text-2xl font-extrabold text-white font-serif tracking-tight mb-1">Quick Planner</h3>
            <p className="text-blue-100/90 text-sm mb-4">Estimate hours + best vehicle for your group.</p>
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm text-blue-100/90">Group size</span>
                <input type="number" min={1} max={200} value={groupSize} onChange={(e)=>setGroupSize(clamp(parseInt(e.target.value||"0",10),1,200))} className="mt-1 w-full rounded-xl bg-[#0f1f46] border border-blue-800/40 px-4 py-2 text-white"/>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm text-blue-100/90">Haunted houses</span>
                  <input type="number" min={1} max={6} value={stops} onChange={(e)=>setStops(clamp(parseInt(e.target.value||"0",10),1,6))} className="mt-1 w-full rounded-xl bg-[#0f1f46] border border-blue-800/40 px-4 py-2 text-white"/>
                </label>
                <label className="block">
                  <span className="text-sm text-blue-100/90">Avg. queue per stop (min)</span>
                  <input type="number" min={10} max={120} value={avgQueue} onChange={(e)=>setAvgQueue(clamp(parseInt(e.target.value||"0",10),10,120))} className="mt-1 w-full rounded-xl bg-[#0f1f46] border border-blue-800/40 px-4 py-2 text-white"/>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm text-blue-100/90">Travel between stops (min)</span>
                  <input type="number" min={5} max={60} value={travel} onChange={(e)=>setTravel(clamp(parseInt(e.target.value||"0",10),5,60))} className="mt-1 w-full rounded-xl bg-[#0f1f46] border border-blue-800/40 px-4 py-2 text-white"/>
                </label>
                <label className="block">
                  <span className="text-sm text-blue-100/90">On-site time per stop (min)</span>
                  <input type="number" min={20} max={90} value={dwell} onChange={(e)=>setDwell(clamp(parseInt(e.target.value||"0",10),20,90))} className="mt-1 w-full rounded-xl bg-[#0f1f46] border border-blue-800/40 px-4 py-2 text-white"/>
                </label>
              </div>
              <div className="rounded-2xl bg-[#122a56] border border-blue-800/40 p-4">
                <div className="text-sm text-blue-100/90">Recommended Duration</div>
                <div className="text-3xl font-extrabold text-white mt-1">{recHours} hours</div>
                <div className="mt-3 text-sm text-blue-100/90">Suggested Vehicle</div>
                <div className="text-lg font-bold text-white">{recVehicle.label}</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a href={quoteHref} className="rounded-xl bg-blue-600 text-white px-4 py-2 font-semibold border border-blue-700 hover:bg-blue-700">Get Quote</a>
                  <a href="/fleet#party-bus" className="rounded-xl bg-white text-blue-900 px-4 py-2 font-semibold border border-blue-200 hover:bg-blue-50">See Party Buses</a>
                </div>
              </div>
              <p className="text-[11px] text-blue-200/80 mt-2">Estimates only; availability, traffic, and venue rules affect final routing and price.</p>
            </div>
          </aside>
        </div>
      </section>

      {/* VEHICLE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white font-serif tracking-tight text-center mb-4">Popular Vehicles for Fright Night</h2>
        <p className="text-center text-blue-100/80 max-w-3xl mx-auto mb-8">
          Pulled straight from our vehicles1 library. Cards rotate automatically so you can see which party buses,
          shuttles, and coaches fit spooky season groups.
        </p>
        <RotatingVehicleShowcase />
        <div className="text-center mt-8">
          <a href="/fleet" className="inline-flex items-center justify-center rounded-full px-8 py-3 font-bold bg-blue-600 text-white border border-blue-700 hover:bg-blue-700">
            Browse Full Fleet
          </a>
        </div>
      </section>

      {/* EVENT PICKER (Internal linking) */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="rounded-3xl border border-blue-800/30 bg-[#173264] p-6 shadow-xl">
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight mb-3">More Event Types</h2>
          <p className="text-blue-100/90 mb-8">Six hand-picked event cards straight from the main Events experience—two rows of inspiration with built-in CTAs.</p>
          <FeaturedEventsGrid limit={6} />
        </div>
      </section>

      {/* POLLS SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="rounded-3xl border border-blue-800/30 bg-gradient-to-br from-[#122a5c] to-[#0f2148] p-6 md:p-10 shadow-xl">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">Live rider intel</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-white font-serif tracking-tight">Polls powering fright season</h2>
            <p className="mt-3 text-blue-100/85 max-w-3xl mx-auto">
              Same layout as the homepage: three columns, three polls each, refreshed straight from the API with live vote counts.
              Tap any tile to deep-dive haunted demand, night-out timing, and BYOB policies.
            </p>
          </div>
          <HomePolls
            groups={[
              { tag: "haunted-house", label: "Haunted" },
              { tag: "night-out", label: "Night Out" },
              { tag: "holiday", label: "Seasonal" },
            ]}
            variant="columns"
            pickSize={24}
            visiblePerGroup={12}
          />
          <div className="text-center mt-10">
            <a href="/polls?tag=haunted-house" className="inline-flex items-center justify-center rounded-full px-8 py-3 font-bold bg-white text-blue-900 border border-blue-200 hover:bg-blue-50">
              More polls
            </a>
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <GlobalReviewStripClient />

      {/* TOOLS (registry) */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="bg-[#122a56] border border-blue-800/30 rounded-3xl shadow-xl px-6 md:px-8 py-10">
          <h2 className="text-3xl font-extrabold text-center text-white font-serif tracking-tight mb-3">Planning Tools</h2>
          <p className="text-blue-200 text-center max-w-3xl mx-auto mb-6">Budget, group size, stops, and BYOB guidelines—quick utilities to make haunted nights simple.</p>
          <ToolsGrid limit={6} randomize={true} />
          <div className="text-center mt-6">
            <a href="/resources" className="inline-flex items-center justify-center rounded-full px-8 py-3 font-bold bg-white text-blue-900 border border-blue-200 hover:bg-blue-50">All Resources</a>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <HauntedFaqSection />

      {/* CTA RIBBON */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-12">
        <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-800 border border-blue-400/30 shadow-[0_6px_18px_-2px_rgba(0,0,0,.4)] p-6 md:p-7 text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white font-serif tracking-tight mb-2">Ready to ride?</h3>
          <p className="text-blue-100/90 mb-4">Lock in your haunted itinerary before the crowds. Weekends fill up fast.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={quoteHref} className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center bg-white text-blue-900 border-blue-200 hover:bg-blue-50">⚡ Get Instant Quote</a>
            <a href="/contact" className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center bg-blue-600 text-white border-blue-700 hover:bg-blue-700">Talk to a Planner</a>
            <a href="/fleet" className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center bg-blue-800 text-white border-blue-900 hover:bg-blue-900">See Vehicles</a>
          </div>
        </div>
      </section>
    </main>
  );
}

