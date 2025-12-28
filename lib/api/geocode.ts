export async function fetchStateGeocodeData(state: string) {
  const key = process.env.OPENWEATHER_API_KEY!;

  const url = new URL("http://api.openweathermap.org/geo/1.0/direct");

  url.searchParams.set("q", state);
  url.searchParams.set("limit", "1");
  url.searchParams.set("appid", key);

  const res = await fetch(url.toString(), {
    next: { revalidate: 900 }, // Cache for 15 minutes (900s) to save API calls
  });

  if (!res.ok) {
    throw new Error(`OpenWeatherAPI failed: ${res.status}`);
  }

  const json = (await res.json()) as GeocodeResponse;

  return json;
}

type GeocodeResponse = Array<{
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}>;
