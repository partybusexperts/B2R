"use client";
import React, { useState } from "react";
import { eventDetails } from "./eventDetails";

const PHONE_DISPLAY = "(888) 535-2566";
const PHONE_TEL = "8885352566";
const EMAIL = "info@bus2ride.com";

const eventImages = [
  "/images/Bus-3.png",
  "/images/Bus-4.png",
  "/images/Bus-5.png",
  "/images/17 Passenger Black Party Bus Exterior.png",
  "/images/10 Passenger Black Lincoln Stretch Limo Exterior Black.png",
  "/images/10 Passenger Chrysler 300 Limo Exterior.png",
  "/images/10 Passenger Lincoln Stretch Limo Exterior 2.png",
  "/images/10 Passenger Lincoln Stretch Limo Exterior 3.png",
  "/images/10 Passenger Lincoln Stretch Limo Interior.png",
  "/images/10 Passenger Lincoln Stretch Limo Interior Clean.png",
  "/images/10 Passenger Lincoln Stretch Limo Interior Very Clean.png",
  "/images/10 Passenger Lincoln Stretch Limo Inside.png",
  "/images/16 Passenger Ford Excursion Limousine Interior.png",
  "/images/16 Passenger Ford Excursion Stretch Limo Interior.png",
  "/images/16_Passenger_Stretch_Excursion_Exterior_optimized.jpg",
  "/images/18 Passenger Cadillac Escalade Limo Exterior.png",
  "/images/18 Passenger Ford Excursion Limo Exterior 2.png",
  "/images/18 Passenger Ford Excursion Limo Inside.png",
  "/images/18 Passenger Hummer Limo Exterior.png",
  "/images/18 Passenger Hummer Limo Inside.png",
  "/images/18 Passenger Hummer Limo Interior.png",
  "/images/10 Passenger Sprinter Van Limo Style Interior 1.png",
  "/images/12 Passenger Executive Style Sprinter Van Exterior.png",
  "/images/14 Passenger Sprinter Van Limo Style Exterior Door Open.png",
  "/images/14 Passenger Sprinter Van Limo Style Interior Again.png",
];

const EventsPage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState("");

  const handleGo = () => {
    if (!selectedEvent) return;
    window.location.href = selectedEvent;
  };

  return (
    <>
      {/* Hero retains heading & intro */}
      <header className="relative overflow-hidden min-h-[480px] md:min-h-[560px] flex flex-col items-center justify-center text-center py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-blue-600 to-indigo-900" />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 pointer-events-none" />
        <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold mb-6 tracking-tight font-serif text-white drop-shadow-[0_6px_18px_rgba(0,0,0,.35)]">
          Events &amp; Occasions
        </h1>
        <p className="relative z-10 text-2xl md:text-3xl max-w-4xl mx-auto mb-10 text-blue-50 font-medium drop-shadow">
          Explore popular event types—weddings, proms, concerts, game days & more—then jump straight to the one you need.
        </p>
        {/* Primary CTAs */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center w-full max-w-3xl">
          <a href="/quote#instant" className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[200px] bg-white/95 text-blue-900 hover:bg-white border-blue-200">⚡ Instant Quote</a>
          <a href="/fleet" className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[200px] bg-blue-600 text-white hover:bg-blue-700 border-blue-700">🚌 View Fleet</a>
          <a href={`tel:${PHONE_TEL}`} className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[200px] bg-blue-800 text-white hover:bg-blue-900 border-blue-900">Call {PHONE_DISPLAY}</a>
        </div>
        <div className="absolute bottom-[-1px] left-0 right-0">
          <svg viewBox="0 0 1440 110" className="w-full h-[110px]" preserveAspectRatio="none"><path d="M0,80 C240,130 480,20 720,60 C960,100 1200,40 1440,80 L1440,120 L0,120 Z" fill="#122a56" /></svg>
        </div>
      </header>
      {/* Body with selector + cards (omit duplicate heading) */}
      <div className="w-full bg-[#122a56] py-12 px-3 md:px-6">
        <div className="w-full max-w-7xl mx-auto">
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 mb-10">
            <label htmlFor="event-jump" className="text-blue-100 font-semibold whitespace-nowrap">Jump to an event:</label>
            <select
              id="event-jump"
              className="rounded-lg px-4 py-2 bg-[#0f1f46] text-blue-50 border border-blue-800/40 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[240px]"
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
            >
              <option value="">Select an event…</option>
              {eventDetails.map((event) => (
                <option
                  key={event.name}
                  value={event.href || `/events/${event.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`}
                >
                  {event.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="rounded-full font-bold px-6 py-2 text-base shadow-lg transition border flex items-center justify-center bg-blue-600 text-white border-blue-700 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGo}
              disabled={!selectedEvent}
            >
              Go
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {eventDetails.map((event, i) => (
              <a
                key={event.name}
                href={event.href || `/events/${event.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`}
                className="bg-[#0f1f46] rounded-3xl shadow-[0_10px_28px_-4px_rgba(0,0,0,.45)] border border-blue-800/40 flex flex-col items-center p-6 hover:scale-[1.02] transition-transform group no-underline min-h-[480px]"
                aria-label={`Learn more about ${event.name}`}
              >
                <img
                  src={eventImages[i % eventImages.length]}
                  alt={event.name}
                  loading="lazy"
                  className="rounded-2xl shadow-lg w-full h-64 object-cover object-center mb-4 border border-blue-800/40"
                />
                <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2 font-serif text-center group-hover:text-blue-100 transition-colors">{event.name}</h3>
                <p className="text-base md:text-lg text-blue-100/90 text-center mb-6">{event.description}</p>
                <div className="flex flex-row flex-wrap gap-3 justify-center items-center w-full mt-auto">
                  <a href={`tel:${PHONE_TEL}`} className="rounded-full font-bold px-5 py-2 text-sm tracking-tight shadow-md transition border flex items-center justify-center min-w-[160px] bg-white text-blue-900 border-blue-200 hover:bg-blue-50">
                    <span className="flex items-center gap-2"><span className="text-pink-600 text-xl">📞</span><span>{PHONE_DISPLAY}</span></span>
                  </a>
                  <a href={`mailto:${EMAIL}`} className="rounded-full font-bold px-5 py-2 text-sm tracking-tight shadow-md transition border flex items-center justify-center min-w-[110px] bg-blue-600 text-white border-blue-700 hover:bg-blue-700">
                    <span className="flex items-center gap-2"><span className="text-white text-xl">✉️</span><span>Email</span></span>
                  </a>
                  <a href="/quote#instant" className="rounded-full font-bold px-5 py-2 text-sm tracking-tight shadow-md transition border flex items-center justify-center min-w-[120px] bg-white text-blue-900 border-blue-200 hover:bg-blue-50">
                    <span className="flex items-center gap-2"><span className="text-yellow-500 text-xl">⚡</span><span>Quote</span></span>
                  </a>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventsPage;


