// src/utils/geocode.ts
// Free address-to-coordinates lookup using OpenRouteService geocoding API

const ORS_GEOCODE_ENDPOINT = "https://api.openrouteservice.org/geocode/search";
const ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImI3MmI2M2Y5YzU4YjQxM2Q4ZTZhZTg1MTM0NmU1YTdkIiwiaCI6Im11cm11cjY0In0="; // USER KEY

export async function geocodeAddress(address: string): Promise<[number, number] | null> {
  const url = `${ORS_GEOCODE_ENDPOINT}?api_key=${ORS_API_KEY}&text=${encodeURIComponent(address)}&size=1`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  if (
    data &&
    data.features &&
    data.features.length > 0 &&
    data.features[0].geometry &&
    Array.isArray(data.features[0].geometry.coordinates)
  ) {
    // [lon, lat]
    return data.features[0].geometry.coordinates;
  }
  return null;
}
