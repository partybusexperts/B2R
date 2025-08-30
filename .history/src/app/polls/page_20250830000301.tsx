import path from 'path';
import { promises as fs } from 'fs';
import type { PollReg } from '@/data/pollsRegistry';
import ClientPolls from '@/components/ClientPolls';

// Revalidate page every hour (3600 seconds)
export const revalidate = 3600;

// Server Component: load polls registry JSON at build time
export default async function PollsPage() {
  const filePath = path.join(process.cwd(), 'data', 'pollsRegistry.json');
  const raw = await fs.readFile(filePath, 'utf8');
  const polls = JSON.parse(raw) as PollReg[];
  
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

  import path from 'node:path';
  import { promises as fs } from 'node:fs';
  import type { PollReg as Poll } from '@/data/pollsRegistry';
  import ClientPolls from '@/components/ClientPolls';

  // Revalidate this page every hour
  export const revalidate = 3600;

  export default async function PollsPage() {
    // Load the pre-generated JSON registry at build time
    const filePath = path.join(process.cwd(), 'data', 'pollsRegistry.json');
    const raw = await fs.readFile(filePath, 'utf8');
    const polls = JSON.parse(raw) as Poll[];
  
    // Delegate rendering to client-side component
    return <ClientPolls polls={polls} />;
  }

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

    // Server Component: statically generated, loads polls JSON at build time
    import path from 'path';
    import { promises as fs } from 'fs';
    import ClientPolls from '@/components/ClientPolls';

    // Revalidate this page every hour
    export const revalidate = 3600;

    export default async function PollsPage() {
      // Read the pre-generated JSON registry file
      const filePath = path.join(process.cwd(), 'data', 'pollsRegistry.json');
      const raw = await fs.readFile(filePath, 'utf8');
      const polls = JSON.parse(raw);
  
      // Delegate rendering to a lightweight client component
      return <ClientPolls polls={polls} />;
    }
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

