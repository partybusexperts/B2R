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

export type ToolCalculator = (inputs: Record<string, unknown>) => unknown;

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

// --- Ten additional calculators requested ---

// good-better-best-package-builder
calculators["good-better-best-package-builder"] = {
  schema: {
    id: "good-better-best-package-builder",
    title: "Good–Better–Best Package Builder",
    desc: "Create three tiered packages from base rates.",
    fields: [
      { name: "baseRate", label: "Base hourly rate", type: "number", default: 150, step: 0.01 },
      { name: "hours", label: "Hours", type: "number", default: 4, step: 0.25 },
      { name: "addOnsPct", label: "Add-ons % for Better/Best", type: "number", default: 15, step: 1 },
    ],
  },
  calc: (i) => {
    const baseRate = Number(i.baseRate) || 0;
    const hours = Number(i.hours) || 1;
    const pct = Number(i.addOnsPct) || 0;
    const good = baseRate * hours;
    const better = good * (1 + pct / 100);
    const best = good * (1 + (pct * 2) / 100);
    return { good: Number(good.toFixed(2)), better: Number(better.toFixed(2)), best: Number(best.toFixed(2)) };
  },
};

// special-request-matcher (simple capability filter)
calculators["special-request-matcher"] = {
  schema: {
    id: "special-request-matcher",
    title: "Special Request Matcher",
    desc: "Find vehicle suggestions by capability flags.",
    fields: [
      { name: "needsPole", label: "Needs pole", type: "select", options: ["No","Yes"], default: "No" },
      { name: "needsRestroom", label: "Needs restroom", type: "select", options: ["No","Yes"], default: "No" },
      { name: "needsADA", label: "Needs ADA", type: "select", options: ["No","Yes"], default: "No" },
      { name: "groupSize", label: "Group size", type: "number", default: 10, step: 1 },
    ],
  },
  calc: (i) => {
    const pole = String(i.needsPole || "No") === "Yes";
    const rr = String(i.needsRestroom || "No") === "Yes";
    const ada = String(i.needsADA || "No") === "Yes";
    const g = Math.max(1, Math.floor(Number(i.groupSize) || 1));
    const candidates: string[] = [];
    if (pole && g <= 30) candidates.push("Party Bus (pole-friendly)");
    if (rr && g <= 50) candidates.push("Coach with restroom");
    if (ada) candidates.push("ADA-accessible van or mini-bus");
    if (!pole && !rr && !ada) {
      if (g <= 8) candidates.push("Sedan/SUV");
      else if (g <= 14) candidates.push("Stretch Limo");
      else candidates.push("Party Bus");
    }
    return { matches: candidates.slice(0, 5) };
  },
};

// budget-guardrail-planner
calculators["budget-guardrail-planner"] = {
  schema: {
    id: "budget-guardrail-planner",
    title: "Budget Guardrail Planner",
    desc: "Find best-fit options under a max spend.",
    fields: [
      { name: "budget", label: "Budget (total)", type: "number", default: 800, step: 1 },
      { name: "hours", label: "Hours", type: "number", default: 4, step: 0.25 },
      { name: "people", label: "People", type: "number", default: 10, step: 1 },
    ],
  },
  calc: (i) => {
    const budget = Number(i.budget) || 0;
    const hours = Number(i.hours) || 1;
    const people = Math.max(1, Math.floor(Number(i.people) || 1));
    // naive candidates with hourly rates
    const fleet = [ { vehicle: 'Sedan', rate: 60 }, { vehicle: 'Limo', rate: 120 }, { vehicle: 'Party Bus', rate: 200 }, { vehicle: 'Coach', rate: 300 } ];
    const fits = fleet.map(f => ({ vehicle: f.vehicle, total: Number((f.rate * hours).toFixed(2)), per_person: Number(((f.rate * hours)/people).toFixed(2)) })).filter(x => x.total <= budget);
    return { fits, budget }; 
  }
};

// pickup-radius-surcharge-checker
calculators["pickup-radius-surcharge-checker"] = {
  schema: {
    id: "pickup-radius-surcharge-checker",
    title: "Pickup Radius Surcharge Checker",
    desc: "Estimate surcharge when pickup is outside base radius.",
    fields: [
      { name: "milesOutside", label: "Miles outside base radius", type: "number", default: 5, step: 0.1 },
      { name: "perMileSurcharge", label: "Surcharge per mile", type: "number", default: 2.5, step: 0.01 },
    ],
  },
  calc: (i) => {
    const miles = Math.max(0, Number(i.milesOutside) || 0);
    const rate = Number(i.perMileSurcharge) || 0;
    const surcharge = Number((miles * rate).toFixed(2));
    return { surcharge, miles }; 
  }
};

// tolls-road-fees-estimator
calculators["tolls-road-fees-estimator"] = {
  schema: {
    id: "tolls-road-fees-estimator",
    title: "Tolls & Road Fees Estimator",
    desc: "Rough tolls and bridge fees estimate by count.",
    fields: [
      { name: "tollCount", label: "Number of tolls/bridges", type: "number", default: 2, step: 1 },
      { name: "avgToll", label: "Avg toll fee", type: "number", default: 6, step: 0.1 },
      { name: "perStopFee", label: "Per-stop venue fee", type: "number", default: 10, step: 0.1 },
      { name: "stops", label: "Stops", type: "number", default: 3, step: 1 },
    ],
  },
  calc: (i) => {
    const tolls = Math.max(0, Math.floor(Number(i.tollCount) || 0));
    const avg = Number(i.avgToll) || 0;
    const perStop = Number(i.perStopFee) || 0;
    const stops = Math.max(0, Math.floor(Number(i.stops) || 0));
    const total = Number((tolls * avg + stops * perStop).toFixed(2));
    return { estimated_fees: total };
  }
};

// multi-vehicle-split-planner
calculators["multi-vehicle-split-planner"] = {
  schema: {
    id: "multi-vehicle-split-planner",
    title: "Multi-Vehicle Split Planner",
    desc: "Recommend splitting groups into vehicles to minimize per-person cost.",
    fields: [
      { name: "groupSize", label: "Group size", type: "number", default: 40, step: 1 },
      { name: "vehicleCap", label: "Primary vehicle capacity", type: "number", default: 30, step: 1 },
      { name: "vehicleRate", label: "Per-vehicle flat rate", type: "number", default: 300, step: 1 },
    ],
  },
  calc: (i) => {
    const g = Math.max(1, Math.floor(Number(i.groupSize) || 1));
    const cap = Math.max(1, Math.floor(Number(i.vehicleCap) || 1));
    const rate = Number(i.vehicleRate) || 0;
    const n = Math.ceil(g / cap);
    const total = n * rate;
    return { vehicles: n, total, per_person: Number((total / g).toFixed(2)) };
  }
};

// seasonality-heatmap (returns simple month weightings)
calculators["seasonality-heatmap"] = {
  schema: {
    id: "seasonality-heatmap",
    title: "Seasonality Heatmap",
    desc: "Return a simple month-based demand multiplier (1=baseline).",
    fields: [
      { name: "city", label: "City (optional)", type: "text", default: "" },
    ],
  },
  calc: () => {
    // naive pattern: summer high, winter low
    const months = [0.9,0.95,1,1.05,1.1,1.2,1.25,1.2,1.1,1.05,0.98,0.92];
    return { multipliers: months };
  }
};

// local-event-demand-radar
calculators["local-event-demand-radar"] = {
  schema: {
    id: "local-event-demand-radar",
    title: "Local Event Demand Radar",
    desc: "Spotlight nearby event demand (placeholder).",
    fields: [
      { name: "zip", label: "ZIP or city", type: "text", default: "" },
      { name: "radiusMiles", label: "Radius (miles)", type: "number", default: 10, step: 1 },
    ],
  },
  calc: (i) => {
    const zip = String(i.zip || "");
    const r = Number(i.radiusMiles) || 10;
    // placeholder: return example events count
    return { zip, radius: r, upcoming_events: 3, demand_alert: r > 5 ? "moderate" : "low" };
  }
};

// rain-plan-builder
calculators["rain-plan-builder"] = {
  schema: {
    id: "rain-plan-builder",
    title: "Rain Plan Builder",
    desc: "Simple backup timing + buffer suggestions when weather may shift.",
    fields: [
      { name: "chancePct", label: "Chance of rain %", type: "number", default: 30, step: 1 },
      { name: "outdoorMinutes", label: "Outdoor minutes", type: "number", default: 60, step: 5 },
    ],
  },
  calc: (i) => {
    const c = Math.max(0, Math.min(100, Number(i.chancePct) || 0));
    const outdoor = Math.max(0, Number(i.outdoorMinutes) || 0);
    const buffer = c >= 50 ? 60 : c >= 20 ? 30 : 15;
    const advise = c >= 50 ? 'Move indoor / add large cover' : 'Bring umbrellas and buffer';
    return { chancePct: c, recommended_buffer_min: buffer, advise, adjusted_total_minutes: outdoor + buffer };
  }
};

// cancellation-flex-score
calculators["cancellation-flex-score"] = {
  schema: {
    id: "cancellation-flex-score",
    title: "Cancellation Flex Score",
    desc: "Score refund vs reschedule friendliness from policy inputs.",
    fields: [
      { name: "daysBeforeRefund", label: "Days before full refund", type: "number", default: 14, step: 1 },
      { name: "refundPct", label: "Refund % after cutover", type: "number", default: 50, step: 1 },
    ],
  },
  calc: (i) => {
    const days = Math.max(0, Math.floor(Number(i.daysBeforeRefund) || 0));
    const pct = Math.max(0, Math.min(100, Number(i.refundPct) || 0));
    const score = Math.round(Math.min(100, (pct * 0.6) + Math.min(40, days * 1.5)));
    return { score, days, refundPct: pct };
  }
};

// Explicit placeholders for missing registry tools (safe fallbacks)
calculators["group-vibe-matcher"] = { schema: { id: "group-vibe-matcher", title: "Group Vibe Matcher", fields: [] }, calc: (i) => ({ id: "group-vibe-matcher", placeholder: true, inputs: i }) };
calculators["luxury-level-selector"] = { schema: { id: "luxury-level-selector", title: "Luxury Level Selector", fields: [] }, calc: (i) => ({ id: "luxury-level-selector", placeholder: true, inputs: i }) };
calculators["group-discount-finder"] = { schema: { id: "group-discount-finder", title: "Group Discount Finder", fields: [] }, calc: (i) => ({ id: "group-discount-finder", placeholder: true, inputs: i }) };
calculators["hidden-fees-detector"] = { schema: { id: "hidden-fees-detector", title: "Hidden Fees Detector", fields: [] }, calc: (i) => ({ id: "hidden-fees-detector", placeholder: true, inputs: i }) };
calculators["early-booking-savings"] = { schema: { id: "early-booking-savings", title: "Early Booking Savings", fields: [] }, calc: (i) => ({ id: "early-booking-savings", placeholder: true, inputs: i }) };
calculators["last-minute-deal-finder"] = { schema: { id: "last-minute-deal-finder", title: "Last-Minute Deal Finder", fields: [] }, calc: (i) => ({ id: "last-minute-deal-finder", placeholder: true, inputs: i }) };
calculators["real-time-traffic-adjuster"] = { schema: { id: "real-time-traffic-adjuster", title: "Real-Time Traffic Adjuster", fields: [] }, calc: (i) => ({ id: "real-time-traffic-adjuster", placeholder: true, inputs: i }) };
calculators["nighttime-route-safety"] = { schema: { id: "nighttime-route-safety", title: "Nighttime Route Safety", fields: [] }, calc: (i) => ({ id: "nighttime-route-safety", placeholder: true, inputs: i }) };
calculators["cross-city-route-planner"] = { schema: { id: "cross-city-route-planner", title: "Cross-City Route Planner", fields: [] }, calc: (i) => ({ id: "cross-city-route-planner", placeholder: true, inputs: i }) };
calculators["parking-availability-finder"] = { schema: { id: "parking-availability-finder", title: "Parking Availability Finder", fields: [] }, calc: (i) => ({ id: "parking-availability-finder", placeholder: true, inputs: i }) };
calculators["rush-hour-avoidance"] = { schema: { id: "rush-hour-avoidance", title: "Rush Hour Avoidance", fields: [] }, calc: (i) => ({ id: "rush-hour-avoidance", placeholder: true, inputs: i }) };
calculators["onboard-entertainment-planner"] = { schema: { id: "onboard-entertainment-planner", title: "Onboard Entertainment Planner", fields: [] }, calc: (i) => ({ id: "onboard-entertainment-planner", placeholder: true, inputs: i }) };
calculators["custom-signage-creator"] = { schema: { id: "custom-signage-creator", title: "Custom Signage Creator", fields: [] }, calc: (i) => ({ id: "custom-signage-creator", placeholder: true, inputs: i }) };
calculators["food-stop-recommender"] = { schema: { id: "food-stop-recommender", title: "Food Stop Recommender", fields: [] }, calc: (i) => ({ id: "food-stop-recommender", placeholder: true, inputs: i }) };
calculators["multi-event-day-planner"] = { schema: { id: "multi-event-day-planner", title: "Multi-Event Day Planner", fields: [] }, calc: (i) => ({ id: "multi-event-day-planner", placeholder: true, inputs: i }) };
calculators["guest-communication-hub"] = { schema: { id: "guest-communication-hub", title: "Guest Communication Hub", fields: [] }, calc: (i) => ({ id: "guest-communication-hub", placeholder: true, inputs: i }) };

// --- First batch additions ---

// vehicle-compare
calculators["vehicle-compare"] = {
  schema: {
    id: "vehicle-compare",
    title: "Vehicle Comparison",
    desc: "Compare vehicle types side-by-side.",
    fields: [
      { name: "passengers", label: "Passengers", type: "number", default: 10, step: 1 },
      { name: "priority", label: "Priority", type: "select", options: ["Price","Comfort","Amenities"], default: "Comfort" },
    ],
  },
  calc: (i) => {
    const p = Math.max(1, Math.floor(Number(i.passengers) || 1));
    const pr = String(i.priority || "Comfort");
  const candidates: { vehicle: string; capacity: number; est_hourly: number; fits: boolean; score: number }[] = [];
    // naive fleet
    const fleet = [
      { name: 'Sedan/SUV', cap: 4, hourly: 60 },
      { name: 'Stretch Limo', cap: 12, hourly: 140 },
      { name: 'Party Bus (20)', cap: 20, hourly: 180 },
      { name: 'Party Bus (30)', cap: 30, hourly: 240 },
      { name: 'Coach', cap: 50, hourly: 350 },
    ];
    for (const f of fleet) {
      const fits = f.cap >= p;
      const score = (fits ? 1 : 0) + (pr === 'Price' ? (100 - f.hourly) / 100 : 0) + (pr === 'Comfort' ? (f.cap >= p ? 1 : 0) : 0) + (pr === 'Amenities' ? (f.name.includes('Party Bus') ? 1 : 0) : 0);
      candidates.push({ vehicle: f.name, capacity: f.cap, est_hourly: f.hourly, fits, score: Number(score.toFixed(2)) });
    }
    candidates.sort((a, b) => b.score - a.score || a.est_hourly - b.est_hourly);
    return { suggestions: candidates.slice(0, 5) };
  }
};

// event-match (suggest by occasion)
calculators["event-match"] = {
  schema: {
    id: "event-match",
    title: "Event Matchmaker",
    desc: "Recommend vehicles by occasion and group vibe.",
    fields: [
      { name: "event", label: "Event", type: "select", options: ["Wedding","Prom","Concert","Gameday","Corporate","Birthday"], default: "Wedding" },
      { name: "groupSize", label: "Group size", type: "number", default: 12, step: 1 },
    ],
  },
  calc: (i) => {
    const e = String(i.event || "Wedding");
    const g = Math.max(1, Math.floor(Number(i.groupSize) || 1));
    const picks: string[] = [];
    if (e === 'Wedding') {
      picks.push(g <= 8 ? 'Luxury Sedan/SUV' : g <= 14 ? 'Stretch Limo' : 'Party Bus (30)');
    } else if (e === 'Prom') {
      picks.push(g <= 14 ? 'Stretch Limo' : 'Party Bus (20)');
    } else if (e === 'Concert' || e === 'Gameday') {
      picks.push('Party Bus (20)', 'Party Bus (30)');
    } else if (e === 'Corporate') {
      picks.push(g <= 8 ? 'SUV/Van' : 'Coach');
    } else if (e === 'Birthday') {
      picks.push('Party Bus (20)', 'Stretch Limo');
    }
    return { event: e, groupSize: g, recommendations: Array.from(new Set(picks)).slice(0, 5) };
  }
};

// door-to-venue-walking-time
calculators["door-to-venue-walking-time"] = {
  schema: {
    id: "door-to-venue-walking-time",
    title: "Door-to-Venue Walking Time",
    desc: "Estimate walking time from drop point to venue entrance.",
    fields: [
      { name: "distanceFeet", label: "Distance (feet)", type: "number", default: 800, step: 1 },
      { name: "walkingSpeedFtPerMin", label: "Walking speed (ft/min)", type: "number", default: 300, step: 10 },
    ],
  },
  calc: (i) => {
    const d = Math.max(0, Number(i.distanceFeet) || 0);
    const s = Math.max(1, Number(i.walkingSpeedFtPerMin) || 300);
    const minutes = Number((d / s).toFixed(1));
    return { distanceFeet: d, minutes, friendly: `${minutes} min walk` };
  }
};

// extra-stops-cost-calculator
calculators["extra-stops-cost-calculator"] = {
  schema: {
    id: "extra-stops-cost-calculator",
    title: "Extra Stops Cost Calculator",
    desc: "Estimate added time and cost per extra stop.",
    fields: [
      { name: "extraStops", label: "Extra stops", type: "number", default: 2, step: 1 },
      { name: "avgStopTimeMin", label: "Avg stop time (min)", type: "number", default: 10, step: 1 },
      { name: "hourlyRate", label: "Hourly rate", type: "number", default: 180, step: 0.01 },
    ],
  },
  calc: (i) => {
    const n = Math.max(0, Math.floor(Number(i.extraStops) || 0));
    const stopMin = Math.max(0, Number(i.avgStopTimeMin) || 0);
    const rate = Number(i.hourlyRate) || 0;
    const addedMin = n * stopMin;
    const addedCost = Number(((addedMin / 60) * rate).toFixed(2));
    return { extraStops: n, addedMinutes: addedMin, addedCost };
  }
};

// deadhead-distance-estimator
calculators["deadhead-distance-estimator"] = {
  schema: {
    id: "deadhead-distance-estimator",
    title: "Deadhead Distance Estimator",
    desc: "Estimate garage-to-pickup miles and impact on price.",
    fields: [
      { name: "garageMiles", label: "Garage to pickup (miles)", type: "number", default: 12, step: 0.1 },
      { name: "perMileCost", label: "Per-mile cost", type: "number", default: 2, step: 0.01 },
    ],
  },
  calc: (i) => {
    const miles = Math.max(0, Number(i.garageMiles) || 0);
    const per = Number(i.perMileCost) || 0;
    const cost = Number((miles * per).toFixed(2));
    return { garageMiles: miles, est_deadhead_cost: cost };
  }
};

// sunset-timing-advisor (approximate; produces a lookup URL and rough estimate)
calculators["sunset-timing-advisor"] = {
  schema: {
    id: "sunset-timing-advisor",
    title: "Sunset Timing Advisor",
    desc: "Give golden-hour timing guidance or a lookup link.",
    fields: [
      { name: "date", label: "Date (YYYY-MM-DD)", type: "text", default: "" },
      { name: "city", label: "City (optional)", type: "text", default: "" },
    ],
  },
  calc: (i) => {
    const dateStr = String(i.date || "");
    const city = String(i.city || "");
    // rough heuristic: map month to sunset hour
    let month = 6;
    if (dateStr) {
      const m = new Date(dateStr + 'T00:00:00');
      if (!isNaN(m.getTime())) month = m.getMonth() + 1;
    }
    // approximate sunset hour (local) by month
    const approxByMonth: Record<number, number> = {1:17,2:17,3:18,4:19,5:20,6:20,7:20,8:19,9:18,10:17,11:17,12:16};
    const sunsetHour = approxByMonth[month] ?? 19;
    const goldenStart = `${sunsetHour - 1}:00`;
    const goldenEnd = `${sunsetHour}:00`;
    const q = encodeURIComponent(city || dateStr || '');
    const lookup = `https://www.timeanddate.com/sunset/?query=${q}`;
    return { date: dateStr, city, approx_sunset_hour: sunsetHour, golden_hour: `${goldenStart} - ${goldenEnd}`, lookup };
  }
};

// shuttle-frequency-planner
calculators["shuttle-frequency-planner"] = {
  schema: {
    id: "shuttle-frequency-planner",
    title: "Shuttle Frequency Planner",
    desc: "Estimate loops or vehicles needed to meet wait-time goals.",
    fields: [
      { name: "guests", label: "Guests to move", type: "number", default: 200, step: 1 },
      { name: "vehicleCap", label: "Vehicle capacity", type: "number", default: 50, step: 1 },
      { name: "desiredMaxWaitMin", label: "Desired max wait (min)", type: "number", default: 15, step: 1 },
    ],
  },
  calc: (i) => {
    const guests = Math.max(1, Math.floor(Number(i.guests) || 1));
    const cap = Math.max(1, Math.floor(Number(i.vehicleCap) || 1));
    const wait = Math.max(1, Number(i.desiredMaxWaitMin) || 15);
    // assume single loop (round trip) takes 30 minutes by default
    const loopMins = 30;
    const vehiclesNeeded = Math.ceil((guests / cap) * (wait / loopMins));
    const headway = Math.max(1, Math.round((loopMins / Math.max(1, vehiclesNeeded))));
    return { guests, vehicleCap: cap, vehiclesNeeded, estimated_headway_min: headway };
  }
};

// venue-coordination-script (simple generated checklist/script)
calculators["venue-coordination-script"] = {
  schema: {
    id: "venue-coordination-script",
    title: "Venue Coordination Script",
    desc: "Generate a short call/script for coordinating with venue staff.",
    fields: [
      { name: "contactName", label: "Venue contact name", type: "text", default: "" },
      { name: "stagingMinutes", label: "Staging time (min)", type: "number", default: 30, step: 5 },
    ],
  },
  calc: (i) => {
    const name = String(i.contactName || '');
    const staging = Math.max(0, Number(i.stagingMinutes) || 30);
    const script = `Hi ${name || 'there'}, this is your vendor checking in. We'll arrive ${staging} minutes before the first pickup. Can you confirm staging area, entrance procedure, any load-in restrictions, and a best contact number for day-of? Also please confirm any venue-specific fees or preferred drop points.`;
    return { contactName: name, stagingMinutes: staging, script };
  }
};

// curbside-drop-strategy
calculators["curbside-drop-strategy"] = {
  schema: {
    id: "curbside-drop-strategy",
    title: "Curbside Drop Strategy",
    desc: "Suggest drop/pick spots and turnaround guidance.",
    fields: [
      { name: "curbWidthFt", label: "Curb width (ft)", type: "number", default: 10, step: 1 },
      { name: "vehicleLengthFt", label: "Vehicle length (ft)", type: "number", default: 40, step: 1 },
    ],
  },
  calc: (i) => {
    const curb = Number(i.curbWidthFt) || 0;
    const len = Number(i.vehicleLengthFt) || 0;
    const canParallel = curb >= 8;
    const recommended = canParallel ? 'Parallel curb pickup with quick passenger unload' : 'Single-lane staggered pickup; use offload area and move vehicle to staging after unload';
    const notes = [] as string[];
    if (len > 45) notes.push('Large vehicle: check for no-parking zones and turn radius');
    if (curb < 6) notes.push('Narrow curb: consider valet or temporary pull-in');
    return { curbWidthFt: curb, vehicleLengthFt: len, recommended, notes };
  }
};

// stadium-concert-playbook
calculators["stadium-concert-playbook"] = {
  schema: {
    id: "stadium-concert-playbook",
    title: "Stadium/Concert Playbook",
    desc: "Quick playbook for events with stadium logistics.",
    fields: [
      { name: "eventType", label: "Event type", type: "select", options: ["Concert","Sport","Festival"], default: "Concert" },
      { name: "expectedExitMin", label: "Expected mass exit time (min)", type: "number", default: 20, step: 5 },
    ],
  },
  calc: (i) => {
    const t = String(i.eventType || 'Concert');
    const exitMin = Math.max(0, Number(i.expectedExitMin) || 20);
    const tips: string[] = [];
    tips.push('Confirm vendor/parking pass and staging gate.');
    if (t === 'Concert') tips.push('Expect heavy foot traffic; stage pickups 20-40 minutes after end to avoid crush.');
    if (t === 'Sport') tips.push('Coordinate with traffic control; consider holding area for buses.');
    tips.push(`Plan for ${exitMin} minute mass egress; allow additional buffer for congestion.`);
    return { eventType: t, expectedExitMin: exitMin, tips };
  }
};

// --- Second batch additions ---

// airport-transfer-wizard
calculators["airport-transfer-wizard"] = {
  schema: {
    id: "airport-transfer-wizard",
    title: "Airport Transfer Wizard",
    desc: "Terminal rules & timing guidance for airport transfers.",
    fields: [
      { name: "flightType", label: "Flight type", type: "select", options: ["Arrival","Departure"], default: "Arrival" },
      { name: "terminals", label: "Terminal count", type: "number", default: 1, step: 1 },
      { name: "passengers", label: "Passengers", type: "number", default: 4, step: 1 },
    ],
  },
  calc: (i) => {
    const ft = String(i.flightType || 'Arrival');
    const terms = Math.max(1, Math.floor(Number(i.terminals) || 1));
    const p = Math.max(1, Math.floor(Number(i.passengers) || 1));
    // Heuristic buffers
    const bufferMin = ft === 'Arrival' ? 30 + terms * 5 : 60 + terms * 5;
    const meetPoint = ft === 'Arrival' ? 'Baggage claim / designated curb' : 'Terminal curb; confirm drop-off lane rules';
    return { flightType: ft, terminals: terms, passengers: p, recommended_buffer_minutes: bufferMin, meetPoint };
  }
};

// trailer-add-on-recommender
calculators["trailer-add-on-recommender"] = {
  schema: {
    id: "trailer-add-on-recommender",
    title: "Trailer Add-On Recommender",
    desc: "Recommend trailer add-ons for luggage or gear.",
    fields: [
      { name: "bags", label: "Number of large bags", type: "number", default: 8, step: 1 },
      { name: "instruments", label: "Instruments/gear count", type: "number", default: 1, step: 1 },
    ],
  },
  calc: (i) => {
    const bags = Math.max(0, Math.floor(Number(i.bags) || 0));
    const gear = Math.max(0, Math.floor(Number(i.instruments) || 0));
    const needsTrailer = bags + (gear * 2) > 6; // heuristic
    const suggested = needsTrailer ? (bags + gear <= 12 ? 'Small trailer' : 'Large trailer') : 'No trailer needed';
    const estFee = needsTrailer ? (bags + gear) * 2 : 0;
    return { bags, instruments: gear, needsTrailer, suggested, estFee }; 
  }
};

// alcohol-open-container-policy-checker
calculators["alcohol-open-container-policy-checker"] = {
  schema: {
    id: "alcohol-open-container-policy-checker",
    title: "Alcohol/Open-Container Policy Checker",
    desc: "Simple guidance placeholder for open-container rules by state/city.",
    fields: [
      { name: "location", label: "City or State", type: "text", default: "" },
    ],
  },
  calc: (i) => {
    const loc = String(i.location || '');
    // Placeholder: can't provide legal advice; encourage verification
    return { location: loc, note: 'Check local ordinances. This is a guidance placeholder; consult official sources.' };
  }
};

// family-minors-policy-advisor
calculators["family-minors-policy-advisor"] = {
  schema: {
    id: "family-minors-policy-advisor",
    title: "Family & Minors Policy Advisor",
    desc: "Suggest supervision and car seat needs for minors.",
    fields: [
      { name: "minors", label: "Number of minors", type: "number", default: 2, step: 1 },
      { name: "under2", label: "Under 2 years old", type: "number", default: 0, step: 1 },
    ],
  },
  calc: (i) => {
    const minors = Math.max(0, Math.floor(Number(i.minors) || 0));
    const under2 = Math.max(0, Math.floor(Number(i.under2) || 0));
    const carSeatsNeeded = under2; // conservative
    const supervisionRatio = minors > 0 ? Math.ceil(minors / 4) : 0; // one adult per 4 minors
    return { minors, under2, carSeatsNeeded, recommended_supervisors: supervisionRatio };
  }
};

// driver-break-compliance-planner (heuristic schedule)
calculators["driver-break-compliance-planner"] = {
  schema: {
    id: "driver-break-compliance-planner",
    title: "Driver Break & Compliance Planner",
    desc: "Heuristic planner for driver rest windows (not legal advice).",
    fields: [
      { name: "totalDriveHours", label: "Total driving hours", type: "number", default: 8, step: 0.5 },
      { name: "hasMultipleDrivers", label: "Multiple drivers?", type: "select", options: ["No","Yes"], default: "No" },
    ],
  },
  calc: (i) => {
    const hrs = Math.max(0, Number(i.totalDriveHours) || 0);
    const multi = String(i.hasMultipleDrivers || 'No') === 'Yes';
    // Simple heuristic: 15min break every 2 hours; 30-45min after 4 hours
    const breaks = [] as { afterHours: number; lengthMin: number }[];
    for (let t = 2; t <= Math.ceil(hrs); t += 2) {
      breaks.push({ afterHours: t, lengthMin: t % 4 === 0 ? 30 : 15 });
    }
    const note = multi ? 'Multiple drivers reduce single-driver fatigue; confirm company policies.' : 'This is a guide only; follow local regulations.';
    return { totalDriveHours: hrs, breaks, note };
  }
};

// noise-curfew-checker
calculators["noise-curfew-checker"] = {
  schema: {
    id: "noise-curfew-checker",
    title: "Noise Curfew Checker",
    desc: "Check if planned activity may violate typical local curfews.",
    fields: [
      { name: "eventEndHour24", label: "Expected end hour (24h)", type: "number", default: 23, step: 1 },
      { name: "typicalCurfewHour", label: "Typical curfew hour", type: "number", default: 22, step: 1 },
    ],
  },
  calc: (i) => {
    const end = Math.max(0, Math.min(23, Number(i.eventEndHour24) || 23));
    const curfew = Math.max(0, Math.min(23, Number(i.typicalCurfewHour) || 22));
    const risk = end > curfew ? 'high' : (end === curfew ? 'medium' : 'low');
    return { eventEndHour24: end, typicalCurfewHour: curfew, risk };
  }
};

// cleaning-fee-risk-checker
calculators["cleaning-fee-risk-checker"] = {
  schema: {
    id: "cleaning-fee-risk-checker",
    title: "Cleaning Fee Risk Checker",
    desc: "Estimate cleaning risk and suggested fee based on event features.",
    fields: [
      { name: "hasConfetti", label: "Confetti/Glitter?", type: "select", options: ["No","Yes"], default: "No" },
      { name: "hasSmoke", label: "Smoke effects?", type: "select", options: ["No","Yes"], default: "No" },
      { name: "expectedMessLevel", label: "Expected mess (1-5)", type: "number", default: 2, step: 1 },
    ],
  },
  calc: (i) => {
    const conf = String(i.hasConfetti || 'No') === 'Yes';
    const smoke = String(i.hasSmoke || 'No') === 'Yes';
    const level = Math.max(1, Math.min(5, Math.floor(Number(i.expectedMessLevel) || 2)));
    let baseFee = level * 25;
    if (conf) baseFee += 100;
    if (smoke) baseFee += 50;
    return { confetti: conf, smoke, expectedMessLevel: level, suggestedCleaningFee: baseFee };
  }
};

// decorations-policy-checker
calculators["decorations-policy-checker"] = {
  schema: {
    id: "decorations-policy-checker",
    title: "Decorations Policy Checker",
    desc: "Quick guidance on common decoration restrictions.",
    fields: [
      { name: "decorationType", label: "Decoration type", type: "select", options: ["Balloons","Candles","Confetti","Hanging Decorations"], default: "Balloons" },
    ],
  },
  calc: (i) => {
    const dt = String(i.decorationType || 'Balloons');
    const allowed = dt === 'Balloons' || dt === 'Hanging Decorations';
    const notes = allowed ? 'Generally allowed but confirm with venue.' : 'Often restricted; check fire codes and venue policy.';
    return { decorationType: dt, allowed, notes };
  }
};

// pet-policy-checker
calculators["pet-policy-checker"] = {
  schema: {
    id: "pet-policy-checker",
    title: "Pet Policy Checker",
    desc: "Decide whether pets are allowed and suggested fees or restrictions.",
    fields: [
      { name: "pets", label: "Number of pets", type: "number", default: 0, step: 1 },
      { name: "serviceAnimals", label: "Service animals only?", type: "select", options: ["No","Yes"], default: "No" },
    ],
  },
  calc: (i) => {
    const pets = Math.max(0, Math.floor(Number(i.pets) || 0));
    const service = String(i.serviceAnimals || 'No') === 'Yes';
    const allowed = service || pets <= 2;
    const suggestedFee = allowed && !service && pets > 0 ? pets * 20 : 0;
    return { pets, serviceAnimals: service, allowed, suggestedFee };
  }
};

// ada-accessibility-checker
calculators["ada-accessibility-checker"] = {
  schema: {
    id: "ada-accessibility-checker",
    title: "ADA Accessibility Checker",
    desc: "Simple checklist for lifts, steps, and aisle clearance.",
    fields: [
      { name: "hasLift", label: "Has lift?", type: "select", options: ["No","Yes"], default: "No" },
      { name: "steps", label: "Number of steps to board", type: "number", default: 0, step: 1 },
    ],
  },
  calc: (i) => {
    const lift = String(i.hasLift || 'No') === 'Yes';
    const steps = Math.max(0, Math.floor(Number(i.steps) || 0));
    const accessible = lift || steps === 0;
    const notes = accessible ? 'Accessible for most riders' : 'May need ramp or lift; verify vehicle specs.';
    return { hasLift: lift, steps, accessible, notes };
  }
};

// --- Third batch additions ---

// seat-fit
calculators["seat-fit"] = {
  schema: {
    id: "seat-fit",
    title: "Seat Fit Advisor",
    desc: "Estimate comfort per passenger based on vehicle and group size.",
    fields: [
      { name: "vehicleType", label: "Vehicle type", type: "select", options: ["Sedan","Limo","Party Bus","Coach"], default: "Party Bus" },
      { name: "passengers", label: "Passengers", type: "number", default: 12, step: 1 },
    ],
  },
  calc: (i) => {
    const vt = String(i.vehicleType || 'Party Bus');
    const p = Math.max(1, Math.floor(Number(i.passengers) || 1));
    const capacities: Record<string, number> = { Sedan: 4, Limo: 12, 'Party Bus': 20, Coach: 50 };
    const cap = capacities[vt] ?? 20;
    const comfort = cap >= p ? 'comfortable' : cap >= p - 4 ? 'tight' : 'overflow';
    return { vehicleType: vt, passengers: p, capacity: cap, comfort };
  }
};

// seating-map-designer (simple row estimate)
calculators["seating-map-designer"] = {
  schema: {
    id: "seating-map-designer",
    title: "Seating Map Designer",
    desc: "Generate a simple row/seat layout suggestion.",
    fields: [
      { name: "vehicleType", label: "Vehicle type", type: "select", options: ["Party Bus","Coach","Limo"], default: "Party Bus" },
      { name: "passengers", label: "Passengers", type: "number", default: 20, step: 1 },
    ],
  },
  calc: (i) => {
    const vt = String(i.vehicleType || 'Party Bus');
    const p = Math.max(1, Math.floor(Number(i.passengers) || 1));
    // heuristic rows
    const seatsPerRow = vt === 'Coach' ? 4 : vt === 'Limo' ? 2 : 6;
    const rows = Math.ceil(p / seatsPerRow);
    return { vehicleType: vt, passengers: p, seatsPerRow, rows, layout: `${rows} rows x ${seatsPerRow} seats` };
  }
};

// capacity-overflow-planner
calculators["capacity-overflow-planner"] = {
  schema: {
    id: "capacity-overflow-planner",
    title: "Capacity Overflow Planner",
    desc: "Decide when to book multiple vehicles vs upgrade.",
    fields: [
      { name: "groupSize", label: "Group size", type: "number", default: 45, step: 1 },
      { name: "options", label: "Preferred option", type: "select", options: ["Upgrade","Split"], default: "Split" },
    ],
  },
  calc: (i) => {
    const g = Math.max(1, Math.floor(Number(i.groupSize) || 1));
    const opt = String(i.options || 'Split');
    if (opt === 'Upgrade') return { recommended: g <= 30 ? 'Party Bus 30' : 'Coach' };
    const busCap = 30;
    const needed = Math.ceil(g / busCap);
    return { groupSize: g, option: opt, vehiclesNeeded: needed, perVehicle: busCap };
  }
};

// luggage-gear-fit-guide
calculators["luggage-gear-fit-guide"] = {
  schema: {
    id: "luggage-gear-fit-guide",
    title: "Luggage & Gear Fit Guide",
    desc: "Estimate whether gear fits onboard or needs trailer.",
    fields: [
      { name: "largeBags", label: "Large bags", type: "number", default: 6, step: 1 },
      { name: "coolers", label: "Coolers", type: "number", default: 2, step: 1 },
    ],
  },
  calc: (i) => {
    const bags = Math.max(0, Math.floor(Number(i.largeBags) || 0));
    const coolers = Math.max(0, Math.floor(Number(i.coolers) || 0));
    const cargoUnits = bags + coolers;
    const fits = cargoUnits <= 10;
    const suggestion = fits ? 'Fits onboard' : 'Consider trailer or extra vehicle';
    return { largeBags: bags, coolers, cargoUnits, fits, suggestion };
  }
};

// byob-ice
calculators["byob-ice"] = {
  schema: {
    id: "byob-ice",
    title: "BYOB & Ice Planner",
    desc: "Estimate ice and drink counts per person.",
    fields: [
      { name: "people", label: "People", type: "number", default: 20, step: 1 },
      { name: "hours", label: "Hours", type: "number", default: 4, step: 0.5 },
    ],
  },
  calc: (i) => {
    const people = Math.max(1, Math.floor(Number(i.people) || 1));
    const hours = Math.max(0.5, Number(i.hours) || 1);
    const drinksPerPerson = Math.ceil(hours * 1.5);
    const totalDrinks = drinksPerPerson * people;
    const icePounds = Math.ceil(people * (hours * 0.5 + 1));
    return { people, hours, drinksPerPerson, totalDrinks, icePounds };
  }
};

// qr-playlist-generator (returns a data object for QR generation)
calculators["qr-playlist-generator"] = {
  schema: {
    id: "qr-playlist-generator",
    title: "QR Playlist Generator",
    desc: "Return a shareable playlist URL and QR payload (no external QR lib).",
    fields: [
      { name: "playlistUrl", label: "Playlist URL", type: "text", default: "" },
    ],
  },
  calc: (i) => {
    const url = String(i.playlistUrl || '');
    const payload = url ? { qrPayload: url, shortCode: url.slice(0, 30) } : { error: 'Provide a playlist URL' };
    return payload;
  }
};

// lighting-theme-selector
calculators["lighting-theme-selector"] = {
  schema: {
    id: "lighting-theme-selector",
    title: "Lighting & Theme Selector",
    desc: "Suggest interior lighting presets.",
    fields: [
      { name: "mood", label: "Mood", type: "select", options: ["Chill","Party","Romantic","Concert"], default: "Party" },
    ],
  },
  calc: (i) => {
    const mood = String(i.mood || 'Party');
    const presets: Record<string, string> = { Chill: 'Blue low', Party: 'RGB cycle', Romantic: 'Warm amber', Concert: 'Strobe-safe warm' };
    return { mood, preset: presets[mood] ?? 'Custom' };
  }
};

// scenic-photo-stop-recommender
calculators["scenic-photo-stop-recommender"] = {
  schema: {
    id: "scenic-photo-stop-recommender",
    title: "Scenic Photo-Stop Recommender",
    desc: "Suggest stop timing and quick photo tips (placeholder).",
    fields: [
      { name: "routeMiles", label: "Route miles", type: "number", default: 25, step: 1 },
      { name: "stops", label: "Desired stops", type: "number", default: 2, step: 1 },
    ],
  },
  calc: (i) => {
    const miles = Math.max(0, Number(i.routeMiles) || 0);
    const stops = Math.max(0, Math.floor(Number(i.stops) || 0));
    const tips = stops > 0 ? `Plan ~${Math.max(5, Math.round(miles / (stops + 1)))} minutes per photo stop; look for pullouts with views.` : 'No stops requested';
    return { routeMiles: miles, stops, tips };
  }
};

// comfort-planner
calculators["comfort-planner"] = {
  schema: {
    id: "comfort-planner",
    title: "Comfort Planner",
    desc: "Basic comfort guidance: climate, hydration, attire.",
    fields: [
      { name: "temperatureF", label: "Temperature (F)", type: "number", default: 75, step: 1 },
      { name: "durationHours", label: "Duration (hours)", type: "number", default: 4, step: 0.5 },
    ],
  },
  calc: (i) => {
    const t = Number(i.temperatureF) || 75;
    const d = Math.max(0.5, Number(i.durationHours) || 1);
    const advice: string[] = [];
    if (t >= 85) advice.push('Use AC and extra water; warn guests about heat.');
    if (t <= 50) advice.push('Recommend jackets and consider heater options.');
    if (d >= 3) advice.push('Plan for restroom breaks and snack access.');
    if (advice.length === 0) advice.push('Standard comfort: light layers and water.');
    return { temperatureF: t, durationHours: d, advice };
  }
};

// weather-alert (basic severity guidance)
calculators["weather-alert"] = {
  schema: {
    id: "weather-alert",
    title: "Weather Alert",
    desc: "Simple weather impact advisory (placeholder; use real API for production).",
    fields: [
      { name: "chancePrecipPct", label: "Chance of precipitation %", type: "number", default: 20, step: 1 },
      { name: "windMph", label: "Wind (mph)", type: "number", default: 8, step: 1 },
    ],
  },
  calc: (i) => {
    const c = Math.max(0, Math.min(100, Number(i.chancePrecipPct) || 0));
    const w = Math.max(0, Number(i.windMph) || 0);
    let impact = 'low';
    if (c >= 60 || w >= 25) impact = 'high';
    else if (c >= 30 || w >= 15) impact = 'moderate';
    return { chancePrecipPct: c, windMph: w, impact };
  }
};

// group-rsvp-headcount-tracker
calculators["group-rsvp-headcount-tracker"] = {
  schema: {
    id: "group-rsvp-headcount-tracker",
    title: "Group RSVP & Headcount Tracker",
    desc: "Estimate expected attendees from RSVPs and track buffer needs.",
    fields: [
      { name: "invited", label: "Invited count", type: "number", default: 50, step: 1 },
      { name: "rsvpPct", label: "RSVP %", type: "number", default: 60, step: 1 },
      { name: "noShowPct", label: "Expected no-show %", type: "number", default: 10, step: 1 },
    ],
  },
  calc: (i) => {
    const invited = Math.max(0, Math.floor(Number(i.invited) || 0));
    const rsvpPct = Math.max(0, Math.min(100, Number(i.rsvpPct) || 0));
    const noShow = Math.max(0, Math.min(100, Number(i.noShowPct) || 0));
    const rsvps = Math.round(invited * (rsvpPct / 100));
    const expected = Math.round(rsvps * (1 - noShow / 100));
    const buffer = Math.ceil(expected * 0.1);
    return { invited, rsvpPct, noShowPct: noShow, rsvps, expectedAttendees: expected, suggestedBuffer: buffer };
  }
};

// pickup-readiness-checklist
calculators["pickup-readiness-checklist"] = {
  schema: {
    id: "pickup-readiness-checklist",
    title: "Pickup Readiness Checklist",
    desc: "Checklist for guests to be ready at pickup (IDs, attire, ice, chargers).",
    fields: [
      { name: "people", label: "People", type: "number", default: 10, step: 1 },
      { name: "hasDrinks", label: "Bringing drinks?", type: "select", options: ["No","Yes"], default: "Yes" },
    ],
  },
  calc: (i) => {
    const people = Math.max(1, Math.floor(Number(i.people) || 1));
    const drinks = String(i.hasDrinks || 'Yes') === 'Yes';
    const items = [
      'Bring ID if required by operator',
      'Arrive at pickup point 5-10 minutes early',
      'Have payment/contact info ready',
      'Wear appropriate footwear for your event',
    ];
    if (drinks) items.push('Secure drinks and coolers; avoid open containers unless allowed');
    if (people > 12) items.push('Assign a group leader to coordinate boarding');
    return { people, hasDrinks: drinks, checklist: items };
  }
};

// wedding-timeline-builder
calculators["wedding-timeline-builder"] = {
  schema: {
    id: "wedding-timeline-builder",
    title: "Wedding Timeline Builder",
    desc: "Build a simple ceremony → photos → reception flow with timings.",
    fields: [
      { name: "ceremonyStart", label: "Ceremony start (HH:MM)", type: "text", default: "15:00" },
      { name: "travelMin", label: "Travel between locations (min)", type: "number", default: 20, step: 1 },
      { name: "photosMin", label: "Photo session (min)", type: "number", default: 60, step: 5 },
      { name: "receptionStart", label: "Reception start (HH:MM, optional)", type: "text", default: "" },
    ],
  },
  calc: (i) => {
    const ceremony = String(i.ceremonyStart || '15:00');
    const travel = Math.max(0, Number(i.travelMin) || 0);
    const photos = Math.max(0, Number(i.photosMin) || 0);
    const reception = String(i.receptionStart || '');
    // parse ceremony time
    const [ch, cm] = ceremony.split(':').map(s => Number(s) || 0);
    const ceremonyEnd = new Date(); ceremonyEnd.setHours(ch); ceremonyEnd.setMinutes(cm + 30); // assume 30min ceremony
    const photoStart = new Date(ceremonyEnd.getTime() + travel * 60000);
    const photoEnd = new Date(photoStart.getTime() + photos * 60000);
    const suggested = {
      ceremonyStart: ceremony,
      ceremonyEnd: `${ceremonyEnd.getHours().toString().padStart(2,'0')}:${ceremonyEnd.getMinutes().toString().padStart(2,'0')}`,
      photoStart: `${photoStart.getHours().toString().padStart(2,'0')}:${photoStart.getMinutes().toString().padStart(2,'0')}`,
      photoEnd: `${photoEnd.getHours().toString().padStart(2,'0')}:${photoEnd.getMinutes().toString().padStart(2,'0')}`,
      travelMinutes: travel,
      photosMinutes: photos,
      receptionStart: reception || 'TBD'
    };
    return suggested;
  }
};

// --- Placeholder stubs for registry tools that were not yet implemented ---
// These provide safe defaults so the UI can render every registry tool.
const placeholder = (id: string): { schema: ToolSchema; calc: ToolCalculator } => ({ schema: { id, title: id, fields: [] }, calc: (i: Record<string, unknown>) => ({ id, placeholder: true, inputs: i }) });

[
  'group-vibe-matcher',
  'luxury-level-selector',
  'group-discount-finder',
  'hidden-fees-detector',
  'early-booking-savings',
  'last-minute-deal-finder',
  'real-time-traffic-adjuster',
  'nighttime-route-safety',
  'cross-city-route-planner',
  'parking-availability-finder',
  'rush-hour-avoidance',
  'onboard-entertainment-planner',
  'custom-signage-creator',
  'food-stop-recommender',
  'multi-event-day-planner',
  'guest-communication-hub',
  'vehicle-amenities-filter',
  'venue-parking-permit',
  'large-group-staging',
  'event-exit-strategy',
  'vip-drop-off-coordinator',
  'luggage-transfer-scheduler',
  'venue-accessibility-map',
  'smoking-policy-verifier',
  'emergency-evacuation-planner',
  'child-seat-fit-guide',
  'oversized-gear-planner',
  'seating-accessibility-optimizer',
  'group-size-flex-calculator',
  'hello-world'
].forEach(id => { if (!calculators[id]) calculators[id] = placeholder(id); });

// === tools-runtime helpers (append after all calculators are defined) ===
export type FieldValue = string | number | undefined | null;

export type ValidationResult = {
  ok: boolean;
  errors: string[];
  normalized: Record<string, unknown>;
};

const isFiniteNumber = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);

const toNumber = (v: FieldValue): number | undefined => {
  if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
};

const coerceSelect = (
  value: FieldValue,
  options: string[] | undefined,
  fallback?: FieldValue
): string | undefined => {
  if (!options || options.length === 0) {
    return typeof value === "string" ? value : typeof fallback === "string" ? fallback : undefined;
  }
  const str = String(value ?? "");
  if (options.includes(str)) return str;
  const fb = typeof fallback === "string" ? fallback : undefined;
  return fb ?? options[0];
};

export const normalizeInputs = (schema: ToolSchema, raw: Record<string, unknown>) => {
  const out: Record<string, unknown> = {};
  for (const f of schema.fields || []) {
    const incoming = raw?.[f.name];
    const base = incoming ?? f.default;

    if (f.type === "number") {
      const n = toNumber(base);
      out[f.name] = n ?? 0;
      continue;
    }
    if (f.type === "select") {
      out[f.name] = coerceSelect(base, f.options, f.default);
      continue;
    }
    out[f.name] = base == null ? "" : String(base); // text
  }
  for (const k of Object.keys(raw || {})) if (!(k in out)) out[k] = (raw as Record<string, unknown>)[k];
  return out;
};

export const validateInputs = (schema: ToolSchema, raw: Record<string, unknown>): ValidationResult => {
  const errors: string[] = [];
  const normalized = normalizeInputs(schema, raw);

  for (const f of schema.fields || []) {
    const v = normalized[f.name];
    if (f.type === "number" && !isFiniteNumber(v)) errors.push(`"${f.label}" must be a number.`);
    if (f.type === "select" && f.options?.length && !f.options.includes(String(v ?? ""))) {
      errors.push(`"${f.label}" must be one of: ${f.options.join(", ")}.`);
    }
  }
  return { ok: errors.length === 0, errors, normalized };
};

export const toolSchemas: Record<string, ToolSchema> = Object.fromEntries(
  Object.entries(calculators).map(([id, def]) => [id, def.schema])
);

export const listTools = (): ToolSchema[] => Object.values(toolSchemas);

export const getTool = (id: string):
  | { id: string; schema: ToolSchema; calc: ToolCalculator }
  | undefined => {
  const def = calculators[id];
  if (!def) return undefined;
  return { id, schema: def.schema, calc: def.calc };
};

export const runTool = (id: string, rawInputs: Record<string, unknown>) => {
  const tool = getTool(id);
  if (!tool) throw new Error(`Unknown tool: "${id}".`);
  const { schema, calc } = tool;
  const validation = validateInputs(schema, rawInputs);
  if (!validation.ok) {
    const msg = `Invalid inputs for "${schema.title}":\n- ${validation.errors.join("\n- ")}`;
    const err = new Error(msg) as Error & { details?: ValidationResult };
    err.details = validation;
    throw err;
  }
  return {
    id,
    title: schema.title,
    desc: schema.desc,
    inputs: validation.normalized,
    result: calc(validation.normalized),
  };
};

export const TOOL_TITLES: Record<string, string> =
  Object.fromEntries(Object.values(toolSchemas).map((s) => [s.id, s.title]));

export default calculators;
