import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") || "all";
  const limit = parseInt(searchParams.get("limit") || "30");
  const category = searchParams.get("category") || "";

  try {
    const supabase = await createClient();
    
    let query = supabase
      .from("polls1")
      .select(`
        id,
        question,
        category_slug,
        category_data:poll_categories1 (name),
        options:poll_options1 (id, label, vote_count, ord)
      `)
      .filter("question", "not.ilike", "Your opinion on%");

    if (category) {
      query = query.ilike("category_slug", `%${category}%`);
    }

    switch (filter) {
      case "popular":
        query = query.order("id", { ascending: false }).limit(limit * 2);
        break;
      case "trending":
      case "rising":
      case "today":
        query = query.order("id", { ascending: false }).limit(limit);
        break;
      case "new":
        query = query.order("id", { ascending: false }).limit(limit);
        break;
      case "hardest":
      case "easiest":
      case "hidden-gems":
        query = query.limit(limit * 2);
        break;
      case "random":
        query = query.limit(100);
        break;
      default:
        query = query.limit(limit);
    }

    const { data: polls, error } = await query;

    if (error) {
      console.error("API polls/analytics error:", error);
      return NextResponse.json({ error: "Failed to fetch polls" }, { status: 500 });
    }

    if (!polls) {
      return NextResponse.json({ polls: [], filter });
    }

    let processedPolls = polls.map((poll) => {
      const options = poll.options || [];
      const totalVotes = options.reduce((sum: number, opt: { vote_count?: number }) => sum + (opt.vote_count || 0), 0);
      const sortedOptions = [...options].sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
      const topVotes = sortedOptions[0]?.vote_count || 0;
      const consensusPercent = totalVotes > 0 ? Math.round((topVotes / totalVotes) * 100) : 0;
      
      return {
        ...poll,
        totalVotes,
        consensusPercent,
        categoryName: poll.category_data?.name || poll.category_slug,
      };
    });

    switch (filter) {
      case "popular":
        processedPolls = processedPolls
          .sort((a, b) => b.totalVotes - a.totalVotes)
          .slice(0, limit);
        break;
      case "hardest":
        processedPolls = processedPolls
          .filter(p => p.totalVotes > 10)
          .sort((a, b) => a.consensusPercent - b.consensusPercent)
          .slice(0, limit);
        break;
      case "easiest":
        processedPolls = processedPolls
          .filter(p => p.totalVotes > 10)
          .sort((a, b) => b.consensusPercent - a.consensusPercent)
          .slice(0, limit);
        break;
      case "hidden-gems":
        processedPolls = processedPolls
          .filter(p => p.totalVotes > 5 && p.totalVotes < 50)
          .sort((a, b) => b.consensusPercent - a.consensusPercent)
          .slice(0, limit);
        break;
      case "random":
        processedPolls = processedPolls
          .sort(() => Math.random() - 0.5)
          .slice(0, limit);
        break;
    }

    return NextResponse.json({
      polls: processedPolls,
      filter,
      count: processedPolls.length,
    });
  } catch (error) {
    console.error("API polls/analytics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
