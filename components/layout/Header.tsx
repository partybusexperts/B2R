"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/lib/nav";

export function Header() {
  const pathname = usePathname();
  const headerItems = mainNav.filter((item) => item.showInHeader);

  return (
    <header className="border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="rounded-full bg-black px-2 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Bus2Ride
          </span>
          <span className="hidden text-sm text-gray-700 sm:inline">
            Party Bus & Limo Nationwide
          </span>
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          {headerItems.map((item) => {
            const active = item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "text-sm font-medium transition hover:text-black " +
                  (active ? "text-black underline" : "text-gray-700")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/quote"
          className="rounded-full px-4 py-2 text-xs font-semibold shadow-sm md:text-sm"
        >
          Get Instant Quote
        </Link>
      </div>
    </header>
  );
}
