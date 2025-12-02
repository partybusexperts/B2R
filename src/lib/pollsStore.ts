import { createClient } from "@/lib/supabase/server";

export type PollRow = {
  id: string;
  question: string;
  options: string[];
  tags: string[] | null;
  active: boolean | null;
  slug?: string | null;
};

export type VotesMap = Record<string, Record<string, number>>;

type VoteSource = {
  table: string;
  select: string;
  optionField: string;
  valueField?: string;
  aggregated?: boolean;
};

const VOTE_SOURCES: VoteSource[] = [
  {
    table: "v_poll_results",
    select: "poll_id, option_id, votes",
    optionField: "option_id",
    valueField: "votes",
    aggregated: true,
  },
  {
    table: "poll_votes1",
    select: "poll_id, option_id",
    optionField: "option_id",
  },
  {
    table: "poll_votes",
    select: "poll_id, option_id",
    optionField: "option_id",
  },
];

function buildVotesMap(rows: Record<string, unknown>[], source: VoteSource): VotesMap {
  const out: VotesMap = {};
  const optionField = source.optionField;
  const valueField = source.valueField ?? "votes";

  for (const row of rows) {
    const rec = row as Record<string, unknown>;
    const pollId = String(rec.poll_id);
    const optionKey = String(rec[optionField]);
    const value = source.aggregated ? Number(rec[valueField] ?? 0) : 1;

    if (!out[pollId]) out[pollId] = {};
    out[pollId][optionKey] = (out[pollId][optionKey] ?? 0) + value;
  }

  return out;
}

function mergeVotesMaps(maps: VotesMap[]): VotesMap {
  const out: VotesMap = {};
  for (const map of maps) {
    for (const [pollId, options] of Object.entries(map)) {
      if (!out[pollId]) out[pollId] = {};
      for (const [opt, count] of Object.entries(options)) {
        out[pollId][opt] = (out[pollId][opt] ?? 0) + (count ?? 0);
      }
    }
  }
  return out;
}

export async function getPollsAndVotesByTag(tag: string): Promise<{ polls: PollRow[]; votes: VotesMap }> {
  const supabase = createClient();

  let polls: PollRow[] = [];

  if (tag === "__all__") {
    const { data, error } = await supabase
      .from("polls1")
      .select("id, question, options, active, slug");

    if (error) throw new Error(error.message);

    polls = (data || []).map((row: any) => ({
      id: String(row.id),
      question: row.question,
      options: row.options || [],
      tags: null,
      active: row.active ?? true,
      slug: row.slug ?? null,
    }));
  } else {
    const { data, error } = await supabase
      .from("v_polls_public")
      .select("poll_id, question, options, tags, active, slug")
      .contains("tags", [tag])
      .eq("active", true);

    if (error) throw new Error(error.message);

    polls = (data || []).map((row: any) => ({
      id: String(row.poll_id),
      question: row.question,
      options: row.options || [],
      tags: row.tags || null,
      active: row.active,
      slug: row.slug ?? null,
    }));
  }

  const ids = polls.map((poll) => poll.id);
  if (!ids.length) {
    return { polls, votes: {} };
  }

  const maps: VotesMap[] = [];

  for (const source of VOTE_SOURCES) {
    const { data, error } = await supabase.from(source.table).select(source.select).in("poll_id", ids);

    if (error || !data?.length) continue;

    maps.push(buildVotesMap(data as Record<string, unknown>[], source));

    if (source.aggregated) break;
  }

  const votes = mergeVotesMaps(maps);
  return { polls, votes };
}

export async function getAll(): Promise<PollRow[]> {
  const { polls } = await getPollsAndVotesByTag("__all__");
  return polls;
}

export async function getAllPolls(): Promise<PollRow[]> {
  return getAll();
}

export default {
  getPollsAndVotesByTag,
  getAll,
  getAllPolls,
};

