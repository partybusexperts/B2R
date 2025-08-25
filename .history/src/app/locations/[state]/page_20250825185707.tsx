"use client";
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { findState } from '../locationData';

interface Props { params: { state: string } }

/* Alaska rich content (extendable for other states later) */
const alaskaSections = [
  {
    id: 'overview',
    title: 'Alaska Charter Bus & Limo Overview',
    body: `From Anchorage corporate shuttles to Juneau cruise transfers and Fairbanks aurora tours, Alaska ground transportation demands reliability in extreme conditions. We coordinate winter-ready vehicles, veteran drivers, and itineraries built around daylight cycles and weather windows.`
  },
  {
    id: 'popular-trips',
    title: 'Popular Trip Types',
    body: '',
    bullets: [
      'Airport transfers: ANC, FAI, JNU with flight tracking & buffer time',
      'Cruise port shuttles (Whittier & Seward) with luggage staging',
      'Northern lights chase (dynamic routing to clearer skies)',
      'Corporate incentive & oil field crew transport',
      'National park & glacier sightseeing day charters',
    ]
  },
  {
    id: 'seasonality',
    title: 'Seasonality & Timing',
    body: 'Summer brings long daylight and peak demand—book 90+ days ahead for Saturdays. Winter requires contingency padding for storms, roadway ice, and limited daylight. Shoulder seasons (Apr–May / Sep–Oct) can reduce rates 10–18% with more fleet flexibility.'
  },
  {
    id: 'vehicle-readiness',
    title: 'Vehicle Readiness in Cold Weather',
    body: 'We verify block heaters, insulated storage, emergency kits, studded or appropriate winter tires (where legal), and redundant communication when cellular coverage thins on remote corridors.'
  },
  {
    id: 'routing',
    title: 'Routing & Distance Planning',
    body: 'Alaska geography stretches travel times—add buffer for wildlife slowdowns, construction, and single‑lane pilot car zones. We model drive segments with conservative average speeds versus posted limits for accuracy.'
  },
  {
    id: 'pricing',
    title: 'Pricing Framework',
    body: 'Rates reflect limited fleet density + seasonal spikes. Multi‑day excursions often bundle minimum hours + per‑diem lodging for drivers. Ask about shoulder season and midweek strategy to optimize total cost.'
  },
  {
    id: 'compliance',
    title: 'Safety & Compliance',
    body: 'DOT compliance, driver hours of service, winter operations protocols, and pre‑trip inspections are strictly enforced. We surface certificates upon request and maintain transparent audit logs.'
  },
  {
    id: 'booking-tips',
    title: 'Booking Tips',
    bullets: [
      'Share contingency priorities (schedule vs budget) so we tune buffers.',
      'Provide passenger manifest if remote pickup coordination is needed.',
      'Clarify gear (skis, photo rigs, expedition cases) for cargo planning.',
      'Lock lodging for multi‑day charters before finalizing route sequencing.'
    ]
  }
];

/* Sample reviews & polls placeholders (state-specific adaptation later) */
const REVIEWS = [
  { name: 'Kara M.', city: 'Anchorage', rating: 5, text: 'Flawless winter shuttle—driver pre‑heated the bus and tracked our delayed flight.' },
  { name: 'Luis R.', city: 'Fairbanks', rating: 5, text: 'Aurora charter pivoted mid‑route to clearer skies. Worth every mile.' },
  { name: 'Janelle S.', city: 'Juneau', rating: 5, text: 'Cruise pier transfer with glacier stop—logistics dialed in, zero stress.' },
  { name: 'Owen P.', city: 'Wasilla', rating: 4, text: 'Great bus & driver. Added photo stops seamlessly—only wish we booked longer.' },
];

const POLLS = [
  { question: 'Favorite Alaska charter season?', options: ['Summer', 'Winter', 'Shoulder'], results: [12, 5, 7] },
  { question: 'Top trip focus?', options: ['Scenic', 'Corporate', 'Adventure'], results: [14, 6, 10] },
];

export default function StatePage({ params }: Props) {
  const entry = findState(params.state);
  if (!entry) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">State Not Found</h1>
  <p className="text-lg text-gray-300 mb-8">We couldn&apos;t locate that service region yet.</p>
        <Link href="/locations" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg">Back to Locations</Link>
      </div>
    );
  }

  const isAlaska = entry.state === 'Alaska';
  const [reviewSearch, setReviewSearch] = useState('');
  const filteredReviews = useMemo(() => {
    const q = reviewSearch.trim().toLowerCase();
    if (!q) return REVIEWS;
    return REVIEWS.filter(r => r.name.toLowerCase().includes(q) || r.text.toLowerCase().includes(q) || r.city.toLowerCase().includes(q));
  }, [reviewSearch]);

  return (
    <div className="bg-gradient-to-b from-blue-950 via-blue-900 to-black text-white">
      <header className="relative overflow-hidden min-h-[420px] flex flex-col items-center justify-center text-center py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-blue-600 to-indigo-900" />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10" />
        <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold mb-6 tracking-tight font-serif drop-shadow-[0_6px_20px_rgba(0,0,0,.35)]">
          {entry.state} Charter Buses & Limos
        </h1>
        <p className="relative z-10 text-2xl md:text-3xl max-w-4xl mx-auto mb-10 text-blue-50 font-medium drop-shadow">
          Reliable group transportation across {entry.state}{isAlaska && '—from cruise transfers to northern lights tours'}.
        </p>
        <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center w-full max-w-3xl">
          <a href="/quote#instant" className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[200px] bg-white/95 text-blue-900 hover:bg-white border-blue-200">⚡ Instant Quote</a>
          <a href="/fleet" className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[200px] bg-blue-600 text-white hover:bg-blue-700 border-blue-700">🚌 View Fleet</a>
          <a href="tel:8885352566" className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[200px] bg-blue-800 text-white hover:bg-blue-900 border-blue-900">Call (888) 535-2566</a>
        </div>
        <div className="absolute bottom-[-1px] left-0 right-0">
          <svg viewBox="0 0 1440 110" className="w-full h-[110px]" preserveAspectRatio="none"><path d="M0,80 C240,130 480,20 720,60 C960,100 1200,40 1440,80 L1440,120 L0,120 Z" fill="#122a56" /></svg>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 md:px-10 -mt-2">
        {/* Breadcrumb */}
        <nav className="text-sm text-blue-200 mb-6 mt-10" aria-label="Breadcrumb">
          <ol className="flex flex-wrap gap-2">
            <li><Link href="/locations" className="hover:underline">Locations</Link> &raquo;</li>
            <li className="text-blue-100 font-semibold">{entry.state}</li>
          </ol>
        </nav>

        {/* Cities */}
        <section className="mb-14" id="cities">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-5 font-serif">Cities We Serve in {entry.state}</h2>
          <ul className="flex flex-wrap gap-3">
            {entry.cities.map(c => (
              <li key={c}>
                <span className="inline-block bg-[#122a56] border border-blue-800/40 rounded-full px-4 py-2 text-blue-100 text-sm md:text-base">{c}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Alaska deep content or generic placeholder */}
        {isAlaska ? (
          <section className="mb-20" id="alaska-guide">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-10">
                {alaskaSections.slice(0, Math.ceil(alaskaSections.length/2)).map(sec => (
                  <div key={sec.id} id={sec.id} className="bg-[#122a56] border border-blue-800/40 rounded-3xl p-6 md:p-7 shadow-lg">
                    <h3 className="text-2xl font-bold mb-3 font-serif">{sec.title}</h3>
                    {sec.body && <p className="text-blue-100/90 leading-relaxed text-sm md:text-base whitespace-pre-line">{sec.body}</p>}
                    {sec.bullets && <ul className="list-disc list-inside mt-3 space-y-1 text-blue-100/90 text-sm md:text-base">{sec.bullets.map(b => <li key={b}>{b}</li>)}</ul>}
                  </div>
                ))}
              </div>
              <div className="space-y-10">
                {alaskaSections.slice(Math.ceil(alaskaSections.length/2)).map(sec => (
                  <div key={sec.id} id={sec.id} className="bg-[#122a56] border border-blue-800/40 rounded-3xl p-6 md:p-7 shadow-lg">
                    <h3 className="text-2xl font-bold mb-3 font-serif">{sec.title}</h3>
                    {sec.body && <p className="text-blue-100/90 leading-relaxed text-sm md:text-base whitespace-pre-line">{sec.body}</p>}
                    {sec.bullets && <ul className="list-disc list-inside mt-3 space-y-1 text-blue-100/90 text-sm md:text-base">{sec.bullets.map(b => <li key={b}>{b}</li>)}</ul>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="mb-20" id="state-overview">
            <div className="bg-[#122a56] border border-blue-800/40 rounded-3xl p-8 shadow-lg">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-5 font-serif">About {entry.state} Service</h2>
              <p className="text-blue-100/90 leading-relaxed text-base md:text-lg max-w-3xl">Detailed transportation guide for {entry.state} is coming soon. You can still request quotes, view fleet options, and lock dates now—content will expand with seasonal pricing insights, routing strategies, and local compliance notes.</p>
            </div>
          </section>
        )}

        {/* Reviews */}
        <section className="mb-20" id="reviews">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 font-serif">Recent {entry.state} Reviews</h2>
          <div className="bg-[#122a56] border border-blue-800/40 rounded-3xl p-6 md:p-8 shadow-lg mb-6">
            <input value={reviewSearch} onChange={e => setReviewSearch(e.target.value)} placeholder="Search reviews…" aria-label="Search reviews" className="w-full rounded-full px-5 py-3 bg-[#0f1f46] border border-blue-800/40 text-white placeholder-blue-300 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {filteredReviews.map((r,i) => (
              <div key={i} className="bg-[#122a56] border border-blue-800/40 rounded-3xl p-6 flex flex-col shadow-lg">
                <p className="text-blue-100/90 italic mb-4">“{r.text}”</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-white">— {r.name} • {r.city}</span>
                  <span className="text-yellow-400">{'★★★★★'.slice(0, r.rating)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/reviews" className="inline-block bg-white/95 hover:bg-white text-blue-900 font-bold px-8 py-4 rounded-full shadow-lg border border-blue-200 transition">More Reviews</Link>
          </div>
        </section>

        {/* Poll previews */}
        <section className="mb-20" id="polls">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 font-serif">Local Poll Snapshots</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {POLLS.map((poll, idx) => {
              const total = poll.results.reduce((a,b)=>a+b,0);
              return (
                <div key={idx} className="bg-[#122a56] border border-blue-800/40 rounded-3xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-4">{poll.question}</h3>
                  <ul className="space-y-2 text-sm">
                    {poll.options.map((opt,i) => {
                      const count = poll.results[i];
                      const pct = total ? Math.round(count/total*100) : 0;
                      return (
                        <li key={opt} className="flex items-center gap-3">
                          <span className="w-24 text-blue-100/90">{opt}</span>
                          <div className="flex-1 h-3 rounded bg-blue-900 overflow-hidden"><div style={{width: pct+'%'}} className="h-full bg-blue-400" /></div>
                          <span className="w-10 text-right text-blue-200 text-xs">{pct}%</span>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-4 text-right text-xs text-blue-300">({total} votes)</div>
                </div>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link href="/poll-results" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-full shadow-lg border border-blue-700 transition">View All Polls</Link>
          </div>
        </section>

        {/* Tools CTA */}
        <section className="mb-28" id="tools">
          <div className="bg-[#122a56] border border-blue-800/40 rounded-3xl p-8 shadow-lg flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-serif">Plan Smarter</h2>
              <p className="text-blue-100/90 mb-4">Use our calculators & planning utilities to fine‑tune charter hours, budget strategy, and itinerary pacing—tailored soon for {entry.state} distances & conditions.</p>
              <ul className="list-disc list-inside text-blue-100/90 space-y-1 text-sm md:text-base mb-6">
                <li>Hourly vs flat comparison</li>
                <li>Capacity comfort estimator</li>
                <li>Distance + buffer time helper</li>
                <li>Seasonal pricing analyzer</li>
              </ul>
              <Link href="/tools" className="inline-block bg-white/95 hover:bg-white text-blue-900 font-bold px-8 py-4 rounded-full shadow-lg border border-blue-200 transition">Open Tools</Link>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4 text-sm">
              {alaskaSections.slice(0,4).map(s => (
                <a key={s.id} href={'#'+s.id} className="group bg-[#0f1f46] border border-blue-800/40 rounded-2xl p-4 hover:bg-[#153067] transition flex flex-col gap-2">
                  <span className="font-semibold text-blue-100 group-hover:text-white text-sm">{s.title}</span>
                  <span className="text-blue-300/80 text-xs line-clamp-3">Guide anchor</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
