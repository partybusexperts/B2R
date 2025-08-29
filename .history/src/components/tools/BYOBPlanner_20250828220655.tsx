"use client";
import React, { useState } from 'react';

export default function BYOBPlanner() {
  const [people, setPeople] = useState(12);
  const [hours, setHours] = useState(4);
  const [vibe, setVibe] = useState('Balanced');

  const rate = vibe === 'Mostly Spirits' ? 1.2 : vibe === 'Mostly Beer' ? 1.6 : 1.5;
  const drinks = Math.ceil(people * hours * rate);
  const ice = Math.ceil(people * hours * 0.5);

  return (
    <div className="grid gap-3">
      <label className="text-blue-100">People</label>
      <input type="number" value={people} onChange={e => setPeople(Number(e.target.value))} className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" />
      <label className="text-blue-100">Hours</label>
      <input type="number" value={hours} onChange={e => setHours(Number(e.target.value))} className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" />
      <label className="text-blue-100">Vibe</label>
      <select value={vibe} onChange={e => setVibe(e.target.value)} className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white">
        <option>Balanced</option>
        <option>Mostly Beer</option>
        <option>Mostly Spirits</option>
      </select>

      <div className="mt-3 bg-[#0e294e] p-3 rounded-lg border border-blue-800/20">
        <div className="text-blue-100">Estimated drinks: <span className="font-bold text-white">{drinks}</span></div>
        <div className="text-blue-200 text-sm">Approx. ice needed: <span className="font-bold text-white">{ice} lb</span></div>
      </div>
    </div>
  );
}
