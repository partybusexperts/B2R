"use client";
import { createClient } from "../supabase/client";

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

  // 1) Prefer normalized public view
  if (pollId) {
    const { data, error } = await supabase
      .from("v_options_public")
      .select("option_id,label")
      .eq("poll_id", pollId)
      .limit(50);
    if (!error && data?.length) return data as OptionRow[];
  }
  if (slug) {
    const { data, error } = await supabase
      .from("v_options_public")
      .select("option_id,label")
      .eq("poll_slug", slug)
      .limit(50);
    if (!error && data?.length) return data as OptionRow[];
  }

  // 2) Fallbacks (if someone renames the view)
  if (pollId) {
    for (const tryCol of ["poll_id_uuid", "poll_uuid", "poll_id"]) {
      const { data, error } = await supabase
        .from("poll_options1")
        .select(`label:label, option_id:option_id_uuid, option_uuid, id, uuid`)
        .eq(tryCol, pollId)
        .limit(50);

      if (!error && data?.length) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (data as any[]).map((r: any) => ({
          option_id:
            r.option_id?.toString() ??
            r.option_uuid?.toString() ??
            r.id?.toString() ??
            r.uuid?.toString() ??
            "",
          label:
            r.label ??
            r.option_text ??
            r.text ??
            r.title ??
            r.option ??
            r.name ??
            String(r.option_value ?? ""),
        }));
      }
    }
  }

  return [];
}

export type TotalsRow = { option_id: string; votes: number };

export async function fetchTotals(pollId: string) {
  if (!hasEnv) return new Map<string, number>();
  const supabase = createClient();
  const { data } = await supabase
    .from("v_poll_vote_totals")
    .select("option_id, votes")
    .eq("poll_id", pollId);
  const m = new Map<string, number>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (data ?? []).forEach((r: any) => m.set(String(r.option_id), Number(r.votes || 0)));
  return m;
}

export async function castVote(pollId: string, optionId: string) {
  if (!hasEnv) return { ok: false };
  const supabase = createClient();

  // Prevent easy dupes in the same browser (soft guard)
  const key = `voted:${pollId}`;
  if (typeof window !== "undefined" && localStorage.getItem(key)) {
    return { ok: true, already: true };
  }

  const { error } = await supabase
    .from("poll_votes")
    .insert({ poll_id: pollId, option_id: optionId });
  if (!error && typeof window !== "undefined") {
    localStorage.setItem(key, "1");
  }
  return { ok: !error, error };
}
