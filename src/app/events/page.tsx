"use client";
import React, { useState } from "react";
import { eventDetails } from "./eventDetails";

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
    <div className="min-h-screen w-full bg-[#1a237e] py-10 px-2 md:px-0 flex flex-col items-center">
      <div className="w-full max-w-7xl bg-gradient-to-b from-[#223a7a] to-[#1a237e] rounded-3xl shadow-2xl p-6 md:p-12 flex flex-col items-center mb-8">
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-3 mb-6">
          <label htmlFor="event-jump" className="text-blue-200 font-semibold mr-2">Jump to an event:</label>
          <select
            id="event-jump"
            className="rounded-lg px-4 py-2 bg-[#202e5a] text-blue-100 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[200px]"
            value={selectedEvent}
            onChange={e => setSelectedEvent(e.target.value)}
          >
            <option value="">Select an event...</option>
            {eventDetails.map(event => (
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
            className="rounded-full font-bold px-6 py-2 text-base tracking-tight uppercase shadow-lg transition border flex items-center justify-center bg-blue-700 text-blue-100 border-blue-300 hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleGo}
            disabled={!selectedEvent}
          >
            Go
          </button>
        </div>
  <h1 className="text-5xl md:text-6xl font-extrabold text-blue-100 text-center mb-4 mt-2 tracking-tight font-serif">Events & Occasions</h1>
  <p className="text-lg md:text-xl text-blue-200 text-center mb-8 max-w-2xl mx-auto">
          Explore our most popular events and occasions for group transportation. Whether it’s a wedding, prom, concert, sporting event, or a night out, we have the perfect ride for every celebration. Click any event to learn more, get tips, and see how Bus2Ride can make your occasion unforgettable!
        </p>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          {eventDetails.map((event, i) => (
            <a
              key={event.name}
              href={event.href || `/events/${event.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`}
              className="bg-[#232f5c] rounded-3xl shadow-2xl border-2 border-[#3b4e8a] flex flex-col items-center p-6 hover:scale-[1.02] transition-transform group text-inherit no-underline min-h-[480px]"
              aria-label={`Learn more about ${event.name}`}
            >
              <img
                src={eventImages[i % eventImages.length]}
                alt={event.name}
                className="rounded-2xl shadow-lg w-full h-64 object-cover object-center mb-4 border-2 border-[#2a3fa4]"
                loading="lazy"
              />
              <h3 className="text-2xl md:text-3xl font-bold text-blue-100 mb-2 font-serif text-center group-hover:text-blue-200 transition-colors">{event.name}</h3>
              <p className="text-base md:text-lg text-blue-200 text-center mb-6">{event.description}</p>
              <div className="flex flex-row flex-wrap gap-3 justify-center items-center w-full mt-auto">
                <a
                  href="tel:8885352566"
                  className="rounded-full font-bold px-6 py-2 text-base tracking-tight shadow-md transition border-2 flex items-center justify-center min-w-[170px] max-w-full text-center bg-white text-blue-900 border-blue-200 hover:bg-blue-100 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap overflow-hidden"
                  style={{wordBreak: 'keep-all'}}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="text-pink-500 text-xl">📞</span>
                    <span className="leading-tight text-blue-900 font-semibold truncate">(888) 535-2566</span>
                  </span>
                </a>
                <a
                  href="mailto:info@bus2ride.com"
                  className="rounded-full font-bold px-6 py-2 text-base tracking-tight shadow-md transition border-2 flex items-center justify-center min-w-[120px] max-w-full text-center bg-blue-700 text-white border-blue-700 hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap overflow-hidden"
                  style={{wordBreak: 'keep-all'}}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="text-white text-xl">✉️</span>
                    <span className="leading-tight text-white font-semibold truncate">Email</span>
                  </span>
                </a>
                <a
                  href="/quote"
                  className="rounded-full font-bold px-6 py-2 text-base tracking-tight shadow-md transition border-2 flex items-center justify-center min-w-[120px] max-w-full text-center bg-[#f5f7fa] text-blue-900 border-blue-200 hover:bg-blue-100 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap overflow-hidden"
                  style={{wordBreak: 'keep-all'}}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="text-yellow-500 text-xl">⚡</span>
                    <span className="leading-tight text-blue-900 font-semibold truncate">Quote</span>
                  </span>
                </a>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;

