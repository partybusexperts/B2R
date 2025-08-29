"use client";
import React, { useState } from 'react';

export default function WeatherAlert() {
  const [city, setCity] = useState('San Francisco');
  const [date, setDate] = useState('');
  const advisory = date ? `No major weather alerts expected for ${city} on ${date}.` : 'Pick a date to check potential impacts.';
  return (
    <div className="grid gap-3">
      <label className="text-blue-100">City</label>
      <input value={city} onChange={e => setCity(e.target.value)} className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" />
      <label className="text-blue-100">Date</label>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" />
      <div className="mt-3 bg-[#0e294e] p-3 rounded-lg border border-blue-800/20">
        <div className="text-blue-100">Advisory:</div>
        <div className="text-white">{advisory}</div>
      </div>
    </div>
  );
}
