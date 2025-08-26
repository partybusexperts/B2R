"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import PageLayout from "../../components/PageLayout";
import Section from "../../components/Section";
import WhyRentWithUs from "../../components/WhyRentWithUs";
import ToolsSlider from "../../components/ToolsSlider";
import LiveWeatherAdvisor from "../../components/LiveWeatherAdvisor";
import { ReviewForm } from "../../components/ReviewForm";
import SlideshowMaker from "../../components/SlideshowMaker";

// Anchorage baseline sample rates (illustrative)
const BASE_RATES = { "20p Party Bus": 235, "30p Party Bus": 285, "10p Limo": 175, "14p Sprinter": 210, "56p Coach": 345 } as const;
const SEASON_MULTIPLIER: Record<string, number> = { Winter: 0.95, Shoulder: 1.0, Summer: 1.15, Holiday: 1.25 };

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

interface RateRow { name: string; hours: number; pax: number; total: number; per: number }
function buildSamplePricing(): RateRow[] {
  return Object.entries(BASE_RATES).flatMap(([name, base]) => [4,5,6].map(hours => {
    const pax = parseInt(name.split(/[^0-9]/).filter(Boolean)[0] || "20", 10);
    const total = base * hours;
    return { name, hours, pax, total, per: Math.round((total / pax) * 100) / 100 };
  }));
}
const samplePricing = buildSamplePricing();

const localReviews = [
  { name: "Kara M.", rating: 5, text: "Winter corporate shuttle—driver pre‑heated the bus & tracked our delayed ANC flight." },
  { name: "Brian S.", rating: 5, text: "Cruise transfer ANC hotel → Whittier with glacier photo stop. Flawless timing." },
  { name: "Lia R.", rating: 5, text: "Prom party bus was spotless, lighting + sound were incredible. Parents felt safe." },
  { name: "Owen P.", rating: 4, text: "Aurora chase extended an hour—dispatch approved within minutes. Worth it." },
  { name: "Samantha T.", rating: 5, text: "Wedding guest loop between hotel + venue ran early, zero confusion for out‑of‑towners." },
  { name: "Joel K.", rating: 5, text: "Fishing group charter had room for all coolers—driver helped stage loading efficiently." }
];
const localPolls = [
  { q: "Primary reason you book in Anchorage?", a: ["Cruise","Corporate","Wedding","Aurora","Sports / Event"] },
  { q: "Most challenging planning variable?", a: ["Weather","Distance","Timing","Costs","Group Changes"] },
  { q: "Favorite summer side trip?", a: ["Whittier","Seward","Alyeska","Matanuska Glacier"] },
  { q: "Ideal aurora start window?", a: ["9–10 PM","10–11 PM","11–Midnight","After Midnight"] }
];

function SeasonRateEstimator() {
  const [vehicle, setVehicle] = useState<keyof typeof BASE_RATES>("20p Party Bus");
  const [hours, setHours] = useState(5);
  const [season, setSeason] = useState<keyof typeof SEASON_MULTIPLIER>("Shoulder");
  const [pax, setPax] = useState(20);
  const est = Math.round(BASE_RATES[vehicle] * hours * SEASON_MULTIPLIER[season]);
  const per = Math.round((est / pax) * 100) / 100;
  return (
    <div className="bg-white/95 rounded-3xl shadow-xl border border-blue-200 p-6 w-full max-w-xl mx-auto">
      <h3 className="text-xl font-extrabold text-blue-900 mb-4">Anchorage Smart Cost Snapshot</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <label className="flex flex-col gap-1 text-sm font-semibold text-blue-900">Vehicle
          <select value={vehicle} onChange={e=>{const v=e.target.value as keyof typeof BASE_RATES; setVehicle(v); setPax(parseInt(v.split(/[^0-9]/).filter(Boolean)[0]||"20",10));}} className="rounded-lg border border-blue-300 px-3 py-2 bg-white">
            {Object.keys(BASE_RATES).map(v => <option key={v}>{v}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-blue-900">Hours
          <input type="range" min={3} max={10} value={hours} onChange={e=>setHours(parseInt(e.target.value,10))} />
          <span className="text-xs">{hours} hour block</span>
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-blue-900">Season
          <select value={season} onChange={e=>setSeason(e.target.value as any)} className="rounded-lg border border-blue-300 px-3 py-2 bg-white">
            {Object.keys(SEASON_MULTIPLIER).map(s => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-blue-900">Passengers (for per-person)
          <input type="number" min={1} max={60} value={pax} onChange={e=>setPax(parseInt(e.target.value,10)||1)} className="rounded-lg border border-blue-300 px-3 py-2 bg-white" />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="rounded-xl bg-blue-50 p-4 text-center">
          <div className="text-xs font-semibold text-blue-600 tracking-wide">EST. TOTAL</div>
          <div className="text-2xl font-extrabold text-blue-900">${est.toLocaleString()}</div>
          <div className="text-[11px] text-blue-500 mt-1">Includes season adj.</div>
        </div>
        <div className="rounded-xl bg-blue-50 p-4 text-center">
          <div className="text-xs font-semibold text-blue-600 tracking-wide">PER PERSON</div>
          <div className="text-2xl font-extrabold text-blue-900">${per}</div>
          <div className="text-[11px] text-blue-500 mt-1">Rounded 2 decimals</div>
        </div>
      </div>
      <p className="text-xs text-blue-700 mt-4 leading-relaxed">Illustrative only. Use the <Link href="/quote" className="underline font-semibold">instant quote tool</Link> for live numbers.</p>
    </div>
  );
}

export default function AnchoragePage() {
  const pricingCols = useMemo(() => samplePricing.reduce<Record<string, RateRow[]>>((acc, row) => { (acc[row.name] = acc[row.name] || []).push(row); return acc; }, {}), []);
  return (
    <PageLayout gradientFrom="from-blue-950" gradientVia="via-blue-900" gradientTo="to-black" textColor="text-white">
      {/* HERO */}
      <section className="relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[560px] py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,#1e3a8a_0%,#0b1934_55%,#030712_100%)]" />
        <div className="absolute inset-0 bg-[url(/images/18%20Passenger%20White%20Party%20Bus%20Exterior.png)] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.55)] font-serif">Anchorage Party Bus, Limo & Charter Service</h1>
        <p className="relative z-10 max-w-4xl mx-auto text-xl md:text-2xl mt-6 text-blue-100 font-medium leading-relaxed">Cruise transfers • Aurora & winter readiness • Corporate shuttles • Weddings • Excursions to Seward, Whittier & Alyeska. Professional drivers. Local logistics expertise.</p>
        <div className="relative z-10 mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-3xl justify-center">
          <a href="/quote#instant" className="rounded-full bg-white text-blue-900 font-bold px-8 py-4 text-lg shadow-lg hover:bg-blue-50 transition">⚡ Instant Quote</a>
          <a href="/fleet" className="rounded-full bg-blue-700 text-white font-bold px-8 py-4 text-lg shadow-lg hover:bg-blue-800 transition">🚌 View Fleet</a>
          <a href="tel:8885352566" className="rounded-full bg-blue-900 text-white font-bold px-8 py-4 text-lg shadow-lg hover:bg-black transition">📞 (888) 535‑2566</a>
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
        <WhyRentWithUs />
      </Section>

      {/* OVERVIEW & STRATEGY */}
      <Section className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl border border-blue-500/30 py-14 px-6 mb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h3 className="text-3xl font-extrabold mb-5 font-serif bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Anchorage Transportation Overview</h3>
            <p className="text-blue-100/90 leading-relaxed mb-4">Anchorage functions as Alaska’s staging hub—cruise passengers overnight here before rail or coach transfers, corporate teams fly in for energy & logistics projects, and adventure travelers launch day trips to glaciers, fjords and national parks.</p>
            <p className="text-blue-100/90 leading-relaxed mb-4">We coordinate winter-ready vehicles, veteran drivers accustomed to snow, ice & moose delays, and optimized routing for Seward Highway (AK‑1), Glenn Highway and Port access to Whittier. Need gear capacity? We stage luggage + coolers + photo rigs with advance manifests.</p>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {[{ t: "Cruise Transfer", d: "Hotel → Whittier / Seward with glacier stop" },{ t: "Aurora Charter", d: "Dynamic route pivoting to clearer skies" },{ t: "Corporate Shuttle", d: "Multi‑day crew & vendor loops" },{ t: "Ski / Alyeska", d: "Group lodge & evening dining shuttle" },{ t: "Wedding Guest", d: "Hotel staging + venue return waves" },{ t: "Fishing Charter", d: "Cooler + gear capacity planning" }].map(card => (
                <div key={card.t} className="rounded-xl bg-[#132a55] border border-blue-700/40 p-4 shadow"><div className="font-bold text-blue-50">{card.t}</div><div className="text-xs text-blue-200 mt-1 leading-snug">{card.d}</div></div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold mb-5 font-serif bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Seasonal & Weather Strategy</h3>
            <ul className="space-y-4 text-blue-100/90 leading-relaxed">
              <li><span className="font-semibold text-blue-50">Summer (Midnight Sun):</span> Compress multiple scenic stops—add buffers for cruise surges.</li>
              <li><span className="font-semibold text-blue-50">Shoulder (Apr–May / Sept–Oct):</span> 8–15% lower rates + flexibility for photo detours.</li>
              <li><span className="font-semibold text-blue-50">Winter:</span> Pre‑trip vehicle warm-up, anti‑slip entry mats, black ice contingency.</li>
              <li><span className="font-semibold text-blue-50">Aurora windows:</span> Flexible standby after midnight—routing adapts to KP & cloud cover.</li>
              <li><span className="font-semibold text-blue-50">Wildlife:</span> Moose / Dall sheep slowdowns modeled with conservative mph.</li>
            </ul>
            <div className="mt-8"><SeasonRateEstimator /></div>
          </div>
        </div>
      </Section>

      {/* PRICING TABLE */}
      <Section className="max-w-7xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/40">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 font-serif tracking-tight bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Illustrative Anchorage Charter Ranges</h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-8">Representative 4–6 hour blocks. Real quotes vary by pickup window, mileage, season demand, deadhead positioning & events.</p>
        <div className="overflow-x-auto rounded-2xl border border-blue-700/40 bg-[#132a55] shadow-inner">
          <table className="w-full text-left text-sm md:text-base">
            <thead><tr className="text-blue-200/80 border-b border-blue-700/60"><th className="py-3 px-4 font-semibold">Vehicle</th><th className="py-3 px-4 font-semibold">Hours</th><th className="py-3 px-4 font-semibold">Est. Block</th><th className="py-3 px-4 font-semibold">Est. / Person*</th></tr></thead>
            <tbody>
              {Object.keys(pricingCols).map(v => pricingCols[v].map((r,i) => (
                <tr key={v+"-"+r.hours} className="border-b border-blue-800/30 last:border-0 hover:bg-blue-800/20">
                  {i===0 && <td rowSpan={pricingCols[v].length} className="py-3 px-4 align-top font-bold text-blue-50 w-[160px]">{r.name}</td>}
                  <td className="py-3 px-4">{r.hours} hr</td>
                  <td className="py-3 px-4">${r.total.toLocaleString()}</td>
                  <td className="py-3 px-4">${r.per}</td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-blue-300 mt-4">*Per-person assumes comfortable capacity. Use <Link href="/quote" className="underline">instant quote</Link> for live pricing.</p>
      </Section>

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
          <div className="space-y-4">{auroraTips.map(t => <div key={t} className="bg-[#132a55] p-4 rounded-xl border border-blue-700/40 text-blue-100/90 text-sm leading-relaxed">{t}</div>)}</div>
          <div className="bg-[#132a55] p-6 rounded-2xl border border-blue-700/40 flex flex-col gap-4">
            <h3 className="text-2xl font-bold font-serif">Live Weather & Comfort</h3>
            <p className="text-blue-100/90 text-sm leading-relaxed">Use our smart advisory to plan clothing layers, hydration, and timing.</p>
            <LiveWeatherAdvisor />
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

      {/* POLLS */}
      <Section className="max-w-7xl mx-auto bg-gradient-to-br from-blue-900/80 to-black rounded-3xl shadow-xl border border-blue-500/30 py-14 px-6 mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-6 font-serif tracking-tight bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Anchorage Rider Polls</h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-10">Snapshot of planning preferences. Want to vote? See our <Link href="/polls" className="underline">live polls</Link>.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">{localPolls.map(p => (
          <div key={p.q} className="bg-[#132a55] rounded-2xl p-5 border border-blue-700/40 shadow flex flex-col">
            <div className="font-bold text-blue-50 mb-2 text-sm leading-snug">{p.q}</div>
            <ul className="text-[11px] text-blue-200 space-y-1">{p.a.map(o => <li key={o} className="bg-blue-800/30 rounded px-2 py-1 inline-block">{o}</li>)}</ul>
          </div>
        ))}</div>
        <div className="flex justify-center mt-10"><Link href="/polls" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg transition border border-blue-700">More Polls</Link></div>
      </Section>

      {/* TOOLS */}
      <Section className="max-w-7xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/40">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 font-serif tracking-tight bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Anchorage Planning Tools</h2>
        <p className="text-blue-100/90 text-center max-w-4xl mx-auto mb-8">Compare capacities, split costs, plan multi‑stop routes, and check real‑time weather.</p>
        <div className="bg-white rounded-3xl shadow-xl border-2 border-blue-100 p-6"><ToolsSlider /></div>
      </Section>

      {/* FINAL CTA */}
      <Section className="bg-gradient-to-r from-blue-800 via-blue-900 to-black">
        <div className="max-w-5xl mx-auto text-center py-6">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight font-serif bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">Ready for Anchorage Transport Done Right?</h2>
          <p className="text-blue-100/90 mb-6">Lock preferred vehicles early—peak cruise Saturdays & holiday aurora windows go fast.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/quote#instant" className="rounded-full bg-white text-blue-900 font-bold px-8 py-4 text-lg shadow-lg hover:bg-blue-50 transition">Instant Quote</a>
            <a href="/fleet" className="rounded-full bg-blue-700 text-white font-bold px-8 py-4 text-lg shadow-lg hover:bg-blue-800 transition">View Fleet</a>
            <a href="tel:8885352566" className="rounded-full bg-blue-900 text-white font-bold px-8 py-4 text-lg shadow-lg hover:bg-black transition">Call (888) 535‑2566</a>
          </div>
          <p className="text-[11px] text-blue-300 mt-6">Need multi-day / remote itinerary support? Include all legs + gear notes.</p>
        </div>
      </Section>
    </PageLayout>
  );
}