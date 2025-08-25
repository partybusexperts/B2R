<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live Weather Advisor</title>
  <script src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7.20.6/Babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect } = React;

    const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";
    const GEOCODE_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
    const GEOIP_API_URL = "https://ipapi.co/json/";
    const NWS_POINTS_API = "https://api.weather.gov/points";

    function LiveWeatherAdvisor() {
      const [city, setCity] = useState("");
      const [autoCity, setAutoCity] = useState("");
      const [forecast, setForecast] = useState(null);
      const [currentWeather, setCurrentWeather] = useState(null);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState("");
      const [eventType, setEventType] = useState("");
      const [pendingCity, setPendingCity] = useState("");

      // Fetch city from IP on mount
      useEffect(() => {
        fetch(GEOIP_API_URL)
          .then(r => r.json())
          .then(data => {
            if (data?.city) {
              setAutoCity(data.city);
              if (!city) {
                setCity(data.city);
                setPendingCity(data.city);
              }
            }
          });
      }, []);

      // Fetch weather data
      const fetchWeather = async (cityToUse) => {
        if (!cityToUse) return;
        setLoading(true);
        setError("");
        setForecast(null);
        setCurrentWeather(null);

        try {
          // Geocode city to lat/lon
          const geoRes = await fetch(`${GEOCODE_API_URL}?name=${encodeURIComponent(cityToUse)}&count=1&language=en&format=json`);
          const geoData = await geoRes.json();
          if (!geoData.results?.[0]) throw new Error("City not found");
          const { latitude: lat, longitude: lon, country } = geoData.results[0];

          // US: Use NWS API
          if (country === "United States") {
            const pointsRes = await fetch(`${NWS_POINTS_API}/${lat},${lon}`);
            if (!pointsRes.ok) throw new Error("NWS: Could not get gridpoint");
            const pointsData = await pointsRes.json();
            const forecastUrl = pointsData.properties?.forecast;
            if (!forecastUrl) throw new Error("NWS: No forecast URL");
            const nwsForecastRes = await fetch(forecastUrl);
            if (!nwsForecastRes.ok) throw new Error("NWS: Could not get forecast");
            const nwsForecastData = await nwsForecastRes.json();
            setForecast({ nws: true, periods: nwsForecastData.properties.periods });
            setCurrentWeather({ nws: true, ...nwsForecastData.properties.periods[0] });
          } else {
            // Non-US: Use Open-Meteo
            const forecastRes = await fetch(
              `${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&current_weather=true&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=auto`
            );
            const forecastData = await forecastRes.json();
            if (!forecastData.daily) throw new Error("No forecast data");
            setForecast(forecastData.daily);
            setCurrentWeather(forecastData.current_weather);
          }
        } catch (e) {
          setError(e.message || "Could not fetch weather");
          console.error("Weather fetch error:", e);
        } finally {
          setLoading(false);
        }
      };

      // Handle form submission
      const handleSubmit = (e) => {
        e.preventDefault();
        setCity(pendingCity);
        fetchWeather(pendingCity);
      };

      // Fetch weather when city changes
      useEffect(() => {
        if (city) fetchWeather(city);
      }, [city]);

      // Weather-based packing and comfort tips
      const getWeatherTips = () => {
        if (!currentWeather) return ["Enter a city for custom tips."];
        const tips = [];
        if (currentWeather.rain || (currentWeather.nws && currentWeather.shortForecast?.toLowerCase().includes("rain"))) {
          tips.push("Rainy: Bring umbrella, poncho, waterproof shoes.", "Allow extra travel time for wet roads.");
        }
        if (currentWeather.snow || (currentWeather.nws && currentWeather.shortForecast?.toLowerCase().includes("snow"))) {
          tips.push("Snowy: Wear boots, bring hand warmers, check road closures.");
        }
        if ((currentWeather.temp > 85 || (currentWeather.nws && currentWeather.temperature > 85))) {
          tips.push("Hot: Pack sunscreen, hat, light clothing.", "Stay hydrated, avoid leaving pets in vehicles.");
        }
        if ((currentWeather.temp < 45 || (currentWeather.nws && currentWeather.temperature < 45))) {
          tips.push("Cold: Bring gloves, scarf, thermal layers.", "Watch for icy roads.");
        }
        if ((currentWeather.wind_speed > 20 || (currentWeather.nws && currentWeather.windSpeed && parseInt(currentWeather.windSpeed) > 20))) {
          tips.push("Windy: Wear windbreaker, secure loose items.");
        }
        if (currentWeather.uvi > 7) {
          tips.push("High UV: Use sunglasses, sunscreen.");
        }
        if (!tips.length) tips.push("Mild: Dress comfortably, bring light jacket.");
        return tips;
      };

      // Event-specific tips
      const getEventTips = () => {
        const tips = [];
        if (eventType === "concert") tips.push("Clear bag policy, earplugs, portable charger.");
        if (eventType === "gameday") tips.push("Clear bag policy, team colors, seat cushion.");
        if (eventType === "prom" || eventType === "wedding") {
          tips.push("Bobby pins, comfy shoes, stain remover pen.");
          if (currentWeather?.humidity > 70) tips.push("Extra hairspray for humidity.");
          if (currentWeather?.temp < 50) tips.push("Wrap or jacket for chilly nights.");
          if (currentWeather?.rain) tips.push("Umbrella for photos/arrivals.");
        }
        if (eventType === "festival") tips.push("Reusable water bottle, sunscreen, rain poncho.");
        if (!eventType || eventType === "other") tips.push("Select event type for custom tips.");
        return tips;
      };

      return (
        <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl shadow-lg">
          <form className="flex gap-4 mb-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold text-sky-800">City</label>
              <input
                className="border rounded-lg p-2 text-gray-800"
                value={pendingCity}
                onChange={(e) => setPendingCity(e.target.value)}
                placeholder={autoCity || "Enter city"}
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Get Weather</button>
          </form>
          {loading && <p className="text-sky-700">Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {city && <p className="text-sky-800 font-semibold mb-4">Forecast for {city}</p>}

          {/* Current Weather */}
          {currentWeather && (
            <div className="mb-4">
              <h4 className="text-lg font-bold text-sky-800">Current Weather {currentWeather.nws ? "(NWS)" : ""}</h4>
              <div className="flex gap-4 text-gray-800">
                <p><b>Temp:</b> {currentWeather.nws ? currentWeather.temperature : Math.round(currentWeather.temperature)}°F</p>
                <p><b>Wind:</b> {currentWeather.nws ? currentWeather.windSpeed : `${currentWeather.windspeed} mph`}</p>
                {currentWeather.nws && <p><b>Forecast:</b> {currentWeather.shortForecast}</p>}
              </div>
            </div>
          )}

          {/* 7-Day Forecast */}
          {forecast && (
            <div className="mb-4">
              <h4 className="text-lg font-bold text-sky-800">7-Day Forecast {forecast.nws ? "(NWS)" : ""}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {forecast.nws
                  ? forecast.periods.slice(0, 7).map((period, i) => (
                      <div key={i} className="bg-white rounded-lg p-2 text-center shadow">
                        <p className="font-bold text-sky-700">{period.name}</p>
                        <p>{period.temperature}°F</p>
                        <p className="text-sm">{period.shortForecast}</p>
                      </div>
                    ))
                  : forecast.time.slice(0, 7).map((date, i) => (
                      <div key={i} className="bg-white rounded-lg p-2 text-center shadow">
                        <p className="font-bold text-sky-700">{new Date(date).toLocaleDateString()}</p>
                        <p>{Math.round(forecast.temperature_2m_min[i])}°F - {Math.round(forecast.temperature_2m_max[i])}°F</p>
                        <p className="text-sm">Precip: {forecast.precipitation_sum[i]} in</p>
                      </div>
                    ))}
              </div>
            </div>
          )}

          {/* Tips Section */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-lg font-bold text-sky-800">Packing & Comfort Tips</h4>
              <ul className="list-disc pl-5 text-gray-800">
                {getWeatherTips().map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-sky-800">Event Tips</h4>
              <select
                className="border rounded-lg p-2 mb-2 text-gray-800"
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
              <ul className="list-disc pl-5 text-gray-800">
                {getEventTips().map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>
          </div>
        </div>
      );
    }

    ReactDOM.render(<LiveWeatherAdvisor />, document.getElementById("root"));
  </script>
</body>
</html>