import { OptimizedImageEntry } from '../utils/optimizedImages';

// Vehicle categories align to manifest folder keys (friendly names documented here)
export type VehicleCategory = 'party-buses' | 'limousines' | 'coach-buses';

export interface VehicleSpec {
  id: string;                // stable slug id
  name: string;
  category: VehicleCategory;
  capacityMin: number;
  capacityMax: number;
  highlights: string[];      // bullet points to show under card
  imageFile: string;         // exact original filename (basename only or with spaces) present in manifest
  badge?: string;
  order: number;             // display ordering
  alt?: string;              // optional custom alt; fallback to name
}

// NOTE: Keep filenames exactly matching originals so findByFileName works; no path prefix needed.
export const VEHICLES: VehicleSpec[] = [
  // Party Buses (choose higher‑res exterior/interior reps; replace / expand as real inventory grows)
  {
    id: 'party-sprinter-14',
    name: 'Mercedes Sprinter Party Bus (14 Pax)',
    category: 'party-buses',
    capacityMin: 12,
    capacityMax: 14,
    highlights: ['Wrap-around seating', 'Bluetooth sound', 'LED ceiling'],
    imageFile: '18 Passenger Party Bus Interior.png',
    badge: 'Popular',
    order: 10
  },
  {
    id: 'party-lux-26',
    name: 'Luxury Party Bus (24–26 Pax)',
    category: 'party-buses',
    capacityMin: 24,
    capacityMax: 26,
    highlights: ['Dance lighting', 'BYOB-friendly', 'Dual coolers'],
    imageFile: '18 Passenger Party Bus White Exterior.png',
    order: 20
  },
  {
    id: 'party-exec-34',
    name: 'Executive Party Bus (30–34 Pax)',
    category: 'party-buses',
    capacityMin: 30,
    capacityMax: 34,
    highlights: ['USB charging', 'Spacious interior', 'TV screens'],
    imageFile: '36 Passenger Party Bus Exterior 4.png',
    order: 30
  },
  {
    id: 'party-mega-45',
    name: 'Mega Party Bus (40–45 Pax)',
    category: 'party-buses',
    capacityMin: 40,
    capacityMax: 45,
    highlights: ['Restroom (select)', 'Subwoofer system', 'Ambient LEDs'],
    imageFile: 'Bus-4.png',
    order: 40
  },
  // Limousines
  {
    id: 'limo-hummer-18',
    name: 'H2 Hummer Stretch Limousine (18 Pax)',
    category: 'limousines',
    capacityMin: 16,
    capacityMax: 18,
    highlights: ['Premium sound', 'Bar setup', 'Disco lighting'],
    imageFile: '18 Passenger Hummer Limo Exterior.png',
    badge: 'Iconic',
    order: 10
  },
  {
    id: 'limo-esc-18',
    name: 'Cadillac Escalade Limo (18 Pax)',
    category: 'limousines',
    capacityMin: 16,
    capacityMax: 18,
    highlights: ['Leather seating', 'Mood lighting', 'Premium sound'],
    imageFile: '18 Passenger Cadillac Escalade Limo Exterior.png',
    order: 20
  },
  {
    id: 'limo-chrysler-300-10',
    name: 'Chrysler 300 Limo (10 Pax)',
    category: 'limousines',
    capacityMin: 8,
    capacityMax: 10,
    highlights: ['Elegant interior', 'Bar area', 'LED accents'],
    imageFile: '10 Passenger Chrysler 300 Limo Exterior.png',
    order: 30
  },
  // Coach Buses
  {
    id: 'coach-mini-28',
    name: 'Mini Coach (22–28 Pax)',
    category: 'coach-buses',
    capacityMin: 22,
    capacityMax: 28,
    highlights: ['Forward seating', 'Comfort ride', 'Great for tours'],
    imageFile: 'Bus-2.png',
    order: 10
  },
  {
    id: 'coach-standard-40',
    name: 'Coach Bus (40 Pax)',
    category: 'coach-buses',
    capacityMin: 38,
    capacityMax: 40,
    highlights: ['Reclining seats', 'Overhead storage', 'A/C climate'],
    imageFile: 'Bus-5.png',
    order: 20
  },
  {
    id: 'coach-full-56',
    name: 'Full Size Coach (56 Pax)',
    category: 'coach-buses',
    capacityMin: 50,
    capacityMax: 56,
    highlights: ['Restroom', 'Luggage bays', 'PA system'],
    imageFile: 'Bus-3.png',
    order: 30
  }
];

export function vehiclesByCategory(category: VehicleCategory): VehicleSpec[] {
  return VEHICLES.filter(v => v.category === category).sort((a,b)=>a.order-b.order);
}

export interface ResolvedVehicle extends VehicleSpec {
  imageEntry?: OptimizedImageEntry;
  imageTooSmall?: boolean; // flagged if image < 800 width
}

// Resolve manifest entries for quick reuse in components (optional runtime helper)
export function resolveVehicles(findByFileName: (f: string)=>OptimizedImageEntry|undefined, minWidth = 800): ResolvedVehicle[] {
  return VEHICLES.map(v => {
    const entry = findByFileName(v.imageFile);
    if (!entry) return { ...v, imageEntry: undefined, imageTooSmall: true };
    return { ...v, imageEntry: entry, imageTooSmall: entry.width < minWidth };
  });
}
