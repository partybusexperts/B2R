import { OptimizedImageEntry } from '../utils/optimizedImages';

// Vehicle categories align to manifest folder keys (friendly names documented here)
export type VehicleCategory = 'party-buses' | 'limousines' | 'coach-buses';

export interface VehicleImageRef {
  file: string; // original filename (basename, matches manifest)
  role?: 'exterior' | 'interior' | 'feature';
  primary?: boolean; // mark the one to show on card; first exterior by default
  alt?: string; // optional override per image
}

export interface VehicleSpec {
  id: string;                // stable slug id
  name: string;
  category: VehicleCategory;
  capacityMin: number;
  capacityMax: number;
  highlights: string[];      // bullet points to show under card
  images: VehicleImageRef[]; // one or more image refs
  badge?: string;
  order: number;             // display ordering
  alt?: string;              // optional custom alt for primary card context
}

// NOTE: Keep filenames exactly matching originals so findByFileName works; no path prefix needed.
export const VEHICLES: VehicleSpec[] = [
  // Party Buses (choose higher‑res exterior/interior reps; replace / expand as real inventory grows)
  {
    id: 'party-sprinter-14',
    name: 'Mercedes Sprinter Party Bus (14 Pass)',
    category: 'party-buses',
    capacityMin: 14,
    capacityMax: 14,
    highlights: ['Wrap-around seating', 'Bluetooth Audio', 'Laser Light Show'],
    images: [
      { file: '14 Passenger Limo Style Sprinter White.png', role: 'exterior', primary: true },
      { file: '14 Passenger Sprinter Van Limo Style Inside.png', role: 'interior' }
    ],
    badge: 'Popular',
    order: 10
  },
  {
    id: 'party-lux-24',
    name: 'Luxury Party Bus (24 Pass)',
    category: 'party-buses',
    capacityMin: 24,
    capacityMax: 24,
    highlights: ['Dance lighting', 'BYOB-friendly', 'Wet Bar'],
    images: [
      { file: '24 Passenger Party Bus Exterior.jpg', role: 'exterior', primary: true },
      { file: '24 Passenger Party Bus Pink Interior.png', role: 'interior' }
    ],
    order: 20
  },
  {
    id: 'party-exec-36',
    name: '36 Passenger Party Bus (36 Pass)',
    category: 'party-buses',
    capacityMin: 36,
    capacityMax: 36,
    highlights: ['Wrap Around Seating', 'Spacious interior', 'TV screens'],
    images: [
      { file: '36 Passenger Party Bus Exterior 4.png', role: 'exterior', primary: true },
      { file: '36 Passenger Party Bus Inside.png', role: 'interior' }
    ],
    order: 30
  },
  {
    id: 'party-mega-45',
    name: 'Mega Party Bus (40–45 Pax)',
    category: 'party-buses',
    capacityMin: 40,
    capacityMax: 45,
    highlights: ['Restroom (select)', 'Subwoofer system', 'Ambient LEDs'],
    images: [
      { file: 'Bus-4.png', role: 'exterior', primary: true },
      { file: 'Bus-5.png', role: 'exterior' }
    ],
    order: 40
  },
  // Newly added party bus variants (assumption: one vehicle per distinct capacity group)
  {
    id: 'party-17',
    name: '17 Passenger Party Bus',
    category: 'party-buses',
    capacityMin: 15,
    capacityMax: 17,
    highlights: ['Compact group size', 'LED party lighting', 'Bluetooth sound'],
    images: [
      { file: '17 Passenger Black Party Bus Exterior.png', role: 'exterior', primary: true, alt: '17 passenger black party bus exterior front angle' },
      { file: '17 Passenger Party Bus Interior.png', role: 'interior', alt: '17 passenger party bus interior wrap around seating' }
    ],
    order: 50
  },
  {
    id: 'party-20',
    name: '20 Passenger Party Bus',
    category: 'party-buses',
    capacityMin: 18,
    capacityMax: 20,
    highlights: ['Color LED ceiling', 'Premium sound', 'Cooler station'],
    images: [
      { file: '20 Passenger Party Bus Exterior.png', role: 'exterior', primary: true, alt: '20 passenger party bus exterior' },
      { file: '20 Passenger Party Bus Interior 4.png', role: 'interior', alt: '20 passenger party bus interior lighting and seating' },
      { file: '20 Passenger Party Bus Black.png', role: 'exterior', alt: '20 passenger black party bus side profile' },
      { file: '20 Passenger Party Bus Pink.png', role: 'exterior', alt: '20 passenger pink party bus exterior' }
    ],
    order: 60
  },
  {
    id: 'party-24',
    name: '24 Passenger Party Bus',
    category: 'party-buses',
    capacityMin: 22,
    capacityMax: 24,
    highlights: ['Spacious layout', 'Dance lighting', 'Ice / cooler area'],
    images: [
      { file: '24 Passenger Party Bus Exterior.jpg', role: 'exterior', primary: true, alt: '24 passenger party bus exterior' },
      { file: '24 Passenger Party Bus Pink Interior.png', role: 'interior', alt: '24 passenger party bus interior pink LED lighting' }
    ],
    order: 70
  },
  {
    id: 'party-30',
    name: '30 Passenger Party Bus',
    category: 'party-buses',
    capacityMin: 28,
    capacityMax: 30,
    highlights: ['Wrap seating', 'Multiple TV screens', 'LED ceiling'],
    images: [
      { file: '30 Passenger Party Bus Exterior.png', role: 'exterior', primary: true, alt: '30 passenger party bus exterior' },
      { file: '30 Passenger Party Bus.png', role: 'exterior', alt: '30 passenger party bus alternate exterior angle' }
    ],
    order: 80
  },
  {
    id: 'party-36',
    name: '36 Passenger Party Bus',
    category: 'party-buses',
    capacityMin: 34,
    capacityMax: 36,
    highlights: ['Large cabin', 'Subwoofer audio', 'Color wash LEDs'],
    images: [
      { file: '36 Passenger Party Bus Exterior 4.png', role: 'exterior', primary: true, alt: '36 passenger party bus exterior' },
      { file: '36 Passenger Party Bus Inside.png', role: 'interior', alt: '36 passenger party bus interior seating and lighting' }
    ],
    order: 90
  },
  // Limousines
  {
    id: 'limo-hummer-18',
    name: 'H2 Hummer Stretch Limousine (18 Pax)',
    category: 'limousines',
    capacityMin: 16,
    capacityMax: 18,
    highlights: ['Premium sound', 'Bar setup', 'Disco lighting'],
    images: [
      { file: '18 Passenger Hummer Limo Exterior.png', role: 'exterior', primary: true },
      { file: '18 Passenger Hummer Limo Interior.png', role: 'interior' }
    ],
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
    images: [
      { file: '18 Passenger Cadillac Escalade Limo Exterior.png', role: 'exterior', primary: true },
      { file: '18 Passenger Hummer Limo Inside.png', role: 'interior' }
    ],
    order: 20
  },
  {
    id: 'limo-chrysler-300-10',
    name: 'Chrysler 300 Limo (10 Pax)',
    category: 'limousines',
    capacityMin: 8,
    capacityMax: 10,
    highlights: ['Elegant interior', 'Bar area', 'LED accents'],
    images: [
      { file: '10 Passenger Chrysler 300 Limo Exterior.png', role: 'exterior', primary: true },
      { file: '10 Passenger Lincoln Stretch Limo Interior.png', role: 'interior' }
    ],
    order: 30
  },
  // Newly added limousine variants
  {
    id: 'limo-lincoln-10',
    name: 'Lincoln Stretch Limo (10 Pax)',
    category: 'limousines',
    capacityMin: 8,
    capacityMax: 10,
    highlights: ['Classic style', 'Bar setup', 'Mood lighting'],
    images: [
      { file: '10 Passenger Black Lincoln Stretch Limo Exterior Black.png', role: 'exterior', primary: true, alt: '10 passenger black Lincoln stretch limo exterior' },
      { file: '10 Passenger Lincoln Stretch Limo Interior Black.png', role: 'interior', alt: '10 passenger Lincoln stretch limo interior black leather' },
      { file: '10 Passenger Lincoln Stretch Limo Interior Very Clean.png', role: 'interior', alt: '10 passenger Lincoln stretch limo interior clean leather seating' }
    ],
    order: 40
  },
  {
    id: 'limo-chrysler-12',
    name: 'Chrysler Limo (12 Pax)',
    category: 'limousines',
    capacityMin: 10,
    capacityMax: 12,
    highlights: ['Pearl white finish', 'Leather seating', 'LED ceiling'],
    images: [
      { file: '12 Passenger Chrysler Limo White.png', role: 'exterior', primary: true, alt: '12 passenger white Chrysler limousine exterior' },
      { file: '12 Passenger Chrysler Limousine Interior.png', role: 'interior', alt: '12 passenger Chrysler limousine interior seating and bar' }
    ],
    order: 50
  },
  {
    id: 'limo-excursion-16',
    name: 'Ford Excursion Limo (16 Pax)',
    category: 'limousines',
    capacityMin: 14,
    capacityMax: 16,
    highlights: ['High ceiling feel', 'Party lighting', 'Premium sound'],
    images: [
      { file: '16_Passenger_Stretch_Excursion_Exterior_optimized.jpg', role: 'exterior', primary: true, alt: '16 passenger stretch Ford Excursion limo exterior' },
      { file: '16 Passenger Ford Excursion Stretch Limo Interior.png', role: 'interior', alt: '16 passenger Ford Excursion stretch limo interior seating' },
      { file: '16 Passenger Ford Excursion Limousine Interior.png', role: 'interior', alt: '16 passenger Ford Excursion limousine interior alternate angle' }
    ],
    order: 60
  },
  {
    id: 'limo-excursion-18',
    name: 'Ford Excursion Limo (18 Pax)',
    category: 'limousines',
    capacityMin: 16,
    capacityMax: 18,
    highlights: ['Spacious cabin', 'LED lighting', 'Bar & glassware'],
    images: [
      { file: '18 Passenger Ford Excursion Limo Exterior 2.png', role: 'exterior', primary: true, alt: '18 passenger Ford Excursion limo exterior' },
      { file: '18 Passenger Ford Excursion Limo Inside.png', role: 'interior', alt: '18 passenger Ford Excursion limo interior seating and lighting' }
    ],
    order: 70
  },
  {
    id: 'limo-hummer-20-22',
    name: 'Hummer Limo (20–22 Pax)',
    category: 'limousines',
    capacityMin: 20,
    capacityMax: 22,
    highlights: ['Maximum wow factor', 'Disco ceiling', 'Multiple ice wells'],
    images: [
      { file: '20-22 Passenger Hummer Limo Black Exterior.png', role: 'exterior', primary: true, alt: '20-22 passenger black Hummer limo exterior' },
      { file: '20-22 Passenger Black Hummer Interior.png', role: 'interior', alt: '20-22 passenger black Hummer limo interior lighting' },
      { file: '20 Passenger Hummer Limousine.png', role: 'exterior', alt: '20 passenger Hummer limousine exterior alternate' },
      { file: '20 Passenger Hummer Limousine Interior.png', role: 'interior', alt: '20 passenger Hummer limousine interior seating and bar' }
    ],
    order: 80
  },
  // Coach Buses
  {
    id: 'coach-mini-28',
    name: 'Mini Coach (22–28 Pax)',
    category: 'coach-buses',
    capacityMin: 22,
    capacityMax: 28,
    highlights: ['Forward seating', 'Comfort ride', 'Great for tours'],
    images: [
      { file: 'Bus-2.png', role: 'exterior', primary: true },
      { file: 'Bus-1.png', role: 'exterior' }
    ],
    order: 10
  },
  {
    id: 'coach-standard-40',
    name: 'Coach Bus (40 Pax)',
    category: 'coach-buses',
    capacityMin: 38,
    capacityMax: 40,
    highlights: ['Reclining seats', 'Overhead storage', 'A/C climate'],
    images: [
      { file: 'Bus-5.png', role: 'exterior', primary: true },
      { file: 'Bus-3.png', role: 'exterior' }
    ],
    order: 20
  },
  {
    id: 'coach-full-56',
    name: 'Full Size Coach (56 Pax)',
    category: 'coach-buses',
    capacityMin: 50,
    capacityMax: 56,
    highlights: ['Restroom', 'Luggage bays', 'PA system'],
    images: [
      { file: 'Bus-3.png', role: 'exterior', primary: true },
      { file: 'Bus-4.png', role: 'exterior' }
    ],
    order: 30
  }
  ,
  // Newly added coach bus capacity variants (ascending by size; order values fill gaps)
  {
    id: 'coach-47',
    name: 'Coach Bus (47 Pax)',
    category: 'coach-buses',
    capacityMin: 45,
    capacityMax: 47,
    highlights: ['Reclining seats', 'Climate control', 'Overhead storage'],
    images: [
      { file: '56 Passenger Coach Bus Exterior.png', role: 'exterior', primary: true, alt: '47 passenger coach style exterior (representative)' },
      { file: '47 Passenger Coach Bus Interior.png', role: 'interior', alt: '47 passenger coach bus interior seating rows' }
    ],
    order: 40
  },
  {
    id: 'coach-50',
    name: 'Coach Bus (50 Pax)',
    category: 'coach-buses',
    capacityMin: 48,
    capacityMax: 50,
    highlights: ['Comfort seating', 'Luggage bays', 'A/C climate'],
    images: [
      { file: '50 Passenger Exterior Coach Bus.png', role: 'exterior', primary: true, alt: '50 passenger coach bus exterior' },
      { file: '50 Passenger Coach Bus Interior.png', role: 'interior', alt: '50 passenger coach bus interior aisle view' }
    ],
    order: 45
  },
  {
    id: 'coach-54',
    name: 'Coach Bus (54 Pax)',
    category: 'coach-buses',
    capacityMin: 52,
    capacityMax: 54,
    highlights: ['High capacity', 'Reading lights', 'Climate control'],
    images: [
      { file: '54 Passenger Coach Bus.png', role: 'exterior', primary: true, alt: '54 passenger coach bus exterior' },
      { file: '54 Passenger Coach Bus Interior.png', role: 'interior', alt: '54 passenger coach bus interior seating' }
    ],
    order: 50
  },
  {
    id: 'coach-55',
    name: 'Coach Bus (55 Pax)',
    category: 'coach-buses',
    capacityMin: 53,
    capacityMax: 55,
    highlights: ['Large luggage bays', 'High back seats', 'PA system'],
    images: [
      { file: '55 Passenger Coach Bus.png', role: 'exterior', primary: true, alt: '55 passenger coach bus exterior' },
      { file: '55 Passenger Coach Bus Interior.png', role: 'interior', alt: '55 passenger coach bus interior aisle' }
    ],
    order: 55
  }
];

export function vehiclesByCategory(category: VehicleCategory): VehicleSpec[] {
  return VEHICLES.filter(v => v.category === category).sort((a,b)=>a.order-b.order);
}

export interface ResolvedVehicleImage extends VehicleImageRef {
  entry?: OptimizedImageEntry;
  tooSmall?: boolean;
}

export interface ResolvedVehicle extends Omit<VehicleSpec, 'images'> {
  images: ResolvedVehicleImage[];
  primary?: ResolvedVehicleImage;
}

// Resolve manifest entries for quick reuse in components (optional runtime helper)
export function resolveVehicles(findByFileName: (f: string)=>OptimizedImageEntry|undefined, minWidth = 800): ResolvedVehicle[] {
  return VEHICLES.map(v => {
    const resolvedImages: ResolvedVehicleImage[] = v.images.map(img => {
      const entry = findByFileName(img.file);
      return { ...img, entry, tooSmall: !entry || entry.width < minWidth };
    });
    const primary = resolvedImages.find(i => i.primary) || resolvedImages.find(i => i.role === 'exterior') || resolvedImages[0];
    return { ...v, images: resolvedImages, primary };
  });
}

export function getPrimaryImageEntry(vehicle: ResolvedVehicle): OptimizedImageEntry | undefined {
  return vehicle.primary?.entry;
}
