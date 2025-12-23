export async function fetchOpenWeatherData(lat: number, lng: number) {
  const key = process.env.OPENWEATHER_API_KEY!;

  if (!key) {
    console.warn("⚠️ No OpenWeather API Key found. Using '0 - N/A' mock data.");
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
      next: { revalidate: 900 }, // Cache for 15 minutes (900s) to save API calls
    });

    if (!res.ok) {
      console.error(
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
  return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
    timeZone: timezone, // Uses the API's "America/Chicago"
    hour: "numeric",
    minute: "2-digit",
    hour12: true, // Ensures AM/PM format
  });
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

/*

Example response from OpenWeather API one call 3.0:
https://openweathermap.org/api/one-call-3

{
   "lat":33.44,
   "lon":-94.04,
   "timezone":"America/Chicago",
   "timezone_offset":-18000,
   "current":{
      "dt":1684929490,
      "sunrise":1684926645,
      "sunset":1684977332,
      "temp":292.55,
      "feels_like":292.87,
      "pressure":1014,
      "humidity":89,
      "dew_point":290.69,
      "uvi":0.16,
      "clouds":53,
      "visibility":10000,
      "wind_speed":3.13,
      "wind_deg":93,
      "wind_gust":6.71,
      "weather":[
         {
            "id":803,
            "main":"Clouds",
            "description":"broken clouds",
            "icon":"04d"
         }
      ]
   },
   "minutely":[
      {
         "dt":1684929540,
         "precipitation":0
      },
      ...
   ],
   "hourly":[
      {
         "dt":1684926000,
         "temp":292.01,
         "feels_like":292.33,
         "pressure":1014,
         "humidity":91,
         "dew_point":290.51,
         "uvi":0,
         "clouds":54,
         "visibility":10000,
         "wind_speed":2.58,
         "wind_deg":86,
         "wind_gust":5.88,
         "weather":[
            {
               "id":803,
               "main":"Clouds",
               "description":"broken clouds",
               "icon":"04n"
            }
         ],
         "pop":0.15
      },
      ...
   ],
   "daily":[
      {
         "dt":1684951200,
         "sunrise":1684926645,
         "sunset":1684977332,
         "moonrise":1684941060,
         "moonset":1684905480,
         "moon_phase":0.16,
         "summary":"Expect a day of partly cloudy with rain",
         "temp":{
            "day":299.03,
            "min":290.69,
            "max":300.35,
            "night":291.45,
            "eve":297.51,
            "morn":292.55
         },
         "feels_like":{
            "day":299.21,
            "night":291.37,
            "eve":297.86,
            "morn":292.87
         },
         "pressure":1016,
         "humidity":59,
         "dew_point":290.48,
         "wind_speed":3.98,
         "wind_deg":76,
         "wind_gust":8.92,
         "weather":[
            {
               "id":500,
               "main":"Rain",
               "description":"light rain",
               "icon":"10d"
            }
         ],
         "clouds":92,
         "pop":0.47,
         "rain":0.15,
         "uvi":9.23
      },
      ...
   ],
    "alerts": [
    {
      "sender_name": "NWS Philadelphia - Mount Holly (New Jersey, Delaware, Southeastern Pennsylvania)",
      "event": "Small Craft Advisory",
      "start": 1684952747,
      "end": 1684988747,
      "description": "...SMALL CRAFT ADVISORY REMAINS IN EFFECT FROM 5 PM THIS\nAFTERNOON TO 3 AM EST FRIDAY...\n* WHAT...North winds 15 to 20 kt with gusts up to 25 kt and seas\n3 to 5 ft expected.\n* WHERE...Coastal waters from Little Egg Inlet to Great Egg\nInlet NJ out 20 nm, Coastal waters from Great Egg Inlet to\nCape May NJ out 20 nm and Coastal waters from Manasquan Inlet\nto Little Egg Inlet NJ out 20 nm.\n* WHEN...From 5 PM this afternoon to 3 AM EST Friday.\n* IMPACTS...Conditions will be hazardous to small craft.",
      "tags": [

      ]
    },
    ...
  ]
*/
