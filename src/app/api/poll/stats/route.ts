import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type PollStatsPayload = {
  totalPolls: number;
  totalVotes: number;
  lastVoteAt: string | null;
};

export async function GET() {
  try {
    const { count: totalPolls, error: pollsError } = await supabase
      .from("polls1")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    if (pollsError) throw pollsError;

    const { data: voteRows, error: votesError } = await supabase
      .from("v_poll_results")
      .select("votes");

    if (votesError) throw votesError;

    const totalVotes = voteRows?.reduce((sum, row) => sum + Number(row?.votes ?? 0), 0) ?? 0;

    const payload: PollStatsPayload = {
      totalPolls: totalPolls ?? 0,
      totalVotes,
      lastVoteAt: null,
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Error loading poll stats:", error);
    return NextResponse.json({ error: "Failed to load poll stats" }, { status: 500 });
  }
}
