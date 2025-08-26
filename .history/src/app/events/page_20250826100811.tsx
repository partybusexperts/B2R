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

/* Rotating informational banners (injected every 6 cards = two desktop rows)
   Now focused on specific high-volume event scenarios. */
const INFO_BANNERS = [
  {
    title: "Wedding Timeline Tip",
    body: "Peak Saturday weddings book 6–12 months out. Build a 15 min photo buffer after the ceremony so transport never delays your reception entrance.",
    cta: { label: "Plan Wedding Shuttle", href: "/events/weddings" },
  },
  {
    title: "Prom & School Event Rules",
    body: "Most prom contracts require a no‑alcohol clause, chaperone contact & fixed pickup list. Gather it early to speed dispatch approval.",
    cta: { label: "Prom Guidelines", href: "/events/prom" },
  },
  {
    title: "Concert / Festival Exit",
    body: "After big shows, rideshare zones jam for 30+ minutes. Set a meet point 1–2 blocks out & give the driver a pinned map screenshot ahead of time.",
    cta: { label: "Concert Transport Tips", href: "/events/concerts" },
  },
  {
    title: "Game Day Tailgate",
    body: "Stadium lots can freeze movement 45–60 min post‑game. Add post‑event buffer & early arrival if you’re unloading grills or tents.",
    cta: { label: "Game Day Planning", href: "/events/sporting-events" },
  },
];

function InfoBanner({ title, body, cta }: { title: string; body: string; cta?: { label: string; href: string } }) {
  return (
    <div className="sm:col-span-2 md:col-span-3 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-6 md:p-7 flex flex-col md:flex-row md:items-center gap-5 border border-blue-400/30 shadow-[0_6px_18px_-2px_rgba(0,0,0,.4)]">
      <div className="flex-1">
        <h4 className="text-xl font-extrabold text-white mb-1 tracking-tight font-serif">{title}</h4>
        <p className="text-blue-100/90 leading-relaxed text-sm md:text-base">{body}</p>
      </div>
      {cta && (
        <a
          href={cta.href}
          className="inline-flex items-center justify-center rounded-full px-6 py-2 font-bold text-sm bg-white text-blue-900 hover:bg-blue-50 border border-blue-100 shadow"
        >
          {cta.label} →
        </a>
      )}
    </div>
  );
}

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
            <a href="/quote#instant" className="rounded-full font-bold px-6 py-3 text-base shadow-lg transition border flex items-center justify-center min-w-[200px] bg-white/95 text-blue-900 hover:bg-white border-blue-200">Instant Quote</a>
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
            {eventDetails.map((event, i) => {
              const card = (
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
                      <span className="flex items-center gap-2"><span>Quote</span></span>
                    </a>
                  </div>
                </a>
              );
              const needsBanner = (i + 1) % 6 === 0 && i !== eventDetails.length - 1; // every 6 cards except after last
              if (!needsBanner) return card;
              const bannerIndex = Math.floor((i + 1) / 6 - 1) % INFO_BANNERS.length;
              const b = INFO_BANNERS[bannerIndex];
              return [
                card,
                <InfoBanner key={`banner-${i}`} title={b.title} body={b.body} cta={b.cta} />,
              ];
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventsPage;


