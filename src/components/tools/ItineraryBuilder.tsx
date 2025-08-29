"use client";
import React, { useState } from 'react';

export default function ItineraryBuilder() {
  const [stops, setStops] = useState<string[]>(['Pickup', 'Venue', 'Afterparty']);
  const [hours, setHours] = useState(4);

  const minutes = Math.max(15, Math.round((hours * 60) / Math.max(1, stops.length)));

  return (
    <div className="grid gap-3">
      <label className="text-blue-100">Total Hours</label>
      <input type="number" value={hours} onChange={e => setHours(Number(e.target.value))} className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" />
      <label className="text-blue-100">Stops (comma separated)</label>
      <input value={stops.join(', ')} onChange={e => setStops(e.target.value.split(',').map(s => s.trim()))} className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" />

      <div className="mt-3 bg-[#0e294e] p-3 rounded-lg border border-blue-800/20">
        <div className="text-blue-100">Suggested timeline (approx):</div>
        <ol className="text-white mt-2 space-y-1">
          {stops.map((s, i) => (
            <li key={s}><b>{s}</b>: ~{minutes} min</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
