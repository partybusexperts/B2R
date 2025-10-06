import { createClient } from "@/lib/supabase/server";

export type PollItem = { id: string | null; slug: string | null; question: string };
export type PollColumn = { topic: { slug: string; name: string }, polls: PollItem[] };

const hasSupabase =
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL) &&
  !!(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY);

// tiny id helper (no crypto.randomUUID to avoid client crashes)
function chunk<T>(arr: T[], n: number) {
  const out: T[][] = Array.from({ length: n }, () => []);
  arr.forEach((x, i) => out[i % n].push(x));
  return out;
}

// determine whether a row represents a geo/local poll
const isGeo = (rowOrSlug: unknown) => {
  let slug: string | null = null;
  if (typeof rowOrSlug === "string") slug = rowOrSlug;
  else if (typeof rowOrSlug === "object" && rowOrSlug !== null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = rowOrSlug as any;
    slug = r.category_slug ?? r.poll_slug ?? null;
  }
  if (slug && /-[a-z]{2}$/i.test(String(slug))) return true; // e.g. "...-tx", "...-ca"

  // also consider explicit scope or presence of geo ids
  if (typeof rowOrSlug === "object" && rowOrSlug !== null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = rowOrSlug as any;
    const scope = String(r.scope ?? "").toLowerCase();
    if (scope === "city" || scope === "state") return true;
    if (r.city_id || r.state_id) return true;
  }
  return false;
};

// Fisher–Yates shuffle (in-place)
function shuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

// helper functions intentionally minimal — all parsing is inline in toItems

function toItems(rows: unknown[]): PollItem[] {
  return (Array.isArray(rows) ? rows : [])
    .map((r) => {
      // r may be unknown; cast to any for flexible field checks
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const row = r as any;
      const q =
        row.question ??
        row.question_text ??
        row.title ??
        row.text ??
        row.prompt ??
        "";
      if (!String(q).trim()) return null;

      // <-- REAL poll id (string), used to look up options & totals
      const pollPk =
        row.poll_id_uuid ??
        row.poll_uuid ??
        row.poll_id ??
        row.id ??
        row.uuid ??
        null;

      const slug = row.poll_slug ?? row.slug ?? null;

      if (!pollPk && !slug) return null;

      return {
        id: pollPk ? String(pollPk) : null,
        slug,
        question: String(q),
      };
    })
    .filter(Boolean) as PollItem[];
}

async function trySource(supabase: ReturnType<typeof createClient>, table: string, limit: number) {
  // SELECT * so we don't fail if columns differ
  const { data, error } = await supabase.from(table).select("*").limit(limit);
  if (error) {
    console.warn(`[home-polls] ${table} -> ${error.message}`);
    return [];
  }
  return data ?? [];
}

export async function getHomepagePollColumns(
  numColumns = 3,
  pollsPerColumn = 50
): Promise<PollColumn[]> {
  if (!hasSupabase) return [];

  const supabase = createClient();
  const grab = numColumns * pollsPerColumn * 3;

  // Try public-friendly views first, then the base table
  const sources = ["v_polls_public", "v_polls", "polls1"];
  let rows: unknown[] = [];
  let usedSource = "(none)";
  for (const table of sources) {
    const got = await trySource(supabase, table, grab);
    if (got.length) {
      rows = got;
      usedSource = table;
      break;
    }
  }
  if (!rows.length) return [];

  // Prefer non-geo rows (exclude city/state/local polls) — use stricter detection
  const nonGeoRows = rows.filter((r) => !isGeo(r));
  const primaryRows = nonGeoRows.length ? nonGeoRows : rows;

  // Debugging: report what we found
  try {
    console.log(`[home-polls] source=${usedSource} fetched=${rows.length} nonGeo=${nonGeoRows.length}`);
  } catch {
    void 0;
  }

  // Convert to normalized items, then shuffle so homepage rotation is random per load
  const items = toItems(primaryRows);
  shuffle(items);
  try {
    const sample = items.slice(0, 6).map((it) => it.id).filter(Boolean);
    console.log(`[home-polls] items=${items.length} sampleIds=${JSON.stringify(sample)}`);
  } catch {
    void 0;
  }
  if (!items.length) return [];

  const cols = chunk(items, numColumns).map((arr) => arr.slice(0, pollsPerColumn));
  const titles = ["Trending Polls", "Hot Right Now", "Popular Topics"];

  return cols.map((polls, i) => ({
    topic: { slug: `col-${i + 1}`, name: titles[i] ?? `Polls ${i + 1}` },
    polls,
  }));
}
