"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // ensuring correct alias
import { ThemeSwitcher } from "@/components/theme-switcher";
import { capitalize, cn } from "@/lib/utils";

// Extracted for cleaner render
const SOCIALS = {
  facebook: "https://www.facebook.com/yourpage",
  instagram: "https://www.instagram.com/yourhandle",
  tiktok: "https://www.tiktok.com/@yourhandle",
  youtube: "https://www.youtube.com/@yourchannel",
};

function SocialIcon({ name, className }: { name: string; className?: string }) {
  // Using 'currentColor' allows the parent to control color via text- classes
  const common = cn("h-5 w-5 fill-current transition-colors", className);

  switch (name) {
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07C2 17.1 5.66 21.21 10.44 22v-7.01H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.19 2.23.19v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.99h-2.34V22C18.34 21.21 22 17.1 22 12.07z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3a5 5 0 110 10 5 5 0 010-10zm0 2.2a2.8 2.8 0 100 5.6 2.8 2.8 0 000-5.6zM18 6.5a1 1 0 110 2 1 1 0 010-2z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path d="M21 8.3a7.1 7.1 0 01-4.2-1.4v7.2a5.6 5.6 0 11-4.8-5.6v2.6a3 3 0 00-1.4-.3 3 3 0 103 3V2h2.2a5 5 0 004.2 3.8V8.3z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.3 3.5 12 3.5 12 3.5s-7.3 0-9.4.6A3 3 0 00.5 6.2 31 31 0 000 12a31 31 0 00.5 5.8 3 3 0 002.1 2.1c2.1.6 9.4.6 9.4.6s7.3 0 9.4-.6a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.8zM9.7 15.5v-7l6.2 3.5-6.2 3.5z" />
        </svg>
      );
    default:
      return <span className="text-sm">#</span>;
  }
}

export default function Footer() {
  const [year, setYear] = useState("");

  const contact = {
    phoneDisplay: "(888) 535-2566",
    phoneTel: "8885352566",
    email: "info@bus2ride.com",
  };

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return (
    // Changed bg-background to bg-muted/20 for subtle separation from main content
    <footer className="border-t border-border bg-muted/10 text-foreground">
      {/* Top CTA strip */}
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div
          className="flex flex-col items-center justify-between gap-6 py-8
            lg:flex-row"
        >
          <div className="space-y-1 text-center lg:text-left">
            <h3 className="text-xl font-extrabold tracking-tight md:text-2xl">
              Ready to roll? Get a quote in seconds.
            </h3>
            <p className="text-sm text-muted-foreground">
              No hidden fees. Instant pricing.
            </p>
          </div>

          <div
            className="flex flex-col items-center gap-4 sm:flex-row w-full
              sm:w-auto"
          >
            <ThemeSwitcher />

            {/* ARCHITECTURE NOTE: 
                Use 'variant' props instead of manual class overrides for consistency.
            */}

            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto rounded-xl font-bold"
            >
              <a
                href={`tel:${contact.phoneTel}`}
                aria-label={`Call ${contact.phoneDisplay}`}
              >
                📞 Call {contact.phoneDisplay}
              </a>
            </Button>

            <Button
              asChild
              variant="secondary"
              className="w-full sm:w-auto rounded-xl font-bold"
            >
              <a href={`mailto:${contact.email}`}>✉️ Email Us</a>
            </Button>

            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto rounded-xl font-bold shadow-lg
                shadow-primary/25"
            >
              <Link href="/quote#instant">⚡ Instant Quote</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-border/50" />

      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Social */}
          <div className="space-y-4">
            <div>
              <div
                className="text-2xl font-extrabold tracking-tight text-primary"
              >
                Bus2Ride
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Premium party buses, limos, and shuttles. Clean rides, pro
                drivers, fast quotes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {Object.entries(SOCIALS)
                .filter(([, url]) => !!url)
                .map(([name, url]) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    // Semantic Token usage: hover:bg-primary/10 instead of specific color
                    className="group inline-flex h-10 w-10 items-center
                      justify-center rounded-full border border-border
                      bg-background transition-colors hover:border-primary/50
                      hover:bg-primary/5"
                    title={capitalize(name)}
                  >
                    <SocialIcon
                      name={name}
                      className="text-muted-foreground group-hover:text-primary"
                    />
                  </a>
                ))}
            </div>
            <ul className="mt-4 text-sm text-muted-foreground space-y-1">
              <li>
                <a
                  href={`tel:${contact.phoneTel}`}
                  className="hover:text-foreground"
                >
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-foreground"
                >
                  {contact.email}
                </a>
              </li>
              <li>Serving the greater metro area</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <div className="mb-4 font-bold">Quick Links</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                { label: "Party Buses", href: "/party-buses" },
                { label: "Limousines", href: "/limos" },
                { label: "Coach Buses", href: "/coach-buses" },
                { label: "Events", href: "/events" },
                { label: "tools", href: "/tools" },
                { label: "Polls", href: "/polls" },
                { label: "Poll Results", href: "/polls/results" },
                { label: "Reviews", href: "/reviews" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Services */}
          <div>
            <div className="mb-4 font-bold">Popular Services</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                { label: "Weddings", href: "/events/weddings" },
                { label: "Proms", href: "/events/proms" },
                { label: "Bachelor/ette", href: "/events/bachelor" },
                { label: "Concerts", href: "/events/concerts" },
                { label: "Sporting Events", href: "/events/sporting" },
                { label: "Night Out", href: "/events/night-out" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours & Legal */}
          <div>
            <div className="mb-4 font-bold">Hours</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex justify-between">
                <span>Mon-Thu: 9am - 9pm</span>
              </li>
              <li className="flex justify-between">
                <span>Fri-Sat: 9am - 12am</span>
              </li>
              <li className="flex justify-between">
                <span>Sun: 10am - 6pm</span>
              </li>
            </ul>

            <div className="mt-6 mb-4 font-bold">Legal</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/privacy"
                  className="transition-colors hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="transition-colors hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div
          className="mx-auto flex max-w-7xl flex-col items-center
            justify-between gap-4 px-4 py-6 text-xs text-muted-foreground
            md:flex-row md:px-6"
        >
          <span>© {year || "...."} Bus2Ride. All rights reserved.</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-success"></span>
            Licensed & Insured • DOT Compliant
          </span>
        </div>
      </div>
    </footer>
  );
}
