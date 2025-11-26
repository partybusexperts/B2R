"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import VehicleGalleryCard from "../VehicleGalleryCard";
import type { HomepageVehicle } from "../../types/homepageVehicles";

// ---------- tiny seeded RNG helpers ----------
function safeHash(input: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h >>> 0;
}
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffleInPlace<T>(arr: T[], rand: () => number) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function RotatingTile(props: {
  slotKey: string;
  onTick: () => void;
  baseMs: number;
  jitterMs: number;
  children: React.ReactNode;
  pauseOnHover?: boolean;
}) {
  const { slotKey, onTick, baseMs, jitterMs, children, pauseOnHover = true } = props;
  const rand = useRef(mulberry32(safeHash(slotKey)));
  const timer = useRef<number | null>(null);
  const started = useRef(false);
  const paused = useRef(false);

  const schedule = () => {
    if (timer.current) window.clearTimeout(timer.current);
    if (paused.current) return;
    const period =
      baseMs * (0.9 + rand.current() * 0.4) + Math.floor(rand.current() * jitterMs);
    timer.current = window.setTimeout(() => {
      if (!paused.current) onTick();
      schedule();
    }, period) as unknown as number;
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const boot = window.setTimeout(schedule, 300 + Math.floor(rand.current() * 900));
    return () => {
      window.clearTimeout(boot);
      if (timer.current) window.clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseMs, jitterMs, slotKey]);

  return (
    <div
      onMouseEnter={() => {
        if (!pauseOnHover) return;
        paused.current = true;
        if (timer.current) window.clearTimeout(timer.current);
      }}
      onMouseLeave={() => {
        if (!pauseOnHover) return;
        paused.current = false;
        schedule();
      }}
    >
      {children}
    </div>
  );
}

export default function VehiclePreviewGrid({
  vehicles = [],
  category,
  slots = 3,
  baseMs,
  jitterMs = 600,
  labelsMap,
}: {
  vehicles?: HomepageVehicle[];
  category: "party-buses" | "limousines" | "coach-buses" | string;
  slots?: number;
  baseMs?: number;
  jitterMs?: number;
  labelsMap?: Record<string, string[]>;
}) {
  const len = vehicles.length;
  if (len === 0) return null;
  const slotCount = Math.min(slots, len);

  const seedId = useId();
  const rand = useMemo(() => mulberry32(safeHash(category + seedId)), [category, seedId]);

  const initial = useMemo(() => {
    const indices = Array.from({ length: len }, (_, i) => i);
    shuffleInPlace(indices, rand);
    const out: number[] = [];
    for (let i = 0; i < slotCount; i++) out.push(indices[i]);
    return out;
  }, [len, slotCount, rand]);

  const [visible, setVisible] = useState<number[]>(initial);

  const effectiveBase = baseMs ?? 3000;

  const advance = (slot: number) => {
    if (len <= 1) return;
    setVisible((prev) => {
      const used = new Set(prev.filter((_, idx) => idx !== slot));
      let next = ((prev[slot] ?? 0) + 1) % len;
      let tries = 0;
      while (used.has(next) && tries < len - 1) {
        next = (next + 1) % len;
        tries++;
      }
      const copy = [...prev];
      copy[slot] = next;
      return copy;
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {Array.from({ length: slotCount }).map((_, i) => {
        const slotKey = `${category}-${i}`;
        const idx = visible[i] ?? 0;
        const item = vehicles[idx] ?? vehicles[0];
        return (
          <RotatingTile
            key={slotKey}
            slotKey={slotKey}
            onTick={() => advance(i)}
            baseMs={effectiveBase}
            jitterMs={jitterMs}
          >
            <VehicleGalleryCard vehicle={item!} amenityLabels={labelsMap?.[item?.name ?? ""]} />
          </RotatingTile>
        );
      })}
    </div>
  );
}
