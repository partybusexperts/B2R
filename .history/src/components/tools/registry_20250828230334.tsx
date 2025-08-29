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
  export default tools;
    href: "/help",
    component: makeLinkComponent('/help', 'Open Alcohol Safety Guide')
  },
  {
    id: "green-choice",
    title: "� Green Travel Advisor",
    desc: "Suggest eco-friendly vehicle and routing choices to reduce footprint.",
    href: "/tools",
    component: makeLinkComponent('/tools', 'Open Green Travel Advisor')
  },
  {
    id: "local-venues",
    title: "📍 Local Venues & Parking Tips",
    desc: "Quick notes on popular venues and parking/entry tips.",
    href: "/resources",
    component: makeLinkComponent('/resources', 'Open Local Venues')
  },
  {
    id: "faq-popper",
    title: "❓ Quick FAQ Popper",
    desc: "Contextual answers for the most common booking questions.",
    href: "/help",
    component: makeLinkComponent('/help', 'Open FAQs')
  },
];

export default tools;
