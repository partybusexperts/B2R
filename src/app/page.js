'use client';

import { useEffect, useRef } from 'react';

export default function Home() {
  const countdownRef = useRef(null);

  // ---------- helpers (same logic you had) ----------
  const estimateCost = () => {
    const hours = parseInt(document.getElementById('hours')?.value || '0', 10);
    const group = parseInt(document.getElementById('group')?.value || '0', 10);
    if (hours < 1 || group < 1) {
      document.getElementById('estimate-result').innerText =
        'Please enter valid hours and group size.';
      return;
    }
    const baseLow = 150, baseHigh = 250;
    const perHourLow = 80, perHourHigh = 120;
    const perPersonLow = 5, perPersonHigh = 15;
    const low = baseLow + hours * perHourLow + group * perPersonLow;
    const high = baseHigh + hours * perHourHigh + group * perPersonHigh;
    document.getElementById('estimate-result').innerText =
      `Estimated bus rental cost: $${low} – $${high} (contact for exact quote)`;
  };

  const recommendBus = () => {
    const group = parseInt(document.getElementById('group-size')?.value || '0', 10);
    let msg = '';
    if (group < 1) msg = 'Please enter a valid group size.';
    else if (group <= 10) msg = 'Small bus (up to 10 passengers).';
    else if (group <= 20) msg = 'Medium bus (10–20 passengers).';
    else if (group <= 40) msg = 'Large bus (20–40 passengers).';
    else msg = 'For 40+, contact us for custom options.';
    document.getElementById('bus-recommendation').innerText = msg;
  };

  const smartQuote = () => {
    const capacity = parseInt(document.getElementById('capacity')?.value || '0', 10);
    const city = document.getElementById('city')?.value || '';
    let hours = parseInt(document.getElementById('smart-hours')?.value || '0', 10);
    const eventType = document.getElementById('event-type')?.value || 'prom';
    const dateVal = document.getElementById('date')?.value;
    const date = dateVal ? new Date(dateVal) : new Date();

    if (capacity < 1 || hours < 1) {
      document.getElementById('smart-quote-result').innerText =
        'Please enter valid capacity and hours.';
      return;
    }
    let base = 200;
    if (eventType === 'prom') base += 100;
    if (date.getDay() === 6) base += 50;          // Saturday
    if (hours < 4 && date.getDay() === 6) hours = 4;

    const estimate = base + hours * 100 + capacity * 10;
    document.getElementById('smart-quote-result').innerText =
      `Estimated cost for ${eventType} in ${city}: $${estimate} (adjusted for details)`;
  };

  const checkAvailability = () => {
    const date = document.getElementById('avail-date')?.value || '';
    const time = document.getElementById('avail-time')?.value || '';
    const random = Math.random() > 0.5 ? 'Available' : 'Low Availability – Book Soon!';
    document.getElementById('avail-result').innerText = `For ${date} at ${time}: ${random}`;
  };

  const planTheme = () => {
    const vibe = document.getElementById('vibe')?.value || '';
    let msg = '';
    if (vibe === 'glam') msg = 'Luxury limo, gold LED themes, pop playlist.';
    else if (vibe === 'bachelor') msg = 'Party bus, club lighting, bar hops.';
    else if (vibe === 'club') msg = 'Large party bus, EDM, nightclub route.';
    else if (vibe === 'teen') msg = 'Colorful lights, teen pop, safe stops.';
    document.getElementById('theme-result').innerText = msg;
  };

  const exportQuote = () => {
    document.getElementById('export-result').innerText =
      'Your custom quote: $500 – Email sent, PDF generated, ID: QUOTE123';
  };

  const generateSplitLinks = () => {
    const total = parseFloat(document.getElementById('total-cost')?.value || '0');
    const num = parseInt(document.getElementById('num-people')?.value || '1', 10);
    if (total < 1 || num < 1) {
      document.getElementById('split-result').innerText =
        'Please enter valid total cost and number of people.';
      return;
    }
    const per = (total / num).toFixed(2);
    document.getElementById('split-result').innerText =
      `Each pays $${per}. Links generated (simulated): link1, link2…`;
  };

  const vote = (id) => alert(`Thanks for voting in the ${id} poll!`);

  // simple countdown
  useEffect(() => {
    const promDate = new Date('May 1, 2026 00:00:00').getTime();
    const update = () => {
      const days = Math.max(0, Math.floor((promDate - Date.now()) / 86400000));
      if (countdownRef.current) countdownRef.current.textContent =
        `${days} days until prom season starts!`;
    };
    update();
    const t = setInterval(update, 86400000);
    return () => clearInterval(t);
  }, []);

  // ---------- WRAPPED & STYLED CONTENT ----------
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
      <div className="flex flex-col items-center w-full max-w-2xl px-4 py-8">
        {/* Hero Section */}
        <section className="w-full bg-white shadow rounded-xl mb-6 p-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-2">Prom Party Bus Rental – Chester, SC</h1>
          <p ref={countdownRef} className="text-gray-500 mb-2" />
          <p className="text-lg text-gray-700 mb-4">
            Welcome! This page provides a suite of interactive tools to help you plan, estimate, and reserve the perfect party bus for your event. Whether you're looking for quick price estimates, bus recommendations, or ways to split the bill, everything you need is below.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-2">
            <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">Instant Estimates</span>
            <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Smart Quotes</span>
            <span className="inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold">Theme Planner</span>
            <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">Bill Splitter</span>
          </div>
          <a href="#tools" className="btn mt-4">Jump to Tools</a>
        </section>

        {/* Tools Section */}
        <section id="tools" className="w-full space-y-8 mb-12">
          {/* Quick Estimate */}
          <div className="card">
            <h2 className="mb-2">Quick Estimate</h2>
            <p className="text-sm text-gray-500 mb-2">Get a fast price range for your group and hours.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input id="hours" type="number" placeholder="Hours" className="input" />
              <input id="group" type="number" placeholder="Group size" className="input" />
            </div>
            <button onClick={estimateCost} className="btn mt-4 w-full">Estimate</button>
            <p id="estimate-result" className="mt-2 text-sm text-gray-700" />
          </div>

          {/* Bus Recommendation */}
          <div className="card">
            <h2 className="mb-2">Bus Recommendation</h2>
            <p className="text-sm text-gray-500 mb-2">Find the right bus size for your group.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input id="group-size" type="number" placeholder="Group size" className="input sm:max-w-xs" />
              <button onClick={recommendBus} className="btn">Recommend</button>
            </div>
            <p id="bus-recommendation" className="mt-2 text-sm text-gray-700" />
          </div>

          {/* Smart Quote */}
          <div className="card">
            <h2 className="mb-2">Smart Quote</h2>
            <p className="text-sm text-gray-500 mb-2">Get a detailed quote based on your event and preferences.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input id="capacity" type="number" placeholder="Capacity" className="input" />
              <input id="city" type="text" placeholder="City" defaultValue="Chester, SC" className="input" />
              <input id="smart-hours" type="number" placeholder="Hours" className="input" />
              <select id="event-type" className="input">
                <option value="prom">Prom</option>
                <option value="wedding">Wedding</option>
                <option value="birthday">Birthday</option>
              </select>
              <input id="date" type="date" className="input sm:col-span-2" />
            </div>
            <button onClick={smartQuote} className="btn mt-4 w-full">Get Quote</button>
            <p id="smart-quote-result" className="mt-2 text-sm text-gray-700" />
          </div>

          {/* Availability */}
          <div className="card">
            <h2 className="mb-2">Availability</h2>
            <p className="text-sm text-gray-500 mb-2">Check if your date and time are available.</p>
            <div className="flex flex-wrap gap-3">
              <input id="avail-date" type="date" className="input sm:max-w-xs" />
              <input id="avail-time" type="time" className="input sm:max-w-xs" />
              <button onClick={checkAvailability} className="btn">Check</button>
            </div>
            <p id="avail-result" className="mt-2 text-sm text-gray-700" />
          </div>

          {/* Theme Planner */}
          <div className="card">
            <h2 className="mb-2">Theme Planner</h2>
            <p className="text-sm text-gray-500 mb-2">Pick a vibe and get a custom party plan.</p>
            <div className="flex flex-wrap gap-3">
              <select id="vibe" defaultValue="" className="input sm:max-w-xs">
                <option value="" disabled>Select a vibe…</option>
                <option value="glam">Glam</option>
                <option value="bachelor">Bachelor</option>
                <option value="club">Club</option>
                <option value="teen">Teen</option>
              </select>
              <button onClick={planTheme} className="btn">Plan</button>
            </div>
            <p id="theme-result" className="mt-2 text-sm text-gray-700" />
          </div>

          {/* Split the Bill */}
          <div className="card">
            <h2 className="mb-2">Split the Bill</h2>
            <p className="text-sm text-gray-500 mb-2">Easily split the cost among your group.</p>
            <div className="flex flex-wrap items-center gap-3">
              <input id="total-cost" type="number" placeholder="Total ($)" className="input sm:max-w-xs" />
              <input id="num-people" type="number" placeholder="# People" defaultValue={1} className="input sm:max-w-xs" />
              <button onClick={generateSplitLinks} className="btn">Generate</button>
            </div>
            <p id="split-result" className="mt-2 text-sm text-gray-700" />
          </div>

          {/* Export + Poll */}
          <div className="card flex flex-col gap-4">
            <div>
              <h2 className="mb-2">Export Quote</h2>
              <p className="text-sm text-gray-500 mb-2">Save or share your custom quote.</p>
              <button onClick={exportQuote} className="btn w-full">Export</button>
              <p id="export-result" className="mt-2 text-sm text-gray-700" />
            </div>
            <div>
              <h2 className="mb-2">Poll</h2>
              <p className="text-sm text-gray-500 mb-2">Vote for your favorite party feature!</p>
              <button onClick={() => vote('live-band')} className="btn w-full">Vote “Live Band”</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

