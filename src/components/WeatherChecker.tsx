
"use client";
import React, { useEffect, useState } from "react";

// Open-Meteo: no API key needed
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODE_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
const GEOIP_API_URL = "https://ipapi.co/json/";
const NWS_POINTS_API = "https://api.weather.gov/points";

function getTodayYYYYMMDD() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function WeatherChecker() {
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  // Removed date state
  const [autoCity, setAutoCity] = useState("");
  const [forecast, setForecast] = useState(null);
  const [historical, setHistorical] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [eventType, setEventType] = useState("");
  const [pendingCity, setPendingCity] = useState("");
  // Removed pendingDate state

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
  const fetchWeather = async (cityToUse: string) => {
    if (!cityToUse) return;
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
  fetchWeather(pendingCity);
  };

  // Update pending values only on mount
  useEffect(() => {
    setPendingCity(city);
  }, []);

  // Fetch weather when city or date changes
  useEffect(() => {
    if (city) {
      fetchWeather(city);
    }
  }, [city]);

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
    <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl shadow p-4 border border-sky-200 mt-4 text-[15px]">
      <h3 className="text-lg md:text-xl font-bold mb-2 text-sky-700 tracking-tight flex items-center gap-2">
        <span role="img" aria-label="cloud">☁️</span> Weather Checker
      </h3>
      <form className="flex flex-row gap-2 mb-3 items-end" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-bold text-sky-800 mb-1">City</label>
          <input
            className="input text-sm px-2 py-1"
            value={pendingCity}
            onChange={e => setPendingCity(e.target.value)}
            placeholder={autoCity || "Enter city"}
            style={{ width: 120 }}
          />
        </div>
        <button type="submit" className="btn bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded shadow text-sm">Go</button>
        {/* Weather forecast location summary */}
        {city && (
          <div className="ml-2 text-sky-800 font-semibold whitespace-nowrap text-xs">
            Forecast for {city}{region ? `, ${region}` : ''}
          </div>
        )}
      </form>
      {loading && <div className="text-sky-700 font-semibold text-sm">Loading weather...</div>}
      {error && <div className="text-red-600 font-semibold text-sm">{error}</div>}
      {/* Current Weather Details (NWS or Open-Meteo) */}
      {currentWeather && currentWeather.nws && (
        <div className="mb-2">
          <div className="font-bold text-sky-900 mb-1 text-sm">Current: {currentWeather.name || currentWeather.shortForecast}</div>
          <div className="text-sky-800 text-xs">Temp: {currentWeather.temperature}°F</div>
          <div className="text-sky-800 text-xs">Wind: {currentWeather.windSpeed} {currentWeather.windDirection}</div>
        </div>
      )}
      {currentWeather && !currentWeather.nws && (
        <div className="mb-2">
          <div className="font-bold text-sky-900 mb-1 text-sm">Current: {currentWeather.temperature}°F</div>
          <div className="text-sky-800 text-xs">Wind: {currentWeather.windspeed} mph</div>
        </div>
      )}
      {/* Forecast Table (NWS or Open-Meteo) */}
      {forecast && forecast.nws && (
        <div className="overflow-x-auto">
          <table className="min-w-[320px] w-full text-xs mt-1">
            <thead>
              <tr className="bg-sky-100">
                <th className="p-1 text-left">Period</th>
                <th className="p-1 text-left">Forecast</th>
                <th className="p-1 text-left">Temp</th>
                <th className="p-1 text-left">Rain?</th>
              </tr>
            </thead>
            <tbody>
              {forecast.periods.map((p: any) => (
                <tr key={p.number} className="border-b">
                  <td className="p-1 font-bold">{p.name}</td>
                  <td className="p-1">{p.shortForecast}</td>
                  <td className="p-1">{p.temperature}°F</td>
                  <td className="p-1">{p.probabilityOfPrecipitation?.value ? `${p.probabilityOfPrecipitation.value}%` : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {forecast && !forecast.nws && (
        <div className="overflow-x-auto">
          <table className="min-w-[320px] w-full text-xs mt-1">
            <thead>
              <tr className="bg-sky-100">
                <th className="p-1 text-left">Date</th>
                <th className="p-1 text-left">High</th>
                <th className="p-1 text-left">Low</th>
                <th className="p-1 text-left">Rain?</th>
              </tr>
            </thead>
            <tbody>
              {forecast.time.map((date: string, i: number) => (
                <tr key={date} className="border-b">
                  <td className="p-1 font-bold">{date}</td>
                  <td className="p-1">{forecast.temperature_2m_max[i]}°F</td>
                  <td className="p-1">{forecast.temperature_2m_min[i]}°F</td>
                  <td className="p-1">{forecast.precipitation_sum[i] > 0 ? `${forecast.precipitation_sum[i]} in` : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Rain advice (if historical data available) */}
      {historical && (
        <div className="mt-2 text-sky-800 font-semibold text-xs">{rainAdvice(historical)}</div>
      )}
    </div>
  );
}
