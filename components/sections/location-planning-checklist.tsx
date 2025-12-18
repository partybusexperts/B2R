import { LocationsData } from "@/lib/data/locations";
import Link from "next/link";

export default function LocationPlanningChecklist({
  location,
}: {
  location: LocationsData;
}) {
  return (
    <section
      className="relative py-16 px-4 max-w-7xl mx-auto bg-gradient-to-br
        from-blue-900/75 to-black rounded-3xl shadow-xl border
        border-blue-500/30 py-12 px-6 mb-16 bg-gradient-to-b from-blue-900/90
        to-black mt-12"
    >
      <h3
        className="text-3xl font-extrabold mb-4 font-serif bg-gradient-to-r
          from-white via-blue-200 to-blue-500 bg-clip-text text-transparent"
      >
        Planning Checklist — What to Include in Your Quote
      </h3>
      <p className="text-blue-100/90 mb-4 leading-relaxed">
        To get an accurate price and a vehicle perfectly matched to your needs,
        include these items in your request: pickup and final return addresses,
        number of passengers, desired pickup windows (with flexibility for
        aurora charters), luggage and gear counts (skis, coolers, camera rigs),
        and any mobility or accessibility needs. Add notes for special stops
        such as glacier overlooks, the {location.state_name} Railroad depot, or
        Port of Whittier access so we can plan staging and parking ahead of
        time.
      </p>
      <ul className="list-disc list-inside text-blue-200 space-y-2 mb-4">
        <li>
          Exact or approximate passenger count and age mix (adults vs minors).
        </li>
        <li>
          Desired vehicle features (PA system, wet bar, dance lighting, power
          outlets).
        </li>
        <li>
          Any timed connections (flight arrival times, train departures, cruise
          embark windows).
        </li>
        <li>
          Weather sensitivity: aurora flexibility windows or winterized vehicle
          requests.
        </li>
      </ul>
      <p className="text-blue-100/90 leading-relaxed mb-2">
        Use the{" "}
        <Link className="underline" href="/tools">
          Tools
        </Link>{" "}
        slider to compare capacity and estimated per‑person costs, then hit{" "}
        <Link className="underline" href="/quote#instant">
          Instant Quote
        </Link>{" "}
        to get a pre-filled estimate. If you prefer email, send full itinerary
        details to{" "}
        <Link href="mailto:info@bus2ride.com" className="underline">
          info@bus2ride.com
        </Link>{" "}
        and our dispatch team will return a consolidated plan with driver notes
        and suggested buffers.
      </p>
      <div
        className="mt-6 flex flex-col sm:flex-row gap-3 items-center
          justify-center"
      >
        <Link
          href="/contact"
          className="rounded-full bg-yellow-500 text-black font-bold px-6 py-3
            shadow-lg hover:brightness-95 transition"
        >
          Get My Instant Quote
        </Link>
        <Link
          href="/fleet"
          className="rounded-full bg-transparent border border-yellow-500
            text-yellow-300 font-semibold px-5 py-3 shadow-sm
            hover:bg-yellow-500/10 transition"
        >
          Browse Fleet
        </Link>
        <Link
          href="tel:8885352566"
          className="rounded-full bg-white text-blue-900 font-bold px-5 py-3
            shadow hover:opacity-95 transition"
        >
          Call {location.city_name} Dispatch
        </Link>
      </div>
    </section>
  );
}
