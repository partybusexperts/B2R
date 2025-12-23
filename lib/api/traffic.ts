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

export async function fetchTomTomTraffic(lat: number, lng: number) {
  const key = process.env.TOMTOM_API_KEY;
  if (!key) return null;

  const url = new URL(
    "https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/10/json",
  );
  url.searchParams.set("point", `${lat},${lng}`);
  url.searchParams.set("unit", "MPH");
  url.searchParams.set("key", key);

  try {
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
  } catch (error) {
    console.warn("⚠️ TomTom Traffic API Error:", error);
    return null;
  }
}
