export type HomepageVehicleCategory = "party-buses" | "limousines" | "coach-buses";

export interface HomepageVehicle {
  id: number | string;
  name: string;
  category: HomepageVehicleCategory;
  capacityMin?: number | null;
  capacityMax?: number | null;
  amenities: string[];
  imageUrl: string;
  secondaryImageUrl?: string | null;
  thirdImageUrl?: string | null;
}
