"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EventData } from "@/lib/data/events";
import { EventCard } from "./events-card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";

function filterEventsLocally(events: EventData[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return events;

  return events.filter((event) => {
    const title = (event.title ?? "").toString().toLowerCase();
    const description = (event.description ?? "").toString().toLowerCase();
    return title.includes(normalized) || description.includes(normalized);
  });
}

export function EventSearchClient({
  events,
  cardCustomStyles,
}: {
  events: EventData[];
  cardCustomStyles?: React.CSSProperties;
}) {
  const [query, setQuery] = React.useState("");
  const [selectedEventSlug, setSelectedEventSlug] = React.useState<string>("");

  const normalizedQuery = query.trim();

  const localResults = React.useMemo(() => {
    const base = filterEventsLocally(events, normalizedQuery);
    if (!selectedEventSlug) return base;
    return base.filter((event) => event.slug === selectedEventSlug);
  }, [events, normalizedQuery, selectedEventSlug]);

  return (
    <div
      className="w-full bg-[#122a56] rounded-[40px] border border-blue-800/40
        py-12 px-3 md:px-6 shadow-[0_60px_160px_rgba(2,6,23,0.65)]"
    >
      <div
        className="w-full flex flex-col md:flex-row items-center justify-center
          gap-3 mb-10"
      >
        <label
          htmlFor="event-search"
          className="text-blue-100 font-semibold whitespace-nowrap"
        >
          Jump to an event:
        </label>
        <div className="relative w-auto flex">
          <Search
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2
              text-muted-foreground"
          />
          <Input
            id="event-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events..."
            className="h-10 w-full rounded-full bg-[#0f1f46] text-blue-50 border
              border-blue-800/40 pl-11 pr-4"
          />
          <Select
            value={selectedEventSlug}
            onValueChange={(value) => {
              setSelectedEventSlug(value);
            }}
          >
            <SelectTrigger
              className="h-10 md:w-96 rounded-full bg-[#0f1f46] text-blue-50
                border border-blue-800/40 px-5 py-5"
            >
              <SelectValue placeholder="Select an event" />
            </SelectTrigger>
            <SelectContent className="bg-[#0E1F46] border border-blue-800/40">
              <SelectGroup>
                {events.map((event) => (
                  <SelectItem
                    key={event.id}
                    value={event.slug || ""}
                    disabled={!event.slug}
                    className="text-blue-100 hover:bg-blue-800/40 focus:ring-0
                      border-0"
                  >
                    {event.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            disabled={!query && !selectedEventSlug}
            onClick={() => {
              setQuery("");
              setSelectedEventSlug("");
            }}
            className="h-10 ml-3"
          >
            Clear
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {localResults.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            customStyles={cardCustomStyles}
          />
        ))}
      </div>
    </div>
  );
}
