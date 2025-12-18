import { LocationsData } from "@/lib/data/locations";
import Link from "next/link";

export default function LocationCompleteGuide({
  location,
}: {
  location: LocationsData;
}) {
  return (
    <section
      className="relative py-16 px-4 max-w-7xl mx-auto bg-gradient-to-br
        from-blue-900/80 to-black rounded-3xl shadow-xl border
        border-blue-500/30 py-12 px-6 mb-16 bg-gradient-to-b from-blue-900/90
        to-black"
    >
      <h2
        className="text-3xl md:text-4xl font-extrabold text-center mb-6
          font-serif tracking-tight bg-gradient-to-r from-white via-blue-200
          to-blue-500 bg-clip-text text-transparent"
        id={`complete-guide-to-party-bus-service-in-${location.city_slug}-4`}
      >
        Complete Guide to Party Bus Service in {location.city_name}
      </h2>
      <p className="text-blue-100/90 leading-relaxed mb-4">
        {location.city_name} is the logistical heart of Southcentral{" "}
        {location.state_name} and a natural launch point for group travel:
        cruise transfers, Glacier National Park day trips, aurora chases,
        corporate shuttles, weddings, and seasonal festivals. A party bus gives
        groups a single, comfortable vehicle that keeps everyone together,
        simplifies coordination, and reduces the number of drivers and vehicles
        you must manage when staging multiple pickup points.
      </p>
      <p className="text-blue-100/90 leading-relaxed mb-4">
        When planning with a party bus, think in trip modules: pickup and
        staging windows, luggage and gear capacity, scheduled photo stops and
        unscheduled scenic detours, and the drive-time buffers needed for{" "}
        {location.state_name}
        winter conditions. Our team pre-fills these considerations during the{" "}
        <a className="underline" href="/quote#instant">
          instant quote
        </a>{" "}
        process so the confirmation you get is operationally realistic and
        minimizes last-minute changes.
      </p>
      <p className="text-blue-100/90 leading-relaxed mb-4">
        Common use cases we dispatch in {location.city_name} include hotel →
        Port transfers for cruise passengers, airport shuttles timed to gate and
        baggage windows, aurora charters that leave late and pivot when clouds
        shift, and private night-out groups who want premium sound and lighting
        aboard. For planning tools, compare models and layout options with the{" "}
        <Link className="underline" href="/tools">
          Tools
        </Link>{" "}
        page and then lock the right vehicle on our{" "}
        <Link className="underline" href="/fleet">
          Fleet
        </Link>{" "}
        listing.
      </p>
      <p className="text-blue-100/90 leading-relaxed mb-4">
        If you need official venue or route information, check the{" "}
        {location.city_name}
        visitor site (
        <Link
          href={`https://www.${location.city_slug}.net`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {location.city_slug}.net
        </Link>
        ) or the {location.state_name} Railroad for train‑transfer connections (
        <Link
          href={`https://www.${location.state_slug}railroad.com`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {location.state_slug}railroad.com
        </Link>
        ). For port timing at Whittier and related port notices, consult local
        port resources before finalizing photo stops.
      </p>
    </section>
  );
}
