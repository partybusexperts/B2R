// src/components/Header.tsx
'use client';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-400 text-white py-16 px-4 text-center rounded-b-3xl shadow-lg">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
        Ride in Style. Arrive in Luxury.
      </h1>
      <p className="text-lg md:text-2xl mb-6 font-light max-w-2xl mx-auto">
        Party bus, limo, and coach rentals for every occasion. Book your unforgettable ride today!
      </p>
      <a href="#contact" className="inline-block bg-white text-blue-700 font-semibold px-8 py-3 rounded-full shadow hover:bg-blue-50 transition">
        Get a Free Quote
      </a>
    </header>
  );
}
