// src/components/polls/CategoriesExplorer.tsx
"use client";

import { useMemo, useState } from "react";

interface CategoriesExplorerProps {
  categories: string[];
}

interface GroupedCategories {
  letter: string;
  items: string[];
}

const LETTERS = ["All", "#", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

export function CategoriesExplorer({ categories }: CategoriesExplorerProps) {
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState<string>("All");

  const grouped: GroupedCategories[] = useMemo(() => {
    const q = search.trim().toLowerCase();

    let filtered = categories;

    // 1) Search filter
    if (q) {
      filtered = categories.filter((c) =>
        c.toLowerCase().includes(q)
      );
    }

    // 2) Letter filter
    if (activeLetter !== "All") {
      filtered = filtered.filter((c) => {
        const first = (c[0] ?? "").toUpperCase();
        if (activeLetter === "#") {
          // Non A–Z letters
          return !/[A-Z]/.test(first);
        }
        return first === activeLetter;
      });
    }

    // 3) Group by first letter
    const map = new Map<string, string[]>();
    for (const cat of filtered) {
      const first = (cat[0] ?? "").toUpperCase();
      const key = /[A-Z]/.test(first) ? first : "#";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(cat);
    }

    const result: GroupedCategories[] = Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([letter, items]) => ({
        letter,
        items: items.sort((a, b) => a.localeCompare(b)),
      }));

    return result;
  }, [categories, search, activeLetter]);

  const totalVisible = useMemo(
    () => grouped.reduce((sum, g) => sum + g.items.length, 0),
    [grouped]
  );

  return (
    <div className="space-y-6">
      {/* Search + count */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 flex items-center gap-2 rounded-2xl bg-[#050c1f] border border-white/10 px-3 py-2">
          <span className="text-white/40 text-xs">🔍</span>
          <input
            type="search"
            placeholder="Search categories (Phoenix, weddings, party buses, pricing)…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/40"
          />
        </div>
        <p className="text-[11px] text-white/60">
          Showing{" "}
          <span className="font-semibold text-white">
            {totalVisible.toLocaleString()}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-white">
            {categories.length.toLocaleString()}
          </span>{" "}
          categories
        </p>
      </div>

      {/* A–Z strip */}
      <div className="flex gap-1 overflow-x-auto pb-1 text-[11px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {LETTERS.map((letter) => {
          const isActive = activeLetter === letter;
          return (
            <button
              key={letter}
              type="button"
              onClick={() => setActiveLetter(letter)}
              className={[
                "px-2 py-1 rounded-full border transition-colors whitespace-nowrap",
                isActive
                  ? "bg-sky-400 text-slate-900 border-sky-400 font-semibold"
                  : "bg-[#050c1f] text-white/70 border-white/15 hover:bg-[#070f27]",
              ].join(" ")}
            >
              {letter.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Grouped grid */}
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {grouped.length === 0 && (
          <p className="text-xs text-white/60">
            No categories match that search yet. Try another keyword.
          </p>
        )}

        {grouped.map((group) => (
          <section key={group.letter} className="space-y-2">
            {/* Letter header */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-sky-400/20 border border-sky-400/50 flex items-center justify-center text-[11px] font-semibold text-sky-100">
                {group.letter}
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-sky-500/60 via-white/10 to-transparent" />
              <span className="text-[10px] text-white/50">
                {group.items.length.toLocaleString()} categories
              </span>
            </div>

            {/* Category buttons grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {group.items.map((cat) => {
                const slug = toSlug(cat);
                return (
                  <a
                    key={cat}
                    href={`/polls/category/${slug}`}
                    className="group inline-flex items-center justify-between gap-1 rounded-full border border-white/15 bg-[#050b1b] px-3 py-1.5 text-[11px] text-white shadow-sm hover:border-sky-400/80 hover:bg-[#050b1f] hover:shadow-sky-500/40 transition"
                  >
                    <span className="truncate">{cat}</span>
                    <span className="opacity-60 group-hover:opacity-100 text-[9px]">
                      →
                    </span>
                  </a>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
