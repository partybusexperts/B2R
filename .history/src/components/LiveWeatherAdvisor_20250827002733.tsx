"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/** ----------------------------------------------------------------
 * Types
 * ---------------------------------------------------------------- */
interface Place {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  country_code?: string;
  timezone?: string;
}

interface WeatherApiResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current?: {
    time: string;
    temperature_2m: number;
    apparent_temperature?: number;
    weathercode: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature?: number[];
    precipitation_probability?: number[];
    uv_index?: number[];
    wind_speed_10m?: number[];
  };
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    uv_index_max?: number[];
    sunrise?: string[];
    sunset?: string[];
    precipitation_probability_max?: number[];
    weathercode?: number[];
  };
}

interface AirQualityResponse {
  hourly?: {
    time: string[];
    us_aqi?: number[];
    pm2_5?: number[];
  };
}

interface AlertItem {
  headline: string;
  description: string;
  severity?: string;
  event?: string;
}

/** ----------------------------------------------------------------
 * Small helpers (no geolocation/IP)
 * ---------------------------------------------------------------- */
async function fetchJson(
  url: string,
  opts: RequestInit & { timeoutMs?: number } = {}
) {
  const { timeoutMs = 8000, ...rest } = opts;
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...rest, signal: ctrl.signal, cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
    return await res.json();
  } finally {
    clearTimeout(id);
  }
}

const cToF = (c: number) => (c * 9) / 5 + 32;
const mphToKmh = (mph: number) => mph * 1.60934;

const WMO_DESC: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Freezing rain (light)",
  67: "Freezing rain (heavy)",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Rain showers (slight)",
  81: "Rain showers (moderate)",
  82: "Rain showers (violent)",
  85: "Snow showers (slight)",
  86: "Snow showers (heavy)",
  95: "Thunderstorm",
  96: "Thunderstorm (slight hail)",
  99: "Thunderstorm (heavy hail)",
};

const wmoToIcon = (code: number) => {
  if ([0, 1].includes(code)) return "☀️";
  if ([2].includes(code)) return "🌤️";
  if ([3].includes(code)) return "☁️";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "🌥️";
};

function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// Tiny emoji “icons” to avoid external deps
const Icon = {
  MapPin: () => <span className="inline-block align-[-2px]">📍</span>,
  Search:  () => <span className="inline-block align-[-2px]">🔍</span>,
  Thermo:  () => <span className="inline-block align-[-2px]">🌡️</span>,
  Wind:    () => <span className="inline-block align-[-2px]">💨</span>,
  Drop:    () => <span className="inline-block align-[-2px]">💧</span>,
  Sun:     () => <span className="inline-block align-[-2px]">🌅</span>,
  Moon:    () => <span className="inline-block align-[-2px]">🌙</span>,
  Rain:    () => <span className="inline-block align-[-2px]">🌧️</span>,
  Alert:   () => <span className="inline-block align-[-2px]">⚠️</span>,
  Gauge:   () => <span className="inline-block align-[-2px]">📏</span>,
};

/** ----------------------------------------------------------------
 * Defaults (no approximate location)
 * ---------------------------------------------------------------- */
const DEFAULT_PLACE: Place = {
  name: "Anchorage, Alaska",
  latitude: 61.2181,
  longitude: -149.9003,
  country_code: "US",
};

/** ----------------------------------------------------------------
 * Component
 * ---------------------------------------------------------------- */
interface LiveWeatherAdvisorProps {
  fixedPlace?: Place; // if provided, lock to this place (no pin/search auto default switching)
  variant?: "default" | "compact"; // compact used for embedded city pages
}

const LiveWeatherAdvisor: React.FC<LiveWeatherAdvisorProps> = ({ fixedPlace, variant = "default" }) => {
  // Core state
  const [place, setPlace] = useState<Place | null>(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [wx, setWx] = useState<WeatherApiResponse | null>(null);
  const [aq, setAq] = useState<AirQualityResponse | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [unit, setUnit] = useState<"C" | "F">(
    (typeof window !== "undefined" && (localStorage.getItem("wx:unit") as "C" | "F")) || "F"
  );
  const [speedUnit, setSpeedUnit] = useState<"mph" | "km/h">(
    (typeof window !== "undefined" && (localStorage.getItem("wx:speed") as "mph" | "km/h")) || "mph"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [infoMessage, setInfoMessage] = useState<string>("");

  const debouncedQuery = useDebounced(query, 300);
  const suggestBoxRef = useRef<HTMLDivElement>(null);

  // Event selector (bottom of app)
  const EVENT_TYPES = [
    "None",
    "Concert",
    "Wedding",
    "Festival",
    "Sports game",
    "Beach day",
    "Hike",
    "Business trip",
    "Night out",
  ] as const;
  type EventType = typeof EVENT_TYPES[number];
  const [eventType, setEventType] = useState<EventType>("None");

  /** Boot: load fixedPlace or pinned or Anchorage default */
  useEffect(() => {
    const boot = async () => {
      try {
        setLoading(true);
        if (fixedPlace) {
          await loadAllForPlace(fixedPlace);
          setInfoMessage("");
          return;
        }
        const saved = typeof window !== "undefined" ? localStorage.getItem("wx:lastPlace") : null;
        if (saved) {
          const p: Place = JSON.parse(saved);
            await loadAllForPlace(p);
            setInfoMessage(`Loaded your pinned city: ${p.name}`);
            return;
        }
        await loadAllForPlace(DEFAULT_PLACE);
        setInfoMessage("Defaulting to Anchorage, AK. Search to change, then pin it.");
        if (typeof window !== "undefined") localStorage.setItem("wx:lastPlace", JSON.stringify(DEFAULT_PLACE));
      } catch {
        setError("Unable to load initial city.");
      } finally {
        setLoading(false);
      }
    };
    boot();
  }, [fixedPlace]);

  /** Search suggestions */
  useEffect(() => {
    const go = async () => {
      if (!debouncedQuery || debouncedQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          debouncedQuery
        )}&count=7&language=en&format=json`;
        const j = await fetchJson(url);
        const list: Place[] = (j.results || []).map((raw: unknown) => {
          const p = raw as Record<string, unknown>;
          const name = typeof p.name === "string" ? p.name : "";
          const admin1 = typeof p.admin1 === "string" ? p.admin1 : undefined;
            const country = typeof p.country === "string" ? p.country : undefined;
          return {
            name: [name, admin1, country].filter(Boolean).join(", "),
            latitude: Number(p.latitude),
            longitude: Number(p.longitude),
            country,
            admin1,
            country_code: typeof p.country_code === "string" ? p.country_code : undefined,
            timezone: typeof p.timezone === "string" ? p.timezone : undefined,
          };
        });
        setSuggestions(list);
      } catch {
        /* ignore */
      }
    };
    go();
  }, [debouncedQuery]);

  /** Click-away to close suggestions */
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (suggestBoxRef.current && !suggestBoxRef.current.contains(e.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  /** Fetchers */
  const fetchForecast = async (p: Place): Promise<WeatherApiResponse> => {
    const params = new URLSearchParams({
      latitude: String(p.latitude),
      longitude: String(p.longitude),
      current: "temperature_2m,apparent_temperature,weathercode,relative_humidity_2m,wind_speed_10m",
      hourly: "temperature_2m,apparent_temperature,precipitation_probability,uv_index,wind_speed_10m",
      daily: "temperature_2m_max,temperature_2m_min,uv_index_max,sunrise,sunset,precipitation_probability_max,weathercode",
      timezone: "auto",
      temperature_unit: "celsius",
      windspeed_unit: "mph",
    });
    const j = (await fetchJson(`https://api.open-meteo.com/v1/forecast?${params.toString()}`)) as WeatherApiResponse;
    return j;
  };

  const fetchAirQuality = async (p: Place): Promise<AirQualityResponse | null> => {
    try {
      const params = new URLSearchParams({
        latitude: String(p.latitude),
        longitude: String(p.longitude),
        hourly: "us_aqi,pm2_5",
        timezone: "auto",
      });
      const j = (await fetchJson(
        `https://air-quality-api.open-meteo.com/v1/air-quality?${params.toString()}`
      )) as AirQualityResponse;
      return j;
    } catch {
      return null;
    }
  };

  const fetchNwsAlerts = async (p: Place): Promise<AlertItem[]> => {
    // Only attempt NWS if US or unknown (we'll allow unknown to try)
    if (p.country_code && p.country_code !== "US") return [];
    try {
      const j = await fetchJson(`https://api.weather.gov/alerts/active?point=${p.latitude},${p.longitude}`);
      interface RawAlertFeature { properties?: Record<string, unknown>; }
      const items: AlertItem[] = (j.features || []).slice(0, 5).map((raw: unknown) => {
  const f = raw as RawAlertFeature;
  const rawProps = f.properties || {};
  const headline = (rawProps.headline as string) || (rawProps.event as string) || "Alert";
  const description = (rawProps.description as string) || "";
  const severity = rawProps.severity as string | undefined;
  const event = rawProps.event as string | undefined;
        return { headline, description, severity, event };
      });
      return items;
    } catch {
      return [];
    }
  };

  const loadAllForPlace = async (p: Place) => {
    setError("");
    setLoading(true);
    try {
      const [forecast, airq, usAlerts] = await Promise.all([fetchForecast(p), fetchAirQuality(p), fetchNwsAlerts(p)]);
      setPlace(p);
      setWx(forecast);
      setAq(airq);
      setAlerts(usAlerts);
      if (typeof window !== "undefined") localStorage.setItem("wx:lastPlace", JSON.stringify(p));
    } catch {
      setError("Failed to fetch weather data. Try another location.");
    } finally {
      setLoading(false);
    }
  };

  /** Derived data */
  const tz = wx?.timezone || undefined;
  const fmtDate = (iso: string, opts: Intl.DateTimeFormatOptions = {}) =>
    new Intl.DateTimeFormat(undefined, { timeZone: tz, ...opts }).format(new Date(iso));

  const nowBlock = wx?.current;
  const currentTemp = nowBlock?.temperature_2m ?? undefined;
  const currentApparent = nowBlock?.apparent_temperature ?? undefined;
  const currentWind = nowBlock?.wind_speed_10m ?? undefined;
  const currentHumidity = nowBlock?.relative_humidity_2m ?? undefined;
  const currentCode = nowBlock?.weathercode ?? 0;

  // Capture stable mount timestamp to avoid SSR/client mismatch from Date.now during hydration.
  const [mountNow, setMountNow] = useState<number | null>(null);
  useEffect(()=> { setMountNow(Date.now()); }, []);

  const next12 = useMemo(() => {
    if (!wx?.hourly?.time?.length) return [] as { t: string; temp: number; pop?: number }[];
    const nowRef = mountNow ?? Date.now(); // during SSR mountNow is null; we fallback but only affects client after mount
    const items: { t: string; temp: number; pop?: number }[] = [];
    for (let i = 0; i < wx.hourly.time.length; i++) {
      const ts = new Date(wx.hourly.time[i]).getTime();
      if (ts >= nowRef && items.length < 12) {
        items.push({
          t: wx.hourly.time[i],
          temp: wx.hourly.temperature_2m?.[i] ?? NaN,
          pop: wx.hourly.precipitation_probability?.[i],
        });
      }
    }
    return items;
  }, [wx?.hourly, mountNow]);

  const pm25Now = useMemo(() => {
    if (!aq?.hourly?.time?.length || !aq.hourly.pm2_5) return undefined as number | undefined;
    const nowRef = mountNow ?? Date.now();
    let idx = 0;
    for (let i = 0; i < aq.hourly.time.length; i++) {
      const ts = new Date(aq.hourly.time[i]).getTime();
      if (ts >= nowRef) {
        idx = i;
        break;
      }
    }
    return aq.hourly.pm2_5?.[idx];
  }, [aq, mountNow]);

  const aqiNow = useMemo(() => {
    if (!aq?.hourly?.time?.length || !aq.hourly.us_aqi) return undefined as number | undefined;
    const nowRef = mountNow ?? Date.now();
    let idx = 0;
    for (let i = 0; i < aq.hourly.time.length; i++) {
      const ts = new Date(aq.hourly.time[i]).getTime();
      if (ts >= nowRef) {
        idx = i;
        break;
      }
    }
    return aq.hourly.us_aqi?.[idx];
  }, [aq, mountNow]);

  const showTemp = (c: number | undefined) => {
    if (typeof c !== "number" || Number.isNaN(c)) return "–";
    return unit === "F" ? `${Math.round(cToF(c))}°F` : `${Math.round(c)}°C`;
  };

  const showSpeed = (mph?: number) => {
    if (typeof mph !== "number") return "–";
    return speedUnit === "mph" ? `${Math.round(mph)} mph` : `${Math.round(mphToKmh(mph))} km/h`;
  };

  /** Weather-aware tips + event checklist */
  const packingTips = useMemo(() => {
    const tips: string[] = [];
    if (typeof currentTemp === "number") {
      if (currentTemp <= -5) tips.push("Heavy parka, thermal base layers, insulated boots.");
      else if (currentTemp <= 5) tips.push("Winter coat, hat, gloves, warm socks.");
      else if (currentTemp <= 15) tips.push("Light jacket/hoodie; jeans; closed shoes.");
      else if (currentTemp <= 25) tips.push("T-shirt + light layers; breathable fabrics.");
      else tips.push("Tank/tee, shorts, hydrate often.");
    }
    if ((wx?.hourly?.precipitation_probability?.[0] ?? 0) >= 40) tips.push("Carry umbrella/rain shell.");
    if ((currentWind ?? 0) >= 20) tips.push("Wind-resistant jacket; secure loose items.");
    if ((wx?.daily?.uv_index_max?.[0] ?? 0) >= 6) tips.push("High UV: sunscreen, hat, sunglasses.");
    if ((aqiNow ?? 0) >= 101) tips.push("Air quality caution: limit strenuous outdoor activity.");
    return tips;
  }, [currentTemp, currentWind, wx?.hourly?.precipitation_probability, wx?.daily?.uv_index_max, aqiNow]);

  const eventChecklist = useMemo(() => {
    const base: string[] = [];
    switch (eventType) {
      case "Concert":
        base.push(
          "Tickets/QR codes ready",
          "Portable battery + charging cable",
          "Comfortable shoes (standing)",
          "Ear protection",
          "Clear bag policy? (check venue)",
          "Cashless payment method"
        );
        break;
      case "Wedding":
        base.push(
          "Gift/envelope and card",
          "Dress code outfit + comfortable backup shoes",
          "Itinerary/address + parking plan",
          "Touch-up kit (mints, tissues)",
          "Photos: phone storage freed up"
        );
        break;
      case "Festival":
        base.push(
          "Hydration pack/water bottle",
          "Sun protection (hat, sunscreen)",
          "Cashless band/app set-up",
          "Portable battery",
          "Small blanket/poncho"
        );
        break;
      case "Sports game":
        base.push("Tickets + team colors/jersey", "Stadium bag policy compliance", "Layered clothing (temp swings)", "Portable battery");
        break;
      case "Beach day":
        base.push("Swimwear, towel, flip-flops", "Reef-safe sunscreen", "Shade (umbrella/hat)", "Cooler with water/snacks");
        break;
      case "Hike":
        base.push("Proper footwear + socks", "Water (0.5–1L per hour)", "Trail map/offline nav", "First-aid + blister kit", "Snacks/electrolytes");
        break;
      case "Business trip":
        base.push("Laptop + charger + hotspot", "IDs, wallet, travel docs", "Agenda + meeting addresses", "Backup outfit/shoes");
        break;
      case "Night out":
        base.push("ID + payment", "Charged phone + ride plan", "Comfortable shoes", "Jacket/layers (late night temps)");
        break;
      default:
        return base;
    }
    // Weather-aware tweaks
    if ((wx?.hourly?.precipitation_probability?.[0] ?? 0) >= 40) base.push("Rain layer/poncho");
    if ((wx?.daily?.uv_index_max?.[0] ?? 0) >= 6) base.push("Extra sunscreen");
    if ((currentWind ?? 0) >= 20) base.push("Windbreaker");
    if (typeof currentTemp === "number" && currentTemp < 5) base.push("Warm layers/beanie");
    if (typeof currentTemp === "number" && currentTemp > 28) base.push("Extra water/electrolytes");
    return Array.from(new Set(base));
  }, [eventType, wx?.hourly?.precipitation_probability, wx?.daily?.uv_index_max, currentWind, currentTemp]);

  /** Simple temp sparkline (inline SVG) */
  const TempSparkline: React.FC<{ values: number[] }> = ({ values }) => {
    if (!values.length) return null;
    const width = 320;
    const height = 100;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const pad = 6;
    const pts = values.map((v, i) => {
      const x = (i / Math.max(1, values.length - 1)) * (width - pad * 2) + pad;
      const y = height - pad - ((v - min) / Math.max(1, max - min)) * (height - pad * 2);
      return `${x},${y}`;
    });
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24">
        <polyline fill="none" stroke="currentColor" strokeWidth="2" points={pts.join(" ")} className="text-sky-700" />
      </svg>
    );
  };

  /** UI */
  const rootClass =
    variant === "compact"
      ? "w-full p-4 bg-gradient-to-br from-sky-100 to-sky-200 rounded-2xl text-gray-900 text-[13px]"
      : "max-w-7xl mx-auto p-6 md:p-8 bg-gradient-to-b from-sky-100 to-sky-300 min-h-screen text-gray-900";

  return (
    <div className={rootClass}>
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className={variant === "compact" ? "text-xl font-bold text-sky-950" : "text-3xl md:text-4xl font-bold text-sky-950 drop-shadow-sm"}>
            Live Weather{variant === "compact" ? "" : " Advisor"}
            {place ? ` — ${place.name}` : ""}
          </h1>
          {wx?.daily?.sunrise?.[0] && wx?.daily?.sunset?.[0] && (
            <p className={variant === "compact" ? "text-sky-900 mt-0.5 text-xs" : "text-sky-900 mt-1 font-medium"}>
              <span className="inline-flex items-center gap-1 mr-3">
                <Icon.Sun /> {fmtDate(wx.daily.sunrise[0], { hour: "numeric", minute: "2-digit" })}
              </span>
              <span className="inline-flex items-center gap-1">
                <Icon.Moon /> {fmtDate(wx.daily.sunset[0], { hour: "numeric", minute: "2-digit" })}
              </span>
            </p>
          )}
        </div>
        {variant !== "compact" && (
          <HeaderControls
            query={query}
            setQuery={setQuery}
            suggestions={suggestions}
            onChoose={(p) => {
              setQuery("");
              setSuggestions([]);
              loadAllForPlace(p);
            }}
            suggestBoxRef={suggestBoxRef}
            unit={unit}
            setUnit={(u) => {
              setUnit(u);
              if (typeof window !== "undefined") localStorage.setItem("wx:unit", u);
            }}
            speedUnit={speedUnit}
            setSpeedUnit={(s) => {
              setSpeedUnit(s);
              if (typeof window !== "undefined") localStorage.setItem("wx:speed", s);
            }}
            pinCurrentCity={() => {
              if (place && typeof window !== "undefined") {
                localStorage.setItem("wx:lastPlace", JSON.stringify(place));
                alert(`${place.name} pinned as your default.`);
              }
            }}
          />
        )}
      </div>

      {/* Info / Error */}
      {variant !== "compact" && infoMessage && (
        <div className="mt-3 bg-amber-50 border border-amber-300 text-amber-900 px-4 py-2 rounded-xl">{infoMessage}</div>
      )}
      {loading && <div className="mt-8 text-center text-gray-800 animate-pulse">Loading weather data…</div>}
      {error && (
        <div className="mt-6 bg-rose-50 text-rose-800 border border-rose-200 px-4 py-3 rounded-xl flex items-center gap-2">
          <span>
            <Icon.Alert />
          </span>
          {error}
        </div>
      )}

      {/* Content */}
      {wx && !loading && !error && (
  <div className={variant === "compact" ? "mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3" : "mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"}>
          {/* Current */}
          <div className="bg-white text-gray-900 rounded-2xl shadow p-4 md:col-span-1 border border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-sky-900">Now</h2>
              <div className="text-3xl" title={WMO_DESC[currentCode] || ""}>
                {wmoToIcon(currentCode)}
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-gray-900">
              <div className="flex items-center gap-2">
                <Icon.Thermo /> <span className="font-medium">{showTemp(currentTemp)}</span>
              </div>
              {typeof currentApparent === "number" && (
                <div className="flex items-center gap-2">
                  <Icon.Gauge /> Feels {showTemp(currentApparent)}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Icon.Wind /> {showSpeed(currentWind)}
              </div>
              {typeof currentHumidity === "number" && (
                <div className="flex items-center gap-2">
                  <Icon.Drop /> {Math.round(currentHumidity)}%
                </div>
              )}
              {typeof aqiNow === "number" && (
                <div className="col-span-2 text-sm mt-1">
                  AQI: <span className="font-medium">{Math.round(aqiNow)}</span>
                  {typeof pm25Now === "number" ? ` · PM2.5 ${Math.round(pm25Now)} µg/m³` : ""}
                </div>
              )}
            </div>
            {wx.daily?.precipitation_probability_max?.[0] != null && (
              <p className="mt-2 text-sm text-gray-700">
                Chance of precip today: {wx.daily.precipitation_probability_max[0]}%
              </p>
            )}
          </div>

          {/* Tips */}
          <div className="bg-white text-gray-900 rounded-2xl shadow p-4 border border-gray-200">
            <h2 className="text-lg font-semibold text-sky-900">Packing & Activity Tips</h2>
            <ul className="mt-2 list-disc list-inside text-sm space-y-1">
              {packingTips.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>

          {/* Alerts */}
          <div className="bg-white text-gray-900 rounded-2xl shadow p-4 border border-gray-200">
            <h2 className="text-lg font-semibold text-sky-900 flex items-center gap-2">
              <Icon.Alert /> Weather Alerts
            </h2>
            {alerts.length === 0 ? (
              <p className="mt-2 text-sm text-gray-700">No active alerts for this area.</p>
            ) : (
              <div className="mt-2 space-y-2 max-h-60 overflow-auto pr-1">
                {alerts.map((a, i) => (
                  <div key={i} className="border border-amber-200 bg-amber-50 rounded-xl p-2">
                    <p className="font-medium text-amber-900">{a.headline}</p>
                    <p className="text-amber-900/80 text-sm whitespace-pre-wrap">
                      {a.description?.slice(0, 280)}
                      {a.description && a.description.length > 280 ? "…" : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 12h forecast */}
          <div className={variant === "compact" ? "bg-white text-gray-900 rounded-2xl shadow p-3 sm:col-span-2 border border-gray-200" : "bg-white text-gray-900 rounded-2xl shadow p-4 md:col-span-2 border border-gray-200"}>
            <h2 className="text-lg font-semibold text-sky-900">Next 12 Hours</h2>
            <div className="mt-3 grid md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <TempSparkline values={next12.map((h) => h.temp)} />
              </div>
              <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                {next12.map((h, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 p-2">
                    <div className="text-xs text-gray-600">{fmtDate(h.t, { hour: "numeric" })}</div>
                    <div className="font-medium">{showTemp(h.temp)}</div>
                    {typeof h.pop === "number" && (
                      <div className="text-xs inline-flex items-center gap-1 text-sky-800">
                        <Icon.Rain /> {h.pop}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5-day forecast */}
          {wx.daily?.time && (
            <div className={variant === "compact" ? "bg-white text-gray-900 rounded-2xl shadow p-3 border border-gray-200" : "bg-white text-gray-900 rounded-2xl shadow p-4 xl:col-span-1 border border-gray-200"}>
              <h2 className="text-lg font-semibold text-sky-900">5-Day Forecast</h2>
              <div className="mt-2 divide-y divide-gray-200">
                {wx.daily.time.slice(0, 5).map((d, i) => (
                  <div key={d} className="py-2 flex items-center justify-between">
                    <div className="w-28 text-gray-800">
                      {fmtDate(d, { weekday: "short", month: "short", day: "numeric" })}
                    </div>
                    <div className="text-lg" title={WMO_DESC[wx.daily?.weathercode?.[i] ?? 0] || ""}>
                      {wmoToIcon(wx.daily?.weathercode?.[i] ?? 0)}
                    </div>
                    <div className="w-40 text-right">
                      <span className="font-semibold">{showTemp(wx.daily.temperature_2m_max[i])}</span>
                      <span className="text-gray-600"> / {showTemp(wx.daily.temperature_2m_min[i])}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom: Plan & Pack Assistant */}
          {variant !== "compact" && (
          <div className="bg-white text-gray-900 rounded-2xl shadow p-4 border border-gray-200 md:col-span-2 xl:col-span-3">
            <div className="grid gap-2 md:grid-cols-3 md:gap-4 items-end">
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold text-sky-900 flex items-center gap-2">
                  Plan & Pack Assistant
                  <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                    new
                  </span>
                </h2>
                <p className="text-sm text-gray-700">
                  Pick an event. We tailor a checklist using the current forecast for {place?.name || "your area"}.
                </p>
              </div>
              <div className="md:justify-self-end">
                <label className="text-sm block text-gray-800 mb-1">Event type</label>
                <select
                  aria-label="Select event type to customize checklist"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as EventType)}
                  className="px-3 py-2 rounded-xl bg-white border border-gray-400 shadow text-gray-900 w-full md:w-56"
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t === "None" ? "— Choose an event —" : t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-3">
              {eventType === "None" ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-3 text-sm text-gray-700">
                  Select an event above to see a smart, weather-aware packing list here. Example items: tickets, layers
                  for temp swings, rain shell if showers expected, sunscreen on high-UV days.
                </div>
              ) : (
                <ul className="list-disc list-inside text-sm space-y-1">
                  {eventChecklist.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          )}
        </div>
      )}
    </div>
  );
};

/** Header controls (no Approximate/GPS buttons) */
function HeaderControls(props: {
  query: string;
  setQuery: (v: string) => void;
  suggestions: Place[];
  onChoose: (p: Place) => void;
  suggestBoxRef: React.RefObject<HTMLDivElement>;
  unit: "C" | "F";
  setUnit: (u: "C" | "F") => void;
  speedUnit: "mph" | "km/h";
  setSpeedUnit: (s: "mph" | "km/h") => void;
  pinCurrentCity: () => void;
}) {
  const {
    query,
    setQuery,
    suggestions,
    onChoose,
    suggestBoxRef,
    unit,
    setUnit,
    speedUnit,
    setSpeedUnit,
    pinCurrentCity,
  } = props;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative" ref={suggestBoxRef}>
        <div className="flex items-center border border-gray-400 rounded-xl bg-white shadow overflow-hidden">
          <span className="mx-2 text-gray-700">
            <Icon.Search />
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city, state, or country"
            className="px-2 py-2 w-64 md:w-80 outline-none text-gray-900 placeholder-gray-500"
          />
          {query && (
            <button className="px-3 text-sm text-gray-700 hover:text-gray-900" onClick={() => setQuery("")}>
              Clear
            </button>
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-300 overflow-hidden text-gray-900">
            {suggestions.map((s, i) => (
              <button
                key={`${s.latitude}-${s.longitude}-${i}`}
                onClick={() => onChoose(s)}
                className="w-full text-left px-3 py-2 hover:bg-sky-100 flex items-center gap-2"
              >
                <span className="text-sky-700">
                  <Icon.MapPin />
                </span>
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={pinCurrentCity}
        className="px-3 py-2 rounded-xl bg-white border border-gray-400 shadow hover:bg-gray-50 text-gray-900"
      >
        Pin this city
      </button>

      <button
        onClick={() => setUnit(unit === "C" ? "F" : "C")}
        className="px-3 py-2 rounded-xl bg-gray-100 border border-gray-400 shadow hover:bg-gray-200 text-gray-900"
      >
        Switch to °{unit === "C" ? "F" : "C"}
      </button>
      <button
        onClick={() => setSpeedUnit(speedUnit === "mph" ? "km/h" : "mph")}
        className="px-3 py-2 rounded-xl bg-gray-100 border border-gray-400 shadow hover:bg-gray-200 text-gray-900"
      >
        Wind: {speedUnit === "mph" ? "mph" : "km/h"}
      </button>
    </div>
  );
}

export default LiveWeatherAdvisor;










