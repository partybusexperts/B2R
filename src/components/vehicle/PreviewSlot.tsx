"use client";

import React, { useEffect, useId, useRef, useState } from "react";

// safe hash + seeded RNG
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

type Props<Item> = {
  items?: Item[] | null; // may be undefined/null
  slotKey?: string; // unique per tile; fallback if missing
  renderItem: (item: Item) => React.ReactElement | null; // how to render one vehicle
  baseMs?: number; // base rotate period
  jitterMs?: number; // extra randomization
  pauseOnHover?: boolean;
};

export default function PreviewSlot<Item>({
  items,
  slotKey,
  renderItem,
  baseMs = 6200,
  jitterMs = 2400,
  pauseOnHover = true,
}: Props<Item>) {
  const list = Array.isArray(items) ? items : [];
  const len = list.length;

  // stable fallback key (unique per instance)
  const rid = useId();
  const stableKey = String(slotKey ?? rid);
  const rand = useRef(mulberry32(safeHash(stableKey)));

  const [idx, setIdx] = useState<number>(() => (len > 0 ? Math.floor(rand.current() * len) : 0));

  const timer = useRef<number | null>(null);
  const paused = useRef(false);
  const started = useRef(false);
  const holderRef = useRef<HTMLDivElement | null>(null);

  // pause when off-screen
  useEffect(() => {
    if (!holderRef.current || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => {
      paused.current = !entry.isIntersecting;
    }, { rootMargin: "120px" });
    io.observe(holderRef.current);
    return () => io.disconnect();
  }, []);

  const schedule = () => {
    if (timer.current) window.clearTimeout(timer.current);
    if (len <= 1) return;

    const period = baseMs * (0.9 + rand.current() * 0.4) + Math.floor(rand.current() * jitterMs);

    timer.current = window.setTimeout(() => {
      if (!paused.current) setIdx((i) => (i + 1) % len);
      schedule();
    }, period) as unknown as number;
  };

  useEffect(() => {
    if (started.current) return; // avoid Strict Mode double-start
    started.current = true;

    const bootDelay = 300 + Math.floor(rand.current() * 1200);
    const boot = window.setTimeout(schedule, bootDelay);

    return () => {
      window.clearTimeout(boot);
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [len, baseMs, jitterMs, stableKey]);

  if (len === 0) return null;

  return (
    <div
      ref={holderRef}
      onMouseEnter={() => { if (pauseOnHover) paused.current = true; }}
      onMouseLeave={() => { if (pauseOnHover) { paused.current = false; } }}
    >
      {renderItem(list[idx])}
    </div>
  );
}
