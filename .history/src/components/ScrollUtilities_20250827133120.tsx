"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';

/**
 * ScrollUtilities: combines
 *  - Back-to-top circular progress button
 *  - Mini TOC pill with scroll spy
 *  - Adaptive CTA dock (Quote / Call / Email / Top) hiding when footer/hero in view
 */

interface TocSection { id: string; label: string; }

// Deterministic slug generator (no Math.random) so SSR/CSR match if headings present server-side
function slugify(base: string, index: number): string {
  return (
    base.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')</n+      .replace(/^-+|-+$/g, '') || 'section'
  ) + '-' + index;
}

// Helper to find candidate sections (data-section-title or h2 elements)
function collectSections(max = 30): TocSection[] {
  if (typeof document === 'undefined') return [];
  const nodes: { el: HTMLElement; label: string }[] = [];
  Array.from(document.querySelectorAll<HTMLElement>('[data-section-title]')).forEach(el => {
    const label = (el.dataset.sectionTitle || el.innerText || '').trim().slice(0,80);
    if (label) nodes.push({ el, label });
  });
  Array.from(document.querySelectorAll<HTMLElement>('main h2')).forEach(el => {
    const raw = (el.innerText || '').replace(/#[^]*$/, '').trim().slice(0,80);
    if (raw) nodes.push({ el, label: raw });
  });
  const seen = new Set<string>();
  const sections: TocSection[] = [];
  nodes.forEach((n, idx) => {
    if (sections.length >= max) return;
    if (!n.el.id) {
      const candidate = slugify(n.label, idx);
      let finalId = candidate;
      let dupe = 1;
      while (document.getElementById(finalId)) {
        finalId = candidate + '-' + (++dupe);
      }
      n.el.id = finalId;
    }
    if (!seen.has(n.el.id)) {
      seen.add(n.el.id);
      sections.push({ id: n.el.id, label: n.label });
    }
  });
  return sections;
}

const SCROLL_THRESHOLD = 520;

const ScrollUtilities: React.FC = () => {
  const [progress, setProgress] = useState(0); // 0..1
  const [showTop, setShowTop] = useState(false);
  const [sections, setSections] = useState<TocSection[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tocOpen, setTocOpen] = useState(false);
  const [dockVisible, setDockVisible] = useState(false);
  const idleRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);

  // Collect sections after mount; re-scan a few times for late-loaded client chunks + allow manual refresh
  useEffect(() => {
    const timeouts: number[] = [];
    [300, 1200, 2600].forEach(ms => {
      timeouts.push(window.setTimeout(() => setSections(collectSections()), ms));
    });
    const refresh = () => setSections(collectSections());
    window.addEventListener('refresh-sections', refresh as EventListener);
    return () => {
      timeouts.forEach(t => clearTimeout(t));
      window.removeEventListener('refresh-sections', refresh as EventListener);
    };
  }, []);

  // Scroll listener for progress + visibility
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      const pct = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      setProgress(pct);
      setShowTop(scrollTop > SCROLL_THRESHOLD);
      lastScrollY.current = scrollTop;
      if (!dockVisible && scrollTop > 800) setDockVisible(true);
      if (dockVisible) {
        if (idleRef.current) {
          clearTimeout(idleRef.current);
        }
        idleRef.current = window.setTimeout(() => {
          setDockVisible(scrollTop > 800);
        }, 1600);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [dockVisible]);

  // Scroll spy via IntersectionObserver
  useEffect(() => {
    if (!sections.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) setActiveId(e.target.id);
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: [0, 1] });
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = useCallback((id?: string) => {
    if (!id) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);
  
  // Adaptive dock: hide if footer visible
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setDockVisible(false);
        } else if (lastScrollY.current > 800) {
          setDockVisible(true);
        }
      });
    }, { threshold: 0.05 });
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Back-to-top circular progress */}
      <button
        aria-label="Back to top"
        onClick={() => scrollTo()}
        className={`fixed z-[140] bottom-6 right-6 h-14 w-14 rounded-full bg-blue-700 text-white shadow-lg border-2 border-white/30 flex items-center justify-center transition-opacity ${showTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <svg viewBox="0 0 36 36" className="h-12 w-12 -rotate-90 absolute">
          <path className="text-blue-300/30" stroke="currentColor" strokeWidth="4" fill="none" d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32" />
          <path className="text-emerald-400" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" strokeDasharray={`${Math.max(4, Math.min(100, progress*100))}, 100`} d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32" />
        </svg>
        <span className="relative font-bold text-lg">↑</span>
      </button>

      {/* Mini TOC pill */}
      {sections.length > 2 && (
        <div className="fixed z-[140] top-1/2 -translate-y-1/2 right-2 sm:right-3 flex flex-col items-end gap-3">
          <button
            onClick={() => setTocOpen(o => !o)}
            aria-expanded={tocOpen}
            aria-label="Open page sections"
            className="rounded-full bg-black/40 backdrop-blur px-4 py-2 text-white text-xs font-semibold shadow border border-white/20 hover:bg-black/55"
          >{activeId ? sections.find(s=>s.id===activeId)?.label.slice(0,24) || 'Sections' : 'Sections'} ▾</button>
          {tocOpen && (
            <div className="w-56 max-h-[60vh] overflow-auto rounded-2xl bg-[#0f2246]/95 backdrop-blur shadow-2xl border border-blue-400/30 p-2 space-y-1 text-sm">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => { scrollTo(s.id); setTocOpen(false); }}
                  className={`block w-full text-left rounded-lg px-3 py-2 hover:bg-blue-600/30 focus:bg-blue-600/40 outline-none ${s.id===activeId ? 'bg-blue-500/30 text-white font-semibold' : 'text-blue-100'}`}
                >{s.label}</button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Adaptive CTA dock */}
      <div className={`fixed z-[140] right-6 bottom-24 sm:bottom-28 flex flex-col gap-3 transition-opacity ${dockVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-hidden={!dockVisible}>
        <button onClick={()=>scrollTo()} className="rounded-xl bg-blue-700 text-white px-4 py-2 text-sm font-bold shadow border border-blue-300/40 hover:bg-blue-800">Top</button>
        <a href="/quote#instant" className="rounded-xl bg-emerald-500 text-white px-4 py-2 text-sm font-bold shadow border border-emerald-300/40 hover:bg-emerald-600">Quote</a>
        <a href="tel:8885352566" className="rounded-xl bg-white text-blue-900 px-4 py-2 text-sm font-bold shadow border border-blue-200 hover:bg-blue-50">Call</a>
        <a href="mailto:info@bus2ride.com" className="rounded-xl bg-blue-900 text-white px-4 py-2 text-sm font-bold shadow border border-blue-600 hover:bg-blue-800">Email</a>
      </div>
    </>
  );
};

export default ScrollUtilities;
