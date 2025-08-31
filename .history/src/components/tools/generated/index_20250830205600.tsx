/* This file is generated: exports a map of tool id -> React component */
import vehicle_compare from './vehicle-compare';
import cost_split from './cost-split';
import capacity_finder from './capacity-finder';
import seat_fit from './seat-fit';
import byob_ice from './byob-ice';
import itinerary_builder from './itinerary-builder';
import event_match from './event-match';
import weather_alert from './weather-alert';

// bulk import remaining generated wrappers
// eslint-disable-next-line @typescript-eslint/no-var-requires
const req = require.context ? require.context('.') : null;

import './off-peak-saver-finder';
// ... other generated files are present in the folder and will be imported by the consumer if needed

const GeneratedMap: Record<string, React.FC> = {
  'vehicle-compare': vehicle_compare,
  'cost-split': cost_split,
  'capacity-finder': capacity_finder,
  'seat-fit': seat_fit,
  'byob-ice': byob_ice,
  'itinerary-builder': itinerary_builder,
  'event-match': event_match,
  'weather-alert': weather_alert,
};

export default GeneratedMap;
