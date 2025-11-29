// src/app/polls/page.tsx

'use client';

import { FormEvent, useRef, useState } from 'react';

import CategoriesExplorer from '@/components/polls/CategoriesExplorer';
import { Sparkles, Radar, Orbit, Globe2, Search, LineChart, PlugZap } from 'lucide-react';

const pollStats = {
  tiles: 648,
  sections: 142,
  families: 12,
};

export default function PollsPage() {
  const [heroSearch, setHeroSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const explorerRef = useRef<HTMLDivElement | null>(null);

  const handleHeroSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = heroSearch.trim();
    setAppliedSearch(trimmed);
    explorerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 text-white">
      {/* ambient lighting */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-sky-400/30 blur-[180px]" />
        <div className="absolute top-32 -left-16 h-80 w-80 rounded-full bg-indigo-400/25 blur-[150px]" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] translate-x-24 rounded-full bg-emerald-300/25 blur-[200px]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1400px] px-6 pb-28 pt-20 sm:px-10">
        <header className="space-y-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Poll Intelligence Hub
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-sm font-medium uppercase tracking-[0.4em] text-slate-100/70">
                  Discover the pulse
                </p>
                <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                  Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-300 to-emerald-200">Poll Universe</span>
                </h1>
                <p className="max-w-2xl text-lg text-white/85">
                  Every poll tile represents real riders voting on what matters most: vehicles, routes, amenities, pricing, accessibility, and on-board experiences. Use this control panel to translate raw sentiment into bookable itineraries, sharper sales decks, and confident operations.
                </p>
              </div>

              <form
                onSubmit={handleHeroSearch}
                className="rounded-3xl border border-white/15 bg-black/40 p-4 shadow-2xl shadow-slate-950/40"
              >
                <label className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                  Search everything
                </label>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/20 bg-black/60 px-4 py-3">
                    <Search className="h-5 w-5 text-slate-200" />
                    <input
                      value={heroSearch}
                      onChange={(event) => setHeroSearch(event.target.value)}
                      placeholder="Try “party bus chicago-il” or “vip protocol”"
                      className="w-full bg-transparent text-base text-white placeholder:text-white/60 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-2xl bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-300 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-900 shadow-lg shadow-sky-500/40"
                  >
                    Launch search
                  </button>
                </div>
                <p className="mt-3 text-xs text-white/70">
                  Indexing {pollStats.tiles.toLocaleString()}+ live polls across {pollStats.sections.toLocaleString()} sections and {pollStats.families} category families.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.35em] text-white/60">
                  {searchHighlights.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/20 px-3 py-1 text-white/80">
                      {tag}
                    </span>
                  ))}
                </div>
              </form>

              <div className="flex flex-wrap gap-3">
                {getHeroBadges(pollStats).map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <div
                      key={badge.label}
                      className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-base text-white"
                    >
                      <Icon className="h-5 w-5 text-sky-200" />
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.3em] text-white/70">{badge.label}</p>
                        <p className="text-lg font-semibold">{badge.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {heroCards.map((card) => {
                const Icon = card.icon;
                return (
                  <article
                    key={card.title}
                    className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/15 via-white/5 to-transparent p-6 text-white backdrop-blur"
                  >
                    <Icon className="h-6 w-6 text-sky-200" />
                    <h3 className="mt-4 text-xl font-semibold">{card.title}</h3>
                    <p className="mt-2 text-sm text-white/80">{card.text}</p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="grid gap-8 pt-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center gap-3 text-sky-200">
                <LineChart className="h-5 w-5" />
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
                  Why polls matter
                </p>
              </div>
              <h3 className="mt-4 text-2xl font-semibold">Decision fuel for every department</h3>
              <ul className="mt-4 space-y-3 text-sm text-white/80">
                {impactPoints.map((point) => (
                  <li key={point.title} className="rounded-2xl border border-white/10 bg-black/30 p-3">
                    <p className="text-base font-semibold text-white">{point.title}</p>
                    <p className="text-white/75">{point.text}</p>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center gap-3 text-emerald-200">
                <PlugZap className="h-5 w-5" />
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
                  Embed anywhere
                </p>
              </div>
              <h3 className="mt-4 text-2xl font-semibold">Add live polls to decks, CMS, or client portals</h3>
              <ol className="mt-4 space-y-3 text-sm text-white/80">
                {embedSteps.map((step) => (
                  <li key={step.title} className="flex gap-4 rounded-2xl border border-white/10 bg-black/30 p-3">
                    <span className="text-xs font-bold uppercase tracking-[0.35em] text-white/60">{step.step}</span>
                    <div>
                      <p className="text-base font-semibold text-white">{step.title}</p>
                      <p className="text-white/75">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-xs text-white/70">
                Need help wiring up your CMS or CRM? Drop us a line and we will ship a turnkey embed snippet.
              </p>
            </article>
          </div>
        </header>

        <section
          id="poll-explorer"
          ref={explorerRef}
          className="mt-20 rounded-3xl border border-white/10 bg-black/40 p-1"
        >
          <div className="rounded-[26px] border border-white/10 bg-gradient-to-br from-slate-950/60 via-slate-900/60 to-slate-950/70 p-8">
            <CategoriesExplorer searchQuery={appliedSearch} />
          </div>
        </section>
      </div>
    </main>
  );
}

const heroCards = [
  {
    title: 'Instant Discovery',
    text: 'Surface any category in seconds with universal search plus curated groupings.',
    icon: Sparkles,
  },
  {
    title: 'Geo Intelligence',
    text: 'Dive into region-aware stacks with depth indicators for every state and metro.',
    icon: Globe2,
  },
  {
    title: 'Experience Filters',
    text: 'Segment by event, amenity, accessibility, or booking scenarios without leaving the page.',
    icon: Orbit,
  },
  {
    title: 'Always Fresh',
    text: 'Tiles link straight to live poll feeds so insights never go stale.',
    icon: Radar,
  },
];

const impactPoints = [
  {
    title: 'Smarter pricing & packaging',
    text: 'Use voter demand to prioritize bundles, add-ons, and per-market pricing experiments.',
  },
  {
    title: 'Frictionless ops handoffs',
    text: 'Dispatch and CX teams see the same data sales referenced, eliminating “he said, she said”.',
  },
  {
    title: 'Proof for partners & sponsors',
    text: 'Drop poll tiles into pitch decks to show sponsors and city partners the crowd is already onboard.',
  },
];

const embedSteps = [
  {
    step: '01',
    title: 'Pick a tile',
    text: 'Open any poll tile and copy the “Embed” link or slug.',
  },
  {
    step: '02',
    title: 'Drop into your stack',
    text: 'Paste into Notion, Webflow, HubSpot, or your CMS using our lightweight iframe.',
  },
  {
    step: '03',
    title: 'Sync automatically',
    text: 'Live votes update every few minutes—no manual screenshots ever again.',
  },
];

const searchHighlights = [
  'Vehicles',
  'Events',
  'Amenities',
  'Policies',
  'Cities + States',
  'Accessibility',
];

function getHeroBadges(stats: { tiles: number; sections: number; families: number }) {
  return [
    { label: 'Live Tiles', value: stats.tiles.toLocaleString(), icon: Globe2 },
    { label: 'Sections', value: stats.sections.toLocaleString(), icon: Radar },
    { label: 'Families', value: stats.families.toString(), icon: Orbit },
  ];
}



