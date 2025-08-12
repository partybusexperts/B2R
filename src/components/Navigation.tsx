// src/components/Navigation.tsx

import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="bg-blue-700 text-white py-4 shadow">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-wide">Bus2Ride</Link>
        <ul className="flex gap-6 text-sm md:text-base font-medium">
          <li><Link href="/" className="hover:text-blue-200 transition">Home</Link></li>
          <li><Link href="/fleet" className="hover:text-blue-200 transition">Fleet</Link></li>
          <li><Link href="/events" className="hover:text-blue-200 transition">Events</Link></li>
          <li><Link href="/pricing" className="hover:text-blue-200 transition">Pricing</Link></li>
          <li><Link href="/locations" className="hover:text-blue-200 transition">Locations</Link></li>
          <li><Link href="/polls" className="hover:text-blue-200 transition">Polls and Data</Link></li>
          <li><Link href="/tools" className="hover:text-blue-200 transition">Tools</Link></li>
          <li><Link href="/contact" className="hover:text-blue-200 transition">Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
}
