"use client";
import React, { useState } from "react";
import { eventDetails } from "./eventDetails";

const EventsPage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState("");

  const handleGo = () => {
    if (!selectedEvent) return;
    window.location.href = selectedEvent;
  };

  return (
    <div className="min-h-[60vh] w-full bg-[#122a56] flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-3xl bg-[#0f1f46] rounded-3xl shadow-2xl p-6 md:p-10 border border-blue-800/40">
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4">
          <label htmlFor="event-jump" className="text-blue-100 font-semibold whitespace-nowrap">
            Jump to an event:
          </label>
          <select
            id="event-jump"
            className="rounded-lg px-4 py-2 bg-[#12244e] text-blue-50 border border-blue-800/40 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[240px]"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
          >
            <option value="">Select an event…</option>
            {eventDetails.map((event) => (
              <option
                key={event.name}
                value={
                  event.href ||
                  `/events/${event.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "")}`
                }
              >
                {event.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="rounded-full font-bold px-6 py-2 text-base tracking-tight shadow-lg transition border flex items-center justify-center bg-blue-600 text-white border-blue-700 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleGo}
            disabled={!selectedEvent}
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;


