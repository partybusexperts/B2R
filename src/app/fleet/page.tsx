"use client";

import Image from "next/image";

const vehicles = [
  {
    name: "Mini Party Bus",
    capacity: 10,
    image: "/globe.svg",
    description: "Perfect for small groups and intimate celebrations. Enjoy a cozy ride with premium sound and lighting." 
  },
  {
    name: "Sprinter Party Van",
    capacity: 14,
    image: "/vercel.svg",
    description: "A stylish van for mid-sized parties, featuring plush seating and a sleek interior for a VIP experience."
  },
  {
    name: "Classic Party Bus",
    capacity: 20,
    image: "/window.svg",
    description: "Spacious and fun, this bus is ideal for birthdays, bachelor/bachelorette parties, and more."
  },
  {
    name: "Luxury Limo Bus",
    capacity: 24,
    image: "/next.svg",
    description: "Arrive in style with leather seating, LED lights, and a state-of-the-art sound system."
  },
  {
    name: "Executive Coach",
    capacity: 30,
    image: "/globe.svg",
    description: "Perfect for corporate outings or large groups, with ample space and comfort."
  },
  {
    name: "Mega Party Bus",
    capacity: 40,
    image: "/vercel.svg",
    description: "The ultimate party on wheels—dance floor, bar area, and room for everyone!"
  },
  {
    name: "Charter Bus",
    capacity: 50,
    image: "/window.svg",
    description: "Great for big events, weddings, and group travel. Comfortable, reliable, and fun."
  },
  {
    name: "Stretch Limo",
    capacity: 8,
    image: "/next.svg",
    description: "Classic elegance for proms, weddings, or a night out. Enjoy privacy and luxury."
  }
];

export default function FleetPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      {/* Hero Section */}
      <section className="bg-blue-800 text-white py-12 mb-10 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">Party Bus & Limo Fleet</h1>
          <p className="text-lg md:text-xl mb-6 font-medium">Find the perfect ride for your next event. From luxury party buses to classic limos, we have a vehicle for every group and every occasion.</p>
          <a href="/contact" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg shadow transition">Get Instant Quote</a>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-4 gap-8 mb-12">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-3xl mb-2">🛡️</span>
          <h3 className="font-bold text-lg mb-1">Safety First</h3>
          <p className="text-gray-600 text-center text-sm">All vehicles are maintained to the highest standards and driven by professional, licensed chauffeurs.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-3xl mb-2">🚍</span>
          <h3 className="font-bold text-lg mb-1">Wide Selection</h3>
          <p className="text-gray-600 text-center text-sm">Choose from party buses, limos, coaches, and more—fit for any group size or event type.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-3xl mb-2">💬</span>
          <h3 className="font-bold text-lg mb-1">Friendly Support</h3>
          <p className="text-gray-600 text-center text-sm">Our team is here 7 days a week to answer questions and help you book the perfect ride.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-3xl mb-2">⚡</span>
          <h3 className="font-bold text-lg mb-1">Easy Booking</h3>
          <p className="text-gray-600 text-center text-sm">Get a quote in seconds and book online or by phone. It’s fast, simple, and secure.</p>
        </div>
      </section>

      {/* Vehicle Grid */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Popular Vehicles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {vehicles.map((vehicle, idx) => (
            <div key={vehicle.name} className="bg-white rounded-xl shadow-lg flex flex-col items-center p-6 hover:shadow-2xl transition-shadow border border-gray-100">
              <div className="w-full h-40 relative mb-4">
                <Image src={vehicle.image} alt={vehicle.name} fill className="object-contain rounded-lg" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{vehicle.name}</h3>
              <p className="text-sm text-gray-500 mb-2">Seats up to {vehicle.capacity} guests</p>
              <p className="text-gray-600 text-center mb-4">{vehicle.description}</p>
              <button className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Get a Quote</button>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <span className="text-3xl mb-2">📝</span>
            <h4 className="font-semibold mb-1">1. Request a Quote</h4>
            <p className="text-gray-600 text-sm">Tell us about your trip and group size.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl mb-2">📸</span>
            <h4 className="font-semibold mb-1">2. View Options</h4>
            <p className="text-gray-600 text-sm">See photos and pricing for available vehicles.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl mb-2">🛒</span>
            <h4 className="font-semibold mb-1">3. Book Online</h4>
            <p className="text-gray-600 text-sm">Reserve your ride in just a few clicks.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl mb-2">🎉</span>
            <h4 className="font-semibold mb-1">4. Enjoy the Ride</h4>
            <p className="text-gray-600 text-sm">Sit back, relax, and have a great time!</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">What Our Customers Say</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-700 italic mb-2">“Booking was so easy and the bus was spotless! Our driver was friendly and made our night unforgettable.”</p>
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-700">— Jamie R.</span>
              <span className="text-yellow-400">★★★★★</span>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-700 italic mb-2">“We had a blast on the Mega Party Bus for my birthday. Highly recommend for any big group!”</p>
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-700">— Alex P.</span>
              <span className="text-yellow-400">★★★★★</span>
            </div>
          </div>
        </div>
      </section>

      {/* We Also Offer Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">We Also Offer</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🚗</span>
            <h4 className="font-semibold mb-1">Stretch Limos</h4>
            <p className="text-gray-600 text-center text-sm">Classic limousines for weddings, proms, and special nights out.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🚌</span>
            <h4 className="font-semibold mb-1">Charter Buses</h4>
            <p className="text-gray-600 text-center text-sm">Large coaches for group travel, events, and tours.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🚐</span>
            <h4 className="font-semibold mb-1">Sprinter Vans</h4>
            <p className="text-gray-600 text-center text-sm">Perfect for airport transfers, corporate travel, and small groups.</p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h3 className="text-2xl font-bold mb-2 text-gray-800">Not sure which vehicle is right for you?</h3>
        <p className="text-gray-600 mb-4">Contact our team and we’ll help you find the perfect fit for your group and occasion.</p>
        <a href="/contact" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">Contact Us</a>
      </section>
    </main>
  );
}
