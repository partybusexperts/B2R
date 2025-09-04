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

export default calculators;
