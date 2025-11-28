"use client";

import React, { useMemo, useState } from "react";
import Section from "../../components/Section";
import { SmartImage } from "../../components/SmartImage";

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

const imgAt = (i: number) => IMAGE_POOL[i % IMAGE_POOL.length];

const SUPABASE_BASE = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_IMAGE_BUCKET;
  if (!url || !bucket) return null;
  return `${url}/storage/v1/object/public/${bucket}`;
})();

const fromSupabase = (key: string) => {
  const normalized = key.replace(/^\/+/, "");
  if (SUPABASE_BASE) return `${SUPABASE_BASE}/${encodeURI(normalized)}`;
  return `/${normalized}`;
};

const POSTS = [
  { slug: "party-bus-pricing-101", title: "Party Bus Pricing 101: What Affects the Cost (and How to Save)", excerpt: "Peak dates, group size, and hours all impact price. Learn the levers you can pull to lock a great deal on your party bus.", date: "2025-08-01", author: "Bus2Ride Team" },
  { slug: "wedding-transportation-guide-limo-vs-party-bus-vs-shuttle", title: "Wedding Transportation Guide: Limo vs. Party Bus vs. Shuttle", excerpt: "Capacity, style, timeline, and budget—see which wedding ride is best for your ceremony, photos, and reception exit.", date: "2025-07-28", author: "Wedding Planner Pro" },
  { slug: "airport-transfers-black-car-vs-suv-which-should-you-book", title: "Airport Transfers: Black Car vs. SUV—Which Should You Book?", excerpt: "Compare comfort, luggage space, and meet-and-greet options to choose the right vehicle for stress-free airport pickups.", date: "2025-07-20", author: "Bus2Ride Editors" },
  { slug: "prom-night-safety-checklist-for-parents-teens", title: "Prom Night Safety Checklist for Parents & Teens", excerpt: "Curfew, pick-up plans, chaperones, and the right vehicle. Set expectations early and ride safely.", date: "2025-07-15", author: "Bus2Ride Safety Team" },
  { slug: "corporate-shuttles-build-a-smooth-event-transportation-plan", title: "Corporate Shuttles: Build a Smooth Event Transportation Plan", excerpt: "Routes, loops, badges, and staging areas—your blueprint for painless guest movement.", date: "2025-07-10", author: "Corporate Travel Expert" },
  { slug: "how-many-people-fit-seating-comfort-by-vehicle-type", title: "How Many People Fit? Seating & Comfort by Vehicle Type", excerpt: "From sedans to 45-passenger party buses—what 'fits' vs. what feels comfortable for real groups.", date: "2025-07-05", author: "Bus2Ride Team" },
  { slug: "the-ultimate-bachelor-bachelorette-party-bus-playbook", title: "The Ultimate Bachelor & Bachelorette Party Bus Playbook", excerpt: "Plan the route, pick the vibe, bring the right drinks (and ice). Your zero-stress celebration guide.", date: "2025-06-28", author: "Bus2Ride Editors" },
  { slug: "city-guide-best-night-out-routes-by-party-bus", title: "City Guide: Best Night-Out Routes by Party Bus", excerpt: "Pro route ideas with time cushions and photo stops—make traffic part of the fun.", date: "2025-06-22", author: "Local Host" },
  { slug: "wine-brewery-tours-how-to-plan-a-perfect-tasting-day", title: "Wine & Brewery Tours: How to Plan a Perfect Tasting Day", excerpt: "Pacing, reservations, cooler space, and safe timing. Sip without stress.", date: "2025-06-18", author: "Taste Tour Crew" },
  { slug: "limo-vs-suv-vs-black-car-which-looks-best-for-your-event", title: "Limo vs. SUV vs. Black Car: Which Looks Best for Your Event?", excerpt: "Style, privacy, and first impressions—what each vehicle signals and when to choose it.", date: "2025-06-12", author: "Limo Insider" },
  { slug: "homecoming-school-dances-group-transportation-tips", title: "Homecoming & School Dances: Group Transportation Tips", excerpt: "Share costs, book early, and choose safe routes. A quick guide for parents and students.", date: "2025-06-05", author: "School Event Coordinator" },
  { slug: "concert-nights-by-bus-tailgating-parking-drop-zones", title: "Concert Nights by Bus: Tailgating, Parking, and Drop Zones", excerpt: "Beat traffic, stage smart drop-offs, and pre-game safely with the right vehicle size.", date: "2025-05-29", author: "Bus2Ride Team" },
  { slug: "quinceanera-transportation-timing-photos-grand-entrances", title: "Quinceañera Transportation: Timing, Photos, and Grand Entrances", excerpt: "Build a timeline with buffer, pick a photo-friendly vehicle, and plan your showstopper arrival.", date: "2025-05-22", author: "Event Stylist" },
  { slug: "casino-trips-by-coach-comfort-perks-that-matter-most", title: "Casino Trips by Coach: Comfort Perks That Matter Most", excerpt: "Restrooms, reclining seats, and onboard power—maximize group comfort on longer rides.", date: "2025-05-15", author: "Coach Captain" },
  { slug: "how-to-read-a-quote-hourly-vs-flat-rate-vs-fuel-service-fees", title: "How to Read a Quote: Hourly vs. Flat Rate vs. Fuel/Service Fees", excerpt: "Transparent pricing explained—so you can compare apples to apples and avoid surprises.", date: "2025-05-10", author: "Bus2Ride Editors" },
  { slug: "photogenic-rides-interior-lighting-photo-stop-ideas", title: "Photogenic Rides: Interior Lighting & Photo Stop Ideas", excerpt: "Pick vehicles with the right lighting and plan quick scenic stops for killer group pics.", date: "2025-05-05", author: "Content Creator" },
  { slug: "how-early-should-you-book-lead-time-by-season-vehicle", title: "How Early Should You Book? Lead Time by Season & Vehicle", excerpt: "Spring weddings and prom sell out fast—know the booking sweet spots for each vehicle type.", date: "2025-05-01", author: "Bus2Ride Team" },
  { slug: "accessible-group-travel-ada-options-to-request", title: "Accessible Group Travel: ADA Options to Request", excerpt: "Ramps, securements, and aisle widths—how to make sure everyone rides comfortably.", date: "2025-04-25", author: "Accessibility Advocate" },
  { slug: "airport-meet-and-greet-what-it-includes-when-its-worth-it", title: "Airport Meet-and-Greet: What It Includes & When It’s Worth It", excerpt: "Inside terminal pickup, signage, and wait-time policies—arrive like a VIP without chaos.", date: "2025-04-18", author: "Black Car Pro" },
  { slug: "byob-on-party-buses-rules-coolers-and-no-glass-tips", title: "BYOB on Party Buses: Rules, Coolers, and No-Glass Tips", excerpt: "What’s allowed, how much ice to bring, and how to keep it tidy and safe.", date: "2025-04-12", author: "Bus2Ride Safety Team" },
  { slug: "game-day-charters-tailgate-setups-stadium-logistics", title: "Game Day Charters: Tailgate Setups & Stadium Logistics", excerpt: "Lot permits, canopy spots, and post-game pickup—plan like a pro.", date: "2025-04-05", author: "Sports Crew" },
  { slug: "luxury-vs-standard-limo-what-you-actually-get-for-the-price", title: "Luxury vs. Standard Limo: What You Actually Get for the Price", excerpt: "Materials, lighting, sound, and model year—see what ‘luxury’ really means.", date: "2025-03-29", author: "Limo Insider" },
  { slug: "neighborhood-pickup-strategy-for-big-groups", title: "Neighborhood Pickup Strategy for Big Groups", excerpt: "One hub or multiple stops? Save time, avoid detours, and keep the schedule tight.", date: "2025-03-22", author: "Route Planner" },
  { slug: "safety-first-what-a-professional-chauffeur-does-differently", title: "Safety First: What a Professional Chauffeur Does Differently", excerpt: "Pre-trip inspections, passenger briefings, and route changes on the fly—signs you chose right.", date: "2025-03-15", author: "Bus2Ride Team" },
  { slug: "city-traffic-101-building-realistic-timelines", title: "City Traffic 101: Building Realistic Timelines", excerpt: "Buffer windows, load times, and event exit surges—avoid the most common planning mistake.", date: "2025-03-08", author: "Dispatch Lead" },
  { slug: "split-payments-group-budgeting-tools-that-make-it-easy", title: "Split Payments & Group Budgeting: Tools That Make It Easy", excerpt: "How to fairly divide costs and collect fast—no awkward follow-ups.", date: "2025-03-01", author: "Bus2Ride Editors" },
  { slug: "how-to-choose-a-local-vendor-reviews-insurance-fleet-age", title: "How to Choose a Local Vendor: Reviews, Insurance, and Fleet Age", excerpt: "Go beyond stars—what to verify before you book to protect your event.", date: "2025-02-22", author: "Safety Auditor" },
  { slug: "cold-weather-rides-winter-tips-for-limos-buses", title: "Cold Weather Rides: Winter Tips for Limos & Buses", excerpt: "Warm-up time, door-to-door plans, and footwear—keep guests comfy and on schedule.", date: "2025-02-15", author: "Operations Manager" },
  { slug: "summer-peak-season-how-to-find-last-minute-availability", title: "Summer Peak Season: How to Find Last-Minute Availability", excerpt: "Vehicle swaps, flexible hours, and city-by-city strategies to snag a great ride.", date: "2025-02-08", author: "Bus2Ride Team" },
  { slug: "add-ons-that-are-actually-worth-it", title: "Add-Ons That Are Actually Worth It", excerpt: "From aux + premium sound to photo stops and meet-and-greet—what delivers the most joy per dollar.", date: "2025-02-01", author: "Bus2Ride Editors" },
].map((p, i) => ({ ...p, image: imgAt(i) }));

export default function BlogClient() {
  const [search] = useState("");

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

  return (
    <>
      <Section className="max-w-7xl mx-auto mb-16 bg-gradient-to-br from-blue-900/80 to-black rounded-2xl shadow-xl py-10 px-6">
        {filteredPosts.length === 0 ? (
          <div className="text-blue-200 text-xl text-center py-20">No blog posts found.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPosts.map((post) => (
              <a
                key={`${post.title}-${post.date}`}
                href={`/blog/${post.slug}`}
                className="group bg-blue-950/90 rounded-2xl shadow-2xl p-6 flex flex-col border border-blue-700/20 hover:scale-[1.015] hover:shadow-2xl transition-all duration-200 overflow-hidden text-white"
              >
                <div className="aspect-[4/2.2] w-full rounded-xl overflow-hidden mb-5 bg-blue-900/60">
                  <SmartImage
                    src={post.image}
                    alt={post.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-blue-100 font-serif tracking-wide">{post.title}</h2>
                <p className="text-blue-200 mb-4 text-base font-sans min-h-[64px]">{post.excerpt}</p>
                <div className="mt-auto flex items-center justify-between text-blue-400 text-sm">
                  <span>{post.author}</span>
                  <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
                </div>
                <div className="mt-4 text-right">
                  <span className="inline-block text-sm font-semibold text-blue-300 group-hover:text-blue-200">
                    Read Article →
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </Section>

      <Section className="max-w-6xl mx-auto -mt-4 mb-8">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#050f24] py-14 px-6 sm:px-10 text-center shadow-[0_35px_80px_rgba(5,15,36,0.55)]">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.35),_transparent_55%)]" aria-hidden />
          <div className="relative max-w-4xl mx-auto">
            <p className="text-xs uppercase tracking-[0.5em] text-white/60 font-semibold">Fleet preview</p>
            <h3 className="mt-4 text-3xl md:text-4xl font-extrabold text-white leading-tight">Explore party buses, limos, and coach buses in one place</h3>
            <p className="mt-4 text-base md:text-lg text-white/70">
              Compare interiors, amenities, and capacity ranges. Tap a card to jump directly into that vehicle collection and grab real photos plus pricing context.
            </p>
          </div>

          <div className="relative mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Party Buses",
                href: "/party-buses",
                img: "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/22%20Passenger%20Party%20Bus/22%20Passenger%20Party%20Bus%20Interior%20Lux.png",
                vibe: "LED lounges, BYOB-friendly setups",
              },
              {
                title: "Limousines",
                href: "/limousines",
                img: "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/10%20Passenger%20White%20Chrysler%20300%20Limo/10%20Passenger%20White%20Chrysler%20300%20Limo%20Exterior%20Lux.png",
                vibe: "Stretch style, leather seating, bar setups",
              },
              {
                title: "Coach Buses",
                href: "/coach-buses",
                img: "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/26%20Passenger%20Shuttle%20Bus/26%20Passenger%20Shuttle%20Bus%20Interior%20Lux.png",
                vibe: "Reclining seats, luggage bays, climate control",
              },
            ].map((card) => (
              <a
                key={card.title}
                href={card.href}
                className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-4 text-left backdrop-blur-sm transition hover:-translate-y-1"
                aria-label={`View ${card.title}`}
              >
                <div className="aspect-[4/2.2] w-full overflow-hidden rounded-xl">
                  <SmartImage
                    src={card.img}
                    alt={card.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  />
                </div>
                <div className="mt-4">
                  <h4 className="text-xl font-bold text-white">{card.title}</h4>
                  <p className="mt-1 text-sm text-white/70">{card.vibe}</p>
                </div>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-200">
                  Browse {card.title} <span aria-hidden>→</span>
                </span>
              </a>
            ))}
          </div>

          <div className="relative mt-10 flex flex-wrap justify-center gap-4">
            <a href="/party-buses" className="rounded-full bg-white text-blue-900 px-6 py-2.5 text-sm font-semibold shadow">
              Party Buses →
            </a>
            <a href="/limousines" className="rounded-full border border-white/30 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
              Limousines →
            </a>
            <a href="/coach-buses" className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-500">
              Coach Buses →
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
