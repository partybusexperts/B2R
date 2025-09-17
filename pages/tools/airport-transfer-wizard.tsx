"use client";
import React, { useEffect, useMemo, useState } from "react";

/* ============================== Types ============================== */
type Airport = { iata: string; name: string; lat: number; lon: number };
type FlightType = "Arrival" | "Departure";
type PickupMode = "geo" | "manualMiles";

/* ====================== Built-in U.S. Airports ======================
   Major commercial airports including AK / HI / PR.
   (Extend this list any time by adding { iata, name, lat, lon } entries.)
*/
const AIRPORTS: Airport[] = [
  // --- National hubs / large ---
  { iata: "ATL", name: "Atlanta Hartsfield–Jackson", lat: 33.6407, lon: -84.4277 },
  { iata: "LAX", name: "Los Angeles Intl",           lat: 33.9416, lon: -118.4085 },
  { iata: "ORD", name: "Chicago O'Hare Intl",        lat: 41.9742, lon: -87.9073 },
  { iata: "DFW", name: "Dallas/Fort Worth Intl",     lat: 32.8998, lon: -97.0403 },
  { iata: "DEN", name: "Denver Intl",                lat: 39.8561, lon: -104.6737 },
  { iata: "JFK", name: "New York JFK",               lat: 40.6413, lon: -73.7781 },
  { iata: "SFO", name: "San Francisco Intl",         lat: 37.6213, lon: -122.3790 },
  { iata: "LAS", name: "Las Vegas Harry Reid",       lat: 36.0840, lon: -115.1537 },
  { iata: "SEA", name: "Seattle–Tacoma Intl",        lat: 47.4502, lon: -122.3088 },
  { iata: "MCO", name: "Orlando Intl",               lat: 28.4312, lon: -81.3081 },
  { iata: "MIA", name: "Miami Intl",                 lat: 25.7959, lon: -80.2871 },
  { iata: "CLT", name: "Charlotte Douglas Intl",     lat: 35.2144, lon: -80.9473 },
  { iata: "PHX", name: "Phoenix Sky Harbor Intl",    lat: 33.4373, lon: -112.0078 },
  { iata: "IAH", name: "Houston Intercontinental",   lat: 29.9902, lon: -95.3368 },
  { iata: "BOS", name: "Boston Logan Intl",          lat: 42.3656, lon: -71.0096 },
  { iata: "EWR", name: "Newark Liberty Intl",        lat: 40.6895, lon: -74.1745 },
  { iata: "SLC", name: "Salt Lake City Intl",        lat: 40.7884, lon: -111.9778 },
  { iata: "DTW", name: "Detroit Metro",              lat: 42.2162, lon: -83.3554 },
  { iata: "MSP", name: "Minneapolis–St Paul Intl",   lat: 44.8848, lon: -93.2223 },
  { iata: "TPA", name: "Tampa Intl",                 lat: 27.9755, lon: -82.5332 },
  { iata: "SAN", name: "San Diego Intl",             lat: 32.7338, lon: -117.1933 },
  { iata: "PHL", name: "Philadelphia Intl",          lat: 39.8744, lon: -75.2424 },
  { iata: "BWI", name: "Baltimore/Washington",       lat: 39.1754, lon: -76.6684 },
  { iata: "IAD", name: "Washington Dulles",          lat: 38.9531, lon: -77.4565 },
  { iata: "DCA", name: "Washington Reagan National", lat: 38.8521, lon: -77.0377 },
  { iata: "MDW", name: "Chicago Midway",             lat: 41.7868, lon: -87.7522 },
  { iata: "HOU", name: "Houston Hobby",              lat: 29.6454, lon: -95.2789 },
  { iata: "AUS", name: "Austin–Bergstrom",           lat: 30.2020, lon: -97.6654 },
  { iata: "FLL", name: "Fort Lauderdale–Hollywood",  lat: 26.0726, lon: -80.1527 },
  { iata: "SJC", name: "San José Mineta",            lat: 37.3639, lon: -121.9289 },
  { iata: "RDU", name: "Raleigh–Durham",             lat: 35.8776, lon: -78.7875 },
  { iata: "STL", name: "St. Louis Lambert",          lat: 38.7487, lon: -90.3700 },
  { iata: "BNA", name: "Nashville Intl",             lat: 36.1263, lon: -86.6774 },
  { iata: "CLE", name: "Cleveland Hopkins",          lat: 41.4117, lon: -81.8498 },
  { iata: "CMH", name: "Columbus (John Glenn)",      lat: 39.9979, lon: -82.8910 },
  { iata: "SMF", name: "Sacramento Intl",            lat: 38.6954, lon: -121.5908 },
  { iata: "PDX", name: "Portland Intl",              lat: 45.5898, lon: -122.5951 },
  { iata: "SNA", name: "Orange Cnty (John Wayne)",   lat: 33.6762, lon: -117.8675 },
  { iata: "HNL", name: "Honolulu Intl (HI)",         lat: 21.3245, lon: -157.9251 },
  { iata: "OGG", name: "Kahului (HI)",               lat: 20.8987, lon: -156.4305 },
  { iata: "LIH", name: "Lihue (HI)",                 lat: 21.9750, lon: -159.3390 },
  { iata: "KOA", name: "Kona Intl (HI)",             lat: 19.7388, lon: -156.0456 },
  { iata: "ITO", name: "Hilo Intl (HI)",             lat: 19.7214, lon: -155.0485 },
  { iata: "ANC", name: "Anchorage Ted Stevens (AK)", lat: 61.1743, lon: -149.9982 },
  { iata: "FAI", name: "Fairbanks (AK)",             lat: 64.8184, lon: -147.8560 },
  { iata: "JNU", name: "Juneau (AK)",                lat: 58.3550, lon: -134.5763 },
  { iata: "SJU", name: "San Juan Luis Muñoz Marín (PR)", lat: 18.4394, lon: -66.0018 },
  // --- Add more regionals as needed ---
  { iata: "MKE", name: "Milwaukee (Mitchell)",       lat: 42.9472, lon: -87.8966 },
  { iata: "PIT", name: "Pittsburgh Intl",            lat: 40.4915, lon: -80.2329 },
  { iata: "RSW", name: "SW Florida (Fort Myers)",    lat: 26.5362, lon: -81.7552 },
  { iata: "SAT", name: "San Antonio Intl",           lat: 29.5337, lon: -98.4698 },
  { iata: "MSY", name: "New Orleans (MSY)",          lat: 29.9934, lon: -90.2580 },
  { iata: "SDF", name: "Louisville (SDF)",           lat: 38.1744, lon: -85.7360 },
  { iata: "CVG", name: "Cincinnati/N Kentucky",      lat: 39.0488, lon: -84.6678 },
  { iata: "IND", name: "Indianapolis Intl",          lat: 39.7173, lon: -86.2944 },
  { iata: "OMA", name: "Omaha (Eppley)",             lat: 41.3032, lon: -95.8941 },
  { iata: "OKC", name: "Oklahoma City (Will Rogers)",lat: 35.3931, lon: -97.6007 },
  { iata: "TUL", name: "Tulsa Intl",                 lat: 36.2007, lon: -95.8881 },
  { iata: "ABQ", name: "Albuquerque Sunport",        lat: 35.0496, lon: -106.6172 },
  { iata: "ELP", name: "El Paso Intl",               lat: 31.7983, lon: -106.3960 },
  { iata: "BOI", name: "Boise (BOI)",                lat: 43.5644, lon: -116.2228 },
  { iata: "GEG", name: "Spokane (GEG)",              lat: 47.6205, lon: -117.5339 },
  { iata: "RNO", name: "Reno–Tahoe",                 lat: 39.4986, lon: -119.7681 },
  { iata: "TUS", name: "Tucson Intl",                lat: 32.1161, lon: -110.9410 },
  { iata: "ONT", name: "Ontario (CA)",               lat: 34.0560, lon: -117.6012 },
  { iata: "OAK", name: "Oakland Intl",               lat: 37.7126, lon: -122.2197 },
  { iata: "HNL", name: "Honolulu Intl (HI)",         lat: 21.3245, lon: -157.9251 },
];

/* =========================== USA guard ============================== */
function isInUSA(lat: number, lon: number) {
  const inCONUS = lat >= 24.4 && lat <= 49.5 && lon >= -125.0 && lon <= -66.9;
  const inAK = lat >= 51.2 && lat <= 71.5 && lon >= -170.0 && lon <= -130.0;
  const inHI = lat >= 18.5 && lat <= 22.5 && lon >= -160.5 && lon <= -154.5;
  const inPR = lat >= 17.7 && lat <= 18.6 && lon >= -67.4 && lon <= -65.2;
  return inCONUS || inAK || inHI || inPR;
}

/* ============================ Helpers ============================== */
function toRad(d: number) { return (d * Math.PI) / 180; }
function haversineMiles(a:{lat:number;lon:number}, b:{lat:number;lon:number}) {
  const Rmi = 3958.8;
  const dLat = toRad(b.lat - a.lat), dLon = toRad(b.lon - a.lon);
  const s1 = Math.sin(dLat/2)**2;
  const s2 = Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLon/2)**2;
  return 2 * Rmi * Math.asin(Math.sqrt(s1 + s2));
}
function round(n:number,p=1){const m=10**p;return Math.round(n*m)/m;}
function fmtDateFromHHMM(hhmm: string) {
  const now = new Date();
  const [hh, mm] = (hhmm || "").split(":").map(Number);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  const d = new Date(now);
  d.setHours(hh || 0, mm || 0, 0, 0);
  if (d.getTime() <= now.getTime()) d.setDate(d.getDate() + 1);
  return d;
}
function fmtClock(d: Date) {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
}
/** Drive time heuristic: ~40 mph + 3 min curb buffer; min 8 min. */
function estimateDriveMins(miles: number) {
  if (miles <= 0.15) return 6;
  const mph = 40;
  return Math.max(8, Math.round((miles / mph) * 60 + 3));
}
type VehicleInfo = { label: string; luggage: string; caveat?: string };
function pickVehicle(pax: number, bags: number): VehicleInfo {
  let label = "Sedan";
  if (pax <= 3 && bags <= 3) label = "Sedan";
  else if (pax <= 6 && bags <= 6) label = "SUV";
  else if (pax <= 10) label = "Van";
  else if (pax <= 14) label = "Sprinter Van";
  else if (pax <= 20) label = "Shuttle Bus";
  else if (pax <= 30) label = "Mini Coach";
  else label = "Coach Bus";
  let luggage = "Sedan: ~3 standard bags comfortably.";
  if (label === "SUV") luggage = "SUV: ~6 standard bags comfortably.";
  if (label === "Van") luggage = "Van: small groups with multiple bags.";
  if (label === "Sprinter Van") luggage = "Sprinter: seats ~10–14; limited dedicated luggage space.";
  if (label === "Shuttle Bus") luggage = "Shuttle: limited racks; plan conservatively.";
  if (label === "Mini Coach") luggage = "Mini coach: some under/overhead storage; confirm capacity.";
  if (label === "Coach Bus") luggage = "Coach bus: large undercarriage storage for many bags.";
  const caveat = "Party buses usually have no luggage storage — plan roughly 1 bag = 1 seat.";
  return { label, luggage, caveat };
}

/* ============================ Component ============================ */
export default function AirportTransferWizard() {
  // Steps
  const [step, setStep] = useState<1|2|3|4>(1);

  // Inputs
  const [airportIata, setAirportIata] = useState<string>("PHX");
  const [pickupMode, setPickupMode] = useState<PickupMode>("manualMiles");
  const [manualMiles, setManualMiles] = useState<string>("10");
  const [lat, setLat] = useState<number | undefined>();
  const [lon, setLon] = useState<number | undefined>();

  const [flightType, setFlightType] = useState<FlightType>("Arrival");
  const [timeHHMM, setTimeHHMM] = useState<string>("");

  const [passengers, setPassengers] = useState<string>("2");
  const [bags, setBags] = useState<string>("2");
  const [terminals, setTerminals] = useState<string>("1");

  // State
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usaBlocked, setUsaBlocked] = useState<boolean>(false);

  // Summary
  const [summary, setSummary] = useState<null | {
    leaveAt: Date; arriveAt: Date; miles: number; driveMins: number; text: string; why: string; vehicle: VehicleInfo;
    userPin?: {lat:number;lon:number};
  }>(null);

  const airport = useMemo(
    () => AIRPORTS.find(a => a.iata === airportIata) || AIRPORTS[0],
    [airportIata]
  );
  const progress = ((step-1)/3)*100;

  /* ---- layout styles ---- */
  const pageWrap: React.CSSProperties = { minHeight:"100vh", background:"#f8fafc", display:"flex", alignItems:"center", justifyContent:"center", padding:24 };
  const card: React.CSSProperties = { width:"100%", maxWidth:900, background:"#fff", borderRadius:16, border:"1px solid #e5e7eb", boxShadow:"0 10px 30px rgba(0,0,0,.06)", padding:24 };
  const grid = (cols=1): React.CSSProperties => ({ display:"grid", gap:12, gridTemplateColumns:"1fr" });
  const css = `
    @media (min-width: 900px) { .g2{grid-template-columns:1fr 1fr} .g3{grid-template-columns:1fr 1fr 1fr} }
    .field{display:flex;flex-direction:column;gap:6px}
    .input,.select,.num,.btn{padding:10px 12px;border-radius:10px;border:1px solid #e5e7eb;background:#fff}
    .btn-primary{background:#0ea5e9;border:0;color:#fff;cursor:pointer}
    .btn-outline{background:#fff;cursor:pointer}
    .muted{color:#64748b}
    .section{margin-top:16px;padding:12px;border:1px solid #e5e7eb;border-radius:12px}
    .orRow{display:flex;align-items:center;gap:8px}
    .orRow .rule{height:1px;background:#e5e7eb;flex:1}
    .badge{display:inline-block;padding:4px 8px;border-radius:999px;font-size:12px;border:1px solid #e5e7eb;background:#f1f5f9}
  `;

  /* ---- geolocation ---- */
  function useMyLocation() {
    setError(null);
    setDetecting(true);
    if (!navigator.geolocation) { setError("Geolocation not supported."); setDetecting(false); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const inUSA = isInUSA(latitude, longitude);
        setUsaBlocked(!inUSA);
        if (!inUSA) {
          setDetecting(false);
          setSummary(null);
          setLat(undefined); setLon(undefined);
          setPickupMode("manualMiles");
          setError("This tool only works inside the USA (including Alaska, Hawaii, Puerto Rico).");
          return;
        }
        setLat(latitude); setLon(longitude);
        setPickupMode("geo");
        setManualMiles(""); // clear miles when using geo
        setDetecting(false);
        setError(null);
      },
      (err) => { setDetecting(false); setError(err.message || "Failed to get location."); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  /* ---- parsing helpers so inputs can be cleared ---- */
  const nOrNull = (s: string) => (s.trim()==="" ? null : Number(s));
  const clamp = (n:number|null, min:number) => (n==null?null:Math.max(min,n));

  /* ---- compute ---- */
  function compute() {
    setError(null);
    if (usaBlocked) { setError("This tool only works in the USA."); return; }

    // distance
    let miles: number | null = null;
    if (pickupMode === "geo" && lat && lon) {
      miles = haversineMiles({ lat, lon }, airport);
    } else {
      miles = clamp(nOrNull(manualMiles), 0);
    }
    if (miles==null || !Number.isFinite(miles)) { setError("Provide pickup distance: use My Location or enter miles."); return; }
    if (miles < 0.1) { setError("Distance looks ~0 miles. Please enter miles manually if needed."); return; }

    // time
    const t = fmtDateFromHHMM(timeHHMM);
    if (!t) { setError("Enter the flight time (HH:MM)."); return; }

    // compute times
    const driveMins = estimateDriveMins(miles);
    let arriveAt: Date, leaveAt: Date;
    if (flightType === "Departure") {
      arriveAt = new Date(t.getTime() - 90*60000);
      leaveAt = new Date(arriveAt.getTime() - driveMins*60000);
    } else {
      arriveAt = t;
      leaveAt = new Date(arriveAt.getTime() - driveMins*60000);
    }

    const pax = clamp(nOrNull(passengers), 1) ?? 1;
    const bag = clamp(nOrNull(bags), 0) ?? 0;
    const term = clamp(nOrNull(terminals), 1) ?? 1;
    const v = pickVehicle(pax, bag);

    const text = (flightType === "Departure")
      ? `Leave at ${fmtClock(leaveAt)} to arrive at ${fmtClock(arriveAt)} — 1.5 hours before your ${airport.iata} departure.`
      : `Leave at ${fmtClock(leaveAt)} to arrive at ${fmtClock(arriveAt)} at ${airport.iata} for pickup.`;

    const why = (flightType === "Departure")
      ? `Be at the airport 1.5 hours before takeoff. Estimated drive ~${driveMins} min for ~${round(miles,1)} miles from pickup. ${term>1?'Multiple terminals noted — plan extra curb time.':'Single terminal pickup/drop-off.'}`
      : `Meet the flight at landing. Estimated drive ~${driveMins} min for ~${round(miles,1)} miles from pickup. ${term>1?'Multiple terminals noted — plan extra curb time.':'Single terminal pickup/drop-off.'}`;

    setSummary({ leaveAt, arriveAt, miles: round(miles,1), driveMins, text, why, vehicle: v, userPin: lat && lon ? {lat, lon}: undefined });
    setStep(4);
  }

  /* ---- UI ---- */
  return (
    <div style={pageWrap}>
      <style>{css}</style>
      <main style={card}>
        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:12 }}>
          <div className="muted" style={{ letterSpacing:1, textTransform:"uppercase", fontSize:12 }}>Wizard</div>
          <h1 style={{ fontSize:28, fontWeight:800 }}>Airport Transfer Planner</h1>
          <p className="muted"><b>Departure:</b> arrive 1.5h before takeoff. <b>Arrival:</b> be there when it lands.</p>
        </div>

        {/* Progress */}
        <div style={{ height:8, background:"#e2e8f0", borderRadius:999, overflow:"hidden", marginBottom:16 }}>
          <div style={{ height:"100%", width:`${progress}%`, background:"#0ea5e9", transition:"width .25s ease" }}/>
        </div>

        {/* Step 1 — Airport & Pickup */}
        {step===1 && (
          <section>
            <h2 style={{ fontSize:18, fontWeight:700, marginBottom:8 }}>Step 1 — Airport & Pickup</h2>
            <div className="g2" style={grid(2)}>
              <div className="field">
                <label className="muted" style={{ fontSize:12 }}>Airport</label>
                <select className="select" value={airportIata} onChange={e=>setAirportIata(e.target.value)}>
                  {AIRPORTS.map(a=> <option key={a.iata} value={a.iata}>{a.iata} — {a.name}</option>)}
                </select>
              </div>

              <div className="field">
                <label className="muted" style={{ fontSize:12 }}>Pickup Distance (miles)</label>
                <input
                  className="num"
                  type="number" step="0.1" min="0"
                  value={pickupMode==="manualMiles" ? manualMiles : ""}
                  onChange={(e)=>{
                    setPickupMode("manualMiles");
                    setManualMiles(e.target.value);
                    setLat(undefined); setLon(undefined);
                  }}
                  placeholder="e.g., 12.5"
                  disabled={pickupMode==="geo"}
                />
                <div className="orRow" style={{ marginTop:8 }}>
                  <div className="rule" />
                  <div className="muted" style={{ fontSize:12, whiteSpace:"nowrap" }}>OR</div>
                  <div className="rule" />
                </div>
                <button
                  onClick={useMyLocation}
                  disabled={detecting}
                  className="btn btn-outline"
                  style={{ marginTop:8 }}
                >
                  {detecting ? "Using My Location…" : "Use My Location"}
                </button>

                {pickupMode==="geo" && lat && lon && (
                  <div className="muted" style={{ marginTop:8, fontSize:12 }}>
                    Using your location <span className="badge">Geo</span>: <b>{round(lat,4)}, {round(lon,4)}</b> —{" "}
                    <a href={`https://www.google.com/maps?q=${lat},${lon}`} target="_blank" rel="noreferrer" style={{ textDecoration:"underline" }}>View on map</a>
                    <div style={{ marginTop:6 }}>
                      <button
                        className="btn btn-outline"
                        onClick={()=>{ setPickupMode("manualMiles"); setManualMiles(""); setLat(undefined); setLon(undefined); }}
                      >
                        Clear Location (switch to miles)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display:"flex", gap:10, marginTop:16 }}>
              <button onClick={()=>setStep(2)} className="btn btn-primary" style={{ marginLeft:"auto" }} disabled={usaBlocked}>Next →</button>
            </div>
            {(error || usaBlocked) && <div style={{ color:"#b91c1c", marginTop:10 }}>{error ?? "This tool only works inside the USA (including Alaska, Hawaii, Puerto Rico)."}</div>}
          </section>
        )}

        {/* Step 2 — Flight Time */}
        {step===2 && (
          <section>
            <h2 style={{ fontSize:18, fontWeight:700, marginBottom:8 }}>Step 2 — Flight Time</h2>
            <div className="g2" style={grid(2)}>
              <div className="field">
                <label className="muted" style={{ fontSize:12 }}>Flight Type</label>
                <select className="select" value={flightType} onChange={e=>setFlightType(e.target.value as FlightType)}>
                  <option value="Arrival">Arrival (Picking Up)</option>
                  <option value="Departure">Departure (You Fly)</option>
                </select>
              </div>
              <div className="field">
                <label className="muted" style={{ fontSize:12 }}>{flightType==="Arrival" ? "Landing Time (local)" : "Takeoff Time (local)"}</label>
                <input className="input" type="time" step={60} value={timeHHMM} onChange={e=>setTimeHHMM(e.target.value)}/>
                <small className="muted">If the time already passed today, we’ll assume tomorrow.</small>
              </div>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:16 }}>
              <button onClick={()=>setStep(1)} className="btn btn-outline">← Back</button>
              <button onClick={()=>setStep(3)} className="btn btn-primary" style={{ marginLeft:"auto" }}>Next →</button>
            </div>
            {error && <div style={{ color:"#b91c1c", marginTop:10 }}>{error}</div>}
          </section>
        )}

        {/* Step 3 — Party & Stops */}
        {step===3 && (
          <section>
            <h2 style={{ fontSize:18, fontWeight:700, marginBottom:8 }}>Step 3 — Party & Stops</h2>
            <div className="g3" style={grid(3)}>
              <div className="field">
                <label className="muted" style={{ fontSize:12 }}>Passengers</label>
                <input className="num" type="number" min={1} step={1} value={passengers}
                       onChange={e=>setPassengers(e.target.value)}/>
              </div>
              <div className="field">
                <label className="muted" style={{ fontSize:12 }}>Checked Bags</label>
                <input className="num" type="number" min={0} step={1} value={bags}
                       onChange={e=>setBags(e.target.value)}/>
              </div>
              <div className="field">
                <label className="muted" style={{ fontSize:12 }}>Terminals Involved</label>
                <input className="num" type="number" min={1} step={1} value={terminals}
                       onChange={e=>setTerminals(e.target.value)}/>
                <small className="muted">Usually <b>1</b>. Increase only for multiple stops/parties across terminals.</small>
              </div>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:16 }}>
              <button onClick={()=>setStep(2)} className="btn btn-outline">← Back</button>
              <button onClick={compute} className="btn btn-primary" style={{ marginLeft:"auto" }}>Make my plan →</button>
            </div>
            {error && <div style={{ color:"#b91c1c", marginTop:10 }}>{error}</div>}
          </section>
        )}

        {/* Step 4 — Summary */}
        {step===4 && summary && (
          <section>
            <h2 style={{ fontSize:18, fontWeight:700, marginBottom:8 }}>Summary</h2>
            <p>{summary.text}</p>
            <ul style={{ marginTop:8, lineHeight:1.6 }}>
              <li><b>Distance:</b> ~{summary.miles} miles</li>
              <li><b>Estimated drive:</b> ~{summary.driveMins} minutes</li>
              <li><b>Leave at:</b> {fmtClock(summary.leaveAt)}</li>
              <li><b>Arrive at airport:</b> {fmtClock(summary.arriveAt)}</li>
            </ul>
            <p className="muted" style={{ marginTop:8 }}>{summary.why}</p>
            <p style={{ marginTop:8 }}>
              <b>Vehicle:</b> {summary.vehicle.label}. {summary.vehicle.luggage}<br/>
              <i>Party buses usually have no luggage storage — plan roughly 1 bag = 1 seat.</i>
            </p>
            {summary.userPin && (
              <p className="muted" style={{ marginTop:8, fontSize:12 }}>
                Using your location: <b>{round(summary.userPin.lat,4)}, {round(summary.userPin.lon,4)}</b>{" "}
                — <a href={`https://www.google.com/maps?q=${summary.userPin.lat},${summary.userPin.lon}`} target="_blank" rel="noreferrer" style={{ textDecoration:"underline" }}>View on map</a>
              </p>
            )}
            <div style={{ display:"flex", gap:10, marginTop:14 }}>
              <button onClick={()=>setStep(3)} className="btn btn-outline">← Edit</button>
              <button onClick={()=>{ setAirportIata("PHX"); setPickupMode("manualMiles"); setManualMiles("10"); setLat(undefined); setLon(undefined); setFlightType("Arrival"); setTimeHHMM(""); setPassengers("2"); setBags("2"); setTerminals("1"); setSummary(null); setError(null); setStep(1); }} className="btn btn-outline" style={{ marginLeft:"auto" }}>Start over</button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
