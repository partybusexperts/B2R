// Central image catalog so we can refactor file names & folders safely.
// Each category lists canonical relative public paths (no domain) and optional metadata.
// Export helpers to fetch randomized selections while preserving stable ordering for SSR.

export type VehicleImage = {
  file: string;              // relative path under /public
  alt: string;               // alt text for accessibility
  seats?: string;            // seating descriptor
  tags?: string[];           // feature or marketing tags
};

export type VehicleCategory =
  | "partyBuses"
  | "limousines"
  | "coachBuses"
  | "executiveSprinters"
  | "sprinterLimoStyle"
  | "shuttleBuses";

// NOTE: Initially we just map existing filenames. After physical moves, update paths.
// TODO: After relocating assets into subfolders, rewrite the file paths below accordingly.

export const imageCatalog: Record<VehicleCategory, VehicleImage[]> = {
  partyBuses: [
    { file: "/images/party-buses/18 Passenger White Party Bus Exterior.png", alt: "18 Passenger Party Bus exterior" },
    { file: "/images/party-buses/18 Passenger White Party Bus Interior.png", alt: "18 Passenger Party Bus interior" },
    { file: "/images/party-buses/20 Passenger White Party Bus Exterior.png", alt: "20 Passenger Party Bus exterior" },
    { file: "/images/party-buses/17 Passenger Black Party Bus Exterior.png", alt: "17 Passenger Black Party Bus exterior" },
    { file: "/images/party-buses/Bus-1.png", alt: "Party Bus exterior 1" },
    { file: "/images/party-buses/Bus-2.png", alt: "Party Bus exterior 2" },
    { file: "/images/party-buses/Bus-3.png", alt: "Party Bus exterior 3" },
    { file: "/images/party-buses/Bus-4.png", alt: "Party Bus exterior 4" },
  { file: "/images/party-buses/Bus-5.png", alt: "Party Bus exterior 5" }
  ],
  limousines: [
    { file: "/images/limousines/10 Passenger Black Lincoln Stretch Limo Exterior Black.png", alt: "10 Passenger Black Lincoln Stretch limo exterior" },
    { file: "/images/limousines/10 Passenger Lincoln Stretch Limo Exterior 2.png", alt: "10 Passenger Lincoln Stretch limo exterior angle" },
    { file: "/images/limousines/10 Passenger Lincoln Stretch Limo Exterior 3.png", alt: "10 Passenger Lincoln Stretch limo exterior front" },
    { file: "/images/limousines/10 Passenger Lincoln Stretch Limo Interior.png", alt: "10 Passenger Lincoln Stretch limo interior" },
    { file: "/images/limousines/10 Passenger Lincoln Stretch Limo Interior Clean.png", alt: "10 Passenger Lincoln Stretch limo interior clean" },
    { file: "/images/limousines/18 Passenger Cadillac Escalade Limo Exterior.png", alt: "18 Passenger Cadillac Escalade limo exterior" },
    { file: "/images/limousines/18 Passenger Hummer Limo Exterior.png", alt: "18 Passenger Hummer limo exterior" },
    { file: "/images/limousines/18 Passenger Hummer Limo Interior.png", alt: "18 Passenger Hummer limo interior" },
    { file: "/images/limousines/18 Passenger Ford Excursion Limo Exterior 2.png", alt: "18 Passenger Ford Excursion limo exterior" },
    { file: "/images/limousines/16 Passenger Ford Excursion Limousine Interior.png", alt: "16 Passenger Ford Excursion limo interior" },
    { file: "/images/limousines/16 Passenger Ford Excursion Stretch Limo Interior.png", alt: "16 Passenger Ford Excursion stretch limo interior" },
    { file: "/images/limousines/16_Passenger_Stretch_Excursion_Exterior_optimized.jpg", alt: "16 Passenger Stretch Excursion limo exterior" },
    { file: "/images/limousines/10 Passenger Chrysler 300 Limo Exterior.png", alt: "10 Passenger Chrysler 300 limo exterior" }
  ],
  coachBuses: [
  { file: "/images/coach-buses/bus-none.png", alt: "Coach bus placeholder" },
  { file: "/images/coach-buses/Bus-None2.png", alt: "Coach bus placeholder 2" },
  { file: "/images/coach-buses/Bus-None3.png", alt: "Coach bus placeholder 3" },
  { file: "/images/coach-buses/Bus-None4.png", alt: "Coach bus placeholder 4" }
  ],
  executiveSprinters: [
    { file: "/images/executive-sprinters/12 Passenger Executive Style Sprinter Van Exterior.png", alt: "12 passenger executive sprinter exterior" }
  ],
  sprinterLimoStyle: [
    { file: "/images/sprinter-limo-style/10 Passenger Sprinter Van Limo Style Interior 1.png", alt: "10 passenger sprinter limo style interior" },
    { file: "/images/sprinter-limo-style/14 Passenger Sprinter Van Limo Style Exterior Door Open.png", alt: "14 passenger sprinter limo style exterior door open" },
    { file: "/images/sprinter-limo-style/14 Passenger Sprinter Van Limo Style Interior Again.png", alt: "14 passenger sprinter limo style interior" }
  ],
  shuttleBuses: [
    // Add shuttle bus photos here as you upload them
  ]
};

export function getImages(category: VehicleCategory): VehicleImage[] {
  return imageCatalog[category];
}

export function getRandomImages(category: VehicleCategory, count: number): VehicleImage[] {
  const arr = [...imageCatalog[category]];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, Math.max(0, count));
}

export function findImage(fileNamePart: string): VehicleImage | undefined {
  const lower = fileNamePart.toLowerCase();
  for (const cat of Object.keys(imageCatalog) as VehicleCategory[]) {
    const found = imageCatalog[cat].find(img => img.file.toLowerCase().includes(lower));
    if (found) return found;
  }
  return undefined;
}

// Helper to generate src string only
export function pathFor(img: VehicleImage): string {
  return img.file;
}
