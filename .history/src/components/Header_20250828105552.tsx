"use client";
import React from 'react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-400 text-white py-12 px-4 text-center rounded-b-3xl shadow-lg">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Ride in Style. Arrive in Luxury.</h1>
        <p className="text-base md:text-lg mb-4 font-light max-w-2xl mx-auto">Party bus, limo, and coach rentals for every occasion. Book your unforgettable ride today!</p>
      </div>
    </header>
  );
}
