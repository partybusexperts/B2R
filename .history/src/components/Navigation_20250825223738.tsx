// src/components/Navigation.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type OpenKey = "fleet" | "resources" | null;

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState<OpenKey>(null);

  // Close any open dropdown when the route changes
  useEffect(() => {
    setOpen(null);
  }, [pathname]);

  const openMenu = useCallback((key: OpenKey) => setOpen(key), []);
  const closeMenu = useCallback(() => setOpen(null), []);

  const handleTriggerKey = (e: React.KeyboardEvent<HTMLButtonElement>, key: OpenKey) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((prev) => (prev === key ? null : key));
    } else if (e.key === "Escape") {
      closeMenu();
      (e.target as HTMLButtonElement).blur();
    } else if (e.key === "ArrowDown") {
      // move focus to first item when opening via keyboard
      const firstItem = document.querySelector<HTMLAnchorElement>(`[data-menu="${key}"] a`);
      if (firstItem) firstItem.focus();
    }
  };

  const Caret = () => (
    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );

  const MenuContainer: React.FC<{
    label: string;
    k: Extract<OpenKey, "fleet" | "resources">;
    children: React.ReactNode;
  }> = ({ label, k, children }) => (
    <li
      className="relative"
      onMouseEnter={() => openMenu(k)}
      onMouseLeave={closeMenu}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open === k}
        onClick={() => setOpen((prev) => (prev === k ? null : k))}
        onKeyDown={(e) => handleTriggerKey(e, k)}
        className="hover:text-blue-200 transition flex items-center gap-1 cursor-pointer select-none outline-none"
      >
        {label}
        <Caret />
      </button>

      {/* Dropdown */}
      <ul
        data-menu={k}
        role="menu"
        className={`absolute left-0 mt-2 min-w-[14rem] bg-white text-blue-900 rounded shadow-lg border border-blue-200 z-50 transition
        ${open === k ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1"}`}
      >
        {children}
      </ul>
    </li>
  );

  // Common class for items; onClick closes instantly
  const itemCls = "block px-4 py-2 hover:bg-blue-100";
  const handleItemClick = () => closeMenu();

  return (
    <nav className="bg-blue-700 text-white py-4 shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-wide">Bus2Ride</Link>

        <ul className="flex gap-6 text-sm md:text-base font-medium items-center">
          <li><Link href="/" className="hover:text-blue-200 transition">Home</Link></li>

          <MenuContainer label="Fleet" k="fleet">
            <li role="none">
              <Link href="/party-buses" className={itemCls} role="menuitem" onClick={handleItemClick}>
                Party Buses
              </Link>
            </li>
            <li role="none">
              <Link href="/limousines" className={itemCls} role="menuitem" onClick={handleItemClick}>
                Limousines
              </Link>
            </li>
            <li role="none">
              <Link href="/coach-buses" className={itemCls} role="menuitem" onClick={handleItemClick}>
                Coach Buses
              </Link>
            </li>
          </MenuContainer>

          <li><Link href="/events" className="hover:text-blue-200 transition">Events</Link></li>
          <li><Link href="/pricing" className="hover:text-blue-200 transition">Pricing</Link></li>
          <li><Link href="/locations" className="hover:text-blue-200 transition">Locations</Link></li>
          <li><Link href="/polls" className="hover:text-blue-200 transition">Limo Polls & Surveys</Link></li>

          <MenuContainer label="Resources" k="resources">
            <li role="none">
              <Link href="/blog" className={itemCls} role="menuitem" onClick={handleItemClick}>
                Blog
              </Link>
            </li>
            <li role="none">
              <Link href="/tools" className={itemCls} role="menuitem" onClick={handleItemClick}>
                Tools
              </Link>
            </li>
            <li role="none">
              <Link href="/industry-secrets" className={itemCls} role="menuitem" onClick={handleItemClick}>
                Industry Secrets
              </Link>
            </li>
            <li role="none">
              <Link href="/poll-results" className={itemCls} role="menuitem" onClick={handleItemClick}>
                Poll Results
              </Link>
            </li>
            <li role="none">
              <Link href="/reviews" className={itemCls} role="menuitem" onClick={handleItemClick}>
                Reviews
              </Link>
            </li>
          </MenuContainer>

          <li><Link href="/contact" className="hover:text-blue-200 transition">Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
}
