"use client";

import React, { useState } from "react";

type Tool = { name: string; icon: string; desc: string; size: "sm" | "md" | "lg" };

const TOOL_SIZE_CLASS: Record<Tool["size"], string> = {
  sm: "max-w-md min-h-[300px]",
  md: "max-w-2xl min-h-[420px]",
  lg: "max-w-5xl min-h-[540px]",
};

export default function ToolsModal({
  activeToolIdx,
  toolList,
  onClose,
}: {
  activeToolIdx: number | null;
  toolList: Tool[];
  onClose: () => void;
}) {
  if (activeToolIdx === null) return null;
  const tool = toolList[activeToolIdx];
  const sizeClass = TOOL_SIZE_CLASS[tool.size];

  // Shared state for tools
  const [totalPrice, setTotalPrice] = useState(1200);
  const [people, setPeople] = useState(16);
  const [gratuity, setGratuity] = useState(0);

  const [byobPeople, setByobPeople] = useState(16);
  const [byobHours, setByobHours] = useState(4);
  const [byobVibe, setByobVibe] = useState("Balanced");

  const [seatPassengers, setSeatPassengers] = useState(16);
  const [seatSeats, setSeatSeats] = useState(16);

  const [stops, setStops] = useState<string[]>(["Bar 1", "Bar 2"]);
  const [newStop, setNewStop] = useState("");
  const [stopDurations, setStopDurations] = useState<number[]>([45, 60]);

  const [vibe, setVibe] = useState("Chill");

  const [totalHours, setTotalHours] = useState(4);
  const [numStops, setNumStops] = useState(3);

  const addStop = () => {
    if (!newStop.trim()) return;
    setStops((s) => [...s, newStop.trim()]);
    setStopDurations((d) => [...d, 45]);
    setNewStop("");
  };

  const updateDuration = (idx: number, mins: number) => {
    setStopDurations((d) => d.map((v, i) => (i === idx ? mins : v)));
  };

  // Tool renderers
  const renderPerPerson = () => {
    const total = Number(totalPrice) || 0;
    const p = Math.max(1, Number(people) || 1);
    const tip = (Number(gratuity) || 0) / 100;
    const perPerson = (total * (1 + tip)) / p;
    return (
      <div className="grid gap-3">
        <label className="text-blue-100">Total Price ($)</label>
        <input type="number" value={totalPrice} onChange={(e) => setTotalPrice(Number(e.target.value))} className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" />
        <label className="text-blue-100">People</label>
        <input type="number" value={people} onChange={(e) => setPeople(Number(e.target.value))} className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" />
        <label className="text-blue-100">Gratuity % (optional)</label>
        <input type="number" value={gratuity} onChange={(e) => setGratuity(Number(e.target.value))} className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" />
        <div className="mt-3 bg-[#0e294e] p-3 rounded-lg border border-blue-800/20">
          <div className="text-blue-100">Per person (incl. gratuity):</div>
          <div className="text-2xl font-bold text-white">${perPerson.toFixed(2)}</div>
        </div>
      </div>
    );
  };

  const renderBYOB = () => {
    const p = Math.max(1, Number(byobPeople) || 1);
    const h = Math.max(1, Number(byobHours) || 1);
    const drinkRate = byobVibe === "Mostly Spirits" ? 1.2 : byobVibe === "Mostly Beer" ? 1.6 : 1.5;
    const drinks = Math.ceil(p * h * drinkRate);
    const iceLb = Math.ceil(p * h * 0.5);
    return (
      <div className="grid gap-3">
        <label className="text-blue-100">People</label>
        <input type="number" value={byobPeople} onChange={(e) => setByobPeople(Number(e.target.value))} className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" />
        <label className="text-blue-100">Hours</label>
        <input type="number" value={byobHours} onChange={(e) => setByobHours(Number(e.target.value))} className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" />
        <label className="text-blue-100">Vibe</label>
        <select value={byobVibe} onChange={(e) => setByobVibe(e.target.value)} className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white">
          <option>Balanced</option>
          <option>Mostly Beer</option>
          <option>Mostly Spirits</option>
        </select>
        <div className="mt-3 bg-[#0e294e] p-3 rounded-lg border border-blue-800/20">
          <div className="text-blue-100">Estimated total drinks:</div>
          <div className="text-2xl font-bold text-white">{drinks} drinks</div>
          <div className="text-blue-200 text-sm">Approx. ice needed: {iceLb} lb</div>
        </div>
      </div>
    );
  };

  const renderSeatAdvisor = () => {
    const p = Math.max(0, Number(seatPassengers) || 0);
    const s = Math.max(0, Number(seatSeats) || 0);
    return (
      <div className="grid gap-3">
        <label className="text-blue-100">Passengers</label>
        <input type="number" value={seatPassengers} onChange={(e) => setSeatPassengers(Number(e.target.value))} className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" />
        <label className="text-blue-100">Available Seats</label>
        <input type="number" value={seatSeats} onChange={(e) => setSeatSeats(Number(e.target.value))} className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" />
        <div className="mt-3 bg-[#0e294e] p-3 rounded-lg border border-blue-800/20">
          {p <= s ? (
            <div className="text-2xl font-bold text-white">Fits: {s - p} spare seats</div>
          ) : (
            <div className="text-2xl font-bold text-yellow-300">Does not fit: need {p - s} more seats</div>
          )}
        </div>
      </div>
    );
  };

  const renderBarHop = () => {
    const totalMins = stopDurations.reduce((a, b) => a + (Number(b) || 0), 0);
    return (
      <div className="grid gap-3">
        <div className="grid gap-2">
          <label className="text-blue-100">Add Stop</label>
          <div className="flex gap-2">
            <input value={newStop} onChange={(e) => setNewStop(e.target.value)} className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white flex-1" />
            <button onClick={addStop} className="bg-blue-600 px-3 rounded-lg">Add</button>
          </div>
        </div>
        <div className="grid gap-2">
          {stops.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className="flex-1 text-white">{s}</div>
              <input type="number" value={stopDurations[i]} onChange={(e) => updateDuration(i, Number(e.target.value))} className="w-24 bg-[#12244e] border border-blue-800/30 rounded-lg px-2 py-1 text-white" />
              <div className="text-blue-200 text-sm">min</div>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-[#0e294e] p-3 rounded-lg border border-blue-800/20">
          <div className="text-blue-100">Total time: {Math.ceil(totalMins / 60)} hrs {totalMins % 60} mins</div>
        </div>
      </div>
    );
  };

  const renderVibe = () => {
    const suggestions: Record<string, string[]> = {
      Chill: ["Lo-fi Beats", "Acoustic Chill", "Indie Mellow"],
      Club: ["Top 40 Club Mix", "EDM Party", "House Hits"],
      Throwback: ["2000s Pop", "90s R&B", "Classic Hip-Hop"]
    };
    return (
      <div className="grid gap-3">
        <label className="text-blue-100">Choose Vibe</label>
        <select value={vibe} onChange={(e) => setVibe(e.target.value)} className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white">
          <option>Chill</option>
          <option>Club</option>
          <option>Throwback</option>
        </select>
        <div className="mt-3 bg-[#0e294e] p-3 rounded-lg border border-blue-800/20">
          <div className="text-blue-100">Playlist suggestions for {vibe}:</div>
          <ul className="text-white mt-2 space-y-1">
            {suggestions[vibe].map((s) => (
              <li key={s}>• {s}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderStopPlanner = () => {
    const h = Math.max(0.25, Number(totalHours) || 0.25);
    const n = Math.max(1, Number(numStops) || 1);
    const minutes = Math.round((h * 60) / n);
    return (
      <div className="grid gap-3">
        <label className="text-blue-100">Total Hours</label>
        <input type="number" value={totalHours} onChange={(e) => setTotalHours(Number(e.target.value))} className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" />
        <label className="text-blue-100">Number of Stops</label>
        <input type="number" value={numStops} onChange={(e) => setNumStops(Number(e.target.value))} className="bg-[#12244e] border border-blue-800/30 rounded-lg px-3 py-2 text-white" />
        <div className="mt-3 bg-[#0e294e] p-3 rounded-lg border border-blue-800/20">
          <div className="text-blue-100">Plan: ~{minutes} minutes per stop</div>
        </div>
      </div>
    );
  };

  const content = () => {
    switch (tool.name) {
      case "Per Person Splitter":
        return renderPerPerson();
      case "BYOB Pack & Ice Calculator":
        return renderBYOB();
      case "Seat Space Fit Advisor":
        return renderSeatAdvisor();
      case "Bar Hop Route Builder":
        return renderBarHop();
      case "Vibe Selector":
        return renderVibe();
      case "Stop Timing Planner":
        return renderStopPlanner();
      default:
        return <div>Tool not implemented.</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" onClick={onClose}>
      <div className={`${sizeClass} w-full bg-gradient-to-br from-[#13306a] to-[#0e2250] border border-blue-800/40 rounded-2xl shadow-2xl relative`} onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-3 right-3 text-blue-100 hover:text-white text-2xl font-bold" onClick={onClose} aria-label="Close">×</button>
        <div className="px-6 py-5">
          <h3 className="text-2xl font-extrabold text-white mb-3 font-serif tracking-tight">{tool.icon} {tool.name}</h3>
          <p className="text-blue-200 mb-4">{tool.desc}</p>
          {content()}
        </div>
      </div>
    </div>
  );
}
