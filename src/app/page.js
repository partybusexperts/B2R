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
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* wrapper = centered column with padding & spacing */}
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <header>
          <h1>Prom Party Bus Rental – Chester, SC</h1>
          <p ref={countdownRef} className="muted mt-2" />
        </header>

        {/* Quick Estimate */}
        <section className="card">
          <h2 className="mb-4">Quick Estimate</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input id="hours" type="number" placeholder="Hours" className="input" />
            <input id="group" type="number" placeholder="Group size" className="input" />
          </div>
          <button onClick={estimateCost} className="btn mt-4">Estimate</button>
          <p id="estimate-result" className="mt-2 text-sm text-gray-700" />
        </section>

        {/* Bus Recommendation */}
        <section className="card">
          <h2 className="mb-4">Bus Recommendation</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input id="group-size" type="number" placeholder="Group size" className="input sm:max-w-xs" />
            <button onClick={recommendBus} className="btn">Recommend</button>
          </div>
          <p id="bus-recommendation" className="mt-2 text-sm text-gray-700" />
        </section>

        {/* Smart Quote */}
        <section className="card">
          <h2 className="mb-4">Smart Quote</h2>
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
          <button onClick={smartQuote} className="btn mt-4">Get Quote</button>
          <p id="smart-quote-result" className="mt-2 text-sm text-gray-700" />
        </section>

        {/* Availability */}
        <section className="card">
          <h2 className="mb-4">Availability</h2>
          <div className="flex flex-wrap gap-3">
            <input id="avail-date" type="date" className="input sm:max-w-xs" />
            <input id="avail-time" type="time" className="input sm:max-w-xs" />
            <button onClick={checkAvailability} className="btn">Check</button>
          </div>
          <p id="avail-result" className="mt-2 text-sm text-gray-700" />
        </section>

        {/* Theme Planner */}
        <section className="card">
          <h2 className="mb-4">Theme Planner</h2>
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
        </section>

        {/* Split the Bill */}
        <section className="card">
          <h2 className="mb-4">Split the Bill</h2>
          <div className="flex flex-wrap items-center gap-3">
            <input id="total-cost" type="number" placeholder="Total ($)" className="input sm:max-w-xs" />
            <input id="num-people" type="number" placeholder="# People" defaultValue={1} className="input sm:max-w-xs" />
            <button onClick={generateSplitLinks} className="btn">Generate</button>
          </div>
          <p id="split-result" className="mt-2 text-sm text-gray-700" />
        </section>

        {/* Export + Poll */}
        <section className="card">
          <h2 className="mb-4">Export Quote</h2>
          <button onClick={exportQuote} className="btn">Export</button>
          <p id="export-result" className="mt-2 text-sm text-gray-700" />
        </section>

        <section className="card">
          <h2 className="mb-4">Poll</h2>
          <button onClick={() => vote('live-band')} className="btn">Vote “Live Band”</button>
        </section>
      </div>
    </main>
  );
}

