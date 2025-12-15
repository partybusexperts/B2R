"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";

/**
 * ScrollUtilities: combines
 *  - Back-to-top circular progress button
 *  - Mini TOC pill with scroll spy
 *  - Adaptive CTA dock (Quote / Call / Email / Top) hiding when footer/hero in view
 */

interface TocSection {
  id: string;
  label: string;
  el: HTMLElement;
}

// Deterministic slug generator (no Math.random) so SSR/CSR match if headings present server-side
function slugify(base: string, index: number): string {
  const core =
    base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section";
  return `${core}-${index}`;
}

// Helper to find candidate sections (data-section-title or h2 elements)
function collectSections(max = 30): TocSection[] {
  if (typeof document === "undefined") return [];
  const nodes: { el: HTMLElement; label: string }[] = [];
  Array.from(
    document.querySelectorAll<HTMLElement>("[data-section-title]"),
  ).forEach((el) => {
    const label = (el.dataset.sectionTitle || el.innerText || "")
      .trim()
      .slice(0, 80);
    if (label) nodes.push({ el, label });
  });
  Array.from(document.querySelectorAll<HTMLElement>("main h2")).forEach(
    (el) => {
      const raw = (el.innerText || "")
        .replace(/#[^]*$/, "")
        .trim()
        .slice(0, 80);
      if (raw) nodes.push({ el, label: raw });
    },
  );
  const seen = new Set<string>();
  const sections: TocSection[] = [];
  nodes.forEach((n, idx) => {
    if (sections.length >= max) return;
    const candidate = slugify(n.label, idx);
    let finalId = candidate;
    let dupe = 1;
    // Ensure uniqueness within this client-side run without touching DOM attributes
    while (seen.has(finalId)) {
      finalId = candidate + "-" + ++dupe;
    }
    if (!seen.has(finalId)) {
      seen.add(finalId);
      sections.push({ id: finalId, label: n.label, el: n.el });
    }
  });
  return sections;
}

// UI thresholds and timings
const TOP_BUTTON_SCROLL_THRESHOLD = 520; // show back-to-top after this Y offset
const CTA_DOCK_SHOW_SCROLL = 800; // show CTA dock after this Y offset
const CTA_DOCK_IDLE_MS = 1600; // dock visibility debounce

function getScrollProgressPercent(): number {
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const scrollHeight = doc.scrollHeight - doc.clientHeight;
  return scrollHeight > 0 ? scrollTop / scrollHeight : 0;
}

function getDocumentScrollTop(): number {
  const doc = document.documentElement;
  return doc.scrollTop || document.body.scrollTop || 0;
}

function useSections() {
  const [sections, setSections] = useState<TocSection[]>([]);
  useEffect(() => {
    const timeouts: number[] = [];
    [300, 1200, 2600].forEach((ms) => {
      timeouts.push(
        window.setTimeout(() => setSections(collectSections()), ms),
      );
    });
    const refresh = () => setSections(collectSections());
    window.addEventListener("refresh-sections", refresh as EventListener);
    return () => {
      timeouts.forEach((t) => clearTimeout(t));
      window.removeEventListener("refresh-sections", refresh as EventListener);
    };
  }, []);
  return sections;
}

function useActiveSection(sections: TocSection[]) {
  const [activeId, setActiveId] = useState<string | null>(null);
  useEffect(() => {
    if (!sections.length) return;
    const idByEl = new Map<Element, string>(
      sections.map((s) => [s.el as Element, s.id]),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = idByEl.get(e.target);
            if (id) setActiveId(id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 1] },
    );
    sections.forEach((s) => {
      if (s.el) observer.observe(s.el);
    });
    return () => observer.disconnect();
  }, [sections]);
  return activeId;
}

function useDockVisibility(lastScrollYRef: React.MutableRefObject<number>) {
  const [dockVisible, setDockVisible] = useState(false);
  const idleRef = useRef<number | null>(null);
  useEffect(() => {
    const onScroll = () => {
      const y = getDocumentScrollTop();
      lastScrollYRef.current = y;
      if (!dockVisible && y > CTA_DOCK_SHOW_SCROLL) setDockVisible(true);
      if (dockVisible) {
        if (idleRef.current) clearTimeout(idleRef.current);
        idleRef.current = window.setTimeout(() => {
          setDockVisible(getDocumentScrollTop() > CTA_DOCK_SHOW_SCROLL);
        }, CTA_DOCK_IDLE_MS);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [dockVisible, lastScrollYRef]);

  // Hide dock when footer is visible
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setDockVisible(false);
          } else if (lastScrollYRef.current > CTA_DOCK_SHOW_SCROLL) {
            setDockVisible(true);
          }
        });
      },
      { threshold: 0.05 },
    );
    io.observe(footer);
    return () => io.disconnect();
  }, [lastScrollYRef]);

  return { dockVisible };
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const pct = getScrollProgressPercent();
      const y = getDocumentScrollTop();
      setProgress(pct);
      setShowTop(y > TOP_BUTTON_SCROLL_THRESHOLD);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return { progress, showTop };
}

function BackToTopButton({
  progress,
  showTop,
  onTop,
}: {
  progress: number;
  showTop: boolean;
  onTop: () => void;
}) {
  return (
    <button
      aria-label="Back to top"
      onClick={onTop}
      className={`fixed z-[140] bottom-6 right-6 h-14 w-14 rounded-full
        bg-primary text-primary-foreground shadow-lg border-2 border-border flex
        items-center justify-center transition-opacity ${
          showTop ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
    >
      <svg viewBox="0 0 36 36" className="h-12 w-12 -rotate-90 absolute">
        <path
          className="text-primary/20"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32"
        />
        <path
          className="text-success"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${Math.max(4, Math.min(100, progress * 100))}, 100`}
          d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32"
        />
      </svg>
      <span className="relative font-bold text-lg">↑</span>
    </button>
  );
}

function MiniToc({
  sections,
  activeId,
  onSelect,
}: {
  sections: TocSection[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  if (sections.length <= 2) return null;
  const currentLabel = activeId
    ? sections.find((s) => s.id === activeId)?.label.slice(0, 24) || "Sections"
    : "Sections";
  return (
    <div
      className="fixed z-[140] top-1/2 -translate-y-1/2 right-2 sm:right-3 flex
        flex-col items-end gap-3"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Open page sections"
        className="rounded-full bg-muted/60 backdrop-blur px-4 py-2
          text-foreground text-xs font-semibold shadow border border-border
          hover:bg-muted"
      >
        {currentLabel} ▾
      </button>
      {open && (
        <div
          className="w-56 max-h-[60vh] overflow-auto rounded-2xl bg-secondary/90
            backdrop-blur shadow-2xl border border-border p-2 space-y-1 text-sm"
        >
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                onSelect(s.id);
                setOpen(false);
              }}
              className={`block w-full text-left rounded-lg px-3 py-2
              hover:bg-primary/20 focus:bg-primary/25 outline-none ${
                s.id === activeId
                  ? "bg-primary/25 text-primary-foreground font-semibold"
                  : "text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CtaDock({ visible, onTop }: { visible: boolean; onTop: () => void }) {
  return (
    <div
      className={`fixed z-[140] right-6 bottom-24 sm:bottom-28 flex flex-col
        gap-3 transition-opacity ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      aria-hidden={!visible}
    >
      <button
        onClick={onTop}
        className="rounded-xl bg-primary text-primary-foreground px-4 py-2
          text-sm font-bold shadow border border-border hover:bg-primary/90"
      >
        Top
      </button>
      <a
        href="/quote#instant"
        className="rounded-xl bg-success text-success-foreground px-4 py-2
          text-sm font-bold shadow border border-success/40 hover:bg-success/90"
      >
        Quote
      </a>
      <a
        href="tel:8885352566"
        className="rounded-xl bg-card text-foreground px-4 py-2 text-sm
          font-bold shadow border border-border hover:bg-muted"
      >
        Call
      </a>
      <a
        href="mailto:info@bus2ride.com"
        className="rounded-xl bg-secondary text-secondary-foreground px-4 py-2
          text-sm font-bold shadow border border-border hover:bg-secondary/90"
      >
        Email
      </a>
    </div>
  );
}

const ScrollUtilities: React.FC = () => {
  const sections = useSections();
  const activeId = useActiveSection(sections);
  const lastScrollYRef = useRef(0);
  const { dockVisible } = useDockVisibility(lastScrollYRef);
  const { progress, showTop } = useScrollProgress();

  const scrollTo = useCallback((id?: string) => {
    if (!id) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // Find the element from the latest sections without relying on DOM id
    const current = collectSections();
    const match = current.find((s) => s.id === id);
    const el = match?.el;
    if (el) {
      const offset = 100; // Navbar height + buffer
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <>
      <BackToTopButton
        progress={progress}
        showTop={showTop}
        onTop={() => scrollTo()}
      />
      <MiniToc
        sections={sections}
        activeId={activeId}
        onSelect={(id) => scrollTo(id)}
      />
      <CtaDock visible={dockVisible} onTop={() => scrollTo()} />
    </>
  );
};

export default ScrollUtilities;
