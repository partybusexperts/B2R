"use client";
import React from "react";

export interface StatsStripProps {
  cities?: string[];
  fleetText?: string;
  capacityText?: string;
  maxChips?: number;
  onSearch?: (query: string) => void;
}

// Optional: keep this export if other files import it.
// Otherwise you can delete it safely.
// export const PHOENIX_30MI_CITIES = [...];

export default function StatsStrip(_: StatsStripProps) {
  return null; // <- remove the entire UI box
}
