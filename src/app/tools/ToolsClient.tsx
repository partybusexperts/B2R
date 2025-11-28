"use client";

import React, { useMemo, useState, useEffect } from "react";
import tools, { CATEGORY_ORDER, ToolCategory, ToolEntry } from "../../components/tools/registry";
import ToolsGrid from "../../components/tools/ToolsGrid";
import Section from "../../components/Section";
import SmartImage from "../../components/SmartImage";
import HomePolls from "../../components/HomePolls";
import FaqSearchClient from "@/components/faqs/FaqSearchClient";
import PollColumnsByCategoryClient from "@/components/polls/PollColumnsByCategoryClient";
import type { HomepageVehicle, HomepageVehicleCategory } from "@/types/homepageVehicles";
import type { ReviewRow } from "@/lib/server/reviews";
import type { FaqItem } from "@/lib/server/faqs";
import type { HomePollColumn } from "@/lib/home-polls";

/* ---------- helpers ---------- */
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const FLEET_ORDER: HomepageVehicleCategory[] = ["party-buses", "limousines", "coach-buses"];

const FLEET_LABELS: Record<HomepageVehicleCategory, { label: string; link: string; accent: string }> = {
  "party-buses": { label: "Party Buses", link: "/fleet#party-bus", accent: "from-pink-500/40 via-fuchsia-500/20 to-transparent" },
  limousines: { label: "Limousines", link: "/fleet#limo", accent: "from-sky-500/40 via-blue-500/20 to-transparent" },
  "coach-buses": { label: "Coach Buses", link: "/fleet#coach", accent: "from-amber-500/40 via-yellow-500/20 to-transparent" },
};

type FleetCard = {
  id: string | number;
  title: string;
  imageUrl: string;
  capacityLabel?: string;
  amenities?: string[];
};

type DisplayReview = {
  id: string | number;
  author: string;
  body: string;
  rating: number;
  source?: string | null;
  sourceUrl?: string | null;
  published?: string | null;
};

type ToolsClientProps = {
  featuredFleet?: Record<HomepageVehicleCategory, HomepageVehicle[]> | null;
  featuredReviews?: ReviewRow[];
  faqs?: FaqItem[];
  pollColumns?: HomePollColumn[];
};

const FALLBACK_FLEET: Record<HomepageVehicleCategory, FleetCard[]> = {
  "party-buses": [
    {
      id: "party-18",
      title: "18p White Party Bus",
      imageUrl:
        "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/18%20Passenger%20Party%20Bus/18%20Passenger%20Party%20Bus%20Exterior%20Lux.png",
      capacityLabel: "18 seats",
    },
    {
      id: "party-22",
      title: "22p Club Interior",
      imageUrl:
        "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/22%20Passenger%20Party%20Bus/22%20Passenger%20Party%20Bus%20Interior%20Lux.png",
      capacityLabel: "22 seats",
    },
    {
      id: "party-36",
      title: "36p Neon Lounge",
      imageUrl:
        "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/36%20Passenger%20Party%20Bus/36%20Passenger%20Party%20Bus%20Interior%20Lux.png",
      capacityLabel: "36 seats",
    },
  ],
  limousines: [
    {
      id: "limo-10",
      title: "10p Chrysler 300",
      imageUrl:
        "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/10%20Passenger%20White%20Chrysler%20300%20Limo/10%20Passenger%20White%20Chrysler%20300%20Limo%20Exterior%20Lux.png",
      capacityLabel: "10 seats",
    },
    {
      id: "limo-14",
      title: "14p Lincoln Stretch",
      imageUrl:
        "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/14%20Passenger%20Stretch%20Limo/14%20Passenger%20Stretch%20Limo%20Interior%20Lux.png",
      capacityLabel: "14 seats",
    },
    {
      id: "limo-20",
      title: "20p Hummer Limo",
      imageUrl:
        "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/20%20Passenger%20Hummer%20Limo/20%20Passenger%20Hummer%20Limo%20Exterior%20Lux.png",
      capacityLabel: "20 seats",
    },
  ],
  "coach-buses": [
    {
      id: "coach-28",
      title: "28p Mini Coach",
      imageUrl:
        "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/30%20Passenger%20Coach%20Bus/30%20Passenger%20Coach%20Bus%20Exterior%20Lux.png",
      capacityLabel: "28 seats",
    },
    {
      id: "coach-47",
      title: "47p Charter Coach",
      imageUrl:
        "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/47%20Passenger%20Coach%20Bus/47%20Passenger%20Coach%20Bus%20Interior%20Lux.png",
      capacityLabel: "47 seats",
    },
    {
      id: "coach-56",
      title: "56p Motorcoach",
      imageUrl:
        "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/56%20Passenger%20Coach%20Bus/56%20Passenger%20Coach%20Bus%20Exterior%20Lux.png",
      capacityLabel: "56 seats",
    },
  ],
};

const FALLBACK_REVIEWS: DisplayReview[] = [
  { id: "rev-paul", author: "Paul P.", body: "Absolutely excellent! They double-checked everything and the driver was fantastic.", rating: 5 },
  { id: "rev-jessie", author: "Jessie A.", body: "The limo company you need to call for events. Prices and buses are great.", rating: 5 },
  { id: "rev-dee", author: "Dee C.", body: "Lives up to their name! We’ve used them for multiple events—always great!", rating: 5 },
  { id: "rev-halee", author: "Halee H.", body: "Clean interior, friendly driver—will never use another company.", rating: 5 },
  { id: "rev-rachel", author: "Rachel L.", body: "Best time ever!! 100% recommend.", rating: 5 },
  { id: "rev-becky", author: "Becky B.", body: "Beautiful vehicles and dependable service. Highly recommend!", rating: 5 },
];

const TOOL_METRICS = [
  { label: "Ops automations", value: "42+" },
  { label: "Cities connected", value: "38" },
  { label: "Supabase tables", value: "17" },
  { label: "Avg. deploy time", value: "4 min" },
];

const TOOL_KEYWORDS = ["Quote Builder", "Reviews Feed", "Ops Dash", "SMS", "Reports", "AI Drafts"];

type EventSpotlight = {
  title: string;
  blurb: string;
  link: string;
  image: string;
  tag: string;
  stat: string;
};

const FEATURED_EVENTS: EventSpotlight[] = [
  {
    title: "Wedding Shuttle Grid",
    blurb: "Layer bachelor pickup, ceremony hop, and sparkler exit loops with a single dispatcher console.",
    link: "/events/weddings",
    image:
      "https://images.unsplash.com/photo-1520854223477-5e2c1a6610f0?auto=format&fit=crop&w=900&q=80",
    tag: "Weddings",
    stat: "6 legs avg",
  },
  {
    title: "Concert Convoy",
    blurb: "Sync arrival texts and tailgate timers so the entire squad arrives gate-ready.",
    link: "/events/concerts",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=80",
    tag: "Concerts",
    stat: "90 min hold",
  },
  {
    title: "Game Day Charter",
    blurb: "Batch seat maps, cooler inventory, and post-game lot releases inside a single itinerary.",
    link: "/events/sporting-events",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80",
    tag: "Sports",
    stat: "3 coach stack",
  },
  {
    title: "Winery Loop",
    blurb: "Pre-load tasting room ETAs, driver gratuities, and ADA detours without downgrading vibe.",
    link: "/events/winery-tours",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
    tag: "Leisure",
    stat: "4 stops",
  },
  {
    title: "Corporate Roadshow",
    blurb: "Bundle venue passes, badge scans, and airport transfers into one tap-to-approve queue.",
    link: "/events/corporate",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
    tag: "Corporate",
    stat: "48 hr sla",
  },
];

/* Group tools by category while preserving original registry order */
function groupByCategory(items: ToolEntry[]) {
  const map = new Map<ToolCategory, ToolEntry[]>();
  CATEGORY_ORDER.forEach((c) => map.set(c, []));
  for (const t of items) {
    if (!map.has(t.category)) map.set(t.category as ToolCategory, []);
    map.get(t.category as ToolCategory)!.push(t);
  }
  return map;
}

const buildCapacityLabel = (vehicle?: HomepageVehicle | null) => {
  if (!vehicle) return undefined;
  const cap = vehicle.capacityMax ?? vehicle.capacityMin;
  if (!cap) return undefined;
  return `${cap} seats`;
};

export default function ToolsClient({ featuredFleet, featuredReviews = [], faqs = [], pollColumns = [] }: ToolsClientProps) {
  const [registry, setRegistry] = useState<ToolEntry[]>(tools);
  const [query, setQuery] = useState("");
  const [catSelect, setCatSelect] = useState<ToolCategory | "All">("All");
  const [eventSpotlights, setEventSpotlights] = useState<EventSpotlight[]>(() => FEATURED_EVENTS.slice(0, 3));

  useEffect(() => {
    async function load() {
      try {
        const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!url || !key) return;
        const endpoint = `${url}/rest/v1/tools?select=*`;
        const res = await fetch(endpoint, {
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
            Accept: "application/json",
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setRegistry(
            data.map((r: any) => ({
              id: r.id,
              title: r.title,
              desc: r.desc,
              category: r.category || "Uncategorized",
              href: r.href || `/tools/${r.id}`,
            })),
          );
        }
      } catch {
        // ignore and keep bundled registry
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (FEATURED_EVENTS.length <= 3) return;
    const shuffled = [...FEATURED_EVENTS].sort(() => Math.random() - 0.5);
    setEventSpotlights(shuffled.slice(0, 3));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return registry;
    return registry.filter((t) =>
      [t.title, t.desc, ...(t.keywords || [])].join(" ").toLowerCase().includes(q),
    );
  }, [query, registry]);

  const grouped = useMemo(() => groupByCategory(filtered), [filtered]);

  const fleetColumns = useMemo(() => {
    return FLEET_ORDER.map((category) => {
      const supaVehicles = (featuredFleet?.[category] ?? []).filter((vehicle) =>
        Boolean(vehicle?.imageUrl || vehicle?.secondaryImageUrl || vehicle?.thirdImageUrl),
      );
      const supaCards: FleetCard[] = supaVehicles.slice(0, 3).map((vehicle) => ({
        id: vehicle.id ?? `${category}-${vehicle.name}`,
        title: vehicle.name,
        imageUrl: vehicle.imageUrl || vehicle.secondaryImageUrl || vehicle.thirdImageUrl || "",
        capacityLabel: buildCapacityLabel(vehicle),
        amenities: (vehicle.amenities || []).filter(Boolean).slice(0, 3),
      }));

      const cards = [...supaCards];
      if (cards.length < 3) {
        cards.push(...FALLBACK_FLEET[category].slice(0, 3 - cards.length));
      }

      return {
        category,
        ...FLEET_LABELS[category],
        items: cards,
      };
    });
  }, [featuredFleet]);

  const reviewsToShow = useMemo<DisplayReview[]>(() => {
    const supaSource = (featuredReviews || []).filter((r) => (r.body || "").trim().length);
    if (supaSource.length) {
      return supaSource.slice(0, 6).map((row) => ({
        id: row.id,
        author: row.author_display || "Verified Rider",
        body: row.body?.trim() || "",
        rating: Math.max(1, Math.min(5, Math.round(Number(row.rating) || 5))),
        source: row.source,
        sourceUrl: row.source_url,
        published: row.published_at,
      }));
    }
    return FALLBACK_REVIEWS;
  }, [featuredReviews]);

  const hasFaqs = faqs.length > 0;
  const hasPollColumns = pollColumns.length > 0;

  const handleJump = (cat: ToolCategory | "All") => {
    setCatSelect(cat);
    if (cat !== "All") {
      const el = document.getElementById(`sec-${slug(cat)}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <Section className="relative max-w-6xl mx-auto rounded-[40px] border border-white/10 bg-gradient-to-br from-[#040916] via-[#0a1a3a] to-[#04050b] py-14 px-7 shadow-[0_45px_120px_rgba(1,6,15,0.8)] -mt-16 mb-10 overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.35),_transparent_65%)] opacity-70" aria-hidden />
        <div className="relative grid gap-10 lg:grid-cols-[1.2fr,0.8fr] items-center">
          <div>
            <p className="text-[11px] uppercase tracking-[0.55em] text-white/60">Tools lab</p>
            <h1 className="mt-3 text-3xl md:text-5xl font-serif font-extrabold text-white leading-tight">Launch-ready charter ops stack</h1>
            <p className="mt-4 text-white/75 text-base md:text-lg max-w-2xl">
              Every calculator, poll, and workflow widget pipes straight into Supabase so ops teams can monitor costs, share wins, and quote faster without leaving this page.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#sec-booking"
                className="inline-flex items-center rounded-full bg-white text-[#050a18] px-6 py-3 text-sm font-semibold shadow-lg border border-white/30"
              >
                Launch a tool
              </a>
              <a
                href="/about"
                className="inline-flex items-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white/80 hover:bg-white/10"
              >
                View build notes
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {TOOL_KEYWORDS.map((label) => (
                <span key={label} className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white/70 text-xs tracking-wide">
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {TOOL_METRICS.map((metric) => (
              <div key={metric.label} className="rounded-3xl border border-white/20 bg-white/5 px-5 py-6 text-center text-white/80">
                <p className="text-2xl font-semibold text-white">{metric.value}</p>
                <p className="text-xs uppercase tracking-[0.35em] text-white/60 mt-2">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------- SEARCH / FILTER BAR ---------- */}
      <Section className="relative max-w-6xl mx-auto rounded-[32px] border border-white/8 bg-[#050b18] py-8 px-6 shadow-2xl mb-12">
        <div className="grid gap-8 lg:grid-cols-[1.6fr,1fr] items-start">
          <div className="space-y-4">
            <label className="text-sm uppercase tracking-[0.4em] text-white/60">Search {registry.length} tools</label>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search tools…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-2xl px-5 py-4 text-base bg-[#0c1730] border border-white/10 text-white placeholder-white/40 shadow focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <select
                value={catSelect}
                onChange={(e) => handleJump(e.target.value as ToolCategory | "All")}
                className="w-full md:w-[240px] rounded-2xl px-5 py-4 text-base bg-[#0c1730] border border-white/10 text-white shadow focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="All">All Categories</option>
                {CATEGORY_ORDER.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_ORDER.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleJump(c)}
                  className="px-4 py-2 rounded-full border border-white/10 text-white/70 hover:text-white hover:border-sky-400 text-xs tracking-wide"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/15 to-transparent p-5 text-white/80">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Top focus</p>
            <ul className="mt-3 space-y-3 text-sm">
              {CATEGORY_ORDER.slice(0, 5).map((c) => (
                <li key={`focus-${c}`} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-sky-400" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-white/50">Need a missing app? <a className="underline" href="mailto:info@bus2ride.com">Ping the lab</a>.</p>
          </div>
        </div>
      </Section>

      {/* ---------- TOOL SECTIONS ---------- */}
      {CATEGORY_ORDER.map((cat) => {
        const items = grouped.get(cat) || [];
        if (items.length === 0) return null;
        return (
          <Section
            key={cat}
            id={`sec-${slug(cat)}`}
            className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-10 py-10 px-6 border border-blue-800/30 scroll-mt-28"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-white font-serif tracking-tight mb-1">{cat}</h2>
            <p className="text-blue-200 mb-6">Tools in this section help with {cat.toLowerCase()}.</p>
            <div className="w-full">
              <ToolsGrid items={items} />
            </div>
          </Section>
        );
      })}

      {/* ---------- FEATURED FLEET (SUPABASE) ---------- */}
      <Section className="relative max-w-6xl mx-auto bg-gradient-to-br from-[#0b1634] via-[#112656] to-[#050a18] rounded-[36px] shadow-2xl my-12 py-12 px-6 border border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_60%)] opacity-80" aria-hidden />
        <div className="relative text-center max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.6em] text-blue-200/70">Supabase gallery</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white font-serif tracking-tight mt-3">Featured Fleet Pull</h2>
          <p className="text-blue-100/85 mt-3">Direct pulls from our <code className="font-mono text-xs">vehicles1</code> bucket so you’re seeing the real inventory—not stock imagery.</p>
        </div>
        <div className="relative grid gap-6 md:grid-cols-3 mt-10">
          {fleetColumns.map((col) => (
            <div key={col.category} className="relative rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className={`absolute inset-0 rounded-[28px] bg-gradient-to-br ${col.accent} opacity-60`} aria-hidden />
              <div className="relative flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/70">{col.label}</p>
                    <p className="text-sm text-white/60">Pulled live from Supabase</p>
                  </div>
                  <a
                    href={col.link}
                    className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/20"
                  >
                    View
                  </a>
                </div>
                <div className="space-y-4">
                  {col.items.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-white/10 bg-[#0f1f3c]/70 overflow-hidden shadow-lg">
                      <div className="relative">
                        <SmartImage src={item.imageUrl} alt={item.title} className="h-44 w-full object-cover" />
                        {item.capacityLabel && (
                          <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                            {item.capacityLabel}
                          </span>
                        )}
                      </div>
                      <div className="p-4 space-y-1">
                        <p className="text-base font-semibold text-white">{item.title}</p>
                        {item.amenities?.length ? (
                          <p className="text-xs text-white/70">{item.amenities.slice(0, 3).join(" · ")}</p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="relative flex flex-wrap items-center justify-center gap-4 mt-10">
          <a
            href="/fleet"
            className="inline-flex rounded-full border border-white/15 bg-white px-8 py-3 text-sm font-semibold text-[#051026] shadow-lg hover:bg-blue-50"
          >
            Browse Full Fleet
          </a>
          <a
            href="/quote#instant"
            className="inline-flex rounded-full border border-white/15 bg-white/10 px-8 py-3 text-sm font-semibold text-white hover:bg-white/20"
          >
            Build my itinerary
          </a>
        </div>
      </Section>

      {/* ---------- REVIEWS ---------- */}
      <Section className="relative max-w-6xl mx-auto bg-gradient-to-br from-[#01040d] via-[#0f1f3d] to-[#01040d] rounded-[36px] shadow-2xl my-12 py-14 px-6 border border-white/8 overflow-hidden">
        <div className="absolute inset-x-12 -top-10 h-40 bg-[radial-gradient(circle,_rgba(59,130,246,0.45),_transparent_70%)] opacity-70" aria-hidden />
        <div className="relative text-center max-w-2xl mx-auto mb-8">
          <p className="text-[11px] uppercase tracking-[0.45em] text-white/60">Supabase sentiment</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white font-serif tracking-tight mt-3">Verified Rider Reviews</h2>
          <p className="text-white/70 mt-3">Pipeline loads from <code className="font-mono text-xs">reviews</code> table so we surface what customers actually say after charter day.</p>
        </div>
        <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviewsToShow.map((review) => (
            <article
              key={review.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-[0_20px_45px_rgba(5,11,29,0.45)] flex flex-col"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-white font-semibold w-12 h-12">
                  {review.author?.charAt(0) || "R"}
                </div>
                <div>
                  <p className="text-white font-semibold">{review.author}</p>
                  {review.source ? <p className="text-white/50 text-xs">{review.source}</p> : null}
                </div>
                <span className="ml-auto text-yellow-300 text-lg" aria-label={`${review.rating} star rating`}>
                  {"★".repeat(review.rating)}
                </span>
              </div>
              <p className="text-white/80 text-sm leading-relaxed flex-1">{review.body}</p>
              {review.published ? <p className="text-white/40 text-xs mt-4">Published {new Date(review.published).toLocaleDateString()}</p> : null}
            </article>
          ))}
        </div>
        <div className="relative flex justify-center mt-10">
          <a
            href="/reviews"
            className="inline-flex rounded-full border border-white/15 bg-white px-10 py-3 text-sm font-semibold text-[#051026] shadow-lg hover:bg-blue-50"
          >
            Browse all sentiment
          </a>
        </div>
      </Section>

      {/* ---------- POLLS (homepage styling) ---------- */}
      {hasPollColumns ? (
        <Section className="relative mx-auto my-16 max-w-6xl rounded-[36px] border border-white/8 bg-gradient-to-br from-[#030711] via-[#09132a] to-[#030711] py-14 px-7 shadow-[0_45px_100px_rgba(0,0,0,0.6)]">
          <div className="absolute top-0 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,_rgba(59,130,246,0.35),_transparent_70%)]" aria-hidden />
          <div className="relative text-center max-w-3xl mx-auto mb-8">
            <p className="text-[11px] uppercase tracking-[0.45em] text-white/60">Homepage polls</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-serif font-extrabold text-white">Three live rider columns</h2>
            <p className="mt-4 text-white/70">
              Same stack as the homepage feature—columns pull straight from <code className="font-mono text-xs">v_polls_home</code> so you get authentic scrolling sentiment with zero extra wiring.
            </p>
          </div>
          <div className="relative mt-8 grid gap-8 md:grid-cols-3">
            <PollColumnsByCategoryClient columns={pollColumns} />
          </div>
          <div className="relative mt-10 text-center">
            <a
              href="/polls"
              className="inline-flex items-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#050a18] shadow-lg border border-white/30"
            >
              Browse all polls
            </a>
          </div>
        </Section>
      ) : (
        <Section className="relative max-w-6xl mx-auto rounded-[36px] border border-white/8 bg-gradient-to-br from-[#030711] via-[#09132a] to-[#030711] my-16 py-14 px-7 shadow-[0_45px_100px_rgba(0,0,0,0.6)]">
          <div className="absolute top-0 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,_rgba(59,130,246,0.35),_transparent_70%)]" aria-hidden />
          <div className="relative grid gap-10 xl:grid-cols-[420px,1fr] items-center">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-white/60">
                <span className="h-2 w-2 rounded-full bg-sky-400" /> Pricing polls
              </div>
              <h2 className="mt-3 text-3xl font-serif font-extrabold text-white">Live rider sentiment</h2>
              <p className="mt-4 text-white/75 text-sm leading-relaxed">
                Same poll widget used on the homepage hero, but filtered to pricing tags so you can see what audiences value before you issue a quote.
              </p>
              <dl className="mt-6 grid grid-cols-2 gap-4 text-white">
                <div>
                  <dt className="text-xs uppercase tracking-[0.3em] text-white/60">Questions streaming</dt>
                  <dd className="text-2xl font-semibold">24</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.3em] text-white/60">Refresh cadence</dt>
                  <dd className="text-2xl font-semibold">Daily</dd>
                </div>
              </dl>
              <p className="mt-6 text-xs text-white/50">Source: Supabase view `polls_homepage_v`</p>
            </div>
            <div className="relative rounded-[28px] border border-white/10 bg-[#050c1a]/80 p-4 backdrop-blur-lg w-full">
              <div className="absolute inset-x-6 -top-3 h-8 bg-gradient-to-r from-sky-500/30 via-indigo-500/30 to-transparent blur-xl" aria-hidden />
              <HomePolls groups={[{ tag: "pricing", label: "Pricing" }]} pickSize={24} visiblePerGroup={3} />
            </div>
          </div>
        </Section>
      )}

      {hasFaqs ? (
        <Section className="relative max-w-6xl mx-auto rounded-[36px] border border-white/10 bg-gradient-to-br from-[#050912] via-[#0a1328] to-[#050912] my-12 py-14 px-6 shadow-2xl overflow-hidden">
          <div className="absolute -right-10 top-0 h-60 w-60 rounded-full bg-sky-500/10 blur-3xl" aria-hidden />
          <div className="absolute -left-10 bottom-0 h-60 w-60 rounded-full bg-fuchsia-500/10 blur-3xl" aria-hidden />
          <div className="relative text-center max-w-3xl mx-auto mb-8">
            <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">FAQ feed</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-serif font-extrabold text-white">Tools Knowledge Base</h2>
            <p className="mt-4 text-white/70">
              We pipe in the same FAQ entries used on the tools microsite so you can search safety policies, billing, integrations, or whatever blockers you have before testing a tool.
            </p>
          </div>
          <div className="relative">
            <FaqSearchClient
              faqs={faqs}
              searchInputId="tools-faq-search"
              searchLabel="Search tools FAQ"
              searchPlaceholder='Try "integrations", "pricing", "reviews"…'
            />
          </div>
        </Section>
      ) : null}

      {/* ---------- EVENTS ---------- */}
      <Section className="relative max-w-6xl mx-auto rounded-[36px] border border-white/8 bg-gradient-to-br from-[#040914] via-[#0b1c38] to-[#040914] my-16 py-14 px-7 shadow-2xl overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[radial-gradient(circle,_rgba(236,72,153,0.25),_transparent_70%)]" aria-hidden />
        <div className="relative text-center max-w-3xl mx-auto mb-10">
          <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">Event playbooks</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-serif font-extrabold text-white">Three itineraries on shuffle</h2>
          <p className="mt-4 text-white/70">
            Pull a trio of popular scenarios—straight out of the Events hub—so planners can see how we stitch transport, tools, and on-site ops together.
          </p>
        </div>
        <div className="relative grid gap-6 md:grid-cols-3">
          {eventSpotlights.map((event) => (
            <article key={event.title} className="rounded-[30px] border border-white/10 bg-[#060f20]/80 overflow-hidden shadow-xl flex flex-col">
              <div className="relative h-48 w-full overflow-hidden">
                <SmartImage src={event.image} alt={event.title} className="h-full w-full object-cover" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                    {event.tag}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 rounded-full bg-white/80 text-[#050a18] text-xs font-semibold px-3 py-1">
                  {event.stat}
                </div>
              </div>
              <div className="flex-1 p-6 flex flex-col">
                <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                <p className="mt-3 text-sm text-white/70 flex-1">{event.blurb}</p>
                <a href={event.link} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-white">
                  Dive into playbook →
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className="relative flex justify-center mt-10">
          <a
            href="/events"
            className="inline-flex items-center rounded-full bg-white text-[#050a18] px-8 py-3 text-sm font-semibold shadow-lg border border-white/30"
          >
            Browse more events
          </a>
        </div>
      </Section>
    </>
  );
}
