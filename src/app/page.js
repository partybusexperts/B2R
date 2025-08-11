'use client';

import { useMemo, useState, useRef, useEffect } from 'react';

export default function Home() {
  // ---------------------------
  // Quick Estimate
  // ---------------------------
  const [hours, setHours] = useState('');
  const [group, setGroup] = useState('');
  const [estimateResult, setEstimateResult] = useState('');

  const estimateCost = () => {
    const h = parseInt(hours || '0', 10);
    const g = parseInt(group || '0', 10);
    if (h < 1 || g < 1) {
      setEstimateResult('Please enter valid hours and group size.');
      return;
    }
    const baseLow = 150;
    const baseHigh = 250;
    const perHourLow = 80;
    const perHourHigh = 120;
    const perPersonLow = 5;
    const perPersonHigh = 15;

    const low = baseLow + h * perHourLow + g * perPersonLow;
    const high = baseHigh + h * perHourHigh + g * perPersonHigh;

    setEstimateResult(
      `Estimated bus rental cost: $${low.toLocaleString()} - $${high.toLocaleString()} (contact for exact quote)`
    );
  };

  // ---------------------------
  // Recommendation
  // ---------------------------
  const [recGroup, setRecGroup] = useState('');
  const [recommendation, setRecommendation] = useState('');

  const recommendBus = () => {
    const g = parseInt(recGroup || '0', 10);
    let msg = '';
    if (g < 1) msg = 'Please enter a valid group size.';
    else if (g <= 10) msg = 'We recommend a small bus (up to 10 passengers).';
    else if (g <= 20) msg = 'We recommend a medium bus (10–20 passengers).';
    else if (g <= 40) msg = 'We recommend a large bus (20–40 passengers).';
    else msg = 'For groups larger than 40, contact us for custom options!';
    setRecommendation(msg);
  };

  // ---------------------------
  // Smart Quote
  // ---------------------------
  const [capacity, setCapacity] = useState('');
  const [city, setCity] = useState('Chester, SC');
  const [qHours, setQHours] = useState('');
  const [eventType, setEventType] = useState('prom');
  const [qDate, setQDate] = useState('');
  const [smartResult, setSmartResult] = useState('');

  const smartQuote = () => {
    const cap = parseInt(capacity || '0', 10);
    const hrs = parseInt(qHours || '0', 10);

    if (cap < 1 || hrs < 1 || !qDate) {
      setSmartResult('Please enter valid capacity, hours, and date.');
      return;
    }
    const dateObj = new Date(qDate);
    let base = 200;
    if (eventType === 'prom') base += 100;
    // Saturday bump
    if (dateObj.getDay() === 6) base += 50;

    const estimate = base + hrs * 100 + cap * 10;
    setSmartResult(
      `Estimated cost for ${eventType} in ${city}: $${estimate.toLocaleString()}`
    );
  };

  // ---------------------------
  // Availability
  // ---------------------------
  const [availDate, setAvailDate] = useState('');
  const [availTime, setAvailTime] = useState('');
  const [availResult, setAvailResult] = useState('');

  const checkAvailability = () => {
    if (!availDate || !availTime) {
      setAvailResult('Please pick a date and time.');
      return;
    }
    const status = Math.random() > 0.5 ? 'Available' : 'Low Availability — Book Soon!';
    setAvailResult(`For ${availDate} at ${availTime}: ${status}`);
  };

  // ---------------------------
  // Theme Planner
  // ---------------------------
  const [vibe, setVibe] = useState('glam');
  const [themeResult, setThemeResult] = useState('');

  const planTheme = () => {
    let msg = '';
    switch (vibe) {
      case 'glam':
        msg =
          'Recommend luxury limo with LED themes in gold, playlist of pop hits, local upscale stops.';
        break;
      case 'bachelor':
        msg =
          'Recommend party bus with club lighting, hip-hop playlist, and bar route.';
        break;
      case 'club':
        msg =
          'Recommend large party bus with dance floor, EDM playlist, and night club route.';
        break;
      case 'teen':
        msg =
          'Recommend fun bus with colorful lights, teen pop playlist, and safe fun stops.';
        break;
      default:
        msg = '';
    }
    setThemeResult(msg);
  };

  // ---------------------------
  // Split the Bill
  // ---------------------------
  const [total, setTotal] = useState('');
  const [numPeople, setNumPeople] = useState('1');
  const [splitResult, setSplitResult] = useState('');

  const generateSplit = () => {
    const t = parseFloat(total || '0');
    const n = parseInt(numPeople || '1', 10);
    if (t < 1 || n < 1) {
      setSplitResult('Please enter a valid total and number of people.');
      return;
    }
    const pp = (t / n).toFixed(2);
    setSplitResult(`Each pays $${pp}. You can send them a payment link.`);
  };

  // ---------------------------
  // Export Quote (mock)
  // ---------------------------
  const [exportMsg, setExportMsg] = useState('');
  const exportQuote = () => {
    setExportMsg('Your quote was exported (simulated). Check your email.');
  };

  // ---------------------------
  // Simple Poll
  // ---------------------------
  const vote = (id) => {
    // eslint-disable-next-line no-alert
    alert(`Thanks for voting in the ${id} poll! Results will be updated soon.`);
  };

  // ---------------------------
  // Prom Countdown (days until May 1, 2026)
  // ---------------------------
  const countdownRef = useRef(null);
  useEffect(() => {
    const promDate = new Date('May 1, 2026 00:00:00').getTime();
    const update = () => {
      const now = Date.now();
      const dist = promDate - now;
      const days = Math.max(0, Math.floor(dist / (1000 * 60 * 60 * 24)));
      if (countdownRef.current) {
        countdownRef.current.textContent = `${days} days until prom season starts!`;
      }
    };
    update();
    const id = setInterval(update, 86_400_000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">
            Prom Party Bus Rental — Chester, SC
          </h1>
          <p ref={countdownRef} className="text-sm text-gray-600" />
          <p className="text-sm text-gray-600">
            Welcome! This page provides tools to help you plan and reserve the
            perfect party bus for your event.
          </p>
        </header>

        {/* Quick Estimate */}
        <section className="bg-white border border-gray-200 rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold">Quick Estimate</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              className="w-full rounded border border-gray-300 px-3 py-2"
              type="number"
              min="1"
              placeholder="Hours"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
            <input
              className="w-full rounded border border-gray-300 px-3 py-2"
              type="number"
              min="1"
              placeholder="Group size"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            />
          </div>
          <button
            onClick={estimateCost}
            className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Estimate
          </button>
          {estimateResult && (
            <p className="text-sm text-gray-700">{estimateResult}</p>
          )}
        </section>

        {/* Recommendation */}
        <section className="bg-white border border-gray-200 rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold">Bus Recommendation</h2>
          <div className="flex gap-3">
            <input
              className="w-40 rounded border border-gray-300 px-3 py-2"
              type="number"
              min="1"
              placeholder="Group size"
              value={recGroup}
              onChange={(e) => setRecGroup(e.target.value)}
            />
            <button
              onClick={recommendBus}
              className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Recommend
            </button>
          </div>
          {recommendation && (
            <p className="text-sm text-gray-700">{recommendation}</p>
          )}
        </section>

        {/* Smart Quote */}
        <section className="bg-white border border-gray-200 rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold">Smart Quote</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              className="w-full rounded border border-gray-300 px-3 py-2"
              type="number"
              min="1"
              placeholder="Capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
            <input
              className="w-full rounded border border-gray-300 px-3 py-2"
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              className="w-full rounded border border-gray-300 px-3 py-2"
              type="number"
              min="1"
              placeholder="Hours"
              value={qHours}
              onChange={(e) => setQHours(e.target.value)}
            />
            <select
              className="w-full rounded border border-gray-300 px-3 py-2"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            >
              <option value="prom">Prom</option>
              <option value="wedding">Wedding</option>
              <option value="birthday">Birthday</option>
            </select>
            <input
              className="w-full rounded border border-gray-300 px-3 py-2"
              type="date"
              value={qDate}
              onChange={(e) => setQDate(e.target.value)}
            />
          </div>
          <button
            onClick={smartQuote}
            className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Get Quote
          </button>
          {smartResult && (
            <p className="text-sm text-gray-700">{smartResult}</p>
          )}
        </section>

        {/* Availability */}
        <section className="bg-white border border-gray-200 rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold">Availability</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              className="w-full rounded border border-gray-300 px-3 py-2"
              type="date"
              value={availDate}
              onChange={(e) => setAvailDate(e.target.value)}
            />
            <input
              className="w-full rounded border border-gray-300 px-3 py-2"
              type="time"
              value={availTime}
              onChange={(e) => setAvailTime(e.target.value)}
            />
            <button
              onClick={checkAvailability}
              className="inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Check
            </button>
          </div>
          {availResult && <p className="text-sm text-gray-700">{availResult}</p>}
        </section>

        {/* Theme Planner */}
        <section className="bg-white border border-gray-200 rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold">Theme Planner</h2>
          <div className="flex gap-3">
            <select
              className="w-48 rounded border border-gray-300 px-3 py-2"
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
            >
              <option value="glam">Glam</option>
              <option value="bachelor">Bachelor</option>
              <option value="club">Club</option>
              <option value="teen">Teen</option>
            </select>
            <button
              onClick={planTheme}
              className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Plan
            </button>
          </div>
          {themeResult && (
            <p className="text-sm text-gray-700">{themeResult}</p>
          )}
        </section>

        {/* Split the Bill */}
        <section className="bg-white border border-gray-200 rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold">Split the Bill</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              className="w-full rounded border border-gray-300 px-3 py-2"
              type="number"
              min="1"
              placeholder="Total ($)"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
            />
            <input
              className="w-full rounded border border-gray-300 px-3 py-2"
              type="number"
              min="1"
              placeholder="Number of people"
              value={numPeople}
              onChange={(e) => setNumPeople(e.target.value)}
            />
            <button
              onClick={generateSplit}
              className="inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Generate
            </button>
          </div>
          {splitResult && <p className="text-sm text-gray-700">{splitResult}</p>}
        </section>

        {/* Export Quote */}
        <section className="bg-white border border-gray-200 rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold">Export Quote</h2>
          <button
            onClick={exportQuote}
            className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Export
          </button>
          {exportMsg && <p className="text-sm text-gray-700">{exportMsg}</p>}
        </section>

        {/* Poll */}
        <section className="bg-white border border-gray-200 rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold">Poll</h2>
          <button
            onClick={() => vote('live-band')}
            className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Vote &ldquo;Live Band&rdquo;
          </button>
        </section>

        <footer className="py-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Bus2Ride. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
