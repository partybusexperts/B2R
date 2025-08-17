import React, { useEffect, useState } from "react";

// You will need to set your API keys here
const WEATHER_API_KEY = "dbbe74b9443b3403d6bfdbe317d40785";
const WEATHER_API_URL = "https://api.openweathermap.org/data/3.0";
const GEOIP_API_URL = "https://ipapi.co/json/";

function getTodayYYYYMMDD() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function LiveWeatherAdvisor() {
  const [city, setCity] = useState("");
  const [date, setDate] = useState(getTodayYYYYMMDD());
  const [autoCity, setAutoCity] = useState("");
  const [forecast, setForecast] = useState(null);
  const [historical, setHistorical] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [eventType, setEventType] = useState("");
  const [pendingCity, setPendingCity] = useState("");
  const [pendingDate, setPendingDate] = useState("");

  // Get city from IP on mount
  useEffect(() => {
    fetch(GEOIP_API_URL)
      .then(r => r.json())
      .then(data => {
        if (data && data.city) {
          setAutoCity(data.city);
          if (!city) {
            setCity(data.city);
            setPendingCity(data.city);
          }
        }
      });
  }, []);

  // Fetch weather when city/date changes
  const fetchWeather = (cityToUse, dateToUse) => {
    if (!cityToUse || !dateToUse) return;
    setLoading(true);
    setError("");
    setForecast(null);
    setHistorical(null);
    setCurrentWeather(null);

    const today = getTodayYYYYMMDD();
    const diffDays = Math.floor((new Date(dateToUse).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24));

    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityToUse)}&limit=1&appid=${WEATHER_API_KEY}`)
      .then(r => r.json())
      .then(geo => {
        if (!geo[0]) throw new Error("City not found");
        const { lat, lon } = geo[0];
        if (diffDays >= 0 && diffDays <= 7) {
          // 8-day forecast (One Call 3.0)
          return fetch(`${WEATHER_API_URL}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${WEATHER_API_KEY}`)
            .then(r => r.json())
            .then(data => {
              setForecast(data.daily);
              setCurrentWeather(data.current);
              setLoading(false);
            });
        } else {
          // Historical: get last 5 years for this date using day_summary endpoint
          const promises = [];
          for (let y = 1; y <= 5; y++) {
            const histDate = new Date(dateToUse);
            histDate.setFullYear(histDate.getFullYear() - y);
            const yyyy = histDate.getFullYear();
            const mm = String(histDate.getMonth() + 1).padStart(2, '0');
            const dd = String(histDate.getDate()).padStart(2, '0');
            const dateStr = `${yyyy}-${mm}-${dd}`;
            promises.push(
              fetch(`${WEATHER_API_URL}/onecall/day_summary?lat=${lat}&lon=${lon}&date=${dateStr}&units=imperial&appid=${WEATHER_API_KEY}`)
                .then(r => r.json())
            );
          }
          return Promise.all(promises).then(results => {
            setHistorical(results);
            setLoading(false);
          });
        }
      })
      .catch(e => {
        setError(e.message || "Could not fetch weather");
        setLoading(false);
      });
  };


  // Fetch on submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setCity(pendingCity);
    setDate(pendingDate);
    fetchWeather(pendingCity, pendingDate);
  };


  // Update pending values only on mount
  useEffect(() => {
    setPendingCity(city);
    setPendingDate(date);
    // eslint-disable-next-line
  }, []);

  // Fetch weather when city or date changes
  useEffect(() => {
    if (city && date) {
      fetchWeather(city, date);
    }
    // eslint-disable-next-line
  }, [city, date]);

  // Helper: summarize historical rain (using day_summary)
  function rainAdvice(hist) {
    if (!hist) return null;
    let rainCount = 0;
    hist.forEach(year => {
      if (year.precipitation && year.precipitation.total && year.precipitation.total > 0) rainCount++;
    });
    if (rainCount >= 3) return `It has rained ${rainCount} of the last 5 years on this date — plan for rain!`;
    if (rainCount > 0) return `Rain possible: ${rainCount} of the last 5 years had rain on this date.`;
    return `Low chance of rain based on the last 5 years.`;
  }

  return (
    <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-2xl shadow-xl p-8 border border-sky-200 mt-8">
      <h3 className="text-2xl md:text-3xl font-extrabold mb-4 text-sky-700 tracking-tight flex items-center gap-2">
        <span role="img" aria-label="fire">🔥</span> Smart Weather & Comfort Tips
      </h3>
      <form className="flex flex-col md:flex-row gap-4 mb-6 items-end" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-bold text-sky-800 mb-1">City</label>
          <input
            className="input"
            value={pendingCity}
            onChange={e => setPendingCity(e.target.value)}
            placeholder={autoCity || "Enter city"}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-sky-800 mb-1">Date</label>
          <input
            className="input"
            type="date"
            value={pendingDate}
            onChange={e => setPendingDate(e.target.value)}
          />
        </div>
        <button type="submit" className="btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow">Submit</button>
      </form>
      {loading && <div className="text-sky-700 font-semibold">Loading weather...</div>}
      {error && <div className="text-red-600 font-semibold">{error}</div>}
      {/* Current Weather Details */}
      {currentWeather && (
        <div className="mb-4">
          <h4 className="text-lg font-bold text-sky-800 mb-2">Current Weather</h4>
          <div className="flex flex-wrap gap-6 text-lg text-gray-800">
            <div><b>Now:</b> {Math.round(currentWeather.temp)}°F, {currentWeather.weather[0]?.description}</div>
            <div><b>Feels like:</b> {Math.round(currentWeather.feels_like)}°F</div>
            <div><b>Wind:</b> {currentWeather.wind_speed} mph {currentWeather.wind_deg ? `(from ${currentWeather.wind_deg}°)` : ""}</div>
            <div><b>Humidity:</b> {currentWeather.humidity}%</div>
            <div><b>Clouds:</b> {currentWeather.clouds}%</div>
            <div><b>UV Index:</b> {currentWeather.uvi}</div>
            {currentWeather.rain && <div><b>Rain:</b> {currentWeather.rain["1h"] || currentWeather.rain} in last hour</div>}
            {currentWeather.snow && <div><b>Snow:</b> {currentWeather.snow["1h"] || currentWeather.snow} in last hour</div>}
            <div><b>Visibility:</b> {currentWeather.visibility / 1609.34 > 1 ? (currentWeather.visibility / 1609.34).toFixed(1) + ' mi' : currentWeather.visibility + ' m'}</div>
          </div>
        </div>
      )}
      {/* Forecast for next 7 days */}
      {forecast && Array.isArray(forecast) && (
        <div className="mb-4">
          <h4 className="text-lg font-bold text-sky-800 mb-2">7-Day Forecast</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {forecast.map((day, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-3 text-center border border-sky-200">
                <div className="font-bold text-sky-700">{new Date(day.dt * 1000).toLocaleDateString()}</div>
                <div className="text-2xl">{day.weather[0]?.main}</div>
                <div className="text-sm text-gray-700">{Math.round(day.temp.min)}°F - {Math.round(day.temp.max)}°F</div>
                <div className="text-xs text-gray-500">{day.weather[0]?.description}</div>
                <div className="text-xs text-gray-700">Rain: {day.rain ? day.rain + 'mm' : '—'} | Snow: {day.snow ? day.snow + 'mm' : '—'}</div>
                <div className="text-xs text-gray-700">Wind: {day.wind_speed} mph</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Historical average for this date */}
      {historical && Array.isArray(historical) && (
        <div className="mb-4">
          <h4 className="text-lg font-bold text-sky-800 mb-2">Historical Weather (last 5 years on this date)</h4>
          <ul className="list-disc pl-6 text-gray-800">
            {historical.map((year, i) => (
              <li key={i}>
                {year.date ? (
                  <>
                    {year.date}: {year.temperature ? `${Math.round(year.temperature.min)}°F - ${Math.round(year.temperature.max)}°F` : 'No temp data'}{year.precipitation && year.precipitation.total > 0 ? `, Rain: ${year.precipitation.total}mm` : ', No rain'}
                  </>
                ) : (
                  <>No data for {i + 1} years ago</>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-2 text-sky-700 font-semibold">{rainAdvice(historical)}</div>
        </div>
      )}
      {/* Smart Packing Reminders, Comfort Tips, etc. (dynamic) */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-xl font-bold text-sky-800 mb-2">1. Smart Packing Reminders <span className="text-base font-normal text-sky-600">(Auto-Adjust by Weather)</span></h4>
          <ul className="list-disc pl-6 text-lg text-gray-800 space-y-1">
            {currentWeather && currentWeather.temp > 85 && <li><b>Hot day:</b> sunscreen, hats, extra water</li>}
            {currentWeather && currentWeather.temp < 45 && <li><b>Cold day:</b> gloves, scarves, blankets</li>}
            {currentWeather && currentWeather.rain && <li><b>Rainy day:</b> ponchos, umbrellas, plastic bags for wet shoes</li>}
            {currentWeather && currentWeather.snow && <li><b>Snowy/icy:</b> boots, hand warmers, salt for walkways</li>}
            {!currentWeather && <li>Enter a city and date to get custom packing tips!</li>}
          </ul>
          <p className="mt-2 text-sky-700 text-sm">(People will feel like you thought of everything for them.)</p>
        </div>
        <div>
          <h4 className="text-xl font-bold text-sky-800 mb-2">2. Real-Time Comfort Tips</h4>
          <ul className="list-disc pl-6 text-lg text-gray-800 space-y-1">
            {currentWeather && currentWeather.temp > 90 && <li>⚡ Heat index is high — pre-chill your drinks before pickup.</li>}
            {currentWeather && currentWeather.rain && <li>🌧 Chance of rain? Put a towel down at the bus entry to avoid slippery floors.</li>}
            {currentWeather && currentWeather.temp < 32 && <li>❄️ Below freezing — keep phones warm inside pockets so batteries don’t die.</li>}
            {currentWeather && currentWeather.wind_speed > 20 && <li>💨 Windy — secure loose items and consider a windbreaker.</li>}
            {currentWeather && currentWeather.uvi > 7 && <li>🕶️ High UV — bring sunglasses and sunscreen.</li>}
            {!currentWeather && <li>Enter a city and date to get real-time comfort tips!</li>}
          </ul>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <div>
          <h4 className="text-xl font-bold text-sky-800 mb-2">3. Event-Specific Heads-Up</h4>
          <div className="mb-2">
            <label className="block text-sm font-bold text-sky-800 mb-1">Event Type</label>
            <select className="input" value={eventType} onChange={e => setEventType(e.target.value)}>
              <option value="">Select event</option>
              <option value="concert">Concert</option>
              <option value="gameday">Gameday</option>
              <option value="prom">Prom</option>
              <option value="wedding">Wedding</option>
              <option value="festival">Festival</option>
              <option value="other">Other</option>
            </select>
          </div>
          <ul className="list-disc pl-6 text-lg text-gray-800 space-y-1">
            {eventType === "concert" && <>
              <li>Clear bag policies at most venues.</li>
              <li>Arrive early for security checks.</li>
              <li>Earplugs for loud shows.</li>
              <li>Portable charger for your phone.</li>
            </>}
            {eventType === "gameday" && <>
              <li>Clear bag policies at most stadiums.</li>
              <li>Team colors and face paint encouraged!</li>
              <li>Bring a seat cushion for comfort.</li>
              <li>Portable charger for your phone.</li>
            </>}
            {eventType === "prom" && <>
              <li>Bring extra bobby pins, hairspray, and a mini sewing kit.</li>
              <li>Pack comfy shoes for after the dance.</li>
              <li>Bring a stain remover pen for emergencies.</li>
              <li>Keep a phone charger in your bag.</li>
              {currentWeather && currentWeather.humidity > 70 && <li>Extra bobby pins or hairspray if humid.</li>}
              {currentWeather && currentWeather.temp < 50 && <li>Bring a wrap or jacket for chilly nights.</li>}
              {currentWeather && currentWeather.rain && <li>Umbrella or rain poncho for photos and arrivals.</li>}
            </>}
            {eventType === "wedding" && <>
              <li>Bring extra bobby pins, hairspray, and a mini sewing kit.</li>
              <li>Pack comfy shoes for dancing.</li>
              <li>Bring a stain remover pen for emergencies.</li>
              <li>Keep a phone charger in your bag.</li>
              {currentWeather && currentWeather.humidity > 70 && <li>Extra bobby pins or hairspray if humid.</li>}
              {currentWeather && currentWeather.temp < 50 && <li>Bring a wrap or jacket for chilly nights.</li>}
              {currentWeather && currentWeather.rain && <li>Umbrella or rain poncho for photos and arrivals.</li>}
            </>}
            {eventType === "festival" && <>
              <li>Portable charger = lifesaver.</li>
              <li>Bring a reusable water bottle.</li>
              <li>Pack sunscreen and a hat.</li>
              <li>Bandana or mask for dust.</li>
              <li>Lightweight rain poncho.</li>
            </>}
            {eventType === "other" && <li>Bring essentials for your event and check the weather above.</li>}
            {!eventType && <li>Select your event type for custom tips!</li>}
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-bold text-sky-800 mb-2">4. Road & Travel Intel</h4>
          <ul className="list-disc pl-6 text-lg text-gray-800 space-y-1">
            {currentWeather && currentWeather.wind_speed > 20 && <li>Windy conditions may add travel time — leave 15 mins earlier.</li>}
            <li>Major event downtown today, expect extra traffic.</li>
            {currentWeather && currentWeather.visibility < 1609 && <li>Low visibility — drive carefully and use headlights.</li>}
            {currentWeather && currentWeather.temp < 32 && <li>Watch for icy roads and bridges.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
