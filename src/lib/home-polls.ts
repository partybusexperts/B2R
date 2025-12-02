// src/lib/home-polls.ts
import { createClient } from "./supabase/server";

export type RawPoll = {
  id: string;
  slug: string;
  question: string;
  options?: string[] | null;
  tags?: string[] | null;
  active?: boolean | null;
};
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

type KeywordPollOptions = {
  primaryKey: string;
  primaryTitle: string;
  slugKeywords: string[];
  preferKeywords?: string[];
  numColumns?: number;
  perColumn?: number;
};

async function getKeywordDrivenPollColumns(
  opts: KeywordPollOptions
): Promise<HomePollColumn[]> {
  const numColumns = opts.numColumns ?? 3;
  const perColumn = opts.perColumn ?? 45;
  const supabase = createClient();
  const take = Math.min(numColumns * perColumn * 12, 1000);

  const { data, error } = await supabase
    .from("v_polls_home")
    .select("id, slug, question")
    .limit(take);

  if (error) {
    console.log(`[polls:${opts.primaryKey}] v_polls_home error`, error);
    return [];
  }

  const all = (data ?? []).filter((p) => p && p.id && p.slug && p.question);
  const nonGeo = all.filter((p) => !isGeoSlug(p.slug));

  const matchKeyword = (value: string) => {
    const normalized = (value ?? "").toLowerCase();
    return opts.slugKeywords.some((keyword) => normalized.includes(keyword));
  };

  const primaryPool = nonGeo.filter((poll) => {
    const slug = poll.slug ?? "";
    const key = deriveCategoryKey(slug);
    return matchKeyword(slug) || matchKeyword(key);
  });

  const usedIds = new Set<string>();
  const columns: HomePollColumn[] = [];

  const takeFromPool = (pool: RawPoll[] | undefined, key: string, title: string) => {
    if (!pool?.length || columns.length >= numColumns) return;
    const available = pool.filter((p) => !usedIds.has(p.id));
    if (!available.length) return;
    const picks = shuffle(available).slice(0, perColumn);
    if (!picks.length) return;
    picks.forEach((p) => usedIds.add(p.id));
    columns.push({ key, title, items: picks });
  };

  takeFromPool(primaryPool, opts.primaryKey, opts.primaryTitle);

  const byCategory = new Map<string, RawPoll[]>();
  for (const poll of nonGeo) {
    const key = deriveCategoryKey(poll.slug);
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key)!.push(poll);
  }

  const categoryKeys = Array.from(byCategory.keys());
  const preferKeywords = opts.preferKeywords ?? opts.slugKeywords;

  const prioritizedKeys: string[] = [];
  for (const keyword of preferKeywords) {
    for (const key of categoryKeys) {
      if (key === opts.primaryKey) continue;
      if (prioritizedKeys.includes(key)) continue;
      if (key.includes(keyword)) prioritizedKeys.push(key);
    }
  }

  const fallbackKeys = shuffle(categoryKeys).filter(
    (key) => key !== opts.primaryKey && !prioritizedKeys.includes(key)
  );

  const orderedKeys = [...prioritizedKeys, ...fallbackKeys];

  for (const key of orderedKeys) {
    if (columns.length >= numColumns) break;
    const pool = (byCategory.get(key) ?? []).filter((p) => !usedIds.has(p.id));
    if (!pool.length) continue;
    const picks = shuffle(pool).slice(0, perColumn);
    if (!picks.length) continue;
    picks.forEach((p) => usedIds.add(p.id));
    columns.push({ key, title: toTitle(key), items: picks });
  }

  return columns.slice(0, numColumns);
}

export async function getPartyBusPollColumns(
  opts?: { numColumns?: number; perColumn?: number }
): Promise<HomePollColumn[]> {
  return getKeywordDrivenPollColumns({
    primaryKey: "party-bus",
    primaryTitle: "Party Bus Polls",
    slugKeywords: ["party-bus", "partybus"],
    preferKeywords: ["party", "bus", "nightlife", "club", "bachelor", "bachelorette"],
    numColumns: opts?.numColumns,
    perColumn: opts?.perColumn,
  });
}

export async function getLimousinePollColumns(
  opts?: { numColumns?: number; perColumn?: number }
): Promise<HomePollColumn[]> {
  return getKeywordDrivenPollColumns({
    primaryKey: "limousine",
    primaryTitle: "Limousine Polls",
    slugKeywords: ["limousine", "limousines", "limo", "stretch-limo", "sprinter-limo"],
    preferKeywords: ["limo", "wedding", "prom", "chauffeur", "black-car"],
    numColumns: opts?.numColumns,
    perColumn: opts?.perColumn,
  });
}

export async function getCoachBusPollColumns(
  opts?: { numColumns?: number; perColumn?: number }
): Promise<HomePollColumn[]> {
  return getKeywordDrivenPollColumns({
    primaryKey: "coach-bus",
    primaryTitle: "Coach & Charter Polls",
    slugKeywords: ["coach", "coach-bus", "charter", "charter-bus", "motorcoach", "tour-bus"],
    preferKeywords: ["coach", "charter", "team", "corporate", "event"],
    numColumns: opts?.numColumns,
    perColumn: opts?.perColumn,
  });
}

export async function getPricingPollColumns(
  opts?: { numColumns?: number; perColumn?: number }
): Promise<HomePollColumn[]> {
  return getKeywordDrivenPollColumns({
    primaryKey: "pricing",
    primaryTitle: "Pricing & Budget Polls",
    slugKeywords: [
      "pricing",
      "price",
      "prices",
      "budget",
      "cost",
      "quote",
      "quotes",
      "rate",
      "rates",
      "deposit",
      "fee",
      "fees",
      "surcharge",
    ],
    preferKeywords: ["pricing", "budget", "cost", "quote", "rate", "deposit", "fee"],
    numColumns: opts?.numColumns,
    perColumn: opts?.perColumn,
  });
}
