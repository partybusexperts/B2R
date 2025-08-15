import React, { useState } from "react";

const VEHICLE_TYPES = [
  { label: "Party Bus", min: 150, max: 350 },
  { label: "Limo", min: 100, max: 250 },
  { label: "Coach Bus", min: 200, max: 400 },
  { label: "Sprinter Van", min: 90, max: 180 },
];

const SURCHARGES = [
  { label: "Peak Date (Prom, NYE, etc)", value: 1.25 },
  { label: "Late Night (after 11pm)", value: 1.15 },
  { label: "Holiday/Big Event", value: 1.2 },
  { label: "Long Distance (over 40mi)", value: 1.1 },
];

export default function BudgetEstimator() {
  const [vehicle, setVehicle] = useState(VEHICLE_TYPES[0]);
  const [hours, setHours] = useState(4);
  const [selectedSurcharges, setSelectedSurcharges] = useState<number[]>([]);
  const [estimate, setEstimate] = useState<{ min: number; max: number } | null>(null);

  function handleEstimate() {
    let min = vehicle.min * hours;
    let max = vehicle.max * hours;
    let multiplier = selectedSurcharges.reduce((acc, idx) => acc * SURCHARGES[idx].value, 1);
    min = Math.round(min * multiplier);
    max = Math.round(max * multiplier);
    setEstimate({ min, max });
  }

  function handleSurchargeChange(idx: number) {
    setSelectedSurcharges((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-400 mt-6">
      <h3 className="text-2xl font-bold mb-4 text-blue-900">Budget Estimator</h3>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Vehicle Type</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={vehicle.label}
          onChange={e => setVehicle(VEHICLE_TYPES.find(v => v.label === e.target.value) || VEHICLE_TYPES[0])}
        >
          {VEHICLE_TYPES.map(v => (
            <option key={v.label} value={v.label}>{v.label}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Hours Needed</label>
        <input
          type="number"
          min={2}
          max={12}
          value={hours}
          onChange={e => setHours(Math.max(2, Math.min(12, Number(e.target.value))))}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Surcharges (optional)</label>
        <div className="flex flex-col gap-2">
          {SURCHARGES.map((s, idx) => (
            <label key={s.label} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedSurcharges.includes(idx)}
                onChange={() => handleSurchargeChange(idx)}
              />
              {s.label} <span className="text-xs text-blue-700">(+{Math.round((s.value-1)*100)}%)</span>
            </label>
          ))}
        </div>
      </div>
      <button
        className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-lg transition w-full mb-4"
        onClick={handleEstimate}
      >
        Estimate Now
      </button>
      {estimate && (
        <div className="bg-blue-50 border border-blue-300 rounded-xl p-4 text-center mt-4">
          <div className="text-lg font-semibold text-blue-900 mb-1">Estimated Range:</div>
          <div className="text-2xl font-bold text-green-700 mb-1">
            ${estimate.min.toLocaleString()} – ${estimate.max.toLocaleString()}
          </div>
          <div className="text-sm text-gray-700">(Rates are ballpark only. Actual quote may vary by date, location, and availability.)</div>
        </div>
      )}
    </div>
  );
}
