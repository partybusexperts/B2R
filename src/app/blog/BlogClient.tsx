"use client";

import React, { useMemo } from "react";
import Section from "../../components/Section";
import { SmartImage } from "../../components/SmartImage";
import type { BlogPostSummary } from "@/lib/blog/posts";

/** Contact used in header CTAs (match Polls page) */
const PHONE_DISPLAY = "(888) 535-2566";
const PHONE_TEL = "8885352566";
const EMAIL = "info@bus2ride.com";

const SUPABASE_URL_BASE = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const BLOG_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BLOG_BUCKET || "Blog";

const buildBlogImageUrl = (filename: string) => {
  if (SUPABASE_URL_BASE) {
    const encoded = filename
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");
    return `${SUPABASE_URL_BASE}/storage/v1/object/public/${BLOG_BUCKET}/${encoded}`;
  }
  return `/images/blog/${filename}`;
};

const POST_IMAGE_MAP: Record<string, string> = {
  "accessible-group-travel-ada-options-to-request": buildBlogImageUrl("Ada Accesibility.jpg"),
  "add-ons-that-are-actually-worth-it": buildBlogImageUrl("Add Ons.jpg"),
  "airport-transfers-black-car-vs-suv-which-should-you-book": buildBlogImageUrl("airport transfers.jpg"),
  "city-guide-best-night-out-routes-by-party-bus": buildBlogImageUrl("City Guide.jpg"),
  "the-ultimate-bachelor-bachelorette-party-bus-playbook": buildBlogImageUrl("Bachelor Bachelorette.jpg"),
  "wine-brewery-tours-how-to-plan-a-perfect-tasting-day": buildBlogImageUrl("Wine tour.jpg"),
  "byob-on-party-buses-rules-coolers-and-no-glass-tips": buildBlogImageUrl("BYOB on Party Bus.jpg"),
  "casino-trips-by-coach-comfort-perks-that-matter-most": buildBlogImageUrl("Casino Trips.jpg"),
  "city-traffic-101-building-realistic-timelines": buildBlogImageUrl("City Traffic.jpg"),
  "cold-weather-rides-winter-tips-for-limos-buses": buildBlogImageUrl("Cold Weather.jpg"),
  "concert-nights-by-bus-tailgating-parking-drop-zones": buildBlogImageUrl("Concerts.jpg"),
  "corporate-shuttles-build-a-smooth-event-transportation-plan": buildBlogImageUrl("Corporate Transfers.jpg"),
  "game-day-charters-tailgate-setups-stadium-logistics": buildBlogImageUrl("Game Day Charters.jpg"),
  "homecoming-school-dances-group-transportation-tips": buildBlogImageUrl("Homecoming.jpg"),
  "how-to-choose-a-local-vendor-reviews-insurance-fleet-age": buildBlogImageUrl("How Choose Local Vendor.jpg"),
  "how-early-should-you-book-lead-time-by-season-vehicle": buildBlogImageUrl("How Early To Book.jpg"),
  "how-many-people-fit-seating-comfort-by-vehicle-type": buildBlogImageUrl("How Many Fit.jpg"),
  "how-to-read-a-quote-hourly-vs-flat-rate-vs-fuel-service-fees": buildBlogImageUrl("How Read A Quote.jpg"),
  "limo-vs-suv-vs-black-car-which-looks-best-for-your-event": buildBlogImageUrl("Limo Versus Suv.jpg"),
  "luxury-vs-standard-limo-what-you-actually-get-for-the-price": buildBlogImageUrl("Luxury Upgrades.jpg"),
  "neighborhood-pickup-strategy-for-big-groups": buildBlogImageUrl("Neighborhood.jpg"),
  "party-bus-pricing-101": buildBlogImageUrl("Party Bus Pricing.jpg"),
  "photogenic-rides-interior-lighting-photo-stop-ideas": buildBlogImageUrl("Photogenic Stops.jpg"),
  "safety-first-what-a-professional-chauffeur-does-differently": buildBlogImageUrl("Safety.jpg"),
  "prom-night-safety-checklist-for-parents-teens": buildBlogImageUrl("Prom Safety.jpg"),
  "quinceanera-transportation-timing-photos-grand-entrances": buildBlogImageUrl("Quinceanera.jpg"),
  "split-payments-group-budgeting-tools-that-make-it-easy": buildBlogImageUrl("Split Payments.jpg"),
  "summer-peak-season-how-to-find-last-minute-availability": buildBlogImageUrl("Summer.jpg"),
  "wedding-transportation-guide-limo-vs-party-bus-vs-shuttle": buildBlogImageUrl("Wedding Transportation.jpg"),
};

/** Image pool (we’ll rotate through these so you don’t have to manage 30 unique images right now) */
const IMAGE_POOL = [
  "How Many Fit.jpg",
  "wedding shuttle.jpg",
  "pricing.jpg",
  "college gameday.jpg",
  "prom.jpg",
  "limo versus party bus.jpg",
  "multi stop night out.jpg",
].map((filename) => buildBlogImageUrl(filename));

const imgAt = (i: number) => IMAGE_POOL[i % IMAGE_POOL.length];

const resolveImage = (source: string | null | undefined, fallbackIndex: number) => {
  if (source) {
    if (/^https?:/i.test(source)) {
      return source;
    }
    return buildBlogImageUrl(source);
  }
  return imgAt(fallbackIndex);
};

type BlogClientProps = {
  posts: BlogPostSummary[];
};

export default function BlogClient({ posts }: BlogClientProps) {
  const hydratedPosts = useMemo(
    () =>
      posts.map((post, index) => ({
        ...post,
        heroImage: resolveImage(post.heroImage, index),
      })),
    [posts]
  );

  const filteredPosts = hydratedPosts;

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
                <div className="mt-auto flex justify-end text-blue-400 text-sm">
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
