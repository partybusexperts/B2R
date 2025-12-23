export async function fetchStateGeocodeData(state: string) {
  const key = process.env.OPENWEATHER_API_KEY;

  if (!key) {
    console.warn("⚠️ No OpenWeather API Key found for Geocoding.");
    return null;
  }

  const url = new URL("http://api.openweathermap.org/geo/1.0/direct");

  url.searchParams.set("q", state);
  url.searchParams.set("limit", "1");
  url.searchParams.set("appid", key);

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 900 }, // Cache for 15 minutes
    });

    if (!res.ok) {
      console.warn(`⚠️ Geocoding API failed: ${res.status}. Using fallback.`);
      return null;
    }

    const json = (await res.json()) as GeocodeResponse;
    return json;
  } catch (error) {
    console.warn("⚠️ Geocoding Fetch Error:", error);
    return null;
  }
}

type GeocodeResponse = Array<{
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}>;
