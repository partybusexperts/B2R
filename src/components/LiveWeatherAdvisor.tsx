import React, { useEffect, useState } from "react";

// Open-Meteo: no API key needed
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODE_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
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

  // Fetch weather when city/date changes (Open-Meteo)
  const fetchWeather = async (cityToUse: string, dateToUse: string) => {
    if (!cityToUse || !dateToUse) return;
    setLoading(true);
    setError("");
    setForecast(null);
    setHistorical(null);
    setCurrentWeather(null);

    try {
      // 1. Geocode city name to lat/lon
      const geoRes = await fetch(`${GEOCODE_API_URL}?name=${encodeURIComponent(cityToUse)}&count=1&language=en&format=json`);
      const geoData = await geoRes.json();
      if (!geoData.results || !geoData.results[0]) throw new Error("City not found");
      const { latitude: lat, longitude: lon } = geoData.results[0];

      // 2. Get forecast for the week (Open-Meteo returns daily/hourly)
      const forecastRes = await fetch(`${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&current_weather=true&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=auto`);
      const forecastData = await forecastRes.json();
      if (!forecastData.daily) throw new Error("No forecast data");

      setForecast(forecastData.daily);
      setCurrentWeather(forecastData.current_weather);
      setHistorical(null); // You can add historical fetch here if needed
      setLoading(false);
    } catch (e: any) {
      setError(e.message || "Could not fetch weather");
      setLoading(false);
      console.error('Weather fetch error:', e);
    }
  };


  // Fetch on submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCity(pendingCity);
    setDate(pendingDate);
    fetchWeather(pendingCity, pendingDate);
  };


  // Update pending values only on mount
  useEffect(() => {
    setPendingCity(city);
    setPendingDate(date);
  }, []);

  // Fetch weather when city or date changes
  useEffect(() => {
    if (city && date) {
      fetchWeather(city, date);
    }
  }, [city, date]);

  // Helper: summarize historical rain (using day_summary)
  // Helper: summarize historical rain (using day_summary)
  type HistoricalYear = {
    date?: string;
    temperature?: { min: number; max: number };
    precipitation?: { total: number };
    [key: string]: any;
  };

  function rainAdvice(hist: HistoricalYear[] | null) {
    if (!hist || !Array.isArray(hist)) return "No historical data available.";
    let rainCount = 0;
    hist.forEach((year: HistoricalYear) => {
      if (year && year.precipitation && year.precipitation.total > 0) {
        rainCount++;
      }
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
            <div><b>Now:</b> {Math.round(currentWeather.temperature)}°F</div>
            <div><b>Wind:</b> {currentWeather.windspeed} mph</div>
            <div><b>Weather Code:</b> {currentWeather.weathercode}</div>
          </div>
        </div>
      )}
      {/* Forecast for next 7 days */}
      {forecast && forecast.time && (
        <div className="mb-4">
          <h4 className="text-lg font-bold text-sky-800 mb-2">7-Day Forecast</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {forecast.time.map((date, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-3 text-center border border-sky-200">
                <div className="font-bold text-sky-700">{new Date(date).toLocaleDateString()}</div>
                <div className="text-2xl">{forecast.weathercode[i]}</div>
                <div className="text-sm text-gray-700">{Math.round(forecast.temperature_2m_min[i])}°F - {Math.round(forecast.temperature_2m_max[i])}°F</div>
                <div className="text-xs text-gray-700">Precip: {forecast.precipitation_sum[i]} in</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Historical average for this date */}
      {historical === null && error && error.includes('Historical') && (
        <div className="mb-4">
          <h4 className="text-lg font-bold text-sky-800 mb-2">Historical Weather</h4>
          <div className="text-gray-800">Historical weather data is not available with this API key.</div>
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
