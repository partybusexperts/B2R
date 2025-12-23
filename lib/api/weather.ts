export async function fetchOpenWeatherData(lat: number, lng: number) {
  const key = process.env.OPENWEATHER_API_KEY;

  // 1. Return mock data immediately if no key (prevents 401 errors)
  if (!key) {
    console.warn("⚠️ No OpenWeather API Key found. Using '0/N/A' mock data.");
    return getMockWeatherData();
  }

  const url = new URL("https://api.openweathermap.org/data/3.0/onecall");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lng));
  url.searchParams.set("exclude", "minutely");
  url.searchParams.set("units", "imperial");
  url.searchParams.set("appid", key);

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 900 }, // Cache for 15 minutes
    });

    if (!res.ok) {
      // 2. Use console.warn instead of error to avoid breaking the build
      console.warn(
        `⚠️ OpenWeatherAPI failed: ${res.status} (${res.statusText}). Using mock data.`,
      );
      return getMockWeatherData();
    }

    const json = (await res.json()) as OneCallResponse;
    return json;
  } catch (error) {
    console.warn("⚠️ OpenWeatherAPI Fetch Error:", error);
    return getMockWeatherData();
  }
}

// 3. Helper to generate the "Obvious" Mock Data (0 and N/A)
function getMockWeatherData(): OneCallResponse {
  return {
    lat: 0,
    lon: 0,
    timezone: "UTC", // Safe fallback
    timezone_offset: 0,
    current: {
      dt: 0,
      sunrise: 0,
      sunset: 0,
      temp: 0,
      feels_like: 0,
      pressure: 0,
      humidity: 0,
      dew_point: 0,
      uvi: 0,
      clouds: 0,
      visibility: 0,
      wind_speed: 0,
      wind_deg: 0,
      wind_gust: 0,
      weather: [
        {
          id: 0,
          main: "N/A",
          description: "Data Unavailable",
          icon: "01d",
        },
      ],
    },
    minutely: [],
    // Fill with 0s so the UI renders "0°F" instead of disappearing
    hourly: Array(12).fill({
      dt: 0,
      temp: 0,
      feels_like: 0,
      pressure: 0,
      humidity: 0,
      dew_point: 0,
      uvi: 0,
      clouds: 0,
      visibility: 0,
      wind_speed: 0,
      wind_deg: 0,
      wind_gust: 0,
      weather: [{ id: 0, main: "N/A", description: "N/A", icon: "01d" }],
      pop: 0,
    }),
    daily: Array(5).fill({
      dt: 0,
      sunrise: 0,
      sunset: 0,
      moonrise: 0,
      moonset: 0,
      moon_phase: 0,
      summary: "Data Unavailable",
      temp: { day: 0, min: 0, max: 0, night: 0, eve: 0, morn: 0 },
      feels_like: { day: 0, night: 0, eve: 0, morn: 0 },
      pressure: 0,
      humidity: 0,
      dew_point: 0,
      wind_speed: 0,
      wind_deg: 0,
      wind_gust: 0,
      weather: [{ id: 0, main: "N/A", description: "N/A", icon: "01d" }],
      clouds: 0,
      pop: 0,
      rain: 0,
      uvi: 0,
    }),
    alerts: [],
  };
}

export function getWeatherIcon(iconCode: string) {
  const map = {
    "clear sky": "☀️",
    "few clouds": "🌤️",
    "scattered clouds": "☁️",
    "broken clouds": "☁️",
    "overcast clouds": "☁️",
    "shower rain": "🌧️",
    rain: "🌧️",
    thunderstorm: "⛈️",
    snow: "❄️",
    mist: "🌫️",
  };

  return map[iconCode as keyof typeof map] || "❓";
}

export function getWindDirection(degrees: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  // Divide by 45 degrees to find the index (0-7)
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export function formatWeatherTime(timestamp: number, timezone: string) {
  try {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      timeZone: timezone, // Uses the API's "America/Chicago"
      hour: "numeric",
      minute: "2-digit",
      hour12: true, // Ensures AM/PM format
    });
  } catch (error) {
    console.error("Error formatting weather time:", error);
    // 4. Fallback to UTC if timezone is invalid (like "N/A")
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      timeZone: "UTC",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
}

// Types from https://gist.github.com/TheJoeFin/5d9be4cb2d5ca0136021cb9ce2a9c9e5
export type OneCallResponse = {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: CurrentWeather;
  minutely?: Minutely[];
  hourly: Hourly[];
  daily: Daily[];
  alerts?: Alert[];
};

export type CurrentWeather = {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  rain?: rain1hr;
  snow?: snow1hr;
  weather: Weather[];
};

export type rain1hr = {
  "1h": number; // rain volume in mm
};

export type snow1hr = {
  "1h": number; // snow volume in mm
};

export type Weather = {
  id: number;
  main: string;
  description: string;
  icon: string;
  // added to avoid type errors if api returns something unexpected
};

export type Minutely = {
  dt: number;
  precipitation: number;
};

export type Hourly = {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  rain?: rain1hr;
  snow?: snow1hr;
  weather: Weather[];
  pop: number;
};

export type Daily = {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  summary: string;
  temp: DayTemp;
  feels_like: DayFeelsLike;
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: Weather[];
  clouds: number;
  pop: number;
  rain?: number; // rain volume in mm
  snow?: number; // snow volume in mm
  uvi: number;
};

export type DayTemp = {
  day: number;
  min: number;
  max: number;
  night: number;
  eve: number;
  morn: number;
};

export type DayFeelsLike = {
  day: number;
  night: number;
  eve: number;
  morn: number;
};

export type Alert = {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  tags: string[];
};
