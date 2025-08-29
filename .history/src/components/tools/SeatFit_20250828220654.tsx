"use client";
import React, { useState } from 'react';

export default function SeatFit() {
  const [people, setPeople] = useState(8);
  const recommended = people <= 10 ? '10-passenger van' : people <= 20 ? '20-passenger bus' : people <= 30 ? '30-passenger bus' : people <= 40 ? '40-passenger bus' : 'Coach / Charter Bus';
  return (
    <div className="grid gap-3">
      <label className="text-blue-100">Group size</label>
      <input type="number" value={people} onChange={e => setPeople(Number(e.target.value))} className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" />
      <div className="mt-3 bg-[#0e294e] p-3 rounded-lg border border-blue-800/20">
        <div className="text-blue-100">Recommended vehicle:</div>
        <div className="text-xl font-bold text-white">{recommended}</div>
      </div>
    </div>
  );
}
