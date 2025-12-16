import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="grid gap-8 md:grid-cols-[3fr,2fr] md:items-center">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Party bus & limo booking that doesn&apos;t stress you out.
          </h1>
          <p className="max-w-xl text-sm text-gray-700 sm:text-base">
            Tell us your date, city, and headcount. We match you with vetted vehicles,
            build in drive time, and send clear quotes you can actually understand.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/quote"
              className="rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm"
            >
              Get Instant Quote
            </Link>
            <Link
              href="/locations"
              className="text-sm font-medium text-gray-800 underline"
            >
              Browse locations
            </Link>
          </div>

          <ul className="mt-4 grid gap-2 text-xs text-gray-600 sm:text-sm">
            <li>• Nationwide coverage in major metros</li>
            <li>• Wedding, prom, birthdays, corporate & more</li>
            <li>• Real humans double-check your trip details</li>
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="rounded-xl bg-gray-900 p-4 text-xs text-gray-100">
            {/* Placeholder for “instant quote” widget or hero image */}
            <p className="text-[10px] uppercase tracking-wide text-gray-400">
              Sample trip
            </p>
            <p className="mt-1 text-sm font-semibold">
              Downtown pickup • 20 passenger bus • 4 hours
            </p>
            <p className="mt-2 text-xs text-gray-300">
              We’ll factor in traffic, venue load-in, and drive time to/from your
              pickup so you aren’t rushed.
            </p>
            <div className="mt-4 rounded-xl bg-gray-800 p-3 text-xs">
              <div className="flex items-center justify-between">
                <span>Estimated package</span>
                <span className="font-semibold">$XXX–$XXX</span>
              </div>
              <p className="mt-1 text-[11px] text-gray-300">
                Exact numbers depend on vehicle, date, and city. Agent will finalize
                and send options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: How it works */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold sm:text-2xl">How Bus2Ride works</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-4 text-sm shadow-sm">
            <h3 className="font-semibold">1. Tell us your trip</h3>
            <p className="mt-2 text-gray-700">
              City, date, time window, headcount, and any must-have stops. The more
              details you give us, the better we can match vehicles.
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 text-sm shadow-sm">
            <h3 className="font-semibold">2. We match vehicles & pricing</h3>
            <p className="mt-2 text-gray-700">
              Behind the scenes we look at availability, drive time, and season to
              build options that actually make sense for your night.
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 text-sm shadow-sm">
            <h3 className="font-semibold">3. You confirm & relax</h3>
            <p className="mt-2 text-gray-700">
              You pick the option you like, we lock in the reservation, send
              confirmations, and keep you updated leading up to the event.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Popular ways people use us */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold sm:text-2xl">Popular trips</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-4 text-sm shadow-sm">
            <h3 className="font-semibold">Weddings</h3>
            <p className="mt-2 text-gray-700">
              Shuttles for guests, wedding party buses, and late-night getaway
              vehicles. Built around your timeline and venues.
            </p>
            <Link
              href="/events"
              className="mt-2 inline-block text-xs font-semibold underline"
            >
              See wedding options
            </Link>
          </div>
          <div className="rounded-xl bg-white p-4 text-sm shadow-sm">
            <h3 className="font-semibold">Prom & school events</h3>
            <p className="mt-2 text-gray-700">
              Safe, chaperone-friendly prom packages with clear rules and schedules
              so parents aren&apos;t guessing.
            </p>
            <Link
              href="/events"
              className="mt-2 inline-block text-xs font-semibold underline"
            >
              See prom options
            </Link>
          </div>
          <div className="rounded-xl bg-white p-4 text-sm shadow-sm">
            <h3 className="font-semibold">Birthdays & nights out</h3>
            <p className="mt-2 text-gray-700">
              Downtown bar crawls, concerts, and birthday loops without anyone
              having to drive or park.
            </p>
            <Link
              href="/events"
              className="mt-2 inline-block text-xs font-semibold underline"
            >
              See party ideas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
