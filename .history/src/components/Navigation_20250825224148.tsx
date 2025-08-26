// src/components/Navigation.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type OpenKey = "fleet" | "resources" | null;

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState<OpenKey>(null);

  // Close on route change
  useEffect(() => setOpen(null), [pathname]);

  // Close on Esc
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

  const Dropdown: React.FC<{
    label: string;
    k: Extract<OpenKey, "fleet" | "resources">;
    children: React.ReactNode;
  }> = ({ label, k, children }) => (
    <li
      className="relative"
      onMouseEnter={() => setOpen(k)}
      onMouseLeave={() => setOpen(null)}
      onFocus={() => setOpen(k)} // keyboard focus anywhere inside <li> opens
      onBlur={(e) => {
        // only close if focus left the entire <li> (trigger + menu)
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(null);
      }}
    >
      {/* Trigger (no click) */}
      <div
        className="hover:text-blue-200 transition flex items-center gap-1 cursor-default select-none"
        aria-haspopup="menu"
        aria-expanded={open === k}
        tabIndex={0}
      >
        {label}
        <Caret />
      </div>

      {/* Menu */}
      <ul
        role="menu"
        className={`absolute left-0 mt-2 min-w-[14rem] bg-white text-blue-900 rounded shadow-lg border border-blue-200 z-50
        transition ${open === k ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1"}`}
      >
        {children}
      </ul>
    </li>
  );

  return (
    <nav className="bg-blue-700 text-white py-4 shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-wide">Bus2Ride</Link>

        <ul className="flex gap-6 text-sm md:text-base font-medium items-center">
          <li><Link href="/" className="hover:text-blue-200 transition">Home</Link></li>

          {/* Fleet (hover-only) */}
          <Dropdown label="Fleet" k="fleet">
            <li><Link href="/party-buses" className={itemCls} onClick={closeNow}>Party Buses</Link></li>
            <li><Link href="/limousines" className={itemCls} onClick={closeNow}>Limousines</Link></li>
            <li><Link href="/coach-buses" className={itemCls} onClick={closeNow}>Coach Buses</Link></li>
          </Dropdown>

          <li><Link href="/events" className="hover:text-blue-200 transition">Events</Link></li>
          <li><Link href="/pricing" className="hover:text-blue-200 transition">Pricing</Link></li>
          <li><Link href="/locations" className="hover:text-blue-200 transition">Locations</Link></li>
          <li><Link href="/polls" className="hover:text-blue-200 transition">Limo Polls & Surveys</Link></li>

          {/* Resources (hover-only) */}
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
