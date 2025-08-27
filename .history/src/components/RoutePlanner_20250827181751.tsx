"use client";
import React, { useEffect, useRef, useState } from "react";

interface PlanRouteResponse {
  ok: boolean;
  error?: string;
  data?: {
    addresses: string[];
    coordinates: [number, number][];
    distanceMeters: number;
    durationSeconds: number;
    distanceMiles: number;
    durationMinutes: number;
    segments?: { distance: number; duration: number }[];
    raw: unknown;
  };
}
interface SuggestResponse { ok: boolean; suggestions?: string[]; error?: string; }

export default function RoutePlanner(): React.ReactElement {
  const [addresses, setAddresses] = useState<string[]>(["", ""]);
  const [route, setRoute] = useState<PlanRouteResponse["data"] | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [activeInput, setActiveInput] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const suggestAbort = useRef<AbortController | null>(null);
  const suggestDebounce = useRef<number | null>(null);

  function updateAddress(idx: number, value: string) {
    setAddresses(prev => prev.map((a, i) => (i === idx ? value : a)));
  }
  function addStop() {
    setAddresses(prev => [...prev.slice(0, prev.length - 1), "", prev[prev.length - 1]]);
  }
  // removeStop intentionally omitted in simplified UI; use addStop to add blank stops

  useEffect(() => {
    if (activeInput === null) return;
    const v = addresses[activeInput] || "";
    if (suggestDebounce.current) window.clearTimeout(suggestDebounce.current);
    if (!v || v.trim().length < 3) { setSuggestions([]); return; }
    suggestDebounce.current = window.setTimeout(async () => {
      try {
        if (suggestAbort.current) suggestAbort.current.abort();
        suggestAbort.current = new AbortController();
        const res = await fetch(`/api/geocode-suggest?q=${encodeURIComponent(v.trim())}`, { signal: suggestAbort.current.signal });
        const j: SuggestResponse = await res.json();
        setSuggestions(j.ok && j.suggestions ? j.suggestions : []);
      } catch {
        setSuggestions([]);
      }
    }, 300);
    return () => { if (suggestDebounce.current) window.clearTimeout(suggestDebounce.current); };
  }, [addresses, activeInput]);

  async function handlePlan(e?: React.FormEvent) {
    e?.preventDefault();
    setError("");
    setRoute(null);
    setLoading(true);
    try {
      const cleaned = addresses.map(a => a.trim()).filter(Boolean);
      if (cleaned.length < 2) { setError("Need at least start and end"); setLoading(false); return; }
      const res = await fetch("/api/plan-route", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ addresses: cleaned }) });
      if (!res.ok) { setError("Server error planning route"); setLoading(false); return; }
      const j: PlanRouteResponse = await res.json();
      if (!j.ok || !j.data) setError(j.error || "Could not plan route"); else setRoute(j.data);
    } catch (err) {
      console.error(err);
      setError("Unexpected error");
    }
    setLoading(false);
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Route Planner</h2>
      <form onSubmit={handlePlan} className="space-y-3">
        {addresses.map((addr, i) => {
          const isStart = i === 0;
          const isEnd = i === addresses.length - 1;
          const label = isStart ? "Start" : isEnd ? "End" : `Stop ${i}`;
          return (
            <div key={i}>
              <label className="block font-semibold">{label} Address</label>
              <input
                value={addr}
                onChange={e => updateAddress(i, e.target.value)}
                onFocus={() => setActiveInput(i)}
                onBlur={() => setTimeout(() => setActiveInput(p => (p === i ? null : p)), 150)}
                className="w-full border rounded px-3 py-2"
                placeholder={isStart ? "Starting address" : isEnd ? "Destination" : "Optional stop"}
                required={isStart || isEnd}
              />
              {activeInput === i && suggestions.length > 0 && (
                <ul className="border bg-white mt-1 max-h-40 overflow-auto text-sm">
                  {suggestions.map(s => (
                    <li key={s}>
                      <button type="button" onClick={() => { updateAddress(i, s); setSuggestions([]); }} className="w-full text-left px-2 py-1 hover:bg-gray-100">{s}</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}

        <div className="flex gap-2">
          <button type="button" onClick={addStop} className="px-3 py-2 bg-indigo-600 text-white rounded">Add Stop</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? "Planning..." : "Plan Route"}</button>
        </div>
      </form>

      {error && <div className="text-red-600 mt-3">{error}</div>}

      {route && (
        <div className="mt-4 border rounded p-3 bg-blue-50">
          <div className="font-semibold">Distance: {route.distanceMiles.toFixed(2)} miles</div>
          <div>Duration: {route.durationMinutes.toFixed(1)} min</div>
          <ol className="list-decimal list-inside mt-2">
            {route.addresses.map((a, idx) => <li key={idx} title={a}>{a}</li>)}
          </ol>
        </div>
      )}
    </div>
  );
}

