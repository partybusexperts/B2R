"use client";

import Link from "next/link";

type Socials = Partial<{
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
}>;

type FooterProps = {
  phoneDisplay?: string;
  phoneTel?: string;
  email?: string;
  socials?: Socials;
};

const defaultSocials: Socials = {
  facebook: "https://www.facebook.com/yourpage",
  // instagram: "https://www.instagram.com/yourhandle",
  // tiktok: "https://www.tiktok.com/@yourhandle",
  // youtube: "https://www.youtube.com/@yourchannel",
};

export default function Footer({
  phoneDisplay = "(888) 535-2566",
  phoneTel = "8885352566",
  email = "info@bus2ride.com",
  socials = defaultSocials,
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-blue-900/20 bg-gradient-to-b from-[#0f2148] to-[#132c5f] text-blue-50">
      {/* Top CTA strip */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 py-6">
          <h3 className="text-xl md:text-2xl font-extrabold tracking-tight">
            Ready to roll? Get a quote in seconds.
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <a
              href={`tel:${phoneTel}`}
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-bold bg-white text-blue-900 border border-blue-200 hover:bg-blue-50 transition"
              aria-label={`Call ${phoneDisplay}`}
            >
              📞 Call {phoneDisplay}
            </a>
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-bold bg-blue-700 text-white border border-blue-800 hover:bg-blue-800 transition"
            >
              ✉️ Email Us
            </a>
            <Link
              href="/quote#instant"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-bold bg-blue-900 text-white border border-blue-900 hover:bg-blue-950 transition"
            >
              ⚡ Instant Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid gap-10 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Social */}
          <div>
            <div className="text-2xl font-extrabold tracking-tight">Bus2Ride</div>
            <p className="text-blue-200/90 mt-2">
              Premium party buses, limos, and shuttles. Clean rides, pro drivers, fast quotes.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {Object.entries(socials)
                .filter(([, url]) => !!url)
                .map(([name, url]) => (
                  <a
                    key={name}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-blue-800/40 bg-blue-900/30 hover:bg-blue-900/60 transition"
                    title={capitalize(name)}
                  >
                    {getIcon(name)}
                  </a>
                ))}
            </div>

            <ul className="mt-4 text-sm text-blue-200/80 space-y-1">
              <li>
                <a href={`tel:${phoneTel}`} className="hover:text-blue-100">
                  {phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="hover:text-blue-100">
                  {email}
                </a>
              </li>
              <li>Serving the greater metro area</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <div className="font-bold text-white mb-3">Quick Links</div>
            <ul className="space-y-2 text-blue-200/90">
              <li><Link href="/party-buses" className="hover:text-blue-100">Party Buses</Link></li>
              <li><Link href="/limos" className="hover:text-blue-100">Limousines</Link></li>
              <li><Link href="/shuttles" className="hover:text-blue-100">Shuttle Buses</Link></li>
              <li><Link href="/events" className="hover:text-blue-100">Events</Link></li>
              <li><Link href="/tools" className="hover:text-blue-100">Tools</Link></li>
              <li><Link href="/polls" className="hover:text-blue-100">Polls</Link></li>
              <li><Link href="/polls/results" className="hover:text-blue-100">Poll Results</Link></li>
              <li><Link href="/reviews" className="hover:text-blue-100">Reviews</Link></li>
              <li><Link href="/contact" className="hover:text-blue-100">Contact</Link></li>
            </ul>
          </div>

          {/* Popular Services */}
          <div>
            <div className="font-bold text-white mb-3">Popular Services</div>
            <ul className="space-y-2 text-blue-200/90">
              <li><Link href="/events/weddings" className="hover:text-blue-100">Weddings</Link></li>
              <li><Link href="/events/proms" className="hover:text-blue-100">Proms</Link></li>
              <li><Link href="/events/bachelor" className="hover:text-blue-100">Bachelor / Bachelorette</Link></li>
              <li><Link href="/events/concerts" className="hover:text-blue-100">Concerts</Link></li>
              <li><Link href="/events/sporting" className="hover:text-blue-100">Sporting Events</Link></li>
              <li><Link href="/events/night-out" className="hover:text-blue-100">Night Out</Link></li>
            </ul>
          </div>

          {/* Hours & Legal */}
          <div>
            <div className="font-bold text-white mb-3">Hours</div>
            <ul className="space-y-1 text-blue-200/90">
              <li>Mon–Thu: 9am–9pm</li>
              <li>Fri–Sat: 9am–12am</li>
              <li>Sun: 10am–6pm</li>
            </ul>
            <div className="font-bold text-white mt-5 mb-2">Legal</div>
            <ul className="space-y-2 text-blue-200/90">
              <li><Link href="/privacy" className="hover:text-blue-100">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-100">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-blue-900/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 text-sm text-blue-200/80 flex flex-col md:flex-row items-center justify-between gap-3">
          <span>© {year} Bus2Ride. All rights reserved.</span>
          <span className="opacity-80">Licensed & insured • Professional drivers</span>
        </div>
      </div>
    </footer>
  );
}

function capitalize(s: string) {
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}

function getIcon(name: string) {
  const common = "h-5 w-5 fill-blue-100/90 group-hover:fill-white transition";
  switch (name) {
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07C2 17.1 5.66 21.21 10.44 22v-7.01H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.19 2.23.19v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.99h-2.34V22C18.34 21.21 22 17.1 22 12.07z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className={common}><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3a5 5 0 110 10 5 5 0 010-10zm0 2.2a2.8 2.8 0 100 5.6 2.8 2.8 0 000-5.6zM18 6.5a1 1 0 110 2 1 1 0 010-2z"/></svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" className={common}><path d="M21 8.3a7.1 7.1 0 01-4.2-1.4v7.2a5.6 5.6 0 11-4.8-5.6v2.6a3 3 0 00-1.4-.3 3 3 0 103 3V2h2.2a5 5 0 004.2 3.8V8.3z"/></svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" className={common}><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.3 3.5 12 3.5 12 3.5s-7.3 0-9.4.6A3 3 0 00.5 6.2 31 31 0 000 12a31 31 0 00.5 5.8 3 3 0 002.1 2.1c2.1.6 9.4.6 9.4.6s7.3 0 9.4-.6a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.8zM9.7 15.5v-7l6.2 3.5-6.2 3.5z"/></svg>
      );
    default:
      return <span className="text-sm">#</span>;
  }
}