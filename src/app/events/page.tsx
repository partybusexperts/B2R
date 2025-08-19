import React from "react";
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
  return (
    <div className="min-h-screen w-full bg-[#1a237e] py-10 px-2 md:px-0 flex flex-col items-center">
      <div className="w-full max-w-7xl bg-gradient-to-b from-[#223a7a] to-[#1a237e] rounded-3xl shadow-2xl p-6 md:p-12 flex flex-col items-center mb-8">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white text-center mb-4 mt-2 tracking-tight font-serif">Events & Occasions</h1>
        <p className="text-lg md:text-xl text-blue-100 text-center mb-8 max-w-2xl mx-auto">
          Explore our most popular events and occasions for group transportation. Whether it’s a wedding, prom, concert, sporting event, or a night out, we have the perfect ride for every celebration. Click any event to learn more, get tips, and see how Bus2Ride can make your occasion unforgettable!
        </p>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          {eventDetails.map((event, i) => (
            <a
              key={event.name}
              href={event.href || `/events/${event.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`}
              className="bg-[#202e5a] rounded-2xl shadow-xl border-4 border-[#2a3fa4] flex flex-col items-center p-5 hover:scale-[1.03] transition-transform group text-inherit no-underline"
              aria-label={`Learn more about ${event.name}`}
            >
              <img
                src={eventImages[i % eventImages.length]}
                alt={event.name}
                className="rounded-2xl shadow-xl w-full h-64 object-cover object-center mb-4 border-2 border-[#3b5bdb]"
                loading="lazy"
              />
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 font-serif text-center group-hover:text-blue-200 transition-colors">{event.name}</h3>
              <p className="text-base md:text-lg text-blue-100 text-center mb-6">{event.description}</p>
              <div className="flex flex-row gap-3 justify-center items-center w-full mt-auto">
                <a
                  href="tel:8885352566"
                  className="rounded-full font-semibold px-5 py-1.5 text-sm tracking-tight uppercase shadow-md transition border flex items-center justify-center min-w-[120px] w-auto text-center bg-white text-blue-900 border-blue-200 hover:bg-blue-50 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-blue-600 text-lg">📞</span>
                    <span className="leading-tight">(888) 535-2566</span>
                  </span>
                </a>
                <a
                  href="mailto:info@bus2ride.com"
                  className="rounded-full font-semibold px-5 py-1.5 text-sm tracking-tight uppercase shadow-md transition border flex items-center justify-center min-w-[90px] w-auto text-center bg-[#3451d1] text-white border-blue-800 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-white text-lg">✉️</span>
                    <span className="leading-tight">Email</span>
                  </span>
                </a>
                <a
                  href="/quote"
                  className="rounded-full font-semibold px-5 py-1.5 text-sm tracking-tight uppercase shadow-md transition border flex items-center justify-center min-w-[90px] w-auto text-center bg-white text-blue-900 border-blue-200 hover:bg-blue-50 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-blue-600 text-lg">⚡</span>
                    <span className="leading-tight">Quote</span>
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