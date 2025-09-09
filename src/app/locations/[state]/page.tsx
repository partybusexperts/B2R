"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import Section from "../../../components/Section";
import HeroHeader from "../../../components/HeroHeader";
import { findState, slugifyState } from "../locationData";
import { getStateContent } from "../stateContent";

interface Props {
  params: { state: string };
}

// All state-specific content (sections, reviews, polls) pulled from central content builder

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function StatePage({ params }: Props) {
  const entry = findState(params.state);
  const stateSlug = slugifyState(params.state);
  const content = getStateContent(stateSlug);

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
  const [pollSearch, setPollSearch] = useState("");
  const REVIEWS = content?.reviews || [];
  const POLLS = content?.polls || [];
  const sections = content?.sections || [];
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
  const filteredPolls = useMemo(() => {
    const q = pollSearch.trim().toLowerCase();
    if (!q) return POLLS;
    return POLLS.filter(
      (p) =>
        p.question.toLowerCase().includes(q) ||
        p.options.some((o) => o.toLowerCase().includes(q))
    );
  }, [pollSearch]);

  const stateInitial = entry.state[0].toUpperCase();
  const accent = isAlaska
    ? "from-cyan-300 via-blue-500 to-indigo-700"
    : "from-blue-300 via-sky-500 to-indigo-700";

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-black text-white">
      <HeroHeader
        pageSlug={`locations-${slugify(entry.state)}`}
        fallback={{
          page_slug: `locations-${slugify(entry.state)}`,
          title: `${entry.state} Charter Buses & Limos`,
          subtitle: `Reliable group transportation across ${entry.state}${isAlaska ? ' — from cruise transfers to northern lights tours' : ''}.`,
          primary_cta: { label: `Instant Quote`, href: `/quote#instant` },
          secondary_cta: { label: `View Fleet`, href: `/fleet` },
          tertiary_cta: { label: `Call (888) 535-2566`, href: `tel:8885352566` },
          gradient_from: accent.split(' ')[0] || 'from-blue-300',
          gradient_via: accent.split(' ')[1] || 'via-sky-500',
          gradient_to: accent.split(' ')[2] || 'to-indigo-700',
          text_color: 'text-white',
          wave_fill: '#122a56',
        }}
      />

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
        {sections.length ? (
          <Section className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl border border-blue-500/30 py-12 px-6 mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">
              {entry.state} Planning Guide
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[0, 1].map((col) => (
                <div key={col} className="space-y-8">
                  {sections
                    .slice(
                      col * Math.ceil(sections.length / 2),
                      (col + 1) * Math.ceil(sections.length / 2)
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
        <Section className="max-w-7xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-white font-serif tracking-tight">
            {entry.state} Customer Reviews
          </h2>
          <div className="w-full flex justify-center mb-8">
            <input
              type="text"
              placeholder="Search reviews by name or keywords…"
              value={reviewSearch}
              onChange={(e) => setReviewSearch(e.target.value)}
              className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              aria-label="Search reviews"
            />
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredReviews.map((review, i) => (
              <div key={i} className="relative bg-[#12244e] border border-blue-800/30 rounded-2xl shadow-xl p-7 flex flex-col gap-3 hover:scale-[1.02] transition-transform overflow-hidden">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-600 rounded-full w-11 h-11 flex items-center justify-center text-2xl font-bold text-white shadow-lg border border-blue-300/30">
                    {review.name[0]}
                  </div>
                  <span className="font-bold text-blue-50 text-lg">{review.name} • {review.city}</span>
                  <span className="ml-auto text-yellow-300 text-xl">{"★".repeat(review.rating)}</span>
                </div>
                <div className="text-blue-50 text-base leading-relaxed font-medium">
                  {review.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Link
              href="/reviews"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700"
            >
              More Reviews
            </Link>
          </div>
        </Section>

        {/* POLLS */}
        <Section className="max-w-7xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-2 text-white font-serif tracking-tight">
            {isAlaska ? 'Alaska Polls' : 'Local Polls'}
          </h2>
          <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-6">
            Real riders. Real opinions. Compare trends and get honest insights.
          </p>
          <div className="w-full flex justify-center mb-8">
            <input
              type="text"
              placeholder="Search polls…"
              value={pollSearch}
              onChange={(e) => setPollSearch(e.target.value)}
              className="w-full max-w-md rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              aria-label="Search polls"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredPolls.map((poll, idx) => (
              <div key={idx} className="bg-[#12244e] rounded-2xl shadow-xl border border-blue-800/30 p-6 flex flex-col items-center">
                <h3 className="text-xl font-bold text-blue-50 mb-2 text-center">{poll.question}</h3>
                <ul className="text-blue-100 mb-2 text-center">
                  {poll.options.map((opt, i) => (
                    <li key={i}>{opt}</li>
                  ))}
                </ul>
                <span className="text-blue-200 text-sm">Vote on our <a href="/polls" className="underline hover:text-blue-100">polls page</a>!</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Link
              href="/polls"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700"
            >
              More Polls
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
