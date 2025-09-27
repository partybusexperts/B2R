"use client";
import React from "react";
import { Star } from "lucide-react";

export default function Stars({ value = 5, size = 16 }: { value?: number | null; size?: number }) {
  const v = Math.max(0, Math.min(5, Math.round(value ?? 0)));
  return (
    <div className="flex" aria-label={`${v} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={i < v ? "fill-yellow-400 text-yellow-400" : "text-white/25"}
        />
      ))}
    </div>
  );
}
