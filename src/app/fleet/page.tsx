"use client";

import React from "react";
import Image from "next/image";

const vehicles = [
  {
    name: "Party Bus",
    capacity: 30,
    image: "/images/globe.svg",
    description: "The ultimate party on wheels—dance floor, bar area, and room for everyone!"
  },
  {
    name: "Limousine",
    capacity: 10,
    image: "/images/next.svg",
    description: "Classic elegance for proms, weddings, or a night out. Enjoy privacy and luxury."
  },
  {
    name: "Limo Style Sprinter Van",
    capacity: 14,
    image: "/images/vercel.svg",
    description: "A stylish van for mid-sized parties, featuring plush seating and a sleek interior for a VIP experience."
  },
  {
    name: "Executive Style Sprinter Van",
    capacity: 14,
    image: "/images/window.svg",
    description: "Perfect for business travel or upscale group transport, with executive seating and amenities."
  },
  {
    name: "Shuttle Bus",
    capacity: 24,
    image: "/images/globe.svg",
    description: "Ideal for group transportation, airport runs, and events. Comfortable and reliable."
  },
  {
    name: "Coach Bus",
    capacity: 50,
    image: "/images/vercel.svg",
    description: "Great for big events, weddings, and group travel. Comfortable, reliable, and fun."
  }
];

export default function FleetPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-blue-50 to-sky-100 flex flex-col items-center justify-center py-20 md:py-32 mb-10 rounded-b-3xl shadow-lg border-b border-blue-200">
        <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-4 text-blue-900 drop-shadow-lg">Chicago Party Buses</h1>
        <p className="text-center text-xl md:text-2xl text-slate-800 max-w-2xl mb-8 font-medium">The ultimate way to celebrate, travel, and make memories. Our luxury party buses are ready for your next big event.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/quote" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow transition">Get Instant Quote</a>
          <a href="/fleet" className="bg-white border border-blue-600 text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold text-lg shadow transition">See All Buses</a>
          <a href="/contact" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow transition">Contact Us</a>
        </div>
      </section>
      {/* Fleet Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-center mb-4 text-gray-900">Our Fleet</h1>
        <p className="text-center text-lg text-gray-600 mb-10">
          Discover the perfect ride for your next event! Our diverse fleet offers something for every group size and occasion. All vehicles are maintained to the highest standards for safety and comfort.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {vehicles.map((vehicle) => (
            <div key={vehicle.name} className="bg-white rounded-xl shadow-lg flex flex-col items-center p-6 hover:shadow-2xl transition-shadow">
              <div className="w-full h-40 relative mb-4">
                <Image src={vehicle.image} alt={vehicle.name} fill className="object-contain rounded-lg" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">{vehicle.name}</h2>
              <p className="text-sm text-gray-500 mb-2">Seats up to {vehicle.capacity} guests</p>
              <p className="text-gray-600 text-center mb-4">{vehicle.description}</p>
              <button className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Get a Quote</button>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-2 text-gray-800">Not sure which vehicle is right for you?</h3>
          <p className="text-gray-600 mb-4">Contact our team and we’ll help you find the perfect fit for your group and occasion.</p>
          <a href="/contact" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">Contact Us</a>
        </div>
      </section>
    </main>
  );
}