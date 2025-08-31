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
      } catch {}
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
      {/* ============== HERO with Wave ============== */}
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
          <a href={quoteHref} className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[200px] bg-white/95 text-blue-900 hover:bg-white border-blue-200">
            ⚡ Instant Quote
          </a>
          <a href="/fleet" className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[200px] bg-blue-600 text-white hover:bg-blue-700 border-blue-700">
            🚌 View Fleet
          </a>
          <a href={`tel:${PHONE_TEL}`} className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[200px] bg-blue-800 text-white hover:bg-blue-900 border-blue-900">
            Call {PHONE_DISPLAY}
          </a>
        </div>

        {/* Wave */}
        <div className="absolute bottom-[-1px] left-0 right-0">
          <svg viewBox="0 0 1440 110" className="w-full h-[110px]" preserveAspectRatio="none">
            <path d="M0,80 C240,130 480,20 720,60 C960,100 1200,40 1440,80 L1440,120 L0,120 Z" fill="#122a56" />
          </svg>
        </div>
      </header>

      {/* ============== Intro + Quick Planner ============== */}
      <section className="bg-[#122a56] py-10 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: pitch & highlights */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-blue-800/30 bg-[#173264] p-6 shadow-xl">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white font-serif tracking-tight mb-3">
                The Ultimate Scream Night
              </h2>
              <p className="text-blue-100/90 text-base md:text-lg">
                September–November means packed lots, long lines, and cold nights. We’ll keep the group together,
                stash your gear, and shuttle door-to-door between haunts. Add timed-entry tickets, plan your route,
                and let us handle the rest—no parking hunts, no rideshare chaos, no stranded friends.
              </p>
              <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-blue-100/90">
                <li className="flex items-start gap-3"><span className="text-blue-300 text-xl">🕒</span><span><b>Right-time scheduling.</b> Buffer windows for lines, photo ops, and food stops.</span></li>
                <li className="flex items-start gap-3"><span className="text-blue-300 text-xl">🧊</span><span><b>BYOB-friendly vehicles*</b> with coolers on request (*where permitted, 21+).</span></li>
                <li className="flex items-start gap-3"><span className="text-blue-300 text-xl">📍</span><span><b>Meet-points that work.</b> Driver text updates & pinned map screenshots.</span></li>
                <li className="flex items-start gap-3"><span className="text-blue-300 text-xl">🧥</span><span><b>Comfort & storage.</b> Keep jackets, props, and merch safely onboard.</span></li>
              </ul>
            </div>
          </div>

          {/* Right: interactive planner */}
          <div className="rounded-3xl border border-blue-800/30 bg-[#173264] p-6 shadow-xl">
            <h3 className="text-2xl font-extrabold text-white font-serif tracking-tight mb-1">Quick Planner</h3>
            <p className="text-blue-100/90 text-sm mb-4">Estimate hours + best vehicle for your group.</p>

            <div className="space-y-3">
              <label className="block">
                <span className="text-sm text-blue-100/90">Group size</span>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={groupSize}
                  onChange={(e) => setGroupSize(clamp(parseInt(e.target.value || "0", 10), 1, 200))}
                  className="mt-1 w-full rounded-xl bg-[#0f1f46] border border-blue-800/40 px-4 py-2 text-white"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm text-blue-100/90">Haunted houses</span>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={stops}
                    onChange={(e) => setStops(clamp(parseInt(e.target.value || "0", 10), 1, 6))}
                    className="mt-1 w-full rounded-xl bg-[#0f1f46] border border-blue-800/40 px-4 py-2 text-white"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-blue-100/90">Avg. queue per stop (min)</span>
                  <input
                    type="number"
                    min={10}
                    max={120}
                    value={avgQueue}
                    onChange={(e) => setAvgQueue(clamp(parseInt(e.target.value || "0", 10), 10, 120))}
                    className="mt-1 w-full rounded-xl bg-[#0f1f46] border border-blue-800/40 px-4 py-2 text-white"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm text-blue-100/90">Travel between stops (min)</span>
                  <input
                    type="number"
                    min={5}
                    max={60}
                    value={travel}
                    onChange={(e) => setTravel(clamp(parseInt(e.target.value || "0", 10), 5, 60))}
                    className="mt-1 w-full rounded-xl bg-[#0f1f46] border border-blue-800/40 px-4 py-2 text-white"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-blue-100/90">On-site time per stop (min)</span>
                  <input
                    type="number"
                    min={20}
                    max={90}
                    value={dwell}
                    onChange={(e) => setDwell(clamp(parseInt(e.target.value || "0", 10), 20, 90))}
                    className="mt-1 w-full rounded-xl bg-[#0f1f46] border border-blue-800/40 px-4 py-2 text-white"
                  />
                </label>
              </div>

              {/* Output */}
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

              <p className="text-[11px] text-blue-200/80 mt-2">
                Estimates only; availability, traffic, and venue rules affect final routing and price.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============== Package Ideas ============== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white font-serif tracking-tight text-center mb-6">
          Popular Packages (Sept–Nov)
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Quick Scream Run", hours: 3, details: ["1–2 haunted houses", "Direct routes", "Photo stop"] },
            { title: "Full Night Crawl", hours: 5, details: ["2–3 haunted houses", "Food/drink stop", "Queue buffers"] },
            { title: "Ultimate Fright Fest", hours: 7, details: ["3–4 haunted houses", "Multiple meet points", "Late-night drop flexibility"] },
          ].map((p, i) => (
            <div key={i} className="rounded-3xl border border-blue-800/30 bg-[#173264] p-6 shadow-xl">
              <div className="text-2xl font-extrabold text-white">{p.title}</div>
              <div className="text-blue-100/90 mt-1 mb-3">{p.hours}-hour private charter</div>
              <ul className="text-blue-100/90 space-y-1">
                {p.details.map((d, j) => <li key={j}>• {d}</li>)}
              </ul>
              <div className="mt-4 flex gap-2">
                <a href={quoteHref} className="rounded-xl bg-blue-600 text-white px-4 py-2 font-semibold border border-blue-700 hover:bg-blue-700">Get Quote</a>
                <a href="/fleet" className="rounded-xl bg-white text-blue-900 px-4 py-2 font-semibold border border-blue-200 hover:bg-blue-50">View Fleet</a>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-blue-200/80 text-xs mt-3">
          Pricing varies by date, city, vehicle, and special events. Weekend nights sell out early.
        </p>
      </section>

      {/* ============== Pro Tips & Playbook ============== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-blue-800/30 bg-[#173264] p-6 shadow-xl">
            <h3 className="text-2xl font-extrabold text-white font-serif mb-3">Pro Tips for Haunted Nights</h3>
            <ul className="text-blue-100/90 space-y-2">
              <li>• <b>Buy timed-entry tickets</b> where available; align with your pickup time.</li>
              <li>• <b>Set a meet-point</b> 1–2 blocks from the exit to avoid traffic choke points.</li>
              <li>• <b>Footwear & layers:</b> closed-toe shoes + a warm layer for lines and outdoor mazes.</li>
              <li>• <b>Food first, fear second:</b> quick eats before the first haunt keeps the group happy.</li>
              <li>• <b>Plan photos</b> at the best-looking set; we’ll stage the bus for a group shot.</li>
              <li>• <b>Queue strategy:</b> save the longest attraction for the middle of the night.</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-blue-800/30 bg-[#173264] p-6 shadow-xl">
            <h3 className="text-2xl font-extrabold text-white font-serif mb-3">Suggested Itineraries</h3>
            <div className="text-blue-100/90">
              <div className="mb-3">
                <div className="font-bold text-white">Early Screams (Family-friendly)</div>
                <div>5:30p pickup → 6:15p haunt #1 → 7:30p food stop → 8:15p haunt #2 → 9:45p drop</div>
              </div>
              <div className="mb-3">
                <div className="font-bold text-white">Late-Night Crawl (Adults)</div>
                <div>8:00p pickup → 8:45p haunt #1 → 10:15p haunt #2 → 11:30p haunt #3 → 1:00a drop</div>
              </div>
              <div>
                <div className="font-bold text-white">Mega Fright (Enthusiasts)</div>
                <div>6:00p pickup → 6:45p haunt #1 → 8:15p haunt #2 → 9:30p food/drink → 10:15p haunt #3 → 12:00a drop</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== Vehicle Recs ============== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white font-serif tracking-tight text-center mb-6">
          Best Rides for Haunted House Tours
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Party Bus",
              desc: "Wrap-around seating, club lighting, and room for costumes/props. Great for 18–30.",
              href: "/fleet#party-bus",
              img: "/images/party-buses/30 Passenger Party Bus Exterior.png",
            },
            {
              title: "Sprinter Limo/Van",
              desc: "Compact, quick to load, perfect for tight venue lots. Up to ~14.",
              href: "/fleet#sprinter",
              img: "/images/party-buses/18 Passenger White Party Bus Interior.png",
            },
            {
              title: "Shuttle / Mini Coach",
              desc: "Easy boarding and overhead room for jackets and merch. 25–40 riders.",
              href: "/fleet#mini-coach",
              img: "/images/party-buses/36 Passenger Party Bus Inside.png",
            },
          ].map((v, i) => (
            <a key={i} href={v.href} className="rounded-3xl border border-blue-800/30 bg-[#173264] p-6 shadow-xl block no-underline hover:scale-[1.01] transition">
              <SmartImage src={v.img} alt={v.title} className="rounded-2xl border border-blue-800/40 w-full h-56 object-cover object-center mb-4" />
              <div className="text-2xl font-extrabold text-white">{v.title}</div>
              <div className="text-blue-100/90 mt-1">{v.desc}</div>
            </a>
          ))}
        </div>
      </section>

      {/* ============== FAQ & Policies ============== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-blue-800/30 bg-[#173264] p-6 shadow-xl">
            <h3 className="text-2xl font-extrabold text-white font-serif mb-3">FAQs</h3>
            <div className="space-y-3">
              <details className="rounded-xl border border-blue-800/30 bg-[#122a56] p-4">
                <summary className="cursor-pointer font-semibold text-white">Can we bring drinks onboard?</summary>
                <p className="text-blue-100/90 mt-2 text-sm">
                  Many vehicles allow BYOB for 21+ where permitted. Rules vary by city and vehicle—ask when booking.
                </p>
              </details>
              <details className="rounded-xl border border-blue-800/30 bg-[#122a56] p-4">
                <summary className="cursor-pointer font-semibold text-white">What about props and costumes?</summary>
                <p className="text-blue-100/90 mt-2 text-sm">
                  Soft props are fine; avoid anything that could be mistaken for a weapon at venues. Check venue rules.
                </p>
              </details>
              <details className="rounded-xl border border-blue-800/30 bg-[#122a56] p-4">
                <summary className="cursor-pointer font-semibold text-white">Do you wait while we’re inside?</summary>
                <p className="text-blue-100/90 mt-2 text-sm">
                  Yes—this is a private charter. Your driver stays nearby and coordinates pickups at your meet-points.
                </p>
              </details>
              <details className="rounded-xl border border-blue-800/30 bg-[#122a56] p-4">
                <summary className="cursor-pointer font-semibold text-white">How early should we book?</summary>
                <p className="text-blue-100/90 mt-2 text-sm">
                  Prime Fridays/Saturdays sell out weeks ahead. Book early for October; consider Thursdays/Sundays for best availability.
                </p>
              </details>
            </div>
          </div>

          <div className="rounded-3xl border border-blue-800/30 bg-[#173264] p-6 shadow-xl">
            <h3 className="text-2xl font-extrabold text-white font-serif mb-3">Policies & Safety</h3>
            <ul className="text-blue-100/90 space-y-2">
              <li>• Follow venue rules and local laws; keep IDs handy for 21+ venues.</li>
              <li>• No smoking/vaping inside vehicles unless explicitly permitted.</li>
              <li>• Keep aisles clear; stow loose props while in motion.</li>
              <li>• Let us know if anyone is sensitive to strobe/fog effects so the driver can plan cool-down breaks.</li>
              <li>• Respect driver instructions—your safety is our priority.</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={`mailto:${EMAIL}`} className="rounded-xl bg-white text-blue-900 px-4 py-2 font-semibold border border-blue-200 hover:bg-blue-50">Ask a Question</a>
              <a href="/policies" className="rounded-xl bg-blue-600 text-white px-4 py-2 font-semibold border border-blue-700 hover:bg-blue-700">Full Policies</a>
            </div>
          </div>
        </div>
      </section>

      {/* ============== Related Polls / CTA ============== */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="rounded-3xl border border-blue-800/30 bg-[#173264] p-6 shadow-xl text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white font-serif mb-2">See What People Prefer</h3>
          <p className="text-blue-100/90 mb-4">Routes, queue strategy, best nights, drinks onboard—vote and see live results.</p>
          <a
            href={`/polls?tag=${encodeURIComponent("haunted-house-tours")}`}
            className="inline-flex items-center justify-center rounded-full px-6 py-3 font-bold text-base bg-blue-600 text-white hover:bg-blue-700 border border-blue-700"
          >
            Related Polls →
          </a>
        </div>

        <div className="text-center mt-8">
          <a href={quoteHref} className="inline-flex items-center justify-center rounded-full px-8 py-4 font-bold text-lg bg-white text-blue-900 hover:bg-blue-50 border border-blue-200">
            Get Your Haunted Night Quote
          </a>
        </div>
      </section>
    </main>
  );
}
