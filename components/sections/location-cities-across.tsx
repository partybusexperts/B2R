import Link from "next/link";
import {
  getLocationsByState,
  LocationsData,
  type LocationsWithContentData,
} from "@/lib/data/locations";

export default async function LocationCitiesAcross({
  location,
}: {
  location: LocationsWithContentData;
}) {
  const cities = (await getLocationsByState(location.state_slug)) ?? [];

  if (cities.length === 0) return null;

  return (
    <section
      className="relative max-w-7xl mx-auto overflow-hidden rounded-[40px]
        border border-white/10 py-14 px-6 mb-16 via-[#050f24]
        shadow-[0_60px_160px_rgba(2,6,23,0.65)] bg-gradient-to-b
        from-blue-900/90 to-black"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0
            bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),transparent_55%)]"
        ></div>
      </div>

      <div className="relative z-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-blue-200/80 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link className="hover:underline" href="/locations">
                Locations
              </Link>{" "}
              »
            </li>
            <li className="text-blue-100 font-semibold">
              {location.state_name} Overview
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-blue-200/70">
              Coverage Map
            </p>
            <h2
              className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r
                from-white via-blue-200 to-blue-500 bg-clip-text
                text-transparent drop-shadow-lg font-serif tracking-tight"
              id={`cities-we-serve-across-${location.state_slug}-2`}
            >
              Cities We Serve Across {location.state_name}
            </h2>
            <p className="mt-3 text-blue-100/80 max-w-2xl">
              {location.cities_served?.description}
            </p>
          </div>

          <div className="md:ml-auto flex flex-col items-start gap-3">
            <span
              className="inline-flex items-center rounded-full bg-white/95
                text-blue-900 border border-blue-200 px-5 py-2 text-sm font-bold
                shadow"
            >
              {cities.length} {cities.length === 1 ? "city" : "cities"}
            </span>
            <span
              className="inline-flex items-center rounded-full border
                border-white/20 px-4 py-2 text-xs uppercase tracking-[0.35em]
                text-white/80"
            >
              {location.cities_served?.label}
            </span>
          </div>
        </div>

        {/* Cities Grid */}
        <CitiesGrid
          cities={cities}
          stateName={location.state_name}
          stateSlug={location.state_slug}
        />

        {/* Not seeing your city? */}
        <div className="mt-12 flex justify-center">
          <div
            className="rounded-3xl border border-white/15 bg-white/10 px-8 py-6
              text-center shadow-lg backdrop-blur"
          >
            <p className="text-white font-semibold text-lg">
              Not seeing your city? We likely still serve it.
            </p>
            <div
              className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center"
            >
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full
                  bg-white text-blue-900 font-bold px-6 py-3 shadow
                  hover:bg-blue-50"
              >
                Get a Free Quote
              </Link>
              <a
                href="tel:8885352566"
                className="inline-flex items-center justify-center rounded-full
                  border border-white/30 px-6 py-3 text-white font-bold
                  hover:bg-white/10"
              >
                Call (888) 535-2566
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CitiesGrid({
  cities,
  stateName,
  stateSlug,
}: {
  cities: LocationsData[];
  stateName: string;
  stateSlug: string;
}) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
        gap-5"
    >
      {cities.map((city) => {
        const cityHref = `/locations/${stateSlug}/party-buses-${city.city_slug}`;

        return (
          <div
            key={city.id}
            className="group relative overflow-hidden rounded-3xl border
              border-white/15 bg-gradient-to-br from-[#0b1d3c] via-[#0a1730]
              to-[#050b18] text-white shadow-lg transition hover:-translate-y-1
              hover:shadow-2xl"
          >
            <div
              className="absolute inset-0 opacity-0 transition
                group-hover:opacity-100"
              aria-hidden="true"
            >
              <div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/10
                  via-cyan-500/10 to-purple-500/10"
              ></div>
            </div>

            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <Link
                  href={cityHref}
                  className="text-2xl font-extrabold leading-tight text-white
                    hover:underline"
                  aria-label={`Open ${city.city_name}, ${stateName}`}
                >
                  {city.city_name}
                </Link>
                <Link
                  href={cityHref}
                  className="text-sky-300 text-lg transition
                    group-hover:translate-x-1"
                  aria-hidden="true"
                  tabIndex={-1}
                >
                  →
                </Link>
              </div>

              <Link
                href={`/locations/${stateSlug}`}
                className="text-sm font-semibold text-white/70"
              >
                {stateName}
              </Link>

              <div
                className="mt-5 flex flex-wrap gap-2 text-xs font-semibold
                  uppercase tracking-wide text-white/80"
              >
                <Link
                  href="/fleet"
                  className="inline-flex items-center rounded-full border
                    border-white/20 px-3 py-1 text-white/80 hover:text-white
                    hover:border-white/40"
                >
                  Fleet
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-full border
                    border-white/20 px-3 py-1 text-white/80 hover:text-white
                    hover:border-white/40"
                >
                  Instant Quote
                </Link>
              </div>

              <div
                className="mt-5 flex gap-2 text-[11px] font-semibold uppercase
                  tracking-[0.3em] text-sky-400"
              >
                <span>Year-round</span>
                <span>•</span>
                <span>Local support</span>
              </div>
            </div>

            <div
              className="pointer-events-none absolute inset-x-6 bottom-4 h-12
                rounded-full bg-gradient-to-r from-blue-400/40 via-indigo-500/40
                to-blue-600/40 blur-2xl"
              aria-hidden="true"
            ></div>
          </div>
        );
      })}
    </div>
  );
}
