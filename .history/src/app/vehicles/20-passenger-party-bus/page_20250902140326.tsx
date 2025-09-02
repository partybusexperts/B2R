import React from "react";
import Link from "next/link";
import QuoteButton from '../../../components/QuoteButton';
import Header from "../../../components/Header";
import PageLayout from "../../../components/PageLayout";
import SmartImage from "../../../components/SmartImage";

export const metadata = {
  title: "20 Passenger Party Bus | Bus2Ride",
  description:
    "Explore our 20 passenger party bus — great for medium-sized groups, events, and celebrations.",
};

// Simple card for vehicle cross-sell
function VehicleCard({
  href,
  title,
  img,
  subtitle,
}: {
  href: string;
  title: string;
  img: string;
  subtitle?: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl overflow-hidden bg-white/5 ring-1 ring-white/10 hover:ring-white/20 transition"
    >
      <div className="aspect-[16/9] overflow-hidden">
        <SmartImage
          src={img}
          alt={title}
          className="h-full w-full object-cover group-hover:scale-[1.02] transition"
        />
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-white">{title}</h4>
        {subtitle && <p className="text-sm text-white/70 mt-1">{subtitle}</p>}
      </div>
    </Link>
  );
}

export default function Page() {
  // —— cross-sell content (replace hrefs with your actual routes) ——
  const partyBuses = [
    {
      href: "/fleet/party-bus-14",
      title: "14 Passenger Party Bus",
      img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop",
      subtitle: "Compact • Night out",
    },
    {
      href: "/fleet/party-bus-20",
      title: "20 Passenger Party Bus",
      img: "https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?q=80&w=1200&auto=format&fit=crop",
      subtitle: "Best seller • Medium groups",
    },
    {
      href: "/fleet/party-bus-30",
      title: "30 Passenger Party Bus",
      img: "https://images.unsplash.com/photo-1542367597-46c5b2f0a8c1?q=80&w=1200&auto=format&fit=crop",
      subtitle: "Spacious • Big parties",
    },
  ];

  const limos = [
    {
      href: "/fleet/limo-sedan",
      title: "Luxury Sedan Limo",
      img: "https://images.unsplash.com/photo-1517940310602-85b05b0cb581?q=80&w=1200&auto=format&fit=crop",
      subtitle: "Executive • 2–3 ppl",
    },
    {
      href: "/fleet/limo-stretch",
      title: "Stretch Limousine",
      img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
      subtitle: "Classic • Weddings",
    },
    {
      href: "/fleet/limo-suv",
      title: "SUV Limousine",
      img: "https://images.unsplash.com/photo-1533473359328-8175d3de7f52?q=80&w=1200&auto=format&fit=crop",
      subtitle: "Roomier • Groups",
    },
  ];

  const coaches = [
    {
      href: "/fleet/coach-28",
      title: "28 Passenger Minicoach",
      img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1200&auto=format&fit=crop",
      subtitle: "Shuttles • Tours",
    },
    {
      href: "/fleet/coach-40",
      title: "40 Passenger Coach",
      img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop",
      subtitle: "Teams • Conferences",
    },
    {
      href: "/fleet/coach-56",
      title: "56 Passenger Coach",
      img: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1200&auto=format&fit=crop",
      subtitle: "Max capacity • Luggage",
    },
  ];

  return (
    // COPY the same props your other brand/dark pages use:
    <PageLayout
      gradientFrom="from-blue-950"
      gradientVia="via-black"
      gradientTo="to-blue-900"
      textColor="text-white"
    >
      {/* If Header supports a variant prop, also do: <Header variant="brandDark" /> */}
      <Header />

      {/* Featured Vehicle (just under header) */}
      <section className="max-w-6xl mx-auto px-4 pt-8 pb-12">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <span className="inline-block text-xs tracking-widest uppercase text-white/60">
              Featured Vehicle
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold mt-2">20 Passenger Party Bus</h1>
            <p className="mt-3 text-white/80">
              Perfect for birthdays, nights out, and medium group
              transportation. Premium sound, LED lighting, and comfortable wrap-around seating.
            </p>
            <ul className="mt-5 space-y-2 text-white/80">
              <li>• Seats up to 20 passengers</li>
              <li>• Bluetooth stereo & LED party lighting</li>
              <li>• Onboard cooler / mini-bar area</li>
            </ul>
            <div className="mt-6 flex gap-3">
              <QuoteButton defaultZip="49503" />
              <Link
                href="/free-instant-estimates"
                className="inline-flex items-center rounded-lg bg-white/10 px-5 py-3 font-semibold text-white hover:bg-white/20"
              >
                Instant Estimate
              </Link>
            </div>
          </div>

          {/* You said you only have two photos — hero + one secondary */}
          <div className="space-y-4">
            <SmartImage
              src="https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?q=80&w=1200&auto=format&fit=crop"
              alt="20 passenger party bus interior with lights"
              className="rounded-xl shadow-lg"
            />
            <div className="grid grid-cols-2 gap-3">
              <SmartImage
                src="https://images.unsplash.com/photo-1542367597-46c5b2f0a8c1?q=80&w=800&auto=format&fit=crop"
                alt="party bus exterior"
                className="rounded-lg"
              />
              <SmartImage
                src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop"
                alt="party bus group"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Quick Specs */}
        <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-xl font-semibold">Specs & Amenities</h3>
          <div className="mt-4 grid sm:grid-cols-3 gap-4 text-white/80">
            <div>
              <div className="text-white font-medium">Capacity</div>
              <div>20 passengers</div>
            </div>
            <div>
              <div className="text-white font-medium">Entertainment</div>
              <div>Bluetooth stereo, LED lighting</div>
            </div>
            <div>
              <div className="text-white font-medium">Extras</div>
              <div>Mini-bar cooler, privacy divider</div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore more vehicles */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">Explore more Party Buses</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {partyBuses.map((v) => (
            <VehicleCard key={v.href} {...v} />
          ))}
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4">Shop Limousines</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {limos.map((v) => (
            <VehicleCard key={v.href} {...v} />
          ))}
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4">Coach Buses</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {coaches.map((v) => (
            <VehicleCard key={v.href} {...v} />
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">Recent Reviews</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              quote:
                "Flawless night — clean bus, great sound, and the driver was on point.",
              name: "Mia R.",
            },
            {
              quote:
                "Perfect for our birthday group. Booking was easy and stress-free.",
              name: "Jordan P.",
            },
            {
              quote:
                "On time, friendly, and the lighting made the vibe. Would book again!",
              name: "Sam K.",
            },
          ].map((r, i) => (
            <div
              key={i}
              className="rounded-xl bg-white/5 p-5 ring-1 ring-white/10"
            >
              <p className="text-white/90">{r.quote}</p>
              <div className="mt-3 text-sm text-white/60">— {r.name}</div>
            </div>
          ))}
        </div>
        <Link
          href="/reviews"
          className="inline-block mt-6 text-sm text-blue-300 hover:text-blue-200"
        >
          Read all reviews →
        </Link>
      </section>

      {/* Polls */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">Quick Polls</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { id: "pricing-factor", q: "Most important price factor?" },
            { id: "partybus_vs_limo", q: "Party Bus vs Limo?" },
            { id: "important_partybus_feature", q: "Top party bus feature?" },
          ].map((p) => (
            <Link
              key={p.id}
              href={`/polls#${p.id}`}
              className="rounded-xl bg-white/5 p-5 ring-1 ring-white/10 hover:bg-white/10 transition"
            >
              <div className="text-white/90 font-medium">{p.q}</div>
              <div className="mt-2 text-sm text-white/60">Vote now →</div>
            </Link>
          ))}
        </div>
        <Link
          href="/polls"
          className="inline-block mt-6 text-sm text-blue-300 hover:text-blue-200"
        >
          See all polls →
        </Link>
      </section>

      {/* Tools */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">Helpful Tools</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { href: "/tools/vehicle-compare", t: "Compare Vehicles" },
            { href: "/tools/capacity-finder", t: "Capacity Finder" },
            { href: "/tools/cost-split", t: "Per-Person Splitter" },
            { href: "/tools/itinerary-builder", t: "Itinerary Builder" },
          ].map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="rounded-lg bg-white/5 p-4 ring-1 ring-white/10 hover:bg-white/10 transition"
            >
              <div className="text-white">{t.t}</div>
              <div className="text-white/60 text-sm mt-1">Open tool →</div>
            </Link>
          ))}
        </div>
        <Link
          href="/tools"
          className="inline-block mt-6 text-sm text-blue-300 hover:text-blue-200"
        >
          Browse all tools →
        </Link>
      </section>

      {/* Events */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">Plan by Event</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { href: "/events/wedding", t: "Weddings" },
            { href: "/events/prom", t: "Prom" },
            { href: "/events/birthday", t: "Birthdays" },
            { href: "/events/corporate", t: "Corporate" },
          ].map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="rounded-lg bg-white/5 p-4 ring-1 ring-white/10 hover:bg-white/10 transition"
            >
              <div className="text-white">{e.t}</div>
              <div className="text-white/60 text-sm mt-1">View options →</div>
            </Link>
          ))}
        </div>
        <Link
          href="/events"
          className="inline-block mt-6 text-sm text-blue-300 hover:text-blue-200"
        >
          See all events →
        </Link>
      </section>
    </PageLayout>
  );
}
