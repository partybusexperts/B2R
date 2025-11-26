import React from "react";
import { eventDetails as fallbackEventDetails } from "@/app/events/eventDetails";
import { getCategoryImages } from "@/utils/optimizedImages";
import { createClient } from "@/lib/supabase/server";
import SmartImage from "@/components/SmartImage";

const PHONE_DISPLAY = "(888) 535-2566";
const PHONE_TEL = "8885352566";
const EMAIL = "info@bus2ride.com";

const optimizedEventImages = getCategoryImages("eventImages");
const legacyFallbacks = [
  "/images/party-buses/18 Passenger White Party Bus Exterior.png",
  "/images/party-buses/30 Passenger Party Bus Exterior.png",
  "/images/party-buses/36 Passenger Party Bus Inside.png",
];

const hasSupabaseCreds = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

type EventCard = {
  id?: string;
  name: string;
  description: string;
  href?: string;
};

type FleetCategory = "party-buses" | "limousines" | "coach-buses";

const CATEGORY_CONFIG: Record<FleetCategory, {
  eyebrow: string;
  heading: string;
  description: string;
  keywords: string[];
  footerCtaLabel: string;
  footerHref: string;
}> = {
  "party-buses": {
    eyebrow: "Party Bus Event Playbook",
    heading: "6 rotating nights we book every week",
    description: "These cards rotate on every refresh so you always see fresh inspiration from the party bus calendar.",
    keywords: ["party", "bus", "club", "night", "bachelor", "bachelorette"],
    footerCtaLabel: "Browse All Events",
    footerHref: "/events",
  },
  limousines: {
    eyebrow: "Limousine Event Playbook",
    heading: "Luxury rides we roll every week",
    description: "Fresh limo itineraries spanning weddings, proms, red carpets, and VIP transfers—updated straight from Supabase.",
    keywords: ["limo", "limousine", "wedding", "prom", "chauffeur", "black"],
    footerCtaLabel: "Browse All Events",
    footerHref: "/events",
  },
  "coach-buses": {
    eyebrow: "Coach & Charter Event Planner",
    heading: "6 charter runs in constant rotation",
    description: "Pull ideas from corporate shuttles, tournament travel, campus moves, and tour loops that book every week.",
    keywords: ["coach", "charter", "motorcoach", "shuttle", "tournament", "corporate"],
    footerCtaLabel: "Browse All Events",
    footerHref: "/events",
  },
};

const CTA = {
  base:
    "inline-flex items-center justify-center rounded-full font-bold text-sm tracking-tight shadow-md transition border min-w-[160px] h-10 px-5 active:translate-y-[1px]",
  primary:
    "bg-blue-600 text-white border-blue-700 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
  secondary: "bg-white text-blue-900 border-blue-200 hover:bg-blue-50",
  accent: "bg-blue-700 text-white border-blue-700 hover:bg-blue-800",
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function pickImageForEvent(name: string, idx: number) {
  if (optimizedEventImages && optimizedEventImages.length > 0) {
    const norm = slugify(name);
    const exact = optimizedEventImages.find(
      (entry) =>
        entry.original.toLowerCase().includes(`/${norm}`) ||
        entry.original.toLowerCase().endsWith(`/${norm}.webp`) ||
        entry.original.toLowerCase().includes(norm)
    );
    if (exact) return exact.original;
    const tokens = norm.split("-").filter(Boolean);
    for (const token of tokens) {
      const found = optimizedEventImages.find((entry) => entry.original.toLowerCase().includes(token));
      if (found) return found.original;
    }
    return optimizedEventImages[idx % optimizedEventImages.length].original;
  }
  return legacyFallbacks[idx % legacyFallbacks.length];
}

function shuffle<T>(values: T[]) {
  const clone = [...values];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

async function getFleetEvents(category: FleetCategory, limit = 6): Promise<EventCard[]> {
  if (!hasSupabaseCreds) {
    return fallbackList(limit);
  }

  try {
    const supabase = createClient();
    const keywords = CATEGORY_CONFIG[category].keywords;
    const filters = keywords
      .flatMap((kw) => [
        `name.ilike.%${kw}%`,
        `slug.ilike.%${kw}%`,
        `description.ilike.%${kw}%`,
      ])
      .join(",");

    const { data, error } = await supabase
      .from("events")
      .select("id,name,description,href,slug")
      .or(filters)
      .limit(limit * 6);

    if (!error && data && data.length) {
      const cards: EventCard[] = data.map((row) => ({
        id: row.id ?? undefined,
        name: row.name ?? "",
        description: row.description ?? "",
        href: row.href ?? (row.slug ? `/events/${row.slug}` : undefined),
      }));
      const filtered = cards.filter((card) => card.name && card.description);
      if (filtered.length) {
        const primary = shuffle(filtered);
        return ensureCount(primary, limit);
      }
    }
  } catch (error) {
    console.debug("[party-bus-events] falling back to local list", error instanceof Error ? error.message : error);
  }

  return fallbackList(limit);
}

function fallbackList(limit: number): EventCard[] {
  const source = fallbackEventDetails as Array<{ name: string; description: string; href?: string }>;
  return shuffle(source)
    .slice(0, limit)
    .map((event) => ({
      name: event.name,
      description: event.description,
      href: event.href || `/events/${slugify(event.name)}`,
    }));
}

function ensureCount(primary: EventCard[], limit: number) {
  const combined = dedupe([...primary, ...fallbackList(limit * 2)]);
  if (combined.length >= limit) {
    return combined.slice(0, limit);
  }
  return combined;
}

function dedupe(values: EventCard[]) {
  const seen = new Set<string>();
  const list: EventCard[] = [];
  values.forEach((item) => {
    const key = item.name.trim().toLowerCase() || item.href || Math.random().toString();
    if (seen.has(key)) return;
    seen.add(key);
    list.push(item);
  });
  return list;
}

interface Props {
  category?: FleetCategory;
}

export default async function PartyBusEventsSection({ category = "party-buses" }: Props = {}) {
  const events = await getFleetEvents(category, 6);
  if (!events.length) return null;

  const config = CATEGORY_CONFIG[category];

  return (
    <section className="w-full bg-[#122a56] py-12 px-3 md:px-6">
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm uppercase tracking-[0.2em] text-blue-200">{config.eyebrow}</p>
          <h2 className="mt-2 text-4xl font-extrabold text-white font-serif tracking-tight">{config.heading}</h2>
          <p className="mt-3 text-blue-100/90">{config.description}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event, idx) => {
            const href = event.href || `/events/${slugify(event.name)}`;
            return (
              <a
                key={`${event.name}-${idx}`}
                href={href}
                aria-label={`Learn more about ${event.name}`}
                className="relative bg-[#0f1f46] rounded-3xl border border-blue-800/40 p-6 no-underline min-h-[480px] flex flex-col items-center shadow-[0_10px_28px_-4px_rgba(0,0,0,.45)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-6px_rgba(0,0,0,.55)] group before:absolute before:inset-0 before:rounded-3xl before:p-[1.5px] before:bg-gradient-to-r before:from-blue-500/20 before:via-cyan-400/20 before:to-indigo-400/20 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-200"
              >
                <SmartImage
                  src={pickImageForEvent(event.name, idx)}
                  alt={event.name}
                  className="rounded-2xl shadow-lg w-full h-64 object-cover object-center mb-4 border border-blue-800/40"
                />
                <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2 font-serif text-center group-hover:text-blue-100 transition-colors">
                  {event.name}
                </h3>
                <p className="text-base md:text-lg text-blue-100/90 text-center mb-6">
                  {event.description}
                </p>

                <div className="flex flex-row flex-wrap gap-2 justify-center items-center w-full mt-auto">
                  <a href="/quote#instant" className={`${CTA.base} ${CTA.primary}`}>
                    Quote
                  </a>
                  <a href={`tel:${PHONE_TEL}`} className={`${CTA.base} ${CTA.secondary}`}>
                    📞 {PHONE_DISPLAY}
                  </a>
                  <a href={`mailto:${EMAIL}`} className={`${CTA.base} ${CTA.primary}`}>
                    Email
                  </a>
                  <a
                    href={`/polls?tag=${encodeURIComponent(slugify(event.name))}`}
                    className={`${CTA.base} ${CTA.accent}`}
                  >
                    Related Polls
                  </a>
                </div>
              </a>
            );
          })}
        </div>

        <div className="flex justify-center mt-10">
          <a
            data-content-key="party_buses.more_events_cta"
            href={config.footerHref}
            className="inline-block bg-white text-blue-900 font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-200 hover:bg-blue-50"
          >
            {config.footerCtaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
