"use client";

import * as React from "react";
import Link from "next/link";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { LocationsData } from "@/lib/data/locations";

type LocationsDirectoryProps = {
  locations: LocationsData[];
};

export function LocationsDirectory({ locations }: LocationsDirectoryProps) {
  const [search, setSearch] = React.useState("");

  type City = { name: string; slug: string };
  type StateGroup = { state: string; state_slug: string; cities: City[] };

  const stateAndCities = React.useMemo<StateGroup[]>(() => {
    const byState = new Map<string, StateGroup>();

    for (const row of locations) {
      if (
        !row.state_name ||
        !row.state_slug ||
        !row.city_name ||
        !row.city_slug
      )
        continue;

      const existing = byState.get(row.state_slug);
      const city: City = { name: row.city_name, slug: row.city_slug };

      if (!existing) {
        byState.set(row.state_slug, {
          state: row.state_name,
          state_slug: row.state_slug,
          cities: [city],
        });
        continue;
      }

      if (!existing.cities.some((c) => c.slug === city.slug)) {
        existing.cities.push(city);
      }
    }

    return Array.from(byState.values())
      .map((group) => ({
        ...group,
        cities: [...group.cities].sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.state.localeCompare(b.state));
  }, [locations]);

  // Filter Logic
  const filteredLocations = React.useMemo(() => {
    if (!search) return stateAndCities;

    const lowerSearch = search.toLowerCase();

    return stateAndCities
      .filter(
        (loc) =>
          // Match State Name
          loc.state.toLowerCase().includes(lowerSearch) ||
          // OR Match any City Name
          loc.cities.some((city) =>
            city.name.toLowerCase().includes(lowerSearch),
          ),
      )
      .map((loc) => {
        // Optional: Sort cities to put matches first
        const sortedCities = [...loc.cities].sort((a, b) => {
          const aMatch = a.name.toLowerCase().includes(lowerSearch);
          const bMatch = b.name.toLowerCase().includes(lowerSearch);
          return aMatch === bMatch ? 0 : aMatch ? -1 : 1;
        });
        return { ...loc, cities: sortedCities };
      });
  }, [search, stateAndCities]);

  return (
    <section
      className="relative max-w-7xl mx-auto overflow-hidden rounded-[40px]
        border border-white/10 py-14 px-6 mb-16 via-[#050f24]
        shadow-[0_60px_160px_rgba(2,6,23,0.65)] bg-gradient-to-b
        from-blue-900/90 to-black mt-16"
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

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-10">
          <div
            className="flex items-center gap-3 rounded-3xl border
              border-white/15 bg-white/5 px-4 py-4 shadow-lg backdrop-blur"
          >
            <Search className="h-5 w-5 shrink-0 text-white/70" />
            <Input
              placeholder="Find your city (e.g. 'Miami', 'Texas')..."
              className="h-12 border-0 bg-transparent px-0 text-white
                placeholder:text-white/60 focus-visible:ring-0
                focus-visible:ring-offset-0"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* States Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
            xl:grid-cols-4 gap-6"
        >
          {filteredLocations.map((loc) => (
            <Card
              key={loc.state_slug}
              className="group relative overflow-hidden rounded-3xl border
                border-white/15 bg-gradient-to-br from-[#0b1d3c] via-[#0a1730]
                to-[#050b18] text-white shadow-lg transition
                hover:-translate-y-1 hover:shadow-2xl pt-0"
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

              <CardHeader
                className="relative pb-3 pt-6 border-b border-white/10
                  bg-white/5"
              >
                <div className="flex justify-between items-center">
                  <CardTitle
                    className="text-xl font-extrabold flex items-center gap-2"
                  >
                    <MapPin className="h-5 w-5 text-sky-300" />
                    <Link
                      href={`/locations/state/${loc.state_slug}`}
                      className="hover:underline underline-offset-4"
                    >
                      {loc.state}
                    </Link>
                  </CardTitle>
                  <span
                    className="inline-flex items-center rounded-full bg-white/95
                      text-blue-900 border border-blue-200 px-4 py-1 text-xs
                      font-bold shadow truncate"
                  >
                    {loc.cities.length} Cities
                  </span>
                </div>
              </CardHeader>

              <CardContent className="relative pt-4">
                <div className="flex flex-wrap gap-2">
                  {loc.cities.slice(0, 8).map((city) => (
                    <Link
                      key={city.slug}
                      href={`/locations/state/${loc.state_slug}/city/${city.slug}`}
                      className="text-sm text-white/75 hover:text-white
                        hover:underline underline-offset-4"
                    >
                      {city.name}
                    </Link>
                  ))}
                  {loc.cities.length > 8 && (
                    <span className="text-sm text-white/60 italic">
                      +{loc.cities.length - 8} more
                    </span>
                  )}
                </div>
              </CardContent>
              {/* View State Button */}
              <CardFooter className="relative mt-auto">
                <Link
                  href={`/locations/state/${loc.state_slug}`}
                  className="inline-flex w-full items-center justify-between
                    rounded-full border border-white/20 px-4 py-2 text-xs
                    font-semibold uppercase tracking-[0.25em] text-white/85
                    hover:bg-white/10"
                >
                  <span>View all</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </CardFooter>

              <div
                className="pointer-events-none absolute inset-x-6 bottom-4 h-12
                  rounded-full bg-gradient-to-r from-blue-400/40
                  via-indigo-500/40 to-blue-600/40 blur-2xl"
                aria-hidden="true"
              ></div>
            </Card>
          ))}
        </div>

        {filteredLocations.length === 0 && (
          <div
            className="mt-10 rounded-3xl border border-white/15 bg-white/10
              py-16 text-center shadow-lg backdrop-blur"
          >
            <h3 className="text-lg font-semibold text-white">
              No locations found
            </h3>
            <p className="mt-2 text-white/70">
              Try a different city or state name.
            </p>
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-5 inline-flex items-center justify-center
                rounded-full border border-white/30 px-5 py-2 text-sm
                font-semibold text-white hover:bg-white/10"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
