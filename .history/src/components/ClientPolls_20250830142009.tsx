"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/* ===== Types (robust to varied registry shapes) ===== */
type Poll = {
  id?: string | number;
  question?: string;
  title?: string;
  prompt?: string;
  category?: string;
  tags?: string[];
  options?: string[];
  // Optional pre-existing tallies if you have them
  votes?: Record<string, number>;
};

/* ===== Helpers ===== */
function getQuestion(p: Poll): string {
  return (
    (typeof p.question === "string" && p.question) ||
    (typeof p.title === "string" && p.title) ||
    (typeof p.prompt === "string" && p.prompt) ||
    "Untitled Poll"
  );
}
function getCategoryRaw(p: Poll): string {
  if (p.category && p.category.trim()) return p.category;
  if (p.tags && p.tags.length) return String(p.tags[0]);
  return "Misc";
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/* ===== Types (unchanged) ===== */
type Poll = {
  id?: string | number;
  question?: string;
  title?: string;
  prompt?: string;
  category?: string;
  tags?: string[];
  options?: string[];
  votes?: Record<string, number>; // optional seed tallies
};

/* ===== Helpers (unchanged behavior) ===== */
function getQuestion(p: Poll): string {
  return (
    (typeof p.question === "string" && p.question) ||
    (typeof p.title === "string" && p.title) ||
    (typeof p.prompt === "string" && p.prompt) ||
    "Untitled Poll"
  );
}
function getCategoryRaw(p: Poll): string {
  if (p.category && p.category.trim()) return p.category;
  if (p.tags && p.tags.length) return String(p.tags[0]);
  return "Misc";
}
function slugify(s: string) {
  return (
    (s || "misc")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "misc"
  );
}
const COOL_NAMES: Record<string, string> = {
  birthday: "Birthday Bangers",
  wedding: "Wedding Vibes",
  bachelorette: "Bachelorette Bash",
  bachelor: "Bachelor Bash",
  prom: "Prom Night Pulse",
  sports: "Game Day Hype",
  work: "Office Vibe Check",
  corporate: "Corporate Crowd-Pleasers",
  kids: "Kiddo Chaos",
  school: "Campus Crowd",
  holiday: "Holiday Hype",
  nightlife: "Night-Out Picks",
  road: "Road-Trip Raves",
  travel: "Travel Tunes",
  party: "Party Starters",
  classic: "Timeless Classics",
  edm: "Bass-Drop Central",
  country: "Country Cookout",
  hiphop: "Hip-Hop Heat",
  latin: "Latin Fiesta",
  chill: "Chill & Vibey",
  misc: "Wildcard Wonders",
};
function prettifyCategory(raw: string): string {
  const key = (raw || "").toLowerCase();
  for (const k of Object.keys(COOL_NAMES)) if (key.includes(k)) return COOL_NAMES[k];
  const title = (raw || "Misc")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return `${title} Polls`;
}
function formatNumber(n: number) {
  return Intl.NumberFormat().format(n);
}
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}

/* ===== Toasts (styled to blue theme) ===== */
function useToasts() {
  const [toasts, setToasts] = useState<Array<{ id: number; text: string }>>([]);
  const add = (text: string, ms = 1600) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ms);
  };
  const node = (
    <div className="pointer-events-none fixed right-4 top-4 z-[9999] space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto rounded-xl bg-blue-600 text-white text-sm px-4 py-2 shadow-xl border border-blue-700"
        >
          {t.text}
        </div>
      ))}
    </div>
  );
  return { add, node };
}
                            How To Embed
                          </button>
                        </div>
                      </div>

                      <div className="mt-4">{categoryChips}</div>

                      <div className="mt-3 text-blue-100/90 text-sm text-center">
                        <span className="font-semibold text-white">{data.total}</span> polls total
                        {q ? <span className="ml-2">· Filtering by “{q}”.</span> : null}
                      </div>
                    </div>
                  </section>

                  {/* Sticky Utility Bar (blue themed) */}
                  <div className="sticky top-0 z-30 border-y border-blue-800/30 bg-[#122a56]/95 backdrop-blur">
                    <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex flex-col gap-3 md:flex-row md:items-center">
                      <div className="w-full md:w-96">
                        <select
                          value={jumpSlug}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val) setTimeout(() => handleJump(val), 0);
                          }}
                          className="w-full rounded-xl border border-blue-800/30 bg-[#173264] px-4 py-2.5 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Jump to a category…</option>
                          {data.entries.map((c) => (
                            <option key={c.slug} value={c.slug}>
                              {c.pretty} ({c.count})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex-1" />

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setShowGlobalResults(true)}
                          className="rounded-xl border border-blue-800/40 bg-[#173264] px-3 py-2 text-sm font-bold text-white hover:border-blue-500"
                        >
                          Show Results
                        </button>
                        <button
                          onClick={async () => {
                            const ok = await copyToClipboard(
                              "<!-- Embed any poll in seconds; replace POLL_ID -->\n<iframe src=\"https://yourdomain.com/embed/poll/POLL_ID\" width=\"100%\" height=\"420\" style=\"border:0;border-radius:12px;overflow:hidden\" loading=\"lazy\" referrerpolicy=\"no-referrer\"></iframe>"
                            );
                            if (ok) add("Copied!");
                          }}
                          className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-bold text-white hover:bg-blue-700 border border-blue-700"
                        >
                          Share Polls On Your Site
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Top reminder */}
                  <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4 pb-2">
                    <ResultsReminder compact />
                  </div>

                  {/* Categories grid (cards match your blue boxes) */}
                  <section className="max-w-7xl mx-auto px-4 md:px-6 pb-12">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {data.entries.map((cat) => {
                        const filtered = cat.items.filter(matches);
                        const showing = filtered.length;
                        const headerNote =
                          q && showing !== cat.count ? `${cat.count} total · ${showing} match` : `${cat.count} total`;

                        return (
                          <div
                            key={cat.slug}
                            ref={(el) => {
                              catRefs.current[cat.slug] = el;
                            }}
                            className="rounded-3xl overflow-hidden border border-blue-800/30 shadow-xl bg-[#173264] flex flex-col"
                          >
                            <div className="px-4 py-3 border-b border-blue-800/30 bg-[#122a56] flex items-center justify-between">
                              <div>
                                <div className="text-base font-extrabold text-white">{cat.pretty}</div>
                                <div className="text-xs text-blue-100/90">{headerNote}</div>
                              </div>
                              <div className="rounded-full bg-blue-600 text-white text-[11px] px-2 py-0.5 tabular-nums border border-blue-700">
                                {cat.count}
                              </div>
                            </div>

                            <div className="max-h-[28rem] overflow-y-auto p-4 space-y-3">
                              {filtered.length === 0 ? (
                                <div className="text-sm text-blue-100/90">No polls match your search in this category.</div>
                              ) : (
                                filtered.map((p, i) => (
                                  <PollCard key={(p.id ?? `${cat.slug}-${i}`) as React.Key} poll={p} onGlobalShare={(msg) => add(msg)} />
                                ))
                              )}

                              <div className="mt-3">
                                <ResultsReminder compact />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* Back to Top */}
                  {showTop && (
                    <button
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      className="fixed bottom-6 right-6 z-40 rounded-full bg-blue-600 text-white shadow-xl px-4 py-2 text-sm font-bold border border-blue-700 hover:bg-blue-700"
                    >
                      ↑ Back to Top
                    </button>
                  )}

                  {/* Global Results Drawer (same logic, blue UI) */}
                  {showGlobalResults && (
                    <div className="fixed inset-0 z-[10000]">
                      <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setShowGlobalResults(false)}
                      />
                      <div className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-[#122a56] border-l border-blue-800/30 shadow-2xl p-6 overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-extrabold text-white">Live Results</h2>
                          <button
                            onClick={() => setShowGlobalResults(false)}
                            className="rounded-xl border border-blue-800/40 bg-[#173264] px-3 py-1.5 text-sm text-white hover:border-blue-500"
                          >
                            Close
                          </button>
                        </div>
                        <p className="text-sm text-blue-100/90 mb-4">
                          Quick peek at popular polls. (Wire to your real results API when ready.)
                        </p>

                        <div className="space-y-4">
                          {data.entries
                            .flatMap((c) => c.items.slice(0, 3))
                            .slice(0, 12)
                            .map((p, i) => (
                              <div key={i} className="rounded-2xl border border-blue-800/30 p-4 bg-[#173264]">
                                <div className="text-sm font-semibold text-white mb-2">{getQuestion(p)}</div>
                                <div className="text-xs text-blue-100/90 mb-3">{prettifyCategory(getCategoryRaw(p))}</div>
                                {(p.options && p.options.length ? p.options : ["Yes", "No"]).map((o, j) => (
                                  <ResultBar key={j} label={o} pct={50 - (j * 7) % 20 + 30} count={1000 - j * 123} />
                                ))}
                              </div>
                            ))}
                        </div>

                        <div className="mt-6">
                          <ResultsReminder />
                        </div>
                      </div>
                    </div>
                  )}
                </main>
              );
            }

            /* ===== Optional: hide scrollbars on the chip row =====
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            */
