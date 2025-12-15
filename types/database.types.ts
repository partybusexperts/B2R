import { MergeDeep } from "type-fest";
import { Database as DatabaseGenerated } from "./database-generated.types"; // Your auto-gen file
import { HeroCTA } from "./hero.types";
import {
  LocationCoordinates,
  LocationInfoBlock,
  LocationTrivia,
} from "@/lib/data/locations";

// Define the exact override structure
// We only touch the specific table and columns we care about.
type DatabaseOverrides = {
  public: {
    Tables: {
      homepage_hero: {
        Row: {
          ctas: HeroCTA[];
        };
        Insert: {
          ctas?: HeroCTA[];
        };
        Update: {
          ctas?: HeroCTA[];
        };
      };
      locations: {
        Row: {
          // 1. Override the JSONB columns
          coordinates: LocationCoordinates;
          trivia: LocationTrivia[]; // It's an array in the DB
          local_events: LocationInfoBlock[];
          neighborhood_vibes: LocationInfoBlock[];
          seasonal_guide: LocationInfoBlock; // It's a single object

          // 2. Override the Enums/Arrays
          available_fleet_types: ("party-bus" | "limo" | "coach")[];
        };
      };
    };
  };
};

// Export the Database type
export type Database = MergeDeep<DatabaseGenerated, DatabaseOverrides>;
