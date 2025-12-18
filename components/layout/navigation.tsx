"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// --- Types ---
type OpenKey = "fleet" | "resources" | null;
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
  ],
  resources: [
    { label: "Blog", href: "/blog" },
    { label: "Tools", href: "/tools" },
    { label: "FAQ", href: "/faq" },
    { label: "Industry Secrets", href: "/industry-secrets" },
    { label: "Poll Results", href: "/polls/results" },
    { label: "Reviews", href: "/reviews" },
  ],
};

const NAV_ENTRIES: NavEntry[] = [
  { type: "link", label: "Home", href: "/" },
  { type: "dropdown", key: "fleet", label: "Fleet" },
  { type: "link", label: "Events", href: "/events" },
  { type: "link", label: "Pricing", href: "/pricing" },
  { type: "link", label: "Locations", href: "/locations" },
  { type: "link", label: "Polls", href: "/polls" },
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
      <Link href={label === "Fleet" ? "/fleet" : "#"}>
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
          border-blue-200 bg-popover p-2 shadow-lg transition-all duration-200`,
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
  }) => (
    <div
      className="overflow-hidden rounded-xl border border-border/50
        bg-background/50"
    >
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3 text-base
          font-medium"
        onClick={() =>
          setMobileExpanded((cur) => (cur === entry.key ? null : entry.key))
        }
        aria-expanded={mobileExpanded === entry.key}
      >
        <span
          className={
            mobileExpanded === entry.key ? "text-primary" : "text-foreground"
          }
        >
          {entry.label}
        </span>
        <Caret className={mobileExpanded === entry.key ? "rotate-180" : ""} />
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          mobileExpanded === entry.key
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0",
        )}
      >
        <ul className="flex flex-col bg-muted/30 pb-2">
          {DROPDOWN_ITEMS[entry.key].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block border-l-2 border-transparent px-6 py-2.5
                  text-sm text-muted-foreground transition-colors
                  hover:border-primary hover:text-primary"
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
    <header
      className="sticky top-0 z-50 bg-[#1E4ED8]
        supports-[backdrop-filter]:bg-[#1E4ED8]"
    >
      <div className="mx-auto flex h-16 items-center justify-between px-60">
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
            className="text-muted-foreground"
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
          `fixed inset-x-0 top-16 z-40 overflow-hidden border-b border-border/40
          bg-background transition-all duration-300 md:hidden`,
          isMobileMenuOpen
            ? "max-h-[85vh] opacity-100 shadow-xl"
            : "max-h-0 opacity-0",
        )}
      >
        <div
          className="flex flex-col space-y-3 p-4 overflow-y-auto max-h-[80vh]"
        >
          {NAV_ENTRIES.map((entry) => {
            if (entry.type === "link") {
              return (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className={cn(
                    `block rounded-xl border border-transparent bg-muted/40 px-4
                    py-3 text-base font-medium transition-colors
                    hover:bg-muted/60`,
                    pathname === entry.href
                      ? "text-primary border-primary/20 bg-primary/5"
                      : "text-foreground",
                  )}
                  onClick={closeNow}
                >
                  {entry.label}
                </Link>
              );
            }
            return <MobileAccordion key={entry.key} entry={entry} />;
          })}

          <div className="pt-4 mt-2 border-t border-border/40">
            <Button
              className="w-full font-bold shadow-lg shadow-primary/20"
              size="lg"
              asChild
            >
              <Link href="/quote" onClick={closeNow}>
                Get a Quote
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
