"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import SmartImage from "../../../components/SmartImage";
import ToolsGrid from "../../../components/tools/ToolsGrid";

/* ===== Contact constants ===== */
const PHONE_DISPLAY = "(888) 535-2566";
const PHONE_TEL = "8885352566";
const EMAIL = "info@bus2ride.com";

/* ===== Vehicle sliders (images use your existing party-bus assets; swap anytime) ===== */
const VEHICLE_SLIDES_PRIMARY = [
  { title: "Party Bus 30", img: "/images/party-buses/30 Passenger Party Bus Exterior.png", href: "/fleet#party-bus", desc: "Club lights, perimeter seating, room for props. Great for 18–30 riders." },
  { title: "Sprinter Limo", img: "/images/party-buses/18 Passenger White Party Bus Interior.png", href: "/fleet#sprinter", desc: "Compact + comfy. Quick load/unload for tight venue lots. Up to ~14." },
  { title: "Shuttle / Mini Coach", img: "/images/party-buses/36 Passenger Party Bus Inside.png", href: "/fleet#mini-coach", desc: "Easy boarding, overhead space for jackets/merch. 25–40 riders." },
  { title: "Motorcoach 56", img: "/images/party-buses/24 Passenger Party Bus Exterior.jpg", href: "/fleet#motorcoach", desc: "Max capacity + storage for mega fright nights and long routes." },
];

const VEHICLE_SLIDES_ALT = [
  { title: "Party Bus 20", img: "/images/party-buses/20 Passenger Party Bus Exterior.png", href: "/fleet#party-bus", desc: "Perfect for two haunts + a food stop." },
  { title: "Party Bus 17 (Black)", img: "/images/party-buses/17 Passenger Black Party Bus Exterior.png", href: "/fleet#party-bus", desc: "Small group, big vibe, easy parking footprint." },
  { title: "Party Bus 18 (White)", img: "/images/party-buses/18 Passenger White Party Bus Exterior.png", href: "/fleet#party-bus", desc: "Crisp style for photo ops and arrival shots." },
  { title: "Interior View", img: "/images/party-buses/18 Passenger Party Bus Interior 2.png", href: "/fleet#party-bus", desc: "LED lighting, sound, and space for costumes." },
];

/* ===== Simple, dependency-free horizontal slider ===== */
function HorizontalSlider({ items }: { items: { title: string; img: string; href: string; desc?: string }[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const scrollBy = (delta: number) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: delta, behavior: "smooth" });
  };
  return (
    <div className="relative">
      <div className="flex justify-end gap-2 mb-2">
        <button onClick={() => scrollBy(-360)} className="rounded-xl bg-[#173264] border border-blue-800/40 text-white px-3 py-1.5 hover:border-blue-500">‹</button>
        <button onClick={() => scrollBy(360)} className="rounded-xl bg-blue-600 border border-blue-700 text-white px-3 py-1.5 hover:bg-blue-700">›</button>
      </div>
      <div ref={ref} className="overflow-x-auto snap-x snap-mandatory flex gap-4 pb-2">
        {items.map((s, i) => (
          <a
            key={i}
            href={s.href}
            className="min-w-[260px] max-w-[320px] snap-start rounded-2xl border border-blue-800/30 bg-[#173264] p-3 shadow-xl no-underline hover:scale-[1.01] transition"
          >
            <SmartImage src={s.img} alt={s.title} className="w-full h-44 object-cover rounded-xl border border-blue-800/40 mb-3" />
            <div className="text-white font-bold">{s.title}</div>
            {s.desc ? <div className="text-blue-100/90 text-sm">{s.desc}</div> : null}
          </a>
        ))}
      </div>
    </div>
  );

}

/* ===== Quick planner (simple estimator) ===== */
function clamp(n: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, n)); }
function vehicleSuggestion(size: number) {
  if (size <= 14) return { label: "Sprinter Van (≤14)", key: "sprinter" };
  if (size <= 22) return { label: "Mini Party Bus (15–22)", key: "party-bus-22" };
  if (size <= 30) return { label: "Party Bus (23–30)", key: "party-bus-30" };
  if (size <= 40) return { label: "Shuttle / Mini Coach (31–40)", key: "mini-coach" };
  if (size <= 56) return { label: "Motorcoach (41–56)", key: "motorcoach" };
  return { label: "Multiple Vehicles / Staggered Trips", key: "multi" };
}
function calcRecommendedHours(stops: number, avgQueueMin: number, travelMin: number, dwellMin: number) {
  const bufferPickup = 15, bufferDrop = 15;
  const queue = stops * avgQueueMin;
  const travel = clamp((stops - 1) * travelMin, 0, 999);
  const dwell = stops * dwellMin;
  const totalMin = bufferPickup + queue + travel + dwell + bufferDrop;
  const hours = Math.ceil(totalMin / 60);
  return clamp(hours, 3, 10);
}

/* ===== Mini Polls (grabs from /api/polls if available; filters to haunted keywords) ===== */
type Poll = { id?: string|number; title?: string; question?: string; prompt?: string; tags?: string[]; options?: string[]; category?: string };
function useHauntedPolls(limit=9) {
  const [polls, setPolls] = useState<Poll[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/polls");
        if (!r.ok) return;
        const data = await r.json();
        if (!Array.isArray(data)) return;
        const haunted = (data as Poll[]).filter(p => {
          const hay = `${p.title||""} ${p.question||""} ${p.prompt||""} ${(p.tags||[]).join(" ")}`.toLowerCase();
          return /(haunt|scare|spook|halloween|fright|zombie|ghost|night out)/.test(hay);
        });
        setPolls(haunted.slice(0, limit));
      } catch (err) {
        // Non-fatal: polling is progressive enhancement. Log for debugging.
        console.debug("useHauntedPolls fetch failed", err);
      }
    })();
  }, [limit]);
  return polls;
}
function PollChip({ text }: { text: string }) {
  return <span className="inline-block rounded-full bg-[#173264] border border-blue-800/40 text-blue-100 text-xs px-3 py-1 mr-2 mb-2">{text}</span>;
}

/* ===== Page ===== */
export default function HauntedHouseToursRichPage() {
  // planner state
  const [groupSize, setGroupSize] = useState(22);
  const [stops, setStops] = useState(3);
  const [avgQueue, setAvgQueue] = useState(35);
  const [travel, setTravel] = useState(20);
  const [dwell, setDwell] = useState(40);

  const recHours = useMemo(() => calcRecommendedHours(stops, avgQueue, travel, dwell), [stops, avgQueue, travel, dwell]);
  const recVehicle = useMemo(() => vehicleSuggestion(groupSize), [groupSize]);
  const quoteHref = useMemo(() => {
    const params = new URLSearchParams({ hrs: String(recHours), group: String(groupSize), event: "haunted-house-tour" }).toString();
    return `/quote#instant?${params}`;
  }, [recHours, groupSize]);

  const polls = useHauntedPolls(9);

  return (
    <main className="text-slate-100 bg-[#0f1f46]">
      {/* HERO */}
      <header className="relative overflow-hidden min-h-[520px] md:min-h-[600px] flex flex-col items-center justify-center text-center py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-blue-600 to-indigo-900" />
        <div className="absolute inset-0 bg-[radial-gradient(1000px_500px_at_80%_-10%,rgba(255,255,255,0.16),transparent)]" />
        <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold mb-4 tracking-tight font-serif text-white drop-shadow-[0_6px_18px_rgba(0,0,0,.35)]">
          Haunted House Tours
        </h1>
        <p className="relative z-10 text-xl md:text-2xl max-w-4xl mx-auto mb-8 text-blue-50 font-medium drop-shadow">
          Skip parking, arrive together, and hit multiple haunts in one night—zero stress, all screams.
        </p>
        <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center w-full max-w-3xl">
          <a href={quoteHref} className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[200px] bg-white/95 text-blue-900 hover:bg-white border-blue-200">⚡ Instant Quote</a>
          <a href="/fleet" className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[200px] bg-blue-600 text-white hover:bg-blue-700 border-blue-700">🚌 View Fleet</a>
          <a href={`tel:${PHONE_TEL}`} className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[200px] bg-blue-800 text-white hover:bg-blue-900 border-blue-900">Call {PHONE_DISPLAY}</a>
        </div>
        <div className="absolute bottom-[-1px] left-0 right-0">
          <svg viewBox="0 0 1440 110" className="w-full h-[110px]" preserveAspectRatio="none"><path d="M0,80 C240,130 480,20 720,60 C960,100 1200,40 1440,80 L1440,120 L0,120 Z" fill="#122a56" /></svg>
        </div>
      </header>

      {/* INTRO + LONG-FORM CONTENT + PLANNER */}
      <section className="bg-[#122a56] py-10 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content */}
          <article className="lg:col-span-2 rounded-3xl border border-blue-800/30 bg-[#173264] p-6 shadow-xl prose prose-invert max-w-none">
            <h2 className="text-white font-serif tracking-tight">The Smart Way to Do Scare Season</h2>
            <p>
              Haunted houses are more popular than ever—and that means long lines, tight parking, and a lot of split-up
              rideshare chaos. With Bus2Ride, your crew travels together, keeps warm between stops, and rolls straight to
              the maze entrance with a driver who knows the plan. We help you sequence stops, choose the right meet-points,
              and keep the energy up with music and lighting on board. Want photos? We can stage the vehicle at the best
              set piece so you get that “we survived” shot before you head home.
            </p>
            <p>
              Not sure how many hours to book? A good rule: every stop needs time for <em>queue + walkthrough + regroup</em>.
              Popular Saturday nights can add 20–40 minutes of line time. If you’re doing two or three haunts, plan for
              food at the midpoint to keep the group happy (and warm). We’ll help fine-tune the route so you don’t waste
              time cross-town.
            </p>
            <p>
              Picking the right vehicle matters. Sprinters turn quickly in tight lots; party buses add space to mingle and
              store jackets; shuttles and motorcoaches move bigger groups without sacrificing comfort. Explore our{" "}
              <a href="/fleet" className="underline decoration-blue-300 hover:text-white">fleet</a>, or hit{" "}
              <a href={quoteHref} className="underline decoration-blue-300 hover:text-white">Instant Quote</a> to see options for
              your date. If you’re building a theme night—costume contest, “best scream” awards—tell our team and we’ll
              build in time for it.
            </p>
            <h3 className="text-white font-serif tracking-tight">Pro Tips to Max Out the Fun</h3>
            <ul>
              <li><strong>Buy timed-entry tickets</strong> where available and align your pickup time to the first entry.</li>
              <li><strong>Set meet-points</strong> 1–2 blocks away from exits to dodge traffic choke points.</li>
              <li><strong>Dress for lines</strong>: closed-toe shoes + a layer. Keep spare items onboard between stops.</li>
              <li><strong>Food first, fear second</strong>: quick eats before the longest haunt keeps morale high.</li>
              <li><strong>Photos</strong>: we’ll stage the vehicle at the best set; bring a ring light for bonus points.</li>
              <li><strong>Safety</strong>: strobe/fog sensitivity? We’ll plan quiet cooldowns between attractions.</li>
            </ul>
            <p>
              Want inspiration? Browse national haunt directories like{" "}
              <a href="https://www.hauntworld.com" target="_blank" rel="noopener noreferrer" className="underline decoration-blue-300">HauntWorld</a>{" "}
              or venue calendars at parks like{" "}
              <a href="https://fright-fest.sixflags.com/" target="_blank" rel="noopener noreferrer" className="underline decoration-blue-300">Six Flags Fright Fest</a>{" "}
              and {" "}
              <a href="https://www.universalorlando.com/web/en/us/things-to-do/events/halloween-horror-nights" target="_blank" rel="noopener noreferrer" className="underline decoration-blue-300">Halloween Horror Nights</a>.
              For safety ideas, check{" "}
              <a href="https://www.cdc.gov/family/halloween/index.htm" target="_blank" rel="noopener noreferrer" className="underline decoration-blue-300">CDC Halloween tips</a>.
              We’ll tailor the transport plan to your picks.
            </p>
            <p>
              Beyond haunted houses, our fall season favorites include <a href="/events/wine-tours" className="underline decoration-blue-300">wine tours</a>,{" "}
              <a href="/events/brewery-tours" className="underline decoration-blue-300">brewery crawls</a>,{" "}
              <a href="/events/night-out-on-the-town" className="underline decoration-blue-300">night-out routes</a>, and{" "}
              <a href="/events/holiday-lights" className="underline decoration-blue-300">holiday lights</a> once November hits.
              If you’re planning a school fright night, see our{" "}
              <a href="/events/prom" className="underline decoration-blue-300">prom & school guidelines</a> and{" "}
              <a href="/policies" className="underline decoration-blue-300">full policies</a>.
            </p>
            <p>
              Ready to lock it in? Hit{" "}
              <a href={quoteHref} className="underline decoration-blue-300">Instant Quote</a>, call{" "}
              <a href={`tel:${PHONE_TEL}`} className="underline decoration-blue-300">{PHONE_DISPLAY}</a>, or{" "}
              <a href={`mailto:${EMAIL}`} className="underline decoration-blue-300">email us</a>. We make the ride part of the
              show—so the scary part stays where it belongs.
            </p>
          </article>

          {/* Planner */}
          <aside className="rounded-3xl border border-blue-800/30 bg-[#173264] p-6 shadow-xl">
            <h3 className="text-2xl font-extrabold text-white font-serif tracking-tight mb-1">Quick Planner</h3>
            <p className="text-blue-100/90 text-sm mb-4">Estimate hours + best vehicle for your group.</p>
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm text-blue-100/90">Group size</span>
                <input type="number" min={1} max={200} value={groupSize} onChange={(e)=>setGroupSize(clamp(parseInt(e.target.value||"0",10),1,200))} className="mt-1 w-full rounded-xl bg-[#0f1f46] border border-blue-800/40 px-4 py-2 text-white"/>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm text-blue-100/90">Haunted houses</span>
                  <input type="number" min={1} max={6} value={stops} onChange={(e)=>setStops(clamp(parseInt(e.target.value||"0",10),1,6))} className="mt-1 w-full rounded-xl bg-[#0f1f46] border border-blue-800/40 px-4 py-2 text-white"/>
                </label>
                <label className="block">
                  <span className="text-sm text-blue-100/90">Avg. queue per stop (min)</span>
                  <input type="number" min={10} max={120} value={avgQueue} onChange={(e)=>setAvgQueue(clamp(parseInt(e.target.value||"0",10),10,120))} className="mt-1 w-full rounded-xl bg-[#0f1f46] border border-blue-800/40 px-4 py-2 text-white"/>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm text-blue-100/90">Travel between stops (min)</span>
                  <input type="number" min={5} max={60} value={travel} onChange={(e)=>setTravel(clamp(parseInt(e.target.value||"0",10),5,60))} className="mt-1 w-full rounded-xl bg-[#0f1f46] border border-blue-800/40 px-4 py-2 text-white"/>
                </label>
                <label className="block">
                  <span className="text-sm text-blue-100/90">On-site time per stop (min)</span>
                  <input type="number" min={20} max={90} value={dwell} onChange={(e)=>setDwell(clamp(parseInt(e.target.value||"0",10),20,90))} className="mt-1 w-full rounded-xl bg-[#0f1f46] border border-blue-800/40 px-4 py-2 text-white"/>
                </label>
              </div>
              <div className="rounded-2xl bg-[#122a56] border border-blue-800/40 p-4">
                <div className="text-sm text-blue-100/90">Recommended Duration</div>
                <div className="text-3xl font-extrabold text-white mt-1">{recHours} hours</div>
                <div className="mt-3 text-sm text-blue-100/90">Suggested Vehicle</div>
                <div className="text-lg font-bold text-white">{recVehicle.label}</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a href={quoteHref} className="rounded-xl bg-blue-600 text-white px-4 py-2 font-semibold border border-blue-700 hover:bg-blue-700">Get Quote</a>
                  <a href="/fleet#party-bus" className="rounded-xl bg-white text-blue-900 px-4 py-2 font-semibold border border-blue-200 hover:bg-blue-50">See Party Buses</a>
                </div>
              </div>
              <p className="text-[11px] text-blue-200/80 mt-2">Estimates only; availability, traffic, and venue rules affect final routing and price.</p>
            </div>
          </aside>
        </div>
      </section>

      {/* VEHICLE SLIDERS */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white font-serif tracking-tight text-center mb-4">Popular Vehicles for Fright Night</h2>
        <HorizontalSlider items={VEHICLE_SLIDES_PRIMARY} />
        <div className="text-center mt-6">
          <a href="/fleet" className="inline-flex items-center justify-center rounded-full px-8 py-3 font-bold bg-blue-600 text-white border border-blue-700 hover:bg-blue-700">Browse Full Fleet</a>
        </div>
        <div className="mt-10">
          <h3 className="text-2xl font-extrabold text-white font-serif tracking-tight mb-2">More Options</h3>
          <HorizontalSlider items={VEHICLE_SLIDES_ALT} />
        </div>
      </section>

      {/* EVENT PICKER (Internal linking) */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="rounded-3xl border border-blue-800/30 bg-[#173264] p-6 shadow-xl">
          <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight mb-3">More Event Types</h2>
          <p className="text-blue-100/90 mb-4">Planning something else this season? Explore our most-booked event pages:</p>
          <div className="flex flex-wrap">
            {[
              { name: "Night Out on the Town", href: "/events/night-out-on-the-town" },
              { name: "Weddings", href: "/events/weddings" },
              { name: "Proms", href: "/events/prom" },
              { name: "Concerts", href: "/events/concerts" },
              { name: "Sporting Events", href: "/events/sporting-events" },
              { name: "Brewery Tours", href: "/events/brewery-tours" },
              { name: "Wine Tours", href: "/events/wine-tours" },
              { name: "Corporate Events", href: "/events/corporate-events" },
              { name: "Holiday Lights", href: "/events/holiday-lights" },
            ].map((e) => <a key={e.name} href={e.href} className="mr-2 mb-2 inline-flex items-center justify-center rounded-full px-4 py-2 font-semibold text-sm bg-[#122a56] text-white border border-blue-800/40 hover:border-blue-500">{e.name}</a>)}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href="/events" className="rounded-xl bg-white text-blue-900 px-4 py-2 font-semibold border border-blue-200 hover:bg-blue-50">See All Events</a>
            <a href="/pricing" className="rounded-xl bg-blue-600 text-white px-4 py-2 font-semibold border border-blue-700 hover:bg-blue-700">Pricing & Packages</a>
          </div>
        </div>
      </section>

      {/* MINI POLLS SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="rounded-3xl border border-blue-800/30 bg-[#173264] p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-3xl font-extrabold text-white font-serif tracking-tight">Haunted Polls</h2>
            <a href="/polls?tag=haunted-house" className="rounded-xl bg-blue-600 text-white px-4 py-2 font-semibold border border-blue-700 hover:bg-blue-700">Open Polls Hub</a>
          </div>
          {polls.length === 0 ? (
            <p className="text-blue-100/90">Live polls will appear here when available. See the full hub for more.</p>
          ) : (
            <>
              <div className="flex flex-wrap mb-3">
                <PollChip text="Queue Strategy" /><PollChip text="Best Night to Go" /><PollChip text="Food vs. More Haunts" /><PollChip text="BYOB Rules" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {polls.map((p, i) => (
                  <a key={i} href={`/polls?focus=${encodeURIComponent(String(p.id ?? p.title ?? i))}`} className="rounded-2xl border border-blue-800/30 bg-[#122a56] p-4 shadow hover:border-blue-500 no-underline">
                    <div className="text-white font-semibold mb-2">{p.title || p.question || p.prompt || "Community Poll"}</div>
                    <div className="text-blue-100/90 text-sm">Vote now →</div>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* TOOLS (registry) */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="bg-[#122a56] border border-blue-800/30 rounded-3xl shadow-xl px-6 md:px-8 py-10">
          <h2 className="text-3xl font-extrabold text-center text-white font-serif tracking-tight mb-3">Planning Tools</h2>
          <p className="text-blue-200 text-center max-w-3xl mx-auto mb-6">Budget, group size, stops, and BYOB guidelines—quick utilities to make haunted nights simple.</p>
          <ToolsGrid limit={6} randomize={true} />
          <div className="text-center mt-6">
            <a href="/resources" className="inline-flex items-center justify-center rounded-full px-8 py-3 font-bold bg-white text-blue-900 border border-blue-200 hover:bg-blue-50">All Resources</a>
          </div>
        </div>
      </section>

      {/* CTA RIBBON */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-12">
        <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-800 border border-blue-400/30 shadow-[0_6px_18px_-2px_rgba(0,0,0,.4)] p-6 md:p-7 text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white font-serif tracking-tight mb-2">Ready to ride?</h3>
          <p className="text-blue-100/90 mb-4">Lock in your haunted itinerary before the crowds. Weekends fill up fast.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={quoteHref} className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center bg-white text-blue-900 border-blue-200 hover:bg-blue-50">⚡ Get Instant Quote</a>
            <a href="/contact" className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center bg-blue-600 text-white border-blue-700 hover:bg-blue-700">Talk to a Planner</a>
            <a href="/fleet" className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center bg-blue-800 text-white border-blue-900 hover:bg-blue-900">See Vehicles</a>
          </div>
        </div>
      </section>
    </main>
  );

