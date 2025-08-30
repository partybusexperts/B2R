"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import PollCardPro from "@/components/PollCardPro";

type Poll = { id: string; question: string; options: string[]; tags?: string[]; active?: boolean; };
type PollsPayload = { polls: Poll[]; votes: Record<string, Record<string, number>> };

// Performance tracking
function trackApiCall(endpoint: string, startTime: number) {
  const duration = performance.now() - startTime;
  console.log(`🚀 API ${endpoint}: ${duration.toFixed(1)}ms`);
  return duration;
}

// Optimized fetch with performance tracking and compression support
async function fetchAll(): Promise<PollsPayload> {
  const startTime = performance.now();
  const r = await fetch("/api/poll", { 
    cache: "no-store",
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache'
    }
  });
  if (!r.ok) throw new Error("Failed to load polls");
  
  const data = await r.json();
  trackApiCall('/api/poll', startTime);
  
  console.log(`📊 Loaded ${data.polls?.length || 0} polls`);
  // This page is statically generated at build time and revalidated hourly
  export const revalidate = 3600;

  import path from 'node:path';
  import { promises as fs } from 'node:fs';
  import ClientPolls from '@/components/ClientPolls';

  type Poll = { id: string; question: string; options: string[]; tags?: string[]; active?: boolean; };

  export default async function PollsPage() {
    // Load canonical registry JSON at build time
    const filePath = path.join(process.cwd(), 'data', 'pollsRegistry.json');
    const raw = await fs.readFile(filePath, 'utf8');
    const polls: Poll[] = JSON.parse(raw);
  
    return <ClientPolls polls={polls} />;
  }
          if (e.key === "ArrowUp") { e.preventDefault(); setIdx(i => Math.max(i - 1, 0)); }
          if (e.key === "Enter" && suggestions[idx]) { e.preventDefault(); onSelect(suggestions[idx]); setOpen(false); }
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder="Search polls, topics, or tags…"
        className="w-full rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white placeholder-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
      {open && suggestions.length > 0 && (
        <div className="absolute z-20 left-0 right-0 mt-2 bg-[#12244e] border border-blue-800/40 rounded-2xl shadow-xl overflow-hidden">
          {suggestions.map((p, i) => (
            <button
              key={p.id}
              onClick={() => { onSelect(p); setOpen(false); }}
              className={`w-full text-left px-4 py-3 text-blue-100 hover:bg-[#0f1f46] ${i === idx ? "bg-[#0f1f46]" : ""}`}
            >
              <div className="font-semibold">{p.question}</div>
              {p.tags?.length ? <div className="text-xs text-blue-300 mt-1">{p.tags.map(pretty).join(" • ")}</div> : null}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CategorySelect({ allTags, value, onChange }: { allTags: string[]; value: string; onChange: (v: string) => void; }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full md:w-[320px] rounded-full px-6 py-4 text-lg bg-[#12244e] border border-blue-800/30 text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
      >
        <option value="">All Categories</option>
        {allTags.map((t) => <option key={t} value={t}>{pretty(t)}</option>)}
      </select>
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-blue-200">▾</div>
    </div>
  );
}

function Rail({ children }: { children: React.ReactNode }) { return (<div className="overflow-x-auto no-scrollbar"><div className="flex gap-4 min-w-max">{children}</div></div>); }

export default function PollsPage() {
  const [data, setData] = useState<PollsPayload | null>(null);
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const toast = useToast();
  const [overrideBoards, setOverrideBoards] = useState<string[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetchAll().then((d) => { if (alive) setData(d); }).catch(() => toast.push("Failed to load polls"));
    const sp = new URLSearchParams(window.location.search);
    const b = sp.get("boards");
    if (b) setOverrideBoards(b.split(",").map(s => s.trim().toLowerCase()).filter(Boolean).slice(0,3));
    const tag = sp.get("tag"); if (tag) setSelectedTag(tag);
    return () => { alive = false; };
  }, []);

  const allTags = useMemo(() => { if (!data?.polls) return []; const set = new Set<string>(); data.polls.forEach((p) => (p.tags || []).forEach((t) => set.add(t))); return Array.from(set).sort((a, b) => pretty(a).localeCompare(pretty(b))); }, [data?.polls]);

  const onSelectSuggestion = (p: Poll) => { const el = document.getElementById(`poll-${p.id}`); if (el) el.scrollIntoView({ behavior: "smooth", block: "center" }); };

  const boards = useMemo(() => {
    if (!data?.polls) return [] as { tag: string; polls: Poll[]; featured: Poll[] }[];
    const active = data.polls.filter(p => p.active !== false);
    const byTag = new Map<string, Poll[]>();
    active.forEach(p => (p.tags || []).forEach(t => { const k = t.toLowerCase(); const arr = byTag.get(k) || []; arr.push(p); byTag.set(k, arr); }));

    let chosen = overrideBoards ?? ["pricing", "fleet", "wedding"].filter(t => byTag.has(t));
    if (chosen.length < 3) {
      const rest = Array.from(byTag.entries()).sort((a,b) => b[1].length - a[1].length).map(([t]) => t).filter(t => !chosen.includes(t));
      chosen = chosen.concat(rest).slice(0,3);
    } else { chosen = chosen.slice(0,3); }

    const used = new Set<string>();
    const fromSession = (tag: string) => { try { const key = `b2r_polls_featured_${tag}`; const ids = JSON.parse(sessionStorage.getItem(key) || "[]") as string[]; return ids; } catch { return []; } };
    const toSession = (tag: string, ids: string[]) => { try { sessionStorage.setItem(`b2r_polls_featured_${tag}`, JSON.stringify(ids)); } catch (e) { console.warn('Session storage error:', e); } };

    const mk = (tag: string) => {
      const pool = (byTag.get(tag) || []).filter(p => !used.has(p.id));
      let featured: Poll[] = [];
      const prev = fromSession(tag);
      if (prev.length) {
        const map = new Map(pool.map(p => [p.id, p]));
        featured = prev.map(id => map.get(id)).filter(Boolean) as Poll[];
      }
      if (featured.length < 3) {
        const need = 3 - featured.length;
        const extra = sample(pool.filter(p => !featured.find(f => f.id === p.id)), need);
        featured = featured.concat(extra);
        toSession(tag, featured.map(p => p.id));
      }
      featured.forEach(p => used.add(p.id));
      const remaining = pool.filter(p => !featured.find(f => f.id === p.id));
      return { tag, featured, rest: shuffle(remaining) };
    };

    return chosen.map(mk);
  }, [data?.polls, overrideBoards]);

  if (!data) {
    return (
      <main className="min-h-screen w-full text-white bg-[#0f1f46]">
        <section className="relative overflow-hidden min-h-[520px] flex flex-col items-center justify-center text-center py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-blue-600 to-indigo-900" />
          <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold mb-4 font-serif">Polls</h1>
          <p className="relative z-10 text-xl md:text-2xl text-blue-50">Loading polls…</p>
        </section>
      </main>
    );
  }

  const searchMatch = (p: Poll) => { const q = query.trim().toLowerCase(); if (!q) return true; return p.question.toLowerCase().includes(q) || (p.tags || []).some(t => pretty(t).toLowerCase().includes(q)); };

  return (
    <main className="min-h-screen w-full text-white bg-[#0f1f46]">
      <section className="relative overflow-hidden min-h-[520px] md:min-h-[600px] flex flex-col items-center justify-center text-center py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-blue-600 to-indigo-900" />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 mix-blend-overlay pointer-events-none" />
        <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold mb-6 tracking-tight font-serif text-white drop-shadow-[0_6px_20px_rgba(0,0,0,.35)]">The Internet’s Party-Ride Poll Hub</h1>
        <p className="relative z-10 text-2xl md:text-3xl max-w-4xl mx-auto mb-8 text-blue-50 font-medium drop-shadow">Add your voice. See what thousands think about prom rides, wedding shuttles, party buses, and more.</p>
        <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center w-full max-w-3xl">
          <a href="/quote" className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] bg-white/95 text-blue-900 hover:bg-white border-blue-200">Get Instant Quote</a>
          <a href="/fleet" className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] bg-blue-600 text-white hover:bg-blue-700 border-blue-700">🚌 View Fleet</a>
          <a href="mailto:info@bus2ride.com" className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] bg-blue-800 text-white hover:bg-blue-900 border-blue-900">✉️ Contact Us</a>
        </div>
        <div className="absolute bottom-[-1px] left-0 right-0">
          <svg viewBox="0 0 1440 110" className="w-full h-[110px]" preserveAspectRatio="none"><path d="M0,80 C240,130 480,20 720,60 C960,100 1200,40 1440,80 L1440,120 L0,120 Z" fill="#122a56" /></svg>
        </div>
      </section>

      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl -mt-10 mb-8 py-8 px-6 border border-blue-800/30">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-white font-serif tracking-tight mb-2">Be a Data Hero</h2>
        <p className="text-blue-100/90 text-center max-w-4xl mx-auto">Your votes power transparent pricing for everyone. We share aggregated insights with students, planners, bloggers, and industry pros. No accounts. No spam. Just answers.</p>
      </section>

      <section className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl mb-10 py-6 px-6 border border-blue-800/30">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <AutoComplete polls={data.polls} value={query} onChange={setQuery} onSelect={onSelectSuggestion} />
          <CategorySelect allTags={allTags} value={selectedTag} onChange={setSelectedTag} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {[("pricing"),("fleet"),("wedding"),("prom"),("birthday"),("concert"),("airport"),("policy"),("comfort")].map((t) => (
            <button key={t} type="button" onClick={() => setSelectedTag(t)} className="px-4 py-2 rounded-full bg-[#12244e] border border-blue-800/30 text-blue-100 hover:text-white hover:border-blue-500">{pretty(t)}</button>
          ))}
          <button onClick={() => setSelectedTag("")} className="px-4 py-2 rounded-full bg-white text-blue-900 font-semibold border border-blue-200 hover:bg-blue-50">All Categories</button>
        </div>
      </section>

      <section className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {boards.map((board) => {
            const { tag } = board; const title = pretty(tag);
            const featured = board.featured.filter((p: Poll) => !selectedTag || (p.tags || []).map((x: string) => x.toLowerCase()).includes(selectedTag.toLowerCase())).filter((p: Poll) => { const q = query.trim().toLowerCase(); if (!q) return true; return p.question.toLowerCase().includes(q) || (p.tags||[]).some((t: string) => pretty(t).toLowerCase().includes(q)); });
            const rest = board.rest.filter((p: Poll) => !selectedTag || (p.tags || []).map((x: string) => x.toLowerCase()).includes(selectedTag.toLowerCase())).filter((p: Poll) => { const q = query.trim().toLowerCase(); if (!q) return true; return p.question.toLowerCase().includes(q) || (p.tags||[]).some((t: string) => pretty(t).toLowerCase().includes(q)); });

            return (
              <div key={tag} id={`board-${slug(tag)}`} className="bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl p-6 border border-blue-800/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-extrabold text-white font-serif tracking-tight">{title}</h3>
                  <a href={`/polls?tag=${encodeURIComponent(tag)}`} className="text-blue-200 underline hover:text-blue-50 text-sm">See all</a>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {featured.map((p: Poll) => (<PollCardPro key={p.id} poll={p} initialCounts={data.votes[p.id] || {}} />))}
                </div>
                {rest.length > 0 && (
                  <div className="mt-5">
                    <div className="text-blue-200 text-sm mb-2">More in {title}</div>
                    <Rail>
                      {rest.map((p: Poll) => (
                        <div key={p.id} className="min-w-[320px] max-w-[360px]"><PollCardPro poll={p} initialCounts={data.votes[p.id] || {}} /></div>
                      ))}
                    </Rail>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-6xl mx-auto my-12 bg-gradient-to-br from-[#122a5c] to-[#0f2148] rounded-3xl shadow-xl py-10 px-6 border border-blue-800/30 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white font-serif tracking-tight mb-3">Live Insights</h2>
        <p className="text-blue-100/90 mb-6">Curious where the crowd is leaning? Explore combined results across every poll.</p>
        <a href="/poll-results" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl text-lg border border-blue-700">See All Results</a>
      </section>

      {toast.msg && (<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"><div className="px-4 py-2 rounded-xl bg-white text-blue-900 font-semibold shadow-lg border border-blue-200">{toast.msg}</div></div>)}
    </main>
  );
}

