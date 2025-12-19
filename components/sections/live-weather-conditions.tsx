import Image from "next/image";
import {
  Daily,
  fetchOpenWeatherData,
  formatWeatherTime,
  Hourly,
} from "@/lib/api/weather";

export async function LiveWeatherConditions({
  cityName,
  stateName,
  weather,
  tips,
}: {
  cityName?: string;
  stateName?: string;
  weather: Awaited<ReturnType<typeof fetchOpenWeatherData>>;
  tips: string[];
}) {
  const sunrise = formatWeatherTime(weather.current.sunrise, weather.timezone);
  const sunset = formatWeatherTime(weather.current.sunset, weather.timezone);

  const weatherIcon = weather.current.weather[0]?.icon || "01d";

  const next12Hours = weather.hourly.slice(0, 12);
  const next5Days = weather.daily.slice(0, 5);

  return (
    <div
      className="[&amp;_*]:!text-[13px] [&amp;_h1]:!text-base
        [&amp;_h2]:!text-sm [&amp;_.min-h-screen]:min-h-0
        [&amp;_.min-h-screen]:bg-transparent [&amp;_.max-w-7xl]:max-w-full
        [&amp;_.grid]:gap-3"
    >
      <div
        className="w-full p-4 bg-gradient-to-br from-sky-100 to-sky-200
          rounded-2xl text-gray-900 text-[13px]"
      >
        <div
          className="flex flex-col gap-3 md:flex-row md:items-end
            md:justify-between"
        >
          <div>
            <h1 className="text-xl font-bold text-sky-950">
              Live Weather — {cityName && `${cityName}, `}{" "}
              {stateName ?? "Unknown State"}
            </h1>
            <p className="text-sky-900 mt-0.5 text-xs">
              <span className="inline-flex items-center gap-1 mr-3">
                <span className="inline-block align-[-2px]">🌅</span> {sunrise}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="inline-block align-[-2px]">🌙</span> {sunset}
              </span>
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            className="bg-white text-gray-900 rounded-2xl shadow p-4
              md:col-span-1 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-sky-900" id="now-8">
                Now
              </h2>
              <div
                className="text-3xl"
                title={weather.current.weather[0].description}
              >
                <Image
                  src={`https://openweathermap.org/img/wn/${weatherIcon}@4x.png`}
                  alt={weather.current.weather[0].description}
                  width={40}
                  height={40}
                />
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-gray-900">
              <div className="flex items-center gap-2">
                <span className="inline-block align-[-2px]">🌡️</span>{" "}
                <span className="font-medium">
                  {Math.round(weather.current.temp)}°F
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block align-[-2px]">📏</span> Feels{" "}
                {Math.round(weather.current.feels_like)}°F
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block align-[-2px]">💨</span>{" "}
                {Math.round(weather.current.wind_speed)} mph
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block align-[-2px]">💧</span>{" "}
                {Math.round(weather.current.humidity)}%
              </div>
              <div className="col-span-2 text-sm mt-1">
                UVI:{" "}
                <span className="font-medium">
                  {Math.round(weather.current.uvi)}
                </span>{" "}
                · Pressure:{" "}
                <span className="font-medium">
                  {weather.current.pressure} hPa
                </span>
              </div>
            </div>
          </div>
          <div
            className="bg-white text-gray-900 rounded-2xl shadow p-4 border
              border-gray-200"
          >
            <h2
              className="text-lg font-semibold text-sky-900"
              id="packing-activity-tips-9"
            >
              Packing &amp; Activity Tips
            </h2>
            <ul className="mt-2 list-disc list-inside text-sm space-y-1">
              {tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
          <div
            className="bg-white text-gray-900 rounded-2xl shadow p-4 border
              border-gray-200"
          >
            <h2
              className="text-lg font-semibold text-sky-900 flex items-center
                gap-2"
              id="weather-alerts-10"
            >
              <span className="inline-block align-[-2px]">⚠️</span> Weather
              Alerts
            </h2>
            <div className="mt-2 text-sm text-gray-700">
              {weather.alerts
                ? weather.alerts.map((alert) => (
                    <div key={alert.event}>
                      <strong>{alert.event}:</strong>
                      <p>{alert.description}</p>
                    </div>
                  ))
                : "No active alerts for this area."}
            </div>
          </div>
          <HourlyForecastCard data={next12Hours} />
          <FiveDaysForecastCard data={next5Days} />
        </div>
      </div>
    </div>
  );
}

function HourlyForecastCard({ data }: { data: Hourly[] }) {
  const generateTemperaturePoints = (temps: number[]): string => {
    if (temps.length === 0) return "";

    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const range = max - min || 1; // Avoid divide by zero

    const width = 320; // SVG ViewBox width
    const height = 100; // SVG ViewBox height
    const paddingY = 10; // Keep line away from absolute edges

    // Step between each point on X axis
    const stepX = width / (temps.length - 1);

    return temps
      .map((temp, index) => {
        const x = index * stepX;

        // Normalize temp to 0-1 range
        const normalized = (temp - min) / range;

        // Scale to height (inverted because SVG 0 is top)
        // We use padding so points aren't cut off
        const y = height - paddingY - normalized * (height - paddingY * 2);

        return `${x},${y}`;
      })
      .join(" ");
  };

  const temps = data.map((hour) => hour.temp);
  const points = generateTemperaturePoints(temps);

  return (
    <div
      className="bg-white text-gray-900 rounded-2xl shadow p-3 sm:col-span-2
        border border-gray-200"
    >
      <h2 className="text-lg font-semibold text-sky-900" id="next-12-hours-11">
        Next 12 Hours
      </h2>
      <div className="mt-3 grid md:grid-cols-5 gap-4">
        {/* Graph */}
        <div className="md:col-span-2">
          <svg viewBox="0 0 320 100" className="w-full h-24">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              points={points}
              className="text-sky-700"
            ></polyline>
          </svg>
        </div>

        {/* Grid */}
        <div
          className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-2
            text-sm"
        >
          {data.map((hour, index) => {
            const hourLabel = formatWeatherTime(hour.dt, "UTC").replace(
              /:\d{2} /,
              " ",
            );
            const tempF = Math.round(hour.temp);
            const popPercent = Math.round((hour.pop || 0) * 100);
            const iconCode = hour.weather[0]?.icon || "01d";

            return (
              <div
                key={index}
                className="rounded-xl border border-gray-200 p-2"
              >
                <div className="text-xs text-gray-600">{hourLabel}</div>
                <div className="font-medium">{tempF}°F</div>
                <div
                  className="text-xs inline-flex items-center gap-1
                    text-sky-800"
                >
                  <Image
                    src={`https://openweathermap.org/img/wn/${iconCode}.png`}
                    alt={hour.weather[0]?.description || "Weather icon"}
                    width={16}
                    height={16}
                  />
                  {popPercent}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FiveDaysForecastCard({ data }: { data: Daily[] }) {
  return (
    <div
      className="bg-white text-gray-900 rounded-2xl shadow p-3 border
        border-gray-200"
    >
      <h2 className="text-lg font-semibold text-sky-900" id="5-day-forecast-12">
        5-Day Forecast
      </h2>
      <div className="mt-2 divide-y divide-gray-200">
        {data.map((day, index) => {
          const date = new Date(day.dt * 1000);
          const options: Intl.DateTimeFormatOptions = {
            weekday: "short",
            month: "short",
            day: "numeric",
          };
          const dayLabel = date.toLocaleDateString("en-US", options);
          const iconCode = day.weather[0]?.icon || "01d";
          const description = day.weather[0]?.description || "Weather";
          const maxTemp = Math.round(day.temp.max);
          const minTemp = Math.round(day.temp.min);

          return (
            <div key={index} className="py-2 flex items-center justify-between">
              <div className="w-28 text-gray-800">{dayLabel}</div>
              <div className="text-lg" title={description}>
                <Image
                  src={`https://openweathermap.org/img/wn/${iconCode}.png`}
                  alt={description}
                  width={24}
                  height={24}
                />
              </div>
              <div className="w-40 text-right">
                <span className="font-semibold">{maxTemp}°F</span>
                <span className="text-gray-600"> / {minTemp}°F</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
