"use client";
import React, { useEffect, useState, useRef } from "react";

// Open-Meteo (no key)
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODE_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
const GEOIP_API_URL = "https://ipapi.co/json/";
const NWS_POINTS_API = "https://api.weather.gov/points";

type ForecastNWS = { nws: true; periods: any[] };
type ForecastOM = {
  nws?: false;
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
};
type AnyForecast = ForecastNWS | ForecastOM | null;

export default function WeatherChecker() {
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [pendingCity, setPendingCity] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggTimeout = useRef<number | null>(null);
  const [forecast, setForecast] = useState<AnyForecast>(null);
  const [currentWeather, setCurrentWeather] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get approximate city from IP on mount
  useEffect(() => {
    fetch(GEOIP_API_URL)
      .then((r) => r.json())
      .then((data) => {
        if (data?.city) {
          setPendingCity(data.city);
          setCity((prev) => prev || data.city);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch suggestions from our geocode-suggest API as the user types
  useEffect(() => {
    const q = pendingCity.trim();
    if (suggTimeout.current) {
      window.clearTimeout(suggTimeout.current);
      suggTimeout.current = null;
    }
    if (q.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // debounce
    suggTimeout.current = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/geocode-suggest?q=${encodeURIComponent(q)}`);
        if (!res.ok) throw new Error("Suggestions fetch failed");
        const j = await res.json();
        if (j?.ok && Array.isArray(j.suggestions)) {
          setSuggestions(j.suggestions.slice(0, 6));
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 260);

    return () => {
      if (suggTimeout.current) window.clearTimeout(suggTimeout.current);
    };
  }, [pendingCity]);

  // Fetch weather (NWS for US, Open-Meteo otherwise)
  const fetchWeather = async (cityToUse: string) => {
    if (!cityToUse) return;
    setLoading(true);
    setError("");
    setForecast(null);
    setCurrentWeather(null);

    try {
      // 1) Geocode name -> lat/lon
      const geoRes = await fetch(
        `${GEOCODE_API_URL}?name=${encodeURIComponent(
          cityToUse
        )}&count=1&language=en&format=json`
      );
      const geoData = await geoRes.json();
      if (!geoData.results?.[0]) throw new Error("City not found");
      const { latitude: lat, longitude: lon, country, admin1 } =
        geoData.results[0];
      setRegion(admin1 || "");

      // 2) US -> NWS
      if (country === "United States") {
        const pointsRes = await fetch(`${NWS_POINTS_API}/${lat},${lon}`);
        if (!pointsRes.ok) throw new Error("NWS gridpoint lookup failed");
        const pointsData = await pointsRes.json();
        const forecastUrl = pointsData.properties?.forecast;
        if (!forecastUrl) throw new Error("NWS: no forecast URL");
        const nwsForecastRes = await fetch(forecastUrl);
        if (!nwsForecastRes.ok) throw new Error("NWS forecast fetch failed");
        const nwsForecastData = await nwsForecastRes.json();
        setForecast({ nws: true, periods: nwsForecastData.properties.periods });
        setCurrentWeather({
          nws: true,
          ...nwsForecastData.properties.periods[0],
        });
        setLoading(false);
        return;
      }

      // 3) Non-US -> Open-Meteo
      const forecastRes = await fetch(
        `${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&current_weather=true&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=auto`
      );
      const forecastData = await forecastRes.json();
      if (!forecastData.daily) throw new Error("No forecast data");
      setForecast(forecastData.daily);
      setCurrentWeather(forecastData.current_weather);
      setLoading(false);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e.message || "Could not fetch weather");
      setLoading(false);
      console.error("Weather fetch error:", e);
    }
  };

  // Submit (no date field anywhere)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = pendingCity.trim();
    if (next) {
      setCity(next);
      fetchWeather(next);
    }
  };

  const handleSuggestionClick = (s: string) => {
    setPendingCity(s);
    setShowSuggestions(false);
    setCity(s);
    fetchWeather(s);
  };

  // Auto-fetch when city changes (e.g., from IP)
  useEffect(() => {
    if (city) fetchWeather(city);
    // note: fetchWeather is stable in this component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  return (
    <div className="text-[15px]">
      <h3 className="text-lg md:text-xl font-bold mb-2 text-blue-900 tracking-tight flex items-center gap-2">
        <span role="img" aria-label="cloud">☁️</span> Weather Checker
      </h3>

      <form className="flex flex-row gap-2 mb-3 items-end" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-bold text-blue-900 mb-1">City</label>
          <div className="relative">
            <input
              className="form-field text-sm w-[200px]"
              value={pendingCity}
              onChange={(e) => setPendingCity(e.target.value)}
              placeholder="Search place or address"
              autoComplete="off"
              onFocus={() => { if (suggestions.length) setShowSuggestions(true); }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-50 bg-white border rounded mt-1 w-[200px] max-h-48 overflow-auto text-sm">
                {suggestions.map((s, idx) => (
                  <li
                    key={idx}
                    className="p-2 hover:bg-slate-100 cursor-pointer"
                    onMouseDown={(ev) => { ev.preventDefault(); handleSuggestionClick(s); }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <button type="submit" className="btn-primary text-sm">Go</button>

        {city && (
          <div className="ml-2 text-blue-900 font-semibold whitespace-nowrap text-xs">
            Forecast for {city}{region ? `, ${region}` : ""}
          </div>
        )}
      </form>

      {loading && <div className="text-blue-700 font-semibold text-sm">Loading weather...</div>}
      {error && <div className="text-red-600 font-semibold text-sm">{error}</div>}

      {/* Current */}
      {currentWeather?.nws ? (
        <div className="mb-2">
          <div className="font-bold text-blue-900 mb-1 text-sm">
            Current: {String((currentWeather as Record<string, unknown>)['name'] ?? (currentWeather as Record<string, unknown>)['shortForecast'] ?? '')}
          </div>
          <div className="text-slate-800 text-xs">Temp: {String((currentWeather as Record<string, unknown>)['temperature'] ?? '')}°F</div>
          <div className="text-slate-800 text-xs">
            Wind: {String((currentWeather as Record<string, unknown>)['windSpeed'] ?? '')} {String((currentWeather as Record<string, unknown>)['windDirection'] ?? '')}
          </div>
        </div>
      ) : currentWeather ? (
        <div className="mb-2">
          <div className="font-bold text-blue-900 mb-1 text-sm">Current: {String((currentWeather as Record<string, unknown>)['temperature'] ?? '')}°F</div>
          <div className="text-slate-800 text-xs">Wind: {String((currentWeather as Record<string, unknown>)['windspeed'] ?? '')} mph</div>
        </div>
      ) : null}

      {/* Forecast */}
      {forecast && (forecast as ForecastNWS).nws && (
        <div className="overflow-x-auto">
          <table className="min-w-[320px] w-full text-xs mt-1 bg-white">
            <thead>
              <tr className="bg-blue-900/80 text-blue-50">
                <th className="p-1 text-left">Period</th>
                <th className="p-1 text-left">Forecast</th>
                <th className="p-1 text-left">Temp</th>
                <th className="p-1 text-left">Rain?</th>
              </tr>
            </thead>
            <tbody>
              {(forecast as ForecastNWS).periods.map((p: Record<string, unknown>) => (
                <tr key={p.number} className="border-b border-slate-200">
                  <td className="p-1 font-bold text-blue-900">{String(p.name || p.shortForecast || '')}</td>
                  <td className="p-1 text-slate-800">{String(p.shortForecast || '')}</td>
                  <td className="p-1 text-slate-800">{p.temperature ? `${String(p.temperature)}°F` : '–'}</td>
                  <td className="p-1 text-slate-800">
                    {p.probabilityOfPrecipitation && typeof p.probabilityOfPrecipitation === 'object' && 'value' in p.probabilityOfPrecipitation ? `${String((p.probabilityOfPrecipitation as any).value)}%` : '–'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

  {forecast && !(forecast as ForecastNWS).nws && (
        <div className="overflow-x-auto">
          <table className="min-w-[320px] w-full text-xs mt-1 bg-white">
            <thead>
              <tr className="bg-blue-900/80 text-blue-50">
                <th className="p-1 text-left">Date</th>
                <th className="p-1 text-left">High</th>
                <th className="p-1 text-left">Low</th>
                <th className="p-1 text-left">Rain?</th>
              </tr>
            </thead>
            <tbody>
              {(forecast as ForecastOM).time.map((date: string, i: number) => (
                <tr key={date} className="border-b border-slate-200">
                  <td className="p-1 font-bold text-blue-900">{date}</td>
                  <td className="p-1 text-slate-800">{(forecast as ForecastOM).temperature_2m_max[i]}°F</td>
                  <td className="p-1 text-slate-800">{(forecast as ForecastOM).temperature_2m_min[i]}°F</td>
                  <td className="p-1 text-slate-800">
                    {(forecast as ForecastOM).precipitation_sum[i] > 0
                      ? `${(forecast as ForecastOM).precipitation_sum[i]} in`
                      : "–"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
