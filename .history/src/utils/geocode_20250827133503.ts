// src/utils/geocode.ts
// Client-side helper now calls our internal API route to avoid exposing provider key to the browser.

export async function geocodeAddress(address: string): Promise<[number, number] | null> {
  try {
    const res = await fetch("/api/geocode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address })
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.ok && Array.isArray(json.coords) && json.coords.length === 2) {
      return json.coords as [number, number];
    }
    return null;
  } catch (e) {
    console.error("geocodeAddress error", e);
    return null;
  }
}
