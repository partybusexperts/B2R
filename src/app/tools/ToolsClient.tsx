"use client";

import React, { useMemo, useState, useEffect } from "react";
import tools, { CATEGORY_ORDER, ToolCategory, ToolEntry } from "../../components/tools/registry";
import ToolsGrid from "../../components/tools/ToolsGrid";
import Section from "../../components/Section";
import SmartImage from "../../components/SmartImage";
import HomePolls from "../../components/HomePolls";

/* ---------- helpers ---------- */
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/* Group tools by category while preserving original registry order */
function groupByCategory(items: ToolEntry[]) {
  const map = new Map<ToolCategory, ToolEntry[]>();
  CATEGORY_ORDER.forEach((c) => map.set(c, []));
  for (const t of items) {
    if (!map.has(t.category)) map.set(t.category as ToolCategory, []);
    map.get(t.category as ToolCategory)!.push(t);
  }
  return map;
}

export default function ToolsClient() {
  const [registry, setRegistry] = useState<ToolEntry[]>(tools);
  const [query, setQuery] = useState("");
  const [catSelect, setCatSelect] = useState<ToolCategory | "All">("All");

  useEffect(() => {
    async function load() {
      try {
        const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!url || !key) return;
        const endpoint = `${url}/rest/v1/tools?select=*`;
        const res = await fetch(endpoint, {
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
            Accept: "application/json",
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setRegistry(
            data.map((r: any) => ({
              id: r.id,
              title: r.title,
              desc: r.desc,
              category: r.category || "Uncategorized",
              href: r.href || `/tools/${r.id}`,
            })),
          );
        }
      } catch {
        // ignore and keep bundled registry
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return registry;
    return registry.filter((t) =>
      [t.title, t.desc, ...(t.keywords || [])].join(" ").toLowerCase().includes(q),
    );
  }, [query, registry]);

  const grouped = useMemo(() => groupByCategory(filtered), [filtered]);

  const handleJump = (cat: ToolCategory | "All") => {
    setCatSelect(cat);
    if (cat !== "All") {
      const el = document.getElementById(`sec-${slug(cat)}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /* --------- simple featured fleet data (safe fallbacks) --------- */
  const party = [
    { title: "18p White Party Bus", img: "/images/party-buses/18 Passenger White Party Bus Exterior.png" },
    { title: "20p White Party Bus", img: "/images/party-buses/20 Passenger Party Bus Exterior.png" },
    { title: "36p Party Bus", img: "/images/party-buses/36 Passenger Party Bus Exterior 4.png" },
  ];
  const limos = [
    { title: "10p Stretch Limo", img: "/images/limousines/10 Passenger Lincoln Stretch Limo Exterior 2.png" },
    { title: "14p Stretch Limo", img: "/images/limousines/14 Passenger Stretch Limo Exterior.png" },
    { title: "20p SUV Limo", img: "/images/limousines/20 Passenger Hummer Limo Exterior.png" },
  ];
  const coaches = [
    { title: "28p Mini Coach", img: "/images/coach-buses/47 Passenger Coach Bus.png" },
    { title: "40p Coach", img: "/images/coach-buses/54 Passenger Coach Bus.png" },
    { title: "56p Motorcoach", img: "/images/coach-buses/56 Passenger Coach Bus Exterior.png" },
  ];

  const reviews = [
    { name: "Paul P.", text: "Absolutely excellent! They double-checked everything and the driver was fantastic." },
    { name: "Jessie A.", text: "The limo company you need to call for events. Prices and buses are great." },
    { name: "Dee C.", text: "Lives up to their name! We’ve used them for multiple events—always great!" },
    { name: "Halee H.", text: "Clean interior, friendly driver—will never use another company." },
    { name: "Rachel L.", text: "Best time ever!! 100% recommend." },
    { name: "Becky B.", text: "Beautiful vehicles and dependable service. Highly recommend!" },
  ];

  const events = [
    "Weddings",
    "Prom & Homecoming",
    "Concerts",
    "Sporting Events",
    "Airport Transfers",
    "Birthdays",
    "Bachelor/Bachelorette",
    "Corporate Outings",
    "Winery/Brewery Tours",
  ];

  return (
    <>
      {/* ---------- SEARCH / FILTER BAR ---------- */}
      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl -mt-10 mb-10 py-6 px-6 border border-blue-800/30">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <input
            type="text"
            placeholder="Search tools…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full md:flex-1 rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <select
            value={catSelect}
            onChange={(e) => handleJump(e.target.value as ToolCategory | "All")}
            className="w-full md:w-[320px] rounded-full px-5 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Categories</option>
            {CATEGORY_ORDER.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        {/* Quick category chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORY_ORDER.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => handleJump(c)}
              className="px-4 py-2 rounded-full bg-[#12244e] border border-blue-800/30 text-blue-100 hover:text-white hover:border-blue-500"
              aria-label={`Jump to ${c}`}
            >
              {c}
            </button>
          ))}
        </div>
      </Section>

      {/* ---------- TOOL SECTIONS ---------- */}
      {CATEGORY_ORDER.map((cat) => {
        const items = grouped.get(cat) || [];
        if (items.length === 0) return null;
        return (
          <Section
            key={cat}
            id={`sec-${slug(cat)}`}
            className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-10 py-10 px-6 border border-blue-800/30 scroll-mt-28"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-white font-serif tracking-tight mb-1">{cat}</h2>
            <p className="text-blue-200 mb-6">Tools in this section help with {cat.toLowerCase()}.</p>
            <div className="w-full">
              <ToolsGrid items={items} />
            </div>
          </Section>
        );
      })}

      {/* ---------- FEATURED FLEET (3 + 3 + 3) ---------- */}
      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-white font-serif tracking-tight">Featured Fleet</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { label: "Party Buses", items: party, link: "/fleet#party-bus" },
            { label: "Limos", items: limos, link: "/fleet#limo" },
            { label: "Coach Buses", items: coaches, link: "/fleet#coach" },
          ].map((col) => (
            <div key={col.label}>
              <h3 className="text-xl font-bold text-blue-50 mb-4">{col.label}</h3>
              <div className="grid gap-4">
                {col.items.map((v, i) => (
                  <a
                    key={`${col.label}-${v.title}-${i}`}
                    href={col.link}
                    className="block rounded-2xl overflow-hidden border border-blue-800/30 bg-[#12244e] hover:shadow-2xl"
                  >
                    <SmartImage src={v.img} alt={v.title} className="w-full h-40 object-cover" />
                    <div className="p-4 text-blue-100 font-semibold">{v.title}</div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <a
            href="/fleet"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg border border-blue-700"
          >
            Browse Full Fleet
          </a>
        </div>
      </Section>

      {/* ---------- REVIEWS ---------- */}
      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-white font-serif tracking-tight">Customer Reviews</h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-8">Real feedback from happy riders. Book with confidence.</p>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <div key={`${r.name}-${i}`} className="bg-[#12244e] border border-blue-800/30 rounded-2xl shadow-xl p-7">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-600 rounded-full w-11 h-11 flex items-center justify-center text-2xl font-bold text-white border border-blue-300/30">
                  {r.name[0]}
                </div>
                <span className="font-bold text-blue-50 text-lg">{r.name}</span>
                <span className="ml-auto text-yellow-300 text-xl">★★★★★</span>
              </div>
              <div className="text-blue-50">{r.text}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <a
            href="/reviews"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg border border-blue-700"
          >
            More Reviews
          </a>
        </div>
      </Section>

      {/* ---------- POLLS (canonical) ---------- */}
      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-white font-serif tracking-tight">Pricing Polls</h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-6">
          See what riders value most on price—features, timing, trip length, and more.
        </p>
        <div className="w-full">
          <HomePolls groups={[{ tag: "pricing", label: "Pricing" }]} pickSize={24} visiblePerGroup={3} />
        </div>
      </Section>

      {/* ---------- EVENTS ---------- */}
      <Section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl my-12 py-12 px-6 border border-blue-800/30">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-white font-serif tracking-tight">Events We Serve</h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-8">
          Pick an occasion—get tips, timelines, and the best vehicles for the job.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {events.map((e) => (
            <a
              key={e}
              href={`/events/${slug(e)}`}
              className="block text-center bg-[#12244e] border border-blue-800/30 rounded-xl py-4 font-semibold text-blue-100 hover:text-white"
            >
              {e}
            </a>
          ))}
        </div>
      </Section>
    </>
  );
}
