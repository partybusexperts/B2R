"use client";
import React, { useState } from "react";

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000);
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const defaultBuffer = 20; // minutes
const defaultReturnBuffer = 10; // minutes

const PickupTimingPlanner: React.FC = () => {
  const [eventTime, setEventTime] = useState("");
  const [distance, setDistance] = useState("");
  const [result, setResult] = useState<null | {
    pickup: string;
    returnTime: string;
    travelMinutes: number;
  }>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTime || !distance) return;
    const event = new Date(`1970-01-01T${eventTime}`);
    const miles = parseFloat(distance);
    if (isNaN(miles) || miles <= 0) return;
    // Assume average speed 30 mph (urban), 45 mph (highway)
    const avgSpeed = miles < 20 ? 30 : 45;
    const travelMinutes = Math.ceil((miles / avgSpeed) * 60);
    const pickup = addMinutes(event, -(travelMinutes + defaultBuffer));
    const returnTime = addMinutes(event, travelMinutes + defaultReturnBuffer);
    setResult({
      pickup: formatTime(pickup),
      returnTime: formatTime(returnTime),
      travelMinutes,
    });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-200 rounded-2xl shadow-xl p-10 border-2 border-blue-400 w-full">
      <h3 className="text-3xl font-extrabold mb-3 text-blue-900 tracking-tight drop-shadow">Pickup Timing Planner</h3>
      <p className="text-lg text-blue-900 mb-4">Enter your event start time and venue distance to get optimal pickup and return times, with built-in buffer.</p>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex flex-col">
          <label className="font-semibold mb-1 text-blue-800">Event Start Time</label>
          <input
            type="time"
            value={eventTime}
            onChange={e => setEventTime(e.target.value)}
            required
            className="border rounded px-3 py-2 text-lg"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold mb-1 text-blue-800">Venue Distance (miles)</label>
          <input
            type="number"
            min="1"
            step="0.1"
            value={distance}
            onChange={e => setDistance(e.target.value)}
            required
            className="border rounded px-3 py-2 text-lg"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-lg transition self-end md:self-center mt-4 md:mt-0"
        >
          Plan My Pickup
        </button>
      </form>
      {result && (
        <div className="bg-white rounded-xl shadow p-6 mt-4 border border-blue-200">
          <div className="text-lg text-blue-900 mb-2 font-bold">Recommended Times:</div>
          <ul className="text-blue-800 text-base space-y-1">
            <li><b>Pickup Time:</b> {result.pickup} (includes travel + buffer)</li>
            <li><b>Return Pickup:</b> {result.returnTime} (includes travel + buffer)</li>
            <li><b>Estimated Travel Time:</b> {result.travelMinutes} min</li>
          </ul>
          <div className="text-gray-600 text-sm mt-2">* Assumes average speed and standard buffer. Adjust for traffic, weather, or special needs.</div>
        </div>
      )}
    </div>
  );
};

export default PickupTimingPlanner;
