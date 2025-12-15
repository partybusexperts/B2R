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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <section className="py-12 bg-background min-h-[60vh]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12 relative">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5
                text-muted-foreground"
            />
            <Input
              placeholder="Find your city (e.g. 'Miami', 'Texas')..."
              className="pl-12 h-14 text-lg rounded-2xl shadow-sm
                border-primary/20 focus-visible:ring-primary"
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
              className="group border-border/50 hover:border-primary/50
                transition-all hover:shadow-md pt-0"
            >
              <CardHeader
                className="pb-3 pt-6 border-b border-border/40 bg-muted/20"
              >
                <div className="flex justify-between items-center">
                  <CardTitle
                    className="text-xl font-bold flex items-center gap-2"
                  >
                    <MapPin className="h-5 w-5 text-primary" />
                    <Link
                      href={`/locations/state/${loc.state_slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {loc.state}
                    </Link>
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {loc.cities.length} Cities
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-4">
                <div className="flex flex-wrap gap-2">
                  {loc.cities.slice(0, 8).map((city) => (
                    <Link
                      key={city.slug}
                      href={`/locations/state/${loc.state_slug}/city/${city.slug}`}
                      className="text-sm text-muted-foreground
                        hover:text-primary hover:underline underline-offset-4
                        decoration-primary/30"
                    >
                      {city.name}
                    </Link>
                  ))}
                  {loc.cities.length > 8 && (
                    <span className="text-sm text-muted-foreground italic">
                      +{loc.cities.length - 8} more
                    </span>
                  )}
                </div>
              </CardContent>
              {/* View State Button */}
              <CardFooter className="mt-auto">
                <Button
                  variant="ghost"
                  className="w-full justify-between text-xs h-8"
                  asChild
                >
                  <Link href={`/locations/state/${loc.state_slug}`}>
                    View all in {loc.state}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredLocations.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              No locations found for &quot;{search}&quot;
            </p>
            <Button
              variant="link"
              onClick={() => setSearch("")}
              className="mt-2 text-primary"
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
