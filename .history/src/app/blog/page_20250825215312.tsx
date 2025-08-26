"use client";

import React, { useMemo, useState } from "react";
import PageLayout from "../../components/PageLayout";
import Section from "../../components/Section";

/** Contact used in header CTAs (match Polls page) */
const PHONE_DISPLAY = "(888) 535-2566";
const PHONE_TEL = "8885352566";
const EMAIL = "info@bus2ride.com";

/** Image pool (we’ll rotate through these so you don’t have to manage 30 unique images right now) */
const IMAGE_POOL = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1465101178521-c1a9136a3c5c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1505839673365-e3971f8d9184?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521335629791-ce4aec67dd53?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1472173148041-00294f0814a2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1520975659191-6ce9a129306d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
];

/** Helper to rotate an image from the pool */
const imgAt = (i: number) => IMAGE_POOL[i % IMAGE_POOL.length];

/** 30+ SEO-friendly posts covering core high-intent topics */
const POSTS = [
  {
    title: "Party Bus Pricing 101: What Affects the Cost (and How to Save)",
    excerpt:
      "Peak dates, group size, and hours all impact price. Learn the levers you can pull to lock a great deal on your party bus.",
    date: "2025-08-01",
    author: "Bus2Ride Team",
  },
  {
    title: "Wedding Transportation Guide: Limo vs. Party Bus vs. Shuttle",
    excerpt:
      "Capacity, style, timeline, and budget—see which wedding ride is best for your ceremony, photos, and reception exit.",
    date: "2025-07-28",
    author: "Wedding Planner Pro",
  },
  {
    title: "Airport Transfers: Black Car vs. SUV—Which Should You Book?",
    excerpt:
      "Compare comfort, luggage space, and meet-and-greet options to choose the right vehicle for stress-free airport pickups.",
    date: "2025-07-20",
    author: "Bus2Ride Editors",
  },
  {
    title: "Prom Night Safety Checklist for Parents & Teens",
    excerpt:
      "Curfew, pick-up plans, chaperones, and the right vehicle. Set expectations early and ride safely.",
    date: "2025-07-15",
    author: "Bus2Ride Safety Team",
  },
  {
    title: "Corporate Shuttles: Build a Smooth Event Transportation Plan",
    excerpt:
      "Routes, loops, badges, and staging areas—your blueprint for painless guest movement.",
    date: "2025-07-10",
    author: "Corporate Travel Expert",
  },
  {
    title: "How Many People Fit? Seating & Comfort by Vehicle Type",
    excerpt:
      "From sedans to 45-passenger party buses—what 'fits' vs. what feels comfortable for real groups.",
    date: "2025-07-05",
    author: "Bus2Ride Team",
  },
  {
    title: "The Ultimate Bachelor & Bachelorette Party Bus Playbook",
    excerpt:
      "Plan the route, pick the vibe, bring the right drinks (and ice). Your zero-stress celebration guide.",
    date: "2025-06-28",
    author: "Bus2Ride Editors",
  },
  {
    title: "City Guide: Best Night-Out Routes by Party Bus",
    excerpt:
      "Pro route ideas with time cushions and photo stops—make traffic part of the fun.",
    date: "2025-06-22",
    author: "Local Host",
  },
  {
    title: "Wine & Brewery Tours: How to Plan a Perfect Tasting Day",
    excerpt:
      "Pacing, reservations, cooler space, and safe timing. Sip without stress.",
    date: "2025-06-18",
    author: "Taste Tour Crew",
  },
  {
    title: "Limo vs. SUV vs. Black Car: Which Looks Best for Your Event?",
    excerpt:
      "Style, privacy, and first impressions—what each vehicle signals and when to choose it.",
    date: "2025-06-12",
    author: "Limo Insider",
  },
  {
    title: "Homecoming & School Dances: Group Transportation Tips",
    excerpt:
      "Share costs, book early, and choose safe routes. A quick guide for parents and students.",
    date: "2025-06-05",
    author: "School Event Coordinator",
  },
  {
    title: "Concert Nights by Bus: Tailgating, Parking, and Drop Zones",
    excerpt:
      "Beat traffic, stage smart drop-offs, and pre-game safely with the right vehicle size.",
    date: "2025-05-29",
    author: "Bus2Ride Team",
  },
  {
    title: "Quinceañera Transportation: Timing, Photos, and Grand Entrances",
    excerpt:
      "Build a timeline with buffer, pick a photo-friendly vehicle, and plan your showstopper arrival.",
    date: "2025-05-22",
    author: "Event Stylist",
  },
  {
    title: "Casino Trips by Coach: Comfort Perks That Matter Most",
    excerpt:
      "Restrooms, reclining seats, and onboard power—maximize group comfort on longer rides.",
    date: "2025-05-15",
    author: "Coach Captain",
  },
  {
    title: "How to Read a Quote: Hourly vs. Flat Rate vs. Fuel/Service Fees",
    excerpt:
      "Transparent pricing explained—so you can compare apples to apples and avoid surprises.",
    date: "2025-05-10",
    author: "Bus2Ride Editors",
  },
  {
    title: "Photogenic Rides: Interior Lighting & Photo Stop Ideas",
    excerpt:
      "Pick vehicles with the right lighting and plan quick scenic stops for killer group pics.",
    date: "2025-05-05",
    author: "Content Creator",
  },
  {
    title: "How Early Should You Book? Lead Time by Season & Vehicle",
    excerpt:
      "Spring weddings and prom sell out fast—know the booking sweet spots for each vehicle type.",
    date: "2025-05-01",
    author: "Bus2Ride Team",
  },
  {
    title: "Accessible Group Travel: ADA Options to Request",
    excerpt:
      "Ramps, securements, and aisle widths—how to make sure everyone rides comfortably.",
    date: "2025-04-25",
    author: "Accessibility Advocate",
  },
  {
    title: "Airport Meet-and-Greet: What It Includes & When It’s Worth It",
    excerpt:
      "Inside terminal pickup, signage, and wait-time policies—arrive like a VIP without chaos.",
    date: "2025-04-18",
    author: "Black Car Pro",
  },
  {
    title: "BYOB on Party Buses: Rules, Coolers, and No-Glass Tips",
    excerpt:
      "What’s allowed, how much ice to bring, and how to keep it tidy and safe.",
    date: "2025-04-12",
    author: "Bus2Ride Safety Team",
  },
  {
    title: "Game Day Charters: Tailgate Setups & Stadium Logistics",
    excerpt:
      "Lot permits, canopy spots, and post-game pickup—plan like a pro.",
    date: "2025-04-05",
    author: "Sports Crew",
  },
  {
    title: "Luxury vs. Standard Limo: What You Actually Get for the Price",
    excerpt:
      "Materials, lighting, sound, and model year—see what ‘luxury’ really means.",
    date: "2025-03-29",
    author: "Limo Insider",
  },
  {
    title: "Neighborhood Pickup Strategy for Big Groups",
    excerpt:
      "One hub or multiple stops? Save time, avoid detours, and keep the schedule tight.",
    date: "2025-03-22",
    author: "Route Planner",
  },
  {
    title: "Safety First: What a Professional Chauffeur Does Differently",
    excerpt:
      "Pre-trip inspections, passenger briefings, and route changes on the fly—signs you chose right.",
    date: "2025-03-15",
    author: "Bus2Ride Team",
  },
  {
    title: "City Traffic 101: Building Realistic Timelines",
    excerpt:
      "Buffer windows, load times, and event exit surges—avoid the most common planning mistake.",
    date: "2025-03-08",
    author: "Dispatch Lead",
  },
  {
    title: "Split Payments & Group Budgeting: Tools That Make It Easy",
    excerpt:
      "How to fairly divide costs and collect fast—no awkward follow-ups.",
    date: "2025-03-01",
    author: "Bus2Ride Editors",
  },
  {
    title: "How to Choose a Local Vendor: Reviews, Insurance, and Fleet Age",
    excerpt:
      "Go beyond stars—what to verify before you book to protect your event.",
    date: "2025-02-22",
    author: "Safety Auditor",
  },
  {
    title: "Cold Weather Rides: Winter Tips for Limos & Buses",
    excerpt:
      "Warm-up time, door-to-door plans, and footwear—keep guests comfy and on schedule.",
    date: "2025-02-15",
    author: "Operations Manager",
  },
  {
    title: "Summer Peak Season: How to Find Last-Minute Availability",
    excerpt:
      "Vehicle swaps, flexible hours, and city-by-city strategies to snag a great ride.",
    date: "2025-02-08",
    author: "Bus2Ride Team",
  },
  {
    title: "Add-Ons That Are Actually Worth It",
    excerpt:
      "From aux + premium sound to photo stops and meet-and-greet—what delivers the most joy per dollar.",
    date: "2025-02-01",
    author: "Bus2Ride Editors",
  },
].map((p, i) => ({ ...p, image: imgAt(i) }));

export default function Page() {
  const [search, setSearch] = useState("");

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return POSTS;
    return POSTS.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q)
    );
  }, [search]);

  // Static selection of 6 follow-up posts (skip the first which already has a dedicated page link)
  const continueReading = useMemo(() => POSTS.slice(1, 7), []);

  return (
    <PageLayout
      gradientFrom="from-blue-950"
      gradientVia="via-blue-900"
      gradientTo="to-black"
      textColor="text-white"
    >
      {/* ---------- HERO / HEADER (matches your Polls page look) ---------- */}
      <section className="relative overflow-hidden min-h-[520px] md:min-h-[600px] flex flex-col items-center justify-center text-center py-20">
        {/* Primary bright gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-blue-600 to-indigo-900" />
        {/* Sheen overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 mix-blend-overlay pointer-events-none" />

        <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold mb-6 tracking-tight font-serif text-white drop-shadow-[0_6px_20px_rgba(0,0,0,.35)]">
          Blog & Insights
        </h1>
        <p className="relative z-10 text-2xl md:text-3xl max-w-3xl mx-auto mb-8 text-blue-50 font-medium drop-shadow">
          Guides, checklists, and insider tips for renting party buses, limos, shuttles, and black cars—plan with confidence.
        </p>

        {/* Header CTAs (optional but consistent with Polls page) */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center w-full max-w-3xl">
          <a
            href={`tel:${PHONE_TEL}`}
            className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] whitespace-nowrap bg-white/95 text-blue-900 hover:bg-white border-blue-200"
          >
            Call {PHONE_DISPLAY}
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] whitespace-nowrap bg-blue-600 text-white hover:bg-blue-700 border-blue-700"
          >
            Email Us
          </a>
          <a
            href="/quote#instant"
            className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] whitespace-nowrap bg-blue-800 text-white hover:bg-blue-900 border-blue-900"
          >
            ⚡ Instant Live Quote
          </a>
        </div>

        {/* Search in header */}
        <div className="relative z-10 w-full max-w-5xl mt-8 px-4">
          <div className="flex items-center justify-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts (pricing, wedding, airport, party bus, limo...)"
              className="w-full max-w-2xl rounded-full px-6 py-3 text-lg bg-white/90 text-blue-900 border border-white/60 placeholder-blue-900/60 shadow focus:outline-none focus:ring-2 focus:ring-white/70"
              aria-label="Search blog posts"
            />
          </div>
          <div className="mt-3 text-sm text-blue-50/90 text-center">
            {filteredPosts.length} / {POSTS.length} posts visible
          </div>
        </div>

        {/* Decorative wave divider */}
        <div className="absolute bottom-[-1px] left-0 right-0">
          <svg viewBox="0 0 1440 110" className="w-full h-[110px]" preserveAspectRatio="none">
            <path
              d="M0,80 C240,130 480,20 720,60 C960,100 1200,40 1440,80 L1440,120 L0,120 Z"
              fill="#0b1934"
              opacity="1"
            />
          </svg>
        </div>
      </section>

      {/* ---------- POSTS GRID ---------- */}
      <Section className="max-w-7xl mx-auto mb-16 bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl py-10 px-6">
        {filteredPosts.length === 0 ? (
          <div className="text-blue-200 text-xl text-center py-20">
            No blog posts found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPosts.map((post) => {
              const slug = post.title.startsWith("Party Bus Pricing 101")
                ? "/blog/party-bus-pricing-101"
                : undefined; // only first post has a dedicated page now
              const content = (
                <>
                  <div className="aspect-[4/2.2] w-full rounded-xl overflow-hidden mb-5 bg-blue-900/60">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-blue-100 font-serif tracking-wide">
                    {post.title}
                  </h2>
                  <p className="text-blue-200 mb-4 text-base font-sans min-h-[64px]">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-between text-blue-400 text-sm">
                    <span>{post.author}</span>
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString()}
                    </time>
                  </div>
                  {slug && (
                    <div className="mt-4 text-right">
                      <span className="inline-block text-sm font-semibold text-blue-300 group-hover:text-blue-200">
                        Read Article →
                      </span>
                    </div>
                  )}
                </>
              );
              return slug ? (
                <a
                  key={`${post.title}-${post.date}`}
                  href={slug}
                  className="group bg-blue-950/90 rounded-2xl shadow-2xl p-6 flex flex-col border border-blue-700/20 hover:scale-[1.015] hover:shadow-2xl transition-all duration-200 overflow-hidden text-white"
                >
                  {content}
                </a>
              ) : (
                <article
                  key={`${post.title}-${post.date}`}
                  className="group bg-blue-950/90 rounded-2xl shadow-2xl p-6 flex flex-col border border-blue-700/20 hover:scale-[1.015] hover:shadow-2xl transition-all duration-200 overflow-hidden text-white"
                >
                  {content}
                </article>
              );
            })}
          </div>
        )}
      </Section>
      {/* ---------- CONTINUE READING (6 more posts) ---------- */}
      <Section className="max-w-7xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow leading-[1.15]">
          Continue Reading
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {continueReading.map((post) => (
            <article
              key={`cont-${post.title}-${post.date}`}
              className="group bg-gradient-to-br from-blue-900/70 to-blue-950/90 backdrop-blur rounded-2xl shadow-xl p-5 flex flex-col border border-blue-700/30 hover:border-blue-500/50 hover:shadow-2xl transition-all duration-200 overflow-hidden"
            >
              <div className="aspect-[4/2.2] w-full rounded-xl overflow-hidden mb-4 bg-blue-900/40">
                <img
                  src={post.image}
                  alt={post.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-blue-100 font-serif tracking-wide leading-snug">
                {post.title}
              </h3>
              <p className="text-blue-200 mb-3 text-sm leading-relaxed line-clamp-4">
                {post.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between text-blue-400 text-xs">
                <span>{post.author}</span>
                <time dateTime={post.date} className="tracking-wide">
                  {new Date(post.date).toLocaleDateString()}
                </time>
              </div>
            </article>
          ))}
        </div>
      </Section>
      {/* ---------- FLEET CROSS-LINK CALLOUT ---------- */}
      <Section className="max-w-6xl mx-auto -mt-4 mb-8">
        <div className="relative overflow-hidden rounded-3xl p-8 md:p-10 bg-gradient-to-br from-blue-800 via-blue-900 to-black border border-blue-600/30 shadow-2xl">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,rgba(96,165,250,0.35),transparent_60%)]" />
          <div className="relative">
            <h3 className="text-2xl md:text-3xl font-extrabold mb-4 text-white font-serif tracking-tight">
              Explore the Fleet
            </h3>
            <p className="text-blue-200 text-base md:text-lg max-w-3xl leading-relaxed mb-5">
              Ready to compare vehicles? Jump straight into our core categories: {" "}
              <a href="/party-buses" className="font-semibold text-blue-300 hover:text-white underline decoration-blue-400/60 decoration-2 underline-offset-4 transition-colors">Party Buses</a>, {" "}
              <a href="/limousines" className="font-semibold text-blue-300 hover:text-white underline decoration-blue-400/60 decoration-2 underline-offset-4 transition-colors">Limousines</a>, and {" "}
              <a href="/coach-buses" className="font-semibold text-blue-300 hover:text-white underline decoration-blue-400/60 decoration-2 underline-offset-4 transition-colors">Coach Buses</a>. Browse interiors, capacities, comfort features, and get a feel for pricing.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/party-buses" className="px-5 py-2.5 rounded-full bg-white text-blue-900 font-bold text-sm shadow hover:shadow-lg transition">
                View Party Buses →
              </a>
              <a href="/limousines" className="px-5 py-2.5 rounded-full bg-blue-600 text-white font-bold text-sm shadow hover:bg-blue-500 hover:shadow-lg transition">
                View Limousines →
              </a>
              <a href="/coach-buses" className="px-5 py-2.5 rounded-full bg-blue-950 text-white font-bold text-sm border border-blue-500/40 shadow hover:bg-blue-900 transition">
                View Coach Buses →
              </a>
            </div>
          </div>
        </div>
      </Section>
      {/* ------------ VEHICLE PREVIEW SECTIONS (added) ------------ */}
      {/** Reuse a small local image list for each vehicle type */}
      <Section className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow leading-[1.15]">
          Party Buses
        </h2>
        <div className="relative flex items-center justify-center" style={{minHeight:'260px'}}>
          <a
            href="/party-buses"
            aria-label="View party bus fleet"
            className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-2xl transition shadow absolute left-[-68px] border-2 border-blue-200"
            style={{boxShadow:'0 2px 12px 0 rgba(30,64,175,0.10)'}}
          >
            ←
          </a>
          <div className="grid md:grid-cols-3 gap-6 w-full">
          {[
            "/images/18 Passenger White Party Bus Exterior.png",
            "/images/18 Passenger White Party Bus Interior.png",
            "/images/36 Passenger Party Bus Exterior 4.png",
          ].map((img, i) => (
            <div key={img} className="bg-white rounded-2xl shadow-xl p-4 flex flex-col items-center">
              <a href="/party-buses" className="block w-full group" aria-label="View party bus fleet">
                <img src={img} alt="Party Bus" className="w-full h-60 object-cover rounded-2xl mb-4 group-hover:opacity-90 transition" />
                <h4 className="text-base font-bold mb-2 text-blue-800">Party Bus {i + 1}</h4>
              </a>
              <div className="flex flex-col gap-2 w-full mt-auto">
                <a href="tel:8885352566" className="w-full bg-blue-700 text-white font-bold py-1 rounded-lg text-center text-base font-serif">888-535-2566</a>
                <a href="/quote" className="w-full bg-green-500 text-white font-bold py-1 rounded-lg text-center text-base font-serif hover:bg-green-600">Instant Live Quote</a>
              </div>
            </div>
          ))}
          </div>
          <a
            href="/party-buses"
            aria-label="View party bus fleet"
            className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-2xl transition shadow absolute right-[-68px] border-2 border-blue-200"
            style={{boxShadow:'0 2px 12px 0 rgba(30,64,175,0.10)'}}
          >
            →
          </a>
        </div>
      </Section>
      <Section className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow leading-[1.15]">
          Limousines
        </h2>
        <div className="relative flex items-center justify-center" style={{minHeight:'260px'}}>
          <a
            href="/limousines"
            aria-label="View limousine fleet"
            className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-2xl transition shadow absolute left-[-68px] border-2 border-blue-200"
            style={{boxShadow:'0 2px 12px 0 rgba(30,64,175,0.10)'}}
          >
            ←
          </a>
          <div className="grid md:grid-cols-3 gap-6 w-full">
          {[
            "/images/10 Passenger Lincoln Stretch Limo Interior.png",
            "/images/18 Passenger Hummer Limo Interior.png",
            "/images/18 Passenger Cadillac Escalade Limo Exterior.png",
          ].map((img, i) => (
            <div key={img} className="bg-white rounded-2xl shadow-xl p-4 flex flex-col items-center">
              <a href="/limousines" className="block w-full group" aria-label="View limousine fleet">
                <img src={img} alt="Limo" className="w-full h-60 object-cover rounded-2xl mb-4 group-hover:opacity-90 transition" />
                <h4 className="text-base font-bold mb-2 text-blue-800">Limo {i + 1}</h4>
              </a>
              <div className="flex flex-col gap-2 w-full mt-auto">
                <a href="tel:8885352566" className="w-full bg-blue-700 text-white font-bold py-1 rounded-lg text-center text-base font-serif">888-535-2566</a>
                <a href="/quote" className="w-full bg-green-500 text-white font-bold py-1 rounded-lg text-center text-base font-serif hover:bg-green-600">Instant Live Quote</a>
              </div>
            </div>
          ))}
          </div>
          <a
            href="/limousines"
            aria-label="View limousine fleet"
            className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-2xl transition shadow absolute right-[-68px] border-2 border-blue-200"
            style={{boxShadow:'0 2px 12px 0 rgba(30,64,175,0.10)'}}
          >
            →
          </a>
        </div>
      </Section>
      <Section className="max-w-6xl mx-auto mb-24">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow leading-[1.15]">
          Coach Buses
        </h2>
        <div className="relative flex items-center justify-center" style={{minHeight:'288px'}}>
          <a
            href="/coach-buses"
            aria-label="View coach bus fleet"
            className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-2xl transition shadow absolute left-[-68px] border-2 border-blue-200"
            style={{boxShadow:'0 2px 12px 0 rgba(30,64,175,0.10)'}}
          >
            ←
          </a>
          <div className="grid md:grid-cols-3 gap-6 w-full">
          {[
            "/images/Bus-1.png",
            "/images/Bus-2.png",
            "/images/Bus-3.png",
          ].map((img, i) => (
            <div key={img} className="bg-white rounded-2xl shadow-xl p-5 flex flex-col items-center">
              <a href="/coach-buses" className="block w-full group" aria-label="View coach bus fleet">
                <img src={img} alt="Coach Bus" className="w-full h-72 object-cover rounded-2xl mb-5 group-hover:opacity-90 transition" />
                <h4 className="text-base font-bold mb-2 text-blue-800">Coach Bus {i + 1}</h4>
              </a>
              <div className="flex flex-col gap-2 w-full mt-auto">
                <a href="tel:8885352566" className="w-full bg-blue-700 text-white font-bold py-1.5 rounded-lg text-center text-sm">888-535-2566</a>
                <a href="/quote" className="w-full bg-green-500 text-white font-bold py-1.5 rounded-lg text-center text-sm hover:bg-green-600">Instant Live Quote</a>
              </div>
            </div>
          ))}
          </div>
          <a
            href="/coach-buses"
            aria-label="View coach bus fleet"
            className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-2xl transition shadow absolute right-[-68px] border-2 border-blue-200"
            style={{boxShadow:'0 2px 12px 0 rgba(30,64,175,0.10)'}}
          >
            →
          </a>
        </div>
      </Section>
      {/* ---------- REVIEWS (blog footer style) ---------- */}
      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black mb-24">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow leading-[1.15]">
          Customer Reviews
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 max-w-5xl mx-auto">
          {[
            {
              quote:
                "Absolutely excellent! Great customer service, spotless vehicles, and super professional drivers—made our night effortless!",
              name: "Paul P.",
            },
            {
              quote:
                "Best price and experience we’ve had—party bus was immaculate and the team was beyond accommodating.",
              name: "Jessie A.",
            },
            {
              quote:
                "We booked for a bachelor + wedding weekend—flawless both times. Extended an hour on the fly. Total pros.",
              name: "Dee C.",
            },
            {
              quote:
                "Driver was friendly, on time, and the interior was pristine. Won’t use anyone else now!",
              name: "Halee H.",
            },
          ].map((r, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-7 flex flex-col justify-between border border-blue-100 min-h-[210px]"
            >
              <p className="text-gray-700 italic mb-4 text-base md:text-lg leading-relaxed">
                “{r.quote}”
              </p>
              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-700">— {r.name}</span>
                <span className="text-yellow-400">★★★★★</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <a
            href="/reviews"
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold px-10 py-4 rounded-2xl shadow-lg text-lg border border-blue-800/50 transition"
          >
            More Reviews
          </a>
        </div>
      </Section>
    </PageLayout>
  );
}
