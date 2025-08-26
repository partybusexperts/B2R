"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import Section from "../../components/Section";
import { findState } from "../locationData";

interface Props {
  params: { state: string };
}

/* Alaska rich content (extendable for other states later) */
const alaskaSections = [
  {
    id: "overview",
    title: "Alaska Charter Bus & Limo Overview",
    body: `From Anchorage corporate shuttles to Juneau cruise transfers and Fairbanks aurora tours, Alaska ground transportation demands reliability in extreme conditions. We coordinate winter-ready vehicles, veteran drivers, and itineraries built around daylight cycles and weather windows.`,
  },
  {
    id: "popular-trips",
    title: "Popular Trip Types",
    body: "",
    bullets: [
      "Airport transfers: ANC, FAI, JNU with flight tracking & buffer time",
      "Cruise port shuttles (Whittier & Seward) with luggage staging",
      "Northern lights chase (dynamic routing to clearer skies)",
      "Corporate incentive & oil field crew transport",
      "National park & glacier sightseeing day charters",
    ],
  },
  {
    id: "seasonality",
    title: "Seasonality & Timing",
    body: "Summer brings long daylight and peak demand—book 90+ days ahead for Saturdays. Winter requires contingency padding for storms, roadway ice, and limited daylight. Shoulder seasons (Apr–May / Sep–Oct) can reduce rates 10–18% with more fleet flexibility.",
  },
  {
    id: "vehicle-readiness",
    title: "Vehicle Readiness in Cold Weather",
    body: "We verify block heaters, insulated storage, emergency kits, studded or appropriate winter tires (where legal), and redundant communication when cellular coverage thins on remote corridors.",
  },
  {
    id: "routing",
    title: "Routing & Distance Planning",
    body: "Alaska geography stretches travel times—add buffer for wildlife slowdowns, construction, and single-lane pilot car zones. We model drive segments with conservative average speeds versus posted limits for accuracy.",
  },
  {
    id: "pricing",
    title: "Pricing Framework",
    body: "Rates reflect limited fleet density + seasonal spikes. Multi-day excursions often bundle minimum hours + per-diem lodging for drivers. Ask about shoulder season and midweek strategy to optimize total cost.",
  },
  {
    id: "compliance",
    title: "Safety & Compliance",
    body: "DOT compliance, driver hours of service, winter operations protocols, and pre-trip inspections are strictly enforced. We surface certificates upon request and maintain transparent audit logs.",
  },
  {
    id: "booking-tips",
    title: "Booking Tips",
    bullets: [
      "Share contingency priorities (schedule vs budget) so we tune buffers.",
      "Provide passenger manifest if remote pickup coordination is needed.",
      "Clarify gear (skis, photo rigs, expedition cases) for cargo planning.",
      "Lock lodging for multi-day charters before finalizing route sequencing.",
    ],
  },
];

/* Sample reviews & polls placeholders (state-specific adaptation later) */
const REVIEWS = [
  {
    name: "Kara M.",
    city: "Anchorage",
    rating: 5,
    text: "Flawless winter shuttle—driver pre-heated the bus and tracked our delayed flight.",
  },
  {
    name: "Luis R.",
    city: "Fairbanks",
    rating: 5,
    text: "Aurora charter pivoted mid-route to clearer skies. Worth every mile.",
  },
  {
    name: "Janelle S.",
    city: "Juneau",
    rating: 5,
    text: "Cruise pier transfer with glacier stop—logistics dialed in, zero stress.",
  },
  {
    name: "Owen P.",
    city: "Wasilla",
    rating: 4,
    text: "Great bus & driver. Added photo stops seamlessly—only wish we booked longer.",
  },
];

const POLLS = [
  {
    question: "Favorite Alaska charter season?",
    options: ["Summer", "Winter", "Shoulder"],
    results: [12, 5, 7],
  },
  {
    question: "Top trip focus?",
    options: ["Scenic", "Corporate", "Adventure"],
    results: [14, 6, 10],
  },
];

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function StatePage({ params }: Props) {
  const entry = findState(params.state);

  if (!entry) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-black text-white">
        <Section className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            State Not Found
          </h1>
          <p className="text-lg text-blue-200 mb-8">
            We couldn&apos;t locate that service region yet.
          </p>
          <Link
            href="/locations"
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-4 rounded-2xl shadow-lg"
          >
            Back to Locations
          </Link>
        </Section>
      </main>
    );
  }

  const isAlaska = entry.state === "Alaska";
  const [reviewSearch, setReviewSearch] = useState("");
  const filteredReviews = useMemo(() => {
    const q = reviewSearch.trim().toLowerCase();
    if (!q) return REVIEWS;
    return REVIEWS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.text.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q)
    );
  }, [reviewSearch]);

  const stateInitial = entry.state[0].toUpperCase();
  const accent = isAlaska
    ? "from-cyan-300 via-blue-500 to-indigo-700"
    : "from-blue-300 via-sky-500 to-indigo-700";

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-black text-white">
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[520px] md:min-h-[600px] flex flex-col items-center justify-center text-center py-20">
        <div className={`absolute inset-0 bg-gradient-to-b ${accent}`} />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 mix-blend-overlay pointer-events-none" />
        <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold mb-6 tracking-tight font-serif text-white drop-shadow-[0_6px_20px_rgba(0,0,0,.35)]">
          {entry.state} Charter Buses & Limos
        </h1>
        <p className="relative z-10 text-2xl md:text-3xl max-w-4xl mx-auto mb-10 text-blue-50 font-medium drop-shadow">
          Reliable group transportation across {entry.state}
          {isAlaska && " — from cruise transfers to northern lights tours"}.
        </p>
        <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center w-full max-w-3xl">
          <a
            href="/quote#instant"
            className="rounded-full font-bold px-7 py-3 text-lg shadow-lg transition border flex items-center justify-center min-w-[200px] bg-white/95 text-blue-900 hover:bg-white border-blue-200"
          >
            ⚡ Instant Quote
          </a>
          <a
            href="/fleet"
            className="rounded-full font-bold px-7 py-3 text-lg shadow-lg transition border flex items-center justify-center min-w-[200px] bg-blue-700 text-white hover:bg-blue-800 border-blue-800"
          >
            🚌 View Fleet
          </a>
          <a
            href="tel:8885352566"
            className="rounded-full font-bold px-7 py-3 text-lg shadow-lg transition border flex items-center justify-center min-w-[200px] bg-blue-900 text-white hover:bg-black/80 border-blue-900"
          >
            📞 (888) 535-2566
          </a>
        </div>
        <div className="absolute bottom-[-1px] left-0 right-0">
          <svg
            viewBox="0 0 1440 110"
            className="w-full h-[110px]"
            preserveAspectRatio="none"
          >
            <path
              d="M0,80 C240,130 480,20 720,60 C960,100 1200,40 1440,80 L1440,120 L0,120 Z"
              fill="#122a56"
              opacity="1"
            />
          </svg>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-5 md:px-10 -mt-2">
        {/* BREADCRUMB */}
        <nav
          className="text-sm text-blue-200 mb-6 mt-10"
          aria-label="Breadcrumb"
        >
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href="/locations" className="hover:underline">
                Locations
              </Link>{" "}
              &raquo;
            </li>
            <li className="text-blue-100 font-semibold">{entry.state}</li>
          </ol>
        </nav>

        {/* CITIES */}
        <Section className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl border border-blue-500/30 py-10 px-6 mb-16">
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
              Cities We Serve in {entry.state}
            </h2>
            <div className="md:ml-auto">
              <span className="inline-flex items-center rounded-full bg-white/90 text-blue-900 border border-blue-200 px-4 py-2 font-bold">
                {stateInitial} • {entry.cities.length} cities
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {entry.cities.map((city) => {
              const href = `/locations/${slugify(city)}-${slugify(entry.state)}`;
              return (
                <Link
                  key={city}
                  href={href}
                  className="group relative overflow-hidden rounded-2xl bg-white/95 text-blue-900 border-2 border-blue-100 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition"
                  aria-label={`Open ${city}, ${entry.state}`}
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-extrabold leading-tight">
                        {city}
                      </h3>
                      <span className="text-blue-700 group-hover:translate-x-1 transition">
                        →
                      </span>
                    </div>
                    <div className="text-blue-700/80 text-sm">{entry.state}</div>
                    <div className="mt-4 flex gap-2">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold border border-blue-200">
                        Guides
                      </span>
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold border border-blue-200">
                        Fleet
                      </span>
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold border border-blue-200">
                        Quote
                      </span>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 left-6 right-6 h-10 rounded-full blur-2xl bg-gradient-to-r from-blue-400/30 via-blue-500/30 to-indigo-500/30" />
                </Link>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-2xl shadow-xl px-8 py-6 flex flex-col md:flex-row items-center gap-4 border-2 border-blue-400/60">
              <div className="text-xl font-extrabold text-center md:text-left">
                Not seeing your city? We likely still serve it.
              </div>
              <div className="flex gap-3">
                <a
                  href="/quote"
                  className="rounded-xl bg-white text-blue-900 font-bold px-6 py-3 shadow hover:bg-blue-50"
                >
                  Get a Free Quote
                </a>
                <a
                  href="tel:8885352566"
                  className="rounded-xl bg-blue-800 text-white font-bold px-6 py-3 shadow hover:bg-blue-900 border border-white/20"
                >
                  Call (888) 535-2566
                </a>
              </div>
            </div>
          </div>
        </Section>

        {/* ALASKA GUIDE OR GENERIC */}
        {isAlaska ? (
          <Section className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl border border-blue-500/30 py-12 px-6 mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
              Alaska Planning Guide
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[0, 1].map((col) => (
                <div key={col} className="space-y-8">
                  {alaskaSections
                    .slice(
                      col * Math.ceil(alaskaSections.length / 2),
                      (col + 1) * Math.ceil(alaskaSections.length / 2)
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
              About {entry.state} Service
            </h2>
            <p className="text-blue-100/90 leading-relaxed text-center max-w-3xl mx-auto">
              Detailed transportation guide for {entry.state} is coming soon.
              You can still request quotes, view fleet options, and lock dates
              now—content will expand with seasonal pricing insights, routing
              strategies, and local compliance notes.
            </p>
          </Section>
        )}

        {/* REVIEWS */}
        <Section className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl border border-blue-500/30 py-12 px-6 mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
            What Customers Say in {entry.state}
          </h2>

          <div className="max-w-3xl mx-auto mb-8">
            <input
              value={reviewSearch}
              onChange={(e) => setReviewSearch(e.target.value)}
              placeholder="Search reviews…"
              aria-label="Search reviews"
              className="w-full rounded-2xl px-5 py-4 bg-white/90 text-blue-900 border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg font-medium shadow"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {filteredReviews.map((r, i) => (
              <div
                key={i}
                className="relative bg-white rounded-2xl shadow-xl p-7 border-2 border-blue-100 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 rounded-full w-11 h-11 flex items-center justify-center text-2xl font-bold text-white shadow-lg border-2 border-blue-300/40">
                    {r.name[0]}
                  </div>
                  <span className="font-bold text-blue-900">
                    {r.name} • {r.city}
                  </span>
                  <span className="ml-auto text-yellow-400 text-xl">
                    {"★".repeat(r.rating)}
                  </span>
                </div>
                <p className="text-blue-800 italic">“{r.text}”</p>
                <svg
                  className="absolute right-0 bottom-0 opacity-10 w-24 h-24 pointer-events-none"
                  viewBox="0 0 100 100"
                >
                  <circle cx="50" cy="50" r="48" fill="url(#grad)" />
                  <defs>
                    <radialGradient id="grad">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1e293b" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Link
              href="/reviews"
              className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition"
            >
              More Reviews
            </Link>
          </div>
        </Section>

        {/* POLLS */}
        <Section className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl border border-blue-500/30 py-12 px-6 mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
            {isAlaska ? "Alaska Polls" : "Local Polls"}
          </h2>
          <p className="text-lg text-center text-blue-100 mb-8 max-w-2xl mx-auto">
            See what riders prefer. Vote and compare trends to plan smarter.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto">
            {POLLS.map((poll, idx) => {
              const total = poll.results.reduce((a, b) => a + b, 0);
              return (
                <div
                  key={idx}
                  className="bg-blue-950/90 rounded-2xl shadow-xl border border-blue-500/20 p-6"
                >
                  <h3 className="text-xl font-bold text-blue-100 mb-3">
                    {poll.question}
                  </h3>
                  <ul className="space-y-3">
                    {poll.options.map((opt, i) => {
                      const count = poll.results[i];
                      const pct = total ? Math.round((count / total) * 100) : 0;
                      return (
                        <li key={opt}>
                          <div className="flex justify-between text-sm text-blue-200 mb-1">
                            <span>{opt}</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="h-3 w-full bg-blue-900 rounded overflow-hidden">
                            <div
                              className="h-3 bg-blue-400"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-3 text-right text-xs text-blue-300">
                    ({total} votes)
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center mt-10">
            <Link
              href="/polls"
              className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition"
            >
              View All Polls
            </Link>
          </div>
        </Section>

        {/* TOOLS */}
        <Section className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl border border-blue-500/30 py-12 px-6 mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
            Helpful Tools
          </h2>
          <p className="text-lg text-center text-blue-100 mb-10 max-w-2xl mx-auto">
            Plan like a pro—compare vehicles, estimate per-person costs, and
            time your trip around {entry.state}&apos;s traffic and seasonality.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {[
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
                desc: `Smart time padding for ${entry.state} routes & conditions.`,
                href: "/tools",
              },
              {
                title: "📍 Zip Code Price Lookup",
                desc: "Find pricing for your city or zip code instantly.",
                href: "/tools",
              },
            ].map((tool) => (
              <div
                key={tool.title}
                className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100 text-left hover:shadow-2xl hover:-translate-y-1 transition"
              >
                <h3 className="text-blue-900 font-extrabold text-lg mb-2">
                  {tool.title}
                </h3>
                <p className="text-blue-800 mb-4">{tool.desc}</p>
                <a
                  href={tool.href}
                  className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded-2xl shadow transition"
                >
                  Try Now
                </a>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <a
              href="/tools"
              className="inline-block bg-white hover:bg-blue-50 text-blue-900 font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border-2 border-blue-100"
            >
              See All Tools
            </a>
          </div>
        </Section>
      </main>
    </main>
  );
}
