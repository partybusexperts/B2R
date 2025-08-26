"use client";

import React, { useMemo } from "react";
import PageLayout from "../../../components/PageLayout";
import Section from "../../../components/Section";
import Link from "next/link";
import { notFound } from "next/navigation";

// Reuse image pools (simple small sets)
const partyBusImages = [
  "/images/18 Passenger White Party Bus Exterior.png",
  "/images/18 Passenger White Party Bus Interior.png",
  "/images/36 Passenger Party Bus Exterior 4.png",
];
const limoImages = [
  "/images/10 Passenger Lincoln Stretch Limo Interior.png",
  "/images/18 Passenger Hummer Limo Interior.png",
  "/images/18 Passenger Cadillac Escalade Limo Exterior.png",
];
const coachBusImages = [
  "/images/Bus-1.png",
  "/images/Bus-2.png",
  "/images/Bus-3.png",
];

interface PostContent {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  paragraphs: string[]; // ~1000 words
  related: string[]; // slugs
}

// Utility to compose paragraphs (kept inline for clarity)
const P = (raw: string) => raw.replace(/\s+/g, " ").trim();

// Base posts metadata copied from listing titles; each has ~10 paragraphs @ ~100-115 words
// NOTE: party-bus-pricing-101 already has its own dedicated static page; we omit here to avoid duplication.
const POSTS: PostContent[] = [
  {
    slug: "wedding-transportation-guide-limo-vs-party-bus-vs-shuttle",
    title: "Wedding Transportation Guide: Limo vs. Party Bus vs. Shuttle",
    excerpt: "Capacity, style, timeline, and budget—see which wedding ride is best for your ceremony, photos, and reception exit.",
    date: "2025-07-28",
    author: "Wedding Planner Pro",
    related: [
      "how-early-should-you-book-lead-time-by-season-vehicle",
      "add-ons-that-are-actually-worth-it",
      "how-to-read-a-quote-hourly-vs-flat-rate-vs-fuel-service-fees",
      "photogenic-rides-interior-lighting-photo-stop-ideas",
      "split-payments-group-budgeting-tools",
      "city-traffic-101-building-realistic-timelines"
    ],
    paragraphs: [
      P("Choosing the right mix of wedding transportation is part logistics puzzle, part storytelling device. The vehicles you select support schedule integrity—getting wedding party, family, and guests where they need to be—but they also extend the emotional arc of the day. A classic stretch limo signals heritage elegance. A party bus injects communal hype between venues. A shuttle program keeps guest energy calm and on time. Instead of asking ‘which single option is best,’ map each movement block (prep → ceremony, ceremony → photos, photos → reception, late‑night departures) and assign the mode that best balances aesthetics, space, and controllability."),
      P("Start with passenger groupings. The wedding party often travels together for cohesion and photo sequencing. Immediate family may need an earlier arrival for portraits. Out‑of‑town guests need clarity more than spectacle. List each group, headcount, earliest departure window, and required arrival buffer (usually 15–25 minutes for staging). This grid reveals whether one larger vehicle can handle sequential loops or if parallel assets avoid timeline compression. Many couples over‑charter because they picture all 18 people riding every leg together when reality fragments after the ceremony."),
      P("Evaluate style versus seat utilization. A 20 passenger party bus that averages only 9 riders per leg wastes dollars and may feel emptier than intended, diluting vibe. Conversely, cramming full capacity eliminates personal space and increases dress wrinkling risk. Ideal target is 70–80% occupancy for formal attire comfort. For a mixed group in gowns + suits, perimeter seating of a party bus protects fabrics better than dense forward‑facing shuttle rows. If dresses have long trains, ensure low step height or request a portable step to prevent snagging and reduce loading time."),
      P("Venue distance and parking influence choice more than people realize. Urban churches without staging zones make long limousines awkward to maneuver; a mid‑size shuttle or sprinter may stage cleaner and keep curb space clear. Rural barn receptions down gravel roads reward higher clearance vehicles to avoid slow crawling that eats buffer minutes. Ask each venue for their ‘transportation best practices’—they’ll tell you where vehicles idle, turn, and load. Provide those notes to your operator early so they assign appropriate vehicle lengths and drivers familiar with similar maneuvers."),
      P("Cost structure differs by class. Limos often bill with lower hourly minimums but can’t flex to move large guest batches efficiently. Party buses carry more but require higher hourly commitments on peak Saturdays. Shuttles (cutaways or mini coaches) can execute continuous loops, smoothing guest arrivals, yet may feel utilitarian for wedding party portraits. Hybrid strategy: limo or luxury sprinter for party + photo sequences; mini shuttle performing two timed loops for general guests; late‑night consolidated 1:00 AM and 2:15 AM departures via the shuttle to hotels. This reduces idle dwell while preserving style moments."),
      P("Timeline engineering is the hidden savings lever. Build a transport worksheet: each leg with planned board time, wheels‑rolling time, travel duration (pad by 20% for realism), arrival, unload, and photo buffer. Then overlay vehicle assignments. Conflicts appear instantly when one asset is double‑booked or turnaround time is unrealistic. If one leg forces a vehicle to sit 90 minutes unused, ask whether switching sequence (e.g. taking photos earlier) collapses idle. A tight, conflict‑free grid lets you negotiate confidently: ‘Our plan uses 4.5 hours; can we book the 5‑hour minimum and add a controlled send‑off loop?’"),
      P("Guest communication reduces chaotic delays that trigger overtime penalties. Include transport instructions on the wedding website: exact pickup address pin, boarding window (‘Bus departs promptly at 3:40—arrive by 3:30’), carry‑on limits, and return trip options. Assign a ‘transport captain’ who counts heads before departure and texts coordinator if delays exceed five minutes. Drivers appreciate structured oversight and will reciprocate with proactive updates (‘Traffic on 4th Ave adding 6 minutes; adjusting departure by 10’). This calm information loop shields the couple from minute‑to‑minute stressors."),
      P("Accessibility considerations should be surfaced early, not as an event‑week scramble. Ask guests in RSVP form if they require mobility assistance. If even one wheelchair rider needs securement, confirm ADA‑equipped unit availability. Provide ramp angle specs to ensure safe boarding at sloped church curbs. For elderly guests, choose vehicles with handrails and moderate step heights. Document these accommodations inside the transport brief so substitute drivers on the day inherit the same awareness. A wedding experience is inclusive only if every rider’s comfort was engineered upfront."),
      P("Contingency planning distinguishes polished coordination. Rain splits photo groups; extreme heat shifts staging indoors; a delayed makeup session compresses pre‑ceremony buffer. Pre‑decide fallback: If ceremony starts 15 late, do we trim downtown photo loop or shorten cocktail hour shuttle loop? Written priorities help your day‑of coordinator make surgical cuts without committee indecision. Share contingency triggers with the driver lead so they can advise on real travel feasibility—no one wants to gamble with wheels rolling five minutes before vow time due to optimistic wishcasting."),
      P("Synthesis: treat wedding transportation as a modular system, not a singular glam purchase. Right‑sized assets applied to the legs where they add unique value keep budget aligned while maximizing narrative impact in photography and guest experience. Build the movement grid, validate with venues, communicate early with riders, and maintain a calm feedback channel the day of. The result is frictionless timing, zero surprise fees, and vehicles that feel intentional—supporting, never distracting from, the story you’re telling together."),
    ],
  },
  // Additional posts would follow same structure; due to space, implement a representative subset now.
  {
    slug: "airport-transfers-black-car-vs-suv-which-should-you-book",
    title: "Airport Transfers: Black Car vs. SUV—Which Should You Book?",
    excerpt: "Compare comfort, luggage space, and meet-and-greet options to choose the right vehicle for stress-free airport pickups.",
    date: "2025-07-20",
    author: "Bus2Ride Editors",
    related: [
      "airport-meet-and-greet-what-it-includes-when-worth-it",
      "how-to-read-a-quote-hourly-vs-flat-rate-vs-fuel-service-fees",
      "accessible-group-travel-ada-options-to-request",
      "city-traffic-101-building-realistic-timelines",
      "split-payments-group-budgeting-tools",
      "add-ons-that-are-actually-worth-it"
    ],
    paragraphs: [
      P("Selecting between a black sedan and a luxury SUV for airport transfers comes down to payload: people, baggage, and predictability. A black car supplies sleek curb appeal and is optimized for one to three travelers with moderate luggage. The SUV adds cubic volume for golf clubs, trade show cases, or a family cluster that would otherwise force a second vehicle. Instead of defaulting to ‘bigger must be better,’ quantify exact luggage shapes—roller bags, hard cases, garment bags—and model how they stack to avoid awkward reconfiguration under time pressure at the arrivals lane."),
      P("Meet‑and‑greet service influences stress curves for unfamiliar travelers. Sedan drivers may stage at curb with a text ping; premium SUV bookings often include inside terminal greeting with signage. Calculate the soft value of that service: Does it eliminate language confusion for an overseas executive? Prevent a nervous parent from wandering the arrivals hall? When the upside is intangible but impactful, consider bundling meet‑and‑greet only for the critical inbound traveler while standard curb pickup suffices for seasoned team members on later flights."),
      P("Weather resilience shifts calculus seasonally. In winter storm windows or heavy summer thunderstorms, SUVs provide higher ride height, all‑wheel drive options, and often superior traction management. That resiliency lowers risk of delay cascading into missed dinner reservations or meeting starts. If forecast probability crosses a threshold (say >40% precipitation on arrival hour), the marginal cost increase of the SUV may be cheaper than the opportunity cost of tardy arrival. Present this as a risk management memo to finance rather than a comfort splurge.") ,
      P("Time buffering remains the most under‑leveraged tactic. Build an arrivals matrix listing flight number, scheduled touch‑down, median taxi‑in duration for that airport, immigration/customs variance (if international), and average baggage claim wait. Subtract live ADS‑B flight tracking adjustments. Relay this structured sheet to the chauffeur company so staging can be dynamically right‑sized—neither excessively early (triggering wait fees) nor reactively late. Data maturity communicates professionalism and elicits higher service reciprocity from operators who value smooth handoffs."),
      P("Cost transparency should parse base rate, wait time policy, tolls, parking, fuel surcharge (if any), and gratuity handling. Scrutinize vague ‘processing fees’ that duplicate standard service margin. Ask if multi‑leg bundles (airport → hotel → dinner) can be quoted as a flat itinerary rather than disjoint transfers; operators sometimes reward consolidated scheduling because it stabilizes driver utilization. Compare per‑passenger effective cost to rideshare XL when evaluating internal policy justification—premium ground transport often wins when you articulate time saved and arrival quality."),
      P("Luggage strategy: If baggage count slightly exceeds sedan comfortable capacity, resist the reflex to wedge items on laps. Safety and arrival demeanor degrade. Instead, explore adding a small follow vehicle only for the overweight leg (e.g. inbound with promotional materials) while return transfer reverts to sedan after materials are distributed. Flexible staging matches asset capacity with the actual direction of logistical flow instead of locking into an over‑spec’d roundtrip."),
      P("Technology integration (live flight monitoring, push notifications, driver GPS sharing) separates commodity vendors from professional partners. During selection, request a demo screenshot or anonymized sample of the alert flow. A well‑timed ‘Driver staged – Door 4, Lower Level B’ message compresses uncertainty and reduces inbound phone calls. For corporate travel managers, archiving these messages supports SLA reporting and continuous improvement reviews each quarter. Layer operational learning over time to tune pickup windows by route and terminal idiosyncrasies."),
      P("Special scenarios: VIP privacy, child seats, pet transport, or medical equipment. Each adds configuration constraints. Verify child seat compliance (forward vs. rear facing availability) and pre‑install if possible to avoid time‑burn at curb. For pets, clarify containment (carrier vs. harness) and cleaning fee triggers. Medical equipment may require lift gate SUVs or careful weight distribution. Surface these needs in a single consolidated requirements email—scattered follow‑ups risk omission in dispatch notes on the day of service."),
      P("Environmental footprint discussions are increasing. If your company tracks Scope 3 emissions, request vehicle model year and engine type; prefer late‑model efficient engines over legacy V8s. Consider consolidating consecutive single passenger transfers into one multi‑stop SUV itinerary with explicit time ranges. This reduces total deadhead miles while preserving traveler service levels. Document the emission reduction in your travel sustainability report to convert an operational tweak into reputational capital."),
      P("Summary: Optimize airport transfer selection by quantifying luggage geometry, traveler profiles, weather risk, and service differentiation needs. Translate subjective comfort arguments into measurable business outcomes (on‑time arrival probability, reduced coordination overhead, traveler wellness). Present the decision matrix internally, choose the asset tier that minimizes total trip friction, and capture post‑transfer metrics (actual wheels down to hotel check‑in time) to refine future procurement. Precision today compounds into effortless, expectation‑aligned arrivals tomorrow."),
    ],
  },
];

const postMap: Record<string, PostContent> = Object.fromEntries(POSTS.map(p => [p.slug, p]));

export default function BlogDynamicPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = postMap[slug];
  if (!post) {
    notFound();
  }

  const related = post.related.map(r => postMap[r]).filter(Boolean).slice(0,6);

  const party = partyBusImages.slice(0,3);
  const limos = limoImages.slice(0,3);
  const coaches = coachBusImages.slice(0,3);

  return (
    <PageLayout gradientFrom="from-blue-950" gradientVia="via-blue-900" gradientTo="to-black" textColor="text-white">
      <Section className="max-w-4xl mx-auto pt-14 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold font-serif tracking-tight bg-gradient-to-r from-blue-200 via-white to-blue-300 bg-clip-text text-transparent mb-6">
          {post.title}
        </h1>
        <p className="text-blue-200 text-lg md:text-xl max-w-3xl mx-auto">{post.excerpt}</p>
        <div className="mt-4 text-sm text-blue-300/80">Updated {new Date(post.date).toLocaleDateString()}</div>
      </Section>
      <Section className="max-w-4xl mx-auto space-y-7 leading-relaxed text-blue-100 text-lg">
        {post.paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
        <div className="pt-2 text-blue-300 text-sm">Approx. {post.paragraphs.reduce((w, p) => w + p.split(/\s+/).length,0)} words • Educational guide</div>
      </Section>
      {related.length > 0 && (
        <Section className="max-w-6xl mx-auto mt-14 mb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold font-serif text-center mb-10 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">
            Read More
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {related.map(r => (
              <Link key={r.slug} href={`/blog/${r.slug}`} className="group block rounded-2xl bg-blue-950/80 border border-blue-700/30 p-6 hover:border-blue-400/60 hover:shadow-xl transition">
                <h3 className="text-lg font-bold mb-2 text-blue-100 group-hover:text-white font-serif">{r.title}</h3>
                <p className="text-sm text-blue-300 leading-relaxed mb-3">{r.excerpt}</p>
                <span className="text-blue-400 text-xs font-semibold tracking-wide group-hover:text-blue-300">READ →</span>
              </Link>
            ))}
          </div>
        </Section>
      )}
      {/* Vehicle previews (same pattern) */}
      <Section className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow leading-[1.15]">Party Buses</h2>
        <div className="relative flex items-center justify-center" style={{minHeight:'260px'}}>
          <a href="/party-buses" aria-label="View party bus fleet" className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-2xl transition shadow absolute left-[-68px] border-2 border-blue-200" style={{boxShadow:'0 2px 12px 0 rgba(30,64,175,0.10)'}}>←</a>
          <div className="grid md:grid-cols-3 gap-6 w-full">
            {party.map((img,i)=>(
              <div key={img} className="bg-white rounded-2xl shadow-xl p-4 flex flex-col items-center">
                <a href="/party-buses" className="block w-full group" aria-label="View party bus fleet">
                  <img src={img} alt="Party Bus" className="w-full h-60 object-cover rounded-2xl mb-4 group-hover:opacity-90 transition" />
                  <h4 className="text-base font-bold mb-2 text-blue-800">Party Bus {i+1}</h4>
                </a>
                <div className="flex flex-col gap-2 w-full mt-auto">
                  <a href="tel:8885352566" className="w-full bg-blue-700 text-white font-bold py-1 rounded-lg text-center text-base font-serif">888-535-2566</a>
                  <a href="/quote" className="w-full bg-green-500 text-white font-bold py-1 rounded-lg text-center text-base font-serif hover:bg-green-600">Instant Live Quote</a>
                </div>
              </div>
            ))}
          </div>
          <a href="/party-buses" aria-label="View party bus fleet" className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-2xl transition shadow absolute right-[-68px] border-2 border-blue-200" style={{boxShadow:'0 2px 12px 0 rgba(30,64,175,0.10)'}}>→</a>
        </div>
      </Section>
      <Section className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow leading-[1.15]">Limousines</h2>
        <div className="relative flex items-center justify-center" style={{minHeight:'260px'}}>
          <a href="/limousines" aria-label="View limousine fleet" className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-2xl transition shadow absolute left-[-68px] border-2 border-blue-200" style={{boxShadow:'0 2px 12px 0 rgba(30,64,175,0.10)'}}>←</a>
          <div className="grid md:grid-cols-3 gap-6 w-full">
            {limoImages.slice(0,3).map((img,i)=>(
              <div key={img} className="bg-white rounded-2xl shadow-xl p-4 flex flex-col items-center">
                <a href="/limousines" className="block w-full group" aria-label="View limousine fleet">
                  <img src={img} alt="Limo" className="w-full h-60 object-cover rounded-2xl mb-4 group-hover:opacity-90 transition" />
                  <h4 className="text-base font-bold mb-2 text-blue-800">Limo {i+1}</h4>
                </a>
                <div className="flex flex-col gap-2 w-full mt-auto">
                  <a href="tel:8885352566" className="w-full bg-blue-700 text-white font-bold py-1 rounded-lg text-center text-base font-serif">888-535-2566</a>
                  <a href="/quote" className="w-full bg-green-500 text-white font-bold py-1 rounded-lg text-center text-base font-serif hover:bg-green-600">Instant Live Quote</a>
                </div>
              </div>
            ))}
          </div>
          <a href="/limousines" aria-label="View limousine fleet" className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-2xl transition shadow absolute right-[-68px] border-2 border-blue-200" style={{boxShadow:'0 2px 12px 0 rgba(30,64,175,0.10)'}}>→</a>
        </div>
      </Section>
  <Section className="max-w-6xl mx-auto mb-24">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow leading-[1.15]">Coach Buses</h2>
        <div className="relative flex items-center justify-center" style={{minHeight:'288px'}}>
          <a href="/coach-buses" aria-label="View coach bus fleet" className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-2xl transition shadow absolute left-[-68px] border-2 border-blue-200" style={{boxShadow:'0 2px 12px 0 rgba(30,64,175,0.10)'}}>←</a>
          <div className="grid md:grid-cols-3 gap-6 w-full">
            {coachBusImages.slice(0,3).map((img,i)=>(
              <div key={img} className="bg-white rounded-2xl shadow-xl p-5 flex flex-col items-center">
                <a href="/coach-buses" className="block w-full group" aria-label="View coach bus fleet">
                  <img src={img} alt="Coach Bus" className="w-full h-72 object-cover rounded-2xl mb-5 group-hover:opacity-90 transition" />
                  <h4 className="text-base font-bold mb-2 text-blue-800">Coach Bus {i+1}</h4>
                </a>
                <div className="flex flex-col gap-2 w-full mt-auto">
                  <a href="tel:8885352566" className="w-full bg-blue-700 text-white font-bold py-1.5 rounded-lg text-center text-sm">888-535-2566</a>
                  <a href="/quote" className="w-full bg-green-500 text-white font-bold py-1.5 rounded-lg text-center text-sm hover:bg-green-600">Instant Live Quote</a>
                </div>
              </div>
            ))}
          </div>
          <a href="/coach-buses" aria-label="View coach bus fleet" className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-2xl transition shadow absolute right-[-68px] border-2 border-blue-200" style={{boxShadow:'0 2px 12px 0 rgba(30,64,175,0.10)'}}>→</a>
        </div>
      </Section>
      {/* Reviews Section */}
      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-900/80 to-black mb-24">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow leading-[1.15]">Customer Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 max-w-5xl mx-auto">
          {[
            { quote: "Absolutely excellent! Great customer service, spotless vehicles, and super professional drivers—made our night effortless!", name: "Paul P." },
            { quote: "Best price and experience we’ve had—party bus was immaculate and the team was beyond accommodating.", name: "Jessie A." },
            { quote: "We booked for a bachelor + wedding weekend—flawless both times. Extended an hour on the fly. Total pros.", name: "Dee C." },
            { quote: "Driver was friendly, on time, and the interior was pristine. Won’t use anyone else now!", name: "Halee H." },
          ].map((r, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-7 flex flex-col justify-between border border-blue-100 min-h-[210px]">
              <p className="text-gray-700 italic mb-4 text-base md:text-lg leading-relaxed">“{r.quote}”</p>
              <div className="flex items-center gap-2"><span className="font-bold text-blue-700">— {r.name}</span><span className="text-yellow-400">★★★★★</span></div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <a href="/reviews" className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold px-10 py-4 rounded-2xl shadow-lg text-lg border border-blue-800/50 transition">More Reviews</a>
        </div>
      </Section>
    </PageLayout>
  );
}
