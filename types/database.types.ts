import { MergeDeep } from "type-fest";
import { Database as DatabaseGenerated } from "./database-generated.types"; // Your auto-gen file
import { HeroCTA } from "./hero.types";
import {
  LocationCitiesServed,
  LocationComfortChecklist,
  LocationCompleteGuide,
  LocationCoordinates,
  LocationExtraPlanningNotes,
  LocationHeader,
  LocationHowToBook,
  LocationStatePlanningGuide,
  LocationTopHotspots,
  LocationTransportationOverview,
  LocationTransportDoneRight,
  LocationWhyBook,
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
          coordinates: LocationCoordinates;

          // NEW FIELDS TO OVERRIDE
          header: LocationHeader;
          why_book: LocationWhyBook;
          how_to_book: LocationHowToBook;
          cities_served: LocationCitiesServed;
          state_planning_guide: LocationStatePlanningGuide;
          complete_guide: LocationCompleteGuide;
          transportation_overview: LocationTransportationOverview;
          extra_notes: LocationExtraPlanningNotes;
          top_hotspots: LocationTopHotspots;
          comfort_checklist: LocationComfortChecklist;
          transport_done_right: LocationTransportDoneRight;
        };
      };
    };
  };
};

// Export the Database type
export type Database = MergeDeep<DatabaseGenerated, DatabaseOverrides>;
