import { createClient } from "@/lib/supabase/server";

export type PollItem = { id: string; slug: string | null; question: string };
export type PollColumn = { topic: { slug: string; name: string }, polls: PollItem[] };

const hasSupabase =
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL) &&
  !!(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY);

function chunk<T>(arr: T[], n: number) {
  const out: T[][] = Array.from({ length: n }, () => []);
  arr.forEach((x, i) => out[i % n].push(x));
  return out;
}

function normalizeRows(rows: any[]): PollItem[] {
  return (rows ?? [])
    .map((r) => {
      const question =
        r.question ??
        r.question_text ??
        r.title ??
        r.text ??
        r.prompt ??
        "";
      if (!String(question).trim()) return null;

      const id =
        r.poll_id_uuid ??
        r.id ??
        r.uuid ??
        r.pk ??
        `${r.slug ?? "poll"}:${Math.random()}`;

      const slug = r.poll_slug ?? r.slug ?? null;

      return { id: String(id), slug, question: String(question) };
    })
    .filter(Boolean) as PollItem[];
}

async function fetchAnyPolls(supabase: ReturnType<typeof createClient>, max: number) {
  // Try multiple tables/views you likely have (based on your screenshots)
  const candidates = [
    "polls1",
    "v_polls",
    "v_polls_preview",
    "v_polls_public",
    "polls", // fallback if a simple table exists
  ];

  for (const table of candidates) {
    const { data, error } = await supabase.from(table).select("*").limit(max);
    if (error) {
      console.error(`[home-polls] ${table} error`, error);
      continue;
    }
    if (data && data.length) {
      return { table, rows: data };
    }
  }
  return { table: null, rows: [] };
}

export async function getHomepagePollColumns(
  numColumns = 3,
  pollsPerColumn = 50
): Promise<PollColumn[]> {
  if (!hasSupabase) return [];

  const supabase = createClient();

  // Pull a large pool so we can confidently fill all columns.
  const { table, rows } = await fetchAnyPolls(
    supabase,
    numColumns * pollsPerColumn * 3
  );

  if (!table || !rows?.length) {
    console.warn("[home-polls] No rows from any poll table/view");
    return [];
  }

  const items = normalizeRows(rows);
  if (!items.length) {
    console.warn(`[home-polls] ${table} returned rows, but no recognizable question field`);
    return [];
  }

  // Evenly distribute across N columns, then cap each column.
  const cols = chunk(items, numColumns).map((arr) => arr.slice(0, pollsPerColumn));
  const titles = ["Trending Polls", "Hot Right Now", "Popular Topics"];

  return cols.map((polls, i) => ({
    topic: { slug: `col-${i + 1}`, name: titles[i] ?? `Polls ${i + 1}` },
    polls,
  }));
}
