import path from "node:path";
import { promises as fs } from "node:fs";
import { createClient } from "@/lib/supabase/server";
import type { HomePollColumn, RawPoll } from "@/lib/home-polls";

const SOURCE_TABLES = ["v_polls_public", "v_polls", "polls1"];
const OPTION_TABLES = ["v_poll_options_label", "poll_options1"];
const MAX_ROWS = 50000;
const PAGE_SIZE = 1000;
const MAX_OPTION_ROWS = 200000;
const OPTION_PAGE_SIZE = 2000;

function toStringArray(value: unknown): string[] | null {
  if (Array.isArray(value)) {
    return value
      .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
      .filter(Boolean);
  }
  return null;
}

function asRawPoll(row: Record<string, unknown>): RawPoll | null {
  const question =
    (row.question as string | undefined) ||
    (row.prompt as string | undefined) ||
    (row.title as string | undefined) ||
    "";

  const id =
    (row.poll_id_uuid as string | undefined) ||
    (row.poll_uuid as string | undefined) ||
    (row.poll_id as string | undefined) ||
    (row.id as string | undefined) ||
    (row.uuid as string | undefined) ||
    null;

  const slug = (row.poll_slug as string | undefined) || (row.slug as string | undefined) || null;

  if (!id || !question.trim()) {
    return null;
  }

  return {
    id: String(id),
    slug: slug ? String(slug) : `poll-${String(id)}`,
    question: question.trim(),
    options:
      toStringArray(row.options) ||
      toStringArray(row.choices) ||
      toStringArray(row.answers) ||
      null,
    tags: toStringArray(row.tags) || toStringArray(row.categories) || null,
  };
}

async function fetchPaginatedRows(
  supabase: ReturnType<typeof createClient>,
  table: string,
  selectColumns = "*",
  pageSize = PAGE_SIZE,
  maxRows = MAX_ROWS
) {
  const rows: Record<string, unknown>[] = [];
  let page = 0;
  while (page * pageSize < maxRows) {
    const from = page * pageSize;
    const to = Math.min(maxRows - 1, from + pageSize - 1);
    const { data, error } = await supabase.from(table).select(selectColumns).range(from, to);

    if (error) {
      console.warn(`[all-polls] ${table} -> ${error.message}`);
      break;
    }

    if (!data?.length) {
      break;
    }

    rows.push(...(data as Record<string, unknown>[]));

    if (data.length < pageSize) {
      break;
    }

    page += 1;
  }
  return rows;
}

type OptionRow = { poll_id?: string | null; label?: string | null; sort_order?: number | null };

async function fetchOptionsMap(supabase: ReturnType<typeof createClient>) {
  for (const table of OPTION_TABLES) {
    try {
      const rows = (await fetchPaginatedRows(
        supabase,
        table,
        "poll_id, label, sort_order",
        OPTION_PAGE_SIZE,
        MAX_OPTION_ROWS
      )) as OptionRow[];

      if (!rows.length) continue;

      const map = new Map<string, { label: string; order: number }[]>();
      for (const row of rows) {
        const pollId = row.poll_id ? String(row.poll_id) : null;
        const label = row.label ? String(row.label) : null;
        const order = typeof row.sort_order === "number" ? row.sort_order : Number(row.sort_order ?? 0);
        if (!pollId || !label) continue;
        if (!map.has(pollId)) map.set(pollId, []);
        map.get(pollId)!.push({ label, order });
      }

      if (!map.size) continue;

      const normalized = new Map<string, string[]>();
      map.forEach((list, pollId) => {
        const sorted = list
          .sort((a, b) => a.order - b.order)
          .map((entry) => entry.label)
          .filter(Boolean);
        if (sorted.length) normalized.set(pollId, sorted);
      });

      if (normalized.size) {
        return normalized;
      }
    } catch (err) {
      console.warn(`[all-polls] options ${table} fetch failed`, err);
    }
  }
  return new Map<string, string[]>();
}

async function loadFallbackPolls() {
  try {
    const file = await fs.readFile(path.join(process.cwd(), "public", "polls.json"), "utf8");
    const json = JSON.parse(file);
    if (Array.isArray(json)) {
      return json
        .map((row) => asRawPoll(row as Record<string, unknown>))
        .filter(Boolean) as RawPoll[];
    }
  } catch (err) {
    console.warn("[all-polls] fallback read failed", err);
  }
  return [];
}

async function mergeFallbackMetadata(polls: RawPoll[]) {
  const fallback = await loadFallbackPolls();
  if (!fallback.length) return;
  const index = new Map(fallback.map((poll) => [poll.id, poll]));
  polls.forEach((poll) => {
    const cached = index.get(poll.id);
    if (!cached) return;
    if ((!poll.options || !poll.options.length) && cached.options?.length) {
      poll.options = cached.options;
    }
    if ((!poll.tags || !poll.tags.length) && cached.tags?.length) {
      poll.tags = cached.tags;
    }
  });
}

export async function getAllPolls(): Promise<RawPoll[]> {
  const supabase = createClient();

  for (const table of SOURCE_TABLES) {
    try {
      const rows = (await fetchPaginatedRows(supabase, table))
        .map((row) => asRawPoll(row))
        .filter(Boolean) as RawPoll[];

      if (rows.length) {
        const optionsMap = await fetchOptionsMap(supabase);
        if (optionsMap.size) {
          rows.forEach((poll) => {
            const next = optionsMap.get(poll.id);
            if (next?.length) poll.options = next;
          });
        }

        await mergeFallbackMetadata(rows);

        return rows.slice(0, MAX_ROWS);
      }
    } catch (err) {
      console.warn(`[all-polls] ${table} fetch failed`, err);
    }
  }

  return await loadFallbackPolls();
}

export async function getAllPollColumns(numColumns = 3): Promise<HomePollColumn[]> {
  const rows = await getAllPolls();
  if (!rows.length || numColumns <= 0) return [];

  const sorted = rows.slice().sort((a, b) => (a.slug ?? a.question).localeCompare(b.slug ?? b.question));
  const perColumn = Math.ceil(sorted.length / numColumns);
  const columns: HomePollColumn[] = [];

  for (let i = 0; i < numColumns; i += 1) {
    const chunk = sorted.slice(i * perColumn, (i + 1) * perColumn);
    if (!chunk.length) continue;
    columns.push({
      key: `all-${i + 1}`,
      title: `All Polls · Column ${i + 1}`,
      items: chunk,
    });
  }

  return columns;
}
