"use client";
import React, { useEffect, useRef, useState } from "react";

// Client now talks only to our internal Next.js API route so the ORS key stays server-side.
"use client";
import React, { useEffect, useRef, useState } from "react";

// Client now talks only to our internal Next.js API route so the ORS key stays server-side.
// We keep this component purely UI + internal API orchestration.

interface PlanRouteResponse { ok: boolean; error?: string; data?: { addresses: string[]; coordinates: [number, number][]; distanceMeters: number; durationSeconds: number; distanceMiles: number; durationMinutes: number; segments?: { distance: number; duration: number }[]; raw: unknown; }; }
interface SuggestResponse { ok: boolean; suggestions?: string[]; error?: string; }

export default function RoutePlanner() {
  const [addresses, setAddresses] = useState<string[]>(["", ""]); // at least start + end
  const [route, setRoute] = useState<PlanRouteResponse["data"] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeInput, setActiveInput] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const activeSuggestion = suggestions.length > 0 ? suggestions[0] : null;
  const suggestAbort = useRef<AbortController | null>(null);
  const suggestDebounce = useRef<number | null>(null);

  function updateAddress(idx: number, value: string) {
    setAddresses(prev => prev.map((a, i) => i === idx ? value : a));
  }
  function addStop() {
    setAddresses(prev => [...prev.slice(0, prev.length - 1), "", prev[prev.length - 1]]); // insert before final end
  }
  function removeStop(idx: number) {
    if (addresses.length <= 2) return;
    setAddresses(prev => prev.filter((_, i) => i !== idx));
  }

  // Autocomplete suggestions
  useEffect(() => {
    if (activeInput === null) return;
    const value = addresses[activeInput];
    if (suggestDebounce.current) window.clearTimeout(suggestDebounce.current);
    if (!value || value.trim().length < 3) { setSuggestions([]); return; }
    suggestDebounce.current = window.setTimeout(async () => {
      try {
        if (suggestAbort.current) suggestAbort.current.abort();
        suggestAbort.current = new AbortController();
        const res = await fetch(`/api/geocode-suggest?q=${encodeURIComponent(value.trim())}`, { signal: suggestAbort.current.signal });
        const json: SuggestResponse = await res.json();
        if (!json.ok || !json.suggestions) { setSuggestions([]); return; }
        setSuggestions(json.suggestions);
      } catch { /* ignore */ }
    }, 320);
    return () => { if (suggestDebounce.current) window.clearTimeout(suggestDebounce.current); };
  }, [addresses, activeInput]);

  async function handlePlan(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setRoute(null);
    setLoading(true);
    try {
      const cleaned = addresses.map(a => a.trim()).filter(Boolean);
      if (cleaned.length < 2) { setError("Need at least a start and end address."); setLoading(false); return; }
      const res = await fetch("/api/plan-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses: cleaned })
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
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Free Multi-Stop Route Planner</h2>
      <form onSubmit={handlePlan} className="mb-4 space-y-3 relative">
        {addresses.map((addr, idx) => {
          const isStart = idx === 0;
          const isEnd = idx === addresses.length - 1;
          const label = isStart ? 'Start' : isEnd ? 'End' : `Stop ${idx}`;
          return (
            <div key={idx} className="relative">
              <label className="block font-semibold mb-1">{label} Address:</label>
              <div className="relative">
                {/* Ghost suggestion overlay */}
                {activeSuggestion && activeSuggestion.toLowerCase() !== addr.toLowerCase() && (
                  <div className="pointer-events-none absolute inset-0 flex items-center px-3 py-2 text-gray-400 font-normal whitespace-nowrap overflow-hidden">
                    <span className="invisible">{addr}</span>
                    <span>{activeSuggestion.slice(addr.length)}</span>
                  </div>
                )}
                <input
                  type="text"
                  value={addr}
                  onFocus={() => setActiveInput(idx)}
                  onBlur={() => setTimeout(()=>{ setActiveInput(p=> p===idx ? null : p); }, 180)}
                  onChange={e => updateAddress(idx, e.target.value)}
                  onKeyDown={e => {
                    if ((e.key === 'Tab' || e.key === 'ArrowRight') && activeSuggestion && activeSuggestion.toLowerCase() !== addr.toLowerCase()) {
                      // Accept suggestion
                      e.preventDefault();
                      updateAddress(idx, activeSuggestion);
                      setSuggestions([]);
                    }
                  }}
                  aria-autocomplete="both"
                  placeholder={isStart ? "Starting address" : isEnd ? "Destination address" : "Optional stop"}
                  className="w-full border rounded px-3 py-2 pr-20 bg-white"
                  required={isStart || isEnd}
                />
              </div>
              {!isStart && !isEnd && (
                <button type="button" onClick={()=>removeStop(idx)} className="absolute top-7 right-2 text-xs bg-rose-100 hover:bg-rose-200 text-rose-700 px-2 py-1 rounded">Remove</button>
              )}
              {activeInput === idx && suggestions.length > 0 && (
                <ul className="absolute z-20 left-0 right-0 bg-white border border-blue-200 rounded shadow max-h-52 overflow-y-auto mt-1 text-sm">
                  {suggestions.map(s => (
                    <li key={s}>
                      <button type="button" className="w-full text-left px-3 py-1 hover:bg-blue-50" onClick={()=>{ updateAddress(idx, s); setSuggestions([]); }}>
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
        <div className="flex gap-2 flex-wrap">
          <button type="button" onClick={addStop} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded shadow text-sm">Add Stop</button>
          <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded shadow text-sm" disabled={loading}>{loading ? 'Planning...' : 'Plan Route'}</button>
        </div>
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {route && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <h3 className="font-bold mb-2">Route Summary</h3>
          <div className="mb-2">Optimized straight-line sequence (no reordering). Add or remove stops above then re-run.</div>
          <div className="text-lg font-semibold mb-1">Distance: {route.distanceMiles.toFixed(2)} miles</div>
          <div className="text-lg font-semibold mb-3">Estimated Duration: {route.durationMinutes.toFixed(1)} minutes</div>
          <ol className="list-decimal list-inside text-blue-900 mb-2 space-y-1">
            {route.addresses.map((a,i)=>(<li key={i} className="truncate" title={a}>{a}</li>))}
          </ol>
          {route.segments && (
            <div className="text-xs mb-2 space-y-0.5">
              {route.segments.map((s,i)=>(<div key={i}>Leg {i+1}: {(s.distance/1609.34).toFixed(2)} mi • {(s.duration/60).toFixed(1)} min</div>))}
            </div>) }
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
            <div key={idx} className="relative">
              <label className="block font-semibold mb-1">{label} Address:</label>
              <div className="relative">
                {/* Ghost suggestion overlay */}
                {activeSuggestion && activeSuggestion.toLowerCase() !== addr.toLowerCase() && (
                  <div className="pointer-events-none absolute inset-0 flex items-center px-3 py-2 text-gray-400 font-normal whitespace-nowrap overflow-hidden">
                    <span className="invisible">{addr}</span>
                    <span>{activeSuggestion.slice(addr.length)}</span>
                  </div>
                )}
                <input
                  type="text"
                  value={addr}
                  onFocus={() => setActiveInput(idx)}
                  onBlur={() => setTimeout(()=>{ setActiveInput(p=> p===idx ? null : p); }, 180)}
                  onChange={e => updateAddress(idx, e.target.value)}
                  onKeyDown={e => {
                    if ((e.key === 'Tab' || e.key === 'ArrowRight') && activeSuggestion && activeSuggestion.toLowerCase() !== addr.toLowerCase()) {
                      // Accept suggestion
                      e.preventDefault();
                      updateAddress(idx, activeSuggestion);
                      setSuggestions([]);
                    }
                  }}
                  aria-autocomplete="both"
                  placeholder={isStart ? "Starting address" : isEnd ? "Destination address" : "Optional stop"}
                  className="w-full border rounded px-3 py-2 pr-20 bg-white"
                  required={isStart || isEnd}
                />
              </div>
              {!isStart && !isEnd && (
                <button type="button" onClick={()=>removeStop(idx)} className="absolute top-7 right-2 text-xs bg-rose-100 hover:bg-rose-200 text-rose-700 px-2 py-1 rounded">Remove</button>
              )}
              {activeInput === idx && suggestions.length > 0 && (
                <ul className="absolute z-20 left-0 right-0 bg-white border border-blue-200 rounded shadow max-h-52 overflow-y-auto mt-1 text-sm">
                  {suggestions.map(s => (
                    <li key={s}>
                      <button type="button" className="w-full text-left px-3 py-1 hover:bg-blue-50" onClick={()=>{ updateAddress(idx, s); setSuggestions([]); }}>
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
        <div className="flex gap-2 flex-wrap">
          <button type="button" onClick={addStop} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded shadow text-sm">Add Stop</button>
          <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded shadow text-sm" disabled={loading}>{loading ? 'Planning...' : 'Plan Route'}</button>
        </div>
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {route && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <h3 className="font-bold mb-2">Route Summary</h3>
          <div className="mb-2">Optimized straight-line sequence (no reordering). Add or remove stops above then re-run.</div>
          <div className="text-lg font-semibold mb-1">Distance: {route.distanceMiles.toFixed(2)} miles</div>
          <div className="text-lg font-semibold mb-3">Estimated Duration: {route.durationMinutes.toFixed(1)} minutes</div>
          <ol className="list-decimal list-inside text-blue-900 mb-2 space-y-1">
            {route.addresses.map((a,i)=>(<li key={i} className="truncate" title={a}>{a}</li>))}
          </ol>
          {route.segments && (
            <div className="text-xs mb-2 space-y-0.5">
              {route.segments.map((s,i)=>(<div key={i}>Leg {i+1}: {(s.distance/1609.34).toFixed(2)} mi • {(s.duration/60).toFixed(1)} min</div>))}
            </div>) }
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
                <button type="button" onClick={()=>removeStop(idx)} className="absolute top-7 right-2 text-xs bg-rose-100 hover:bg-rose-200 text-rose-700 px-2 py-1 rounded">Remove</button>
              )}
              {activeInput === idx && suggestions.length > 0 && (
                <ul className="absolute z-20 left-0 right-0 bg-white border border-blue-200 rounded shadow max-h-52 overflow-y-auto mt-1 text-sm">
                  {suggestions.map(s => (
                    <li key={s}>
                      <button type="button" className="w-full text-left px-3 py-1 hover:bg-blue-50" onClick={()=>{ updateAddress(idx, s); setSuggestions([]); }}>
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
        <div className="flex gap-2 flex-wrap">
          <button type="button" onClick={addStop} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded shadow text-sm">Add Stop</button>
          <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded shadow text-sm" disabled={loading}>{loading ? 'Planning...' : 'Plan Route'}</button>
        </div>
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {route && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <h3 className="font-bold mb-2">Route Summary</h3>
            <div className="mb-2">Optimized straight-line sequence (no reordering). Add or remove stops above then re-run.</div>
            <div className="text-lg font-semibold mb-1">Distance: {route.distanceMiles.toFixed(2)} miles</div>
            <div className="text-lg font-semibold mb-3">Estimated Duration: {route.durationMinutes.toFixed(1)} minutes</div>
            <ol className="list-decimal list-inside text-blue-900 mb-2 space-y-1">
              {route.addresses.map((a,i)=>(<li key={i} className="truncate" title={a}>{a}</li>))}
            </ol>
            {route.segments && (
              <div className="text-xs mb-2 space-y-0.5">
                {route.segments.map((s,i)=>(<div key={i}>Leg {i+1}: {(s.distance/1609.34).toFixed(2)} mi • {(s.duration/60).toFixed(1)} min</div>))}
              </div>) }
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

