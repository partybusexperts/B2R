"use client";
import React, { useState } from 'react';

const EVENT_MAP: Record<string, string> = {
  Weddings: 'Limousine or Sprinter',
  Proms: 'Limousine',
  "Birthday Parties": 'Party Bus',
  "Concerts": 'Party Bus',
  "Sporting Events": 'Coach or Party Bus',
  "Wine Tours": 'Sprinter or Limo',
};

export default function EventMatchmaker() {
  const [title, setTitle] = useState('Weddings');
  return (
    <div className="grid gap-3">
      <label className="text-blue-100">Event Type</label>
      <select value={title} onChange={e => setTitle(e.target.value)} className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white">
        {Object.keys(EVENT_MAP).map(k => <option key={k}>{k}</option>)}
      </select>
      <div className="mt-3 bg-[#0e294e] p-3 rounded-lg border border-blue-800/20">
        <div className="text-blue-100">Suggested vehicle:</div>
        <div className="text-xl font-bold text-white">{EVENT_MAP[title] || 'Contact us for custom advice'}</div>
      </div>
    </div>
  );
}
