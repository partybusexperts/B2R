'use client';

import { useMemo, useState, useRef, useEffect } from 'react';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
      <div className="max-w-xl w-full text-center space-y-6 p-8 bg-white rounded-2xl shadow">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">
          Welcome to B2R
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          Your trusted source for party bus rentals in Chester, SC. Use our tools
          to plan your perfect event, get instant quotes, and more!
        </p>
        <a
          href="/tools"
          className="btn text-base px-8 py-3 inline-flex items-center justify-center rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Go to Party Bus Tools
        </a>
      </div>
    </main>
  );
}

