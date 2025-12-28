"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { openLiveChat } from "@/lib/livechat";

// --- Types ---
type OpenKey = "fleet" | "resources" | "polls" | null;
type DropdownKey = Exclude<OpenKey, null>;
type DropdownItem = { label: string; href: string };
type NavEntry =
  | { type: "link"; label: string; href: string }
  | { type: "dropdown"; key: DropdownKey; label: string };

// --- Configuration ---
const DROPDOWN_ITEMS: Record<DropdownKey, DropdownItem[]> = {
  fleet: [
    { label: "Party Buses", href: "/party-buses" },
    { label: "Limousines", href: "/limousines" },
    { label: "Coach Buses", href: "/coach-buses" },
    { label: "View All Fleet", href: "/fleet" },
  ],
  polls: [
    { label: "Browse Polls", href: "/polls" },
    { label: "Hot Results", href: "/polls/results" },
  ],
  resources: [
    { label: "Blog", href: "/blog" },
    { label: "Planning Tools", href: "/tools" },
    { label: "FAQ", href: "/faq" },
    { label: "Industry Secrets", href: "/industry-secrets" },
    { label: "Customer Reviews", href: "/reviews" },
  ],
};

const NAV_ENTRIES: NavEntry[] = [
  { type: "link", label: "Home", href: "/" },
  { type: "dropdown", key: "fleet", label: "Fleet" },
  { type: "link", label: "Events", href: "/events" },
  { type: "link", label: "Pricing", href: "/pricing" },
  { type: "link", label: "Locations", href: "/locations" },
  { type: "dropdown", key: "polls", label: "Polls" },
  { type: "dropdown", key: "resources", label: "Resources" },
  { type: "link", label: "Contact", href: "/contact" },
];

// --- Components ---

const Caret = ({ className }: { className?: string }) => (
  <svg
    className={cn("h-4 w-4 transition-transform duration-200", className)}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const MenuIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    {isOpen ? (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16M4 12h16M4 18h16"
      />
    )}
  </svg>
);

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState<OpenKey>(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<OpenKey>(null);

  // Timer refs for hover intent
  const timers = useRef<Record<DropdownKey, number | null>>({
    fleet: null,
    polls: null,
    resources: null,
  });

  // Legacy header cleanup (if needed by your specific project setup)
  useEffect(() => {
    const el = document.getElementById("server-main-header");
    if (el) {
      el.setAttribute("aria-hidden", "true");
      el.style.display = "none";
    }
  }, []);

  // Reset state on navigation
  useEffect(() => {
    setOpen(null);
    setMobileMenuOpen(false);
    setMobileExpanded(null);
  }, [pathname]);

  // Handle escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll on mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isMobileMenuOpen]);

  // Handle resize
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

  // --- Logic Helpers ---

  const clearTimer = (k: DropdownKey) => {
    if (timers.current[k]) {
      window.clearTimeout(timers.current[k]!);
      timers.current[k] = null;
    }
  };

  const closeWithDelay = (k: DropdownKey, delay = 150) => {
    clearTimer(k);
    timers.current[k] = window.setTimeout(() => {
      setOpen((cur) => (cur === k ? null : cur));
      timers.current[k] = null;
    }, delay);
  };

  const closeNow = () => {
    setOpen(null);
    setMobileMenuOpen(false);
    setMobileExpanded(null);
  };

  // --- Sub-Components ---

  const DesktopDropdown = ({
    label,
    k,
    children,
  }: {
    label: string;
    k: DropdownKey;
    children: React.ReactNode;
  }) => (
    <li className="relative">
      <Link href={label === "Fleet" ? "/fleet" : label === "Polls" ? "/polls" : "#"}>
        <div
          className={cn(
            `flex cursor-pointer items-center gap-1 px-3 py-2 text-md
            font-medium transition-colors`,
            open === k ? "text-blue-200" : "text-white hover:text-blue-200",
          )}
          role="button"
          tabIndex={0}
          aria-haspopup="menu"
          aria-expanded={open === k}
          onMouseEnter={() => {
            clearTimer(k);
            setOpen(k);
          }}
          onMouseLeave={() => closeWithDelay(k)}
          onFocus={() => setOpen(k)}
        >
          {label}
          <Caret className={open === k ? "rotate-180" : ""} />
        </div>
      </Link>

      <ul
        role="menu"
        className={cn(
          `absolute left-0 top-full z-50 mt-1 min-w-[14rem] rounded-md border
          border-blue-200 bg-[#fffafc] p-2 shadow-lg transition-all
          duration-200`,
          open === k
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0",
        )}
        onMouseEnter={() => {
          clearTimer(k);
          setOpen(k);
        }}
        onMouseLeave={() => closeWithDelay(k)}
      >
        {children}
      </ul>
    </li>
  );

  const MobileAccordion = ({
    entry,
  }: {
    entry: Extract<NavEntry, { type: "dropdown" }>;
  }) => {
    const gradients: Record<DropdownKey, string> = {
      fleet: "from-pink-500/20 to-purple-500/20",
      polls: "from-indigo-500/20 to-blue-500/20", 
      resources: "from-emerald-500/20 to-teal-500/20",
    };
    const borderColors: Record<DropdownKey, string> = {
      fleet: "border-pink-500/30",
      polls: "border-indigo-500/30",
      resources: "border-emerald-500/30",
    };
    const activeColors: Record<DropdownKey, string> = {
      fleet: "text-pink-400",
      polls: "text-indigo-400",
      resources: "text-emerald-400",
    };

    return (
      <div
        className={cn(
          "overflow-hidden rounded-xl border transition-all",
          mobileExpanded === entry.key
            ? cn("bg-gradient-to-r", gradients[entry.key], borderColors[entry.key])
            : "border-white/10 bg-white/5"
        )}
      >
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-3.5 text-base font-semibold"
          onClick={() =>
            setMobileExpanded((cur) => (cur === entry.key ? null : entry.key))
          }
          aria-expanded={mobileExpanded === entry.key}
        >
          <span
            className={
              mobileExpanded === entry.key ? activeColors[entry.key] : "text-white"
            }
          >
            {entry.label}
          </span>
          <Caret className={cn(
            "transition-transform duration-200",
            mobileExpanded === entry.key ? "rotate-180" : "",
            mobileExpanded === entry.key ? activeColors[entry.key] : "text-white/60"
          )} />
        </button>

        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            mobileExpanded === entry.key
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0",
          )}
        >
          <ul className="flex flex-col gap-1 px-2 pb-3">
            {DROPDOWN_ITEMS[entry.key].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block rounded-lg px-4 py-2.5 text-sm font-medium",
                    "text-white/80 bg-black/20 transition-all",
                    "hover:bg-white/10 hover:text-white"
                  )}
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
  };

  return (
    <header
      className="sticky top-0 z-50 bg-[#1E4ED8]
        supports-[backdrop-filter]:bg-[#1E4ED8]"
    >
      <div className="mx-auto flex h-16 items-center justify-between px-4 md:px-8 lg:px-16 xl:px-24">
        {/* Logo */}
        <Link
          href="/"
          className="mr-6 flex items-center space-x-2"
          onClick={closeNow}
        >
          <span className="font-bold text-lg tracking-wide text-white">
            Bus2Ride
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:gap-1">
          <ul className="flex items-center gap-1">
            {NAV_ENTRIES.map((entry) => {
              if (entry.type === "link") {
                return (
                  <li key={entry.href}>
                    <Link
                      href={entry.href}
                      className={cn(
                        `block px-3 py-2 text-md font-medium transition-colors
                        hover:text-blue-200`,
                        pathname === entry.href
                          ? "text-blue-300 hover:text-blue-200"
                          : "text-white",
                      )}
                      onClick={closeNow}
                    >
                      {entry.label}
                    </Link>
                  </li>
                );
              }
              return (
                <DesktopDropdown
                  key={entry.key}
                  label={entry.label}
                  k={entry.key}
                >
                  {DROPDOWN_ITEMS[entry.key].map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block rounded-sm px-3 py-2 text-sm
                          text-blue-900 hover:bg-[#DBEAFE]"
                        onClick={closeNow}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </DesktopDropdown>
              );
            })}
          </ul>
        </nav>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Added a Quote button for mobile visibility is often good, 
                but keeping strictly to nav for now */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen((cur) => !cur)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
            className="text-white hover:text-blue-200 hover:bg-white/10"
          >
            <span className="sr-only">Toggle menu</span>
            <MenuIcon isOpen={isMobileMenuOpen} />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      <div
        id="mobile-nav"
        className={cn(
          "fixed inset-x-0 top-16 z-40 overflow-hidden transition-all duration-300 md:hidden",
          "bg-gradient-to-b from-[#0a1628] to-[#0d1d3a] border-b border-white/10",
          isMobileMenuOpen
            ? "max-h-[85vh] opacity-100 shadow-2xl"
            : "max-h-0 opacity-0",
        )}
      >
        <div className="flex flex-col gap-2 p-4 overflow-y-auto max-h-[80vh]">
          {NAV_ENTRIES.map((entry) => {
            if (entry.type === "link") {
              return (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className={cn(
                    "block rounded-xl px-4 py-3.5 text-base font-semibold transition-all",
                    pathname === entry.href
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      : "text-white border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20",
                  )}
                  onClick={closeNow}
                >
                  {entry.label}
                </Link>
              );
            }
            return <MobileAccordion key={entry.key} entry={entry} />;
          })}

          <div className="pt-4 mt-2 border-t border-white/10">
            <Button
              className="w-full font-bold text-base py-6 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 
                hover:brightness-110 shadow-lg shadow-pink-500/25 border-0"
              size="lg"
              onClick={() => { closeNow(); openLiveChat("Mobile Nav", window.location.pathname); }}
            >
              Get Instant Quote
            </Button>
            <a
              href="tel:8885352566"
              className="flex items-center justify-center gap-2 mt-3 w-full py-3 rounded-xl 
                border border-white/20 text-white font-medium hover:bg-white/10 transition-all"
              onClick={closeNow}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call (888) 535-2566
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
