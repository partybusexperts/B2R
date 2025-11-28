"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import PageLayout from "../../../components/PageLayout";
import Section from "../../../components/Section";
import { SmartImage } from "../../../components/SmartImage";

const HERO_IMAGE = "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/Blog/Party%20Bus%20Pricing.jpg";

const PRICING_CONFIG = {
  tier1: { label: "Tier 1 · NYC / LA / CHI", base: 245 },
  tier2: { label: "Tier 2 · Major metros", base: 215 },
  tier3: { label: "Tier 3 · Secondary cities", base: 185 },
};

const COST_FACTORS = [
  {
    label: "Seasonal Demand",
    detail: "April–June Saturdays and December holiday parties run +18% because every vehicle is spoken for weeks out.",
  },
  {
    label: "Vehicle Class",
    detail: "LED lounges, late-model coaches, and 30+ passenger builds carry higher insurance + storage costs.",
  },
  {
    label: "Route Physics",
    detail: "Multi-stop pickup sprawl, stadium surges, or remote venues add deadhead miles and driver standby.",
  },
  {
    label: "Risk & Compliance",
    detail: "ADA securements, COI rushes, or high-security sites require extra prep time that gets baked into rate.",
  },
];

const TIMELINE = [
  {
    title: "Scope the Ride",
    body: "Lock headcount, pickup radius, dwell windows, and any venue quirks so we can model the real clock.",
  },
  {
    title: "Stress-Test the Quote",
    body: "We expose hourly minimums, overtime rules, and every pass-through fee in one translucent grid.",
  },
  {
    title: "Route Intelligence",
    body: "Dispatch simulates traffic scenarios, staging points, and backup loops before you ever sign.",
  },
  {
    title: "Live Control",
    body: "Shared dashboard, driver GPS, and SMS ops loop keep the night on-budget even if plans pivot.",
  },
];

const RELATED = [
  {
    title: "How to Read a Quote",
    href: "/blog/how-to-read-a-quote-hourly-vs-flat-rate-vs-fuel-service-fees",
    blurb: "Decode hourly minimums, fuel surcharges, and gratuity so you never pay mystery fees again.",
  },
  {
    title: "Lead Time by Season",
    href: "/blog/how-early-should-you-book-lead-time-by-season-vehicle",
    blurb: "Use booking windows that keep pricing sane even during prom and peak wedding overlap.",
  },
  {
    title: "Add-Ons Worth Paying For",
    href: "/blog/add-ons-that-are-actually-worth-it",
    blurb: "Curate upgrades that actually change the energy curve instead of burning cash on fluff.",
  },
];


const ARTICLE_META = {
  published: "May 12, 2025",
  updated: "November 3, 2025",
  readTime: "7 min read",
};

const ARTICLE_TAGS = ["Pricing Lab", "Budget Control", "Logistics"];

const ARTICLE_PILLARS = [
  {
    title: "01 · Time really is the product",
    detail: "Buses are sold by the clock, not the mile. Anything that eats at the driver or vehicle clock adds dollars before you ever hit the first stop.",
  },
  {
    title: "02 · Geography sets the floor",
    detail: "Heavy-union metros like NYC or LA have higher base wages and storage costs. Secondary cities can run 20–30% less with the same equipment.",
  },
  {
    title: "03 · Risk gets priced in",
    detail: "Rush COIs, ADA conversions, or 2 AM stadium extractions trigger compliance hours, overtime guarantees, and backup vehicles on standby.",
  },
];

const FAQS = [
  {
    question: "Is hourly always cheaper than flat rate?",
    answer:
      "Not if you have staging or deadhead requirements. An hourly charter with a four-hour minimum can beat a flat rate only when your itinerary is tight and you control the dwell windows.",
  },
  {
    question: "Why do prom and holiday rides spike so hard?",
    answer:
      "The same fifty vehicles are asked to be in twenty places at once. Operators bake in scarcity, extended driver holds, and higher insurance riders for youth events or corporate alcohol service.",
  },
  {
    question: "Can I negotiate fuel or admin fees off the invoice?",
    answer:
      "If you book 30+ days out and bundle multiple dates, yes—we often roll those into the base rate. Last-minute requests usually pay list price because the operator is filling a gap on the calendar.",
  },
];
const GALLERY = [
  {
    src: "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/22%20Passenger%20Party%20Bus/22%20Passenger%20Party%20Bus%20Interior%20Lux.png",
    alt: "Neon interior",
  },
  {
    src: "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/36%20Passenger%20Party%20Bus/36%20Passenger%20Party%20Bus%20Interior%20Lux.png",
    alt: "Club layout",
  },
  {
    src: "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/30%20Passenger%20Party%20Bus/30%20Passenger%20Party%20Bus%20Exterior%20Lux.png",
    alt: "Exterior arrival",
  },
  {
    src: "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/24%20Passenger%20Party%20Bus/24%20Passenger%20Party%20Bus%20Interior%20Lux.png",
    alt: "Premium seating",
  },
];

function formatCurrency(value: number) {
  return value.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function PartyBusPricing101() {
  const [cityTier, setCityTier] = useState<keyof typeof PRICING_CONFIG>("tier2");
  const [isPeak, setIsPeak] = useState(true);
  const [hours, setHours] = useState(5);
  const [passengers, setPassengers] = useState(20);

  const estimate = useMemo(() => {
    const config = PRICING_CONFIG[cityTier];
    const passengerMultiplier = passengers > 34 ? 1.25 : passengers > 26 ? 1.15 : passengers > 20 ? 1.08 : 1;
    const peakMultiplier = isPeak ? 1.18 : 1;
    const total = config.base * passengerMultiplier * peakMultiplier * hours;
    const floor = total * 0.92;
    const ceiling = total * 1.08;
    return { total, floor, ceiling };
  }, [cityTier, hours, isPeak, passengers]);

  return (
    <PageLayout gradientFrom="from-[#030711]" gradientVia="via-[#070f23]" gradientTo="to-black" textColor="text-white">
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden>
          <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_55%)]" />
        </div>
        <Section className="relative max-w-6xl mx-auto pt-16 pb-14">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.6em] text-blue-300/80">Pricing Lab</p>
              <h1 className="mt-4 text-4xl md:text-5xl font-semibold leading-tight">
                Party Bus Pricing 101 — engineered like a flight plan, not a guess.
              </h1>
              <p className="mt-5 text-lg text-blue-100/80">
                We reverse-engineer every quote so you see the wiring: hourly minimums, demand surcharges, idle windows, and mitigation levers that keep the total sane.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-blue-200">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Live dispatch data
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-sky-400" /> Transparent fee stack
                </span>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {["98% on-time departures", "< 7 min avg quote turnaround", "350+ metro areas"].map((stat) => (
                  <div key={stat} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-2xl font-semibold text-white">{stat.split(" ")[0]}</p>
                    <p className="text-sm text-blue-200/80">{stat.split(" ").slice(1).join(" ")}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-r from-blue-600/30 via-indigo-500/20 to-transparent blur-3xl" aria-hidden />
              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(3,7,18,0.65)]">
                <SmartImage src={HERO_IMAGE} alt="Party bus night" className="h-80 w-full object-cover" />
                <div className="p-6">
                  <p className="text-sm uppercase tracking-[0.4em] text-white/70">real vehicle photo</p>
                  <p className="mt-3 text-lg text-blue-200">
                    Shot on a 30-passenger wraparound lounge in Dallas. We pull every gallery image straight from our Supabase bucket so what you see is what you ride.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </div>

      <Section className="max-w-4xl mx-auto -mt-4">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-[0_20px_70px_rgba(3,7,18,0.55)]">
          <div className="flex flex-wrap items-center gap-4 text-sm text-blue-200/80">
            <span>Published {ARTICLE_META.published}</span>
            <span className="h-1 w-1 rounded-full bg-blue-300/70" aria-hidden />
            <span>Updated {ARTICLE_META.updated}</span>
            <span className="h-1 w-1 rounded-full bg-blue-300/70" aria-hidden />
            <span>{ARTICLE_META.readTime}</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-blue-100/70">
            {ARTICLE_TAGS.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 px-4 py-1">{tag}</span>
            ))}
          </div>
          <p className="mt-6 text-lg text-blue-50/90">
            This is the playbook we hand CFOs and bridesmaids alike: how party-bus math actually works, which fees are negotiable, and where you can reclaim dollars without gutting the experience.
          </p>
        </div>
      </Section>

      <Section className="max-w-4xl mx-auto mt-12">
        <article className="space-y-14 text-blue-100/90 leading-relaxed">
          <section>
            <p className="text-lg">
              Most “party bus pricing” guides stop at vague ranges. This one walks you through the exact flight-plan style math we run in dispatch. Think of it as black-box data translated for the people approving the invoice—finance, chiefs of staff, maids of honor, and anyone else betting their night on a rolling dance floor arriving on time.
            </p>
            <p className="mt-6">
              We start by anchoring the baseline: the driver’s guaranteed hours, the chassis you picked, and where that vehicle sleeps when it isn’t moving your group. Everything else—seasonal demand, paperwork friction, risk advisory—layers on top. When a number feels “high,” it’s almost always because the operator is being honest about all three layers instead of hiding them in a single flat rate.
            </p>
            <p className="mt-6">
              Our team keeps a living model for every metro. That model updates the moment we hear about a new stadium load-out restriction, a bridge closure, or a venue upgrading its insurance requirements. You deserve to see that same model so you can choose which levers to pull instead of hoping the quote fairy is kind today.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-white">Baseline economics: the clock, the coach, the city</h2>
            <p className="mt-4">A bus is not priced by the mile like a rideshare. It’s priced by everything that keeps that chassis reserved for you.</p>
            <ul className="mt-4 space-y-4 text-sm">
              <li><span className="font-semibold text-white">Clock control:</span> Operators quote in hourly blocks, usually four to six hours. If you need the vehicle staged earlier for photos or bag drop, that’s billable time even if no one has boarded.</li>
              <li><span className="font-semibold text-white">Vehicle class:</span> 14-passenger limo buses and 36-passenger club setups carry different insurance, maintenance, and storage costs. The nicer the build, the higher the starting rate.</li>
              <li><span className="font-semibold text-white">Metro factor:</span> Tier 1 cities pay union wages, premium fuel, and dense-parking storage. Secondary cities can run 20–30% cheaper simply because the bus yard overhead is lower.</li>
            </ul>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {ARTICLE_PILLARS.map((pillar) => (
                <div key={pillar.title} className="rounded-2xl border border-white/10 bg-[#080f1e] p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">{pillar.title}</p>
                  <p className="mt-3 text-sm text-blue-200/80">{pillar.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-white">Demand multipliers we watch like hawks</h2>
            <p className="mt-4">
              Once the baseline is set, we apply multipliers based on how hard it will be to keep your itinerary on schedule. The crazier the calendar, the more we pay seasoned drivers to stay on standby and the more we charge to make that worth it.
            </p>
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
              <ul className="space-y-4 text-sm leading-relaxed">
                <li><span className="font-semibold text-white">Stacked pickups:</span> Twenty minutes between stops looks harmless. Add in load time, photo ops, and elevator waits, and you just burned an extra hour.</li>
                <li><span className="font-semibold text-white">Late-night stadium egress:</span> Security barricades push drivers blocks away. They idle, loop, and re-stage. Fuel + overtime + coordination = +12–18%.</li>
                <li><span className="font-semibold text-white">Venue paperwork:</span> Casinos, military bases, or HQs require COIs and manifest uploads. Someone in operations spends hours on that even if nothing goes wrong.</li>
                <li><span className="font-semibold text-white">Short lead time:</span> Under 72 hours, we’re either reassigning a coach meant for another job or paying a partner fleet to bail us out. Both cost money.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-white">Keeping quotes defensible</h2>
            <p className="mt-4">We refuse to send mystery numbers. Instead, we run pricing like an ops room: simulations, driver briefings, and a ledger that updates whenever you tweak the plan.</p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6">
                <p className="text-sm uppercase tracking-[0.4em] text-emerald-200">Dispatch insight</p>
                <p className="mt-3 text-lg text-emerald-50">We pre-flight every ride, flagging dwell times longer than 12 minutes and identifying choke points so you can remove them or budget for them.</p>
              </div>
              <div className="rounded-3xl border border-sky-500/30 bg-sky-500/10 p-6">
                <p className="text-sm uppercase tracking-[0.4em] text-sky-200">Finance view</p>
                <p className="mt-3 text-lg text-sky-50">Live ledger shows base rate, gratuity, tolls, fuel, COI rush fees, and the credits we add when ops finds efficiencies.</p>
              </div>
            </div>
            <blockquote className="mt-8 rounded-3xl border border-white/10 bg-[#070e1c] p-6 text-lg italic text-blue-50">
              “When Bus2Ride shared the live ledger, procurement stopped redlining our quote—every possible surcharge already had a rationale.”
              <span className="mt-3 block text-sm text-blue-200/80">— Mariah L., Corporate Events</span>
            </blockquote>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-white">Booking timeline that protects your spend</h2>
            <p className="mt-4">Here’s the cadence we’ve proven in 300+ metros. Hit these milestones and you’ll rarely pay surge pricing.</p>
            <div className="mt-6 grid gap-4 text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">90+ days out</p>
                <p className="mt-2">Lock headcount ranges and venues. You get first pick of vehicles and we can still bundle multiple dates for discounts.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">45 days out</p>
                <p className="mt-2">Finalize pickup windows, ADA requirements, and paperwork. Dispatch runs the detailed route sim here.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">Inside 14 days</p>
                <p className="mt-2">Expect a 10–15% bump on peak weekends. Still doable, but budget for contingencies and have a plan B vehicle in mind.</p>
              </div>
            </div>
          </section>
        </article>
      </Section>

      <Section className="max-w-4xl mx-auto mt-12">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
          <p className="text-sm uppercase tracking-[0.5em] text-white/60">Build your own model</p>
          <p className="mt-4 text-blue-100/90">Curious what your night costs in the real world? Tweak the sliders below. We use the same logic internally when a producer, bride, or chief of staff calls in.</p>
        </div>
      </Section>

      <Section className="max-w-4xl mx-auto mt-16">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
          <p className="text-xs uppercase tracking-[0.6em] text-white/60">FAQ</p>
          <div className="mt-8 space-y-6">
            {FAQS.map((faq) => (
              <div key={faq.question} className="rounded-3xl border border-white/10 bg-[#080f1f] p-6">
                <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                <p className="mt-3 text-sm text-blue-200/80">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="max-w-6xl mx-auto pb-4">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#08142c]/90 via-[#070f24] to-[#040812] p-8 shadow-[0_25px_80px_rgba(4,11,34,0.75)]">
          <div className="flex flex-wrap items-center gap-3 border-b border-white/10 pb-6">
            <p className="text-xs uppercase tracking-[0.6em] text-blue-300/70">interactive estimator</p>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">beta</span>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div>
                <label className="text-sm text-blue-200">Metro profile</label>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {Object.entries(PRICING_CONFIG).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setCityTier(key as keyof typeof PRICING_CONFIG)}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                        cityTier === key ? "border-blue-400 bg-blue-500/10 text-white" : "border-white/10 text-blue-200"
                      }`}
                    >
                      <span className="block text-xs uppercase tracking-[0.3em] text-white/40">base ${value.base}/hr</span>
                      {value.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-blue-200">Hours booked ({hours}h)</label>
                  <input
                    type="range"
                    min={3}
                    max={8}
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="mt-2 w-full accent-blue-400"
                  />
                </div>
                <div>
                  <label className="text-sm text-blue-200">Passengers ({passengers})</label>
                  <input
                    type="range"
                    min={10}
                    max={40}
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    className="mt-2 w-full accent-purple-400"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setIsPeak(false)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    !isPeak ? "bg-emerald-500 text-white" : "bg-white/10 text-blue-200"
                  }`}
                >
                  Off-peak (Sun–Thu)
                </button>
                <button
                  onClick={() => setIsPeak(true)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    isPeak ? "bg-rose-500 text-white" : "bg-white/10 text-blue-200"
                  }`}
                >
                  Peak (Fri/Sat / April–June)
                </button>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-xs uppercase tracking-[0.6em] text-white/60">Projected invoice</p>
              <div className="mt-4 text-5xl font-semibold text-white">{formatCurrency(estimate.total)}</div>
              <p className="mt-2 text-sm text-blue-200">{formatCurrency(estimate.floor)} – {formatCurrency(estimate.ceiling)} realistic window</p>
              <div className="mt-6 grid gap-3 text-left text-sm text-blue-200">
                <div className="flex items-center justify-between">
                  <span>Base tier</span>
                  <span>${PRICING_CONFIG[cityTier].base.toFixed(0)}/hr</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Passenger multiplier</span>
                  <span>{passengers} riders</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Peak factor</span>
                  <span>{isPeak ? "+18%" : "baseline"}</span>
                </div>
              </div>
              <Link
                href="/quote#instant"
                className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg"
              >
                Push to live quote →
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <Section className="max-w-4xl mx-auto mt-10">
        <p className="text-lg leading-relaxed text-blue-100/85">
          While that estimator gives you the headline number, our ops team watches the inputs constantly. The next block shows exactly which signals tend to blow up a budget—and the adjustments we make before you ever feel them.
        </p>
      </Section>

      <Section className="max-w-6xl mx-auto mt-6">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
            <h2 className="text-3xl font-semibold">Cost signals we watch in real time.</h2>
            <p className="mt-3 text-blue-100/80">Every booking inherits a live dashboard. When any cost signal shifts, we show you exactly which lever moved and how much impact it has.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {COST_FACTORS.map((factor) => (
                <div key={factor.label} className="rounded-2xl border border-white/10 bg-[#090f20] p-5">
                  <p className="text-sm uppercase tracking-[0.4em] text-blue-300/80">{factor.label}</p>
                  <p className="mt-3 text-sm text-blue-100/80">{factor.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[32px] border border-emerald-500/30 bg-gradient-to-br from-emerald-400/10 via-emerald-500/5 to-transparent p-8">
            <p className="text-xs uppercase tracking-[0.6em] text-emerald-200">Signal log</p>
            <ul className="mt-6 space-y-4 text-sm text-emerald-100">
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                6:40 PM · Chicago loop: converted dual pickup into single rally point → saved 1 billed hour.
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                2:15 PM · Dallas: rain contingency triggered → driver staged two blocks closer, no overtime billed.
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                11:05 AM · Phoenix: ADA securement requested 5 days out → swapped chassis, zero rush fee.
              </li>
            </ul>
            <p className="mt-6 text-xs text-emerald-200">Ops feed is archived with your project so finance sees the same data.</p>
          </div>
        </div>
      </Section>

      <Section className="max-w-4xl mx-auto mt-12">
        <p className="text-lg leading-relaxed text-blue-100/85">
          Quotes are only as good as the choreography behind them. Here is the timeline our team runs internally—four steps that keep the vehicle, driver, and itinerary moving like they were rehearsed.
        </p>
      </Section>

      <Section className="max-w-6xl mx-auto mt-16">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
          <p className="text-xs uppercase tracking-[0.6em] text-white/60">Execution blueprint</p>
          <h2 className="mt-4 text-3xl font-semibold">From inquiry to rolling wheels, here is the exact choreography.</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-4">
            {TIMELINE.map((step, idx) => (
              <div key={step.title} className="relative rounded-3xl border border-white/10 bg-[#090f20] p-5">
                <span className="text-xs font-semibold text-white/60">Step {idx + 1}</span>
                <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-blue-200/80">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="max-w-4xl mx-auto mt-12">
        <p className="text-lg leading-relaxed text-blue-100/85">
          We always close with the tangible stuff—real vehicles, real utilization data, and the proof that transparent pricing performs better over time. Browse the gallery and metrics below to see what guests actually ride.
        </p>
      </Section>

      <Section className="max-w-6xl mx-auto mt-16">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
            <p className="text-xs uppercase tracking-[0.6em] text-white/60">What your money buys</p>
            <h2 className="mt-3 text-3xl font-semibold">Actual vehicles staged this week.</h2>
            <p className="mt-2 text-blue-200/80">Tap to enlarge. Every gallery tile links back to our Supabase inventory so you can cite the exact unit inside your quote.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {GALLERY.map((shot) => (
                <div key={shot.src} className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                  <SmartImage src={shot.src} alt={shot.alt} className="h-48 w-full object-cover transition duration-500 hover:scale-105" />
                  <p className="px-4 py-2 text-sm text-blue-200/80">{shot.alt}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-blue-600/10 via-sky-500/5 to-transparent p-8">
            <p className="text-xs uppercase tracking-[0.6em] text-white/70">Numbers that matter</p>
            <ul className="mt-6 space-y-4 text-sm text-blue-100">
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">Average paid hour utilization across our network last quarter: 91.7%.</li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">Median overtime billed after our planning playbook: 0 minutes.</li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">Customer satisfaction specifically on pricing transparency: 4.94 / 5.</li>
            </ul>
            <Link href="/quote#instant" className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-white/95 px-5 py-3 text-sm font-semibold text-[#040a18] shadow-lg">
              Build my cost model →
            </Link>
          </div>
        </div>
      </Section>

      <Section className="max-w-6xl mx-auto mt-20">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
          <p className="text-xs uppercase tracking-[0.6em] text-white/60">Related playbooks</p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {RELATED.map((item) => (
              <Link key={item.title} href={item.href} className="group rounded-3xl border border-white/10 bg-[#080f1f] p-5 transition hover:border-blue-400/60">
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-100">{item.title}</h3>
                <p className="mt-2 text-sm text-blue-200/80">{item.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-blue-300">Read article →</span>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      <Section className="max-w-4xl mx-auto my-20 text-center">
        <div className="rounded-[40px] border border-white/10 bg-gradient-to-r from-blue-600/40 via-indigo-600/30 to-purple-600/30 p-10 shadow-[0_30px_120px_rgba(5,8,30,0.65)]">
          <h2 className="text-3xl font-semibold">Ready for a finance-approved number?</h2>
          <p className="mt-4 text-blue-50/90">Drop your draft itinerary, and we’ll return a fully itemized quote with mitigation options baked in. Zero fluff, zero surprise fees.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/quote#instant" className="rounded-full bg-white/95 px-8 py-3 text-sm font-semibold text-[#040c1a] shadow-lg">
              Get instant estimate
            </Link>
            <Link href="tel:8885352566" className="rounded-full border border-white/40 px-8 py-3 text-sm font-semibold text-white">
              Call dispatch (888) 535-2566
            </Link>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
