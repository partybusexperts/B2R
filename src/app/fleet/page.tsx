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
