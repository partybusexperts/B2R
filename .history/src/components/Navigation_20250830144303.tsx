// src/components/Navigation.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import * as NextLink from "next/link";
// next/link may be exported as a default or named export depending on bundler interop.
const Link: typeof NextLink.default = (NextLink as any).default ?? (NextLink as any);
import { usePathname } from "next/navigation";

type OpenKey = "fleet" | "resources" | null;

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState<OpenKey>(null);

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
  useEffect(() => setOpen(null), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const Caret = () => (
    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );

  const itemCls = "block px-4 py-2 hover:bg-blue-100";
  const closeNow: React.MouseEventHandler<HTMLAnchorElement> = () => setOpen(null);

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

  return (
    <nav className="bg-blue-700 text-white py-4 shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-wide">Bus2Ride</Link>

        <ul className="flex gap-6 text-sm md:text-base font-medium items-center">
          <li><Link href="/" className="hover:text-blue-200 transition">Home</Link></li>

          {/* Fleet (hover-only, gap-safe) */}
          <Dropdown label="Fleet" k="fleet">
            <li><Link href="/party-buses" className={itemCls} onClick={closeNow}>Party Buses</Link></li>
            <li><Link href="/limousines" className={itemCls} onClick={closeNow}>Limousines</Link></li>
            <li><Link href="/coach-buses" className={itemCls} onClick={closeNow}>Coach Buses</Link></li>
          </Dropdown>

          <li><Link href="/events" className="hover:text-blue-200 transition">Events</Link></li>
          <li><Link href="/pricing" className="hover:text-blue-200 transition">Pricing</Link></li>
          <li><Link href="/locations" className="hover:text-blue-200 transition">Locations</Link></li>
          <li><Link href="/polls" className="hover:text-blue-200 transition">Limo Polls & Surveys</Link></li>

          {/* Resources (hover-only, gap-safe) */}
          <Dropdown label="Resources" k="resources">
            <li><Link href="/blog" className={itemCls} onClick={closeNow}>Blog</Link></li>
            <li><Link href="/tools" className={itemCls} onClick={closeNow}>Tools</Link></li>
            <li><Link href="/industry-secrets" className={itemCls} onClick={closeNow}>Industry Secrets</Link></li>
            <li><Link href="/poll-results" className={itemCls} onClick={closeNow}>Poll Results</Link></li>
            <li><Link href="/reviews" className={itemCls} onClick={closeNow}>Reviews</Link></li>
          </Dropdown>

          <li><Link href="/contact" className="hover:text-blue-200 transition">Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
}
