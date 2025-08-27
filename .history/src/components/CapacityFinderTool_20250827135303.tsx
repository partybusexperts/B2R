"use client";
import React, { useState } from "react";

const VEHICLE_OPTIONS = [
  { name: "Party Bus (Small)", min: 1, max: 18, description: "Great for small groups, birthdays, and nights out." },
  { name: "Party Bus (Medium)", min: 19, max: 28, description: "Perfect for mid-size groups, proms, and bachelor/bachelorette parties." },
  { name: "Party Bus (Large)", min: 29, max: 36, description: "Ideal for big celebrations, weddings, and large events." },
  { name: "Limousine (Small)", min: 1, max: 8, description: "Classic luxury for 1-8 passengers and special occasions." },
  { name: "Limousine (Large)", min: 9, max: 20, description: "Spacious limo for 9-20 passengers and upscale events." },
  { name: "Shuttle Bus", min: 1, max: 20, description: "Comfortable shuttle for small to mid-size groups and airport transfers." },
  { name: "Large Shuttle Bus", min: 20, max: 40, description: "Spacious shuttle for larger groups, events, and tours." },
  { name: "Coach Bus", min: 1, max: 56, description: "Best for large groups, corporate events, and long trips." },
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
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-xl shadow border border-blue-200 flex flex-col items-start">
      <h3 className="text-xl font-bold text-blue-900 mb-1">Capacity Finder</h3>
      <p className="text-blue-800 mb-2 text-sm">Enter your group size to see the best vehicle options for your trip.</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-start w-full mb-2">
        <label htmlFor="groupSize" className="font-semibold mb-1 text-blue-900">Group Size</label>
        <input
          id="groupSize"
          type="number"
          min={1}
          max={56}
          value={groupSize}
          onChange={handleInput}
          className="w-24 px-2 py-1 border border-blue-300 rounded mb-1 text-base text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-1.5 rounded shadow mt-1 text-sm"
        >
          Find My Vehicle
        </button>
      </form>
      {showResults && (
        <div className="w-full mt-2">
          {recommended.length > 0 ? (
            <>
              <div className="font-bold text-blue-900 mb-1 text-sm">Recommended Vehicle{recommended.length > 1 ? 's' : ''}:</div>
              <ul className="space-y-2">
                {recommended.map((v) => (
                  <li key={v.name} className="bg-blue-50 border border-blue-100 rounded p-2 text-blue-900">
                    <div className="font-semibold text-sm">{v.name}</div>
                    <div className="text-xs text-blue-700">{v.description}</div>
                    <div className="text-xs text-blue-500">Seats {v.min}–{v.max} people</div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="text-red-600 font-semibold text-xs">Sorry, we don&apos;t have a vehicle for that group size. Please call us for custom options!</div>
          )}
        </div>
      )}
    </div>
  );
}
