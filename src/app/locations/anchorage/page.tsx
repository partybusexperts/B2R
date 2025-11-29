import Image from 'next/image';
import Link from 'next/link';

import GlobalReviewStripServer from '@/components/reviews/GlobalReviewStripServer';
import HomePollsSection from '@/components/polls/HomePollsSection';
import ToolsSection from '@/components/home/ToolsSection';
import HomeFaqSection from '@/components/home/HomeFaqSection';

const EVENT_IMAGE_MAP: Record<string, string> = {
  weddings: 'https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/Events1/weddings.jpg',
  brewery: 'https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/Events1/birthday%20parties.jpg',
  airport: 'https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/Events1/airport%20shuttle.jpg',
  corporate: 'https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/Events1/corporate%20parties.jpg',
  aurora: 'https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/Events1/prom.jpg',
  nightlife: 'https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/Events1/bachelor%20parties.jpg',
};

const EVENT_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=1200&q=80';

const HERO_IMAGES = [
  {
    src: EVENT_IMAGE_MAP.weddings,
    alt: 'Wedding party bus staged against Chugach mountain backdrops',
  },
  {
    src: EVENT_IMAGE_MAP.brewery,
    alt: 'Crew loading into a warm coach between Anchorage brewery stops',
  },
  {
    src: EVENT_IMAGE_MAP.aurora,
    alt: 'Northern lights viewed from inside a party bus',
  },
  {
    src: EVENT_IMAGE_MAP.airport,
    alt: 'Cruise travelers hopping onto a private transfer at Ted Stevens airport',
  },
  {
    src: EVENT_IMAGE_MAP.nightlife,
    alt: 'Birthday squad lighting up the interior LEDs on an Anchorage night run',
  },
];

const API_IDEAS = [
  {
    title: 'Aurora & geomagnetic alerts',
    provider: 'NOAA SWPC Aurora Dashboard',
    desc: 'Surface KP index + predicted bursts so planners know when to pitch night-sky detours.',
  },
  {
    title: 'Tide & mudflat advisories',
    provider: 'NOAA Tides & Currents',
    desc: 'Warn riders when Turnagain Arm or Knik Arm tides create delays or photo windows.',
  },
  {
    title: 'Trailhead & park congestion',
    provider: 'Recreation.gov / NPS data',
    desc: 'Live permit counts for Flattop, Eagle River Nature Center, etc., to avoid overfull lots.',
  },
  {
    title: 'Flight & cruise docking feeds',
    provider: 'FlightAware + Port of Alaska',
    desc: 'Sync pickup windows with actual landing / docking times for seamless transfers.',
  },
];

function getEventImage(keyOrTitle: string) {
  const normalized = keyOrTitle.toLowerCase();
  const direct = EVENT_IMAGE_MAP[normalized];
  if (direct) return direct;
  if (normalized.includes('brewery') || normalized.includes('birthday')) return EVENT_IMAGE_MAP.brewery;
  if (normalized.includes('airport') || normalized.includes('cruise')) return EVENT_IMAGE_MAP.airport;
  if (normalized.includes('corporate') || normalized.includes('offsite') || normalized.includes('military')) return EVENT_IMAGE_MAP.corporate;
  if (normalized.includes('aurora') || normalized.includes('night')) return EVENT_IMAGE_MAP.aurora;
  if (normalized.includes('downtown') || normalized.includes('nightlife')) return EVENT_IMAGE_MAP.nightlife;
  if (normalized.includes('wedding')) return EVENT_IMAGE_MAP.weddings;
  return EVENT_IMAGE_FALLBACK;
}

const quickStats = [
  { label: 'Metro population', value: '≈ 400,000+' },
  { label: 'Best seasons for party buses', value: 'May–September • December holidays' },
  { label: 'Typical trip length', value: '4–6 hours' },
  { label: 'Vibe', value: 'Mountains, breweries, big skies, laid-back locals' },
];

const eventUseCases = [
  {
    title: 'Weddings with mountain backdrops',
    blurb:
      'Move the whole wedding party between hotel, ceremony, photos, and reception without worrying about icy parking lots or half the group getting lost.',
    imageKey: 'weddings',
    stat: 'Avg. 6-hour blocks',
  },
  {
    title: 'Brewery & distillery crawls',
    blurb:
      'Anchorage’s craft beer scene is massive for a city its size. A party bus keeps your crew warm between stops and your designated driver handled.',
    imageKey: 'brewery',
    stat: '4–5 stops / night',
  },
  {
    title: 'Cruise & airport transfers',
    blurb:
      'Flying into Ted Stevens or heading to Whittier / Seward? Use a bus to turn “transfer day” into the first chapter of the trip instead of dead time.',
    imageKey: 'airport',
    stat: 'Luggage-ready bays',
  },
  {
    title: 'Corporate offsites & military groups',
    blurb:
      'Shuttle teams to trailheads, bases, or meeting venues as one tight unit. No lost rentals, no guessing who has the keys.',
    imageKey: 'corporate',
    stat: 'Secure manifests',
  },
  {
    title: 'Northern lights & night-sky runs',
    blurb:
      'When the aurora forecast pops, a warm bus with crystal-clear windows beats freezing on the side of the highway in separate cars.',
    imageKey: 'aurora',
    stat: 'KP 4+ alerts',
  },
  {
    title: 'Birthday blowouts & nights downtown',
    blurb:
      'Downtown, Midtown, and South Anchorage are spread out. Keep your birthday squad bouncing between spots while the music never stops.',
    imageKey: 'nightlife',
    stat: 'Hands-free hops',
  },
];

const seasonalGuide = [
  {
    season: 'Winter (Nov–Mar)',
    notes:
      'Long nights, snow, and real Alaska vibes. Roads can be slick, so a professional driver + coach is a huge upgrade over personal cars. Perfect for holiday parties, corporate events, and aurora runs.',
    tips: [
      'Book early for Fridays in December – holiday party season fills up fast.',
      'Allow extra time for loading and road conditions; 4 hours is usually the minimum.',
    ],
  },
  {
    season: 'Spring (Apr–May)',
    notes:
      'Breakup season: snow melts, days get longer, and everyone wants to get out of the house. Great time for brewery crawls, senior trips, and adventure shuttles.',
    tips: [
      'Expect wet parking lots and slush – remind guests to wear waterproof shoes.',
      'Sunsets can be late, so sunset photo runs on the bus are prime.',
    ],
  },
  {
    season: 'Summer (Jun–Aug)',
    notes:
      'Peak tourist + wedding season with late-night daylight. Ideal for wedding parties, cruise transfers, and all-day sightseeing.',
    tips: [
      'Traffic to popular viewpoints and trailheads can back up – pad your itinerary.',
      'Book bigger vehicles earlier in the year; they vanish first.',
    ],
  },
  {
    season: 'Fall (Sep–Oct)',
    notes:
      'Crisp weather, foliage, and a calmer city after peak tourism. Locals celebrate with birthdays, company parties, and weekend getaways.',
    tips: [
      'Weather swings from sunny to snow flurries – flexible itineraries win.',
      'Great time for discounted weekday rates on larger buses.',
    ],
  },
];

const triviaFacts = [
  'Anchorage sits less than 10 miles from Chugach State Park, one of the largest state parks in the United States.',
  'On peak summer days, Anchorage can see nearly 19 hours of usable daylight – perfect for marathon party-bus days.',
  'Despite the northern location, coastal influence keeps winter temps milder than many Lower 48 cities of similar latitude.',
  'Moose sightings inside city limits are normal; many locals have a “party bus moose story.”',
  'Anchorage is a hub for flightseeing, glacier cruises, and rail trips – a party bus is the missing ground-transport link between them.',
  'Roughly 80% of Alaska’s goods pass through the Port of Alaska, which is why weekday traffic waves often align with barge schedules.',
  'There are more than 130 miles of paved multi-use trails crisscrossing Anchorage; shuttle bikes on the bus and hop on/off all day.',
  'Within 50 miles you can access over 60 glaciers, so buses often double as gear lockers for glacier hikes or heli tours.',
  'Local sunrise can swing from 4:30 AM in June to nearly 10:00 AM in December, making interior lighting plans a legit checklist item.',
];

const neighborhoods = [
  {
    name: 'Downtown Anchorage',
    vibe: 'Bars, restaurants, hotels, and walkable blocks.',
    notes:
      'Most bar-hop and corporate itineraries anchor here. Narrow streets and tight winter parking make a bus with a pro driver a lifesaver.',
  },
  {
    name: 'Midtown',
    vibe: 'Hotels, offices, and hidden-gem eateries.',
    notes:
      'Common pickup zone for work events and visiting teams. Great starting point before heading downtown or out to Turnagain Arm.',
  },
  {
    name: 'South Anchorage',
    vibe: 'Suburban homes, trailheads, and family-heavy events.',
    notes:
      'Lots of weddings, birthday parties, and church events start here before heading into town or out toward Girdwood.',
  },
  {
    name: 'Eagle River & Chugiak',
    vibe: 'Smaller-town feel north of Anchorage.',
    notes:
      'Perfect for group shuttles into the city or to JBER events. A bus beats coordinating 10+ cars down the Glenn Highway.',
  },
];

const sampleTimeline = [
  { time: '5:00 PM', title: 'Pickup & first cheers', desc: 'Bus rolls up in South Anchorage, playlists synced, drinks in the coolers, everyone steps into the warm cabin.' },
  { time: '5:30 PM', title: 'Turnagain photo stop', desc: 'Quick pullout stop along Turnagain Arm for golden-hour photos with mountains and water in the background.' },
  { time: '6:30 PM', title: 'Dinner reservation', desc: 'Drop at a downtown or Midtown restaurant while the bus loops for parking and stands by for after-dinner pickup.' },
  { time: '8:30 PM', title: 'Brewery / bar crawl', desc: 'Hop between a few favorite spots without jackets piled in cars or arguing over parking.' },
  { time: '11:30 PM', title: 'Aurora or city-lights run', desc: 'If the sky cooperates, head just outside town to chase northern lights. If not, enjoy city-light views and onboard photos.' },
  { time: '1:00 AM', title: 'Home safe, together', desc: 'Driver drops everyone back at pre-planned stops. No one is stranded, and no one has to skip the last round to drive.' },
];

const faqItems = [
  {
    q: 'How far can we go from Anchorage on a party bus?',
    a: 'Most companies comfortably handle trips in and around Anchorage, Eagle River, Chugiak, and Girdwood. Longer runs to Seward, Whittier, or Talkeetna are often possible with enough hours booked and driver rest time built in – just mention your full plan when you request a quote.',
  },
  {
    q: 'Is winter driving safe on a bus?',
    a: 'Reputable operators in Anchorage run studded or winter tires and drivers who are used to snow and ice. A well-maintained bus with a professional behind the wheel is almost always safer than a caravan of guests driving separately in mixed-condition personal vehicles.',
  },
  {
    q: 'Can we drink on the bus in Anchorage?',
    a: 'Many adult groups do bring drinks on board, but every company has its own alcohol policies, glass-vs-cans rules, and ID requirements. When you request a quote, ask specifically about your group, age range, and plan so the operator can confirm what is allowed.',
  },
  {
    q: 'What size bus should I book for Anchorage?',
    a: 'For comfort, count your confirmed guests and add 2–3 extra seats for coats, bags, and last-minute plus-ones. A “10-passenger” limo, for example, is perfect for 6–9 adults who want extra elbow room in winter clothing.',
  },
  {
    q: 'How early should I book for summer or December?',
    a: 'For prime dates (June–August weddings, December Fridays, and holidays), aim for 2–4 months in advance if you’re picky about vehicle style. Last-minute bookings do happen, but your choices will be more limited.',
  },
];


export default function AnchorageLocationPage() {
  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-50">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-600/20 blur-[160px]" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-blue-900/30 blur-[180px]" />
        <div className="absolute inset-x-0 top-1/2 h-[280px] bg-gradient-to-b from-transparent via-[#041032]/40 to-[#020617]" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-10 lg:px-6">
        <header className="relative mb-12 overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#030915] via-[#050d1f] to-[#010409] p-6 shadow-[0_35px_120px_rgba(1,5,16,0.85)] ring-1 ring-sky-500/15">
          <div className="pointer-events-none" aria-hidden>
            <div className="absolute -left-10 top-6 h-40 w-40 rounded-full bg-emerald-500/30 blur-3xl" />
            <div className="absolute -right-16 bottom-0 h-60 w-60 rounded-full bg-sky-500/40 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_55%)]" />
          </div>
          <div className="relative space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-emerald-300">
                  <span className="h-1 w-1 rounded-full bg-emerald-300" /> Anchorage, Alaska
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Party Buses & Group Transportation in Anchorage</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-300">
                  Anchorage is a weird, wonderful mix of city streets, mountains, ocean, and military bases. Distances are bigger than they look on the map, winter nights are long, and parking is a full-contact sport. A party bus turns that chaos into the best part of the night.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs lg:w-[260px]">
                {quickStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-sky-500/30 bg-gradient-to-br from-white/10 via-slate-900/40 to-slate-900/80 px-3 py-3 shadow-lg shadow-blue-900/40">
                    <div className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/60">{stat.label}</div>
                    <div className="mt-1 text-slate-50">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-[2fr,1.4fr]">
              <div className="relative overflow-hidden rounded-3xl border border-white/10">
                <div className="relative aspect-[16/9]">
                  <Image src={HERO_IMAGES[0].src} alt={HERO_IMAGES[0].alt} fill className="object-cover" sizes="(min-width: 1024px) 60vw, 100vw" />
                </div>
                <p className="px-4 pb-3 pt-2 text-[0.7rem] text-white/70">Downtown Anchorage against the Chugach Mountains – the starting point for a lot of legendary nights out.</p>
              </div>
              <div className="grid grid-rows-2 gap-3">
                {HERO_IMAGES.slice(1, 3).map((img) => (
                  <div key={img.alt} className="relative overflow-hidden rounded-3xl border border-white/10">
                    <div className="relative h-full min-h-[120px]">
                      <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(min-width: 1024px) 40vw, 100vw" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        <section className="mb-10 grid gap-8 md:grid-cols-[1.4fr,1fr]">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Anchorage at a glance</h2>
            <p className="mt-3 text-sm text-slate-300">
              Anchorage is Alaska’s biggest city and its main transportation hub. In one direction you’ve got the Chugach range, in another the Cook Inlet, and in between you have a surprisingly dense network of bars, breweries, hotels, bases, and neighborhoods stretched along the Glenn and Seward highways.
            </p>
            <p className="mt-3 text-sm text-slate-300">
              In summer you’re dealing with cruise schedules, nearly constant daylight, and visitors trying to squeeze an entire bucket list into three days. In winter you’re juggling icy roads, early darkness, and locals who still want to celebrate everything from holiday parties to big birthdays. Either way, moving a group around town isn’t simple – which is exactly where a party bus shines.
            </p>
            <p className="mt-3 text-sm text-slate-300">
              This page is your deep-dive playbook for using party buses in Anchorage: what works, what to avoid, when to book, and how to turn “getting around” into an actual highlight of the trip.
            </p>
          </div>
          <div className="space-y-3 rounded-3xl border border-blue-700/40 bg-[#071430] p-4 text-sm shadow-[0_20px_60px_rgba(2,6,23,0.65)]">
            <h3 className="text-sm font-semibold text-emerald-300">Why groups love buses here</h3>
            <ul className="mt-2 space-y-2 text-xs text-slate-300">
              <li>• Long distances between neighborhoods, trailheads, bases, and venues.</li>
              <li>• Winter conditions where a pro driver beats 10 nervous drivers in separate cars.</li>
              <li>• Big gear – coats, boots, bags, coolers, gifts – that needs extra storage.</li>
              <li>• Out-of-towners who don’t know local roads, parking, or drive-times.</li>
              <li>• Late-night returns from downtown, breweries, or the airport.</li>
            </ul>
          </div>
        </section>

        <section className="mb-10 space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Why party buses just work in Anchorage</h2>
            <p className="max-w-md text-xs text-slate-400">You’re not just renting a vehicle – you’re outsourcing weather, parking, and group chaos to someone who does this every day.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-emerald-400/40 bg-gradient-to-br from-emerald-500/20 via-emerald-500/5 to-[#051137] p-4 text-sm">
              <h3 className="text-sm font-semibold text-emerald-300">Weather buffer</h3>
              <p className="mt-2 text-slate-100">Anchorage loves to switch from sunshine to sideways snow in an hour. A party bus keeps your group warm, dry, and together while the driver worries about the roads.</p>
            </div>
            <div className="rounded-3xl border border-sky-500/40 bg-gradient-to-br from-sky-500/25 via-slate-900/30 to-[#030b24] p-4 text-sm">
              <h3 className="text-sm font-semibold text-sky-300">Everything is “a little far”</h3>
              <p className="mt-2 text-slate-100">Downtown to Girdwood, Eagle River to Midtown, hotel to base – nothing is truly walkable, and rideshares can get thin at peak times. One bus solves that entire puzzle.</p>
            </div>
            <div className="rounded-3xl border border-blue-400/40 bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-[#050f2c] p-4 text-sm">
              <h3 className="text-sm font-semibold text-amber-300">Make the drive part of the event</h3>
              <p className="mt-2 text-slate-100">Views here are insane. Instead of wasting them in silent rental cars, put everyone together, queue the playlist, and treat every highway stretch like part of the show.</p>
            </div>
          </div>
        </section>

        <section className="mb-10 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl font-semibold tracking-tight">Anchorage events that love party buses</h2>
            <Link href="/events?city=anchorage-ak" className="text-xs font-medium text-slate-300 underline-offset-2 hover:text-emerald-300 hover:underline">See all Anchorage event ideas →</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {eventUseCases.map((evt, idx) => (
              <article key={evt.title} className="group relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/70 text-sm shadow-[0_25px_60px_rgba(2,6,23,0.45)]">
                <div className="absolute inset-0" aria-hidden>
                  <Image
                    src={getEventImage(evt.imageKey ?? evt.title)}
                    alt={evt.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                </div>
                <div className="relative flex h-full flex-col justify-between p-5">
                  <div className="flex items-center justify-between text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/70">
                    <span>{String(idx + 1).padStart(2, '0')}</span>
                    <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[0.6rem] text-white/80">{evt.stat}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">{evt.title}</h3>
                    <p className="mt-2 text-xs text-white/80">{evt.blurb}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-10 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Sample Anchorage night-out route (realistic timeline)</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-[0.8fr,1.6fr]">
            <div className="rounded-3xl border border-blue-700/40 bg-gradient-to-br from-[#07173c] via-[#040f29] to-[#030816] p-4 text-sm">
              <p className="text-xs text-slate-300">Every group is different, but this is a good starting point for a 6-hour booking. Use this as a template when you talk with your planner or sales rep.</p>
            </div>
            <ol className="space-y-3 border-l border-dashed border-blue-500/40 pl-4 text-sm">
              {sampleTimeline.map((step) => (
                <li key={step.time} className="relative">
                  <div className="absolute -left-[0.7rem] top-1 h-3 w-3 rounded-full bg-sky-400 shadow-[0_0_0_6px_rgba(56,189,248,0.35)]" />
                  <div className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-400">{step.time}</div>
                  <div className="font-semibold text-slate-50">{step.title}</div>
                  <p className="text-xs text-slate-300">{step.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mb-10 grid gap-8 md:grid-cols-[1.3fr,1.3fr]">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Anchorage neighborhood vibes</h2>
            <div className="mt-3 space-y-3">
              {neighborhoods.map((n) => (
                <article key={n.name} className="rounded-3xl border border-blue-900/40 bg-[#060f28] p-4 text-sm">
                  <h3 className="text-sm font-semibold text-slate-50">{n.name}</h3>
                  <p className="mt-1 text-xs text-emerald-300">{n.vibe}</p>
                  <p className="mt-1 text-xs text-slate-300">{n.notes}</p>
                </article>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Seasonal guide for buses</h2>
            <div className="mt-3 space-y-3">
              {seasonalGuide.map((s) => (
                <article key={s.season} className="rounded-3xl border border-indigo-900/40 bg-[#070f2a] p-4 text-sm">
                  <h3 className="text-sm font-semibold text-slate-50">{s.season}</h3>
                  <p className="mt-1 text-xs text-slate-300">{s.notes}</p>
                  <ul className="mt-2 space-y-1 text-[0.7rem] text-slate-400">
                    {s.tips.map((tip) => (
                      <li key={tip}>• {tip}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-10 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Anchorage party-bus trivia & fun facts</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <ul className="space-y-2 rounded-3xl border border-blue-900/40 bg-[#06112c] p-4 text-sm">
              {triviaFacts.map((fact) => (
                <li key={fact} className="text-xs text-slate-300">• {fact}</li>
              ))}
            </ul>
            <div className="space-y-3 rounded-3xl border border-indigo-900/40 bg-[#050c22] p-4 text-sm">
              <h3 className="text-sm font-semibold text-slate-50">Ideas to steal for your itinerary</h3>
              <ul className="mt-2 space-y-2 text-xs text-slate-300">
                <li>• Combine a brewery crawl with a short photo run along Turnagain Arm.</li>
                <li>• Use the bus as a warm base camp for winter outdoor events or festivals.</li>
                <li>• Turn cruise transfer day into a sightseeing loop instead of a straight drive.</li>
                <li>• Schedule a “quiet hour” on the way back for sleepy guests and soft playlists.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12 space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Live Anchorage conditions your ops team actually needs</h2>
            <p className="text-xs text-slate-400">Weather, traffic, tides, aurora alerts – feed it all into one planning pane.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-sky-500/30 bg-sky-500/5 p-4 text-sm">
              <h3 className="text-sm font-semibold text-sky-300">Current weather</h3>
              <p className="mt-2 text-xs text-slate-300">
                Connect OpenWeatherMap, Tomorrow.io, or NOAA. Use the <code className="rounded bg-slate-900 px-1 py-[1px] text-[0.7rem]">city=Anchorage,US</code> query + elevation adjustments for Glen Alps pickups.
              </p>
              <p className="mt-3 text-xs text-white/80">Show feels-like temp, wind, precipitation radar tile, and sunrise/sunset windows for photo planning.</p>
            </div>
            <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
              <h3 className="text-sm font-semibold text-amber-300">Traffic & drive-time</h3>
              <p className="mt-2 text-xs text-slate-300">Layer Google Traffic, Waze, or INRIX feeds with preset routes: Downtown → Girdwood, Midtown → JBER, Airport → Hotel.</p>
              <p className="mt-3 text-xs text-white/80">Flag “icy,” “accident,” or “slow ferry loading” statuses with colored chips so sales reps can warn riders instantly.</p>
            </div>
          </div>
          <div className="rounded-3xl border border-sky-500/20 bg-gradient-to-br from-[#061739] via-[#04122b] to-[#030a1a] p-5 text-sm shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <h3 className="text-base font-semibold text-white">Layer in more live feeds</h3>
            <p className="mt-1 text-xs text-white/70">Anything that changes your route, timing, or sales pitch deserves an API tile.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {API_IDEAS.map((idea) => (
                <article key={idea.title} className="rounded-2xl border border-white/15 bg-slate-900/50 p-4">
                  <p className="text-[0.65rem] uppercase tracking-[0.25em] text-white/50">{idea.provider}</p>
                  <h4 className="mt-2 text-sm font-semibold text-white">{idea.title}</h4>
                  <p className="mt-2 text-xs text-white/70">{idea.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-12 space-y-6">
          <div className="rounded-3xl border border-blue-400/30 bg-gradient-to-br from-[#05112c] via-[#050d1f] to-[#030714] p-6 text-sm shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
            <p className="text-[0.7rem] uppercase tracking-[0.25em] text-white/60">Supabase-powered social proof</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">Reviews, polls, tools, and FAQs – same modules as our homepage, now anchored to Anchorage context.</h2>
            <p className="mt-3 text-white/70">The components below already hydrate from Supabase. Swap the queries to filter by <code className="rounded bg-slate-900 px-1 py-[1px] text-[0.7rem]">city=anchorage-ak</code> and you’ll have live-local data without rebuilding UI.</p>
          </div>
          <div className="-mx-4 space-y-10 lg:-mx-6">
            <GlobalReviewStripServer />
            <HomePollsSection />
            <ToolsSection />
            <HomeFaqSection />
          </div>
        </section>

        <section className="mb-12 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl font-semibold tracking-tight">Anchorage-only FAQ quick hits</h2>
            <Link href="/faq?city=anchorage-ak" className="text-xs font-medium text-slate-300 underline-offset-2 hover:text-slate-50 hover:underline">View full FAQ →</Link>
          </div>
          <div className="divide-y divide-blue-900/40 rounded-3xl border border-blue-900/40 bg-[#050f25]">
            {faqItems.map((f) => (
              <details key={f.q} className="group px-4 py-3 text-sm open:bg-slate-900/90">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-slate-100">
                  <span>{f.q}</span>
                  <span className="text-xs text-slate-400 group-open:hidden">+</span>
                  <span className="hidden text-xs text-slate-400 group-open:inline">–</span>
                </summary>
                <p className="mt-2 text-xs text-slate-300">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/15 via-[#042026] to-[#04122b] p-6 text-center shadow-[0_25px_70px_rgba(5,14,34,0.75)]">
          <h2 className="text-xl font-semibold tracking-tight text-emerald-200">Ready to plan your Anchorage party bus?</h2>
          <p className="mt-2 text-sm text-emerald-100">Tell us your date, headcount, and rough route. We’ll match you with vehicles that can actually handle Anchorage roads and winter, not just look pretty in photos.</p>
          <div className="mt-4 flex justify-center gap-3 text-sm">
            <Link href="/quote?city=anchorage-ak" className="rounded-full bg-emerald-400 px-6 py-2 font-semibold text-slate-950 shadow-lg shadow-emerald-400/40 hover:bg-emerald-300">Get a fast quote</Link>
            <Link href="/fleet?city=anchorage-ak" className="rounded-full border border-emerald-300/60 px-6 py-2 font-semibold text-emerald-200 hover:bg-emerald-300/10">See Anchorage vehicles</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
