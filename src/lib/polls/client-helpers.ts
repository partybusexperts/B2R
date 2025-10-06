import { createClient } from "../supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

export type OptionRow = { option_id: string; label: string };

const hasEnv =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function fetchOptionsForPoll(
  pollId: string | null,
  slug: string | null
): Promise<OptionRow[]> {
  if (!hasEnv) return [];
  const supabase = createClient();

  if (pollId) {
    const candidates = ["poll_id", "poll_id_text", "poll_uuid", "id"];
    for (const col of candidates) {
      try {
        const { data, error, status } = await supabase
          .from("v_options_public")
          .select("option_id, option_label, poll_id_text, poll_slug")
          .eq(col, pollId)
          .limit(200);
        if (error && status === 400) continue; // column missing on view
        if (error) {
          console.warn(`[fetchOptionsForPoll] ${col} ->`, error);
          continue;
        }
        if (data && data.length) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (data as any[]).map((r: any) => ({
            option_id: String(r.option_id ?? ""),
            label: String(r.option_label ?? r.label ?? ""),
          }));
        }
      } catch (err) {
        console.warn("fetchOptionsForPoll unexpected error", err);
      }
    }
  }

  if (slug) {
    const { data, error } = await supabase
      .from("v_options_public")
      .select("option_id,label,poll_slug")
      .eq("poll_slug", slug)
      .limit(200);
    if (!error && data?.length) return data as OptionRow[];
  }

  return [];
}

export async function fetchTotals(pollId: string) {
  if (!hasEnv) return new Map<string, number>();
  const supabase = createClient();
  const res = await fetchTotalsForPollIds(supabase, [pollId]);
  const byPoll = res[pollId] ?? {};
  const m = new Map<string, number>();
  for (const [opt, v] of Object.entries(byPoll)) {
    m.set(String(opt), Number(v ?? 0) || 0);
  }
  return m;
}

export async function fetchTotalsForPollIds(
  supabase: SupabaseClient,
  pollIds: string[]
) {
  if (!pollIds?.length) return {} as Record<string, Record<string, number>>;
  const { data, error } = await supabase
    .from("v_poll_results_cast")
    .select("poll_id, option_id, votes")
    .in("poll_id", pollIds);

  if (error) {
    console.error("fetchTotalsForPollIds error", error);
    return {} as Record<string, Record<string, number>>;
  }

  const totals: Record<string, Record<string, number>> = {};
  for (const row of (data ?? [])) {
    const r = row as Record<string, unknown>;
    const p = String(r.poll_id ?? "");
    const o = String(r.option_id ?? "");
    const v = Number(r.votes as number ?? Number(r.votes ?? 0)) || 0;
    if (!p) continue;
    if (!totals[p]) totals[p] = {};
    totals[p][o] = v;
  }
  return totals;
}

export async function castVote(pollId: string, optionId: string) {
  if (!hasEnv) return { ok: false };
  const supabase = createClient();

  const key = `voted:${pollId}`;
  if (typeof window !== "undefined" && localStorage.getItem(key)) {
    return { ok: true, already: true };
  }

  const { error, data } = await supabase
    .from("poll_votes1")
    .insert({ poll_id: pollId, option_id: optionId })
    .select();

  if (!error && typeof window !== "undefined") {
    try {
      localStorage.setItem(key, "1");
    } catch {
      // ignore
    }
  }

  return { ok: !error, error, data };
}

