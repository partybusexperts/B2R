"use client";

import React, { useEffect, useMemo, useState } from "react";
import PageLayout from "../../../components/PageLayout";
import Section from "../../../components/Section";
import Link from "next/link";

// Image sets reused from home page (trimmed to essentials)
const partyBusImages = [
  "/images/18 Passenger White Party Bus Exterior.png",
  "/images/18 Passenger White Party Bus Interior.png",
  "/images/36 Passenger Party Bus Exterior 4.png",
  "/images/Bus-1.png",
  "/images/Bus-2.png",
  "/images/17 Passenger Black Party Bus Exterior.png",
];
const limoImages = [
  "/images/10 Passenger Lincoln Stretch Limo Interior.png",
  "/images/18 Passenger Hummer Limo Interior.png",
  "/images/18 Passenger Hummer Limo Exterior.png",
  "/images/16_Passenger_Stretch_Excursion_Exterior_optimized.jpg",
  "/images/18 Passenger Cadillac Escalade Limo Exterior.png",
  "/images/14 Passenger Sprinter Van Limo Style Interior Again.png",
];
const coachBusImages = [
  "/images/Bus-1.png",
  "/images/Bus-2.png",
  "/images/Bus-3.png",
  "/images/Bus-4.png",
  "/images/Bus-5.png",
];

function useShuffled<T>(arr: T[], count: number) {
  const [out, setOut] = useState<T[]>(() => arr.slice(0, count));
  useEffect(() => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random()).slice(0, count);
    setOut(shuffled);
  }, [arr, count]);
  return out;
}

// Pick 6 related post metadata (slugs only for now; others can be added later)
const RELATED: { title: string; href: string; blurb: string }[] = [
  {
    title: "How to Read a Quote: Hourly vs. Flat Rate vs. Fees",
    href: "/blog", // placeholder until dedicated page exists
    blurb: "Understand every line item so you can compare providers fairly and avoid surprise add-ons.",
  },
  {
    title: "How Early Should You Book? Lead Time by Season",
    href: "/blog",
    blurb: "Prom, spring wedding, or peak holiday? Learn the booking windows that keep pricing sane.",
  },
  {
    title: "Add-Ons That Are Actually Worth It",
    href: "/blog",
    blurb: "From premium sound to photo stops—what delivers the most enjoyment per dollar spent.",
  },
  {
    title: "City Traffic 101: Building Realistic Timelines",
    href: "/blog",
    blurb: "Buffers, load times, and event exit surges so you don't pay for idle overtime.",
  },
  {
    title: "Split Payments & Group Budgeting Tips",
    href: "/blog",
    blurb: "Collect money fast and fairly so one person isn't left chasing everyone afterward.",
  },
  {
    title: "Wedding Transportation Guide: Limo vs Shuttle",
    href: "/blog",
    blurb: "Compare style, capacity, and cost trade‑offs to design a stress‑free wedding flow.",
  },
];

export default function PartyBusPricing101() {
  const party = useShuffled(partyBusImages, 3);
  const limos = useMemo(() => limoImages.slice(0, 3), []);
  const coaches = useMemo(() => coachBusImages.slice(0, 3), []);

  return (
    <PageLayout
      gradientFrom="from-blue-950"
      gradientVia="via-blue-900"
      gradientTo="to-black"
      textColor="text-white"
    >
      {/* Article Hero */}
      <Section className="max-w-4xl mx-auto pt-14 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold font-serif tracking-tight bg-gradient-to-r from-blue-200 via-white to-blue-300 bg-clip-text text-transparent mb-6">
          Party Bus Pricing 101: What Affects Cost & How to Save
        </h1>
        <p className="text-blue-200 text-lg md:text-xl max-w-3xl mx-auto">
          A transparent, practical breakdown of real pricing drivers—so you book confidently, avoid junk fees, and stretch your budget without sacrificing experience.
        </p>
        <div className="mt-4 text-sm text-blue-300/80">Updated {new Date().toLocaleDateString()}</div>
      </Section>

      {/* Article Body */}
      <Section className="max-w-4xl mx-auto space-y-8 leading-relaxed text-blue-100 text-lg">
        <p>
          Party bus pricing can feel opaque the first time you search—hourly minimums here, fuel fees there, peak surcharges sprinkled on popular dates. Underneath the jargon is a fairly simple cost model: time, demand, vehicle class, and operational risk. In this guide we unpack each lever so you know what you are paying for, which levers you control, and where you should push back or ask clarifying questions before placing a deposit. Knowledge really does lower your effective rate because it lets you shape a trip that uses paid hours efficiently.
        </p>
        <p>
          The first major driver is seasonal and day‑of‑week demand. Spring Saturdays (weddings + prom overlap) and mid‑December holiday party weekends command the strongest utilization pressure. Operators set higher minimum hours or premium base rates because they can fill the calendar many times over. If you have flexibility, a Thursday or Sunday early evening ride in the same month can price 15–30% lower. Ask your provider: “If we shift to Sunday afternoon, does your minimum drop?” That one adjustment often saves a full unused hour.
        </p>
        <p>
          Hourly minimums matter more than the displayed hourly rate in many quotes. A $225/hr 5‑hour minimum is effectively $1,125 even if you only roll for 3.5 hours. A competitor at $250/hr but a 4‑hour minimum ($1,000) is actually cheaper if your itinerary is tight. Build a draft schedule (load, travel leg A, dwell time, return) and see how it compares against each minimum. When you are twenty or thirty minutes short of a threshold, consider modestly extending the plan with a photo stop or after‑drop to extract full value from hours you are forced to purchase anyway.
        </p>
        <p>
          Vehicle class and recent model year add layered premiums. Larger capacity buses cost more to purchase, insure, fuel, and store—so a 36 passenger party bus will scale almost linearly above an 18 passenger vehicle. Luxury build‑outs (wrap‑around leather seating, multi‑zone LED lighting, upgraded sound, perimeter pole mounts) insert a brand premium even at identical capacities. If your group size straddles two classes (say 16–18 people), compare per‑person cost: occasionally booking two smaller vehicles yields redundancy and lower aggregate dollars, especially on sparse travel legs.
        </p>
        <p>
          Distance and idle time change expense structure subtly. Most party bus trips are billed hourly within a service radius. Long one‑way transfers or suburban pickups that force a “deadhead” reposition can trigger fuel or relocation fees. If your plan includes a long dwell (example: two hours at a restaurant where the vehicle cannot safely stage nearby), clarify whether the clock keeps running. Sometimes you can negotiate a reduced standby rate if the operator can redeploy the driver for a micro‑task during that window—ask, don’t assume. Provide concise addresses up front so routing can be validated early.
        </p>
        <p>
          Overtime is the silent budget buster. Most contracts convert overage to 15‑minute or 30‑minute billing blocks at a higher effective multiplier (sometimes +10–20%). The fix: build realistic load and unload buffers (10–15 minutes each), account for event exit surges, and pre‑decide a “drop hard stop” time with your group. Nominate one rider as the time captain who gives the driver a 30 minute and 10 minute heads‑up. If you think you might extend, ask dispatch before the end of the booked window if the coach has a following assignment; availability clarity prevents stressful last‑minute decisions.
        </p>
        <p>
          Fees you should expect: fuel surcharge (when diesel spikes), cleaning (only if excessive debris or bio incident), and sometimes mandatory gratuity on larger capacity vehicles. Fees you should question: vague “administrative” line items that overlap with service or processing, duplicate fuel + energy surcharges, or ambiguous “priority” fees. A professional quote should itemize each component in plain language. Politely request a re‑issue if wording relies on internal shorthand—clear documentation signals operational maturity and makes post‑event reconciliation smooth.
        </p>
        <p>
          Deposits typically range 20–40% and secure calendar space plus prep (detailing, routing, staffing). Clarify refund or credit policy bands: how far out can you downsize or shift date without forfeiting? Some providers allow a one‑time reschedule if original slot backfills. If you are booking far in advance for a flexible event, preference a vendor with transparent modification windows; that flexibility has real option value when plans evolve. Always get confirmations (date, start, end, vehicle class) in writing—email thread is fine.
        </p>
        <p>
          Saving tactics stack: choose an off‑peak slot; right‑size vehicle capacity (avoid paying for empty seats); trim inactive dwell (tighten program flow); consolidate pickups into a single rally point with ride‑share feeders; and lock itinerary early to prevent day‑of wandering that burns paid minutes. Bring your own non‑glass beverages and pre‑chill to avoid upsold “stocking packages” unless they genuinely add convenience. If a feature (like premium lighting) does not matter to your group, ask if a simpler configuration unit is available at a lower tier.
        </p>
        <p>
          Data worth tracking after your trip: actual board time, first movement, arrival, return, and unload completion. Logging those five timestamps helps you refine future estimates and gives substance if you ever dispute billed overage. Share those with the next planner in your friend circle—that cumulative intelligence is why seasoned coordinators almost always hit budgets exactly. Treat each booking as a micro‑learning loop and your effective cost per rider will fall over time.
        </p>
        <p>
          The headline: party bus pricing rewards clarity, flexibility, and proactive communication. When you approach vendors with a structured plan, realistic timing, and targeted questions about line items, you shift the dynamic from opaque “take it or leave it” to collaborative optimization. Use this guide as a checklist, capture assumptions inside the quote email, and you will both reduce stress and free budget for the moments that actually create memories. Ready to model your own trip? Grab an instant live quote or call us and we will benchmark your draft itinerary together.
        </p>
        <div className="pt-2 text-blue-300 text-sm">Approx. 1,050 words • Educational guide</div>
      </Section>

      {/* Related Posts */}
      <Section className="max-w-6xl mx-auto mt-14 mb-20">
        <h2 className="text-3xl md:text-4xl font-extrabold font-serif text-center mb-10 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">
          Keep Learning
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {RELATED.map((r) => (
            <Link
              key={r.title}
              href={r.href}
              className="group block rounded-2xl bg-blue-950/80 border border-blue-700/30 p-6 hover:border-blue-400/60 hover:shadow-xl transition"
            >
              <h3 className="text-lg font-bold mb-2 text-blue-100 group-hover:text-white font-serif">
                {r.title}
              </h3>
              <p className="text-sm text-blue-300 leading-relaxed mb-3">{r.blurb}</p>
              <span className="text-blue-400 text-xs font-semibold tracking-wide group-hover:text-blue-300">READ →</span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Party Buses Preview */}
      <Section className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow leading-[1.15]">
          Party Buses
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {party.map((img, i) => (
            <div key={img} className="bg-white rounded-2xl shadow-xl p-4 flex flex-col items-center">
              <img src={img} alt="Party Bus" className="w-full h-60 object-cover rounded-2xl mb-4" />
              <h4 className="text-base font-bold mb-2 text-blue-800">Party Bus {i + 1}</h4>
              <div className="flex flex-col gap-2 w-full">
                <a href="tel:8885352566" className="w-full bg-blue-700 text-white font-bold py-1 rounded-lg text-center text-base font-serif">888-535-2566</a>
                <a href="/quote" className="w-full bg-green-500 text-white font-bold py-1 rounded-lg text-center text-base font-serif hover:bg-green-600">Instant Live Quote</a>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Limos */}
      <Section className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow leading-[1.15]">
          Limousines
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {limos.map((img, i) => (
            <div key={img} className="bg-white rounded-2xl shadow-xl p-4 flex flex-col items-center">
              <img src={img} alt="Limo" className="w-full h-60 object-cover rounded-2xl mb-4" />
              <h4 className="text-base font-bold mb-2 text-blue-800">Limo {i + 1}</h4>
              <div className="flex flex-col gap-2 w-full">
                <a href="tel:8885352566" className="w-full bg-blue-700 text-white font-bold py-1 rounded-lg text-center text-base font-serif">888-535-2566</a>
                <a href="/quote" className="w-full bg-green-500 text-white font-bold py-1 rounded-lg text-center text-base font-serif hover:bg-green-600">Instant Live Quote</a>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Coach Buses */}
      <Section className="max-w-6xl mx-auto mb-24">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow leading-[1.15]">
          Coach Buses
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {coaches.map((img, i) => (
            <div key={img} className="bg-white rounded-2xl shadow-xl p-5 flex flex-col items-center">
              <img src={img} alt="Coach Bus" className="w-full h-72 object-cover rounded-2xl mb-5" />
              <h4 className="text-base font-bold mb-2 text-blue-800">Coach Bus {i + 1}</h4>
              <div className="flex flex-col gap-2 w-full">
                <a href="tel:8885352566" className="w-full bg-blue-700 text-white font-bold py-1.5 rounded-lg text-center text-sm">888-535-2566</a>
                <a href="/quote" className="w-full bg-green-500 text-white font-bold py-1.5 rounded-lg text-center text-sm hover:bg-green-600">Instant Live Quote</a>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </PageLayout>
  );
}
