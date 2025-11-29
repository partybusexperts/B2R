// src/app/vehicles/10-passenger-white-chrysler-300-limo/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

// TODO: replace these with real Supabase queries
// (Copilot can infer from these types)
type Review = {
  id: string;
  name: string;
  rating: number;
  date: string;
  text: string;
};

type EventUse = {
  id: string;
  name: string;
  tagline: string;
  highlight: string;
};

type PollTile = {
  id: string;
  label: string;
  href: string;
  blurb?: string;
};

type PollColumn = {
  id: string;
  title: string;
  description: string;
  items: PollTile[];
};

type ToolTile = {
  id: string;
  label: string;
  href: string;
  icon?: string;
  blurb?: string;
};

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

// ---- MOCK DATA (swap out with Supabase results) ------------------------------

const VEHICLE_NAME = '10 Passenger White Chrysler 300 Limo';

const EXTERIOR_IMG =
  'https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/10%20Passenger%20White%20Chrysler%20300%20Limo/10%20Passenger%20White%20Chrysler%20300%20Limo%20Exterior%20Lux.png';

const INTERIOR_IMG =
  'https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/10%20Passenger%20White%20Chrysler%20300%20Limo/10%20Passenger%20White%20Chrysler%20300%20Limo%20Interior%20Lux.png';

const EVENT_IMAGE_MAP: Record<string, string> = {
  weddings:
    'https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/Events1/weddings.jpg',
  bachelor: 'https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/Events1/bachelor%20parties.jpg',
  airport:
    'https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/Events1/airport%20shuttle.jpg',
  birthdays:
    'https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/Events1/birthday%20parties.jpg',
  prom: 'https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/Events1/prom.jpg',
  corporate:
    'https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/Events1/corporate%20parties.jpg',
};
const EVENT_IMAGE_FALLBACK =
  'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=900&q=80';

function getEventImage(name: string) {
  const normalized = name.toLowerCase();
  if (normalized.includes('wedding')) return EVENT_IMAGE_MAP.weddings;
  if (normalized.includes('bachelor')) return EVENT_IMAGE_MAP.bachelor;
  if (normalized.includes('airport')) return EVENT_IMAGE_MAP.airport;
  if (normalized.includes('birthday')) return EVENT_IMAGE_MAP.birthdays;
  if (normalized.includes('prom')) return EVENT_IMAGE_MAP.prom;
  if (normalized.includes('corporate')) return EVENT_IMAGE_MAP.corporate;
  return EVENT_IMAGE_FALLBACK;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Ashley P.',
    rating: 5,
    date: 'Oct 2025',
    text: 'Perfect for our small wedding party. The white Chrysler looked amazing in photos and the interior lights were insane.',
  },
  {
    id: '2',
    name: 'Marcus L.',
    rating: 5,
    date: 'Sep 2025',
    text: 'Driver showed up early, car was spotless, and the sound system was way better than we expected for a 10 passenger.',
  },
  {
    id: '3',
    name: 'Jenna & Friends',
    rating: 4,
    date: 'Aug 2025',
    text: 'Used it for a birthday bar hop. Cozy vibe, easy to load, and not overkill like a 30 passenger bus.',
  },
  {
    id: '4',
    name: 'Khalil D.',
    rating: 5,
    date: 'Jul 2025',
    text: 'Booked this for a corporate steak dinner. Clients were obsessed with the fiber optic ceiling and quiet ride.',
  },
  {
    id: '5',
    name: 'Sofia & Nico',
    rating: 5,
    date: 'Jun 2025',
    text: 'Took it from ceremony to reception with an extra cruise downtown. Driver had cold water ready and kept the playlist bumping.',
  },
  {
    id: '6',
    name: 'The Holbrook Crew',
    rating: 4,
    date: 'May 2025',
    text: 'Airport transfer + brunch hop in one booking. Plenty of luggage space and the chauffeur handled hotel valet like a pro.',
  },
];

const MOCK_EVENTS: EventUse[] = [
  {
    id: '1',
    name: 'Weddings',
    tagline: 'Iconic getaway photos',
    highlight: 'Classic white look that matches almost any wedding color palette.',
  },
  {
    id: '2',
    name: 'Date Nights',
    tagline: 'Overkill in the best way',
    highlight: 'Turn a simple dinner into a full “main character energy” arrival.',
  },
  {
    id: '3',
    name: 'Airport Runs',
    tagline: 'VIP transfers',
    highlight: 'Show up at the terminal like a celebrity instead of a rideshare.',
  },
  {
    id: '4',
    name: 'Birthday Parties',
    tagline: 'Perfect for 6–10 guests',
    highlight: 'Easy to bar-hop or club-hop without needing a huge party bus.',
  },
  {
    id: '5',
    name: 'Prom & Homecoming',
    tagline: 'Photos for days',
    highlight: 'Sleek body style and crazy interior lighting = guaranteed photo ops.',
  },
  {
    id: '6',
    name: 'Corporate Dinners',
    tagline: 'Client-wow factor',
    highlight: 'Quiet, classy, and just flashy enough to make the night feel special.',
  },
];

const MOCK_POLL_COLUMNS: PollColumn[] = [
  {
    id: 'comfort',
    title: 'Comfort & Amenities',
    description: 'Lighting, seating, sound, and the vibe riders expect inside this limo.',
    items: [
      {
        id: 'p1',
        label: 'What matters most in a limo: lights, sound, or legroom?',
        href: '/polls?category=amenities-priorities',
        blurb: 'Interior priorities ranked by real riders.',
      },
      {
        id: 'p2',
        label: 'Should every Chrysler limo include a built-in bar?',
        href: '/polls?category=amenities-bar-setups',
        blurb: 'Vote on whether ice wells + glassware are a must-have.',
      },
    ],
  },
  {
    id: 'planning',
    title: 'Capacity & Planning',
    description: 'Group size debates plus timing tips for 6–10 person crews.',
    items: [
      {
        id: 'p3',
        label: 'Is a 10 passenger limo big enough for your group?',
        href: '/polls?category=capacity-planning',
        blurb: 'Guests weigh in on the real comfort number.',
      },
      {
        id: 'p4',
        label: 'How early do you book limos for weddings?',
        href: '/polls?category=booking-lead-times',
        blurb: 'Lead time expectations for peak season.',
      },
    ],
  },
  {
    id: 'event-style',
    title: 'Event Style Face-off',
    description: 'Compare limos to party buses for birthday, prom, and nightlife runs.',
    items: [
      {
        id: 'p5',
        label: 'Would you choose a limo or party bus for a birthday?',
        href: '/polls?category=limo-vs-party-bus',
        blurb: 'See what other hosts pick when the guest list stays small.',
      },
      {
        id: 'p6',
        label: 'What’s the ideal prom playlist energy?',
        href: '/polls?category=music-preferences',
        blurb: 'Crowd-source the soundtrack before you board.',
      },
    ],
  },
];

const MOCK_TOOLS: ToolTile[] = [
  {
    id: 't1',
    label: 'Capacity & Comfort Checker',
    href: '/tools/capacity-checker',
    icon: '🧮',
    blurb: 'Slide passenger counts up or down and see comfort notes instantly.',
  },
  {
    id: 't2',
    label: 'Limo Budget Estimator',
    href: '/tools/budget-estimator',
    icon: '💸',
    blurb: 'Rough math on hourly minimums, fuel, and gratuity before you call sales.',
  },
  {
    id: 't3',
    label: 'Multi-Stop Route Planner',
    href: '/tools/route-planner',
    icon: '🗺️',
    blurb: 'Plot hotel → ceremony → reception without juggling five tabs.',
  },
  {
    id: 't4',
    label: 'Playlist Pack Builder',
    href: '/tools/playlist-pack',
    icon: '🎧',
    blurb: 'Drag in songs and auto-generate a 45-minute hype mix.',
  },
  {
    id: 't5',
    label: 'VIP Arrival Script',
    href: '/tools/vip-arrival',
    icon: '📝',
    blurb: 'Print-ready cue sheets for hotel doors, valets, and photographers.',
  },
  {
    id: 't6',
    label: 'Bar Stock Calculator',
    href: '/tools/bar-stock',
    icon: '🍾',
    blurb: 'Figure out how many bottles to bring for a two-hour limo spin.',
  },
];

const MOCK_FAQS: FAQItem[] = [
  {
    id: 'f1',
    question: 'How many people can we *comfortably* fit in this limo?',
    answer:
      'It’s rated for 10 passengers, but 8–9 is the sweet spot if you want extra elbow room, dresses, and camera bags.',
  },
  {
    id: 'f2',
    question: 'Can we bring our own drinks?',
    answer:
      'Most operators allow BYOB for guests 21+ as long as it stays inside the vehicle. Exact rules depend on local laws and the company you book with.',
  },
  {
    id: 'f3',
    question: 'Is this limo better for short hops or longer rides?',
    answer:
      'It actually works well for both: short hops between bars or a 45–60 minute cruise with music and photos before your main event.',
  },
];

// ---- PAGE COMPONENT ----------------------------------------------------------

export default function VehicleChrysler10Page() {
  const [activeImage, setActiveImage] = useState<'exterior' | 'interior' | null>(null);
  const [activeTool, setActiveTool] = useState<ToolTile | null>(null);
  const [activeEvent, setActiveEvent] = useState<EventUse | null>(null);
  const [activePoll, setActivePoll] = useState<PollTile | null>(null);
  const [showSpecModal, setShowSpecModal] = useState(false);
  const [faqQuery, setFaqQuery] = useState('');
  const [visibleFaqCount, setVisibleFaqCount] = useState(4);
  const toolCopy = useMemo(() => (activeTool ? getToolModalCopy(activeTool) : null), [activeTool]);
  const pollCopy = useMemo(() => (activePoll ? getPollModalCopy(activePoll) : null), [activePoll]);

  const filteredFaqs = useMemo(() => {
    const q = faqQuery.trim().toLowerCase();
    if (!q) return MOCK_FAQS;
    return MOCK_FAQS.filter((faq) =>
      faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q)
    );
  }, [faqQuery]);

  const visibleFaqs = faqQuery.trim()
    ? filteredFaqs
    : filteredFaqs.slice(0, Math.min(visibleFaqCount, filteredFaqs.length));
  const encorePhotos: Array<{ key: 'exterior' | 'interior'; label: string; image: string }> = [
    { key: 'exterior', label: 'Exterior encore', image: EXTERIOR_IMG },
    { key: 'interior', label: 'Interior encore', image: INTERIOR_IMG },
  ];

  const reviewStats = useMemo(() => {
    const avg =
      MOCK_REVIEWS.reduce((sum, review) => sum + review.rating, 0) / MOCK_REVIEWS.length;
    return {
      avg: Math.round(avg * 10) / 10,
      count: 128,
    };
  }, []);

  useEffect(() => {
    if (!activeImage && !activeTool && !activeEvent && !activePoll && !showSpecModal) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveImage(null);
        setActiveTool(null);
        setActiveEvent(null);
        setActivePoll(null);
        setShowSpecModal(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeImage, activeTool, activeEvent, activePoll, showSpecModal]);

  const closeLightbox = () => setActiveImage(null);
  const closeToolModal = () => setActiveTool(null);
  const closeEventModal = () => setActiveEvent(null);
  const closePollModal = () => setActivePoll(null);
  const closeSpecModal = () => setShowSpecModal(false);
  const currentLightboxImage =
    activeImage === 'exterior' ? EXTERIOR_IMG : activeImage === 'interior' ? INTERIOR_IMG : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-20 pt-10 lg:px-6">
        {/* Title / quick meta row */}
        <header className="flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">
              Featured Limo
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {VEHICLE_NAME}
            </h1>
            <p className="mt-3 max-w-xl text-sm text-slate-300">
              Sleek, low-slung, and ridiculously photogenic. The Chrysler 300 limo is the
              move when you want that classic limousine silhouette without jumping to a
              giant party bus.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs">
              <button
                type="button"
                onClick={() => setShowSpecModal(true)}
                className="rounded-full border border-white/20 px-4 py-2 font-semibold uppercase tracking-[0.3em] text-white/80 hover:border-white"
              >
                Spec sheet
              </button>
              <button
                type="button"
                onClick={() => setActiveImage('exterior')}
                className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 font-semibold uppercase tracking-[0.3em] text-emerald-200 hover:border-emerald-400"
              >
                View gallery
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs">
            <div className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-3 py-2">
              <div className="font-semibold text-emerald-300">Capacity</div>
              <div className="text-slate-100">Up to 10 passengers</div>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-900/60 px-3 py-2">
              <div className="font-semibold text-sky-300">Best for</div>
              <div className="text-slate-100">Weddings, date nights, birthdays</div>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-900/60 px-3 py-2">
              <div className="font-semibold text-amber-300">Vibe</div>
              <div className="text-slate-100">Classic limo • modern party interior</div>
            </div>
          </div>
        </header>

        {/* PHOTO LAYOUT */}
        <section className="grid gap-4 md:grid-cols-[2fr,1.4fr] md:items-stretch">
          {/* Large main image */}
          <div>
            <button
              type="button"
              onClick={() => setActiveImage('exterior')}
              className="group relative w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-[0_0_80px_rgba(15,23,42,0.85)] focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),transparent_60%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.16),transparent_55%)] opacity-60 mix-blend-screen" />
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={EXTERIOR_IMG}
                  alt={`${VEHICLE_NAME} exterior`}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.02]"
                  sizes="(min-width: 1024px) 60vw, 100vw"
                />
              </div>
              <div className="relative flex items-center justify-between px-4 pb-3 pt-2 text-xs text-slate-200">
                <span className="flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-400/60 bg-emerald-400/10 text-[0.6rem] text-emerald-300">
                    4K
                  </span>
                  Exterior • White Chrysler 300 stretch
                </span>
                <span className="text-slate-400">Click to open full-screen</span>
              </div>
            </button>

            <div className="mt-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Exterior walkaround notes
              </p>
              <p className="mt-2 text-sm text-slate-100">
                Low profile + stretched rear door equals easy red-carpet entrances. Chrome details photograph cleanly and the trunk still swallows carry-on luggage for split itineraries.
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
                <li>22" wheels + white paint pop against night shoots.</li>
                <li>Door seals keep highway noise down for toast-worthy audio.</li>
                <li>Integrated rear camera makes city hotel loops painless.</li>
              </ul>
            </div>
          </div>

          {/* Right side collage */}
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => setActiveImage('interior')}
              className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(244,244,245,0.24),transparent_55%)] opacity-60 mix-blend-overlay" />
              <div className="relative aspect-[4/3]">
                <Image
                  src={INTERIOR_IMG}
                  alt={`${VEHICLE_NAME} interior`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 30vw, 100vw"
                />
              </div>
              <div className="relative px-4 pb-3 pt-2 text-xs text-left">
                <p className="font-medium text-slate-100">
                  Interior • LED ceiling, perimeter seating & bar area
                </p>
                <p className="mt-1 text-[0.7rem] text-slate-400">
                  Expect multi-color lighting, built-in sound, and just enough room to dance badly with your favorite people.
                </p>
              </div>
            </button>

            <div className="grid grid-cols-2 gap-3 text-[0.7rem]">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-3">
                <div className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  Trivia
                </div>
                <p className="mt-1 text-slate-100">
                  The Chrysler 300 body style is one of the most popular modern limos in the US — it gives you that “Bentley-ish” look without the Bentley bill.
                </p>
              </div>
              <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 px-3 py-3">
                <div className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-sky-300">
                  Sweet spot groups
                </div>
                <p className="mt-1 text-slate-100">
                  Ideal for 6–10 guests who want to arrive together and <em>stay</em> together instead of splitting cars.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECONDARY PHOTO STRIP */}
        <section className="grid gap-4 rounded-3xl border border-slate-800 bg-slate-900/40 p-5 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Swipe again</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Bonus snaps for planners</h2>
            <p className="mt-2 text-sm text-slate-300">
              People asked to see the two hero photos further down the page, so here’s a second look complete with quick tap-to-open modals.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li>Spot check exterior paint + chrome at a glance.</li>
              <li>Revisit the fiber optic interior before you book.</li>
              <li>Tap either tile to pop the full-screen gallery.</li>
            </ul>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {encorePhotos.map((photo) => (
              <button
                key={photo.key}
                type="button"
                onClick={() => setActiveImage(photo.key)}
                className="group relative overflow-hidden rounded-3xl border border-slate-700 bg-slate-900/60 text-left focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <div className="relative aspect-[4/5]">
                  <Image src={photo.image} alt={`${VEHICLE_NAME} ${photo.label}`} fill className="object-cover transition duration-500 group-hover:scale-[1.05]" sizes="(min-width: 768px) 20vw, 60vw" />
                </div>
                <div className="relative px-4 py-3 text-xs uppercase tracking-[0.3em] text-white/70">
                  {photo.label}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* TRIVIA / WHY THIS VEHICLE SECTION */}
        <section className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900/80 via-slate-950 to-slate-900/80 px-5 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                Why this limo works so well
              </h2>
              <p className="mt-2 max-w-xl text-sm text-slate-200">
                Think of this as the “Swiss Army limo.” Small enough to get into tighter
                driveways and hotel loops, but dramatic enough that people will still
                stop and stare when you pull up.
              </p>
            </div>
            <dl className="grid gap-3 text-xs text-slate-200 sm:grid-cols-3 md:w-[50%]">
              <div className="rounded-2xl bg-slate-900/80 px-3 py-3">
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                  Ride Comfort
                </dt>
                <dd className="mt-1 text-slate-100">Low step-in height & easy entry for dresses and heels.</dd>
              </div>
              <div className="rounded-2xl bg-slate-900/80 px-3 py-3">
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-sky-300">
                  Photo Factor
                </dt>
                <dd className="mt-1 text-slate-100">White exterior pops against city lights and venues.</dd>
              </div>
              <div className="rounded-2xl bg-slate-900/80 px-3 py-3">
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-amber-300">
                  Budget Friendly
                </dt>
                <dd className="mt-1 text-slate-100">
                  Often cheaper than a big party bus while still feeling upscale.
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* REVIEWS ------------------------------------------------------------- */}
        <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-6 py-8 shadow-[0_35px_90px_rgba(2,6,23,0.55)]">
          <div className="absolute inset-0 opacity-40" aria-hidden>
            <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.4),_transparent_60%)]" />
          </div>
          <div className="relative space-y-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">
                  Verified riders
                </p>
                <h2 className="mt-2 text-3xl font-bold text-white">People can’t stop talking about this limo</h2>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-white/80">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-sm font-semibold">
                    <span>{reviewStats.avg.toFixed(1)} / 5</span>
                    <span className="text-amber-300">{renderStars(Math.round(reviewStats.avg))}</span>
                  </span>
                  <span className="text-sm text-white/60">Based on {reviewStats.count}+ traveler votes</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/reviews"
                  className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/90 hover:border-white/60"
                >
                  Read all reviews
                </Link>
                {/* TODO: link to write-review form */}
                <button className="rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg hover:bg-white">
                  Leave a review
                </button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {MOCK_REVIEWS.map((review) => (
                <article
                  key={review.id}
                  className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-5 text-white/90 backdrop-blur transition hover:-translate-y-1 hover:border-white/40"
                >
                  <div className="relative flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/60">
                    <span>{review.date}</span>
                    <span className="text-amber-300 text-base">{renderStars(review.rating)}</span>
                  </div>
                  <p className="relative mt-4 text-[15px] leading-relaxed text-white/85">
                    “{review.text}”
                  </p>
                  <div className="relative mt-4 flex items-center gap-2 text-sm text-white/70">
                    <span className="inline-block h-[6px] w-[6px] rounded-full bg-emerald-400" />
                    — {review.name}
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/reviews"
                className="inline-flex items-center justify-center rounded-full bg-white/95 px-7 py-3 text-sm font-semibold text-slate-900 shadow-[0_15px_40px_rgba(5,12,33,0.45)] transition hover:translate-y-0.5 hover:bg-white"
              >
                See more reviews
              </Link>
            </div>
          </div>
        </section>

        {/* EVENTS -------------------------------------------------------------- */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/40 px-5 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Events & occasions
              </p>
              <h2 className="text-2xl font-semibold text-white">Where this limo shines</h2>
            </div>
            {/* TODO: link to a full "events" page filtered by this vehicle */}
            <Link
              href="/events?vehicle=10-passenger-white-chrysler-300-limo"
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/80 hover:border-white"
            >
              View more events →
            </Link>
          </div>
          <p className="mt-2 text-sm text-slate-300">
            Lifted directly from the events page playbook: clean tiles, clear CTA, instant inspo.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {MOCK_EVENTS.slice(0, 6).map((evt, index) => (
              <button
                key={evt.id}
                type="button"
                onClick={() => setActiveEvent(evt)}
                className="relative flex min-h-[320px] flex-col rounded-3xl border border-white/10 bg-white text-left text-slate-900 shadow-xl transition hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <div className="relative h-40 w-full overflow-hidden rounded-t-3xl">
                  <Image
                    src={getEventImage(evt.name)}
                    alt={`${evt.name} limo inspiration`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 20vw, 100vw"
                    onError={(event) => {
                      const target = event.currentTarget as HTMLImageElement & { src: string };
                      target.src = EVENT_IMAGE_FALLBACK;
                    }}
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                    #{index + 1}
                  </p>
                  <h3 className="mt-2 text-2xl font-serif font-bold">{evt.name}</h3>
                  <p className="mt-2 text-base text-slate-600">{evt.tagline}</p>
                  <p className="mt-4 flex-1 text-sm text-slate-700">{evt.highlight}</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 text-xs">
                  <span className="font-semibold text-emerald-600">Perfect fit</span>
                  <span className="text-slate-500">Tap for itineraries →</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/events"
              className="inline-flex items-center justify-center rounded-full border border-slate-900/20 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-md hover:-translate-y-0.5"
            >
              Browse more events →
            </Link>
          </div>
        </section>

        {/* POLLS --------------------------------------------------------------- */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/50 px-5 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Live rider sentiment
              </p>
              <h2 className="text-2xl font-semibold">Polls about limos</h2>
              <p className="text-sm text-slate-300">Mirrors the 3-column layout on the homepage — two tiles per column.</p>
            </div>
            <Link
              href="/polls"
              className="rounded-full border border-sky-400/40 px-4 py-2 text-xs font-semibold text-sky-200 hover:border-sky-300"
            >
              View all polls →
            </Link>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {MOCK_POLL_COLUMNS.map((column) => (
              <div key={column.id} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.35em] text-white/60">{column.title}</p>
                    <h3 className="mt-1 text-xl font-semibold text-white">{column.description}</h3>
                  </div>
                  <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-white/70" aria-hidden>
                    Scroll ↓
                  </span>
                </div>

                <div className="relative rounded-3xl border border-white/10 bg-white/5 p-3">
                  <div className="max-h-[420px] space-y-3 overflow-y-auto pr-2">
                    {column.items.map((poll) => (
                      <button
                        key={poll.id}
                        type="button"
                        onClick={() => setActivePoll(poll)}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/90 transition hover:border-sky-300/60 hover:bg-sky-500/10 focus:outline-none focus:ring-2 focus:ring-sky-400"
                      >
                        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-white/50">
                          <span>Poll</span>
                          <span className="text-sky-200">Preview</span>
                        </div>
                        <p className="mt-2 text-base font-semibold">{poll.label}</p>
                        {poll.blurb && <p className="mt-1 text-xs text-white/70">{poll.blurb}</p>}
                      </button>
                    ))}
                  </div>
                  <div className="pointer-events-none absolute inset-x-3 bottom-3 h-12 rounded-b-2xl bg-gradient-to-t from-slate-950/70 to-transparent" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center text-sm text-white/70">
            Rotates with real Supabase-backed poll tiles once you wire it up.
          </div>
        </section>

        {/* TOOLS --------------------------------------------------------------- */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/40 px-5 py-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Planning stack</p>
              <h2 className="text-2xl font-semibold">Helpful planning tools</h2>
            </div>
            <Link
              href="/tools"
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/80 hover:border-white"
            >
              View all tools →
            </Link>
          </div>
          <p className="text-sm text-slate-300">
            Same energy as the homepage tools grid — quick emoji, bold names, instant context. Hook these up to Supabase once the API is ready.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {MOCK_TOOLS.map((tool) => (
              <button
                key={tool.id}
                type="button"
                onClick={() => setActiveTool(tool)}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-emerald-400/60 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                    {tool.icon ?? '🛠️'}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">{tool.label}</p>
                    <p className="text-[0.7rem] uppercase tracking-[0.3em] text-white/60">Tap for details</p>
                  </div>
                </div>
                {tool.blurb && <p className="mt-3 text-sm text-white/80">{tool.blurb}</p>}
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              href="/tools"
              className="rounded-2xl border border-white/15 px-6 py-2 text-sm font-semibold text-white/80 hover:border-white"
            >
              View more tools →
            </Link>
          </div>
        </section>

        {/* FAQ ----------------------------------------------------------------- */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/40 px-5 py-6">
          <div className="mb-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Have questions?</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">{VEHICLE_NAME} – FAQs</h2>
            <p className="mt-2 text-sm text-white/70">
              Carbon copy of the homepage FAQ widget with search + expandable answers.
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-4">
            <div className="text-center">
              <label htmlFor="vehicle-faq-search" className="text-sm font-semibold text-white/70">
                Search anything
              </label>
              <input
                id="vehicle-faq-search"
                type="text"
                value={faqQuery}
                onChange={(event) => {
                  setFaqQuery(event.target.value);
                  if (!event.target.value.trim()) {
                    setVisibleFaqCount(4);
                  }
                }}
                placeholder='Try "BYOB", "pricing", "timing"…'
                className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <p className="mt-2 text-xs text-white/60">
                Showing {visibleFaqs.length} of {filteredFaqs.length} answers
              </p>
            </div>

            <div className="space-y-3">
              {visibleFaqs.map((faq) => (
                <details
                  key={faq.id}
                  className="group rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/90 backdrop-blur"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-base font-semibold">
                    <span>{faq.question}</span>
                    <span className="text-xs text-white/70 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-2 text-sm text-white/70">{faq.answer}</p>
                </details>
              ))}

              {!visibleFaqs.length && (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-6 text-center text-white/70">
                  No answers yet. Try a different keyword.
                </div>
              )}
            </div>

            {!faqQuery.trim() && visibleFaqCount < filteredFaqs.length && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setVisibleFaqCount((count) => count + 3)}
                  className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/80 hover:border-white"
                >
                  Show 3 more answers
                </button>
              </div>
            )}

            <div className="text-center text-sm text-white/60">
              {/* TODO: wire to global FAQ CMS */}
              <Link href="/faq" className="text-white underline decoration-dotted underline-offset-4">
                View full FAQ →
              </Link>
            </div>
          </div>
        </section>
      </div>

      {activeTool && toolCopy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" aria-label="Close tool modal" className="absolute inset-0 bg-black/70" onClick={closeToolModal} />
          <div className="relative z-10 w-full max-w-xl rounded-3xl border border-white/10 bg-slate-950/90 p-6 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/60">Tool preview</p>
                <h3 className="mt-2 text-2xl font-semibold">{activeTool.label}</h3>
                <p className="mt-2 text-sm text-white/80">{toolCopy.summary}</p>
              </div>
              <button type="button" onClick={closeToolModal} className="rounded-full border border-white/20 px-3 py-1 text-sm text-white/80">
                Close
              </button>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-white/85">
              {toolCopy.bullets.map((bullet, index) => (
                <li key={index} className="flex gap-2">
                  <span aria-hidden>•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={activeTool.href}
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 hover:-translate-y-0.5"
              >
                Launch tool
              </Link>
              <span className="inline-flex items-center rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.35em] text-white/70">
                Modal preview
              </span>
            </div>
          </div>
        </div>
      )}

      {activeEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" aria-label="Close event modal" className="absolute inset-0 bg-black/70" onClick={closeEventModal} />
          <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-white text-slate-900 shadow-2xl">
            <div className="relative h-56 w-full">
              <Image src={getEventImage(activeEvent.name)} alt={`${activeEvent.name} event inspiration`} fill className="object-cover" sizes="(min-width: 768px) 60vw, 100vw" />
            </div>
            <div className="space-y-4 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Event idea</p>
                  <h3 className="text-3xl font-serif font-bold">{activeEvent.name}</h3>
                  <p className="mt-2 text-base text-slate-600">{activeEvent.tagline}</p>
                </div>
                <button type="button" onClick={closeEventModal} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                  Close ✕
                </button>
              </div>
              <p className="text-slate-700">{activeEvent.highlight}</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/events?focus=${encodeURIComponent(activeEvent.name)}`}
                  className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg hover:-translate-y-0.5"
                >
                  View sample itinerary
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setActiveImage('exterior');
                    closeEventModal();
                  }}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  Peek at limo again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activePoll && pollCopy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" aria-label="Close poll modal" className="absolute inset-0 bg-black/70" onClick={closePollModal} />
          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950/95 p-6 text-white shadow-2xl">
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">Poll preview</p>
            <h3 className="mt-2 text-2xl font-semibold">{activePoll.label}</h3>
            <p className="mt-2 text-sm text-white/80">{pollCopy.summary}</p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              {pollCopy.bullets.map((bullet, index) => (
                <li key={index} className="flex gap-2">
                  <span aria-hidden>•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={activePoll.href}
                className="rounded-full bg-sky-400 px-5 py-2 text-sm font-semibold text-slate-900 hover:-translate-y-0.5"
              >
                Jump into poll
              </Link>
              <button type="button" onClick={closePollModal} className="rounded-full border border-white/25 px-4 py-2 text-sm text-white/80">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {currentLightboxImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close image overlay"
            className="absolute inset-0 bg-black/80"
            onClick={closeLightbox}
          />
          <div className="relative z-10 w-full max-w-4xl space-y-4">
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-white/20 bg-black">
              <Image
                src={currentLightboxImage}
                alt={activeImage === 'exterior' ? `${VEHICLE_NAME} exterior full-screen` : `${VEHICLE_NAME} interior full-screen`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeLightbox}
                className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:border-white"
              >
                Close ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function renderStars(rating: number) {
  const safe = Math.max(0, Math.min(5, Math.round(rating)));
  return '★'.repeat(safe) + '☆'.repeat(5 - safe);
}

function getToolModalCopy(tool: ToolTile) {
  switch (tool.id) {
    case 't1':
      return {
        summary: tool.blurb ?? 'Dial in capacity + comfort expectations in seconds.',
        bullets: ['Adjust passenger counts and watch comfort grades update live.', 'Tells you when 8 guests fits better than a packed 10.', 'Outputs sharable notes for sales or your group chat.'],
      };
    case 't2':
      return {
        summary: tool.blurb ?? 'Estimate limo costs without waiting on a quote.',
        bullets: ['Hourly minimum + fuel calculator so nothing surprises you.', 'Auto adds tip suggestions so you stay covered.', 'Exports a PDF-ready breakdown.'],
      };
    case 't3':
      return {
        summary: tool.blurb ?? 'Drag-and-drop stops onto a clean multi-leg planner.',
        bullets: ['Hotel → ceremony → reception without copy/paste chaos.', 'Smart buffer suggestions between pickups.', 'Shareable itinerary link for guests.'],
      };
    case 't4':
      return {
        summary: tool.blurb ?? 'Keep the limo playlist hype with zero dead air.',
        bullets: ['Auto-build 45-minute sets from your Spotify favorites.', 'Mood toggles for cruise, arrival, or after-party.', 'Exports to any streaming service.'],
      };
    case 't5':
      return {
        summary: tool.blurb ?? 'Give hotel doors, valets, and photogs a single script.',
        bullets: ['Template intros for drivers + hosts.', 'Print-ready cue sheet at the end.', 'Keeps everyone on timing.'],
      };
    case 't6':
      return {
        summary: tool.blurb ?? 'Stop guessing how many bottles to bring onboard.',
        bullets: ['Enter guest count + ride length to get counts.', 'Splits still vs. sparkling vs. mixers.', 'Includes grocery + liquor store checklist.'],
      };
    default:
      return {
        summary: tool.blurb ?? 'A focused helper built for limo planning moments.',
        bullets: ['Clean mobile-friendly layout.', 'Fast data entry with smart defaults.', 'Export notes to share with your chauffeur.'],
      };
  }
}

function getPollModalCopy(poll: PollTile) {
  return {
    summary: poll.blurb ?? 'See how other riders answered before you vote.',
    bullets: ['Instant stats once you vote.', 'Mobile-friendly poll page.', 'Shareable results card.'],
  };
}
