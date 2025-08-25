"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

// Helpers: robust fetch and IP location providers
async function fetchJson(url: string, opts: RequestInit & { timeoutMs?: number } = {}) {
  const { timeoutMs = 8000, ...rest } = opts;
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const noCacheUrl = url + (url.includes('?') ? '&' : '?') + 'r=' + Math.random().toString(36).slice(2);
    const res = await fetch(noCacheUrl, { ...rest, signal: ctrl.signal, cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
    return await res.json();
  } finally {
    clearTimeout(id);
  }
} = opts;
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...rest, signal: ctrl.signal, cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
    return await res.json();
  } finally {
    clearTimeout(id);
  }
}

async function getApproxIPLocation(): Promise<{ lat: number; lon: number; label: string } | null> {
  // 1) ipwho.is (no key, good CORS)
  try {
    const j = await fetchJson('https://ipwho.is/?fields=latitude,longitude,city,region,country_code');
    if ((j?.latitude || j?.lat) && (j?.longitude || j?.lon)) {
      const lat = j.latitude ?? j.lat; const lon = j.longitude ?? j.lon;
      const label = [j.city, j.region].filter(Boolean).join(', ');
      return { lat, lon, label };
    }
  } catch {}
  // 2) ipapi.co
  try {
    const j = await fetchJson('https://ipapi.co/json/');
    if (j?.latitude && j?.longitude) {
      const label = [j.city, j.region].filter(Boolean).join(', ');
      return { lat: j.latitude, lon: j.longitude, label };
    }
  } catch {}
  // 3) ipapi.dev (community mirror)
  try {
    const j = await fetchJson('https://ipapi.dev/json/');
    if (j?.latitude && j?.longitude) {
      const label = [j.city, j.region].filter(Boolean).join(', ');
      return { lat: j.latitude, lon: j.longitude, label };
    }
  } catch {}
  // 4) geojs.io
  try {
    const j = await fetchJson('https://get.geojs.io/v1/ip/geo.json');
    if (j?.latitude && j?.longitude) {
      const label = [j.city, j.region].filter(Boolean).join(', ');
      return { lat: parseFloat(j.latitude), lon: parseFloat(j.longitude), label };
    }
  } catch {}
  return null;
}

// Emoji icons (no external deps)
const Icon = {
  MapPin: () => <span className="inline-block align-[-2px]">📍</span>,
  Locate: () => <span className="inline-block align-[-2px]">📡</span>,
  SearchIcon: () => <span className="inline-block align-[-2px]">🔍</span>,
  Thermometer: () => <span className="inline-block align-[-2px]">🌡️</span>,
  Wind: () => <span className="inline-block align-[-2px]">💨</span>,
  Droplets: () => <span className="inline-block align-[-2px]">💧</span>,
  Sun: () => <span className="inline-block align-[-2px]">🌅</span>,
  Moon: () => <span className="inline-block align-[-2px]">🌙</span>,
  CloudRain: () => <span className="inline-block align-[-2px]">🌧️</span>,
  AlertTriangle: () => <span className="inline-block align-[-2px]">⚠️</span>,
  Gauge: () => <span className="inline-block align-[-2px]">📏</span>,
};

// ===== Types =====
interface Place {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  country_code?: string;
  timezone?: string;
}

// ===== Component =====
const LiveWeatherAdvisor: React.FC = () => {
  const [place, setPlace] = useState<Place | null>(null);
  const [geoMessage, setGeoMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // ===== Approximate location (works on HTTP) =====
  const useApproxLocation = async () => {
    try {
      setLoading(true);
      setGeoMessage('Finding approximate location…');
      const hit = await getApproxIPLocation();
      if (hit) {
        const p = await reverseGeocode({ latitude: hit.lat, longitude: hit.lon });
        await loadAllForPlace(p);
        setGeoMessage(`Approximate location set${hit.label ? `: ${hit.label}` : ''}.`);
      } else {
        setGeoMessage('Could not determine location from IP. Some networks/ad-blockers block geo APIs. You can still search above or pin a city.');
        if (!place) {
          const fallback = await geocodeOne('Wheaton, Illinois');
          await loadAllForPlace(fallback);
          setGeoMessage('Could not determine location from IP. Loaded Wheaton, IL as a temporary fallback.');
        }
      }
    } catch (e) {
      if (!place) {
        const fallback = await geocodeOne('Wheaton, Illinois');
        await loadAllForPlace(fallback);
        setGeoMessage('Network issue getting IP location. Loaded Wheaton, IL as a temporary fallback.');
      } else {
        setGeoMessage('Network issue getting IP location. Try again, disable ad-block for this page, or search above.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    useApproxLocation();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-b from-sky-100 to-sky-300 min-h-screen text-gray-900">
      <h1 className="text-2xl font-bold text-sky-950 mb-4">Live Weather Advisor (Simplified)</h1>
      <button
        onClick={useApproxLocation}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-sky-700 text-white hover:bg-sky-800 shadow"
      >
        <Icon.Locate /> Use approximate location
      </button>
      {geoMessage && (
        <div className="mt-3 bg-amber-50 border border-amber-300 text-amber-900 px-4 py-2 rounded-xl">
          {geoMessage}
        </div>
      )}
      {loading && <p className="mt-4">Loading…</p>}
      {place && !loading && (
        <div className="mt-6 bg-white rounded-xl shadow p-4">
          <p className="font-medium">Location: {place.name}</p>
          <p className="text-sm text-gray-700">Lat {place.latitude}, Lon {place.longitude}</p>
        </div>
      )}
    </div>
  );
};

export default LiveWeatherAdvisor;









