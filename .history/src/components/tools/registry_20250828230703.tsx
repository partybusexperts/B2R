"use client";

import React from "react";
import PerPersonSplitter from "./PerPersonSplitter";
import SeatFit from './SeatFit';
import BYOBPlanner from './BYOBPlanner';
import ItineraryBuilder from './ItineraryBuilder';
import EventMatchmaker from './EventMatchmaker';
import WeatherAlert from './WeatherAlert';
import VehicleComparisonTool from '../VehicleComparisonTool';

export type ToolEntry = {
  id: string;
  title: string;
  desc: string;
  href?: string;
  component?: React.FC<any>;
};

function makeLinkComponent(href: string, label?: string): React.FC {
  return function LinkTool() {
    return (
      <div>
        <p>{label || 'Open external tool'}</p>
        <a href={href} target="_blank" rel="noreferrer">Open Tool</a>
      </div>
    );
  };
}

const tools: ToolEntry[] = [
  { id: "vehicle-compare", title: "Vehicle Comparison", desc: "Compare vehicle types side-by-side.", component: VehicleComparisonTool },
  { id: "cost-split", title: "Cost Split Calculator", desc: "Split cost per person.", component: PerPersonSplitter },
  { id: "seat-fit", title: "Seat Fit Advisor", desc: "Estimate comfort per passenger.", component: SeatFit },
  { id: "byob-ice", title: "BYOB & Ice Planner", desc: "Estimate drinks and ice per person.", component: BYOBPlanner },
  { id: "itinerary-builder", title: "Itinerary Builder", desc: "Build a simple multi-stop plan.", component: ItineraryBuilder },
  { id: "event-match", title: "Event Matchmaker", desc: "Suggest vehicle types by event.", component: EventMatchmaker },
  { id: "weather-alert", title: "Weather Alert", desc: "Check weather impact for dates.", component: WeatherAlert },
  { id: "capacity-finder", title: "Capacity Finder", desc: "Find vehicles by group size.", component: makeLinkComponent('/tools', 'Open Capacity Finder') },
];

export default tools;
