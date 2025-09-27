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

const isGeo = (slug: unknown) =>
  !!slug && /-[a-z]{2}$/i.test(String(slug)); // e.g. "...-tx", "...-ca"

// helper functions intentionally minimal — all parsing is inline in toItems

function toItems(rows: any[]): PollItem[] {
  return (rows ?? [])
    .map((r) => {
      const q =
        r.question ??
        r.question_text ??
        r.title ??
        r.text ??
        r.prompt ??
        "";
      if (!String(q).trim()) return null;

      // <-- REAL poll id (string), used to look up options & totals
      const pollPk =
        r.poll_id_uuid ??
        r.poll_uuid ??
        r.poll_id ??
        r.id ??
        r.uuid ??
        null;

      const slug = r.poll_slug ?? r.slug ?? null;

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
  let rows: any[] = [];
  for (const table of sources) {
    const got = await trySource(supabase, table, grab);
    if (got.length) {
      rows = got;
      break;
    }
  }
  if (!rows.length) return [];

  // Prefer non-geo by category_slug if present; otherwise use everything
  const nonGeoRows = rows.filter((r) => !isGeo(r?.category_slug));
  const primaryRows = nonGeoRows.length ? nonGeoRows : rows;

  const items = toItems(primaryRows);
  if (!items.length) return [];

  const cols = chunk(items, numColumns).map((arr) => arr.slice(0, pollsPerColumn));
  const titles = ["Trending Polls", "Hot Right Now", "Popular Topics"];

  return cols.map((polls, i) => ({
    topic: { slug: `col-${i + 1}`, name: titles[i] ?? `Polls ${i + 1}` },
    polls,
  }));
}
