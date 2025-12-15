"use client";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const INITIAL_ITEMS = [
  { id: "1", label: "Determine guest list size", checked: true },
  { id: "2", label: "Set a budget", checked: false },
  { id: "3", label: "Book transportation (Bus2Ride)", checked: false },
  { id: "4", label: "Select a venue", checked: false },
];

export function PlanningChecklist() {
  const [items, setItems] = useState(INITIAL_ITEMS);

  const toggle = (id: string) => {
    setItems(
      items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)),
    );
  };

  const progress = Math.round(
    (items.filter((i) => i.checked).length / items.length) * 100,
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-secondary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-3 bg-card border p-6 rounded-2xl">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center space-x-3 p-2 hover:bg-muted/50
              rounded-lg"
          >
            <Checkbox
              id={item.id}
              checked={item.checked}
              onCheckedChange={() => toggle(item.id)}
            />
            <label
              htmlFor={item.id}
              className={`text-base leading-none
              peer-disabled:cursor-not-allowed peer-disabled:opacity-70
              ${item.checked ? "line-through text-muted-foreground" : "font-medium"}`}
            >
              {item.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
