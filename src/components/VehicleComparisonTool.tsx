"use client";
import React, { useState } from "react";

const vehicles = [
  {
    name: "Party Bus",
    capacity: "18-36 passengers",
    features: ["LED Lighting", "Premium Sound", "Dance Pole", "Wet Bar"],
    price: "$$$",
    luggage: "Medium",
    bestFor: "Parties, Events, Night Out"
  },
  {
    name: "Limousine",
    capacity: "8-18 passengers",
    features: ["Leather Seating", "Champagne", "Mood Lighting"],
    price: "$$",
    luggage: "Small",
    bestFor: "Weddings, Proms, Special Occasions"
  },
  {
    name: "Coach Bus",
    capacity: "40-56 passengers",
    features: ["Reclining Seats", "Wi-Fi", "Restroom", "TVs"],
    price: "$$$$",
    luggage: "Large",
    bestFor: "Long Trips, Large Groups, Corporate"
  }
];

const VehicleComparisonTool: React.FC = () => {
  const [selected, setSelected] = useState<number[]>([0, 1]);

  const handleSelect = (idx: number) => {
    setSelected((prev) =>
      prev.includes(idx)
        ? prev.filter((i) => i !== idx)
        : prev.length < 2
        ? [...prev, idx]
        : [prev[1], idx]
    );
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-200 rounded-2xl shadow-xl p-10 border-2 border-blue-400 w-full">
      <h3 className="text-3xl font-extrabold mb-3 text-blue-900 tracking-tight drop-shadow text-center">Vehicle Comparison Tool</h3>
      <p className="text-lg text-blue-900 mb-6 text-center">Compare vehicle types side by side. Select two to see details.</p>
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {vehicles.map((v, idx) => (
          <button
            key={v.name}
            onClick={() => handleSelect(idx)}
            className={`px-6 py-3 rounded-xl font-bold shadow transition border-2 text-lg ${selected.includes(idx)
              ? "bg-blue-700 text-white border-blue-800"
              : "bg-white text-blue-900 border-blue-300 hover:bg-blue-100"}`}
          >
            {v.name}
          </button>
        ))}
      </div>
      {selected.length === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {selected.map((idx) => (
            <div key={vehicles[idx].name} className="bg-white rounded-xl shadow p-6 border border-blue-200">
              <h4 className="text-2xl font-bold text-blue-900 mb-2 text-center">{vehicles[idx].name}</h4>
              <ul className="text-blue-800 text-base space-y-1 mb-2">
                <li><b>Capacity:</b> {vehicles[idx].capacity}</li>
                <li><b>Features:</b> {vehicles[idx].features.join(", ")}</li>
                <li><b>Price Range:</b> {vehicles[idx].price}</li>
                <li><b>Luggage:</b> {vehicles[idx].luggage}</li>
                <li><b>Best For:</b> {vehicles[idx].bestFor}</li>
              </ul>
            </div>
          ))}
        </div>
      )}
      {selected.length !== 2 && (
        <div className="text-blue-700 text-center mt-4">Select two vehicles to compare.</div>
      )}
    </div>
  );
};

export default VehicleComparisonTool;
