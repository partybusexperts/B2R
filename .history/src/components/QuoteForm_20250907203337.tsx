import React, { useState } from 'react';

type QuoteRequest = {
  category_slug?: string | null;
  city?: string | null;
  passengers: number;
  hours: number;
  event_type?: string | null;
  event_date?: string | null;
  start_time?: string | null;
};

export default function QuoteForm() {
  const [city, setCity] = useState('');
  const [passengers, setPassengers] = useState(4);
  const [hours, setHours] = useState(2);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<unknown | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (passengers <= 0 || hours <= 0) {
      setError('Passengers and hours must be greater than 0');
      return;
    }
    setLoading(true);
    const body: QuoteRequest = {
      city: city || undefined,
      passengers,
      hours,
    };

    try {
      const res = await fetch('/api/quote-vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? 'Quote request failed');
      } else if (!data.ok) {
        setError(data.error ?? 'Quote returned an error');
      } else {
        setResult(data.data);
      }
    } catch (err) {
      setError((err as Error).message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">Instant Quote</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <label className="flex flex-col">
          <span className="text-sm">City / Zip</span>
          <input value={city} onChange={(e) => setCity(e.target.value)} className="border p-2 rounded mt-1" placeholder="City or ZIP" />
        </label>

        <label className="flex flex-col">
          <span className="text-sm">Passengers</span>
          <input type="number" value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} className="border p-2 rounded mt-1" min={1} />
        </label>

        <label className="flex flex-col">
          <span className="text-sm">Hours</span>
          <input type="number" value={hours} onChange={(e) => setHours(Number(e.target.value))} className="border p-2 rounded mt-1" min={1} />
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-60" disabled={loading}>
          {loading ? 'Getting quote…' : 'Get Quote'}
        </button>
        <button type="button" className="text-sm underline" onClick={() => { setCity(''); setPassengers(4); setHours(2); setResult(null); setError(null); }}>
          Reset
        </button>
      </div>

      <div className="mt-4">
        {error && <div className="text-red-600">{error}</div>}
        {result && (
          <div className="bg-gray-50 p-3 rounded border mt-2">
            <pre className="text-sm overflow-x-auto">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </form>
  );
}
