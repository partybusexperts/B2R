
import React from "react";
import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="bg-blue-700 text-white py-4 shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-wide">Bus2Ride</Link>
        <ul className="flex gap-6 text-sm md:text-base font-medium">
          <li><Link href="/" className="hover:text-blue-200 transition">Home</Link></li>
          <li className="relative group hover:z-50 focus-within:z-50">
            <div className="hover:text-blue-200 transition flex items-center gap-1 cursor-pointer select-none">
              Fleet
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </div>
            <ul
              className="absolute left-0 mt-2 min-w-[14rem] bg-white text-blue-900 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50 border border-blue-200"
            >
              <li>
                <Link href="/party-buses" className="block px-4 py-2 hover:bg-blue-100">Party Buses</Link>
              </li>
              <li>
                <Link href="/limousines" className="block px-4 py-2 hover:bg-blue-100">Limousines</Link>
              </li>
              <li>
                <Link href="/coach-buses" className="block px-4 py-2 hover:bg-blue-100">Coach Buses</Link>
              </li>
            </ul>
          </li>
          <li><Link href="/events" className="hover:text-blue-200 transition">Events</Link></li>
          <li><Link href="/pricing" className="hover:text-blue-200 transition">Pricing</Link></li>
          <li><Link href="/locations" className="hover:text-blue-200 transition">Locations</Link></li>
            <li><Link href="/polls" className="hover:text-blue-200 transition">Limo Polls & Surveys</Link></li>
          <li className="relative group hover:z-50 focus-within:z-50">
            <div className="hover:text-blue-200 transition flex items-center gap-1 cursor-pointer select-none">
              Resources
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </div>
            <ul
              className="absolute left-0 mt-2 min-w-[14rem] bg-white text-blue-900 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50 border border-blue-200"
            >
              <li>
                <Link href="/blog" className="block px-4 py-2 hover:bg-blue-100">Blog</Link>
              </li>
              <li>
                <Link href="/tools" className="block px-4 py-2 hover:bg-blue-100">Tools</Link>
              </li>
              <li>
                <Link href="/poll-results" className="block px-4 py-2 hover:bg-blue-100">Poll Results</Link>
              </li>
              <li>
                <Link href="/reviews" className="block px-4 py-2 hover:bg-blue-100">Reviews</Link>
              </li>
            </ul>
          </li>
          <li><Link href="/contact" className="hover:text-blue-200 transition">Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
}
