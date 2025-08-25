"use client";

import React, { useState, useEffect } from "react";

const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODE_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
const GEOIP_API_URL = "https://ipapi.co/json/";
const NWS_POINTS_API = "https://api.weather.gov/points";
const NWS_ALERTS_API = "https://api.weather.gov/alerts/active";

export default function LiveWeatherAdvisor() {
  const [city, setCity] = useState("");
  const [autoCity, setAutoCity] = useState("");
  const [forecast, setForecast] = useState<any>(null);
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [airQuality, setAirQuality] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [eventType, setEventType] = useState("");
  const [pendingCity, setPendingCity] = useState("");
  const [unit, setUnit] = useState<"fahrenheit" | "celsius">("fahrenheit");

  // Fetch city from IP on mount
  useEffect(() => {
    fetch(GEOIP_API_URL)
      .then((r) => r.json())
      .then((data) => {
        if (data?.city) {
          setAutoCity(data.city);
          if (!city) {
            setCity(data.city);
            setPendingCity(data.city);
          }
        }
      });
  }, []);

  // Fetch weather, alerts, and air quality
  const fetchWeather = async (cityToUse: string) => {
    if (!cityToUse) return;
    setLoading(true);
    setError("");
    setForecast(null);
    setCurrentWeather(null);
    setAlerts([]);
    setAirQuality(null);

    try {
      // Geocode city to lat/lon
      const geoRes = await fetch(`${GEOCODE_API_URL}?name=${encodeURIComponent(cityToUse)}&count=1&language=en&format=json`);
      const geoData = await geoRes.json();
      if (!geoData.results?.[0]) throw new Error("City not found");
      const { latitude: lat, longitude: lon, country } = geoData.results[0];

      // Fetch weather
      if (country === "United States") {
        const pointsRes = await fetch(`${NWS_POINTS_API}/${lat},${lon}`);
        if (!pointsRes.ok) throw new Error("NWS: Could not get gridpoint");
        const pointsData = await pointsRes.json();
        const forecastUrl = pointsData.properties?.forecast;
        if (!forecastUrl) throw new Error("NWS: No forecast URL");
        const nwsForecastRes = await fetch(forecastUrl);
        if (!nwsForecastRes.ok) throw new Error("NWS: Could not get forecast");
        const nwsForecastData = await nwsForecastRes.json();
        setForecast({
          nws: true,
          periods: nwsForecastData.properties.periods.map((p: any) => ({
            ...p,
            temperature: unit === "celsius" ? Math.round((p.temperature - 32) * 5 / 9) : p.temperature,
          })),
        });
        setCurrentWeather({
          nws: true,
          ...nwsForecastData.properties.periods[0],
          temperature: unit === "celsius" ? Math.round((nwsForecastData.properties.periods[0].temperature - 32) * 5 / 9) : nwsForecastData.properties.periods[0].temperature,
        });

        // Fetch NWS alerts
        const alertsRes = await fetch(`${NWS_ALERTS_API}?point=${lat},${lon}`);
        if (alertsRes.ok) {
          const alertsData = await alertsRes.json();
          setAlerts(alertsData.features || []);
        }
      } else {
        const forecastRes = await fetch(
          `${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,uv_index_max&current_weather=true&hourly=pm2_5&temperature_unit=${unit}&precipitation_unit=inch&timezone=auto`
        );
        const forecastData = await forecastRes.json();
        if (!forecastData.daily) throw new Error("No forecast data");
        setForecast(forecastData.daily);
        setCurrentWeather(forecastData.current_weather);
        setAirQuality({ pm2_5: forecastData.hourly?.pm2_5?.[0], uv_index: forecastData.daily?.uv_index_max?.[0] });
      }
    } catch (e: any) {
      setError(e.message || "Could not fetch weather");
      console.error("Weather fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCity(pendingCity);
    fetchWeather(pendingCity);
  };

  // Fetch weather when city or unit changes
  useEffect(() => {
    if (city) fetchWeather(city);
  }, [city, unit]);

  // Weather icon based on weathercode (Open-Meteo) or shortForecast (NWS)
  const getWeatherIcon = (weathercode: number | undefined, shortForecast: string | undefined) => {
    if (shortForecast) {
      if (shortForecast.toLowerCase().includes("rain")) return "🌧️";
      if (shortForecast.toLowerCase().includes("snow")) return "❄️";
      if (shortForecast.toLowerCase().includes("cloud")) return "☁️";
      if (shortForecast.toLowerCase().includes("sun") || shortForecast.toLowerCase().includes("clear")) return "☀️";
      if (shortForecast.toLowerCase().includes("storm")) return "⛈️";
    }
    if (weathercode !== undefined) {
      if (weathercode <= 3) return "☀️"; // Clear or few clouds
      if (weathercode <= 48) return "☁️"; // Cloudy
      if (weathercode <= 67) return "🌧️"; // Rain
      if (weathercode <= 77) return "❄️"; // Snow
      if (weathercode <= 99) return "⛈️"; // Thunderstorm
    }
    return "🌤️";
  };

  // Weather-based tips
  const getWeatherTips = () => {
    if (!currentWeather) return city ? ["Stay hydrated, dress in layers."] : ["Enter a city for tips."];
    const tips = [];
    const temp = currentWeather.nws ? currentWeather.temperature : currentWeather.temperature;
    const isRainy = currentWeather.rain || (currentWeather.nws && currentWeather.shortForecast?.toLowerCase().includes("rain"));
    const isSnowy = currentWeather.snow || (currentWeather.nws && currentWeather.shortForecast?.toLowerCase().includes("snow"));
    const isWindy = currentWeather.wind_speed > 20 || (currentWeather.nws && parseInt(currentWeather.windSpeed) > 20);
    const isHot = temp > (unit === "fahrenheit" ? 85 : 29);
    const isCold = temp < (unit === "fahrenheit" ? 45 : 7);

    if (isRainy) {
      tips.push("Rainy: Bring umbrella, waterproof shoes.", "Allow extra travel time for wet roads.");
    }
    if (isSnowy) {
      tips.push("Snowy: Wear boots, check road closures.", "Bring hand warmers for warmth.");
    }
    if (isHot) {
      tips.push("Hot: Pack sunscreen, light clothing.", "Stay hydrated, avoid hot cars.");
    }
    if (isCold) {
      tips.push("Cold: Bring gloves, thermal layers.", "Watch for icy roads.");
    }
    if (isWindy) {
      tips.push("Windy: Wear windbreaker, secure items.");
    }
    if (airQuality?.uv_index > 7) {
      tips.push("High UV: Use sunglasses, sunscreen.");
    }
    if (airQuality?.pm2_5 > 50) {
      tips.push("Poor air quality: Consider a mask for outdoor activities.");
    }
    if (!tips.length) tips.push("Mild: Dress comfortably, bring jacket.");
    return tips;
  };

  // Event-specific tips
  const getEventTips = () => {
    const tips = [];
    if (eventType === "concert") tips.push("Clear bag, earplugs, portable charger.");
    if (eventType === "gameday") tips.push("Clear bag, team colors, seat cushion.");
    if (eventType === "prom" || eventType === "wedding") {
      tips.push("Bobby pins, comfy shoes, stain remover.");
      if (airQuality?.humidity > 70) tips.push("Hairspray for humidity.");
      if (currentWeather?.rain) tips.push("Umbrella for photos.");
    }
    if (eventType === "festival") tips.push("Water bottle, sunscreen, rain poncho.");
    if (!eventType || eventType === "other") tips.push("Select event for tips.");
    return tips;
  };

  // Mock local event suggestions based on weather
  const getEventSuggestions = () => {
    if (!city) return ["Enter a city to see event suggestions."];
    const isRainy = currentWeather?.rain || (currentWeather?.nws && currentWeather.shortForecast?.toLowerCase().includes("rain"));
    const isHot = currentWeather && (currentWeather.nws ? currentWeather.temperature : currentWeather.temperature) > (unit === "fahrenheit" ? 85 : 29);
    const suggestions = [];
    if (isRainy) {
      suggestions.push(`Visit an indoor museum in ${city}.`, "Check out local cafes or bookstores.");
    } else if (isHot) {
      suggestions.push(`Enjoy a shaded park in ${city}.`, "Visit an air-conditioned mall or cinema.");
    } else {
      suggestions.push(`Explore outdoor markets in ${city}.`, "Attend a local festival or park event.");
    }
    return suggestions;
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gradient-to-br from-sky-50 to-sky-100 rounded-lg shadow-md overflow-auto">
      <form className="flex flex-col gap-2 mb-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-bold text-sky-800">City</label>
          <input
            className="w-full border rounded p-2 text-gray-800 bg-white"
            value={pendingCity}
            onChange={(e) => setPendingCity(e.target.value)}
            placeholder={autoCity || "Enter city"}
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-sky-600 text-white px-3 py-2 rounded hover:bg-sky-700 transition">
            Get Weather
          </button>
          <button
            type="button"
            className="flex-1 bg-gray-300 text-gray-800 px-3 py-2 rounded hover:bg-gray-400 transition"
            onClick={() => setUnit(unit === "fahrenheit" ? "celsius" : "fahrenheit")}
          >
            Switch to {unit === "fahrenheit" ? "°C" : "°F"}
          </button>
        </div>
      </form>
      {loading && <p className="text-sky-700 text-center animate-pulse">Loading...</p>}
      {error && <p className="text-coral-800 text-center bg-coral-100 p-2 rounded">⚠️ {error}</p>}
      {city && <p className="text-sky-800 font-semibold mb-2 text-center">Forecast for {city}</p>}

      {/* Weather Alerts */}
      {alerts.length > 0 && (
        <div className="mb-4 p-3 bg-coral-100 rounded border border-coral-300">
          <h4 className="text-sm font-bold text-coral-800 flex items-center">🚨 Weather Alerts</h4>
          <ul className="list-disc pl-4 text-xs text-coral-800">
            {alerts.slice(0, 3).map((alert, i) => (
              <li key={i}>{alert.properties?.event || "Alert"}: {alert.properties?.headline}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Current Weather */}
      {currentWeather && (
        <div className="mb-4 p-3 bg-white rounded shadow-md hover:scale-105 transition">
          <h4 className="text-sm font-bold text-sky-800 flex items-center">
            Current Weather {currentWeather.nws ? "(NWS)" : ""} {getWeatherIcon(currentWeather.weathercode, currentWeather.shortForecast)}
          </h4>
          <div className="flex flex-col gap-1 text-xs text-gray-800">
            <p>
              <b>Temp:</b> {currentWeather.nws ? currentWeather.temperature : Math.round(currentWeather.temperature)}°{unit === "fahrenheit" ? "F" : "C"}
            </p>
            <p>
              <b>Wind:</b> {currentWeather.nws ? currentWeather.windSpeed : `${currentWeather.windspeed} mph`}
            </p>
            {currentWeather.nws && <p><b>Forecast:</b> {currentWeather.shortForecast}</p>}
            {airQuality && (
              <>
                <p><b>UV Index:</b> {airQuality.uv_index?.toFixed(1) || "N/A"} {airQuality.uv_index > 7 ? "(High)" : ""}</p>
                <p><b>Air Quality (PM2.5):</b> {airQuality.pm2_5?.toFixed(1) || "N/A"} µg/m³ {airQuality.pm2_5 > 50 ? "(Poor)" : ""}</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* 7-Day Forecast */}
      {forecast && (
        <div className="mb-4">
          <h4 className="text-sm font-bold text-sky-800">7-Day Forecast {forecast.nws ? "(NWS)" : ""}</h4>
          <div className="flex flex-col gap-2">
            {forecast.nws
              ? forecast.periods.slice(0, 7).map((period: any, i: number) => (
                  <div key={i} className="bg-white rounded p-2 shadow-md hover:scale-105 transition">
                    <p className="font-bold text-sky-800 text-xs">{period.name} {getWeatherIcon(undefined, period.shortForecast)}</p>
                    <p className="text-xs text-gray-800">{period.temperature}°{unit === "fahrenheit" ? "F" : "C"}</p>
                    <p className="text-xs text-gray-800">{period.shortForecast}</p>
                  </div>
                ))
              : forecast.time.slice(0, 7).map((date: any, i: number) => (
                  <div key={i} className="bg-white rounded p-2 shadow-md hover:scale-105 transition">
                    <p className="font-bold text-sky-800 text-xs">{new Date(date).toLocaleDateString()} {getWeatherIcon(forecast.weathercode[i], undefined)}</p>
                    <p className="text-xs text-gray-800">
                      {Math.round(forecast.temperature_2m_min[i])}°{unit === "fahrenheit" ? "F" : "C"} - {Math.round(forecast.temperature_2m_max[i])}°{unit === "fahrenheit" ? "F" : "C"}
                    </p>
                    <p className="text-xs text-gray-800">Precip: {forecast.precipitation_sum[i]} in</p>
                    {forecast.uv_index_max && <p className="text-xs text-gray-800">UV: {forecast.uv_index_max[i].toFixed(1)}</p>}
                  </div>
                ))}
          </div>
        </div>
      )}

      {/* Tips and Event Suggestions */}
      <div className="flex flex-col gap-4">
        <div>
          <h4 className="text-sm font-bold text-sky-800">Weather & Travel Tips</h4>
          <ul className="list-disc pl-4 text-xs text-gray-800">
            {getWeatherTips().map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold text-sky-800">Event Tips</h4>
          <select
            className="w-full border rounded p-2 mb-2 text-xs text-gray-800 bg-white"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            <option value="">Select event</option>
            <option value="concert">Concert</option>
            <option value="gameday">Gameday</option>
            <option value="prom">Prom</option>
            <option value="wedding">Wedding</option>
            <option value="festival">Festival</option>
            <option value="other">Other</option>
          </select>
          <ul className="list-disc pl-4 text-xs text-gray-800">
            {getEventTips().map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold text-sky-800">Local Event Suggestions</h4>
          <ul className="list-disc pl-4 text-xs text-gray-800">
            {getEventSuggestions().map((suggestion, i) => (
              <li key={i}>{suggestion}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
```