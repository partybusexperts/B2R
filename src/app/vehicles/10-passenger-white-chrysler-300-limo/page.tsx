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

const HERO_IMAGES = [
  { key: 'exterior' as const, src: EXTERIOR_IMG, alt: 'Chrysler 300 limo exterior' },
  { key: 'interior' as const, src: INTERIOR_IMG, alt: 'Chrysler 300 limo interior' },
];

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
  {
    id: '7',
    name: 'Priya V.',
    rating: 5,
    date: 'Apr 2025',
    text: 'Did a surprise anniversary ride. The driver dimmed the lights and queued our playlist right on time. Felt very private.',
  },
  {
    id: '8',
    name: 'Jordan S.',
    rating: 4,
    date: 'Mar 2025',
    text: 'Booked for prom. The white exterior popped in photos and the parents loved the professional chauffeur vibe.',
  },
  {
    id: '9',
    name: 'Talia + Crew',
    rating: 5,
    date: 'Feb 2025',
    text: 'Corporate airport pickup with three suitcases each. Plenty of trunk space and the interior lighting impressed clients.',
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

const MORE_LIMOS = [
  {
    id: 'l1',
    name: '14 Passenger Black Chrysler 300 Limo',
    blurb: 'Black-tie look, same smooth ride — great for galas and nightclubs.',
    href: '/vehicles/14-passenger-black-chrysler-300-limo',
    img:
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=900&q=80',
    capacity: 'Best at 10–12',
  },
  {
    id: 'l2',
    name: '12 Passenger White Lincoln MKT Limo',
    blurb: 'Classic Lincoln profile with a taller roofline for gowns and suits.',
    href: '/vehicles/12-passenger-white-lincoln-mkt-limo',
    img:
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80',
    capacity: 'Best at 9–11',
  },
  {
    id: 'l3',
    name: '20 Passenger Hummer H2 Limo',
    blurb: 'Max crowd + headroom, perfect when you want louder entrances.',
    href: '/vehicles/20-passenger-hummer-h2-limo',
    img:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80',
    capacity: 'Best at 14–18',
  },
];

const HERO_TRUST_POINTS = [
  {
    id: 'chauffeur',
    label: 'Chauffeur included',
    sub: 'Professional pickup + timing',
    modal: {
      title: 'Who drives?',
      body: 'A vetted chauffeur — not a gig driver — who coordinates arrivals, communicates ETA updates, and helps with doors + photos.',
      bullets: ['Chauffeurs know hotel + venue load-ins', 'Early arrival + route checks', 'Dress code matched to your event'],
    },
  },
  {
    id: 'best-fit',
    label: 'Best fit: 8–9',
    sub: 'Comfort + formalwear space',
    modal: {
      title: 'Why 8–9 is the sweet spot',
      body: 'The limo is rated for 10, but the comfort zone leaves space for gowns, suits, bouquets, and small bags without feeling tight.',
      bullets: ['Elbow room for dresses and suits', 'Space to rotate seats for photos', 'Trunk space for carry-ons + gift bags'],
    },
  },
  {
    id: 'photo-friendly',
    label: 'Photo-friendly white',
    sub: 'Clean day + night shots',
    modal: {
      title: 'Photo factor',
      body: 'The white exterior + interior lighting reads clean on camera. Photographers love the even panels and reflective chrome.',
      bullets: ['White body panels = easy edits', 'LED ceiling for night shots', 'Large windows for daylight group pics'],
    },
  },
];

// ---- PAGE COMPONENT ----------------------------------------------------------

export default function VehicleChrysler10Page() {
  const [activeImage, setActiveImage] = useState<'exterior' | 'interior' | null>(null);
  const [activeTool, setActiveTool] = useState<ToolTile | null>(null);
  const [activeEvent, setActiveEvent] = useState<EventUse | null>(null);
  const [activePoll, setActivePoll] = useState<PollTile | null>(null);
  const [infoModal, setInfoModal] = useState<{
    title: string;
    body: string;
    bullets?: string[];
    ctaLabel?: string;
    ctaHref?: string;
  } | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [faqQuery, setFaqQuery] = useState('');
  const [visibleFaqCount, setVisibleFaqCount] = useState(20);
  const [reviewSearch, setReviewSearch] = useState('');
  const [fiveStarOnly, setFiveStarOnly] = useState(false);
  const [visibleReviewCount, setVisibleReviewCount] = useState(6);
  const [eventReviewFilter, setEventReviewFilter] = useState(false);
  const [toolQuery, setToolQuery] = useState('');
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
  const reviewStats = useMemo(() => {
    const avg =
      MOCK_REVIEWS.reduce((sum, review) => sum + review.rating, 0) / MOCK_REVIEWS.length;
    return {
      avg: Math.round(avg * 10) / 10,
      count: 128,
    };
  }, []);

  const filteredReviews = useMemo(() => {
    const q = reviewSearch.trim().toLowerCase();
    let list = MOCK_REVIEWS.filter((review) => {
      if (!q) return true;
      return (
        review.text.toLowerCase().includes(q) ||
        review.name.toLowerCase().includes(q) ||
        review.date.toLowerCase().includes(q)
      );
    });
    if (fiveStarOnly) list = list.filter((review) => review.rating === 5);
    if (eventReviewFilter) {
      list = list.filter((review) => {
        const text = review.text.toLowerCase();
        return text.includes('wedding') || text.includes('prom') || text.includes('corporate');
      });
    }
    return list;
  }, [eventReviewFilter, fiveStarOnly, reviewSearch]);

  const visibleReviews = useMemo(
    () => filteredReviews.slice(0, Math.min(visibleReviewCount, filteredReviews.length)),
    [filteredReviews, visibleReviewCount],
  );

  const filteredTools = useMemo(() => {
    const q = toolQuery.trim().toLowerCase();
    if (!q) return MOCK_TOOLS;
    return MOCK_TOOLS.filter((t) => {
      const hay = `${t.label} ${t.blurb ?? ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [toolQuery]);

  useEffect(() => {
    if (!activeImage && !activeTool && !activeEvent && !activePoll && !infoModal) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveImage(null);
        setActiveTool(null);
        setActiveEvent(null);
        setActivePoll(null);
        setInfoModal(null);
        setLightboxIndex(null);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeImage, activeTool, activeEvent, activePoll, infoModal]);


  const closeLightbox = () => {
    setActiveImage(null);
    setLightboxIndex(null);
  };
  const closeToolModal = () => setActiveTool(null);
  const closeEventModal = () => setActiveEvent(null);
  const closePollModal = () => setActivePoll(null);
  const closeInfoModal = () => setInfoModal(null);
  const currentLightboxImage =
    lightboxIndex !== null && HERO_IMAGES[lightboxIndex]
      ? HERO_IMAGES[lightboxIndex]
      : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-24 pt-8 md:pt-10 lg:px-6">
        {/* HERO: simple, premium, conversion-first */}
        <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-950 to-slate-900/70 p-6 shadow-[0_30px_80px_rgba(2,6,23,0.55)]">
          <div className="grid gap-8 lg:grid-cols-[1.4fr,1fr] lg:items-stretch">
            {/* Left: gallery + headline */}
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
                  Featured limo • 24/7 booking
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                  Seats 10 • Sweet spot 8–9
                </span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                {VEHICLE_NAME}
              </h1>
              <p className="max-w-3xl text-slate-200">
                A clean white stretch for weddings, date nights, airport VIP runs, and small-group celebrations.
                Big presence — without paying for a 30–40 passenger bus you won’t fill.
              </p>

              {/* Gallery block (very obvious clickable) */}
              <div id="vehicle-photos" className="rounded-3xl border border-white/10 bg-slate-900/60 p-4">
                <button
                  type="button"
                  onClick={() => {
                    setActiveImage('exterior');
                    setLightboxIndex(0);
                  }}
                  className="group relative block w-full overflow-hidden rounded-3xl border border-white/10 bg-black/30 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src={EXTERIOR_IMG}
                      alt={`${VEHICLE_NAME} exterior`}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.02]"
                      sizes="(min-width: 1024px) 60vw, 100vw"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" aria-hidden />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 pb-3 text-xs text-white/85">
                    <span className="rounded-full border border-emerald-300/40 bg-black/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-100">
                      Tap to zoom + swipe →
                    </span>
                    <span className="text-white/70">Exterior • 4K</span>
                  </div>
                </button>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveImage('exterior');
                      setLightboxIndex(0);
                    }}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 text-left transition hover:border-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                      <Image
                        src={EXTERIOR_IMG}
                        alt={`${VEHICLE_NAME} exterior thumbnail`}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(min-width: 1024px) 20vw, 50vw"
                      />
                    </div>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                      Exterior
                    </p>
                    <p className="text-sm text-white/85">White stretch, clean photos</p>
                    <p className="mt-1 text-xs text-emerald-200/90">Tap for details →</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveImage('interior');
                      setLightboxIndex(1);
                    }}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 text-left transition hover:border-sky-300/50 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                      <Image
                        src={INTERIOR_IMG}
                        alt={`${VEHICLE_NAME} interior thumbnail`}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(min-width: 1024px) 20vw, 50vw"
                      />
                    </div>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                      Interior
                    </p>
                    <p className="text-sm text-white/85">LED ceiling + perimeter seating</p>
                    <p className="mt-1 text-xs text-sky-200/90">Tap for details →</p>
                  </button>
                </div>
              </div>

              {/* Primary CTA row (tight) */}
              <div className="grid gap-4 pt-1 lg:grid-cols-[auto,1fr] lg:items-start">
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="group relative overflow-hidden rounded-full px-7 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-950 shadow-lg transition hover:-translate-y-0.5"
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(52,211,153,1) 0%, rgba(34,197,94,1) 50%, rgba(16,185,129,1) 100%)',
                    }}
                  >
                    <span className="relative z-10">Start my quote</span>
                    <span className="relative z-10 ml-2">→</span>
                    <span
                      aria-hidden
                      className="absolute inset-0 opacity-0 transition group-hover:opacity-100"
                      style={{
                        background:
                          'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.25), transparent 55%)',
                      }}
                    />
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      setInfoModal({
                        title: 'How booking works (fast)',
                        body: 'We keep it simple: date + pickup window, headcount + stops, then confirm & pay. You\'ll get a clean itinerary + arrival notes.',
                        bullets: ['Pick date + pickup window', 'Share headcount + stops', 'Approve quote + pay securely'],
                        ctaLabel: 'Start now',
                        ctaHref: '/contact',
                      })
                    }
                    className="rounded-full border border-sky-300/30 bg-sky-500/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-sky-100 transition hover:border-sky-300/60"
                  >
                    See the process
                  </button>

                  <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                    <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">Best comfort: 8-9</span>
                    <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">Events: Wedding / Prom</span>
                    <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">Call: (888) 535-2566</span>
                  </div>
                </div>

                {/* Right-side compact compare */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 lg:max-w-md lg:justify-self-end">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">Quick compare</p>
                  <ul className="mt-2 space-y-2">
                    <li className="flex justify-between"><span>Max headcount</span><span className="text-white">18-20 (H2)</span></li>
                    <li className="flex justify-between"><span>Best comfort</span><span className="text-white">8-12 (300s)</span></li>
                    <li className="flex justify-between"><span>Roof height</span><span className="text-white">Standard sedan</span></li>
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link href="/limousines" className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/80 hover:border-white/50">
                      Compare fleet
                    </Link>
                    <Link href="/contact" className="rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 hover:-translate-y-0.5">
                      Ask sizing →
                    </Link>
                  </div>
                </div>
              </div>

              {/* FILLER: keeps hero from feeling empty */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">What's included</p>
                  <ul className="mt-3 space-y-2 text-sm text-white/80">
                    <li className="flex gap-2"><span aria-hidden>•</span><span>Chauffeur + arrival coordination</span></li>
                    <li className="flex gap-2"><span aria-hidden>•</span><span>Multi-stop routing (bars / photos / venues)</span></li>
                    <li className="flex gap-2"><span aria-hidden>•</span><span>Clean itinerary + timing buffers</span></li>
                    <li className="flex gap-2"><span aria-hidden>•</span><span>Door assist + staging for photos</span></li>
                  </ul>
                  <button
                    type="button"
                    onClick={() =>
                      setInfoModal({
                        title: "What's included (quick)",
                        body: "This is the right-size luxury package: a vetted chauffeur, timing buffers, and coordination so you don't babysit the ride.",
                        bullets: [
                          'Chauffeur + route checks',
                          'Stops + buffer planning',
                          'Arrival notes for venues/hotels',
                          'Door assist for photos & formalwear',
                        ],
                        ctaLabel: 'Start my quote',
                        ctaHref: '/contact',
                      })
                    }
                    className="mt-4 w-full rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-100 hover:border-emerald-300/60"
                  >
                    See what's included →
                  </button>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">Perfect if you...</p>
                  <div className="mt-3 space-y-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-sm font-semibold text-white">Have 6-10 people</p>
                      <p className="mt-1 text-sm text-white/70">You want luxury without paying for unused seats.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-sm font-semibold text-white">Care about photos</p>
                      <p className="mt-1 text-sm text-white/70">White exterior + LEDs = cleaner shots day/night.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-sm font-semibold text-white">Need timing to just work</p>
                      <p className="mt-1 text-sm text-white/70">We build buffers so the schedule doesn't fall apart.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">Quick reality check</p>
                  <div className="mt-3 space-y-3 text-sm text-white/80">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="font-semibold text-white">Comfort sweet spot</p>
                      <p className="mt-1 text-white/70">8-9 guests (gowns, bags, elbow room)</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="font-semibold text-white">Best ride types</p>
                      <p className="mt-1 text-white/70">Weddings, prom, airport VIP, dinners</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="font-semibold text-white">Fastest quote</p>
                      <p className="mt-1 text-white/70">Date + pickup window + stops + headcount</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href="/contact"
                      className="rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-950 hover:-translate-y-0.5"
                    >
                      Start my quote →
                    </Link>
                    <Link
                      href="tel:+18885352566"
                      className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/85 hover:border-white/40"
                    >
                      Call now
                    </Link>
                  </div>
                </div>
              </div>

              {/* Trust bullets (not spammy) */}
              <div className="grid gap-3 sm:grid-cols-3">
                {HERO_TRUST_POINTS.map((point) => (
                  <TrustPill
                    key={point.id}
                    label={point.label}
                    sub={point.sub}
                    onClick={() =>
                      setInfoModal({
                        title: point.modal.title,
                        body: point.modal.body,
                        bullets: point.modal.bullets,
                      })
                    }
                  />
                ))}
              </div>
            </div>

            {/* Right: funnel card (phone, steps, speed) */}
            <aside className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
                  Fast booking
                </p>
                <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-[11px] font-semibold text-emerald-200">
                  ~2 minutes
                </span>
              </div>

              <div className="mt-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                <p className="text-sm font-semibold text-white">Call us (instant help)</p>
                <Link
                  href="tel:+18885352566"
                  className="mt-1 inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight text-emerald-200 hover:text-emerald-100"
                >
                  (888) 535-2566 <span className="text-sm font-semibold text-white/60">→</span>
                </Link>
                <p className="mt-2 text-sm text-white/70">
                  Tell us date + pickup window + stops. We handle the details.
                </p>
              </div>

              <ol className="mt-4 space-y-3 text-sm">
                <FunnelStep n="1" title="Pick date + pickup window" desc="We soft-hold the limo slot." />
                <FunnelStep n="2" title="Share headcount + stops" desc="We map buffers so you stay on time." />
                <FunnelStep n="3" title="Approve quote + pay" desc="You get itinerary + arrival notes." />
              </ol>

              <div className="mt-5 grid gap-3">
                <Link
                  href="/contact"
                  className="rounded-2xl bg-emerald-400 px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.22em] text-slate-950 shadow-lg hover:-translate-y-0.5"
                >
                  Start my quote
                </Link>
                <Link
                  href="/faq"
                  className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.22em] text-white/85 hover:border-white/35"
                >
                  Booking FAQs
                </Link>
              </div>

              {/* RIGHT CARD: pack the bottom area tighter + fill dead space */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {/* Most common bookings */}
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-white/80">
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/60">
                    Most common bookings
                  </p>

                  <div className="mt-3 grid gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setInfoModal({
                          title: 'Wedding: ceremony → photos → reception',
                          body: 'The classic flow. We build buffer time so photos do not wreck your arrival.',
                          bullets: [
                            'Pickup window + venue load-in notes',
                            'Photo stop timing + do not rush buffer',
                            'Reception arrival staging (doors + pics)',
                          ],
                          ctaLabel: 'Start my quote',
                          ctaHref: '/contact',
                        })
                      }
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-emerald-300/50"
                    >
                      <p className="text-sm font-semibold text-white">Wedding flow</p>
                      <p className="mt-1 text-xs text-white/70">Ceremony → photos → reception</p>
                      <p className="mt-2 text-xs text-emerald-200/90">Tap for timing notes →</p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setInfoModal({
                          title: 'Prom: photos + safe pickup plan',
                          body: 'Parents love this option. We coordinate the timing so the group stays together.',
                          bullets: [
                            'Photo meetup location + pickup window',
                            'Clear drop-off + return timing',
                            'Professional chauffeur (no chaos)',
                          ],
                          ctaLabel: 'Start my quote',
                          ctaHref: '/contact',
                        })
                      }
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-sky-300/50"
                    >
                      <p className="text-sm font-semibold text-white">Prom / homecoming</p>
                      <p className="mt-1 text-xs text-white/70">Photos + dinner + drop-off</p>
                      <p className="mt-2 text-xs text-sky-200/90">Tap for safety plan →</p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setInfoModal({
                          title: 'Airport VIP: pickup + luggage + timing',
                          body: 'Best for small groups who want a clean, quiet ride instead of a rideshare scramble.',
                          bullets: [
                            'Flight number (optional) for buffer timing',
                            'Luggage notes (carry-ons vs suitcases)',
                            'Terminal + curbside coordination',
                          ],
                          ctaLabel: 'Start my quote',
                          ctaHref: '/contact',
                        })
                      }
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-white/30"
                    >
                      <p className="text-sm font-semibold text-white">Airport VIP</p>
                      <p className="mt-1 text-xs text-white/70">Pickup + luggage notes + smooth exit</p>
                      <p className="mt-2 text-xs text-white/70">Tap for airport checklist →</p>
                    </button>
                  </div>
                </div>

                {/* Have ready + quick tips (compact) */}
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 text-sm text-white/75">
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/60">Have ready</p>
                  <ul className="mt-2 space-y-1">
                    <li className="flex gap-2"><span aria-hidden>•</span><span>Date + pickup window</span></li>
                    <li className="flex gap-2"><span aria-hidden>•</span><span>Guest count + luggage notes</span></li>
                    <li className="flex gap-2"><span aria-hidden>•</span><span>Stops + photo ops you want</span></li>
                    <li className="flex gap-2"><span aria-hidden>•</span><span>Card ready for the deposit</span></li>
                  </ul>

                  <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white/75">
                    <p className="font-semibold text-white">Quick tip</p>
                    <p className="mt-1">For photos + comfort, <span className="text-white font-semibold">8-9</span> usually rides best.</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </header>

        {/* More limos (surfaced high) */}
        <section className="relative rounded-3xl border border-white/10 bg-white/5 px-5 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">More limos</p>
              <h2 className="text-2xl font-semibold text-white">See other stretch options</h2>
              <p className="text-sm text-white/75">Compare quickly if this Chrysler 300 isn’t the one.</p>
            </div>
            <Link
              href="/limousines"
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/80 hover:border-white"
            >
              View limo fleet →
            </Link>
          </div>

          <div className="mt-4 relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
              <Link
                href="/limousines"
                className="pointer-events-auto rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 hover:border-white/50"
                aria-label="Previous"
              >
                ←
              </Link>
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
              <Link
                href="/limousines"
                className="pointer-events-auto rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 hover:border-white/50"
                aria-label="Next"
              >
                →
              </Link>
            </div>

            <div className="mt-2 grid gap-4 lg:grid-cols-3">
                {MORE_LIMOS.map((limo) => (
                <Link
                  key={limo.id}
                    href={limo.href ?? '/limousines'}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-lg transition hover:-translate-y-1 hover:border-emerald-300/50"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={limo.img}
                      alt={limo.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 30vw, 100vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4 text-white">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">Stretch limo</p>
                    <h3 className="text-lg font-semibold">{limo.name}</h3>
                    <p className="text-sm text-white/75">{limo.blurb}</p>
                    <div className="mt-auto flex items-center justify-between text-xs text-white/70">
                      <span>{limo.capacity}</span>
                      <span className="rounded-full border border-emerald-300/40 px-3 py-1 text-emerald-100">
                        View →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* VISUAL BREAK (makes page feel premium, not spammy) */}
        <ImageBreak
          title="The ‘right-size luxury’ choice"
          subtitle="If your group is 6–10, this stretch is often the sweet spot."
          imageSrc={INTERIOR_IMG}
          bullets={['Perimeter seating with LED ceiling', 'Smooth ride vs. taller party buses', 'Trunk space for carry-ons + gowns']}
          cta={{ href: '/contact', label: 'Ask if it fits us →' }}
          stats={[
            { label: 'Sweet spot', value: '8–9 guests' },
            { label: 'Ride style', value: 'Low + smooth' },
            { label: 'Load time', value: '~90 seconds' },
          ]}
        />

        {/* Chrysler-specific substance */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <SectionHeader
            eyebrow="Chrysler 300 specifics"
            title="What this stretch actually offers"
            subtitle="Quick facts so it doesn’t feel like a blank section."
          />

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 h-full">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">Inside the cabin</p>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li className="flex gap-2"><span aria-hidden>•</span><span>Perimeter leather seating, fiber optic ceiling, and kick-panel lighting.</span></li>
                <li className="flex gap-2"><span aria-hidden>•</span><span>Bluetooth + aux sound with sub + tweeters (not a tinny stock system).</span></li>
                <li className="flex gap-2"><span aria-hidden>•</span><span>Ice wells + glassware upon request; BYOB friendly in most markets.</span></li>
                <li className="flex gap-2"><span aria-hidden>•</span><span>Powerful AC for summer weddings; blackout tint for photos.</span></li>
                <li className="flex gap-2"><span aria-hidden>•</span><span>Dedicated climate zones that actually keep up with formalwear + summer heat.</span></li>
                <li className="flex gap-2"><span aria-hidden>•</span><span>Entry lighting + stable step height for gowns, heels, and older guests.</span></li>
                <li className="flex gap-2"><span aria-hidden>•</span><span>Quiet ride profile — better for conversation than tall buses on rough roads.</span></li>
                <li className="flex gap-2"><span aria-hidden>•</span><span>Driver assists with doors + staging for photos (especially ceremony exits).</span></li>
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">Chrysler vs. others</p>
              <div className="space-y-2 text-sm text-white/80">
                <p>Why Chrysler 300 instead of a party bus?</p>
                <ul className="space-y-1">
                  <li className="flex gap-2"><span aria-hidden>•</span><span>Lower profile = easier hotel + venue arrivals.</span></li>
                  <li className="flex gap-2"><span aria-hidden>•</span><span>Seats 8–9 comfortably without dead space.</span></li>
                  <li className="flex gap-2"><span aria-hidden>•</span><span>White exterior photographs cleaner with gowns + tuxes.</span></li>
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                <p className="font-semibold text-white">Need a bigger vehicle?</p>
                <p className="mt-1">Check the 14 passenger Chrysler or H2 limo above, or ping us to match capacity.</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <Link href="/contact" className="rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-950">
                    Ask sizing
                  </Link>
                  <Link href="/polls?category=capacity-planning" className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                    See capacity poll
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 1: Where it shines (events) */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <SectionHeader
            eyebrow="Best use cases"
            title="Where the Chrysler 300 shines"
            subtitle="Pick an occasion — tap to preview ideas (and make it obvious)."
            rightLink={{ href: '/events?vehicle=10-passenger-white-chrysler-300-limo', label: 'More events →' }}
          />

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {MOCK_EVENTS.slice(0, 6).map((evt, index) => (
              <button
                key={evt.id}
                type="button"
                onClick={() => setActiveEvent(evt)}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/40 text-left shadow-lg transition hover:-translate-y-1 hover:border-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <div className="relative h-40 w-full">
                  <Image
                    src={getEventImage(evt.name)}
                    alt={`${evt.name} limo inspiration`}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 20vw, 100vw"
                    onError={(event) => {
                      const target = event.currentTarget as HTMLImageElement & { src: string };
                      target.src = EVENT_IMAGE_FALLBACK;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" aria-hidden />
                  <div className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">
                    Tap for details →
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
                    #{index + 1}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-white">{evt.name}</h3>
                  <p className="mt-2 text-sm text-white/75">{evt.tagline}</p>
                  <p className="mt-3 text-sm text-white/80">{evt.highlight}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-400/15 via-slate-900/60 to-sky-400/10 p-5">
            <div>
              <p className="text-sm text-white/85">
                Want this exact limo? Lock it in first — then we optimize timing, buffers, and stops.
              </p>
              <p className="mt-1 text-xs text-white/60">
                Fastest booking: date + pickup window + guest count + stops.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="group relative overflow-hidden rounded-full px-7 py-3 text-sm font-extrabold uppercase tracking-[0.22em] text-slate-950 shadow-lg transition hover:-translate-y-0.5"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(52,211,153,1) 0%, rgba(34,197,94,1) 55%, rgba(16,185,129,1) 100%)',
                }}
              >
                <span className="relative z-10">Start my quote</span>
                <span className="relative z-10 ml-2">→</span>
                <span
                  aria-hidden
                  className="absolute inset-0 opacity-0 transition group-hover:opacity-100"
                  style={{
                    background:
                      'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.28), transparent 60%)',
                  }}
                />
              </Link>

              <Link
                href="/events?vehicle=10-passenger-white-chrysler-300-limo"
                className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white/85 hover:border-white/50"
              >
                See more events →
              </Link>
            </div>
          </div>
        </section>

        {/* VISUAL BREAK */}
        <ImageBreak
          title="Photo factor matters"
          subtitle="White stretch + big windows = cleaner group shots."
          imageSrc={EXTERIOR_IMG}
          bullets={['White paneling keeps edits simple', 'Tint + LEDs for night portraits', 'Driver helps stage arrivals']}
          cta={{ href: '#vehicle-photos', label: 'View photos →' }}
          stats={[
            { label: 'Shots per stop', value: '8–12 frames' },
            { label: 'Best light', value: 'Golden hour' },
            { label: 'Driver assist', value: 'Doors + staging' },
          ]}
        />

        {/* CHAPTER 2: Reviews (tight + premium) */}
        <section id="reviews" className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 shadow-[0_35px_90px_rgba(2,6,23,0.55)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                Verified riders
              </p>
              <h2 className="mt-2 text-3xl font-bold text-white">People love this limo</h2>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-white/80">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-sm font-semibold">
                  <span>{reviewStats.avg.toFixed(1)} / 5</span>
                  <span className="text-amber-300">{renderStars(Math.round(reviewStats.avg))}</span>
                </span>
                <span className="text-sm text-white/60">Based on {reviewStats.count}+ traveler votes</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/reviews"
                className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/90 hover:border-white/60"
              >
                Read all reviews
              </Link>
              <Link
                href="/contact"
                className="rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg hover:bg-white"
              >
                Get availability
              </Link>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[2fr,1fr] md:items-end">
            <label className="flex w-full flex-col gap-2 text-sm text-white/80">
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">Search reviews</span>
              <input
                type="text"
                value={reviewSearch}
                onChange={(event) => {
                  setReviewSearch(event.target.value);
                  setVisibleReviewCount(6);
                }}
                placeholder='Try "wedding", "clean", "airport"'
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </label>
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/75">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={fiveStarOnly}
                  onChange={(event) => {
                    setFiveStarOnly(event.target.checked);
                    setVisibleReviewCount(6);
                  }}
                  className="h-4 w-4 rounded border-white/40 bg-transparent text-emerald-400"
                />
                <span>5-star only</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={eventReviewFilter}
                  onChange={(event) => {
                    setEventReviewFilter(event.target.checked);
                    setVisibleReviewCount(6);
                  }}
                  className="h-4 w-4 rounded border-white/40 bg-transparent text-emerald-400"
                />
                <span>Events (wedding/prom/corporate)</span>
              </label>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visibleReviews.map((review) => (
              <article
                key={review.id}
                className="relative overflow-hidden rounded-3xl border border-white/12 bg-white/5 p-5 text-white/90 backdrop-blur"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/60">
                  <span>{review.date}</span>
                  <span className="text-amber-300 text-base">{renderStars(review.rating)}</span>
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-white/85">“{review.text}”</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-white/70">
                  <span className="inline-block h-[6px] w-[6px] rounded-full bg-emerald-400" />
                  — {review.name}
                </div>
              </article>
            ))}
          </div>

          {visibleReviews.length < filteredReviews.length && (
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleReviewCount((count) => count + 3)}
                className="rounded-full border border-white/20 px-6 py-2 text-sm font-semibold text-white/85 hover:border-white/50"
              >
                Show more reviews
              </button>
            </div>
          )}
        </section>

        {/* CHAPTER 3: Tools */}
        <section id="tools" className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <SectionHeader
            eyebrow="Planning hub"
            title="Tools that make booking faster"
            subtitle="Bring back the fuller tools grid with previews."
            rightLink={{ href: '/tools', label: 'All tools →' }}
          />

          <div className="mt-5 grid gap-3 md:grid-cols-[2fr,1fr] md:items-end">
            <label className="flex w-full flex-col gap-2 text-sm text-white/80">
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">Search tools</span>
              <input
                type="text"
                value={toolQuery}
                onChange={(e) => setToolQuery(e.target.value)}
                placeholder='Try "budget", "route", "playlist"'
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </label>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-white/75">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/60">Tip</p>
              <p className="mt-2">Open a tool preview, then hit <span className="text-white font-semibold">Start my quote</span> inside the modal.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <button
                key={tool.id}
                type="button"
                onClick={() => setActiveTool(tool)}
                className="group h-full rounded-3xl border border-white/12 bg-slate-900/60 p-4 text-left transition hover:-translate-y-1 hover:border-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                    {tool.icon ?? '🛠️'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-white">{tool.label}</p>
                    {tool.blurb && <p className="mt-1 text-sm text-white/75">{tool.blurb}</p>}
                    <p className="mt-2 text-xs text-emerald-200/90">Tap for preview →</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {!filteredTools.length && (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-6 text-center text-white/70">
              No tools match that search. Try “route”, “budget”, or “playlist”.
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-white/70">Launch any tool or preview via modal.</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/tools"
                className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/85 hover:border-white/50"
              >
                See all tools →
              </Link>
              <Link
                href="/tools/capacity-checker"
                className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-950 hover:-translate-y-0.5"
              >
                Try capacity checker
              </Link>
            </div>
          </div>
        </section>

        {/* Polls back as their own block */}
        <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
          <SectionHeader
            eyebrow="Polls"
            title="See how riders vote"
            subtitle="Standalone polls section so it’s visible again."
            rightLink={{ href: '/polls', label: 'All polls →' }}
          />

          <div className="mt-5 space-y-4">
            {MOCK_POLL_COLUMNS.map((column) => (
              <div key={column.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] uppercase tracking-[0.32em] text-white/60">{column.title}</p>
                <p className="mt-1 text-sm text-white/80">{column.description}</p>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {column.items.map((poll) => (
                    <button
                      key={poll.id}
                      type="button"
                      onClick={() => setActivePoll(poll)}
                      className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-left transition hover:border-sky-300/60 hover:bg-sky-500/10 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    >
                      <p className="text-sm font-semibold text-white">{poll.label}</p>
                      {poll.blurb && <p className="mt-1 text-xs text-white/70">{poll.blurb}</p>}
                      <p className="mt-2 text-xs text-sky-200/90">Tap to preview →</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-end">
            <Link
              href="/polls"
              className="rounded-full border border-sky-300/30 px-5 py-2 text-sm font-semibold text-sky-100 hover:border-sky-300/60"
            >
              View all polls →
            </Link>
          </div>
        </section>

        <section id="helpful-resources" className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <SectionHeader
            eyebrow="Helpful resources"
            title="Quick links people use while planning"
            subtitle="Fast jumps on this page + a few next-step guides."
          />

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <ResourceList
              title="On this page"
              tone="emerald"
              items={[
                { label: 'Chrysler 300 gallery', href: '#vehicle-photos', note: 'Exterior + interior' },
                { label: 'Best use cases', href: '/events?vehicle=10-passenger-white-chrysler-300-limo', note: 'Wedding, prom, corporate' },
                { label: 'Reviews highlight', href: '#reviews', note: 'What riders said' },
                { label: 'Tools for planning', href: '#tools', note: 'Capacity + budget helpers' },
                { label: 'FAQs', href: '/faq', note: 'BYOB, timing, deposits' },
              ]}
            />

            <ResourceList
              title="More planning"
              tone="sky"
              items={[
                { label: 'Fleet overview', href: '/limousines', note: 'Compare other stretches' },
                { label: 'Wedding timing notes', href: '/events?wedding=true', note: 'Buffers + photo flow' },
                { label: 'Prom safety notes', href: '/events?prom=true', note: 'Parent-friendly plan' },
                { label: 'Airport VIP tips', href: '/faq#airport', note: 'Curbside + luggage' },
                { label: 'Route planner', href: '/tools/route-planner', note: 'Stops + buffers sorted' },
              ]}
            />
          </div>
        </section>

        {/* CHAPTER 4: FAQ */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/40 px-5 py-6">
          <div className="mb-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Have questions?</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">{VEHICLE_NAME} – FAQs</h2>
            <p className="mt-2 text-sm text-white/70">Search, expand, done. No wall of text.</p>
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
                  if (!event.target.value.trim()) setVisibleFaqCount(20);
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
                  onClick={() => setVisibleFaqCount((count) => count + 10)}
                  className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/80 hover:border-white"
                >
                  Show 10 more answers
                </button>
              </div>
            )}

            <div className="text-center text-sm text-white/60">
              <Link href="/faq" className="text-white underline decoration-dotted underline-offset-4">
                View full FAQ →
              </Link>
            </div>
          </div>
        </section>

      </div>

      {infoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close info modal"
            className="absolute inset-0 bg-black/70"
            onClick={closeInfoModal}
          />
          <div className="relative z-10 w-full max-w-xl rounded-3xl border border-white/10 bg-slate-950/90 p-6 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/60">More info</p>
                <h3 className="mt-2 text-2xl font-semibold">{infoModal.title}</h3>
                <p className="mt-2 text-sm text-white/80">{infoModal.body}</p>
                {infoModal.bullets && (
                  <ul className="mt-3 space-y-1 text-sm text-white/85">
                    {infoModal.bullets.map((bullet, index) => (
                      <li key={index} className="flex gap-2">
                        <span aria-hidden>•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                type="button"
                onClick={closeInfoModal}
                className="rounded-full border border-white/20 px-3 py-1 text-sm text-white/80"
              >
                Close
              </button>
            </div>
            {infoModal.ctaLabel && infoModal.ctaHref && (
              <div className="mt-5 flex justify-start">
                <Link
                  href={infoModal.ctaHref}
                  className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg hover:-translate-y-0.5"
                >
                  {infoModal.ctaLabel}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

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
              <Link
                href="/contact"
                className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-950 hover:-translate-y-0.5"
              >
                Start my quote →
              </Link>
              <Link
                href="tel:+18885352566"
                className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-5 py-2 text-sm font-semibold text-emerald-100 hover:border-emerald-300/60"
              >
                Call now
              </Link>
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
                    setLightboxIndex(0);
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
              <Link
                href="/contact"
                className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-950 hover:-translate-y-0.5"
              >
                Start my quote →
              </Link>
              <button type="button" onClick={closePollModal} className="rounded-full border border-white/25 px-4 py-2 text-sm text-white/80">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {currentLightboxImage && lightboxIndex !== null && (
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
                src={currentLightboxImage.src}
                alt={currentLightboxImage.alt}
                fill
                className="object-contain"
                sizes="100vw"
              />
              <button
                type="button"
                aria-label="Previous photo"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/60 px-3 py-2 text-white hover:border-white"
                onClick={(event) => {
                  event.stopPropagation();
                  setLightboxIndex((idx) =>
                    idx === null ? null : (idx - 1 + HERO_IMAGES.length) % HERO_IMAGES.length,
                  );
                }}
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next photo"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/60 px-3 py-2 text-white hover:border-white"
                onClick={(event) => {
                  event.stopPropagation();
                  setLightboxIndex((idx) =>
                    idx === null ? null : (idx + 1) % HERO_IMAGES.length,
                  );
                }}
              >
                →
              </button>
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

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  rightLink,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  rightLink?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/60">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-bold text-white">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-white/70">{subtitle}</p>}
      </div>
      {rightLink && (
        <Link
          href={rightLink.href}
          className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/85 hover:border-white/50"
        >
          {rightLink.label}
        </Link>
      )}
    </div>
  );
}

function TrustPill({
  label,
  sub,
  onClick,
}: {
  label: string;
  sub: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
    >
      <p className="text-sm font-semibold text-white">{label}</p>
      <p className="text-xs text-white/70">{sub}</p>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-100">Tap for details →</p>
    </button>
  );
}

function FunnelStep({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">Step {n}</p>
      <p className="mt-1 text-base font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm text-white/70">{desc}</p>
    </li>
  );
}

function ResourceList({
  title,
  tone,
  items,
}: {
  title: string;
  tone: 'emerald' | 'sky';
  items: { label: string; href: string; note?: string }[];
}) {
  const accent = tone === 'emerald' ? 'hover:border-emerald-300/60' : 'hover:border-sky-300/60';
  const arrow = tone === 'emerald' ? 'text-emerald-200/90' : 'text-sky-200/90';

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">{title}</p>
      <div className="mt-3 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center justify-between gap-3 px-4 py-3 transition ${accent}`}
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{item.label}</p>
              {item.note && <p className="mt-0.5 text-xs text-white/65">{item.note}</p>}
            </div>
            <span className={`shrink-0 text-sm font-semibold ${arrow}`}>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ImageBreak({
  title,
  subtitle,
  imageSrc,
  bullets,
  cta,
  stats,
}: {
  title: string;
  subtitle: string;
  imageSrc: string;
  bullets?: string[];
  cta?: { href: string; label: string };
  stats?: { label: string; value: string }[];
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50">
      <div className="absolute inset-0 opacity-70">
        <Image src={imageSrc} alt={title} fill className="object-cover" sizes="100vw" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/70" />
      <div className="relative min-h-[360px] p-10 md:p-12 space-y-5">
        <h3 className="mt-2 max-w-3xl text-4xl md:text-5xl font-extrabold text-white">{title}</h3>
        <p className="mt-2 max-w-2xl text-sm text-white/80">{subtitle}</p>
        {bullets && bullets.length > 0 && (
          <ul className="mt-2 grid gap-2 text-sm text-white/80 sm:grid-cols-2">
            {bullets.map((item, index) => (
              <li key={index} className="flex gap-2">
                <span aria-hidden>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
        {cta && (
          <Link
            href={cta.href}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40"
          >
            {cta.label}
            <span aria-hidden>→</span>
          </Link>
        )}

        {stats && stats.length > 0 && (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white/85 backdrop-blur"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">{stat.label}</p>
                <p className="mt-1 text-lg font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
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
