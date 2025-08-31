"use client";

import React, { useState } from "react";

export default function CapacityFinder() {
  const [passengers, setPassengers] = useState<number>(10);
  const [result, setResult] = useState<string | null>(null);

  const recommend = (n: number) => {
    if (n <= 8) return "Sedan / SUV (sedan, SUV)";
    if (n <= 20) return "Stretch Limo / Small Party Bus (14–20p)";
    if (n <= 40) return "Medium Party Bus / Mini Coach (21–40p)";
    return "Coach Bus (40+ passengers)";
  };

  return (
    <div className="space-y-4 text-blue-100">
      <h3 className="text-2xl font-bold text-white">Capacity Finder</h3>
      <p className="text-sm">Enter your group size and get a quick vehicle recommendation.</p>

      <div className="flex items-center gap-3">
        <input
          type="number"
          min={1}
          value={passengers}
          onChange={(e) => setPassengers(Math.max(1, Number(e.target.value || 1)))}
          className="w-32 rounded-full px-4 py-2 bg-[#12244e] border border-blue-800/30 text-white"
        />
        <button
          onClick={() => setResult(recommend(passengers))}
          className="rounded-full bg-blue-600 hover:bg-blue-700 px-4 py-2 font-bold text-white"
        >
          Recommend
        </button>
      </div>

      {result && (
        <div className="rounded-xl p-4 bg-[#173264] border border-blue-800/30">
          <div className="text-sm text-blue-200">Recommended vehicle type for <span className="font-bold text-white">{passengers}</span> passengers:</div>
          <div className="mt-2 text-white font-extrabold text-lg">{result}</div>
        </div>
      )}

      <div className="text-xs text-blue-300">
        This is a lightweight recommendation tool intended for quick planning. For exact availability and pricing, request an instant quote.
      </div>
    </div>
  );
}
