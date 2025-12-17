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

type ScareStyleKey = "chill" | "classic" | "fullsend";

const SCARE_STYLES: Record<
  ScareStyleKey,
  {
    label: string;
    tagline: string;
    hours: string;
    details: string;
    bullets: string[];
  }
> = {
  chill: {
    label: "Chill & Spooky",
    tagline: "One haunt, cozy bus vibes, and home by midnight.",
    hours: "3–4 hours",
    details:
      "Perfect for first-timers, date nights, or families with teens who want the scares without the exhaustion.",
    bullets: [
      "1 main haunted house + optional photo stop",
      "Short line or timed-entry tickets",
      "Snacks + playlists on the bus instead of bar-hopping",
    ],
  },
  classic: {
    label: "Classic Crawl",
    tagline: "Two haunts, a food stop, and non-stop screaming in between.",
    hours: "4–6 hours",
    details:
      "Our most common haunted night: enough time to hit two big attractions, regroup over food, and still have energy to laugh about it on the ride back.",
    bullets: [
      "2 haunted houses in the same general area",
      "Quick-service food stop in the middle",
      "Time for group photos, bathroom breaks, and a surprise detour",
    ],
  },
  fullsend: {
    label: "Full Send Insanity",
    tagline: "Three haunts, max chaos, everyone loses their voice.",
    hours: "6–8 hours",
    details:
      "For hardcore haunt hunters, birthdays, or friend groups who want the whole night to feel like a movie. You’ll want the extra bus time to recover between scares.",
    bullets: [
      "3 haunts or 2 massive attractions + bar/arcade stop",
      "Built-in buffer for long lines and traffic",
      "Perfect for costumes, contests, and 'last haunt standing' challenges",
    ],
  },
};

const HAUNT_CITY_DATA = [
  {
    city: "Los Angeles",
    region: "Southern California",
    picks: [
      { name: "Universal Horror Nights", vibe: "Blockbuster IPs, movie-caliber sets", tip: "Spring for Express passes on Fridays" },
      { name: "LA Haunted Hayride", vibe: "Outdoor trail + carnival midway", tip: "Plan for dusty paths—closed-toe shoes" },
      { name: "Delusion", vibe: "Interactive theatre + actors", tip: "Great add-on for smaller squads that love puzzles" },
    ],
  },
  {
    city: "Chicago",
    region: "Midwest",
    picks: [
      { name: "Nightmare on Clark Street", vibe: "Multi-level bar haunt", tip: "Book a table for post-scare drinks" },
      { name: "13th Floor Chicago", vibe: "High production scares", tip: "Pairs well with nearby rooftop bars" },
      { name: "HellsGate", vibe: "Forest approach + mansion", tip: "Add buffer for shuttle ride from parking lot" },
    ],
  },
  {
    city: "Dallas",
    region: "Texas",
    picks: [
      { name: "Dark Hour", vibe: "Hollywood-level set changes", tip: "Great for indoor nights when the weather flips" },
      { name: "Cutting Edge", vibe: "Guinness-record long maze", tip: "Hydrate on the bus; it’s a legit workout" },
      { name: "Screams Halloween Park", vibe: "Renaissance fairgrounds gone spooky", tip: "Parking is chaos—bus drop-offs save 30+ minutes" },
    ],
  },
];

const GALLERY_IMAGES = [
  {
    src: "/images/party-buses/30 Passenger Party Bus Exterior.png",
    alt: "Party bus staged outside haunted maze",
  },
  {
    src: "/images/party-buses/36 Passenger Party Bus Inside.png",
    alt: "Interior LEDs set to blood-red theme",
  },
  {
    src: "/images/party-buses/18 Passenger White Party Bus Exterior.png",
    alt: "Sprinter ready for scare night pickup",
  },
  {
    src: "/images/party-buses/30 Passenger Party Bus Exterior.png",
    alt: "Motorcoach under fog machines",
  },
];

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

function HauntedHeroPhotoStrip() {
  const photos = [
    { src: "/images/party-buses/30 Passenger Party Bus Exterior.png", alt: "Party bus outside a haunted attraction" },
    { src: "/images/party-buses/36 Passenger Party Bus Inside.png", alt: "Party bus interior lighting before the haunt" },
    { src: "/images/party-buses/18 Passenger White Party Bus Exterior.png", alt: "Sprinter pickup for haunted house night" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <div className="rounded-3xl border border-blue-800/30 bg-[#0b1329] p-5 md:p-7 shadow-xl overflow-hidden">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Visual preview</p>
            <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-white">What "Fright Night" looks like with a private ride</h2>
            <p className="mt-2 text-sm text-blue-100/80 max-w-2xl">
              Placeholder images for now. We'll swap these for real seasonal shots once the gallery library is ready.
            </p>
          </div>
          <a href="/fleet" className="text-sm font-semibold text-blue-200 hover:text-white">Browse fleet →</a>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {photos.map((p) => (
            <figure key={p.alt} className="rounded-2xl border border-blue-800/40 bg-[#050b19] shadow-lg overflow-hidden">
              <SmartImage src={p.src} alt={p.alt} className="w-full h-56 object-cover" />
              <figcaption className="p-3 text-xs text-blue-100/80">{p.alt}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
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

function ScareStyleSection() {
  const [selected, setSelected] = useState<ScareStyleKey>("classic");
  const active = SCARE_STYLES[selected];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 pt-6 pb-4">
      <div className="rounded-3xl border border-blue-800/40 bg-gradient-to-r from-[#121f45] via-[#0c1634] to-[#050b1f] p-6 md:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">Pick your poison</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-extrabold text-white font-serif tracking-tight">What kind of haunted night are you planning?</h2>
            <p className="mt-2 text-sm md:text-base text-blue-100/85 max-w-xl">Choose a style below. We’ll show a typical hours range and how groups usually structure the night with the bus.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(SCARE_STYLES) as ScareStyleKey[]).map((key) => {
              const style = SCARE_STYLES[key];
              const isActive = key === selected;
              return (
                <button
                  key={key}
                  onClick={() => setSelected(key)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold border transition ${
                    isActive
                      ? "bg-white text-blue-900 border-blue-200 shadow-lg"
                      : "bg-white/5 text-blue-100 border-white/15 hover:bg-white/10"
                  }`}
                >
                  {style.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
          <div className="rounded-2xl border border-white/12 bg-white/5 p-5 md:p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-blue-200/80 mb-2">Recommended duration</p>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-3xl font-extrabold text-white">{active.hours}</span>
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">{active.tagline}</span>
            </div>
            <p className="text-sm text-blue-100/90 mb-4">{active.details}</p>
            <ul className="space-y-2 text-sm text-blue-100/90">
              {active.bullets.map((b, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-[6px] h-[6px] w-[6px] rounded-full bg-emerald-400 flex-shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-blue-700/60 bg-[#050b24] p-5 md:p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-blue-300/80 mb-2">How this fits Bus2Ride</p>
            <p className="text-sm text-blue-100/90 mb-3">
              Use this as a vibe check against the <span className="font-semibold text-white">Quick Planner</span> above. If your group size or number of stops doesn’t line up with this range, we’ll tweak the route.
            </p>
            <ul className="space-y-2 text-sm text-blue-100/85">
              <li>• Share this style in your <a href="#instant" className="underline decoration-blue-300 hover:text-white">Instant Quote</a> notes so your planner knows what you’re going for.</li>
              <li>• Mix-and-match: start chill, end full send, or vice versa.</li>
              <li>• Have multiple age groups? We’ll design a route that works for everyone.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

type SampleItinerary = {
  label: string;
  blurb: string;
  items: string[];
};

const ITINERARIES: SampleItinerary[] = [
  {
    label: "Date Night + One Big Haunt",
    blurb: "Simple, cinematic, and back before the babysitter gets annoyed.",
    items: [
      "6:30 PM — Pickup at home or restaurant",
      "7:00 PM — Arrive at haunted house (timed-entry tickets)",
      "7:15–8:15 PM — Haunted walkthrough + photos",
      "8:30 PM — Late dessert or coffee stop",
      "9:30–10:00 PM — Drop-off and 'we survived' recap on the bus",
    ],
  },
  {
    label: "Friends’ Night Out Crawl",
    blurb: "Two haunts, one food stop, and a lot of scream-laughing.",
    items: [
      "7:00 PM — Pickup at central meet spot",
      "7:45 PM — Haunt #1 (shorter line or warm-up scare)",
      "9:00 PM — Food stop / bar with space for a big group",
      "10:15 PM — Haunt #2 (the big one with the long line)",
      "11:45 PM — Drop-off loop home or at an after-party spot",
    ],
  },
  {
    label: "Birthday / Full Send",
    blurb: "Costumes, contests, three stops, and a hero’s welcome ride home.",
    items: [
      "6:00 PM — Pickup with music + decorations on the bus",
      "6:45 PM — Haunt #1 (photo-heavy, good lighting)",
      "8:00 PM — Dinner or arcade / bar stop",
      "9:30 PM — Haunt #2 (most intense attraction of the night)",
      "11:00 PM — Scenic drive or bonus stop if everyone’s still alive",
      "12:00 AM — Final drop-offs and last group photos onboard",
    ],
  },
];

function SampleItinerariesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <div className="rounded-3xl border border-blue-800/30 bg-[#101f3c] p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">Real-world timelines</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-extrabold text-white font-serif tracking-tight">Sample haunted house itineraries</h2>
            <p className="mt-2 text-sm md:text-base text-blue-100/85 max-w-xl">Use these as a starting point. Drop your favorite version into the quote form and we’ll tune it to your city, haunts, and group size.</p>
          </div>
          <div className="text-xs md:text-sm text-blue-200/80">Times are examples only — traffic, venue rules, and your haunts change the details.</div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {ITINERARIES.map((it, idx) => (
            <article
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 md:px-5 md:py-6 flex flex-col shadow-[0_16px_40px_rgba(3,7,18,0.6)]"
            >
              <h3 className="text-lg font-semibold text-white mb-1">{it.label}</h3>
              <p className="text-sm text-blue-100/90 mb-4">{it.blurb}</p>
              <ul className="space-y-2 text-sm text-blue-100/90 flex-1">
                {it.items.map((line, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-[6px] h-[6px] w-[6px] rounded-full bg-blue-300 flex-shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TopHauntsPlaceholder() {
  const [cityIdx, setCityIdx] = useState(0);
  const city = HAUNT_CITY_DATA[cityIdx] || HAUNT_CITY_DATA[0];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <div className="rounded-3xl border border-blue-800/40 bg-gradient-to-br from-[#0e1b3c] to-[#060b1f] p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">Top haunts near you</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-extrabold text-white font-serif tracking-tight">Plug in your city—we’ll swap in local intel</h2>
            <p className="mt-2 text-sm text-blue-100/85 max-w-2xl">Below is placeholder data; once the haunt API is wired up, these cards will auto-update based on your quote form location.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {HAUNT_CITY_DATA.map((entry, idx) => (
              <button
                key={entry.city}
                onClick={() => setCityIdx(idx)}
                className={`rounded-full px-4 py-2 text-sm font-semibold border transition ${
                  idx === cityIdx
                    ? "bg-white text-blue-900 border-blue-200 shadow-lg"
                    : "bg-white/5 text-blue-100 border-white/15 hover:bg-white/10"
                }`}
              >
                {entry.city}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/5 p-5 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-blue-200/80">Current focus</p>
              <h3 className="text-2xl font-bold text-white">{city.city}</h3>
              <p className="text-sm text-blue-100/80">{city.region}</p>
            </div>
            <div className="text-xs text-blue-200/70">API ready · we’ll hydrate this with live haunt feeds soon</div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {city.picks.map((pick) => (
              <article key={pick.name} className="rounded-2xl border border-white/10 bg-[#091630]/90 p-4">
                <p className="text-sm uppercase tracking-[0.25em] text-blue-300/70">Featured haunt</p>
                <h4 className="text-lg font-semibold text-white mt-1">{pick.name}</h4>
                <p className="text-sm text-blue-100/85 mt-2">{pick.vibe}</p>
                <p className="mt-3 text-xs text-blue-200/80">Tip: {pick.tip}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HauntedRouteIntelStrip() {
  const cards = [
    {
      title: "Pickup Plan",
      desc: "We set clean meet-points so your group doesn't scatter in rideshares.",
      img: "/images/party-buses/18 Passenger White Party Bus Exterior.png",
    },
    {
      title: "Warm + Recover Between Stops",
      desc: "Lines are brutal. Your ride stays comfy with music + lighting in between.",
      img: "/images/party-buses/36 Passenger Party Bus Inside.png",
    },
    {
      title: "Drop-Off Advantage",
      desc: "Most haunts have parking chaos—private drop-offs save time and headaches.",
      img: "/images/party-buses/30 Passenger Party Bus Exterior.png",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <div className="rounded-3xl border border-blue-800/30 bg-[#0b1329] p-6 md:p-8 shadow-xl">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Route intel</p>
            <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-white">How we run haunted nights</h2>
            <p className="mt-2 text-sm text-blue-100/80 max-w-2xl">
              These are the pieces that make the night smooth: meet-points, timing buffers, and the keep everyone together plan.
            </p>
          </div>
          <a href="/quote#instant" className="text-sm font-semibold text-blue-200 hover:text-white">Instant Quote →</a>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((c) => (
            <article key={c.title} className="rounded-2xl border border-blue-800/40 bg-[#050b19] overflow-hidden shadow-lg">
              <SmartImage src={c.img} alt={c.title} className="w-full h-44 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-bold text-white">{c.title}</h3>
                <p className="mt-2 text-sm text-blue-100/85">{c.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function VehicleCategoryRow({
  title,
  subtitle,
  category,
  limit,
  href,
}: {
  title: string;
  subtitle: string;
  category: "party-buses" | "limousines" | "coach-buses";
  limit: number;
  href: string;
}) {
  const vehicles = useMemo(() => {
    const resolved = resolveVehicles(findByFileName);
    return resolved
      .filter((v) => v.category === category)
      .slice(0, limit)
      .map((vehicle) => {
        const capacity =
          vehicle.capacityMin === vehicle.capacityMax
            ? `${vehicle.capacityMax} riders`
            : `${vehicle.capacityMin}–${vehicle.capacityMax} riders`;
        const highlight = vehicle.highlights.slice(0, 2).join(" · ");
        const desc = highlight ? `${capacity}. ${highlight}.` : capacity;

        return {
          id: vehicle.id,
          title: vehicle.name,
          desc,
          image: vehicle.primary?.entry?.original || VEHICLE_FALLBACK_IMAGE,
        };
      });
  }, [category, limit]);

  if (!vehicles.length) return null;

  return (
    <div className="rounded-3xl border border-blue-800/30 bg-[#101f3c] p-6 md:p-8 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">Popular picks</p>
          <h3 className="mt-2 text-2xl md:text-3xl font-extrabold text-white font-serif tracking-tight">{title}</h3>
          <p className="mt-2 text-sm text-blue-100/80 max-w-2xl">{subtitle}</p>
        </div>
        <a href={href} className="text-sm font-semibold text-blue-200 hover:text-white">See all →</a>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {vehicles.map((v) => (
          <article key={v.id} className="rounded-2xl border border-blue-800/30 bg-[#173264] p-4 shadow-xl flex flex-col">
            <SmartImage src={v.image} alt={v.title} className="w-full h-44 object-cover rounded-2xl border border-blue-800/40 mb-4" />
            <h4 className="text-lg font-bold text-white">{v.title}</h4>
            <p className="text-sm text-blue-100/90 mt-1 flex-1">{v.desc}</p>
            <a
              href={href}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-blue-600 text-white border border-blue-700 px-4 py-2 font-semibold hover:bg-blue-700"
            >
              View options →
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}

function HauntedLinksSection() {
  const internal = [
    { label: "Instant Quote", href: "/quote#instant" },
    { label: "Browse Fleet", href: "/fleet" },
    { label: "All Events", href: "/events" },
    { label: "Planning Tools", href: "/resources" },
    { label: "Policies & Guidelines", href: "/policies" },
  ];

  const external = [
    { label: "HauntWorld (directory)", href: "https://www.hauntworld.com" },
    { label: "HauntedHouseOnline (directory)", href: "https://www.hauntedhouseonline.com" },
    { label: "Universal Halloween Horror Nights", href: "https://www.universalstudioshollywood.com/hhn/" },
    { label: "Six Flags Fright Fest", href: "https://fright-fest.sixflags.com/" },
    { label: "CDC Halloween Safety Tips", href: "https://www.cdc.gov/family/halloween/index.htm" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <div className="rounded-3xl border border-blue-800/30 bg-[#101f3c] p-6 md:p-8 shadow-xl">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">Keep planning</p>
            <h3 className="mt-2 text-xl font-bold text-white">Helpful pages on Bus2Ride</h3>
            <ul className="mt-4 space-y-2 text-sm text-blue-100/90">
              {internal.map((l) => (
                <li key={l.href}>
                  <a className="underline decoration-blue-300 hover:text-white" href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">Do your haunt research</p>
            <h3 className="mt-2 text-xl font-bold text-white">External resources</h3>
            <ul className="mt-4 space-y-2 text-sm text-blue-100/90">
              {external.map((l) => (
                <li key={l.href}>
                  <a className="underline decoration-blue-300 hover:text-white" href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[11px] text-blue-200/75">
              External links are for convenience. Bus2Ride isn't affiliated with these sites.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function StickyPlanBar({ quoteHref }: { quoteHref: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 px-4 pointer-events-none z-40">
      <div className="max-w-4xl mx-auto pointer-events-auto rounded-3xl border border-blue-500/40 bg-[#050b19]/95 backdrop-blur-lg shadow-[0_20px_60px_rgba(5,10,25,0.65)] px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">Ready when you are</p>
          <p className="text-sm text-blue-100/85">Lock your haunted itinerary now—planners respond in under 5 minutes.</p>
        </div>
        <div className="flex gap-3 flex-col sm:flex-row">
          <a href={quoteHref} className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold bg-white text-blue-900 border border-blue-200 hover:bg-blue-50">⚡ Plan my haunted night</a>
          <a href="tel:8885352566" className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold text-white border border-white/30 hover:bg-white/10">Call {PHONE_DISPLAY}</a>
        </div>
      </div>
    </div>
  );
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

      <HauntedHeroPhotoStrip />

      <ScareStyleSection />

      <SampleItinerariesSection />

      {/* VEHICLE SHOWCASE (three rows by category) */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-6">
        <VehicleCategoryRow
          title="Party Buses for Fright Night"
          subtitle="Big energy, big lighting, jackets + costumes stay onboard. Great for groups that want the ride to feel like part of the show."
          category="party-buses"
          limit={3}
          href="/fleet#party-bus"
        />

        <VehicleCategoryRow
          title="Limousines for Date Nights + Small Crews"
          subtitle="Quiet, classy, and fast pickups—perfect for one main haunt + dessert stop without the chaos."
          category="limousines"
          limit={3}
          href="/fleet#limousines"
        />

        <VehicleCategoryRow
          title="Coach Buses for Large Groups"
          subtitle="Corporate teams, big friend groups, and school events—move everyone together with luggage space and a calm ride between stops."
          category="coach-buses"
          limit={3}
          href="/fleet#coach"
        />
      </section>

      <TopHauntsPlaceholder />

      {/* EVENT PICKER (Internal linking) */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="rounded-3xl border border-blue-800/30 bg-[#173264] p-6 shadow-xl">
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight mb-3">More Event Types</h2>
          <p className="text-blue-100/90 mb-8">Six hand-picked event cards straight from the main Events experience—two rows of inspiration with built-in CTAs.</p>
          <FeaturedEventsGrid limit={6} />
        </div>
      </section>

      <HauntedRouteIntelStrip />

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

      <HauntedLinksSection />

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

