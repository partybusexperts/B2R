"use client";
import React, { useState } from "react";

const VEHICLE_OPTIONS = [
  { name: "Party Bus (Small)", min: 10, max: 18, description: "Great for small groups, birthdays, and nights out." },
  { name: "Party Bus (Medium)", min: 19, max: 28, description: "Perfect for mid-size groups, proms, and bachelor/bachelorette parties." },
  { name: "Party Bus (Large)", min: 29, max: 36, description: "Ideal for big celebrations, weddings, and large events." },
  { name: "Limousine", min: 6, max: 14, description: "Classic luxury for smaller groups and special occasions." },
  { name: "Coach Bus", min: 37, max: 56, description: "Best for large groups, corporate events, and long trips." },
];

export default function CapacityFinderTool() {
  const [groupSize, setGroupSize] = useState(15);
  const [showResults, setShowResults] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupSize(Number(e.target.value));
    setShowResults(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  const recommended = VEHICLE_OPTIONS.filter(
    (v) => groupSize >= v.min && groupSize <= v.max
  );

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow border-2 border-blue-400 flex flex-col items-center">
      <h3 className="text-2xl font-bold text-blue-900 mb-2 text-center">Capacity Finder</h3>
      <p className="text-blue-800 mb-4 text-center">Enter your group size to see the best vehicle options for your trip.</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full mb-4">
        <label htmlFor="groupSize" className="font-semibold mb-1 text-blue-900">Group Size</label>
        <input
          id="groupSize"
          type="number"
          min={1}
          max={56}
          value={groupSize}
          onChange={handleInput}
          className="w-32 px-3 py-2 border border-blue-300 rounded-lg mb-2 text-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded-lg shadow mt-2"
        >
          Find My Vehicle
        </button>
      </form>
      {showResults && (
        <div className="w-full mt-4">
          {recommended.length > 0 ? (
            <>
              <div className="font-bold text-blue-900 mb-2 text-center">Recommended Vehicle{recommended.length > 1 ? 's' : ''}:</div>
              <ul className="space-y-3">
                {recommended.map((v) => (
                  <li key={v.name} className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-900">
                    <div className="font-semibold">{v.name}</div>
                    <div className="text-sm text-blue-700">{v.description}</div>
                    <div className="text-xs text-blue-500">Seats {v.min}–{v.max} people</div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="text-red-600 font-semibold text-center">Sorry, we don&apos;t have a vehicle for that group size. Please call us for custom options!</div>
          )}
        </div>
      )}
    </div>
  );
}
