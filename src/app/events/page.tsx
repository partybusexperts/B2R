


import React from "react";
import { eventDetails } from "./eventDetails";
import PageLayout from "../../components/PageLayout";
import Section from "../../components/Section";

const eventImages = [
  "/images/18 Passenger White Party Bus Exterior.png",
  "/images/18 Passenger White Party Bus Interior.png",
  "/images/20 Passenger White Party Bus Exterior.png",
  "/images/36 Passenger Party Bus Exterior 4.png",
  "/images/Bus-1.png",
  "/images/Bus-2.png",
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

export default function EventsPage() {
  return (
    <PageLayout gradientFrom="from-blue-950" gradientVia="via-blue-900" gradientTo="to-black" textColor="text-white">
      <Section className="max-w-7xl mx-auto relative overflow-hidden bg-gradient-to-br from-blue-900/80 to-black">
        <h1 className="text-5xl font-extrabold text-white text-center mb-10 mt-8 tracking-tight">Events & Occasions</h1>
        <p className="text-lg text-center text-blue-100 mb-10 max-w-2xl mx-auto">
          Explore our most popular events and occasions for group transportation. Whether it’s a wedding, prom, concert, sporting event, or a night out, we have the perfect ride for every celebration. Click any event to learn more, get tips, and see how Bus2Ride can make your occasion unforgettable!
        </p>
        {/* Render events in rows of 4, with CTAs/info blocks between some rows */}
        {Array.from({ length: Math.ceil(eventDetails.length / 4) }).map((_, rowIdx) => (
          <React.Fragment key={rowIdx}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-10">
              {eventDetails.slice(rowIdx * 4, rowIdx * 4 + 4).map((event, i) => (
                <a
                  key={event.name}
                  href={event.href || `/events/${event.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`}
                  className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-300 hover:-translate-y-2 cursor-pointer group text-inherit no-underline"
                >
                  <img
                    src={eventImages[(rowIdx * 4 + i) % eventImages.length]}
                    alt={event.name}
                    className="w-full h-72 object-cover rounded-xl mb-4 border-2 border-blue-200"
                  />
                  <h3 className="font-bold text-lg mb-2 text-blue-900 text-center group-hover:text-blue-700 transition-colors">{event.name}</h3>
                  <p className="text-blue-800 text-base mb-4 text-center">{event.description}</p>
                  <span className="block w-full bg-blue-700 text-white font-bold py-2 rounded-lg text-center mb-1 mt-2 opacity-80 group-hover:opacity-100 transition">Learn More</span>
                </a>
              ))}
            </div>
            {/* Insert a cool CTA/info block after every 2 rows, except after the last row */}
            {(rowIdx + 1) % 2 === 0 && rowIdx !== Math.ceil(eventDetails.length / 4) - 1 && (
              <div className="flex justify-center mb-10">
                <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-2xl shadow-xl px-10 py-8 flex flex-col items-center w-full max-w-3xl border-2 border-blue-400">
                  <div className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">Ready to Book or Have Questions?</div>
                  <div className="mb-4 text-lg">Call <a href="tel:8885352566" className="underline font-bold">888-535-2566</a> or email <a href="mailto:info@bus2ride.com" className="underline font-bold">info@bus2ride.com</a></div>
                  <a href="/quote" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-lg transition">Get a Free Quote</a>
                </div>
              </div>
            )}
            {/* Insert a fun event tip/info block after the first row */}
            {rowIdx === 0 && (
              <div className="flex justify-center mb-10">
                <div className="bg-gradient-to-br from-blue-100 to-blue-300 text-blue-900 rounded-2xl shadow-xl px-10 py-8 flex flex-col items-center w-full max-w-3xl border-2 border-blue-400">
                  <div className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">Did You Know?</div>
                  <div className="mb-2 text-lg">We handle every kind of event—weddings, proms, concerts, sporting events, birthdays, and more. Our team will help you plan the perfect ride for any occasion!</div>
                  <div className="text-blue-800 text-base">Book early for big events to guarantee your spot and get the best rates.</div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </Section>
    </PageLayout>
  );
}
