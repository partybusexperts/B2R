"use client";
import React from "react";
import Link from "next/link";
import PageLayout from "../../../components/PageLayout";
import Section from "../../../components/Section";
import WhyRentWithUs from "../../../components/WhyRentWithUs";
import ToolsSlider from "../../../components/ToolsSlider";
import LiveWeatherAdvisor from "../../../components/LiveWeatherAdvisor"; // will wrap & constrain
import AnchorageVehicleSlider from "../../../components/AnchorageVehicleSlider";
import { SmartImage } from "../../../components/SmartImage";
import { ReviewForm } from "../../../components/ReviewForm";
import SlideshowMaker from "../../../components/SlideshowMaker";
import ClientPolls from "../../../components/ClientPolls";

const anchorageNeighborhoods = [
  "Downtown","Midtown","South Anchorage","Hillside","Airport / Spenard","Turnagain","Government Hill","University / UMed","Muldoon","Eagle River (extension)"
];
const auroraTips = [
  "Best viewing is usually 10:30 PM – 1:30 AM away from city glow.",
  "Have a flexible driver window; cloud breaks can shift 30–60 miles.",
  "Dress in layered synthetics + insulated boots (interior cools fast when doors open).",
  "Use red headlamps inside vehicle to preserve night vision.",
  "Bring spare battery packs—cold drains phones & DSLR batteries quickly."
];

const localReviews = [
  { name: "Kara M.", rating: 5, text: "Winter corporate shuttle—driver pre‑heated the bus & tracked our delayed ANC flight." },
  { name: "Brian S.", rating: 5, text: "Cruise transfer ANC hotel → Whittier with glacier photo stop. Flawless timing." },
  { name: "Lia R.", rating: 5, text: "Prom party bus was spotless, lighting + sound were incredible. Parents felt safe." },
  { name: "Owen P.", rating: 4, text: "Aurora chase extended an hour—dispatch approved within minutes. Worth it." },
  { name: "Samantha T.", rating: 5, text: "Wedding guest loop between hotel + venue ran early, zero confusion for out‑of‑towners." },
  { name: "Joel K.", rating: 5, text: "Fishing group charter had room for all coolers—driver helped stage loading efficiently." }
];

import pollsRegistry from '../../../../data/pollsRegistry.json';

// Filter for polls tagged with "anchorage" or "alaska"
const anchoragePolls = Array.isArray(pollsRegistry)
  ? pollsRegistry.filter(
      (p) => p.active !== false && Array.isArray(p.tags) && (
        p.tags.map(t => t.toLowerCase()).includes('anchorage') ||
        p.tags.map(t => t.toLowerCase()).includes('alaska')
      )
    )
  : [];


export default function AnchoragePage() {
  return (
    <PageLayout gradientFrom="from-blue-950" gradientVia="via-blue-900" gradientTo="to-black" textColor="text-white">
      {/* TOP MICRO-CTA BAR */}
      <div className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-sm text-blue-100 py-2">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[13px]"><span className="font-semibold">Instant Quote:</span> <a href="/quote#instant" className="underline">Get a live price</a> — <a href="tel:8885352566" className="underline">(888) 535‑2566</a> • <a href="mailto:info@bus2ride.com" className="underline">info@bus2ride.com</a></div>
          <div className="hidden md:flex items-center gap-3 text-[12px]"><span className="px-2 py-1 bg-blue-700 rounded-full">Local Experts</span><span className="px-2 py-1 bg-blue-700 rounded-full">Winter-Ready Fleet</span><span className="px-2 py-1 bg-blue-700 rounded-full">24/7 Support</span></div>
        </div>
      </div>
      {/* HERO */}
      <section className="relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[560px] py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,#1e3a8a_0%,#0b1934_55%,#030712_100%)]" />
  <div className="absolute inset-0 bg-[url(/images/party-buses/18%20Passenger%20White%20Party%20Bus%20Exterior.png)] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.55)] font-serif">Anchorage Party Bus, Limo & Charter Service</h1>
  <p className="relative z-10 max-w-4xl mx-auto text-xl md:text-2xl mt-6 text-blue-100 font-medium leading-relaxed">Cruise transfers • Aurora & winter readiness • Corporate shuttles • Weddings • Excursions to Seward, Whittier & Alyeska. Professional drivers. Local logistics expertise.</p>
  {/* Salesy booster line */}
  <p className="relative z-10 max-w-3xl mx-auto text-md md:text-lg mt-4 text-yellow-200 font-semibold leading-relaxed">Book smarter: instant quotes in seconds, attentive local dispatch, flexible aurora-ready windows, and guaranteed on-time pickups. Call <a href="tel:8885352566" className="underline">(888) 535‑2566</a> or <a href="mailto:info@bus2ride.com" className="underline">info@bus2ride.com</a> — we will handle the weather, routing, and gear.</p>
        {/* Hero benefits & urgency chips */}
        <div className="relative z-10 mt-6 flex flex-wrap gap-3 items-center justify-center">
          <span className="px-3 py-1 rounded-full bg-yellow-600 text-black font-semibold text-sm">Instant Quotes</span>
          <span className="px-3 py-1 rounded-full bg-blue-700 text-white font-semibold text-sm">Local Dispatch</span>
          <span className="px-3 py-1 rounded-full bg-blue-700 text-white font-semibold text-sm">Winter-Ready Fleet</span>
          <span className="ml-4 px-3 py-1 rounded-full bg-red-600 text-white font-bold text-sm">Limited vehicles for peak cruise dates — reserve early</span>
        </div>
        <div className="relative z-10 mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-3xl justify-center">
          <a href="/quote#instant" className="rounded-full bg-white text-blue-900 font-bold px-8 py-4 text-lg shadow-lg hover:bg-blue-50 transition">⚡ Instant Quote</a>
          <a href="/fleet" className="rounded-full bg-blue-700 text-white font-bold px-8 py-4 text-lg shadow-lg hover:bg-blue-800 transition">🚌 View Fleet</a>
          <a href="tel:8885352566" className="rounded-full bg-blue-900 text-white font-bold px-8 py-4 text-lg shadow-lg hover:bg-black transition">📞 (888) 535‑2566</a>
          {/* Secondary sales CTA */}
          <a href="mailto:info@bus2ride.com" className="rounded-full bg-transparent border border-blue-500 text-blue-200 font-bold px-6 py-3 text-md shadow-sm hover:bg-blue-900/20 transition hidden sm:inline-block">✉️ Email Us</a>
        </div>
  <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none">
          <svg viewBox="0 0 1440 160" className="w-full h-full" preserveAspectRatio="none"><path d="M0,96 C240,160 480,32 720,80 C960,128 1200,64 1440,112 L1440,160 L0,160 Z" fill="#0c2344" /></svg>
        </div>
      </section>

      {/* QUICK STATS & REASONS */}
      <Section className="max-w-7xl mx-auto -mt-4 bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl border border-blue-500/30 py-12 px-6 mb-16">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-[#132a55] rounded-2xl p-6 border border-blue-700/40 shadow flex flex-col gap-2"><div className="text-sm tracking-widest text-blue-300 font-semibold">AIRPORT • HUB</div><div className="text-2xl font-extrabold">ANC (Ted Stevens)</div><p className="text-blue-100/90 text-sm leading-relaxed">Flight tracking & buffer planning for cruise + corporate arrivals.</p></div>
          <div className="bg-[#132a55] rounded-2xl p-6 border border-blue-700/40 shadow flex flex-col gap-2"><div className="text-sm tracking-widest text-blue-300 font-semibold">PEAK DEMAND</div><div className="text-2xl font-extrabold">May–Sept (Cruise + Tours)</div><p className="text-blue-100/90 text-sm">Book popular Saturdays 90+ days out; winter brings aurora & ski transfers.</p></div>
          <div className="bg-[#132a55] rounded-2xl p-6 border border-blue-700/40 shadow flex flex-col gap-2"><div className="text-sm tracking-widest text-blue-300 font-semibold">WINTER LOWS</div><div className="text-2xl font-extrabold">↓ 0°F Typical</div><p className="text-blue-100/90 text-sm">We vet block heaters, tires & emergency kits for cold resiliency.</p></div>
        </div>
  <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg font-serif tracking-tight">Why Book in Anchorage with Bus2Ride?</h2>
  <p className="text-center text-blue-200 max-w-3xl mx-auto mb-6">Fast quotes, local dispatch, and a fleet prepped for Alaska’s extremes — we match the right vehicle, driver, and plan to your group so your trip runs flawlessly.</p>
        <WhyRentWithUs />
      </Section>

      {/* LONG-FORM CONTENT: GUIDE & KEY INFO (inserted for SEO and information depth) */}
      <Section className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl border border-blue-500/30 py-12 px-6 mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-6 font-serif tracking-tight bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Complete Guide to Party Bus Service in Anchorage</h2>
        <p className="text-blue-100/90 leading-relaxed mb-4">Anchorage is the logistical heart of Southcentral Alaska and a natural launch point for group travel: cruise transfers, Glacier National Park day trips, aurora chases, corporate shuttles, weddings, and seasonal festivals. A party bus gives groups a single, comfortable vehicle that keeps everyone together, simplifies coordination, and reduces the number of drivers and vehicles you must manage when staging multiple pickup points.</p>
        <p className="text-blue-100/90 leading-relaxed mb-4">When planning with a party bus, think in trip modules: pickup and staging windows, luggage and gear capacity, scheduled photo stops and unscheduled scenic detours, and the drive-time buffers needed for Alaska winter conditions. Our team pre-fills these considerations during the <Link href="/quote#instant" className="underline">instant quote</Link> process so the confirmation you get is operationally realistic and minimizes last-minute changes.</p>
        <p className="text-blue-100/90 leading-relaxed mb-4">Common use cases we dispatch in Anchorage include hotel → Port transfers for cruise passengers, airport shuttles timed to gate and baggage windows, aurora charters that leave late and pivot when clouds shift, and private night-out groups who want premium sound and lighting aboard. For planning tools, compare models and layout options with the <Link href="/tools" className="underline">Tools</Link> page and then lock the right vehicle on our <Link href="/fleet" className="underline">Fleet</Link> listing.</p>
        <p className="text-blue-100/90 leading-relaxed mb-4">If you need official venue or route information, check the Anchorage visitor site (<a href="https://www.anchorage.net" target="_blank" rel="noopener noreferrer" className="underline">anchorage.net</a>) or the Alaska Railroad for train‑transfer connections (<a href="https://www.alaskarailroad.com" target="_blank" rel="noopener noreferrer" className="underline">alaskarailroad.com</a>). For port timing at Whittier and related port notices, consult local port resources before finalizing photo stops.</p>
      </Section>

      {/* FLEET GALLERY (photos of real vehicles available for Anchorage) */}
      <Section className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl border border-blue-500/30 py-14 px-6 mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-6 font-serif tracking-tight bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Anchorage Fleet Highlights</h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-8">Real photos of vehicles we dispatch for Anchorage runs. Choose a model, request an instant quote, and we will reserve the right vehicle for your group and itinerary.</p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-[#132a55] rounded-2xl overflow-hidden border border-blue-700/40 shadow">
            <SmartImage src="/images/party-buses/18 Passenger White Party Bus Exterior.png" alt="18 passenger white party bus exterior" className="w-full h-48 object-cover" />
            <div className="p-4">
              <div className="font-bold text-blue-50">18 Passenger Party Bus</div>
              <div className="text-blue-200 text-sm mt-1">Perfect for night-out groups, premium sound and lighting.</div>
              <div className="mt-3"><a href="/quote#instant" className="inline-block rounded-full bg-white text-blue-900 font-bold px-4 py-2 text-sm shadow hover:bg-blue-50 transition">Reserve this vehicle</a></div>
            </div>
          </div>

          <div className="bg-[#132a55] rounded-2xl overflow-hidden border border-blue-700/40 shadow">
            <SmartImage src="/images/sprinter-limo-style/12 Passenger Sprinter Limo Exterior.png" alt="12 passenger sprinter limo exterior" className="w-full h-48 object-cover" />
            <div className="p-4">
              <div className="font-bold text-blue-50">12 Passenger Sprinter Limo</div>
              <div className="text-blue-200 text-sm mt-1">Executive styling, comfortable seating, ideal for shore transfers.</div>
              <div className="mt-3"><a href="/quote#instant" className="inline-block rounded-full bg-white text-blue-900 font-bold px-4 py-2 text-sm shadow hover:bg-blue-50 transition">Reserve this vehicle</a></div>
            </div>
          </div>

          <div className="bg-[#132a55] rounded-2xl overflow-hidden border border-blue-700/40 shadow">
            <SmartImage src="/images/coach-buses/50 Passenger Exterior Coach Bus.png" alt="50 passenger coach exterior" className="w-full h-48 object-cover" />
            <div className="p-4">
              <div className="font-bold text-blue-50">50 Passenger Coach</div>
              <div className="text-blue-200 text-sm mt-1">Large group transfers, luggage bays, comfortable touring seats.</div>
              <div className="mt-3"><a href="/quote#instant" className="inline-block rounded-full bg-white text-blue-900 font-bold px-4 py-2 text-sm shadow hover:bg-blue-50 transition">Reserve this vehicle</a></div>
            </div>
          </div>

          <div className="bg-[#132a55] rounded-2xl overflow-hidden border border-blue-700/40 shadow">
            <SmartImage src="/images/party-buses/20 Passenger Party Bus Exterior.png" alt="20 passenger party bus exterior" className="w-full h-48 object-cover" />
            <div className="p-4">
              <div className="font-bold text-blue-50">20 Passenger Party Bus</div>
              <div className="text-blue-200 text-sm mt-1">Extra space for gear and coolers, great for fishing or aurora nights.</div>
              <div className="mt-3"><a href="/quote#instant" className="inline-block rounded-full bg-white text-blue-900 font-bold px-4 py-2 text-sm shadow hover:bg-blue-50 transition">Reserve this vehicle</a></div>
            </div>
          </div>

          <div className="bg-[#132a55] rounded-2xl overflow-hidden border border-blue-700/40 shadow">
            <SmartImage src="/images/limousines/10 Passenger Lincoln Stretch Limo Interior.png" alt="10 passenger lincoln stretch limo interior" className="w-full h-48 object-cover" />
            <div className="p-4">
              <div className="font-bold text-blue-50">10 Passenger Stretch Limo</div>
              <div className="text-blue-200 text-sm mt-1">Classic comfort for weddings and VIP transfers.</div>
              <div className="mt-3"><a href="/quote#instant" className="inline-block rounded-full bg-white text-blue-900 font-bold px-4 py-2 text-sm shadow hover:bg-blue-50 transition">Reserve this vehicle</a></div>
            </div>
          </div>

          <div className="bg-[#132a55] rounded-2xl overflow-hidden border border-blue-700/40 shadow">
            <SmartImage src="/images/sprinter-limo-style/14 Passenger Sprinter Van Limo Style Inside.png" alt="14 passenger sprinter van interior" className="w-full h-48 object-cover" />
            <div className="p-4">
              <div className="font-bold text-blue-50">14 Passenger Sprinter Van</div>
              <div className="text-blue-200 text-sm mt-1">Flexible seating layouts and easy airport pickups.</div>
              <div className="mt-3"><a href="/quote#instant" className="inline-block rounded-full bg-white text-blue-900 font-bold px-4 py-2 text-sm shadow hover:bg-blue-50 transition">Reserve this vehicle</a></div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8 gap-4">
          <a href="/fleet" className="rounded-full bg-blue-700 text-white font-bold px-8 py-3 shadow hover:bg-blue-800 transition">See Full Fleet</a>
          <a href="/quote#instant" className="rounded-full bg-white text-blue-900 font-bold px-8 py-3 shadow hover:bg-blue-50 transition">Instant Quote</a>
        </div>
      </Section>

      {/* EXTRA SLIDER #1 — more vehicle photos */}
      <Section className="max-w-7xl mx-auto my-10">
        <h4 className="text-xl font-bold text-center mb-4 text-blue-50">Explore More Vehicles</h4>
        <div className="bg-[#0b1b3a] rounded-2xl p-4 border border-blue-700/30 shadow">
          <AnchorageVehicleSlider />
        </div>
      </Section>

      {/* PRACTICAL PLANNING CHECKLIST (what to include in an instant quote) */}
      <Section className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/75 to-black rounded-3xl shadow-xl border border-blue-500/30 py-12 px-6 mb-16">
        <h3 className="text-3xl font-extrabold mb-4 font-serif bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Planning Checklist — What to Include in Your Quote</h3>
        <p className="text-blue-100/90 mb-4 leading-relaxed">To get an accurate price and a vehicle perfectly matched to your needs, include these items in your request: pickup and final return addresses, number of passengers, desired pickup windows (with flexibility for aurora charters), luggage and gear counts (skis, coolers, camera rigs), and any mobility or accessibility needs. Add notes for special stops such as glacier overlooks, the Alaska Railroad depot, or Port of Whittier access so we can plan staging and parking ahead of time.</p>
        <ul className="list-disc list-inside text-blue-200 space-y-2 mb-4">
          <li>Exact or approximate passenger count and age mix (adults vs minors).</li>
          <li>Desired vehicle features (PA system, wet bar, dance lighting, power outlets).</li>
          <li>Any timed connections (flight arrival times, train departures, cruise embark windows).</li>
          <li>Weather sensitivity: aurora flexibility windows or winterized vehicle requests.</li>
        </ul>
        <p className="text-blue-100/90 leading-relaxed mb-2">Use the <Link href="/tools" className="underline">Tools</Link> slider to compare capacity and estimated per‑person costs, then hit <Link href="/quote#instant" className="underline">Instant Quote</Link> to get a pre-filled estimate. If you prefer email, send full itinerary details to <a href="mailto:info@bus2ride.com" className="underline">info@bus2ride.com</a> and our dispatch team will return a consolidated plan with driver notes and suggested buffers.</p>
      </Section>


  {/* OVERVIEW & STRATEGY (pricing estimator removed) */}
      <Section className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl border border-blue-500/30 py-14 px-6 mb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h3 className="text-3xl font-extrabold mb-5 font-serif bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Anchorage Transportation Overview</h3>
            <p className="text-blue-100/90 leading-relaxed mb-4">Anchorage functions as Alaska’s staging hub—cruise passengers overnight here before rail or coach transfers, corporate teams fly in for energy & logistics projects, and adventure travelers launch day trips to glaciers, fjords and national parks.</p>
            <p className="text-blue-100/90 leading-relaxed mb-4 font-semibold">We turn logistics into an effortless part of your trip: on-time pickups, clear driver communication, and contingency planning for weather and port surges.</p>
            <p className="text-blue-100/90 leading-relaxed mb-4">We coordinate winter-ready vehicles, veteran drivers accustomed to snow, ice & moose delays, and optimized routing for Seward Highway (AK‑1), Glenn Highway and Port access to Whittier. Need gear capacity? We stage luggage + coolers + photo rigs with advance manifests.</p>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {[{ t: "Cruise Transfer", d: "Hotel → Whittier / Seward with glacier stop" },{ t: "Aurora Charter", d: "Dynamic route pivoting to clearer skies" },{ t: "Corporate Shuttle", d: "Multi‑day crew & vendor loops" },{ t: "Ski / Alyeska", d: "Group lodge & evening dining shuttle" },{ t: "Wedding Guest", d: "Hotel staging + venue return waves" },{ t: "Fishing Charter", d: "Cooler + gear capacity planning" }].map(card => (
                <div key={card.t} className="rounded-xl bg-[#132a55] border border-blue-700/40 p-4 shadow"><div className="font-bold text-blue-50">{card.t}</div><div className="text-xs text-blue-200 mt-1 leading-snug">{card.d}</div></div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold mb-5 font-serif bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Seasonal & Weather Strategy</h3>
            <p className="text-blue-200 text-sm mb-4">Our planners watch KP indexes, road advisories, and cruise manifests so you don’t have to—ask about aurora‑flex windows for maximum sighting odds.</p>
            <ul className="space-y-4 text-blue-100/90 leading-relaxed">
              <li><span className="font-semibold text-blue-50">Summer (Midnight Sun):</span> Compress multiple scenic stops—add buffers for cruise surges.</li>
              <li><span className="font-semibold text-blue-50">Shoulder (Apr–May / Sept–Oct):</span> 8–15% lower rates + flexibility for photo detours.</li>
              <li><span className="font-semibold text-blue-50">Winter:</span> Pre‑trip vehicle warm-up, anti‑slip entry mats, black ice contingency.</li>
              <li><span className="font-semibold text-blue-50">Aurora windows:</span> Flexible standby after midnight—routing adapts to KP & cloud cover.</li>
              <li><span className="font-semibold text-blue-50">Wildlife:</span> Moose / Dall sheep slowdowns modeled with conservative mph.</li>
            </ul>
    {/* Pricing estimator removed per request */}
          </div>
        </div>
      </Section>

      {/* AURORA / WINTER EXPANDED TIPS & EXTERNAL RESOURCES */}
      <Section className="max-w-7xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/40">
        <h3 className="text-3xl font-extrabold mb-4 font-serif bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Aurora & Winter: Extra Planning Notes</h3>
        <p className="text-blue-100/90 leading-relaxed mb-4">Aurora chases require flexibility. We recommend a standby window of 60–90 minutes and an agreed extension policy when KP indexes are high. Add the extension request to your initial quote so the driver is scheduled and food/fuel logistics are planned in advance. If you are unfamiliar with local weather patterns, our Live Weather Advisor component on this page is a quick reference, but for in-depth research see official resources such as the National Weather Service and local aurora forecasting tools.</p>
        <p className="text-blue-100/90 leading-relaxed mb-4">For route planning and port timing, external resources help: anchor planning on the local visitor guide (<a href="https://www.anchorage.net" target="_blank" rel="noopener noreferrer" className="underline">anchorage.net</a>) and review ferry or port notices before locking a schedule. When traveling through mountain passes or the Seward Highway, allow extra buffer time for slowdown windows and wildlife sightings.</p>
        <p className="text-blue-100/90 leading-relaxed">If you have specific safety or accessibility concerns, add them to your quote and we will assign vehicles and drivers trained for those conditions. Our emergency kit checklist is part of every winter dispatch: block heater checks, extra blankets, ice‑scrapers, and USB charging stations for devices used during long nights.</p>
      </Section>
  {/* Pricing table removed per request */}

      {/* ROUTES */}
      <Section className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl border border-blue-500/30 py-14 px-6 mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 font-serif tracking-tight bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Top Anchorage Routes & Logistics Hotspots</h2>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            {[{ t:"Hotel → Whittier Cruise", d:"Plan 1 hr 45 min incl. tunnel timing + glacier photo stop option." },{ t:"Airport → Downtown", d:"15–25 min; add 10–15 in peak cruise arrivals." },{ t:"Downtown → Alyeska (Girdwood)", d:"~45–55 min; winter storm days can double." },{ t:"Anchorage Evening Shuttle", d:"Multi‑stop dinner / brewery / nightlife loop." },{ t:"Aurora Flex Charter", d:"Dynamic routing (Palmer / Wasilla pivot)." },{ t:"Fishing Transfer", d:"Cooler & gear staging; early AM departure complexity handled." }].map(r => (
              <div key={r.t} className="p-5 rounded-2xl bg-[#132a55] border border-blue-700/40 shadow"><div className="font-bold text-blue-50">{r.t}</div><div className="text-blue-200 text-sm mt-2 leading-snug">{r.d}</div></div>
            ))}
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-3 font-serif">High-Impact Venues</h3>
              <ul className="grid grid-cols-2 gap-3 text-sm text-blue-100/90">{['Alyeska Resort','Egan Center','Dena’ina Center','Alaska Railroad Depot','Port of Whittier','Seward Harbor','Hilltop / Arctic Valley','Kincaid Park','Hotel Captain Cook','Chugach Overlooks'].map(v=> <li key={v} className="bg-[#122a4c] rounded-lg px-3 py-2 border border-blue-700/40">{v}</li>)}</ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3 font-serif">Neighborhood Coverage</h3>
              <div className="flex flex-wrap gap-2">{anchorageNeighborhoods.map(n=> <span key={n} className="rounded-full bg-blue-50/10 border border-blue-500/40 text-blue-100 text-xs font-semibold px-3 py-1">{n}</span>)}</div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3 font-serif">Buffer Recommendations</h3>
              <p className="text-blue-200 text-sm mb-2">Tip: Add suggested buffers directly in your instant quote so your final confirmation already includes realistic timing and optional aurora flexibility.</p>
              <ul className="list-disc list-inside text-blue-100/90 space-y-1 text-sm">
                <li>+10–15 min per extra pickup / staging stop</li>
                <li>+30+ min if Seward Hwy weather advisories</li>
                <li>+20 min cruise disembark surge windows</li>
                <li>+15 min if large luggage & gear loading</li>
                <li>Flexible 60–90 min aurora repositioning</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* AURORA & WINTER */}
      <Section className="max-w-7xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/40">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10 font-serif tracking-tight bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Aurora / Winter Comfort Checklist</h2>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-4 flex flex-col">
            {auroraTips.map(t => (
              <div key={t} className="bg-[#132a55] p-4 rounded-xl border border-blue-700/40 text-blue-100/90 text-sm leading-relaxed">{t}</div>
            ))}
            {/* Large vehicle slider to fill lower left space */}
            <div className="mt-6">
              <AnchorageVehicleSlider />
            </div>
            {/* Descriptive copy to utilize lower vertical space */}
            <div className="mt-6 bg-[#132a55] p-5 rounded-2xl border border-blue-700/40 text-blue-100/90 text-[13px] leading-relaxed shadow">
              <h4 className="font-semibold text-blue-50 mb-2 text-sm tracking-wide">Anchorage Fleet Readiness</h4>
              <p className="mb-2">Vehicles allocated for Anchorage + Southcentral runs are prepped for rapid weather shifts—heated interiors, winter‑rated tires in season, and space allocation for layered gear & camera packs during aurora charters.</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Block heater + cold start checklist below 20°F.</li>
                <li>Extra time baked into Seward / Whittier turns during storm advisories.</li>
                <li>Night charters carry reflective cones for safe photo stop staging.</li>
                <li>Sprinter & party bus USB power verified pre‑dispatch for battery‑intensive DSLR sessions.</li>
                <li>Flexible overage policy on aurora nights—extend in 30 min increments if KP spikes.</li>
              </ul>
              <p className="mt-3 text-blue-200/80 italic">Include special cargo (skis, coolers, tripods) in your quote request so we reserve the right interior layout.</p>
            </div>
            {/* subtle aurora accent behind slider (decorative) */}
            <div className="relative hidden">
              <SmartImage src="/images/aurora-anchorage.svg" alt="Aurora decorative" className="opacity-40"/>
            </div>
          </div>
          <div className="bg-[#132a55] p-4 md:p-6 rounded-2xl border border-blue-700/40 flex flex-col gap-4">
            <h3 className="text-2xl font-bold font-serif">Live Weather & Comfort</h3>
            <p className="text-blue-100/90 text-sm leading-relaxed">Anchorage-focused forecast snapshot to plan layers, hydration & timing.</p>
            <p className="text-blue-200 text-sm">We combine live forecasts with vehicle readiness checks—ask dispatch for cold-weather add-ons like extra fuel, blankets, or power banks.</p>
            <div className="rounded-2xl overflow-hidden border border-blue-600/40 bg-blue-900/40 p-2 md:p-3 text-white text-sm">
              {/* Compact weather (anchored to Anchorage) */}
              <div className="[&_*]:!text-[13px] [&_h1]:!text-base [&_h2]:!text-sm [&_.min-h-screen]:min-h-0 [&_.min-h-screen]:bg-transparent [&_.max-w-7xl]:max-w-full [&_.grid]:gap-3">
                <LiveWeatherAdvisor variant="compact" fixedPlace={{ name: 'Anchorage, Alaska', latitude: 61.2181, longitude: -149.9003, country_code: 'US' }} />
              </div>
            </div>
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-blue-200 mb-2">View Similar Vehicles</h4>
              <AnchorageVehicleSlider />
            </div>
          </div>
        </div>
      </Section>

      {/* REVIEWS */}
      <Section className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl border border-blue-500/30 py-14 px-6 mb-16">
  <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 font-serif tracking-tight bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Anchorage Rider Reviews</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">{localReviews.map(r => (
          <div key={r.name} className="bg-[#132a55] rounded-2xl p-6 border border-blue-700/40 shadow flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl border border-blue-300/30">{r.name[0]}</div>
              <div className="font-bold text-blue-50">{r.name}</div>
              <div className="ml-auto text-yellow-300 text-lg">{"★".repeat(r.rating)}</div>
            </div>
            <div className="text-sm text-blue-100/90 leading-relaxed">{r.text}</div>
          </div>
        ))}</div>
  <div className="flex justify-center mt-10"><Link href="/reviews" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700">More Reviews</Link></div>
      </Section>

      {/* REVIEW FORM & SLIDESHOW */}
      <Section className="flex flex-col md:flex-row gap-10 max-w-7xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl py-14 px-6 mb-16 border border-blue-800/40">
        <div className="flex-1">
          <h3 className="text-3xl md:text-4xl font-extrabold mb-4 font-serif bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Share Your Anchorage Experience</h3>
          <p className="text-blue-100/90 text-sm leading-relaxed mb-4">Submit a review—top local feedback may be featured. Add optional photos.</p>
          <ReviewForm />
        </div>
        <div className="flex-1 md:border-l border-blue-700/40 md:pl-10">
          <h3 className="text-3xl md:text-4xl font-extrabold mb-4 font-serif bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Create a Trip Slideshow</h3>
          <p className="text-blue-100/90 text-sm leading-relaxed mb-4">Upload highlights—our tool instantly renders a shareable slideshow.</p>
          <SlideshowMaker />
        </div>
      </Section>


      {/* POLLS (interactive, registry-driven) */}
      <Section className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl border border-blue-500/30 py-14 px-6 mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-6 font-serif tracking-tight bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Anchorage Rider Polls</h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-8">Snapshot of planning preferences. Vote below or explore all polls on the <Link href="/polls" className="underline">live polls</Link> page. Your input helps us stock the right gear and plan realistic buffers for Anchorage trips.</p>
        <div className="mx-auto max-w-5xl">
          <ClientPolls polls={anchoragePolls} />
        </div>
      </Section>

      {/* TOOLS */}
      <Section className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/40">
  <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 font-serif tracking-tight bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Anchorage Planning Tools</h2>
        <p className="text-blue-100/90 text-center max-w-4xl mx-auto mb-8">Compare capacities, split costs, plan multi‑stop routes, and check weather without losing dark theme contrast.</p>
  <p className="text-center text-blue-200 max-w-2xl mx-auto mb-6">Pro tip: run a ToolsSlider compare and then hit Instant Quote — our team will pre-fill vehicle layout and driver notes for faster confirmations.</p>
        <div className="rounded-3xl shadow-xl border border-blue-600/30 p-2 sm:p-4 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800">
          <ToolsSlider />
        </div>
      </Section>

      {/* LOCAL EVENTS */}
      <Section className="max-w-7xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl py-14 px-6 mb-16 border border-blue-800/40">
  <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-6 font-serif tracking-tight bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Anchorage Seasonal Events & Trip Builders</h2>
        <p className="text-blue-100/90 text-center max-w-4xl mx-auto mb-10 text-sm md:text-base">Anchor your itinerary to high‑impact local events—use these to justify early vehicle blocks, plan layered packing, or extend a cruise stay. (Dates approximate—confirm annually.)</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[ 
            { season:'Jan–Mar', name:'Aurora Peak Windows', desc:'Dark skies + cold clarity. Flexible late‑night charter loops north of city.' },
            { season:'Feb', name:'Fur Rendezvous', desc:'Winter festival downtown—parades and marketplace increase traffic staging.' },
            { season:'Early Mar', name:'Iditarod Ceremonial Start', desc:'Crowds + media. Stage earlier hotel departures and downtown detours.' },
            { season:'May–Sept', name:'Cruise Transfer Surge', desc:'High weekend demand to Whittier/Seward—lock charter blocks 90+ days out.' },
            { season:'June', name:'Summer Solstice', desc:'Extended daylight enables multi‑stop scenic loops and late returns.' },
            { season:'July', name:'Mount Marathon (Seward)', desc:'Add buffer for highway flow + Seward harbor congestion if day‑tripping.' },
            { season:'Aug', name:'State Fair (Palmer)', desc:'Evening return surges; plan staggered pickup windows & cooler storage.' },
            { season:'Sept', name:'Fall Colors & Shoulder Deals', desc:'Slight rate relief; combine glacier + brewery loops with earlier dusk.' },
            { season:'Nov–Dec', name:'Holiday Lights & Early Aurora', desc:'Short daylight; integrate warming stops + photo pauses.' }
          ].map(e => (
            <div key={e.name} className="bg-[#132a55] rounded-2xl p-5 border border-blue-700/40 shadow flex flex-col">
              <div className="text-xs uppercase tracking-wider text-blue-300 font-semibold mb-1">{e.season}</div>
              <div className="font-bold text-blue-50 mb-1 leading-snug">{e.name}</div>
              <p className="text-[12px] text-blue-100/90 leading-relaxed flex-1">{e.desc}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {e.name.includes('Aurora') && <span className="px-2 py-1 rounded-full bg-blue-800/40 text-[10px] border border-blue-600/40">Night Charter</span>}
                {e.name.includes('Cruise') && <span className="px-2 py-1 rounded-full bg-blue-800/40 text-[10px] border border-blue-600/40">Port Transfer</span>}
                {e.name.includes('Fair') && <span className="px-2 py-1 rounded-full bg-blue-800/40 text-[10px] border border-blue-600/40">Staggered Return</span>}
                {e.name.includes('Marathon') && <span className="px-2 py-1 rounded-full bg-blue-800/40 text-[10px] border border-blue-600/40">Highway Buffer</span>}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-[#132a55] rounded-2xl p-6 border border-blue-700/40 flex flex-col gap-3">
            <h3 className="font-serif text-xl font-bold text-blue-50">Cruise Transfer Builder</h3>
            <ul className="text-blue-100/90 text-sm space-y-1 list-disc list-inside">
              <li>Hotel staging & luggage manifest</li>
              <li>Glacier / photo optional stop</li>
              <li>Tunnel timing (Whittier)</li>
              <li>Secondary driver fallback</li>
            </ul>
          </div>
          <div className="bg-[#132a55] rounded-2xl p-6 border border-blue-700/40 flex flex-col gap-3">
            <h3 className="font-serif text-xl font-bold text-blue-50">Aurora Flex Charter</h3>
            <ul className="text-blue-100/90 text-sm space-y-1 list-disc list-inside">
              <li>Dynamic cloud gap routing</li>
              <li>Thermal gear & hot drinks staging</li>
              <li>Flexible 60–90 min extension</li>
              <li>Photo stop light discipline</li>
            </ul>
          </div>
          <div className="bg-[#132a55] rounded-2xl p-6 border border-blue-700/40 flex flex-col gap-3">
            <h3 className="font-serif text-xl font-bold text-blue-50">Multi‑Stop Brewery Loop</h3>
            <ul className="text-blue-100/90 text-sm space-y-1 list-disc list-inside">
              <li>Pre‑route crowd timing</li>
              <li>ID / age verification flow</li>
              <li>Hydration + snack reminder</li>
              <li>Safe return & final headcount</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* EXTRA LONG-FORM: PLANNING, COSTS & FAQs (added to reach ~1k words) */}
      <Section className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/40">
        <h3 className="text-3xl font-extrabold mb-4 font-serif bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Anchorage Party Bus Planning — Tips, Costs & FAQs</h3>
        <p className="text-blue-100/90 leading-relaxed mb-4">Pricing for a party bus in Anchorage depends on the vehicle class, season, itinerary length and special requests such as aurora flexibility, extra crew time, or extended staging for glacier photo stops. Typical short transfers (airport → downtown) are quoted by the trip; longer day trips and aurora chases are usually quoted hourly with clear start and end times. Use our <Link href="/tools" className="underline">Tools</Link> to compare per‑person estimates, then hit <Link href="/quote#instant" className="underline">Instant Quote</Link> for a tailored price.</p>
        <p className="text-blue-100/90 leading-relaxed mb-4">FAQ: How far in advance should I book? For peak cruise season and major events, lock vehicles 60–90 days out. Winter aurora windows often require flexible staffing—book what you can and request an aurora‑flex window on the quote so we can provision standby time. Need multiple vehicle types? Add fleet preferences in your quote and we’ll pre-plan staging and driver handoffs to keep your itinerary tight.</p>
        <p className="text-blue-100/90 leading-relaxed mb-4">Safety & compliance: our fleet meets local DOT standards and drivers are background‑checked with regular safety retraining. For remote or multi‑day itineraries, we include contingency planning for highway advisories and port notices; reference official resources like the <a href="https://www.weather.gov" target="_blank" rel="noopener noreferrer" className="underline">National Weather Service</a> and the <a href="https://www.nps.gov" target="_blank" rel="noopener noreferrer" className="underline">National Park Service</a> pages for park access rules.</p>
  <p className="text-blue-100/90 leading-relaxed mb-4">Planning checklist quick hits: include passenger count, luggage & gear list, exact pickup/drop addresses, any timed connections, and a note about mobility needs. If you are coordinating with cruise lines or event venues, include terminal names and expected disembark windows so we can model real-world buffer times. Need help? Contact our Anchorage dispatch at <a href="mailto:info@bus2ride.com" className="underline">info@bus2ride.com</a> or call <a href="tel:8885352566" className="underline">(888) 535‑2566</a>.</p>
  <p className="text-blue-100/90 leading-relaxed">Local resource links: visitor info at <a href="https://www.anchorage.net" target="_blank" rel="noopener noreferrer" className="underline">anchorage.net</a>, train connections at <a href="https://www.alaskarailroad.com" target="_blank" rel="noopener noreferrer" className="underline">alaskarailroad.com</a>, and port timing notices through local port authorities. When in doubt, add extra buffer on the quote and we will convert it to guaranteed time in the confirmation.</p>
      </Section>
      {/* EXTRA SLIDER #3 — before final CTA */}
      <Section className="max-w-7xl mx-auto my-10">
        <h4 className="text-xl font-bold text-center mb-4 text-blue-50">More Photos from Our Anchorage Fleet</h4>
        <div className="bg-[#08142a] rounded-2xl p-4 border border-blue-700/30 shadow">
          <AnchorageVehicleSlider />
        </div>
      </Section>

      {/* FINAL CTA */}
    <Section className="bg-gradient-to-r from-blue-800 via-blue-900 to-black">
        <div className="max-w-5xl mx-auto text-center py-6">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight font-serif bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Ready for Anchorage Transport Done Right?</h2>
      <p className="text-blue-100/90 mb-6">Lock preferred vehicles early—peak cruise Saturdays & holiday aurora windows go fast. Book now and enjoy transparent pricing, flexible add-ons, and an operations team that treats your group like VIPs.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/quote#instant" className="rounded-full bg-white text-blue-900 font-bold px-8 py-4 text-lg shadow-lg hover:bg-blue-50 transition">Instant Quote</a>
            <a href="/fleet" className="rounded-full bg-blue-700 text-white font-bold px-8 py-4 text-lg shadow-lg hover:bg-blue-800 transition">View Fleet</a>
            <a href="tel:8885352566" className="rounded-full bg-blue-900 text-white font-bold px-8 py-4 text-lg shadow-lg hover:bg-black transition">Call (888) 535‑2566</a>
          </div>
      <p className="text-[11px] text-blue-300 mt-6">Need multi-day / remote itinerary support? Include all legs + gear notes. Prefer email? Reach our Anchorage dispatch at <a href="mailto:info@bus2ride.com" className="underline">info@bus2ride.com</a> and we will respond with a tailored plan.</p>
      <div className="mt-6 text-blue-200 text-sm max-w-3xl mx-auto">
        <p className="leading-relaxed">If you want to read more, visit our <Link href="/reviews" className="underline">customer reviews</Link> and the <Link href="/locations/anchorage-alaska" className="underline">Anchorage hub</Link> resources. For partner and venue references, see <a href="https://www.anchorage.net" target="_blank" rel="noopener noreferrer" className="underline">anchorage.net</a> and <a href="https://www.alaskarailroad.com" target="_blank" rel="noopener noreferrer" className="underline">alaskarailroad.com</a>.</p>
      </div>
        </div>
      </Section>
    </PageLayout>
  );
}