import { locations, slugifyState, LocationEntry } from './locationData';

export interface StateSection { id: string; title: string; body?: string; bullets?: string[] }
export interface StateReview { name: string; city: string; rating: number; text: string }
export interface StatePoll { question: string; options: string[] }
export interface StateContent { sections: StateSection[]; reviews: StateReview[]; polls: StatePoll[] }

// Alaska bespoke content (migrated from component)
const alaskaContent: StateContent = {
  sections: [
    { id: 'overview', title: 'Alaska Charter Bus & Limo Overview', body: 'From Anchorage corporate shuttles to Juneau cruise transfers and Fairbanks aurora tours, Alaska ground transportation demands reliability in extreme conditions. We coordinate winter-ready vehicles, veteran drivers, and itineraries built around daylight cycles and weather windows.' },
    { id: 'popular-trips', title: 'Popular Trip Types', bullets: [ 'Airport transfers: ANC, FAI, JNU with flight tracking & buffer time', 'Cruise port shuttles (Whittier & Seward) with luggage staging', 'Northern lights chase (dynamic routing to clearer skies)', 'Corporate incentive & oil field crew transport', 'National park & glacier sightseeing day charters' ] },
    { id: 'seasonality', title: 'Seasonality & Timing', body: 'Summer brings long daylight and peak demand—book 90+ days ahead for Saturdays. Winter requires contingency padding for storms, roadway ice, and limited daylight. Shoulder seasons (Apr–May / Sep–Oct) can reduce rates 10–18% with more fleet flexibility.' },
    { id: 'vehicle-readiness', title: 'Vehicle Readiness in Cold Weather', body: 'We verify block heaters, insulated storage, emergency kits, studded or appropriate winter tires (where legal), and redundant communication when cellular coverage thins on remote corridors.' },
    { id: 'routing', title: 'Routing & Distance Planning', body: 'Alaska geography stretches travel times—add buffer for wildlife slowdowns, construction, and single-lane pilot car zones. We model drive segments with conservative average speeds versus posted limits for accuracy.' },
    { id: 'pricing', title: 'Pricing Framework', body: 'Rates reflect limited fleet density + seasonal spikes. Multi-day excursions often bundle minimum hours + per-diem lodging for drivers. Ask about shoulder season and midweek strategy to optimize total cost.' },
    { id: 'compliance', title: 'Safety & Compliance', body: 'DOT compliance, driver hours of service, winter operations protocols, and pre-trip inspections are strictly enforced. We surface certificates upon request and maintain transparent audit logs.' },
    { id: 'booking-tips', title: 'Booking Tips', bullets: [ 'Share contingency priorities (schedule vs budget) so we tune buffers.', 'Provide passenger manifest if remote pickup coordination is needed.', 'Clarify gear (skis, photo rigs, expedition cases) for cargo planning.', 'Lock lodging for multi-day charters before finalizing route sequencing.' ] },
  ],
  reviews: [
    { name: 'Kara M.', city: 'Anchorage', rating: 5, text: 'Flawless winter shuttle—driver pre‑heated the bus and tracked our delayed flight.' },
    { name: 'Luis R.', city: 'Fairbanks', rating: 5, text: 'Aurora charter pivoted mid‑route to clearer skies. Worth every mile.' },
    { name: 'Janelle S.', city: 'Juneau', rating: 5, text: 'Cruise pier transfer with glacier stop—logistics dialed in, zero stress.' },
    { name: 'Owen P.', city: 'Wasilla', rating: 4, text: 'Great bus & driver. Added photo stops seamlessly—only wish we booked longer.' },
    { name: 'Brianna T.', city: 'Anchorage', rating: 5, text: 'Wedding party shuttle ran early, clean interior, zero hiccups even with snow flurries.' },
    { name: 'Sean D.', city: 'Kenai', rating: 5, text: 'Fishing charter transfer—driver waited while we packed frozen catch. Professional & patient.' },
    { name: 'Henry L.', city: 'Sitka', rating: 5, text: 'Smooth cruise pier pickup. Driver added a quick overlook stop for photos—big win.' },
    { name: 'Alejandra V.', city: 'Palmer', rating: 5, text: 'Northern lights run extended an hour to catch a break in clouds. Driver knew the backroads.' },
    { name: 'Tom W.', city: 'Homer', rating: 4, text: 'Long mileage day went exactly to plan. Only minor: wished for USB ports on every row.' },
    { name: 'Gina K.', city: 'Kodiak', rating: 5, text: 'Logistics for group + gear were perfectly staged. Clear comms the whole time.' },
  ],
  polls: [
    { question: 'Favorite Alaska charter season?', options: ['Summer','Winter','Shoulder'] },
    { question: 'Top trip focus?', options: ['Scenic','Corporate','Adventure'] },
    { question: 'Most important planning buffer?', options: ['Weather','Distance','Wildlife','Daylight'] },
    { question: 'Preferred northern lights start time?', options: ['9 PM','10 PM','11 PM','After Midnight'] },
    { question: 'Add a glacier stop on cruise transfer?', options: ['Always','Sometimes','Skip'] },
  ]
};

// Helper to synthesize generic content for other states
function buildGenericContent(entry: LocationEntry): StateContent {
  const { state, cities } = entry;
  const topCities = cities.slice(0, 5);
  const hubs = topCities.join(', ');
  const firstCity = topCities[0] || state;
  const seasonalNote = 'Peak Saturdays and major event dates book out 60–90 days ahead. Midweek & shoulder season (late winter, early fall) often reduce rates 8–15%.';
  const logisticsNote = 'Add 10–15 minute buffers per planned stop (photos, staggered pickups) to avoid overtime rounding. Larger metro traffic windows may require longer lead time.';
  const sections: StateSection[] = [
    { id: 'overview', title: `${state} Charter Service Overview`, body: `${state} group transportation covers corporate moves, events, and leisure trips across hubs like ${hubs || state}. We coordinate clean late‑model vehicles, professional drivers, and right‑sized routing for your itinerary.` },
    { id: 'popular-trips', title: 'Popular Trip Types', bullets: [ `Airport transfers to / from ${firstCity} & surrounding metros`, 'Corporate shuttles & event circulators', 'Wedding guest & rehearsal transport', 'Concerts, games & festival shuttles', 'Winery / brewery / city tours', 'Prom & formal event travel' ] },
    { id: 'seasonality', title: 'Seasonality & Demand', body: seasonalNote },
    { id: 'pricing', title: 'Pricing Framework', body: 'Rates usually combine hourly minimums (varies by vehicle class) + mileage or flat event packages. Longer continuous blocks lower effective hourly. Ask about off‑peak incentives.' },
    { id: 'logistics', title: 'Logistics & Timing', body: logisticsNote },
    { id: 'safety', title: 'Safety & Compliance', body: 'Fully insured, DOT compliant fleet with preventative maintenance cycles, driver background screening, hours‑of‑service adherence, and pre‑trip inspections logged.' },
    { id: 'booking-tips', title: 'Booking Tips', bullets: [ 'Share passenger count + comfort preference (always size up if near max).', 'Provide earliest pickup + hard arrival deadlines to anchor buffers.', 'Bundle related legs (hotel shuttle + evening outing) for better pricing.', 'Clarify cargo (luggage, instruments, equipment) for capacity planning.' ] },
  ];
  const reviews: StateReview[] = (cities.length ? cities.slice(0, 6) : [state]).map((c, i) => ({
    name: ['Alex','Jordan','Taylor','Morgan','Riley','Casey','Drew','Hayden'][i % 8] + ' ' + ['P.','R.','L.','K.','S.','M.'][i % 6],
    city: c,
    rating: 5 - (i===4 ? 1:0),
    text: i===0 ? `Seamless charter coordination for our event in ${c}. Driver was punctual and vehicle spotless.` : i===1 ? `Great communication—adjusted pickup in ${c} when our schedule shifted. Would book again.` : i===2 ? `Pricing was transparent and fair for a multi‑stop itinerary around ${c}.` : i===3 ? `Vehicle comfort exceeded expectations. Smooth ride between ${c} stops.` : i===4 ? `Only minor: wished we had booked an extra hour for more flexibility in ${c}. Still excellent.` : `Everything ran on time—booking process for ${c} was fast and stress‑free.`
  }));
  const polls: StatePoll[] = [
    { question: `Primary reason for booking in ${state}?`, options: ['Event','Corporate','Airport','Tour','Other'] },
    { question: `Preferred vehicle size in ${state}?`, options: ['Sedan','Sprinter','Mini Coach','Full Coach'] },
    { question: `Biggest concern planning transport in ${state}?`, options: ['Timing','Cost','Capacity','Weather','Routing'] },
    { question: `How early do you book in ${state}?`, options: ['< 1 week','1–4 weeks','1–3 months','3+ months'] },
  ];
  return { sections, reviews, polls };
}

// Build map including Alaska custom, others generic
const contentMap: Record<string, StateContent> = {};
for (const entry of locations) {
  const slug = slugifyState(entry.state);
  if (slug === 'alaska') contentMap[slug] = alaskaContent; else contentMap[slug] = buildGenericContent(entry);
}

export function getStateContent(stateSlug: string): StateContent | undefined {
  return contentMap[stateSlug];
}
