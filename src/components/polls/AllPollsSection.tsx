import React from "react";
import type { RawPoll } from "@/lib/home-polls";
import { getAllPolls } from "@/lib/server/all-polls";
import AllPollGroupsClient from "@/components/polls/AllPollGroupsClient";

const MAX_PER_GROUP = 60;

const GROUP_DEFS = [
  {
    key: "vehicles",
    title: "Vehicle Families & Upgrades",
    tagline: "Sprinters · limos · party buses",
    blurb: "Every fleet question lives here — from sprinter limo layouts and double-decker upgrades to which party bus trim riders actually book.",
    icon: "🚐",
    accentFrom: "#1a255d",
    accentTo: "#080c1d",
    highlights: ["Party buses", "Sprinter limos", "Mini coaches"],
    keywords: ["bus", "vehicle", "sprinter", "limo", "coach", "fleet", "shuttle", "van", "upgrade"],
  },
  {
    key: "budget",
    title: "Budget · Pricing · Deposits",
    tagline: "Cost splits · tips · surcharges",
    blurb: "Price transparency polls covering hourly minimums, overtime fears, gratuity, and every way groups split the tab.",
    icon: "💸",
    accentFrom: "#1f3a4f",
    accentTo: "#050c1f",
    highlights: ["Hourly minimums", "Fuel surcharges", "Tip math"],
    keywords: ["price", "cost", "budget", "deposit", "fee", "surcharge", "tip", "rate", "quote", "split"],
  },
  {
    key: "events",
    title: "Occasions & City Playbooks",
    tagline: "Weddings · proms · game days",
    blurb: "Scenario-based prompts for every event — bachelor loops, wine tours, arena transfers, quinceañeras, and prom night logistics.",
    icon: "🎉",
    accentFrom: "#3a1f4f",
    accentTo: "#08091c",
    highlights: ["Bachelor/ette", "Prom", "Concert runs"],
    keywords: [
      "wedding",
      "prom",
      "concert",
      "bachelor",
      "bachelorette",
      "birthday",
      "graduation",
      "homecoming",
      "game",
      "tailgate",
      "event",
    ],
  },
  {
    key: "planning",
    title: "Logistics · Safety · Policies",
    tagline: "Pickup windows · rules · timing",
    blurb: "Operational questions around pickup buffers, cancellation policies, driver expectations, and everything operations teams juggle.",
    icon: "🧭",
    accentFrom: "#173f56",
    accentTo: "#050f1f",
    highlights: ["Arrival windows", "Safety rules", "Driver comms"],
    keywords: [
      "schedule",
      "pickup",
      "dropoff",
      "route",
      "policy",
      "safety",
      "rule",
      "insurance",
      "cancel",
      "delay",
      "logistic",
    ],
  },
  {
    key: "experience",
    title: "Onboard Experience & Amenities",
    tagline: "Lighting · bars · playlists",
    blurb: "Fun stuff — LED floors, bar setups, music control, photo ops, smoke machines, and every vibe-setting upgrade guests ask about.",
    icon: "✨",
    accentFrom: "#402145",
    accentTo: "#0a0612",
    highlights: ["LED floors", "Bar setups", "Playlists"],
    keywords: ["music", "bar", "led", "floor", "photo", "vibe", "dance", "sound", "lights", "drink"],
  },
] as const;

export type MegaPollGroup = {
  key: string;
  title: string;
  tagline: string;
  blurb: string;
  icon: string;
  accentFrom: string;
  accentTo: string;
  highlights: string[];
  keywords: readonly string[];
  polls: RawPoll[];
};

function slugMatches(poll: RawPoll, keywords: readonly string[]) {
  if (!keywords.length) return false;
  const haystack = `${poll.slug ?? ""} ${poll.question}`.toLowerCase();
  return keywords.some((keyword) => haystack.includes(keyword));
}

function shuffle<T>(arr: T[]): T[] {
  const clone = arr.slice();
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function buildGroups(polls: RawPoll[]): MegaPollGroup[] {
  const randomized = shuffle(polls);
  const baseGroups: MegaPollGroup[] = GROUP_DEFS.map((def) => ({ ...def, polls: [] }));
  const overflow: RawPoll[] = [];

  for (const poll of randomized) {
    const bucket = baseGroups.find((group) => slugMatches(poll, group.keywords));
    if (bucket) {
      if (bucket.polls.length < MAX_PER_GROUP) bucket.polls.push(poll);
    } else {
      overflow.push(poll);
    }
  }

  if (overflow.length) {
    baseGroups.push({
      key: "everything",
      title: "Experimental & Local Curiosities",
      tagline: "Catch-all · beta prompts",
      blurb: "The rest of the Supabase firehose: city-only polls, experimental prompts, and wildcard ideas waiting for their own lane.",
      icon: "🌎",
      accentFrom: "#1f253a",
      accentTo: "#05060b",
      highlights: ["City heat checks", "Vendor feedback", "Wildcard prompts"],
      keywords: [],
      polls: overflow.slice(0, MAX_PER_GROUP),
    });
  }

  return baseGroups.filter((group) => group.polls.length > 0);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
}

export default async function AllPollsSection() {
  const polls = await getAllPolls();

  if (!polls.length) {
    return null;
  }

  const groups = buildGroups(polls);
  const totalCount = polls.length;
  const vehicleCount = groups.find((group) => group.key === "vehicles")?.polls.length ?? 0;
  const highlightPolls = shuffle(polls).slice(0, 6);
  const lastSync = formatDate(new Date());

  const stats = [
    { label: "Total polls indexed", value: totalCount.toLocaleString(), helper: "Supabase + on-disk backups" },
    { label: "Vehicle-family prompts", value: vehicleCount.toLocaleString(), helper: "Sprinters, limos, coaches, buses" },
    { label: "Major categories surfaced", value: groups.length.toString(), helper: "Auto-tagged at load" },
    { label: "Last sync", value: lastSync, helper: "Pulled live before render" },
  ];

  return (
    <section className="bg-[#030817] py-14 text-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="rounded-[40px] border border-white/10 bg-gradient-to-b from-[#08112a] via-[#050c1b] to-[#04060f] px-6 py-10 shadow-[0_60px_160px_rgba(0,0,0,0.6)] md:px-12">
          <header className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-white/50">The Poll Observatory</p>
            <h2 className="mt-4 text-4xl font-semibold md:text-5xl">50,000+ rider decisions, organized like a real data tool</h2>
            <p className="mx-auto mt-4 max-w-4xl text-base text-white/70 md:text-lg">
              Clear categories, faster loading, and zero "see more" loops. Every poll from Supabase is split into hero lanes (vehicles, budget, events, planning, vibes)
              so you can scan about 50 polls per lane without feeling buried.
            </p>
          </header>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left">
                <p className="text-xs uppercase tracking-[0.35em] text-white/50">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
                <p className="mt-1 text-sm text-white/60">{stat.helper}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <a
              href="/polls/results"
              className="rounded-3xl border border-emerald-300/60 bg-emerald-500/10 px-6 py-5 text-center text-sm font-semibold text-emerald-50 shadow-[0_20px_60px_rgba(16,185,129,0.35)] hover:shadow-emerald-500/40"
            >
              See the live results hub ↗
            </a>
            <a
              href="/polls.json"
              className="rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-center text-sm font-semibold text-white/80 hover:border-white/40"
            >
              Download the full polls.json dataset
            </a>
            <a
              href="mailto:data@partybus.com?subject=Poll%20API%20access"
              className="rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-center text-sm font-semibold text-white/80 hover:border-white/40"
            >
              Request nightly Supabase/API access
            </a>
          </div>

          <div className="mt-10 rounded-[32px] border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">Live pulse board</p>
                <h3 className="mt-2 text-2xl font-semibold">Fresh polls bubbling up right now</h3>
              </div>
              <a
                href="/polls/results"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-xs font-semibold text-white hover:border-white/50"
              >
                Go to results board
                <span aria-hidden>→</span>
              </a>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {highlightPolls.map((poll) => (
                <article key={poll.id} className="rounded-2xl border border-white/10 bg-[#040a16] p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                  <p className="text-sm font-semibold leading-snug text-white/90">{poll.question}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/60">
                    <span className="rounded-full border border-white/20 px-3 py-1">{poll.slug ?? poll.id}</span>
                    <a
                      href={`/polls/results?focus=${encodeURIComponent(poll.slug ?? poll.id)}`}
                      className="rounded-full border border-emerald-300/70 bg-emerald-500/20 px-3 py-1 text-emerald-50"
                    >
                      See results ↗
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <AllPollGroupsClient groups={groups} totalCount={totalCount} resultsHref="/polls/results" />
        </div>
      </div>
    </section>
  );
}
