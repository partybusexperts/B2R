"use client";

import React from "react";

// Minimal Place type used by HeaderControls (kept local to avoid cross-file type deps)
interface Place {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  country_code?: string;
  timezone?: string;
}

function HeaderControls(props: {
  query: string;
  setQuery: (v: string) => void;
  suggestions: Place[];
  onChoose: (p: Place) => void;
  suggestBoxRef: React.RefObject<HTMLDivElement | null>;
  unit: "C" | "F";
  setUnit: (u: "C" | "F") => void;
  speedUnit: "mph" | "km/h";
  setSpeedUnit: (s: "mph" | "km/h") => void;
  pinCurrentCity: () => void;
}) {
  const {
    query,
    setQuery,
    suggestions,
    onChoose,
    suggestBoxRef,
    unit,
    setUnit,
    speedUnit,
    setSpeedUnit,
    pinCurrentCity,
  } = props;

  const Icon = {
    MapPin: () => <span className="inline-block align-[-2px]">📍</span>,
    Search: () => <span className="inline-block align-[-2px]">🔍</span>,
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative" ref={suggestBoxRef}>
        <div className="flex items-center border border-gray-400 rounded-xl bg-white shadow overflow-hidden">
          <span className="mx-2 text-gray-700">
            <Icon.Search />
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city, state, or country"
            className="px-2 py-2 w-64 md:w-80 outline-none text-gray-900 placeholder-gray-500"
            autoComplete="off"
            data-lpignore="true"
          />
          {query && (
            <button className="px-3 text-sm text-gray-700 hover:text-gray-900" onClick={() => setQuery("")}>
              Clear
            </button>
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-300 overflow-hidden text-gray-900">
            {suggestions.map((s, i) => (
              <button
                key={`${s.latitude}-${s.longitude}-${i}`}
                onClick={() => onChoose(s)}
                className="w-full text-left px-3 py-2 hover:bg-sky-100 flex items-center gap-2"
              >
                <span className="text-sky-700">
                  <Icon.MapPin />
                </span>
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={pinCurrentCity}
        className="px-3 py-2 rounded-xl bg-white border border-gray-400 shadow hover:bg-gray-50 text-gray-900"
      >
        Pin this city
      </button>

      <button
        onClick={() => setUnit(unit === "C" ? "F" : "C")}
        className="px-3 py-2 rounded-xl bg-gray-100 border border-gray-400 shadow hover:bg-gray-200 text-gray-900"
      >
        Switch to °{unit === "C" ? "F" : "C"}
      </button>
      <button
        onClick={() => setSpeedUnit(speedUnit === "mph" ? "km/h" : "mph")}
        className="px-3 py-2 rounded-xl bg-gray-100 border border-gray-400 shadow hover:bg-gray-200 text-gray-900"
      >
        Wind: {speedUnit === "mph" ? "mph" : "km/h"}
      </button>
    </div>
  );
}

export default HeaderControls;
