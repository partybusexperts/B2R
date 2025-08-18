import React, { useEffect, useState } from "react";


// Open-Meteo: no API key needed
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODE_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
const GEOIP_API_URL = "https://ipapi.co/json/";
// NWS API base
const NWS_POINTS_API = "https://api.weather.gov/points";

function getTodayYYYYMMDD() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function LiveWeatherAdvisor() {
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
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


  // Fetch weather using NWS for US, Open-Meteo for others
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
      const { latitude: lat, longitude: lon, country, admin1 } = geoData.results[0];
      setRegion(admin1 || "");

      // 2. If US, use NWS API
      if (country === "United States") {
        // NWS: get gridpoint endpoint
        const pointsRes = await fetch(`${NWS_POINTS_API}/${lat},${lon}`);
        if (!pointsRes.ok) throw new Error("NWS: Could not get gridpoint");
        const pointsData = await pointsRes.json();
        const forecastUrl = pointsData.properties?.forecast;
        if (!forecastUrl) throw new Error("NWS: No forecast URL");
        const nwsForecastRes = await fetch(forecastUrl);
        if (!nwsForecastRes.ok) throw new Error("NWS: Could not get forecast");
        const nwsForecastData = await nwsForecastRes.json();
        // NWS forecast periods (usually 7 days, day/night)
        setForecast({ nws: true, periods: nwsForecastData.properties.periods });
        setCurrentWeather({
          nws: true,
          ...nwsForecastData.properties.periods[0],
        });
        setLoading(false);
        return;
      }

      // 3. Else, fallback to Open-Meteo
      const forecastRes = await fetch(`${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&current_weather=true&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=auto`);
      const forecastData = await forecastRes.json();
      if (!forecastData.daily) throw new Error("No forecast data");

      setForecast(forecastData.daily);
      setCurrentWeather(forecastData.current_weather);
      setHistorical(null);
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
        {/* Weather forecast location summary */}
        {city && (
          <div className="ml-4 text-sky-800 font-semibold whitespace-nowrap">
            This is the weather forecast for {city}{region ? `, ${region}` : ''}
          </div>
        )}
      </form>
      {loading && <div className="text-sky-700 font-semibold">Loading weather...</div>}
      {error && <div className="text-red-600 font-semibold">{error}</div>}
      {/* Current Weather Details (NWS or Open-Meteo) */}
      {currentWeather && currentWeather.nws && (
        <div className="mb-4">
          <h4 className="text-lg font-bold text-sky-800 mb-2">Current Weather (NWS)</h4>
          <div className="flex flex-wrap gap-6 text-lg text-gray-800">
            <div><b>Now:</b> {currentWeather.temperature}°F</div>
            <div><b>Wind:</b> {currentWeather.windSpeed}</div>
            <div><b>Short Forecast:</b> {currentWeather.shortForecast}</div>
          </div>
        </div>
      )}
      {currentWeather && !currentWeather.nws && (
        <div className="mb-4">
          <h4 className="text-lg font-bold text-sky-800 mb-2">Current Weather</h4>
          <div className="flex flex-wrap gap-6 text-lg text-gray-800">
            <div><b>Now:</b> {Math.round(currentWeather.temperature)}°F</div>
            <div><b>Wind:</b> {currentWeather.windspeed} mph</div>
            <div><b>Weather Code:</b> {currentWeather.weathercode}</div>
          </div>
        </div>
      )}
      {/* Forecast for next 7 days (NWS or Open-Meteo) */}
      {forecast && forecast.nws && forecast.periods && (
        <div className="mb-4">
          <h4 className="text-lg font-bold text-sky-800 mb-2">7-Day Forecast (NWS)</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {forecast.periods.slice(0, 7).map((period, i: number) => (
              <div key={i} className="bg-white rounded-xl shadow p-3 text-center border border-sky-200">
                <div className="font-bold text-sky-700">{period.name}</div>
                <div className="text-2xl">{period.temperature}°F</div>
                <div className="text-sm text-gray-700">{period.shortForecast}</div>
                <div className="text-xs text-gray-700">Wind: {period.windSpeed}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {forecast && !forecast.nws && forecast.time && (
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
      {/* Smart Packing Reminders, Comfort Tips, etc. (always rendered) */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-xl font-bold text-sky-800 mb-2">1. Smart Packing Reminders <span className="text-base font-normal text-sky-600">(Auto-Adjust by Weather)</span></h4>
          <ul className="list-disc pl-6 text-lg text-gray-800 space-y-1">
            {/* Dynamically generated packing tips based on weather */}
            {currentWeather && (
              <>
                {/* Rainy */}
                {(currentWeather.rain || (currentWeather.nws && currentWeather.shortForecast && currentWeather.shortForecast.toLowerCase().includes('rain'))) && (
                  <>
                    <li><b>Rainy day:</b> Bring an umbrella, ponchos, and plastic bags for wet shoes.</li>
                    <li>Pack a quick-dry towel and extra socks.</li>
                    <li>Consider waterproof shoes or boots.</li>
                  </>
                )}
                {/* Snowy/Icy */}
                {(currentWeather.snow || (currentWeather.nws && currentWeather.shortForecast && currentWeather.shortForecast.toLowerCase().includes('snow'))) && (
                  <>
                    <li><b>Snowy/icy:</b> Wear boots, bring hand warmers, and salt for walkways.</li>
                    <li>Pack a scraper for car windows and extra layers for warmth.</li>
                    <li>Bring a thermos with a hot drink.</li>
                  </>
                )}
                {/* Hot */}
                {(currentWeather.temp > 85 || (currentWeather.nws && currentWeather.temperature > 85)) && (
                  <>
                    <li><b>Hot day:</b> Pack sunscreen, hats, and extra water.</li>
                    <li>Bring a cooling towel or portable fan.</li>
                    <li>Wear light-colored, breathable clothing.</li>
                  </>
                )}
                {/* Cold */}
                {(currentWeather.temp < 45 || (currentWeather.nws && currentWeather.temperature < 45)) && (
                  <>
                    <li><b>Cold day:</b> Bring gloves, scarves, and blankets.</li>
                    <li>Wear thermal layers and wool socks.</li>
                    <li>Pack a hat and insulated water bottle (to prevent freezing).</li>
                  </>
                )}
                {/* Windy */}
                {(currentWeather.wind_speed > 20 || (currentWeather.nws && currentWeather.windSpeed && parseInt(currentWeather.windSpeed) > 20)) && (
                  <>
                    <li><b>Windy:</b> Consider a windbreaker and secure loose items.</li>
                    <li>Bring lip balm and eye drops for dryness.</li>
                  </>
                )}
                {/* High UV */}
                {(currentWeather.uvi > 7) && (
                  <>
                    <li><b>High UV:</b> Sunglasses and sunscreen recommended.</li>
                    <li>Wear a wide-brimmed hat and seek shade when possible.</li>
                  </>
                )}
                {/* Humid */}
                {(currentWeather.humidity > 70 || (currentWeather.nws && currentWeather.humidity > 70)) && (
                  <li><b>Humid:</b> Bring anti-chafing stick and a sweat towel.</li>
                )}
                {/* Low visibility */}
                {(currentWeather.visibility && currentWeather.visibility < 1609) && (
                  <li><b>Foggy/Low visibility:</b> Wear bright/reflective clothing and bring a flashlight.</li>
                )}
                {/* Mild */}
                {((currentWeather.temp >= 45 && currentWeather.temp <= 85) || (currentWeather.nws && currentWeather.temperature >= 45 && currentWeather.temperature <= 85)) &&
                  !((currentWeather.rain || (currentWeather.nws && currentWeather.shortForecast && currentWeather.shortForecast.toLowerCase().includes('rain'))) ||
                  (currentWeather.snow || (currentWeather.nws && currentWeather.shortForecast && currentWeather.shortForecast.toLowerCase().includes('snow')))) && (
                  <>
                    <li><b>Mild day:</b> Dress comfortably and check for sudden weather changes.</li>
                    <li>Pack a light jacket and reusable water bottle.</li>
                  </>
                )}
              </>
            )}
            {!currentWeather && city && (
              <>
                <li>Stay hydrated and bring water for everyone.</li>
                <li>Dress in layers for changing conditions.</li>
                <li>Bring a hat, sunglasses, and sunscreen for sun protection.</li>
                <li>Pack a rain jacket or umbrella just in case.</li>
                <li>Keep a small first aid kit and hand sanitizer handy.</li>
                <li>Plan for extra rest stops and snacks for longer trips.</li>
                <li>Charge your phone and bring a portable charger.</li>
              </>
            )}
            {!currentWeather && !city && <li>Enter a city and date to get custom packing tips!</li>}
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-bold text-sky-800 mb-2">2. Real-Time Comfort Tips</h4>
          <ul className="list-disc pl-6 text-lg text-gray-800 space-y-1">
            {/* Always show something: weather-based tips if available, else defaults */}
            {currentWeather && (
              <>
                {(currentWeather.temp > 90 || (currentWeather.nws && currentWeather.temperature > 90)) && <>
                  <li>⚡ Heat index is high — pre-chill your drinks before pickup.</li>
                  <li>Stay hydrated and avoid leaving pets or electronics in vehicles.</li>
                  <li>Plan for extra rest stops if traveling long distances.</li>
                </>}
                {(currentWeather.rain || (currentWeather.nws && currentWeather.shortForecast && currentWeather.shortForecast.toLowerCase().includes('rain'))) && <>
                  <li>🌧 Chance of rain? Put a towel down at the bus entry to avoid slippery floors.</li>
                  <li>Allow extra travel time for wet roads and possible delays.</li>
                  <li>Keep electronics and valuables in waterproof bags.</li>
                </>}
                {(currentWeather.temp < 32 || (currentWeather.nws && currentWeather.temperature < 32)) && <>
                  <li>❄️ Below freezing — keep phones warm inside pockets so batteries don’t die.</li>
                  <li>Let your vehicle warm up before driving.</li>
                  <li>Watch for icy steps and handrails.</li>
                </>}
                {(currentWeather.wind_speed > 20 || (currentWeather.nws && currentWeather.windSpeed && parseInt(currentWeather.windSpeed) > 20)) && <>
                  <li>💨 Windy — secure loose items and consider a windbreaker.</li>
                  <li>Be cautious with doors and umbrellas in strong gusts.</li>
                </>}
                {(currentWeather.uvi > 7) && <>
                  <li>🕶️ High UV — bring sunglasses and sunscreen.</li>
                  <li>Reapply sunscreen every 2 hours if outdoors.</li>
                </>}
                {(currentWeather.humidity > 70 || (currentWeather.nws && currentWeather.humidity > 70)) && <li>High humidity — use cooling towels and stay in shade when possible.</li>}
                {(currentWeather.visibility && currentWeather.visibility < 1609) && <li>Low visibility — use headlights and drive slowly.</li>}
              </>
            )}
            {/* Always show defaults if no weather data or if no tips above rendered */}
            {(!currentWeather || (
              !((currentWeather.temp > 90 || (currentWeather.nws && currentWeather.temperature > 90)) ||
                (currentWeather.rain || (currentWeather.nws && currentWeather.shortForecast && currentWeather.shortForecast.toLowerCase().includes('rain')))
                || (currentWeather.temp < 32 || (currentWeather.nws && currentWeather.temperature < 32))
                || (currentWeather.wind_speed > 20 || (currentWeather.nws && currentWeather.windSpeed && parseInt(currentWeather.windSpeed) > 20))
                || (currentWeather.uvi > 7)
                || (currentWeather.humidity > 70 || (currentWeather.nws && currentWeather.humidity > 70))
                || (currentWeather.visibility && currentWeather.visibility < 1609)
              )
            )) && (
              <>
                <li>Stay hydrated and bring water for everyone.</li>
                <li>Dress in layers for changing conditions.</li>
                <li>Bring a hat, sunglasses, and sunscreen for sun protection.</li>
                <li>Pack a rain jacket or umbrella just in case.</li>
                <li>Keep a small first aid kit and hand sanitizer handy.</li>
                <li>Plan for extra rest stops and snacks for longer trips.</li>
                <li>Charge your phone and bring a portable charger.</li>
              </>
            )}
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
            {/* Expanded road & travel intel */}
            {currentWeather && currentWeather.wind_speed > 20 && <li>Windy conditions may add travel time — leave 15 mins earlier and keep both hands on the wheel.</li>}
            {currentWeather && (currentWeather.rain || (currentWeather.nws && currentWeather.shortForecast && currentWeather.shortForecast.toLowerCase().includes('rain'))) && <li>Wet roads — increase following distance and brake early.</li>}
            {currentWeather && (currentWeather.snow || (currentWeather.nws && currentWeather.shortForecast && currentWeather.shortForecast.toLowerCase().includes('snow'))) && <li>Snow/ice — check for road closures and bring tire chains if needed.</li>}
            {currentWeather && currentWeather.visibility < 1609 && <li>Low visibility — drive carefully, use headlights, and avoid sudden stops.</li>}
            {currentWeather && currentWeather.temp < 32 && <li>Watch for icy roads and bridges, especially at night and early morning.</li>}
            {currentWeather && currentWeather.temp > 90 && <li>Extreme heat — check coolant and tire pressure before long trips.</li>}
            <li>Major event downtown today, expect extra traffic.</li>
            <li>Check local traffic apps or radio for real-time updates.</li>
            <li>Let someone know your route and ETA if traveling in bad weather.</li>
      {/*
        For free website traffic, consider adding a blog with local event guides, weather safety tips, and travel checklists.
        Use SEO keywords and share posts on social media and local forums.
        You can also list your site on Google My Business and free event directories.
      */}
          </ul>
        </div>
      </div>
    </div>
  );
}
