"use client";
// ...existing code...
import React, { useState } from "react";
import { geocodeAddress } from "../utils/geocode";

const ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImI3MmI2M2Y5YzU4YjQxM2Q4ZTZhZTg1MTM0NmU1YTdkIiwiaCI6Im11cm11cjY0In0="; // USER KEY
const ORS_ENDPOINT = "https://api.openrouteservice.org/v2/directions/driving-car";

export default function RoutePlanner() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [route, setRoute] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handlePlan(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setRoute(null);
    setLoading(true);
    try {
      // Geocode addresses to coordinates
      const [startCoords, endCoords] = await Promise.all([
        geocodeAddress(start),
        geocodeAddress(end)
      ]);
      console.log("Geocode results:", { startCoords, endCoords });
      if (!startCoords || !endCoords) {
        setError("Could not find one or both addresses. Please check and try again.");
        setLoading(false);
        return;
      }
      const body = { coordinates: [startCoords, endCoords] };
      console.log("Requesting route with:", body);
      const res = await fetch(ORS_ENDPOINT, {
        method: "POST",
        headers: {
          "Authorization": ORS_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
      console.log("Route API response status:", res.status);
      if (!res.ok) {
        const text = await res.text();
        console.error("Route API error:", text);
        throw new Error("Route API error");
      }
      const data = await res.json();
      console.log("Route API data:", data);
      setRoute(data);
    } catch (err) {
      setError("Failed to fetch route. Try again later.");
      console.error("RoutePlanner error:", err);
    }
    setLoading(false);
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Free Route Planner</h2>
      <form onSubmit={handlePlan} className="mb-4 space-y-3">
        <div>
          <label className="block font-semibold mb-1">Start Address:</label>
          <input
            type="text"
            value={start}
            onChange={e => setStart(e.target.value)}
            placeholder="e.g. 1600 Pennsylvania Ave NW, Washington, DC"
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">End Address:</label>
          <input
            type="text"
            value={end}
            onChange={e => setEnd(e.target.value)}
            placeholder="e.g. 1 Infinite Loop, Cupertino, CA"
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded shadow"
          disabled={loading}
        >
          {loading ? "Planning..." : "Plan Route"}
        </button>
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {route && (() => {
        // OpenRouteService may return either .features[0].properties.summary or .routes[0].summary
        let summary = null;
        if (route.features && route.features[0]?.properties?.summary) {
          summary = route.features[0].properties.summary;
        } else if (route.routes && route.routes[0]?.summary) {
          summary = route.routes[0].summary;
        }
        // Convert distance to miles
        const miles = summary ? (summary.distance / 1609.34).toFixed(2) : null;
        const minutes = summary ? (summary.duration / 60).toFixed(1) : null;
        return summary ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h3 className="font-bold mb-2">Route Summary</h3>
            <div className="mb-2">This is a basic driving route between your start and end addresses. For multi-stop or detailed trip planning, contact our team!</div>
            <div className="text-lg font-semibold mb-1">Distance: {miles} miles</div>
            <div className="text-lg font-semibold mb-3">Estimated Duration: {minutes} minutes</div>
            <div className="text-blue-900 mb-2">From <span className="font-bold">{start}</span> to <span className="font-bold">{end}</span></div>
            <details className="mt-2">
              <summary className="cursor-pointer text-blue-700">Show Route Details</summary>
              <pre className="text-xs bg-white p-2 rounded mt-2 overflow-x-auto max-h-64">{JSON.stringify(route, null, 2)}</pre>
            </details>
          </div>
        ) : (
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mt-4 text-yellow-900">
            Route data received, but could not parse summary. See details below.
            <details className="mt-2">
              <summary className="cursor-pointer text-blue-700">Show Raw Data</summary>
              <pre className="text-xs bg-white p-2 rounded mt-2 overflow-x-auto max-h-64">{JSON.stringify(route, null, 2)}</pre>
            </details>
          </div>
        );
      })()}
      <div className="text-xs text-gray-500 mt-4">
        Powered by <a href="https://openrouteservice.org/" className="underline" target="_blank" rel="noopener noreferrer">OpenRouteService</a> (free tier)
      </div>
    </div>
  );
}

