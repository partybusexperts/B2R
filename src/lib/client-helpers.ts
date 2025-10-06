import { createClient } from "@/lib/supabase/client";

function asMessage(e: unknown) {
  if (e instanceof Error) return e.message;
  try { return JSON.stringify(e); } catch { return String(e); }
}

type Totals = { totals: Record<string, number>; totalVotes: number };

function deviceToken(): string {
  try {
    const key = "b2r_device_id";
    let t = localStorage.getItem(key);
    if (!t) {
      t = (crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2));
      localStorage.setItem(key, t);
    }
    return t;
  } catch {
    return Math.random().toString(36).slice(2);
  }
}

/** Insert or update the user's vote (one per device per poll). */
export async function castVote(pollId: string, optionId: string) {
  const supabase = createClient();
  const token = deviceToken();

  // write BOTH columns to satisfy schemas that have voter_key NOT NULL
  const record = { poll_id: pollId, option_id: optionId, voter_key: token, voter_token: token };

  // 1) try conflict on (poll_id, voter_key)
  let { error } = await supabase
    .from("poll_votes1")
    .upsert(record, { onConflict: "poll_id,voter_key" });

  // 2) if that index/constraint doesn't exist, fall back to (poll_id, voter_token)
  if (error && /unique|exclusion constraint matching|does not exist/i.test(asMessage(error))) {
    const r2 = await supabase
      .from("poll_votes1")
      .upsert(record, { onConflict: "poll_id,voter_token" });
    error = r2.error ?? null;
  }

  if (error) throw new Error(asMessage(error));
}

/** Read aggregate totals for a poll: { option_id: votes }, plus totalVotes. */
export async function fetchTotals(pollId: string): Promise<Totals> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("v_poll_results")
    .select("option_id, votes")
    .eq("poll_id", pollId);

  if (error) throw new Error(asMessage(error));

  type ResultRow = { option_id: string; votes: number };
  const totals: Record<string, number> = {};
  let totalVotes = 0;
  for (const row of (data ?? []) as ResultRow[]) {
    const v = Number(row.votes) || 0;
    totals[row.option_id] = v;
    totalVotes += v;
  }
  return { totals, totalVotes };
}

/** Load options for a poll. */
export async function fetchOptionsForPoll(pollId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("v_poll_options_label")
    .select("id, label, sort_order")
    .eq("poll_id", pollId)
    .order("sort_order", { ascending: true });

  type SupabaseError2 = { message?: string };
  if (error) throw new Error((error as SupabaseError2)?.message ?? String(error));

  type OptionRow = { id: string; label?: string | null };
  return ((data ?? []) as OptionRow[]).map((r) => ({ id: String(r.id), label: String(r.label ?? "") }));
}
