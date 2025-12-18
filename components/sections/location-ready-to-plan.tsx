import { LocationsData } from "@/lib/data/locations";
import Link from "next/link";

export default async function LocationReadyToPlan({
  location,
}: {
  location: LocationsData;
}) {
  return (
    <section
      className="relative py-16 px-4 bg-gradient-to-br from-blue-800
        via-blue-900 to-black"
    >
      <div className="max-w-5xl mx-auto text-center py-6">
        <h2
          className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight
            font-serif bg-gradient-to-r from-white via-blue-200 to-blue-500
            bg-clip-text text-transparent"
          id={`ready-for-${location.city_name}-transport-done-right-12`}
        >
          Ready for {location.city_name} Transport Done Right?
        </h2>
        <p className="text-blue-100/90 mb-6">
          Lock preferred vehicles early—peak cruise Saturdays &amp; holiday
          aurora windows go fast. Book now and enjoy transparent pricing,
          flexible add-ons, and an operations team that treats your group like
          VIPs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="rounded-full bg-white text-blue-900 font-bold px-8 py-4
              text-lg shadow-lg hover:bg-blue-50 transition"
          >
            Instant Quote
          </Link>
          <Link
            href="/fleet"
            className="rounded-full bg-blue-700 text-white font-bold px-8 py-4
              text-lg shadow-lg hover:bg-blue-800 transition"
          >
            View Fleet
          </Link>
          <Link
            href="tel:8885352566"
            className="rounded-full bg-blue-900 text-white font-bold px-8 py-4
              text-lg shadow-lg hover:bg-black transition"
          >
            Call (888) 535-2566
          </Link>
        </div>
        <p className="text-[11px] text-blue-300 mt-6">
          Need multi-day / remote itinerary support? Include all legs + gear
          notes. Prefer email? Reach our {location.city_name} dispatch at{" "}
          <Link href="mailto:info@bus2ride.com" className="underline">
            info@bus2ride.com
          </Link>{" "}
          and we will respond with a tailored plan.
        </p>
        <div className="mt-6 text-blue-200 text-sm max-w-3xl mx-auto">
          <p className="leading-relaxed">
            If you want to read more, visit our{" "}
            <Link className="underline" href="/reviews">
              customer reviews
            </Link>{" "}
            and the{" "}
            <Link
              className="underline"
              href={`/locations/${location.state_slug}/party-buses-${location.city_slug}`}
            >
              {location.city_name} hub
            </Link>{" "}
            resources. For partner and venue references, see{" "}
            <Link
              href={`https://www.${location.city_slug}.net`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {location.city_slug}.net
            </Link>{" "}
            and{" "}
            <Link
              href={`https://www.${location.state_slug}railroad.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {location.state_slug}railroad.com
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
