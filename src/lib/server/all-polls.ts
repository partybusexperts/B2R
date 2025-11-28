import { createClient } from "@/lib/supabase/server";
import type { HomePollColumn, RawPoll } from "@/lib/home-polls";

const MAX_ROWS = 50000;
const MAX_OPTION_ROWS = 200000;

type OptionRow = Record<string, unknown>;

function coerceString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const str = typeof value === "string" ? value : String(value);
  const trimmed = str.trim();
  return trimmed.length ? trimmed : null;
}

function normalizePollId(row: OptionRow): string | null {
  const fields = [
    "poll_id_uuid",
    "poll_uuid",
    "poll_id",
    "pollid",
    "poll",
    "poll_pk",
    "pollId",
  ];
  for (const field of fields) {
    const value = coerceString(row[field]);
    if (value) return value;
  }
  return null;
}

function normalizeLabel(row: OptionRow): string | null {
  const fields = [
    "label",
    "option_label",
    "text",
    "title",
    "value",
    "option",
    "name",
    "option_value",
  ];
  for (const field of fields) {
    const value = coerceString(row[field]);
    if (value) return value;
  }
  return null;
}

function normalizeSort(row: OptionRow): number {
  const fields = ["sort_order", "ord", "order", "position", "rank", "idx"];
  for (const field of fields) {
    const raw = row[field];
    const num = typeof raw === "number" ? raw : raw != null ? Number(raw) : Number.NaN;
    if (!Number.isNaN(num)) return num;
  }
  return 0;
}

export async function getAllPolls(): Promise<RawPoll[]> {
  const supabase = createClient();

  const { data: pollRows, error: pollError } = await supabase
    .from("polls1")
    .select("id, slug, question")
    .limit(MAX_ROWS);

  if (pollError) {
    console.error("getAllPolls: error fetching polls1", pollError.message);
    return [];
  }

  if (!pollRows?.length) {
    console.warn("getAllPolls: no polls found in polls1");
    return [];
  }

  const { data: optionRows, error: optionError } = await supabase
    .from("poll_options1")
    .select("*")
    .limit(MAX_OPTION_ROWS);

  if (optionError) {
    console.error("getAllPolls: error fetching poll_options1", optionError.message);
    return pollRows.map((poll) => ({
      id: String(poll.id),
      slug: poll.slug ?? null,
      question: poll.question ?? "",
      options: [],
    }));
  }

  type NormalizedOption = { label: string; sort: number };
  const optionsByPoll = new Map<string, NormalizedOption[]>();
  for (const row of optionRows ?? []) {
    const optionRow = row as OptionRow;
    const pollId = normalizePollId(optionRow);
    const label = normalizeLabel(optionRow);
    if (!pollId || !label) continue;
    const normalized: NormalizedOption = { label, sort: normalizeSort(optionRow) };
    if (!optionsByPoll.has(pollId)) optionsByPoll.set(pollId, []);
    optionsByPoll.get(pollId)!.push(normalized);
  }

  for (const [, list] of optionsByPoll.entries()) {
    list.sort((a, b) => {
      if (a.sort !== b.sort) return a.sort - b.sort;
      return a.label.localeCompare(b.label);
    });
  }

  const result: RawPoll[] = (pollRows as any[]).map((poll) => {
    const pollId = String(poll.id);
    const optionLabels = (optionsByPoll.get(pollId) ?? []).map((opt) => opt.label);

    return {
      id: pollId,
      slug: poll.slug ?? null,
      question: poll.question ?? "",
      options: optionLabels,
    } satisfies RawPoll;
  });

  if (result.length) {
    console.log("getAllPolls result sample:", result[0]);
  }

  return result;
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
