import { CloudSun, Car, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LiveConditionsProps {
  city: string;
  lat: number;
  lng: number;
}

type OpenMeteoCurrent = {
  time: string;
  temperature_2m?: number;
  apparent_temperature?: number;
  precipitation?: number;
  wind_speed_10m?: number;
  wind_gusts_10m?: number;
  weather_code?: number;
};

function weatherCodeToLabel(code: number | undefined) {
  if (code == null) return "Unknown";
  if (code === 0) return "Clear";
  if (code === 1 || code === 2 || code === 3) return "Partly cloudy";
  if (code === 45 || code === 48) return "Fog";
  if ([51, 53, 55].includes(code)) return "Drizzle";
  if ([61, 63, 65].includes(code)) return "Rain";
  if ([66, 67].includes(code)) return "Freezing rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorms";
  return "Mixed";
}

async function fetchOpenMeteoCurrent(lat: number, lng: number) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lng));
  url.searchParams.set(
    "current",
    [
      "temperature_2m",
      "apparent_temperature",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
      "wind_gusts_10m",
    ].join(","),
  );
  url.searchParams.set("temperature_unit", "fahrenheit");
  url.searchParams.set("wind_speed_unit", "mph");
  url.searchParams.set("precipitation_unit", "inch");
  url.searchParams.set("timezone", "auto");

  const res = await fetch(url.toString(), {
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new Error(`Open-Meteo failed: ${res.status}`);

  const json = (await res.json()) as { current?: OpenMeteoCurrent };
  return json.current ?? null;
}

type TomTomFlowResponse = {
  flowSegmentData?: {
    currentSpeed?: number;
    freeFlowSpeed?: number;
    confidence?: number;
    roadClosure?: boolean;
    currentTravelTime?: number;
    freeFlowTravelTime?: number;
  };
};

function trafficLabelFromSpeeds(currentSpeed?: number, freeFlowSpeed?: number) {
  if (!currentSpeed || !freeFlowSpeed || freeFlowSpeed <= 0) return null;
  const ratio = currentSpeed / freeFlowSpeed;
  const congestion = 1 - ratio;
  if (congestion < 0.15) return "Light";
  if (congestion < 0.35) return "Moderate";
  return "Heavy";
}

async function fetchTomTomTraffic(lat: number, lng: number) {
  const key = process.env.TOMTOM_API_KEY;
  if (!key) return null;

  const url = new URL(
    "https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/10/json",
  );
  url.searchParams.set("point", `${lat},${lng}`);
  url.searchParams.set("unit", "MPH");
  url.searchParams.set("key", key);

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) return null;

  const json = (await res.json()) as TomTomFlowResponse;
  const data = json.flowSegmentData;
  if (!data) return null;

  return {
    label: trafficLabelFromSpeeds(data.currentSpeed, data.freeFlowSpeed),
    currentSpeed: data.currentSpeed,
    freeFlowSpeed: data.freeFlowSpeed,
  };
}

export async function LiveConditions({ city, lat, lng }: LiveConditionsProps) {
  let weather: OpenMeteoCurrent | null = null;
  let traffic: Awaited<ReturnType<typeof fetchTomTomTraffic>> | null = null;

  try {
    weather = await fetchOpenMeteoCurrent(lat, lng);
  } catch {
    weather = null;
  }

  try {
    traffic = await fetchTomTomTraffic(lat, lng);
  } catch {
    traffic = null;
  }

  if (!weather) return <ConditionsSkeleton />;

  const temp =
    typeof weather.temperature_2m === "number"
      ? Math.round(weather.temperature_2m)
      : null;
  const feels =
    typeof weather.apparent_temperature === "number"
      ? Math.round(weather.apparent_temperature)
      : null;

  return (
    <section className="py-16 md:py-20 bg-muted/10 border-y border-border/40">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-3xl text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Live {city} conditions
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Weather + traffic snapshots for trip planning.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <Card className="p-6 border-border/60 shadow-sm">
            <div className="flex items-start gap-4">
              <div
                className="h-12 w-12 rounded-full bg-primary/10 text-primary
                  flex items-center justify-center"
              >
                <CloudSun className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p
                  className="text-xs font-bold uppercase tracking-wide
                    text-muted-foreground"
                >
                  Weather
                </p>
                <p className="text-2xl font-extrabold">
                  {temp != null ? `${temp}°F` : "—"}{" "}
                  {weatherCodeToLabel(weather.weather_code)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Feels like {feels != null ? `${feels}°F` : "—"} · Wind{" "}
                  {weather.wind_speed_10m ?? "—"} mph
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/60 shadow-sm">
            <div className="flex items-start gap-4">
              <div
                className="h-12 w-12 rounded-full bg-primary/10 text-primary
                  flex items-center justify-center"
              >
                <Car className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p
                  className="text-xs font-bold uppercase tracking-wide
                    text-muted-foreground"
                >
                  Traffic
                </p>
                <p className="text-2xl font-extrabold">
                  {traffic?.label ?? "Unavailable"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {traffic?.currentSpeed != null &&
                  traffic?.freeFlowSpeed != null
                    ? `${Math.round(traffic.currentSpeed)} mph vs ${Math.round(traffic.freeFlowSpeed)} mph free flow`
                    : process.env.TOMTOM_API_KEY
                      ? "Traffic feed returned no data"
                      : "Set TOMTOM_API_KEY to enable"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/60 shadow-sm">
            <div className="flex items-start gap-4">
              <div
                className="h-12 w-12 rounded-full bg-primary/10 text-primary
                  flex items-center justify-center"
              >
                <Clock className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p
                  className="text-xs font-bold uppercase tracking-wide
                    text-muted-foreground"
                >
                  Updated
                </p>
                <p className="text-2xl font-extrabold">
                  {new Date(weather.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  Auto-local time · Refreshes every few minutes
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function ConditionsSkeleton() {
  return (
    <div className="container py-12">
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
  );
}
