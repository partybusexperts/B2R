"use client";
import React, { useState } from "react";
import { eventDetails } from "./eventDetails";

/* ---------- Contact constants for consistent CTAs ---------- */
const PHONE_DISPLAY = "(888) 535-2566";
const PHONE_TEL = "8885352566";
const EMAIL = "info@bus2ride.com";

/* ---------- Image pool ---------- */
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
      {/* ---------- HERO (matches style used on other pages) ---------- */}
      <header className="relative overflow-hidden min-h-[520px] md:min-h-[600px] flex flex-col items-center justify-center text-center py-20">
        {/* Bright gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-blue-600 to-indigo-900" />
        {/* Sheen overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 mix-blend-overlay pointer-events-none" />

        <h1 className="relative z-10 text-5xl md:text-7xl font-extrabold mb-6 tracking-tight font-serif text-white drop-shadow-[0_6px_20px_rgba(0,0,0,.35)]">
          Events &amp; Occasions
        </h1>
        <p className="relative z-10 text-2xl md:text-3xl max-w-4xl mx-auto mb-10 text-blue-50 font-medium drop-shadow">
          Explore our most popular events—from weddings and proms to concerts and game days. Find the perfect ride and make your occasion unforgettable.
        </p>

        {/* CTAs */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center w-full max-w-3xl">
          <a
            href="/quote#instant"
            className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] whitespace-nowrap bg-white/95 text-blue-900 hover:bg-white border-blue-200"
          >
            ⚡ Instant Live Quote
          </a>
          <a
            href="/fleet"
            className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] whitespace-nowrap bg-blue-600 text-white hover:bg-blue-700 border-blue-700"
          >
            🚌 View Fleet
          </a>
          <a
            href={`tel:${PHONE_TEL}`}
            className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[210px] whitespace-nowrap bg-blue-800 text-white hover:bg-blue-900 border-blue-900"
          >
            Call {PHONE_DISPLAY}
          </a>
        </div>

        {/* Decorative wave divider */}
        <div className="absolute bottom-[-1px] left-0 right-0">
          <svg viewBox="0 0 1440 110" className="w-full h-[110px]" preserveAspectRatio="none">
            <path
              d="M0,80 C240,130 480,20 720,60 C960,100 1200,40 1440,80 L1440,120 L0,120 Z"
              fill="#122a56"
            />
          </svg>
        </div>
      </header>

      {/* ---------- BODY ---------- */}
      <div className="min-h-screen w-full bg-[#122a56] py-10 px-2 md:px-0">
        <div className="w-full max-w-7xl mx-auto bg-[#0f1f46] rounded-3xl shadow-2xl p-6 md:p-12 border border-blue-800/30">
          {/* Jump selector */}
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-3 mb-8">
            <label htmlFor="event-jump" className="text-blue-100 font-semibold">
              Jump to an event:
            </label>
            <select
              id="event-jump"
              className="rounded-lg px-4 py-2 bg-[#12244e] text-blue-50 border border-blue-800/40 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[220px]"
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

          {/* Intro copy (kept, styled to match) */}
          <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-3 mt-2 tracking-tight font-serif">
            Events &amp; Occasions
          </h2>
          <p className="text-lg md:text-xl text-blue-100/90 text-center mb-10 max-w-3xl mx-auto">
            Whether it’s a wedding, prom, concert, sporting event, or a night out—we’ve got the perfect vehicle, professional driver, and easy booking to match.
          </p>

          {/* Cards */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            {eventDetails.map((event, i) => (
              <a
                key={event.name}
                href={
                  event.href ||
                  `/events/${event.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "")}`
                }
                className="bg-[#12244e] rounded-3xl shadow-[0_10px_30px_rgba(2,6,23,.35)] border border-blue-800/40 flex flex-col items-center p-6 hover:scale-[1.02] transition-transform group no-underline min-h-[500px]"
                aria-label={`Learn more about ${event.name}`}
              >
                <img
                  src={eventImages[i % eventImages.length]}
                  alt={event.name}
                  className="rounded-2xl shadow-lg w-full h-64 object-cover object-center mb-4 border border-blue-800/40"
                  loading="lazy"
                />
                <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2 font-serif text-center group-hover:text-blue-100 transition-colors">
                  {event.name}
                </h3>
                <p className="text-base md:text-lg text-blue-100/90 text-center mb-6">{event.description}</p>

                <div className="flex flex-row flex-wrap gap-3 justify-center items-center w-full mt-auto">
                  <a
                    href={`tel:${PHONE_TEL}`}
                    className="rounded-full font-bold px-6 py-2 text-base tracking-tight shadow-md transition border flex items-center justify-center min-w-[170px] bg-white text-blue-900 border-blue-200 hover:bg-blue-50"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-pink-600 text-xl">📞</span>
                      <span>{PHONE_DISPLAY}</span>
                    </span>
                  </a>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="rounded-full font-bold px-6 py-2 text-base tracking-tight shadow-md transition border flex items-center justify-center min-w-[120px] bg-blue-600 text-white border-blue-700 hover:bg-blue-700"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-white text-xl">✉️</span>
                      <span>Email</span>
                    </span>
                  </a>
                  <a
                    href="/quote#instant"
                    className="rounded-full font-bold px-6 py-2 text-base tracking-tight shadow-md transition border flex items-center justify-center min-w-[140px] bg-white text-blue-900 border-blue-200 hover:bg-blue-50"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-yellow-500 text-xl">⚡</span>
                      <span>Quote</span>
                    </span>
                  </a>
                </div>
              </a>
            ))}
          </div>

          {/* Footer CTA inside section */}
          <div className="flex justify-center">
            <div className="mt-12 bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-2xl shadow-xl px-10 py-8 flex flex-col items-center w-full max-w-3xl border border-blue-300/40">
              <div className="text-3xl md:text-4xl font-extrabold text-center mb-3 font-serif tracking-tight">
                Ready to Book or Have Questions?
              </div>
              <div className="mb-4 text-lg">
                Call{" "}
                <a href={`tel:${PHONE_TEL}`} className="underline font-bold">
                  {PHONE_DISPLAY}
                </a>{" "}
                or email{" "}
                <a href={`mailto:${EMAIL}`} className="underline font-bold">
                  {EMAIL}
                </a>
              </div>
              <a
                href="/quote#instant"
                className="inline-block bg-white text-blue-900 hover:bg-blue-50 font-bold px-8 py-3 rounded-xl shadow-lg text-lg transition border border-blue-200"
              >
                Get a Free Quote
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventsPage;


