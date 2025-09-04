export type Field = {
  name: string;
  label: string;
  type: "number" | "text" | "select";
  default?: any;
  options?: string[];
  help?: string;
  step?: number | string;
};

export type ToolSchema = {
  id: string;
  title: string;
  desc?: string;
  fields: Field[];
};

export type ToolCalculator = (inputs: Record<string, any>) => any;

const calculators: Record<string, { schema: ToolSchema; calc: ToolCalculator }> = {};

// cost-split
calculators["cost-split"] = {
  schema: {
    id: "cost-split",
    title: "Cost Split Calculator",
    desc: "Split total trip cost per person.",
    fields: [
      { name: "total", label: "Total cost", type: "number", default: 100, step: 0.01 },
      { name: "people", label: "Number of people", type: "number", default: 2, step: 1 },
      { name: "fees", label: "Additional fees (total)", type: "number", default: 0, step: 0.01 },
    ],
  },
  calc: (i) => {
    const total = Number(i.total) || 0;
    const fees = Number(i.fees) || 0;
    const people = Math.max(1, Math.floor(Number(i.people) || 1));
    const per = (total + fees) / people;
    return { per_person: Number(per.toFixed(2)), total: total + fees };
  },
};

// return-trip-price-compare (simple)
calculators["return-trip-price-compare"] = {
  schema: {
    id: "return-trip-price-compare",
    title: "Return Trip Price Compare",
    desc: "Compare 1-way vs wait-and-return vs two 1-ways.",
    fields: [
      { name: "oneway", label: "1-way price", type: "number", default: 100, step: 0.01 },
      { name: "waitHourly", label: "Hourly wait rate", type: "number", default: 50, step: 0.01 },
      { name: "hoursWait", label: "Hours waiting", type: "number", default: 2, step: 0.25 },
    ],
  },
  calc: (i) => {
    const oneway = Number(i.oneway) || 0;
    const waitHourly = Number(i.waitHourly) || 0;
    const hoursWait = Number(i.hoursWait) || 0;
    return {
      one_way: oneway,
      wait_and_return: oneway + waitHourly * hoursWait,
      two_one_ways: oneway * 2,
    };
  },
};

// hours-vs-mileage-optimizer (very simple heuristic)
calculators["hours-vs-mileage-optimizer"] = {
  schema: {
    id: "hours-vs-mileage-optimizer",
    title: "Hours vs Mileage Optimizer",
    desc: "Suggest cheaper combo for hours vs mileage-driven pricing.",
    fields: [
      { name: "hourRate", label: "Hourly rate", type: "number", default: 125, step: 0.01 },
      { name: "mileageRate", label: "Per-mile rate", type: "number", default: 2, step: 0.01 },
      { name: "hours", label: "Planned hours", type: "number", default: 4, step: 0.25 },
      { name: "miles", label: "Planned miles", type: "number", default: 30, step: 0.1 },
    ],
  },
  calc: (i) => {
    const hourRate = Number(i.hourRate) || 0;
    const mileageRate = Number(i.mileageRate) || 0;
    const hours = Number(i.hours) || 0;
    const miles = Number(i.miles) || 0;
    const byHours = hourRate * hours;
    const byMiles = mileageRate * miles;
    return { by_hours: Number(byHours.toFixed(2)), by_miles: Number(byMiles.toFixed(2)), recommendation: byHours <= byMiles ? "Use hourly" : "Use mileage" };
  },
};

// pick-up-window-recommender
calculators["pick-up-window-recommender"] = {
  schema: {
    id: "pick-up-window-recommender",
    title: "Pick-Up Window Recommender",
    desc: "Suggest pickup window length based on event and headcount.",
    fields: [
      { name: "headcount", label: "Headcount", type: "number", default: 20, step: 1 },
      { name: "eventType", label: "Event type", type: "select", options: ["Wedding", "Prom", "Concert", "Corporate"], default: "Wedding" },
    ],
  },
  calc: (i) => {
    const headcount = Math.max(1, Math.floor(Number(i.headcount) || 1));
    const eventType = String(i.eventType || "");
    let base = 15; // minutes
    if (eventType === "Wedding") base = 25;
    if (eventType === "Prom") base = 20;
    if (eventType === "Concert") base = 30;
    const extra = Math.ceil(headcount / 20) * 5;
    const window = base + extra;
    return { pickup_window_minutes: window };
  },
};

// boarding-time-calculator
calculators["boarding-time-calculator"] = {
  schema: {
    id: "boarding-time-calculator",
    title: "Boarding Time Calculator",
    desc: "Estimate load/unload time.",
    fields: [
      { name: "riders", label: "Riders", type: "number", default: 20, step: 1 },
      { name: "perRiderSec", label: "Seconds per rider", type: "number", default: 6, step: 0.5 },
    ],
  },
  calc: (i) => {
    const riders = Math.max(0, Math.floor(Number(i.riders) || 0));
    const per = Number(i.perRiderSec) || 0;
    const totalSec = riders * per;
    return { seconds: totalSec, minutes: Number((totalSec / 60).toFixed(2)) };
  },
};

// event-duration-wizard
calculators["event-duration-wizard"] = {
  schema: {
    id: "event-duration-wizard",
    title: "Event Duration Wizard",
    desc: "Suggest total hours by occasion.",
    fields: [
      { name: "event", label: "Event", type: "select", options: ["Wedding","Prom","Gameday","Birthday","Corporate"], default: "Wedding" },
    ],
  },
  calc: (i) => {
    const e = String(i.event || "");
    const map: Record<string, number> = { Wedding: 6, Prom: 5, Gameday: 4, Birthday: 4, Corporate: 3 };
    return { recommended_hours: map[e] ?? 4 };
  },
};

// capacity-finder
calculators["capacity-finder"] = {
  schema: {
    id: "capacity-finder",
    title: "Capacity Finder",
    desc: "Find vehicle size by group size.",
    fields: [{ name: "group", label: "Group size", type: "number", default: 10, step: 1 }],
  },
  calc: (i) => {
    const g = Math.max(1, Math.floor(Number(i.group) || 1));
    if (g <= 8) return { vehicle: "Sedan / SUV", capacity: 8 };
    if (g <= 14) return { vehicle: "Stretch Limo", capacity: 14 };
    if (g <= 30) return { vehicle: "Party Bus (30)", capacity: 30 };
    return { vehicle: "Coach / Multiple vehicles", capacity: g };
  },
};

// bar-hop-time-calculator
calculators["bar-hop-time-calculator"] = {
  schema: {
    id: "bar-hop-time-calculator",
    title: "Bar-Hop Time Calculator",
    desc: "Estimate dwell and travel for 3–6 stops.",
    fields: [
      { name: "stops", label: "Stops", type: "number", default: 4, step: 1 },
      { name: "dwellMin", label: "Avg dwell (min)", type: "number", default: 45, step: 1 },
      { name: "driveMin", label: "Avg drive between (min)", type: "number", default: 12, step: 1 },
    ],
  },
  calc: (i) => {
    const stops = Math.max(1, Math.floor(Number(i.stops) || 1));
    const dwell = Number(i.dwellMin) || 0;
    const drive = Number(i.driveMin) || 0;
    const total = stops * dwell + (stops - 1) * drive;
    return { total_minutes: total, total_hours: Number((total / 60).toFixed(2)) };
  },
};

// overtime-risk-meter (simple probability heuristic)
calculators["overtime-risk-meter"] = {
  schema: {
    id: "overtime-risk-meter",
    title: "Overtime Risk Meter",
    desc: "Likelihood your plan runs long; plan a buffer.",
    fields: [
      { name: "hoursScheduled", label: "Hours scheduled", type: "number", default: 4, step: 0.5 },
      { name: "eventType", label: "Event type", type: "select", options: ["Wedding","Prom","Concert","Sport"], default: "Wedding" },
      { name: "buffer", label: "Planned buffer (min)", type: "number", default: 30, step: 5 },
    ],
  },
  calc: (i) => {
    const h = Number(i.hoursScheduled) || 0;
    const e = String(i.eventType || "");
    const buf = Number(i.buffer) || 0;
    let baseRisk = 0.1;
    if (e === "Wedding") baseRisk = 0.35;
    if (e === "Prom") baseRisk = 0.25;
    if (e === "Concert") baseRisk = 0.4;
    if (e === "Sport") baseRisk = 0.2;
    const risk = Math.min(0.99, baseRisk + Math.max(0, (h - 2) * 0.05) - Math.min(0.5, buf / 60) * 0.1);
    return { risk_pct: Math.round(risk * 100) };
  },
};

// (export default at end of file)

// --- Additional calculators requested ---

// surge-peak-predictor (basic demand index)
calculators["surge-peak-predictor"] = {
  schema: {
    id: "surge-peak-predictor",
    title: "Surge & Peak Predictor",
    desc: "Simple demand index by date and time (heuristic).",
    fields: [
      { name: "dayOfWeek", label: "Day of week", type: "select", options: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], default: "Fri" },
      { name: "month", label: "Month (1-12)", type: "number", default: 7, step: 1 },
      { name: "eventNearby", label: "Nearby event?", type: "select", options: ["No","Yes"], default: "No" },
    ],
  },
  calc: (i) => {
    const day = String(i.dayOfWeek || "");
    const month = Number(i.month) || 1;
    const event = String(i.eventNearby || "No");
    let score = 0.5;
    if (day === "Fri" || day === "Sat") score += 0.3;
    if (month >= 5 && month <= 9) score += 0.1; // summer
    if (event === "Yes") score += 0.4;
    return { demand_index: Math.min(1, Number(score.toFixed(2))) };
  },
};

// off-peak-saver-finder
calculators["off-peak-saver-finder"] = {
  schema: {
    id: "off-peak-saver-finder",
    title: "Off-Peak Saver Finder",
    desc: "Suggest cheaper days/hours to book.",
    fields: [
      { name: "preferredDay", label: "Preferred day", type: "select", options: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], default: "Sat" },
      { name: "flexDays", label: "Flexible days (±)", type: "number", default: 2, step: 1 },
    ],
  },
  calc: (i) => {
    const pref = String(i.preferredDay || "Sat");
    const flex = Math.max(0, Math.floor(Number(i.flexDays) || 0));
    // naive: suggest weekdays if preferred is weekend and flex>0
    const suggestions = [] as string[];
    if (pref === "Sat" || pref === "Sun") suggestions.push("Thu","Wed");
    if (flex >= 2) suggestions.push("Tue","Mon");
    return { suggestions: Array.from(new Set(suggestions)).slice(0, 4) };
  },
};

// minimum-hours-calculator
calculators["minimum-hours-calculator"] = {
  schema: {
    id: "minimum-hours-calculator",
    title: "Minimum Hours Calculator",
    desc: "Typical market minimums by vehicle/date.",
    fields: [
      { name: "vehicleType", label: "Vehicle type", type: "select", options: ["Sedan","Limo","Party Bus","Coach"], default: "Party Bus" },
      { name: "isHoliday", label: "Holiday?", type: "select", options: ["No","Yes"], default: "No" },
    ],
  },
  calc: (i) => {
    const v = String(i.vehicleType || "Party Bus");
    const h = String(i.isHoliday || "No");
    let min = 3;
    if (v === "Sedan") min = 1;
    if (v === "Limo") min = 2;
    if (v === "Party Bus") min = 3;
    if (v === "Coach") min = 4;
    if (h === "Yes") min += 1;
    return { minimum_hours: min };
  },
};

// fuel-surcharge-calculator
calculators["fuel-surcharge-calculator"] = {
  schema: {
    id: "fuel-surcharge-calculator",
    title: "Fuel Surcharge Calculator",
    desc: "Estimate fuel add-ons by distance/market.",
    fields: [
      { name: "miles", label: "Miles", type: "number", default: 30, step: 0.1 },
      { name: "mpg", label: "Vehicle MPG", type: "number", default: 8, step: 0.1 },
      { name: "fuelPrice", label: "Fuel price per gallon", type: "number", default: 4.0, step: 0.01 },
      { name: "markupPct", label: "Markup %", type: "number", default: 15, step: 0.1 },
    ],
  },
  calc: (i) => {
    const miles = Number(i.miles) || 0;
    const mpg = Number(i.mpg) || 1;
    const fuel = Number(i.fuelPrice) || 0;
    const markup = Number(i.markupPct) || 0;
    const gallons = miles / mpg;
    const base = gallons * fuel;
    const total = base * (1 + markup / 100);
    return { base_fuel: Number(base.toFixed(2)), surcharge: Number(total.toFixed(2)) };
  },
};

// drive-time-estimator (very basic)
calculators["drive-time-estimator"] = {
  schema: {
    id: "drive-time-estimator",
    title: "Drive Time Estimator",
    desc: "Traffic-aware travel time between stops (heuristic).",
    fields: [
      { name: "miles", label: "Miles", type: "number", default: 10, step: 0.1 },
      { name: "avgSpeed", label: "Avg speed (mph)", type: "number", default: 30, step: 1 },
      { name: "trafficFactor", label: "Traffic factor (1=normal)", type: "number", default: 1.2, step: 0.1 },
    ],
  },
  calc: (i) => {
    const miles = Number(i.miles) || 0;
    const avg = Number(i.avgSpeed) || 30;
    const tf = Number(i.trafficFactor) || 1;
    const hours = miles / avg * tf;
    return { minutes: Math.round(hours * 60), hours: Number(hours.toFixed(2)) };
  },
};

// multi-stop-route-optimizer (naive total time estimator)
calculators["multi-stop-route-optimizer"] = {
  schema: {
    id: "multi-stop-route-optimizer",
    title: "Multi-Stop Route Optimizer",
    desc: "Naive optimizer that estimates total time with simple reorder heuristic.",
    fields: [
      { name: "stops", label: "Stops", type: "number", default: 4, step: 1 },
      { name: "avgDriveMin", label: "Avg drive between (min)", type: "number", default: 12, step: 1 },
      { name: "dwellMin", label: "Avg dwell per stop (min)", type: "number", default: 20, step: 1 },
    ],
  },
  calc: (i) => {
    const stops = Math.max(1, Math.floor(Number(i.stops) || 1));
    const drive = Number(i.avgDriveMin) || 0;
    const dwell = Number(i.dwellMin) || 0;
    const total = (stops - 1) * drive + stops * dwell;
    return { total_minutes: total, total_hours: Number((total / 60).toFixed(2)) };
  },
};

// itinerary-builder (simple hours summary)
calculators["itinerary-builder"] = {
  schema: {
    id: "itinerary-builder",
    title: "Itinerary Builder",
    desc: "Build simple multi-stop plan and total time.",
    fields: [
      { name: "stops", label: "Stops", type: "number", default: 5, step: 1 },
      { name: "avgDriveMin", label: "Avg drive between (min)", type: "number", default: 10, step: 1 },
      { name: "dwellMin", label: "Avg dwell per stop (min)", type: "number", default: 15, step: 1 },
    ],
  },
  calc: (i) => {
    const stops = Math.max(1, Math.floor(Number(i.stops) || 1));
    const drive = Number(i.avgDriveMin) || 0;
    const dwell = Number(i.dwellMin) || 0;
    const totalMin = (stops - 1) * drive + stops * dwell;
    return { total_minutes: totalMin, total_hours: Number((totalMin / 60).toFixed(2)) };
  },
};

// pickup-point-street-view-preview (placeholder helper)
calculators["pickup-point-street-view-preview"] = {
  schema: {
    id: "pickup-point-street-view-preview",
    title: "Pickup Point Street View Preview",
    desc: "Preview helper; returns a map link for a given address.",
    fields: [{ name: "address", label: "Address", type: "text", default: "" }],
  },
  calc: (i) => {
    const addr = String(i.address || "");
    const q = encodeURIComponent(addr);
    return { map_url: `https://www.google.com/maps/search/?api=1&query=${q}` };
  },
};

export default calculators;
