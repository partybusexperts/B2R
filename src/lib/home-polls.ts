// src/lib/home-polls.ts
import { createClient } from "./supabase/server";

export type RawPoll = { id: string; slug: string; question: string };
export type HomePollColumn = { key: string; title: string; items: RawPoll[] };

// Heuristics to detect city/state in slugs (works for "santa-ana-ca-q01", "austin-tx-q07", etc.)
const STATE_TOKEN_ANYWHERE = /(?:^|-)[a-z]{2}(?:-|$)/i;
const GEO_TOKENS = [
  "-city-", "-state-", " county ", " borough ",
  "new-york","los-angeles","washington-dc","san-francisco","san-diego",
  "chicago","boston","philadelphia","philly","miami","dallas","houston",
  "atlanta","phoenix","vegas","nashville","austin","denver","orlando",
  "seattle","vancouver","toronto","montreal","ottawa"
];

function isGeoSlug(slug: string): boolean {
  const s = `-${(slug || "").toLowerCase()}-`;
  if (STATE_TOKEN_ANYWHERE.test(s)) return true;
  return GEO_TOKENS.some(t => s.includes(t));
}

// "brewery-tours-q39" -> "brewery-tours"
function deriveCategoryKey(slug: string): string {
  const s = (slug || "").toLowerCase();
  const m = s.match(/^([a-z0-9-]+)-q\d+$/i);
  const base = (m?.[1] ?? s.split("-q")[0] ?? s).trim();
  return base || s;
}

function toTitle(s: string): string {
  return s
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function getHomepageCategoryColumns(
  opts?: { numColumns?: number; perColumn?: number }
): Promise<HomePollColumn[]> {
  const numColumns = opts?.numColumns ?? 3;
  const perColumn  = opts?.perColumn  ?? 50;
  const supabase = createClient();

  // Big enough pool so rotation feels fresh; obey REST limit (1,000 by default).
  const take = Math.min(numColumns * perColumn * 10, 1000);

  const { data, error } = await supabase
    .from("v_polls_home")
    .select("id, slug, question")
    .limit(take);

  if (error) {
    console.log("[home-polls] v_polls_home error", error);
    return [];
  }

  const all = (data ?? []).filter(p => p && p.id && p.slug && p.question);
  // Remove city/state polls first
  const nonGeo = all.filter(p => !isGeoSlug(p.slug));

  // Group by derived category from slug prefix before "-q##"
  const byCategory = new Map<string, RawPoll[]>();
  for (const p of nonGeo) {
    const key = deriveCategoryKey(p.slug);
    // Double-safety: drop categories that themselves look geo
    if (isGeoSlug(key)) continue;
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key)!.push(p);
  }

  // Pick random categories
  const categoryKeys = shuffle(Array.from(byCategory.keys()));
  const pickedKeys = categoryKeys.slice(0, numColumns);

  const columns: HomePollColumn[] = [];
  for (const key of pickedKeys) {
    const pool = byCategory.get(key)!;
    const items = shuffle(pool).slice(0, perColumn);
    if (items.length === 0) continue; // skip empty just in case
    columns.push({ key, title: toTitle(key), items });
  }

  // If fewer than numColumns, try to fill with other categories
  if (columns.length < numColumns) {
    for (const key of categoryKeys) {
      if (columns.find(c => c.key === key)) continue;
      const pool = byCategory.get(key)!;
      const items = shuffle(pool).slice(0, perColumn);
      if (items.length === 0) continue;
      columns.push({ key, title: toTitle(key), items });
      if (columns.length === numColumns) break;
    }
  }

  console.log(
    `[home-polls] fetched=${all.length} nonGeo=${nonGeo.length} categories=${byCategory.size} ` +
    `picked=${columns.map(c=>c.key).join(", ")}`
  );

  return columns;
}
