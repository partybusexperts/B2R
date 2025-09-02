"use client";

import React, { useState } from "react";

type QuoteResult = {
  id: number;
  title: string;
  city: string;
  capacity: number;
  price: number;
  image?: string | null;
};

export default function QuoteButton({ defaultZip }: { defaultZip?: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<QuoteResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchQuotes() {
    setLoading(true);
    setError(null);
    try {
      const q = new URL('/api/quote', window.location.origin);
      if (defaultZip) q.searchParams.set('zip', defaultZip);
      q.searchParams.set('hours', '4');
      q.searchParams.set('capacity', '20');

      const res = await fetch(q.toString());
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setResults(data.results ?? []);
      setOpen(true);
    } catch (e: any) {
      setError(e?.message ?? String(e));
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={fetchQuotes}
        className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow hover:bg-blue-500"
      >
        {loading ? "Loading…" : "Request a Quote"}
      </button>

      {open && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative max-w-xl w-full bg-white text-black rounded-lg p-6 z-10">
            <h3 className="text-lg font-semibold mb-4">Quotes</h3>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            {!error && !results && <div className="text-gray-600">No results</div>}
            {!error && results && results.length === 0 && <div className="text-gray-600">No vehicles found</div>}

            <ul className="space-y-3">
              {results?.map((r) => (
                <li key={r.id} className="flex items-center gap-3">
                  <img src={r.image ?? '/file.svg'} alt={r.title} className="w-16 h-12 object-cover rounded" />
                  <div>
                    <div className="font-semibold">{r.title}</div>
                    <div className="text-sm text-gray-600">{r.city} • {r.capacity} passengers</div>
                  </div>
                  <div className="ml-auto font-semibold">${r.price}</div>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex justify-end">
              <button onClick={() => setOpen(false)} className="px-4 py-2 rounded bg-gray-200">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
