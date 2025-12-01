"use client";
import React, { useState } from "react";
import Link from "next/link";
import PageLayout from "../../../components/PageLayout";
import Section from "../../../components/Section";
import WhyRentWithUs from "../../../components/WhyRentWithUs";
import ToolsSlider from "../../../components/ToolsSlider";
import LiveWeatherAdvisor from "../../../components/LiveWeatherAdvisor"; // will wrap & constrain
import AnchorageVehicleSlider from "../../../components/AnchorageVehicleSlider";
import { SmartImage } from "../../../components/SmartImage";
import HomePolls from "../../../components/HomePolls";
import EventsSection from "../../../components/EventsSection";
import VehicleGalleryCard from "../../../components/VehicleGalleryCard";
import ReviewsSearchSection, { SimpleReview } from "../../../components/polls/ReviewsSearchSection";
import { findState, slugifyState } from "../locationData";
import { getStateContent } from "../stateContent";
import type { HomepageVehicle } from "../../../types/homepageVehicles";

const anchorageNeighborhoods = [
  "Downtown","Midtown","South Anchorage","Hillside","Airport / Spenard","Turnagain","Government Hill","University / UMed","Muldoon","Eagle River (extension)"
];
const auroraTips = [
  "Best viewing is usually 10:30 PM – 1:30 AM away from city glow.",
  "Have a flexible driver window; cloud breaks can shift 30–60 miles.",
  "Dress in layered synthetics + insulated boots (interior cools fast when doors open).",
  "Use red headlamps inside vehicle to preserve night vision.",
  "Bring spare battery packs—cold drains phones & DSLR batteries quickly."
];

const WEATHER_CHIPS = [
  { label: "Sunrise", value: "10:06 AM", note: "Plan daylight staging." },
  { label: "Sunset", value: "3:47 PM", note: "Golden hour hits early." },
  { label: "Snow depth", value: "6-12\"", note: "Downtown berms shrink lanes." },
  { label: "Wind", value: "12 mph N", note: "Feels colder on docks." }
];

const ROAD_CONDITIONS = [
  {
    route: "Seward Hwy (AK-1)",
    status: "Patchy refreeze",
    detail: "Bird Point & Turnagain curves ice over after 9 PM. Keep 5-8 min buffer.",
  },
  {
    route: "Glenn Hwy",
    status: "Bare / wet",
    detail: "Mat-Su winds kick up drifting snow past Eagle River."
  },
  {
    route: "Alyeska Hwy",
    status: "Snow-packed",
    detail: "Slow at mile 2 switchback; gravel improves traction."
  },
];

const AURORA_CASES = [
  {
    label: "Corporate summit",
    stat: "+30 min standby",
    summary:
      "Board stayed at Hotel Captain Cook; we padded the return loop so execs could hop back out when KP jumped to 5.",
  },
  {
    label: "Cruise turnover",
    stat: "Dual-coach convoy",
    summary:
      "Disembark in Whittier, aurora chase that night—two coaches staged with separate heaters so luggage never left sight.",
  },
  {
    label: "Wedding after-party",
    stat: "3-stop warmups",
    summary:
      "Shuttled guests between brewery, lookout, and lodge. Added cocoa + blanket bins to keep gowns photo-ready.",
  },
  {
    label: "Photo crew",
    stat: "Gear-priority layout",
    summary:
      "Removed two seats in the sprinter and mounted battery inverters so the production team could edit between stops.",
  },
];

const anchorageReviewHighlights: SimpleReview[] = [
  {
    id: "kara",
    author: "Kara M.",
    body: "Winter corporate shuttle—driver pre-heated the bus & tracked our delayed ANC flight so no one waited in the cold.",
    rating: 5,
    source: "Corporate Shuttle",
  },
  {
    id: "brian",
    author: "Brian S.",
    body: "Cruise transfer ANC hotel → Whittier with glacier photo stop. Dispatch built the tunnel timing so it felt calm.",
    rating: 5,
    source: "Cruise Transfer",
  },
  {
    id: "lia",
    author: "Lia R.",
    body: "Prom party bus was spotless. Lighting + sound were incredible and the adults felt totally in control.",
    rating: 5,
    source: "Prom Loop",
  },
  {
    id: "owen",
    author: "Owen P.",
    body: "Aurora chase extended an hour—dispatch approved within minutes when KP jumped. Worth every mile north.",
    rating: 5,
    source: "Aurora Charter",
  },
  {
    id: "samantha",
    author: "Samantha T.",
    body: "Wedding guest loop between hotel + venue ran early, zero confusion even for out-of-towners in tuxes.",
    rating: 5,
    source: "Wedding Weekend",
  },
  {
    id: "joel",
    author: "Joel K.",
    body: "Fishing group charter had room for all coolers—driver helped stage loading efficiently and kept heaters running.",
    rating: 5,
    source: "Fishing Charter",
  },
];

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const helperTools = [
  {
    title: "⚡ Instant Quote Tool",
    desc: "Get a real-time quote for your trip in seconds. No hidden fees.",
    href: "/quote",
  },
  {
    title: "🚌 Vehicle Capacity Finder",
    desc: "Enter your group size and see which vehicles fit best.",
    href: "/tools",
  },
  {
    title: "💸 Cost Split Calculator",
    desc: "Know your per-person cost instantly by entering the total and group size.",
    href: "/tools",
  },
  {
    title: "📅 Date Price Checker",
    desc: "See how prices change by date, season, or holiday.",
    href: "/tools",
  },
  {
    title: "🧭 Distance & Buffer Helper",
    desc: "Smart time padding for Alaska routes & conditions.",
    href: "/tools",
  },
  {
    title: "📍 Zip Code Price Lookup",
    desc: "Find pricing for your city or zip code instantly.",
    href: "/tools",
  },
];

const HOW_TO_BOOK_STEPS = [
  {
    step: "01",
    label: "Share Trip Details",
    icon: "🗺️",
    copy: "Tell us your pickup windows, passenger count, luggage, and any aurora or cruise timing flex.",
    detail:
      "Our Anchorage team plugs in your airports, hotel blocks, and buffer preferences so every quote already accounts for weather, tunnels, and port surges.",
  },
  {
    step: "02",
    label: "Review Your Quote",
    icon: "💬",
    copy: "We send a written, all-in quote with buffers baked in for Anchorage roads and weather.",
    detail:
      "Line-item clarity: vehicle type, minimum hours, gratuity, fuel, and overtime policy—no surprise line items later.",
  },
  {
    step: "03",
    label: "Reserve & Prep",
    icon: "📝",
    copy: "Approve digitally, place your deposit, and we dispatch the right vehicle and chauffeur.",
    detail:
      "Once reserved, we stage the vehicle with block heaters, gear racks, and itinerary notes so it is ready for Alaska-specific conditions.",
  },
  {
    step: "04",
    label: "Final Check & Ride",
    icon: "🧭",
    copy: "48 hours out we confirm manifests, share driver info, and monitor airport/cruise feeds.",
    detail:
      "Day-of, you get live driver contact, tracking on flight or cruise changes, and dispatch support for any last-minute pivots.",
  },
];

type FleetCategoryKey = "party" | "limo" | "coach";
type WhyCardPoint = { label: string; detail: string };
type WhyCardContent = { title: string; description: string; points: WhyCardPoint[] };
type WhyModalPayload = { title: string; label: string; detail: string };

const anchoragePartyFleet: HomepageVehicle[] = [
  {
    id: "anc-party-32",
    name: "32 Passenger Party Bus",
    category: "party-buses",
    capacityMin: 32,
    capacityMax: 32,
    amenities: ["Hourly & flat-rate", "LED glow interior", "Pro driver included", "BYOB friendly"],
    imageUrl: "/images/party-buses/32 Passenger Party Bus Exterior Lux.png",
    secondaryImageUrl: "/images/party-buses/32 Passenger Party Bus Interior Lux.png",
    thirdImageUrl: "/images/party-buses/32 Passenger Party Bus Interior Lux.png",
  },
  {
    id: "anc-party-22",
    name: "22 Passenger Party Bus",
    category: "party-buses",
    capacityMin: 22,
    capacityMax: 22,
    amenities: ["Chauffeur included", "Plug-n-play music", "Chilled coolers", "BYOB friendly"],
    imageUrl: "/images/party-buses/22 Passenger Party Bus Exterior Lux.png",
    secondaryImageUrl: "/images/party-buses/22 Passenger Party Bus Interior Lux.png",
    thirdImageUrl: "/images/party-buses/22 Passenger Party Bus Interior Lux.png",
  },
  {
    id: "anc-party-36",
    name: "36 Passenger Party Bus",
    category: "party-buses",
    capacityMin: 36,
    capacityMax: 36,
    amenities: ["Premium sound", "Privacy shades", "USB + outlets", "Room to dance"],
    imageUrl: "/images/party-buses/36 Passenger Party Bus Exterior Lux.png",
    secondaryImageUrl: "/images/party-buses/36 Passenger Party Bus Interior Lux.png",
    thirdImageUrl: "/images/party-buses/36 Passenger Party Bus Interior Lux.png",
  },
];

const anchorageLimoFleet: HomepageVehicle[] = [
  {
    id: "anc-limo-12-sprinter",
    name: "12 Passenger Executive Sprinter Van",
    category: "limousines",
    capacityMin: 12,
    capacityMax: 12,
    amenities: ["Leather captain chairs", "USB + outlets", "Privacy divider", "Chauffeur included"],
    imageUrl: "/images/executive-sprinters/12 Passenger Executive Sprinter Exterior Lux.png",
    secondaryImageUrl: "/images/executive-sprinters/12 Passenger Executive Sprinter Interior Lux.png",
    thirdImageUrl: "/images/executive-sprinters/12 Passenger Executive Sprinter Interior Lux.png",
  },
  {
    id: "anc-limo-18-escalade",
    name: "18 Passenger Escalade Limo",
    category: "limousines",
    capacityMin: 18,
    capacityMax: 18,
    amenities: ["Disco ceiling", "Champagne wells", "Bluetooth audio", "Red-carpet arrivals"],
    imageUrl: "/images/limousines/18 Passenger Escalade Limo Exterior Lux.png",
    secondaryImageUrl: "/images/limousines/18 Passenger Escalade Limo Interior Lux.png",
    thirdImageUrl: "/images/limousines/18 Passenger Escalade Limo Interior Lux.png",
  },
  {
    id: "anc-limo-14-nav",
    name: "14 Passenger Executive Sprinter Van",
    category: "limousines",
    capacityMin: 14,
    capacityMax: 14,
    amenities: ["Starlight ceiling", "Captain seating", "Partition door", "Pro chauffeur"],
    imageUrl: "/images/executive-sprinters/14 Passenger Executive Sprinter Exterior Lux.png",
    secondaryImageUrl: "/images/executive-sprinters/14 Passenger Executive Sprinter Interior Lux.png",
    thirdImageUrl: "/images/executive-sprinters/14 Passenger Executive Sprinter Interior Lux.png",
  },
];

const anchorageCoachFleet: HomepageVehicle[] = [
  {
    id: "anc-coach-48",
    name: "48 Passenger Coach Bus",
    category: "coach-buses",
    capacityMin: 48,
    capacityMax: 48,
    amenities: ["Forward seating", "Overhead storage", "Climate control", "USB power"],
    imageUrl: "/images/coach-buses/48 Passenger Coach Bus Exterior Lux.png",
    secondaryImageUrl: "/images/coach-buses/48 Passenger Coach Bus Interior Lux.png",
    thirdImageUrl: "/images/coach-buses/48 Passenger Coach Bus Interior Lux.png",
  },
  {
    id: "anc-coach-50",
    name: "50 Passenger Coach Bus",
    category: "coach-buses",
    capacityMin: 50,
    capacityMax: 50,
    amenities: ["Under-floor luggage", "Reading lights", "PA system", "Rest stop planning"],
    imageUrl: "/images/coach-buses/50 Passenger Coach Bus Exterior Lux.png",
    secondaryImageUrl: "/images/coach-buses/50 Passenger Coach Bus Interior Lux.png",
    thirdImageUrl: "/images/coach-buses/50 Passenger Coach Bus Interior Lux.png",
  },
  {
    id: "anc-coach-56",
    name: "56 Passenger Coach Bus",
    category: "coach-buses",
    capacityMin: 56,
    capacityMax: 56,
    amenities: ["Restroom onboard", "Reclining seats", "WiFi-ready", "Long-haul comfort"],
    imageUrl: "/images/coach-buses/56 Passenger Coach Bus Exterior Lux.png",
    secondaryImageUrl: "/images/coach-buses/56 Passenger Coach Bus Interior Lux.png",
    thirdImageUrl: "/images/coach-buses/56 Passenger Coach Bus Interior Lux.png",
  },
];

const FLEET_SECTIONS: Array<{ key: FleetCategoryKey; heading: string; href: string; vehicles: HomepageVehicle[] }> = [
  { key: "party", heading: "Party Buses", href: "/party-buses", vehicles: anchoragePartyFleet },
  { key: "limo", heading: "Limousines", href: "/limousines", vehicles: anchorageLimoFleet },
  { key: "coach", heading: "Coach Buses", href: "/coach-buses", vehicles: anchorageCoachFleet },
];

const WHY_CARD_CONTENT: Record<FleetCategoryKey, WhyCardContent> = {
  party: {
    title: "Why Party Buses Rock",
    description: "A rolling venue with standing room, LED lighting, and plug‑and‑play audio so the night lifts off the second the door slides shut.",
    points: [
      {
        label: "Mobile dance floor",
        detail: "Wrap-around seating leaves the center lane open so crews can move, dance, and stage photo moments en route to the next stop.",
      },
      {
        label: "Plug-n-play music",
        detail: "Bluetooth, HDMI, and aux hookups are pre-tested—hand the DJ their cue and the cabin lighting pulses with the beat.",
      },
      {
        label: "Room to mingle",
        detail: "Perimeter sofas keep everyone facing each other, which means more cheers, easier toasts, and no split conversations.",
      },
      {
        label: "Best for groups 12–35",
        detail: "Party buses hit the sweet spot for prom squads, bachelor/ette loops, or cruise crews that want one rolling hangout.",
      },
    ],
  },
  limo: {
    title: "Why Limousines Rock",
    description: "Private cabins, chilled glassware, and pro chauffeurs deliver red-carpet arrivals without the stress.",
    points: [
      {
        label: "Private cabin",
        detail: "Partitions, tinted glass, and hushed interiors keep vows, briefings, or playlists between you and your guests.",
      },
      {
        label: "Red-carpet arrivals",
        detail: "Chauffeurs stage curbside so gowns, suits, and camera crews have space to nail that first-look shot.",
      },
      {
        label: "Chilled glassware",
        detail: "Bar setups are iced before pickup—bring your own bottles and enjoy climate-controlled comfort the whole trip.",
      },
      {
        label: "Photo-ready lighting",
        detail: "Starlight ceilings, LED accent strips, and polished trims keep every snap and reel looking premium.",
      },
    ],
  },
  coach: {
    title: "Why Coach Buses Rock",
    description: "Comfort-first, forward-facing seating with luggage bays and pro drivers for ski runs, corporate shuttles, and cruise transfers.",
    points: [
      {
        label: "Seats up to 56",
        detail: "High-capacity coaches consolidate multiple vans into one manifest so everyone departs and arrives together.",
      },
      {
        label: "Under-floor luggage",
        detail: "Gear, skis, and week-long suitcases load below deck, leaving aisles clear and cabins clutter-free.",
      },
      {
        label: "USB + outlets",
        detail: "Keep cameras, tablets, and workstations topped off during glacier day trips or multi-hour rail connections.",
      },
      {
        label: "Climate smart",
        detail: "Dual-zone HVAC and blackout shades keep cabins comfortable whether it’s midnight sun or sub-zero winter.",
      },
    ],
  },
};

const STAT_HIGHLIGHTS = [
  {
    label: "AIRPORT • HUB",
    value: "ANC (Ted Stevens)",
    copy: "Flight tracking and buffer planning for cruise and corporate arrivals.",
    detail:
      "We sync with ANC arrival feeds, cruise manifests, and charter flight coordinators so your driver is staged with real-time updates. Buffer windows are automatically added when we see gate holds or de-icing delays.",
  },
  {
    label: "PEAK DEMAND",
    value: "May–Sept",
    copy: "Reserve popular Saturdays 90+ days out; winter adds aurora and ski transfers.",
    detail:
      "Cruise transfers, wedding weekends, and festival traffic compress the calendar. We maintain a rolling allocation board so we can tell you exactly how many coaches and party buses remain for each Saturday.",
  },
  {
    label: "WINTER LOWS",
    value: "↓ 0°F Typical",
    copy: "Fleet checks cover block heaters, tires, and emergency kits for cold resiliency.",
    detail:
      "Every vehicle we dispatch in Anchorage is inspected for block heaters, winter tires, heated mirrors, and emergency kits. Drivers also receive cold-weather SOPs covering idle limits, door cycles, and guest safety.",
  },
];



export default function AnchoragePage() {
  const alaskaEntry = findState("alaska");
  const stateSlug = slugifyState("alaska");
  const alaskaContent = getStateContent(stateSlug);
  const [activeHighlight, setActiveHighlight] = useState<typeof STAT_HIGHLIGHTS[number] | null>(null);
  const [activeWhyPoint, setActiveWhyPoint] = useState<WhyModalPayload | null>(null);
  const [activeHowToStep, setActiveHowToStep] = useState<typeof HOW_TO_BOOK_STEPS[number] | null>(null);
  const stateSections = alaskaContent?.sections ?? [];

  const stateInitial = alaskaEntry?.state?.[0]?.toUpperCase() ?? "A";

  return (
    <PageLayout gradientFrom="from-blue-950" gradientVia="via-blue-900" gradientTo="to-black" textColor="text-white">
      <section className="relative px-4 pt-4">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[40px] border border-blue-500/30 bg-gradient-to-br from-[#081b3d] via-[#041029] to-black shadow-[0_40px_120px_rgba(3,9,23,0.6)]">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_55%)]" aria-hidden />
          <div className="relative z-10 px-6 py-10 sm:px-12 sm:py-14 lg:px-16">
            <div className="flex flex-wrap items-center justify-between gap-3 text-[13px] text-blue-100/80">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-blue-400/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-blue-200">Anchorage • Alaska</span>
                <span className="text-blue-300/80">Bus2Ride Local Dispatch</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-white/80">
                <a href="tel:8885352566" className="font-semibold underline decoration-dotted underline-offset-4">(888) 535-2566</a>
                <span className="hidden sm:inline">•</span>
                <a href="mailto:info@bus2ride.com" className="font-semibold underline decoration-dotted underline-offset-4 hidden sm:inline">info@bus2ride.com</a>
              </div>
            </div>

            <div className="mt-8 text-center space-y-6">
              <p className="text-xs uppercase tracking-[0.45em] text-blue-200/80">Party Bus & Charter Service</p>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-white">
                Anchorage, Alaska transportation made calm—even when the weather shifts.
              </h1>
              <p className="mx-auto max-w-3xl text-base md:text-lg text-blue-100/90">
                Instant quotes, on-the-ground dispatch, and vehicles winterized for aurora runs, ski charters, cruise transfers, and corporate moves. Tell us your schedule; we handle the buffers, route notes, and gear.
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
              <a
                href="/quote#instant"
                className="inline-flex items-center justify-center rounded-full bg-white px-10 py-5 text-xl font-semibold text-blue-900 shadow-[0_20px_40px_rgba(4,7,16,0.45)] hover:-translate-y-0.5 hover:bg-slate-50 transition"
              >
                ⚡ Instant Quote
              </a>
              <a
                href="/fleet"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-10 py-5 text-xl font-semibold text-white shadow-[0_20px_40px_rgba(5,88,255,0.45)] hover:-translate-y-0.5 hover:bg-blue-500 transition"
              >
                🚌 View Fleet
              </a>
              <a
                href="tel:8885352566"
                className="inline-flex items-center justify-center rounded-full bg-slate-900/80 px-10 py-5 text-xl font-semibold text-white shadow-[0_20px_40px_rgba(2,6,23,0.6)] hover:-translate-y-0.5 hover:bg-black transition"
              >
                📞 Call (888) 535-2566
              </a>
              <a
                href="mailto:info@bus2ride.com"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-10 py-5 text-xl font-semibold text-white shadow-[0_20px_40px_rgba(3,9,23,0.5)] hover:-translate-y-0.5 hover:bg-white/5 transition"
              >
                ✉️ Email Us
              </a>
            </div>

            <p className="mt-6 text-center text-sm text-yellow-200/90">
              Book smarter: flexible aurora-ready windows, guaranteed on-time pickups, and crew who already factored in Anchorage roads and temps.
            </p>
          </div>
        </div>
      </section>

      {/* QUICK STATS & REASONS */}
      <Section className="max-w-6xl mx-auto mt-12 mb-16 rounded-3xl border border-white/10 bg-slate-950/60 px-6 py-12 shadow-[0_30px_90px_rgba(3,7,18,0.55)]">
        <div className="grid gap-6 md:grid-cols-3">
          {STAT_HIGHLIGHTS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setActiveHighlight(item)}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left shadow-inner transition hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-200/80">{item.label}</div>
              <div className="mt-3 text-2xl font-extrabold text-white">{item.value}</div>
              <p className="mt-2 text-sm text-blue-100/80 leading-relaxed">{item.copy}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-100/70">
                Learn more <span aria-hidden>→</span>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-12 text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow font-serif tracking-tight">
            Why Book in Anchorage with Bus2Ride?
          </h2>
          <p className="mx-auto max-w-3xl text-blue-100/90">
            Fast quotes, local dispatch, and a fleet prepped for Alaska’s extremes — we match the right vehicle, driver, and plan to your group so your trip runs flawlessly.
          </p>
        </div>

        <div className="mt-10">
          <WhyRentWithUs />
        </div>
      </Section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 text-white" aria-label="Anchorage fleet preview">
        <div className="space-y-16">
          {FLEET_SECTIONS.map(({ key, heading, href, vehicles }) => (
            <FleetShowcase
              key={key}
              heading={heading}
              href={href}
              vehicles={vehicles}
              why={WHY_CARD_CONTENT[key]}
              onPointSelect={(payload) => setActiveWhyPoint(payload)}
            />
          ))}
        </div>
      </section>

      {activeHighlight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur" onClick={() => setActiveHighlight(null)} aria-hidden />
          <div className="relative z-10 w-full max-w-xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-[0_40px_120px_rgba(2,6,23,0.85)]">
            <div className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-200/80">{activeHighlight.label}</div>
            <h3 className="mt-3 text-3xl font-extrabold text-white">{activeHighlight.value}</h3>
            <p className="mt-4 text-blue-100/90 leading-relaxed">{activeHighlight.detail}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveHighlight(null)}
                className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Close
              </button>
              <a href="/quote#instant" className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-blue-900 shadow hover:bg-slate-100">
                Get an Instant Quote
              </a>
            </div>
          </div>
        </div>
      )}

      {activeWhyPoint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur" onClick={() => setActiveWhyPoint(null)} aria-hidden />
          <div className="relative z-10 w-full max-w-xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-[0_40px_120px_rgba(2,6,23,0.85)]">
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-blue-200/80">{activeWhyPoint.title}</p>
            <h3 className="mt-3 text-3xl font-extrabold text-white">{activeWhyPoint.label}</h3>
            <p className="mt-4 text-blue-100/90 leading-relaxed">{activeWhyPoint.detail}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveWhyPoint(null)}
                className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Close
              </button>
              <a href="/quote#instant" className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-blue-900 shadow hover:bg-slate-100">
                Get an Instant Quote
              </a>
            </div>
          </div>
        </div>
      )}

      {activeHowToStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur" onClick={() => setActiveHowToStep(null)} aria-hidden />
          <div className="relative z-10 w-full max-w-xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-[0_40px_120px_rgba(2,6,23,0.85)]">
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-blue-200/80">Anchorage Booking</p>
            <h3 className="mt-3 text-3xl font-extrabold text-white">Step {activeHowToStep.step} • {activeHowToStep.label}</h3>
            <p className="mt-4 text-blue-100/90 leading-relaxed">{activeHowToStep.detail}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveHowToStep(null)}
                className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Close
              </button>
              <a href="/quote#instant" className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-blue-900 shadow hover:bg-slate-100">
                Get an Instant Quote
              </a>
            </div>
          </div>
        </div>
      )}

      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-[#0e1c3c] to-[#050a15] rounded-3xl shadow-[0_50px_140px_rgba(3,8,20,0.55)] border border-white/10 py-14 px-6 mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 font-serif tracking-tight bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">
          How to Book in Anchorage
        </h2>
        <p className="text-blue-100/85 text-center max-w-3xl mx-auto mb-10">
          Four fast steps—from your first quote to wheels rolling. Our local dispatch team keeps Alaska timing, road conditions, and fleet prep locked in.
        </p>
        <div className="grid gap-4 md:grid-cols-4">
          {HOW_TO_BOOK_STEPS.map((step) => (
            <button
              key={step.step}
              type="button"
              onClick={() => setActiveHowToStep(step)}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center shadow-inner transition hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <div className="text-sm font-semibold uppercase tracking-[0.4em] text-blue-200/80">Step {step.step}</div>
              <div className="mt-4 text-4xl" aria-hidden>
                {step.icon}
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">{step.label}</h3>
              <p className="mt-2 text-sm text-blue-100/80">{step.copy}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-100/70">
                Learn more <span aria-hidden>→</span>
              </span>
            </button>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a href="/quote#instant" className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-bold text-blue-900 shadow-lg hover:bg-blue-50">
            Get an Instant Quote
          </a>
          <a href="tel:8885352566" className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-3 text-sm font-bold text-white hover:bg-white/10">
            Talk to Anchorage Dispatch
          </a>
        </div>
      </Section>

      {alaskaEntry && (
        <Section className="relative max-w-7xl mx-auto overflow-hidden rounded-[40px] border border-white/10 py-14 px-6 mb-16 bg-gradient-to-br from-[#081531] via-[#050f24] to-[#030814] shadow-[0_60px_160px_rgba(2,6,23,0.65)]">
          <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),transparent_55%)]" />
          </div>

          <div className="relative z-10">
            <nav className="text-sm text-blue-200/80 mb-6" aria-label="Breadcrumb">
              <ol className="flex flex-wrap gap-2">
                <li>
                  <Link href="/locations" className="hover:underline">
                    Locations
                  </Link>{" "}
                  &raquo;
                </li>
                <li className="text-blue-100 font-semibold">Alaska Overview</li>
              </ol>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
              <div>
                <p className="text-xs uppercase tracking-[0.45em] text-blue-200/70">Coverage Map</p>
                <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
                  Cities We Serve Across Alaska
                </h2>
                <p className="mt-3 text-blue-100/80 max-w-2xl">
                  Anchorage dispatch supports every major statewide route—tap a city to open its guide, fleet highlights, and quote links.
                </p>
              </div>
              <div className="md:ml-auto flex flex-col items-start gap-3">
                <span className="inline-flex items-center rounded-full bg-white/95 text-blue-900 border border-blue-200 px-5 py-2 text-sm font-bold shadow">
                  {stateInitial} • {alaskaEntry.cities.length} cities
                </span>
                <span className="inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/80">
                  Snow-ready • Cruise-certified
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {alaskaEntry.cities.map((city) => {
                const href = `/locations/${slugify(city)}-${slugify(alaskaEntry.state)}`;
                return (
                  <Link
                    key={city}
                    href={href}
                    className="group relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#0b1d3c] via-[#0a1730] to-[#050b18] text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
                    aria-label={`Open ${city}, ${alaskaEntry.state}`}
                  >
                    <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100" aria-hidden>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-purple-500/10" />
                    </div>
                    <div className="relative p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-extrabold leading-tight text-white">{city}</h3>
                        <span className="text-sky-300 text-lg transition group-hover:translate-x-1">→</span>
                      </div>
                      <div className="text-sm font-semibold text-white/70">{alaskaEntry.state}</div>
                      <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-white/80">
                        {[{ label: "Fleet", href }, { label: "Instant Quote", href: "/quote#instant" }].map((chip) => (
                          <a
                            key={`${city}-${chip.label}`}
                            href={chip.href}
                            className="inline-flex items-center rounded-full border border-white/20 px-3 py-1 text-white/80 hover:text-white hover:border-white/40"
                            onClick={(event) => event.stopPropagation()}
                          >
                            {chip.label}
                          </a>
                        ))}
                      </div>
                      <div className="mt-5 flex gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-400">
                        <span>Year-round</span>
                        <span>•</span>
                        <span>Local support</span>
                      </div>
                    </div>
                    <div className="pointer-events-none absolute inset-x-6 bottom-4 h-12 rounded-full bg-gradient-to-r from-blue-400/40 via-indigo-500/40 to-blue-600/40 blur-2xl" aria-hidden />
                  </Link>
                );
              })}
            </div>

            <div className="mt-12 flex justify-center">
              <div className="rounded-3xl border border-white/15 bg-white/10 px-8 py-6 text-center shadow-lg backdrop-blur">
                <p className="text-white font-semibold text-lg">Not seeing your city? We likely still serve it.</p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <a
                    href="/quote"
                    className="inline-flex items-center justify-center rounded-full bg-white text-blue-900 font-bold px-6 py-3 shadow hover:bg-blue-50"
                  >
                    Get a Free Quote
                  </a>
                  <a
                    href="tel:8885352566"
                    className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-white font-bold hover:bg-white/10"
                  >
                    Call (888) 535-2566
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Section>
      )}

      {alaskaEntry && (
        stateSections.length ? (
          <Section className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl border border-blue-500/30 py-12 px-6 mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
              Alaska Planning Guide
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[0, 1].map((col) => (
                <div key={col} className="space-y-8">
                  {stateSections
                    .slice(
                      col * Math.ceil(stateSections.length / 2),
                      (col + 1) * Math.ceil(stateSections.length / 2)
                    )
                    .map((sec) => (
                      <div
                        key={sec.id}
                        id={sec.id}
                        className="bg-[#122a56] border border-blue-800/40 rounded-3xl p-6 shadow-lg"
                      >
                        <h3 className="text-2xl font-bold mb-3 font-serif">
                          {sec.title}
                        </h3>
                        {sec.body && (
                          <p className="text-blue-100/90 leading-relaxed">
                            {sec.body}
                          </p>
                        )}
                        {sec.bullets && (
                          <ul className="list-disc list-inside mt-3 space-y-1 text-blue-100/90">
                            {sec.bullets.map((b) => (
                              <li key={b}>{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </Section>
        ) : (
          <Section className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl border border-blue-500/30 py-12 px-6 mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
              About Alaska Service
            </h2>
            <p className="text-blue-100/90 leading-relaxed text-center max-w-3xl mx-auto">
              Detailed statewide transportation guide content is coming soon. Request a quote anytime and we&apos;ll share ready-to-go itineraries covering Anchorage, Fairbanks, Juneau, and more.
            </p>
          </Section>
        )
      )}

      {/* LONG-FORM CONTENT: GUIDE & KEY INFO (inserted for SEO and information depth) */}
      <Section className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl border border-blue-500/30 py-12 px-6 mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-6 font-serif tracking-tight bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Complete Guide to Party Bus Service in Anchorage</h2>
        <p className="text-blue-100/90 leading-relaxed mb-4">Anchorage is the logistical heart of Southcentral Alaska and a natural launch point for group travel: cruise transfers, Glacier National Park day trips, aurora chases, corporate shuttles, weddings, and seasonal festivals. A party bus gives groups a single, comfortable vehicle that keeps everyone together, simplifies coordination, and reduces the number of drivers and vehicles you must manage when staging multiple pickup points.</p>
        <p className="text-blue-100/90 leading-relaxed mb-4">When planning with a party bus, think in trip modules: pickup and staging windows, luggage and gear capacity, scheduled photo stops and unscheduled scenic detours, and the drive-time buffers needed for Alaska winter conditions. Our team pre-fills these considerations during the <Link href="/quote#instant" className="underline">instant quote</Link> process so the confirmation you get is operationally realistic and minimizes last-minute changes.</p>
        <p className="text-blue-100/90 leading-relaxed mb-4">Common use cases we dispatch in Anchorage include hotel → Port transfers for cruise passengers, airport shuttles timed to gate and baggage windows, aurora charters that leave late and pivot when clouds shift, and private night-out groups who want premium sound and lighting aboard. For planning tools, compare models and layout options with the <Link href="/tools" className="underline">Tools</Link> page and then lock the right vehicle on our <Link href="/fleet" className="underline">Fleet</Link> listing.</p>
        <p className="text-blue-100/90 leading-relaxed mb-4">If you need official venue or route information, check the Anchorage visitor site (<a href="https://www.anchorage.net" target="_blank" rel="noopener noreferrer" className="underline">anchorage.net</a>) or the Alaska Railroad for train‑transfer connections (<a href="https://www.alaskarailroad.com" target="_blank" rel="noopener noreferrer" className="underline">alaskarailroad.com</a>). For port timing at Whittier and related port notices, consult local port resources before finalizing photo stops.</p>
      </Section>

      {/* INLINE CTA BANNER — quick booking nudges after the guide */}
      <div className="max-w-7xl mx-auto my-8 px-6 space-y-8">
        <div className="rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-400 text-black p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm sm:text-base font-semibold">Ready to lock a vehicle for Anchorage? Get an instant quote with driver notes and aurora-flex options.</div>
          <div className="flex gap-3">
            <a href="/quote#instant" aria-label="Get an instant quote" className="inline-block rounded-full bg-black text-yellow-300 font-bold px-5 py-3 shadow hover:brightness-95 transition">⚡ Instant Quote</a>
            <a href="tel:8885352566" aria-label="Call to book" className="inline-block rounded-full bg-white text-blue-900 font-bold px-5 py-3 shadow hover:opacity-95 transition">📞 Call (888) 535‑2566</a>
          </div>
        </div>

        <ReviewsSearchSection reviews={anchorageReviewHighlights} />
      </div>

      {/* PRACTICAL PLANNING CHECKLIST (what to include in an instant quote) */}
      <Section className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/75 to-black rounded-3xl shadow-xl border border-blue-500/30 py-12 px-6 mb-16">
        <h3 className="text-3xl font-extrabold mb-4 font-serif bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Planning Checklist — What to Include in Your Quote</h3>
        <p className="text-blue-100/90 mb-4 leading-relaxed">To get an accurate price and a vehicle perfectly matched to your needs, include these items in your request: pickup and final return addresses, number of passengers, desired pickup windows (with flexibility for aurora charters), luggage and gear counts (skis, coolers, camera rigs), and any mobility or accessibility needs. Add notes for special stops such as glacier overlooks, the Alaska Railroad depot, or Port of Whittier access so we can plan staging and parking ahead of time.</p>
        <ul className="list-disc list-inside text-blue-200 space-y-2 mb-4">
          <li>Exact or approximate passenger count and age mix (adults vs minors).</li>
          <li>Desired vehicle features (PA system, wet bar, dance lighting, power outlets).</li>
          <li>Any timed connections (flight arrival times, train departures, cruise embark windows).</li>
          <li>Weather sensitivity: aurora flexibility windows or winterized vehicle requests.</li>
        </ul>
        <p className="text-blue-100/90 leading-relaxed mb-2">Use the <Link href="/tools" className="underline">Tools</Link> slider to compare capacity and estimated per‑person costs, then hit <Link href="/quote#instant" className="underline">Instant Quote</Link> to get a pre-filled estimate. If you prefer email, send full itinerary details to <a href="mailto:info@bus2ride.com" className="underline">info@bus2ride.com</a> and our dispatch team will return a consolidated plan with driver notes and suggested buffers.</p>
        {/* Inline CTA under planning checklist */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-center">
          <a href="/quote#instant" className="rounded-full bg-yellow-500 text-black font-bold px-6 py-3 shadow-lg hover:brightness-95 transition">Get My Instant Quote</a>
          <a href="/fleet" className="rounded-full bg-transparent border border-yellow-500 text-yellow-300 font-semibold px-5 py-3 shadow-sm hover:bg-yellow-500/10 transition">Browse Fleet</a>
          <a href="tel:8885352566" className="rounded-full bg-white text-blue-900 font-bold px-5 py-3 shadow hover:opacity-95 transition">Call Anchorage Dispatch</a>
        </div>
      </Section>


  {/* OVERVIEW & STRATEGY (pricing estimator removed) */}
      <Section className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl border border-blue-500/30 py-14 px-6 mb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h3 className="text-3xl font-extrabold mb-5 font-serif bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Anchorage Transportation Overview</h3>
            <p className="text-blue-100/90 leading-relaxed mb-4">Anchorage functions as Alaska’s staging hub—cruise passengers overnight here before rail or coach transfers, corporate teams fly in for energy & logistics projects, and adventure travelers launch day trips to glaciers, fjords and national parks.</p>
            <p className="text-blue-100/90 leading-relaxed mb-4 font-semibold">We turn logistics into an effortless part of your trip: on-time pickups, clear driver communication, and contingency planning for weather and port surges.</p>
            <p className="text-blue-100/90 leading-relaxed mb-4">We coordinate winter-ready vehicles, veteran drivers accustomed to snow, ice & moose delays, and optimized routing for Seward Highway (AK‑1), Glenn Highway and Port access to Whittier. Need gear capacity? We stage luggage + coolers + photo rigs with advance manifests.</p>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {[{ t: "Cruise Transfer", d: "Hotel → Whittier / Seward with glacier stop" },{ t: "Aurora Charter", d: "Dynamic route pivoting to clearer skies" },{ t: "Corporate Shuttle", d: "Multi‑day crew & vendor loops" },{ t: "Ski / Alyeska", d: "Group lodge & evening dining shuttle" },{ t: "Wedding Guest", d: "Hotel staging + venue return waves" },{ t: "Fishing Charter", d: "Cooler + gear capacity planning" }].map(card => (
                <div key={card.t} className="rounded-xl bg-[#132a55] border border-blue-700/40 p-4 shadow"><div className="font-bold text-blue-50">{card.t}</div><div className="text-xs text-blue-200 mt-1 leading-snug">{card.d}</div></div>
              ))}
            </div>
            <div className="mt-6">
              <a href="/quote#instant" className="rounded-full bg-yellow-500 text-black font-bold px-5 py-3 shadow hover:brightness-95 transition">Quote this Route</a>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold mb-5 font-serif bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Seasonal & Weather Strategy</h3>
            <p className="text-blue-200 text-sm mb-4">Our planners watch KP indexes, road advisories, and cruise manifests so you don’t have to—ask about aurora‑flex windows for maximum sighting odds.</p>
            <ul className="space-y-4 text-blue-100/90 leading-relaxed">
              <li><span className="font-semibold text-blue-50">Summer (Midnight Sun):</span> Compress multiple scenic stops—add buffers for cruise surges.</li>
              <li><span className="font-semibold text-blue-50">Shoulder (Apr–May / Sept–Oct):</span> 8–15% lower rates + flexibility for photo detours.</li>
              <li><span className="font-semibold text-blue-50">Winter:</span> Pre‑trip vehicle warm-up, anti‑slip entry mats, black ice contingency.</li>
              <li><span className="font-semibold text-blue-50">Aurora windows:</span> Flexible standby after midnight—routing adapts to KP & cloud cover.</li>
              <li><span className="font-semibold text-blue-50">Wildlife:</span> Moose / Dall sheep slowdowns modeled with conservative mph.</li>
            </ul>
    {/* Pricing estimator removed per request */}
          </div>
        </div>
      </Section>

      {/* AURORA / WINTER EXPANDED TIPS & EXTERNAL RESOURCES */}
      <Section className="max-w-7xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/40">
        <h3 className="text-3xl font-extrabold mb-4 font-serif bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Aurora & Winter: Extra Planning Notes</h3>
        <p className="text-blue-100/90 leading-relaxed mb-4">Aurora chases require flexibility. We recommend a standby window of 60–90 minutes and an agreed extension policy when KP indexes are high. Add the extension request to your initial quote so the driver is scheduled and food/fuel logistics are planned in advance. If you are unfamiliar with local weather patterns, our Live Weather Advisor component on this page is a quick reference, but for in-depth research see official resources such as the National Weather Service and local aurora forecasting tools.</p>
        <p className="text-blue-100/90 leading-relaxed mb-4">For route planning and port timing, external resources help: anchor planning on the local visitor guide (<a href="https://www.anchorage.net" target="_blank" rel="noopener noreferrer" className="underline">anchorage.net</a>) and review ferry or port notices before locking a schedule. When traveling through mountain passes or the Seward Highway, allow extra buffer time for slowdown windows and wildlife sightings.</p>
        <p className="text-blue-100/90 leading-relaxed">If you have specific safety or accessibility concerns, add them to your quote and we will assign vehicles and drivers trained for those conditions. Our emergency kit checklist is part of every winter dispatch: block heater checks, extra blankets, ice‑scrapers, and USB charging stations for devices used during long nights.</p>
      </Section>
  {/* Pricing table removed per request */}

      {/* ROUTES */}
      <Section className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl border border-blue-500/30 py-14 px-6 mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 font-serif tracking-tight bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Top Anchorage Routes & Logistics Hotspots</h2>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            {[{ t:"Hotel → Whittier Cruise", d:"Plan 1 hr 45 min incl. tunnel timing + glacier photo stop option." },{ t:"Airport → Downtown", d:"15–25 min; add 10–15 in peak cruise arrivals." },{ t:"Downtown → Alyeska (Girdwood)", d:"~45–55 min; winter storm days can double." },{ t:"Anchorage Evening Shuttle", d:"Multi‑stop dinner / brewery / nightlife loop." },{ t:"Aurora Flex Charter", d:"Dynamic routing (Palmer / Wasilla pivot)." },{ t:"Fishing Transfer", d:"Cooler & gear staging; early AM departure complexity handled." }].map(r => (
              <div key={r.t} className="p-5 rounded-2xl bg-[#132a55] border border-blue-700/40 shadow"><div className="font-bold text-blue-50">{r.t}</div><div className="text-blue-200 text-sm mt-2 leading-snug">{r.d}</div></div>
            ))}
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-3 font-serif">High-Impact Venues</h3>
              <ul className="grid grid-cols-2 gap-3 text-sm text-blue-100/90">{['Alyeska Resort','Egan Center','Dena’ina Center','Alaska Railroad Depot','Port of Whittier','Seward Harbor','Hilltop / Arctic Valley','Kincaid Park','Hotel Captain Cook','Chugach Overlooks'].map(v=> <li key={v} className="bg-[#122a4c] rounded-lg px-3 py-2 border border-blue-700/40">{v}</li>)}</ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3 font-serif">Neighborhood Coverage</h3>
              <div className="flex flex-wrap gap-2">{anchorageNeighborhoods.map(n=> <span key={n} className="rounded-full bg-blue-50/10 border border-blue-500/40 text-blue-100 text-xs font-semibold px-3 py-1">{n}</span>)}</div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3 font-serif">Buffer Recommendations</h3>
              <p className="text-blue-200 text-sm mb-2">Tip: Add suggested buffers directly in your instant quote so your final confirmation already includes realistic timing and optional aurora flexibility.</p>
              <ul className="list-disc list-inside text-blue-100/90 space-y-1 text-sm">
                <li>+10–15 min per extra pickup / staging stop</li>
                <li>+30+ min if Seward Hwy weather advisories</li>
                <li>+20 min cruise disembark surge windows</li>
                <li>+15 min if large luggage & gear loading</li>
                <li>Flexible 60–90 min aurora repositioning</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* AURORA & WINTER */}
      <Section className="max-w-7xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/40">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-6 font-serif tracking-tight bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Aurora / Winter Comfort Checklist</h2>
        <p className="text-center text-blue-100/80 max-w-3xl mx-auto mb-8 text-sm md:text-base">Live weather + road intel feed our dispatch board so you know exactly how Anchorage feels before doors open. Share these conditions with your crew and we’ll preload buffers, blankets, and traction aids.</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {WEATHER_CHIPS.map((chip) => (
            <div key={chip.label} className="rounded-2xl border border-blue-700/40 bg-gradient-to-br from-[#0e1f45] to-[#08132c] p-4 shadow-lg">
              <p className="text-xs uppercase tracking-[0.35em] text-blue-200/70">{chip.label}</p>
              <p className="text-2xl font-extrabold text-white mt-1">{chip.value}</p>
              <p className="text-xs text-blue-100/80 mt-2">{chip.note}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-4 flex flex-col">
            {auroraTips.map(t => (
              <div key={t} className="bg-[#132a55] p-4 rounded-xl border border-blue-700/40 text-blue-100/90 text-sm leading-relaxed">{t}</div>
            ))}
            {/* Large vehicle slider to fill lower left space */}
            <div className="mt-6">
              <AnchorageVehicleSlider />
            </div>
            {/* Descriptive copy to utilize lower vertical space */}
            <div className="mt-6 bg-[#132a55] p-5 rounded-2xl border border-blue-700/40 text-blue-100/90 text-[13px] leading-relaxed shadow">
              <h4 className="font-semibold text-blue-50 mb-2 text-sm tracking-wide">Anchorage Fleet Readiness</h4>
              <p className="mb-2">Vehicles allocated for Anchorage + Southcentral runs are prepped for rapid weather shifts—heated interiors, winter‑rated tires in season, and space allocation for layered gear & camera packs during aurora charters.</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Block heater + cold start checklist below 20°F.</li>
                <li>Extra time baked into Seward / Whittier turns during storm advisories.</li>
                <li>Night charters carry reflective cones for safe photo stop staging.</li>
                <li>Sprinter & party bus USB power verified pre‑dispatch for battery‑intensive DSLR sessions.</li>
                <li>Flexible overage policy on aurora nights—extend in 30 min increments if KP spikes.</li>
              </ul>
              <p className="mt-3 text-blue-200/80 italic">Include special cargo (skis, coolers, tripods) in your quote request so we reserve the right interior layout.</p>
            </div>
            <div className="mt-4">
              <a href="/quote#instant" className="inline-block rounded-full bg-red-600 text-white font-bold px-5 py-3 shadow hover:opacity-95 transition">Book an Aurora Flex Window</a>
            </div>
            {/* subtle aurora accent behind slider (decorative) */}
            <div className="relative hidden">
              <SmartImage src="/images/aurora-anchorage.svg" alt="Aurora decorative" className="opacity-40"/>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-blue-700/40 bg-[#0f2148] p-4 shadow">
                <p className="text-xs uppercase tracking-[0.35em] text-blue-200/70">Anchorage Trivia</p>
                <h4 className="text-lg font-semibold text-white mt-2">Why locals love night charters</h4>
                <ul className="mt-3 space-y-2 text-sm text-blue-100/90">
                  <li>Sky stations like Point Woronzof give near-instant aurora alerts.</li>
                  <li>City grid means you can warm up at breweries between sky checks.</li>
                  <li>Drivers track KP index + cloud cover via dispatch dashboard.</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-blue-700/40 bg-[#10234c] p-4 shadow">
                <p className="text-xs uppercase tracking-[0.35em] text-blue-200/70">Anchorage Fast Facts</p>
                <h4 className="text-lg font-semibold text-white mt-2">Within 90 minutes you can…</h4>
                <ul className="mt-3 space-y-2 text-sm text-blue-100/90">
                  <li>Pivot north to Wasilla for clear skies after storms.</li>
                  <li>Stage at Alyeska for ski-to-aurora double headers.</li>
                  <li>Grab tide-dependent Turnagain photo stops without leaving the highway.</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-blue-700/40 bg-gradient-to-br from-[#132852] to-[#0b1938] p-4 shadow md:col-span-2">
                <p className="text-xs uppercase tracking-[0.35em] text-blue-200/70">Aurora Playbook</p>
                <h4 className="text-lg font-semibold text-white mt-2">Peak KP game plan</h4>
                <div className="mt-3 grid gap-4 md:grid-cols-3 text-sm text-blue-100/90">
                  <div>
                    <p className="text-xs text-blue-200/70 uppercase tracking-[0.2em]">KP 3-4</p>
                    <p className="font-semibold text-white">Stay within city limits</p>
                    <p className="mt-1 text-[13px]">Ship Creek overlook + Woronzof for Skyline glow.</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-200/70 uppercase tracking-[0.2em]">KP 5-6</p>
                    <p className="font-semibold text-white">Go 45-60 min north</p>
                    <p className="mt-1 text-[13px]">Hatcher Pass pulloffs give zero light pollution.</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-200/70 uppercase tracking-[0.2em]">KP 7+</p>
                    <p className="font-semibold text-white">Chase horizon edges</p>
                    <p className="mt-1 text-[13px]">Dispatch monitors NOAA alerts and loiter time is waived.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 rounded-3xl border border-blue-700/40 bg-gradient-to-br from-[#0f2348] to-[#091532] p-5 shadow">
              <p className="text-xs uppercase tracking-[0.35em] text-blue-200/70">Dispatch case files</p>
              <h4 className="text-lg font-semibold text-white mt-2">Real Anchorage requests we staged this season</h4>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {AURORA_CASES.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white">{item.label}</span>
                      <span className="text-xs uppercase tracking-[0.25em] text-amber-200">{item.stat}</span>
                    </div>
                    <p className="text-[13px] leading-relaxed text-blue-100/90">{item.summary}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-blue-700/40 bg-[#0d1f42] p-4 flex items-center gap-4 shadow">
              <div className="rounded-full bg-blue-500/20 text-blue-100 px-3 py-2 text-xs font-semibold tracking-[0.3em] uppercase">
                Ping
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Dispatch hotfix lane</p>
                <p className="text-xs text-blue-100/80">Flag “Aurora Flex” in your quote and our night lead replies on average in under 9 minutes.</p>
              </div>
            </div>
            <div className="mt-3 rounded-2xl border border-blue-700/40 bg-[#0c1b38] p-4 shadow">
              <p className="text-xs uppercase tracking-[0.35em] text-blue-200/70">Live slot count</p>
              <div className="mt-2 flex items-end gap-3">
                <p className="text-3xl font-black text-white">6</p>
                <p className="text-xs text-blue-100/80">Aurora-ready sprinter windows left this weekend.</p>
              </div>
              <p className="text-[12px] text-blue-200/70 mt-2">Tap “Hold this slot” in your quote notes to freeze one for 24 hours.</p>
            </div>
            <div className="mt-3 rounded-2xl border border-blue-700/40 bg-[#09142c] p-4 shadow">
              <p className="text-xs uppercase tracking-[0.35em] text-blue-200/70">Driver intel</p>
              <p className="text-sm text-blue-100/90 mt-2">Night lead Jess reports clearest skies past Wasilla; she’s staging coffee + blanket refills at the first stop.</p>
              <p className="text-[12px] text-blue-200/60 mt-2">Mention “Jess playbook” if you want the same loop sequencing.</p>
            </div>
          </div>
          <div className="bg-[#132a55] p-4 md:p-6 rounded-2xl border border-blue-700/40 flex flex-col gap-4">
            <h3 className="text-2xl font-bold font-serif">Live Weather & Comfort</h3>
            <p className="text-blue-100/90 text-sm leading-relaxed">Anchorage-focused forecast snapshot to plan layers, hydration & timing.</p>
            <p className="text-blue-200 text-sm">We combine live forecasts with vehicle readiness checks—ask dispatch for cold-weather add-ons like extra fuel, blankets, or power banks.</p>
            <div className="rounded-2xl overflow-hidden border border-blue-600/40 bg-gradient-to-br from-[#0b2049] via-[#081633] to-[#050b1d] p-2 md:p-3 text-white text-sm shadow-[0_30px_90px_rgba(4,11,32,0.55)]">
              {/* Compact weather (anchored to Anchorage) */}
              <div className="[&_*]:!text-[13px] [&_h1]:!text-base [&_h2]:!text-sm [&_.min-h-screen]:min-h-0 [&_.min-h-screen]:bg-transparent [&_.max-w-7xl]:max-w-full [&_.grid]:gap-3">
                <LiveWeatherAdvisor variant="compact" fixedPlace={{ name: 'Anchorage, Alaska', latitude: 61.2181, longitude: -149.9003, country_code: 'US' }} />
              </div>
            </div>
            <div className="rounded-2xl border border-blue-600/40 bg-gradient-to-br from-[#0f274f] to-[#091533] p-5 shadow-[0_30px_90px_rgba(4,11,32,0.45)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-blue-200/70">Road conditions</p>
                  <h4 className="text-lg font-semibold text-white">Anchorage & Southcentral</h4>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">AK DOT 511</span>
              </div>
              <div className="mt-4 space-y-4">
                {ROAD_CONDITIONS.map((road) => (
                  <div key={road.route} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between text-sm text-blue-100/90">
                      <span className="font-semibold text-white">{road.route}</span>
                      <span className="text-xs uppercase tracking-[0.2em] text-amber-200">{road.status}</span>
                    </div>
                    <p className="text-xs text-blue-100/80 mt-2 leading-relaxed">{road.detail}</p>
                  </div>
                ))}
              </div>
              <a
                href="https://511.alaska.gov"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white hover:border-white/40"
              >
                Check live AK 511 →
              </a>
            </div>
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-blue-200 mb-2">View Similar Vehicles</h4>
              <AnchorageVehicleSlider />
            </div>
          </div>
        </div>
      </Section>

      <div className="space-y-12 py-12">
        <section className="mx-auto max-w-7xl rounded-[40px] border border-white/10 bg-gradient-to-br from-[#08132b] via-[#050d1f] to-[#030712] px-6 py-12 shadow-[0_60px_160px_rgba(2,6,23,0.65)]">
          <div className="text-center space-y-3 mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">Live sentiment</p>
            <h2 className="text-4xl md:text-5xl font-extrabold">Anchorage Poll Library</h2>
            <p className="text-white/70 max-w-3xl mx-auto">
              Same rotating grid you see on the homepage, pre-filtered for Anchorage riders and tags.
            </p>
          </div>
          <div className="mx-auto max-w-5xl">
            <HomePolls groups={[{ tag: "anchorage", label: "Anchorage" }]} pickSize={50} visiblePerGroup={6} innerScroll />
          </div>
          <div className="flex justify-center mt-10">
            <a
              href="/polls"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-3 text-sm font-semibold text-white hover:border-white/40"
            >
              Browse all polls →
            </a>
          </div>
        </section>

        <section className="mx-auto max-w-7xl rounded-[40px] border border-white/10 bg-gradient-to-br from-[#08132b] via-[#050d1f] to-[#030712] px-6 py-12 shadow-[0_60px_160px_rgba(2,6,23,0.65)]">
          <div className="text-center space-y-3 mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">Planning Stack</p>
            <h2 className="text-4xl md:text-5xl font-extrabold">Anchorage Tools Rail</h2>
            <p className="text-white/70 max-w-3xl mx-auto">
              Tap any tile to see why it exists, then launch the real tool or keep comparing with the slider below.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {helperTools.map((tool) => (
              <article
                key={tool.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-[0_30px_80px_rgba(2,6,23,0.45)]"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{tool.title}</h3>
                <p className="text-white/70 text-sm mb-4">{tool.desc}</p>
                <a
                  href={tool.href}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white hover:border-white/40"
                >
                  Launch tool →
                </a>
              </article>
            ))}
          </div>
          <div className="rounded-3xl shadow-[0_40px_100px_rgba(2,6,23,0.6)] border border-white/10 p-2 sm:p-4 bg-gradient-to-br from-[#0a193a] via-[#08122b] to-[#040812]">
            <ToolsSlider />
          </div>
        </section>

        <section className="mx-auto max-w-7xl rounded-[40px] border border-white/10 bg-gradient-to-br from-[#08132b] via-[#050d1f] to-[#030712] px-6 py-12 shadow-[0_60px_160px_rgba(2,6,23,0.65)]">
          <div className="text-center space-y-3 mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">Ideas board</p>
            <h2 className="text-4xl md:text-5xl font-extrabold">Events & Occasions</h2>
            <p className="text-white/70 max-w-3xl mx-auto">
              Same card grid as our homepage events rail, tuned for Anchorage. Search, dream, and then hit quote.
            </p>
          </div>
          <div className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur">
            <EventsSection limit={9} tag="anchorage" />
          </div>
        </section>
      </div>

      {/* EXTRA LONG-FORM: PLANNING, COSTS & FAQs (added to reach ~1k words) */}
      <Section className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/40">
        <h3 className="text-3xl font-extrabold mb-4 font-serif bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Anchorage Party Bus Planning — Tips, Costs & FAQs</h3>
        <p className="text-blue-100/90 leading-relaxed mb-4">Pricing for a party bus in Anchorage depends on the vehicle class, season, itinerary length and special requests such as aurora flexibility, extra crew time, or extended staging for glacier photo stops. Typical short transfers (airport → downtown) are quoted by the trip; longer day trips and aurora chases are usually quoted hourly with clear start and end times. Use our <Link href="/tools" className="underline">Tools</Link> to compare per‑person estimates, then hit <Link href="/quote#instant" className="underline">Instant Quote</Link> for a tailored price.</p>
        <p className="text-blue-100/90 leading-relaxed mb-4">FAQ: How far in advance should I book? For peak cruise season and major events, lock vehicles 60–90 days out. Winter aurora windows often require flexible staffing—book what you can and request an aurora‑flex window on the quote so we can provision standby time. Need multiple vehicle types? Add fleet preferences in your quote and we’ll pre-plan staging and driver handoffs to keep your itinerary tight.</p>
        <p className="text-blue-100/90 leading-relaxed mb-4">Safety & compliance: our fleet meets local DOT standards and drivers are background‑checked with regular safety retraining. For remote or multi‑day itineraries, we include contingency planning for highway advisories and port notices; reference official resources like the <a href="https://www.weather.gov" target="_blank" rel="noopener noreferrer" className="underline">National Weather Service</a> and the <a href="https://www.nps.gov" target="_blank" rel="noopener noreferrer" className="underline">National Park Service</a> pages for park access rules.</p>
  <p className="text-blue-100/90 leading-relaxed mb-4">Planning checklist quick hits: include passenger count, luggage & gear list, exact pickup/drop addresses, any timed connections, and a note about mobility needs. If you are coordinating with cruise lines or event venues, include terminal names and expected disembark windows so we can model real-world buffer times. Need help? Contact our Anchorage dispatch at <a href="mailto:info@bus2ride.com" className="underline">info@bus2ride.com</a> or call <a href="tel:8885352566" className="underline">(888) 535‑2566</a>.</p>
  <p className="text-blue-100/90 leading-relaxed">Local resource links: visitor info at <a href="https://www.anchorage.net" target="_blank" rel="noopener noreferrer" className="underline">anchorage.net</a>, train connections at <a href="https://www.alaskarailroad.com" target="_blank" rel="noopener noreferrer" className="underline">alaskarailroad.com</a>, and port timing notices through local port authorities. When in doubt, add extra buffer on the quote and we will convert it to guaranteed time in the confirmation.</p>
      </Section>
      {/* EXTRA SLIDER #3 — before final CTA */}
      <Section className="max-w-7xl mx-auto my-10">
        <h4 className="text-xl font-bold text-center mb-4 text-blue-50">More Photos from Our Anchorage Fleet</h4>
        <div className="bg-[#08142a] rounded-2xl p-4 border border-blue-700/30 shadow">
          <AnchorageVehicleSlider />
        </div>
      </Section>

      {/* FINAL CTA */}
    <Section className="bg-gradient-to-r from-blue-800 via-blue-900 to-black">
        <div className="max-w-5xl mx-auto text-center py-6">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight font-serif bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Ready for Anchorage Transport Done Right?</h2>
      <p className="text-blue-100/90 mb-6">Lock preferred vehicles early—peak cruise Saturdays & holiday aurora windows go fast. Book now and enjoy transparent pricing, flexible add-ons, and an operations team that treats your group like VIPs.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/quote#instant" className="rounded-full bg-white text-blue-900 font-bold px-8 py-4 text-lg shadow-lg hover:bg-blue-50 transition">Instant Quote</a>
            <a href="/fleet" className="rounded-full bg-blue-700 text-white font-bold px-8 py-4 text-lg shadow-lg hover:bg-blue-800 transition">View Fleet</a>
            <a href="tel:8885352566" className="rounded-full bg-blue-900 text-white font-bold px-8 py-4 text-lg shadow-lg hover:bg-black transition">Call (888) 535‑2566</a>
          </div>
      <p className="text-[11px] text-blue-300 mt-6">Need multi-day / remote itinerary support? Include all legs + gear notes. Prefer email? Reach our Anchorage dispatch at <a href="mailto:info@bus2ride.com" className="underline">info@bus2ride.com</a> and we will respond with a tailored plan.</p>
      <div className="mt-6 text-blue-200 text-sm max-w-3xl mx-auto">
        <p className="leading-relaxed">If you want to read more, visit our <Link href="/reviews" className="underline">customer reviews</Link> and the <Link href="/locations/anchorage-alaska" className="underline">Anchorage hub</Link> resources. For partner and venue references, see <a href="https://www.anchorage.net" target="_blank" rel="noopener noreferrer" className="underline">anchorage.net</a> and <a href="https://www.alaskarailroad.com" target="_blank" rel="noopener noreferrer" className="underline">alaskarailroad.com</a>.</p>
      </div>
        </div>
      </Section>
      <StickyBookingUI />
    </PageLayout>
  );
}

type FleetShowcaseProps = {
  heading: string;
  href: string;
  vehicles: HomepageVehicle[];
  why: WhyCardContent;
  onPointSelect: (payload: WhyModalPayload) => void;
};

function FleetShowcase({ heading, href, vehicles, why, onPointSelect }: FleetShowcaseProps) {
  const displayVehicles = vehicles.slice(0, 3);

  return (
    <div className="rounded-[36px] border border-white/10 bg-gradient-to-b from-[#0b1c3f] to-[#060e1f] p-6 shadow-[0_50px_140px_rgba(3,7,18,0.55)] sm:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-3xl font-extrabold tracking-tight text-white">{heading}</h3>
          <p className="text-sm text-white/60">Anchorage-ready vehicles with instant quotes.</p>
        </div>
        <a href={href} className="text-sm font-semibold text-sky-300 hover:text-white">
          View all →
        </a>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {displayVehicles.map((vehicle) => (
          <VehicleGalleryCard
            key={vehicle.id}
            vehicle={vehicle}
            cardHref={href}
            quoteHref="/quote#instant"
            phoneDisplay="(888) 535-2566"
            phoneTel="8885352566"
          />
        ))}
      </div>

      <div className="mt-10 rounded-[32px] border border-white/10 bg-white/5 p-6 text-center shadow-inner">
        <h4 className="text-2xl font-extrabold text-white">{why.title}</h4>
        <p className="mt-2 text-sm text-white/80">{why.description}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {why.points.map((point) => (
            <button
              key={point.label}
              type="button"
              onClick={() => onPointSelect({ title: why.title, label: point.label, detail: point.detail })}
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/85 transition hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              {point.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
// Render StickyBookingUI in the module so the component is active on the page
export const stickyBooking = StickyBookingUI;

/* Sticky booking UI: mobile sticky bar + floating desktop button */
function StickyBookingUI() {
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="max-w-7xl mx-auto px-4 py-3 bg-gradient-to-r from-blue-900 to-black border-t border-blue-700/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-sm text-blue-200 font-semibold">Need a ride now?</div>
            <div className="text-xs text-blue-300">Instant quote or call us</div>
          </div>
          <div className="flex gap-2">
            <a href="/quote#instant" className="rounded-full bg-yellow-500 text-black font-bold px-4 py-2">Quote</a>
            <a href="tel:8885352566" className="rounded-full bg-white text-blue-900 font-bold px-4 py-2">Call</a>
          </div>
        </div>
      </div>

      <a href="/quote#instant" aria-label="Book Now" className="hidden md:flex fixed right-6 bottom-12 z-50 items-center gap-3 bg-yellow-500 text-black font-bold px-4 py-3 rounded-full shadow-lg hover:brightness-95 transition">
        <span className="text-lg">⚡</span>
        <span>Book Now</span>
      </a>
    </>
  );
}

// Inject the StickyBookingUI at render time by exporting it where PageLayout can import lazily if needed.