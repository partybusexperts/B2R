"use client";
import React, { useState } from "react";

// Client now talks only to our internal Next.js API route so the ORS key stays server-side.
// We keep this component purely UI + internal API orchestration.

interface PlanRouteResponse {
  ok: boolean;
  error?: string;
  data?: {
    start: string;
    end: string;
    startCoords: [number, number];
    endCoords: [number, number];
    distanceMeters: number;
    durationSeconds: number;
    distanceMiles: number;
    durationMinutes: number;
    raw: any; // full provider payload (may be trimmed in future)
  };
}

export default function RoutePlanner() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [route, setRoute] = useState<PlanRouteResponse["data"] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handlePlan(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setRoute(null);
    setLoading(true);
    try {
      const res = await fetch("/api/plan-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start, end })
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("/api/plan-route error status", res.status, text);
        setError("Failed to plan route. Please check addresses or try later.");
        setLoading(false);
        return;
      }
      const json: PlanRouteResponse = await res.json();
      if (!json.ok || !json.data) {
        setError(json.error || "Could not plan that route.");
      } else {
        setRoute(json.data);
      }
    } catch (err) {
      console.error("RoutePlanner network/parse error", err);
      setError("Unexpected error planning route.");
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
      {route && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <h3 className="font-bold mb-2">Route Summary</h3>
            <div className="mb-2">Basic driving route between your start and end addresses. For multi-stop or detailed trip planning, contact our team!</div>
            <div className="text-lg font-semibold mb-1">Distance: {route.distanceMiles.toFixed(2)} miles</div>
            <div className="text-lg font-semibold mb-3">Estimated Duration: {route.durationMinutes.toFixed(1)} minutes</div>
            <div className="text-blue-900 mb-2">From <span className="font-bold">{route.start}</span> to <span className="font-bold">{route.end}</span></div>
            <details className="mt-2">
              <summary className="cursor-pointer text-blue-700">Show Raw Details</summary>
              <pre className="text-xs bg-white p-2 rounded mt-2 overflow-x-auto max-h-64">{JSON.stringify(route.raw, null, 2)}</pre>
            </details>
        </div>
      )}
      <div className="text-xs text-gray-500 mt-4">
        Powered by <a href="https://openrouteservice.org/" className="underline" target="_blank" rel="noopener noreferrer">OpenRouteService</a> (free tier)
      </div>
    </div>
  );
}

