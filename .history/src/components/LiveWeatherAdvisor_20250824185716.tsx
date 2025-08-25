"use client";

import { useState, useEffect } from "react";

interface WeatherData {
  current: {
    temperature: number;
    weathercode: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    uv_index?: number;
    pm25?: number;
    sunrise?: string;
    sunset?: string;
  };
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
  };
}

interface Alert {
  headline: string;
  description: string;
}

const LiveWeatherAdvisor = () => {
  const [city, setCity] = useState<string>("");
  const [inputCity, setInputCity] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async (manualCity?: string) => {
    setLoading(true);
    setError("");
    try {
      let latitude: number, longitude: number, userCity: string;

      if (manualCity) {
        const geoResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(manualCity)}&format=json&limit=1`
        );
        const geoData = await geoResponse.json();
        if (geoData.length === 0) {
          throw new Error("City not found.");
        }
        latitude = parseFloat(geoData[0].lat);
        longitude = parseFloat(geoData[0].lon);
        userCity = manualCity;
      } else {
        const ipResponse = await fetch("https://ipapi.co/json/");
        const ipData = await ipResponse.json();
        latitude = ipData.latitude;
        longitude = ipData.longitude;
        userCity = ipData.city || "New York";
      }

      setCity(userCity);

      const isUS = !manualCity ? (await fetch("https://ipapi.co/json/")).json().then(d => d.country_code === "US") : false; // Simplified, assume non-US for manual unless checked

      if (isUS) {
        const nwsResponse = await fetch(
          `https://api.weather.gov/points/${latitude},${longitude}`
        );
        const nwsData = await nwsResponse.json();
        const forecastUrl = nwsData.properties.forecast;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        const alertsResponse = await fetch(
          `https://api.weather.gov/alerts/active?point=${latitude},${longitude}`
        );
        const alertsData = await alertsResponse.json();

        const currentPeriod = forecastData.properties.periods[0];

        setWeather({
          current: {
            temperature: (currentPeriod.temperature - 32) * (5 / 9),
            weathercode: mapNWStoWMO(currentPeriod.shortForecast),
            relative_humidity_2m: currentPeriod.relativeHumidity?.value,
            wind_speed_10m: parseFloat(currentPeriod.windSpeed.split(" ")[0]),
            sunrise: forecastData.properties.periods.find((p: any) => p.isDaytime)?.startTime,
            sunset: forecastData.properties.periods.find((p: any) => !p.isDaytime)?.startTime,
          },
          daily: {
            time: forecastData.properties.periods
              .filter((p: any, i: number) => i % 2 === 0)
              .slice(0, 5)
              .map((p: any) => p.startTime.split("T")[0]),
            temperature_2m_max: forecastData.properties.periods
              .filter((p: any, i: number) => i % 2 === 0)
              .slice(0, 5)
              .map((p: any) => (p.temperature - 32) * (5 / 9)),
            temperature_2m_min: forecastData.properties.periods
              .filter((p: any, i: number) => i % 2 === 1)
              .slice(0, 5)
              .map((p: any) => (p.temperature - 32) * (5 / 9)),
            weathercode: forecastData.properties.periods
              .filter((p: any, i: number) => i % 2 === 0)
              .slice(0, 5)
              .map((p: any) => mapNWStoWMO(p.shortForecast)),
          },
        });

        setAlerts(
          alertsData.features?.slice(0, 3).map((alert: any) => ({
            headline: alert.properties.headline,
            description: alert.properties.description,
          })) || []
        );
      } else {
        const meteoResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset&hourly=uv_index,pm25&timezone=auto`
        );
        const meteoData = await meteoResponse.json();
        setWeather({
          current: {
            temperature: meteoData.current.temperature_2m,
            weathercode: meteoData.current.weathercode,
            relative_humidity_2m: meteoData.current.relative_humidity_2m,
            wind_speed_10m: meteoData.current.wind_speed_10m,
            uv_index: meteoData.hourly.uv_index[0],
            pm25: meteoData.hourly.pm25[0],
            sunrise: meteoData.daily.sunrise[0],
            sunset: meteoData.daily.sunset[0],
          },
          daily: {
            time: meteoData.daily.time,
            temperature_2m_max: meteoData.daily.temperature_2m_max,
            temperature_2m_min: meteoData.daily.temperature_2m_min,
            weathercode: meteoData.daily.weathercode,
          },
        });
      }
    } catch (err) {
      setError("Failed to fetch weather data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (inputCity.trim()) {
      fetchWeather(inputCity);
      setInputCity("");
    }
  };

  const mapNWStoWMO = (forecast: string): number => {
    forecast = forecast.toLowerCase();
    if (forecast.includes("sunny") || forecast.includes("clear")) return 0;
    if (forecast.includes("cloudy")) return 3;
    if (forecast.includes("rain") || forecast.includes("shower")) return 61;
    if (forecast.includes("snow")) return 71;
    if (forecast.includes("thunderstorm")) return 95;
    return 0;
  };

  const getWeatherIcon = (weathercode: number): string => {
    switch (weathercode) {
      case 0: return "☀️";
      case 1:
      case 2:
      case 3: return "☁️";
      case 61:
      case 63:
      case 65: return "🌧️";
      case 71:
      case 73:
      case 75: return "❄️";
      case 95: return "⛈️";
      default: return "🌤️";
    }
  };

  const getWeatherDescription = (weathercode: number): string => {
    switch (weathercode) {
      case 0: return "Clear";
      case 1:
      case 2:
      case 3: return "Cloudy";
      case 61:
      case 63:
      case 65: return "Rain";
      case 71:
      case 73:
      case 75: return "Snow";
      case 95: return "Thunderstorm";
      default: return "Partly Cloudy";
    }
  };

  const getWeatherTips = (weathercode: number, temp: number, humidity?: number, wind?: number): string[] => {
    const tips: string[] = [];
    if (weathercode >= 61 && weathercode <= 65) {
      tips.push("Pack an umbrella or raincoat.");
      tips.push("Waterproof shoes are recommended.");
    } else if (weathercode >= 71 && weathercode <= 75) {
      tips.push("Bring heavy winter gear and snow boots.");
      tips.push("Drive carefully; roads may be slippery.");
    } else if (weathercode === 95) {
      tips.push("Avoid outdoor activities during storms.");
      tips.push("Carry a portable charger for emergencies.");
    } else {
      tips.push("Sunscreen might be useful for sunny days.");
      tips.push("Wear breathable clothing for comfort.");
    }

    if (temp < 0) {
      tips.push("Clothing: Heavy coat, scarf, gloves, and thermal layers.");
    } else if (temp >= 0 && temp < 15) {
      tips.push("Clothing: Light jacket, jeans, and a sweater.");
    } else {
      tips.push("Clothing: T-shirt, shorts, and comfortable shoes.");
    }

    if (humidity && humidity > 80) {
      tips.push("High humidity: Stay hydrated and wear moisture-wicking clothes.");
    }

    if (wind && wind > 20) {
      tips.push("Windy: Secure loose items and wear wind-resistant jacket.");
    }

    return tips;
  };

  const getEventSuggestions = (weathercode: number, city: string): string[] => {
    const isGoodWeather = weathercode <= 3;
    return isGoodWeather
      ? [
          `Visit a local park in ${city} for a picnic.`,
          `Explore outdoor markets or festivals in ${city}.`,
          `Go for a scenic hike near ${city}.`,
        ]
      : [
          `Check out indoor museums in ${city}.`,
          `Visit a cozy café in ${city} for warm drinks.`,
          `Catch a movie at a ${city} theater.`,
        ];
  };

  const convertTemperature = (temp: number): number => {
    return unit === "F" ? (temp * 9) / 5 + 32 : temp;
  };

  const toggleUnit = () => {
    setUnit(unit === "C" ? "F" : "C");
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-gradient-to-b from-sky-50 to-sky-100 min-h-screen overflow-auto">
      <h1 className="text-2xl font-bold text-sky-800 mb-4 text-center">
        Weather Advisor for {city || "Loading..."}
      </h1>

      <div className="flex mb-4">
        <input
          type="text"
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
          placeholder="Enter city name"
          className="flex-grow p-2 border border-gray-300 rounded-l-lg text-gray-800"
        />
        <button
          onClick={handleSearch}
          className="bg-sky-600 text-white px-4 py-2 rounded-r-lg hover:bg-sky-700 transition-colors"
        >
          Search
        </button>
      </div>

      {loading && (
        <div className="text-center text-gray-800 animate-pulse">
          Loading weather data...
        </div>
      )}

      {error && (
        <div className="bg-coral-100 text-coral-800 p-3 rounded-lg mb-4 text-center">
          {error}
        </div>
      )}

      {weather && !error && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-md hover:scale-105 transition-transform">
            <h2 className="text-xl font-semibold text-sky-800">
              Current Weather {getWeatherIcon(weather.current.weathercode)}
            </h2>
            <p className="text-gray-800">
              Temperature: {convertTemperature(weather.current.temperature).toFixed(1)}°{unit}
            </p>
            <p className="text-gray-800">
              Condition: {getWeatherDescription(weather.current.weathercode)}
            </p>
            {weather.current.relative_humidity_2m && (
              <p className="text-gray-800">Humidity: {weather.current.relative_humidity_2m}%</p>
            )}
            {weather.current.wind_speed_10m && (
              <p className="text-gray-800">Wind Speed: {weather.current.wind_speed_10m} km/h</p>
            )}
            {weather.current.uv_index && (
              <p className="text-gray-800">UV Index: {weather.current.uv_index}</p>
            )}
            {weather.current.pm25 && (
              <p className="text-gray-800">Air Quality (PM2.5): {weather.current.pm25} µg/m³</p>
            )}
            {weather.current.sunrise && (
              <p className="text-gray-800">
                Sunrise: {new Date(weather.current.sunrise).toLocaleTimeString()}
              </p>
            )}
            {weather.current.sunset && (
              <p className="text-gray-800">
                Sunset: {new Date(weather.current.sunset).toLocaleTimeString()}
              </p>
            )}
          </div>

          {alerts.length > 0 && (
            <div className="bg-coral-100 p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-coral-800">Weather Alerts</h2>
              {alerts.map((alert, index) => (
                <div key={index} className="text-coral-800 text-sm">
                  <p className="font-bold">{alert.headline}</p>
                  <p>{alert.description.slice(0, 100)}...</p>
                </div>
              ))}
            </div>
          )}

          <div className="bg-white p-4 rounded-lg shadow-md hover:scale-105 transition-transform">
            <h2 className="text-xl font-semibold text-sky-800">Packing & Event Tips</h2>
            <ul className="list-disc list-inside text-gray-800 text-sm">
              {getWeatherTips(
                weather.current.weathercode,
                weather.current.temperature,
                weather.current.relative_humidity_2m,
                weather.current.wind_speed_10m
              ).map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md hover:scale-105 transition-transform">
            <h2 className="text-xl font-semibold text-sky-800">Event Suggestions</h2>
            <ul className="list-disc list-inside text-gray-800 text-sm">
              {getEventSuggestions(weather.current.weathercode, city).map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>

          {weather.daily && (
            <div className="bg-white p-4 rounded-lg shadow-md hover:scale-105 transition-transform">
              <h2 className="text-xl font-semibold text-sky-800">5-Day Forecast</h2>
              <div className="flex flex-col space-y-2">
                {weather.daily.time.slice(0, 5).map((date, index) => (
                  <div key={index} className="flex justify-between text-gray-800 text-sm">
                    <span>{new Date(date).toLocaleDateString()}</span>
                    <span>{getWeatherIcon(weather.daily!.weathercode[index])}</span>
                    <span>
                      {convertTemperature(weather.daily!.temperature_2m_max[index]).toFixed(1)}°
                      {unit} /{" "}
                      {convertTemperature(weather.daily!.temperature_2m_min[index]).toFixed(1)}°{unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={toggleUnit}
            className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors w-full"
          >
            Switch to °{unit === "C" ? "F" : "C"}
          </button>
        </div>
      )}
    </div>
  );
};

export default LiveWeatherAdvisor;