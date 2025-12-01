// src/components/Navigation.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import * as NextLink from "next/link";
// next/link may be exported as a default or named export depending on bundler interop.
const Link: typeof NextLink.default = (NextLink as any).default ?? (NextLink as any);
import { usePathname } from "next/navigation";

type OpenKey = "fleet" | "resources" | null;

type DropdownKey = Exclude<OpenKey, null>;

type DropdownItem = { label: string; href: string };

type NavEntry =
  | { type: "link"; label: string; href: string }
  | { type: "dropdown"; key: DropdownKey; label: string };

const DROPDOWN_ITEMS: Record<DropdownKey, DropdownItem[]> = {
  fleet: [
    { label: "Party Buses", href: "/party-buses" },
    { label: "Limousines", href: "/limousines" },
    { label: "Coach Buses", href: "/coach-buses" },
  ],
  resources: [
    { label: "Blog", href: "/blog" },
    { label: "Tools", href: "/tools" },
    { label: "FAQ", href: "/faq" },
    { label: "Industry Secrets", href: "/industry-secrets" },
    { label: "Poll Results", href: "/poll-results" },
    { label: "Reviews", href: "/reviews" },
  ],
};

const NAV_ENTRIES: NavEntry[] = [
  { type: "link", label: "Home", href: "/" },
  { type: "dropdown", key: "fleet", label: "Fleet" },
  { type: "link", label: "Events", href: "/events" },
  { type: "link", label: "Pricing", href: "/pricing" },
  { type: "link", label: "Locations", href: "/locations" },
  { type: "link", label: "Limo Polls & Surveys", href: "/polls" },
  { type: "dropdown", key: "resources", label: "Resources" },
  { type: "link", label: "Contact", href: "/contact" },
];

export default function Navigation() {
  const pathname = usePathname();
  // Hide server-rendered header fallback after client hydrates to avoid duplicate navs
  useEffect(() => {
    const el = document.getElementById('server-main-header');
    if (el) {
      // Prefer to set aria-hidden and visually hide to avoid reflow issues
      el.setAttribute('aria-hidden', 'true');
      el.style.display = 'none';
    }
    return () => {
      // no-op on unmount; leave removed
    };
  }, []);
  const [open, setOpen] = useState<OpenKey>(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<OpenKey>(null);

  // timers to prevent flicker when moving from trigger -> submenu
  const timers = useRef<Record<Exclude<OpenKey, null>, number | null>>({
    fleet: null,
    resources: null,
  });

  const clearTimer = (k: Exclude<OpenKey, null>) => {
    if (timers.current[k]) {
      window.clearTimeout(timers.current[k]!);
      timers.current[k] = null;
    }
  };
  const closeWithDelay = (k: Exclude<OpenKey, null>, delay = 120) => {
    clearTimer(k);
    timers.current[k] = window.setTimeout(() => {
      setOpen((cur) => (cur === k ? null : cur));
      timers.current[k] = null;
    }, delay);
  };

  // Close on route change & on Esc
  useEffect(() => {
    setOpen(null);
    setMobileMenuOpen(false);
    setMobileExpanded(null);
  }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
        setMobileExpanded(null);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const Caret = () => (
    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );

  const itemCls = "block px-4 py-2 hover:bg-blue-100";
  const closeNow: React.MouseEventHandler<HTMLAnchorElement> = () => {
    setOpen(null);
    setMobileMenuOpen(false);
    setMobileExpanded(null);
  };

  type DropdownProps = {
    label: string;
    k: Exclude<OpenKey, null>;
    children: React.ReactNode;
  };

  const Dropdown = ({ label, k, children }: DropdownProps) => {
    return (
      <li className="relative">
        {/* Trigger: hover/focus opens; no click */}
        <div
          className="hover:text-blue-200 transition flex items-center gap-1 cursor-default select-none"
          role="button"
          tabIndex={0}
          aria-haspopup="menu"
          aria-expanded={open === k}
          onMouseEnter={() => {
            clearTimer(k);
            setOpen(k);
          }}
          onMouseLeave={() => {
            // start a short delay; if user enters submenu, it will cancel
            closeWithDelay(k);
          }}
          onFocus={() => setOpen(k)}
        >
          {label}
          <Caret />
        </div>

        {/* Submenu: it cancels the close timer on enter, closes on leave */}
        <ul
          role="menu"
          className={`absolute left-0 mt-2 min-w-[14rem] bg-white text-blue-900 rounded shadow-lg border border-blue-200 z-50
          transition ${open === k ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1"}`}
          onMouseEnter={() => {
            clearTimer(k);
            setOpen(k);
          }}
          onMouseLeave={() => closeWithDelay(k)}
          // Keyboard users: keep open while focusing inside; close when leaving the whole menu
          onFocus={() => setOpen(k)}
          onBlur={(e) => {
            const next = e.relatedTarget as Node | null;
            if (!e.currentTarget.contains(next)) setOpen(null);
          }}
        >
          {children}
        </ul>
      </li>
    );
  };

  const mobileAccordion = (entry: Extract<NavEntry, { type: "dropdown" }>) => (
    <div key={entry.key} className="border border-white/10 rounded-2xl">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 font-semibold"
        onClick={() => setMobileExpanded((cur) => (cur === entry.key ? null : entry.key))}
        aria-expanded={mobileExpanded === entry.key}
      >
        <span>{entry.label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${mobileExpanded === entry.key ? "rotate-180" : "rotate-0"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-[max-height] duration-300 ${
          mobileExpanded === entry.key ? "max-h-96" : "max-h-0"
        }`}
      >
        <ul className="bg-blue-900/40 text-sm">
          {DROPDOWN_ITEMS[entry.key].map((item) => (
            <li key={item.href} className="border-t border-white/5">
              <Link
                href={item.href}
                className="block px-5 py-3"
                onClick={closeNow}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <nav className="bg-blue-700 text-white shadow sticky top-0 z-[60]">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-wide">Bus2Ride</Link>

        <button
          type="button"
          className="md:hidden inline-flex items-center gap-2 px-4 py-2 border border-white/30 rounded-full text-sm font-semibold"
          onClick={() => setMobileMenuOpen((cur) => !cur)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav"
        >
          Menu
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <ul className="hidden md:flex gap-6 text-sm md:text-base font-medium items-center">
          {NAV_ENTRIES.map((entry) => {
            if (entry.type === "link") {
              return (
                <li key={entry.href}>
                  <Link href={entry.href} className="hover:text-blue-200 transition" onClick={closeNow}>
                    {entry.label}
                  </Link>
                </li>
              );
            }
            return (
              <Dropdown key={entry.key} label={entry.label} k={entry.key}>
                {DROPDOWN_ITEMS[entry.key].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={itemCls} onClick={closeNow}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </Dropdown>
            );
          })}
        </ul>
      </div>

      <div
        id="mobile-nav"
        className={`md:hidden border-t border-blue-500/40 bg-blue-800/95 backdrop-blur-sm transition-[max-height,opacity] duration-300 overflow-hidden ${
          isMobileMenuOpen ? "max-h-[90vh] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 py-4 flex flex-col gap-3">
          {NAV_ENTRIES.map((entry) => {
            if (entry.type === "link") {
              return (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className="block px-4 py-3 rounded-2xl bg-blue-900/30 border border-white/10 font-semibold"
                  onClick={closeNow}
                >
                  {entry.label}
                </Link>
              );
            }
            return mobileAccordion(entry);
          })}
        </div>
      </div>
    </nav>
  );
}
