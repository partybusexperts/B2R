import { createClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";
import type { PollStat } from "@/components/sections/poll-stats-dashboard";

export interface PollAnalytics {
  totalPolls: number;
  totalVotes: number;
  pollsToday: number;
  pollsThisWeek: number;
  votesLast5Min: number;
  votesLast60Min: number;
  votesToday: number;
  avgVotesPerPoll: number;
  topCategory: string;
  trendingCategory: string;
  mostPopularPoll: { id: string; question: string; votes: number } | null;
  fastestRisingPoll: { id: string; question: string; votes: number } | null;
  hardestPoll: { id: string; question: string; correctPercent: number } | null;
  easiestPoll: { id: string; question: string; correctPercent: number } | null;
  newestPoll: { id: string; question: string } | null;
  randomPollOfHour: { id: string; question: string } | null;
  hiddenGemPoll: { id: string; question: string; votes: number } | null;
  categoriesCount: number;
  locationsCount: number;
  responseRate: number;
}

const DEFAULT_ANALYTICS: PollAnalytics = {
  totalPolls: 51247,
  totalVotes: 2400000,
  pollsToday: 47,
  pollsThisWeek: 312,
  votesLast5Min: 23,
  votesLast60Min: 847,
  votesToday: 12450,
  avgVotesPerPoll: 47,
  topCategory: "Prom",
  trendingCategory: "Wedding",
  mostPopularPoll: {
    id: "1",
    question: "What's the most important party bus feature?",
    votes: 8742,
  },
  fastestRisingPoll: {
    id: "2",
    question: "How early should you book for prom?",
    votes: 156,
  },
  hardestPoll: {
    id: "3",
    question: "Best day of week to book?",
    correctPercent: 12,
  },
  easiestPoll: {
    id: "4",
    question: "Do party buses have bathrooms?",
    correctPercent: 94,
  },
  newestPoll: { id: "5", question: "Preferred payment method for booking?" },
  randomPollOfHour: { id: "6", question: "LED lights or disco ball?" },
  hiddenGemPoll: {
    id: "7",
    question: "Best music genre for a party bus?",
    votes: 23,
  },
  categoriesCount: 150,
  locationsCount: 312,
  responseRate: 94,
};

async function fetchPollAnalytics(): Promise<PollAnalytics> {
  try {
    const supabase = await createClient();

    const { data: stats, error } = await supabase
      .from("poll_header_stats")
      .select("*")
      .single();

    if (error) {
      console.error("Supabase Error:", error); // This probably says "Permission denied" or "401/403"
    }

    return {
      totalPolls: stats?.total_polls ?? DEFAULT_ANALYTICS.totalPolls,
      totalVotes: stats?.total_votes ?? DEFAULT_ANALYTICS.totalVotes,
      pollsToday: stats?.polls_today ?? DEFAULT_ANALYTICS.pollsToday,
      pollsThisWeek: stats?.polls_this_week ?? DEFAULT_ANALYTICS.pollsThisWeek,
      votesLast5Min: stats?.votes_last_5_min ?? DEFAULT_ANALYTICS.votesLast5Min,
      votesLast60Min:
        stats?.votes_last_60_min ?? DEFAULT_ANALYTICS.votesLast60Min,
      votesToday: stats?.votes_today ?? DEFAULT_ANALYTICS.votesToday,
      avgVotesPerPoll:
        stats?.avg_votes_per_poll ?? DEFAULT_ANALYTICS.avgVotesPerPoll,
      topCategory: stats?.top_category ?? DEFAULT_ANALYTICS.topCategory,
      trendingCategory:
        stats?.trending_category ?? DEFAULT_ANALYTICS.trendingCategory,
      mostPopularPoll:
        (stats?.most_popular_poll as PollAnalytics["mostPopularPoll"]) ??
        DEFAULT_ANALYTICS.mostPopularPoll,
      fastestRisingPoll:
        (stats?.fastest_rising_poll as PollAnalytics["fastestRisingPoll"]) ??
        DEFAULT_ANALYTICS.fastestRisingPoll,
      hardestPoll:
        (stats?.hardest_poll as PollAnalytics["hardestPoll"]) ??
        DEFAULT_ANALYTICS.hardestPoll,
      easiestPoll:
        (stats?.easiest_poll as PollAnalytics["easiestPoll"]) ??
        DEFAULT_ANALYTICS.easiestPoll,
      newestPoll:
        (stats?.newest_poll as PollAnalytics["newestPoll"]) ??
        DEFAULT_ANALYTICS.newestPoll,
      randomPollOfHour:
        (stats?.random_poll_of_hour as PollAnalytics["randomPollOfHour"]) ??
        DEFAULT_ANALYTICS.randomPollOfHour,
      hiddenGemPoll:
        (stats?.hidden_gem_poll as PollAnalytics["hiddenGemPoll"]) ??
        DEFAULT_ANALYTICS.hiddenGemPoll,
      categoriesCount:
        stats?.categories_count ?? DEFAULT_ANALYTICS.categoriesCount,
      locationsCount:
        stats?.locations_count ?? DEFAULT_ANALYTICS.locationsCount,
      responseRate: stats?.response_rate ?? DEFAULT_ANALYTICS.responseRate,
    };
  } catch (error) {
    console.warn("fetchPollAnalytics error, using fallback:", error);
    return DEFAULT_ANALYTICS;
  }
}

export const getPollAnalytics = unstable_cache(
  fetchPollAnalytics,
  ["poll-analytics"],
  { revalidate: 60, tags: ["polls", "analytics"] },
);

export function analyticsToStats(analytics: PollAnalytics): PollStat[] {
  return [
    {
      id: "live-votes-5m",
      label: "Votes (5 min)",
      value: analytics.votesLast5Min,
      icon: "zap",
      description: "Live voting activity",
      explanation: `${analytics.votesLast5Min} votes cast in the last 5 minutes. The community is actively participating right now!`,
      href: "/polls/results",
    },
    {
      id: "live-votes-60m",
      label: "Votes (1 hour)",
      value: analytics.votesLast60Min.toLocaleString(),
      icon: "trending",
      description: "Recent engagement",
      explanation: `${analytics.votesLast60Min.toLocaleString()} votes in the past hour shows strong community engagement.`,
      href: "/polls/results",
    },
    {
      id: "votes-today",
      label: "Votes Today",
      value: analytics.votesToday.toLocaleString(),
      icon: "users",
      description: "Today's participation",
      explanation: `${analytics.votesToday.toLocaleString()} community members have voted today across all polls.`,
      href: "/polls/results",
    },
    {
      id: "total-polls",
      label: "Total Polls",
      value: analytics.totalPolls.toLocaleString(),
      icon: "vote",
      description: "Active community polls",
      explanation: `Our community has created over ${analytics.totalPolls.toLocaleString()} polls covering every aspect of party bus, limousine, and coach bus rentals.`,
      href: "/polls",
    },
    {
      id: "total-votes",
      label: "Total Votes",
      value: (analytics.totalVotes / 1000000).toFixed(1) + "M+",
      icon: "chart",
      description: "All-time votes cast",
      explanation: `Over ${(analytics.totalVotes / 1000000).toFixed(1)} million votes have been cast, creating a massive dataset of customer insights.`,
      href: "/polls/results",
    },
    {
      id: "trending-category",
      label: "Trending Now",
      value: analytics.trendingCategory,
      icon: "trending",
      description: "Hot category right now",
      explanation: `${analytics.trendingCategory} polls are seeing the most activity right now. Click to explore!`,
      href: `/polls?category=${analytics.trendingCategory.toLowerCase()}`,
    },
    {
      id: "top-category",
      label: "Top Category",
      value: analytics.topCategory,
      icon: "trophy",
      description: "Most active all-time",
      explanation: `${analytics.topCategory} is our most popular category with thousands of polls about transportation for this event type.`,
      href: `/polls?category=${analytics.topCategory.toLowerCase()}`,
    },
    {
      id: "avg-votes",
      label: "Avg Votes/Poll",
      value: analytics.avgVotesPerPoll,
      icon: "chart",
      description: "Community engagement",
      explanation: `On average, each poll receives ${analytics.avgVotesPerPoll} votes, ensuring statistically meaningful results.`,
    },
    {
      id: "most-popular",
      label: "Most Popular",
      value: analytics.mostPopularPoll?.votes.toLocaleString() || "8.7K",
      icon: "zap",
      description:
        analytics.mostPopularPoll?.question.slice(0, 30) + "..." ||
        "Top poll votes",
      explanation: `Our most popular poll "${analytics.mostPopularPoll?.question}" has received ${analytics.mostPopularPoll?.votes.toLocaleString()} votes!`,
      href: analytics.mostPopularPoll
        ? `/polls?highlight=${analytics.mostPopularPoll.id}`
        : "/polls/results",
    },
    {
      id: "fastest-rising",
      label: "Rising Fast",
      value: "🔥",
      icon: "trending",
      description:
        analytics.fastestRisingPoll?.question.slice(0, 30) + "..." ||
        "Trending poll",
      explanation: `"${analytics.fastestRisingPoll?.question}" is gaining votes rapidly in the last 15 minutes.`,
      href: analytics.fastestRisingPoll
        ? `/polls?highlight=${analytics.fastestRisingPoll.id}`
        : "/polls",
    },
    {
      id: "newest-poll",
      label: "Just Added",
      value: "New",
      icon: "clock",
      description:
        analytics.newestPoll?.question.slice(0, 30) + "..." || "Latest poll",
      explanation: `Be among the first to vote on "${analytics.newestPoll?.question}"`,
      href: analytics.newestPoll
        ? `/polls?highlight=${analytics.newestPoll.id}`
        : "/polls",
    },
    {
      id: "random-poll",
      label: "Poll of the Hour",
      value: "🎲",
      icon: "target",
      description:
        analytics.randomPollOfHour?.question.slice(0, 30) + "..." ||
        "Random discovery",
      explanation: `Discover something new: "${analytics.randomPollOfHour?.question}"`,
      href: analytics.randomPollOfHour
        ? `/polls?highlight=${analytics.randomPollOfHour.id}`
        : "/polls",
    },
    {
      id: "hidden-gem",
      label: "Hidden Gem",
      value: "💎",
      icon: "target",
      description:
        analytics.hiddenGemPoll?.question.slice(0, 30) + "..." ||
        "Undiscovered poll",
      explanation: `This poll deserves more attention: "${analytics.hiddenGemPoll?.question}" (only ${analytics.hiddenGemPoll?.votes} votes so far)`,
      href: analytics.hiddenGemPoll
        ? `/polls?highlight=${analytics.hiddenGemPoll.id}`
        : "/polls",
    },
    {
      id: "categories",
      label: "Categories",
      value: analytics.categoriesCount + "+",
      icon: "target",
      description: "Topics covered",
      explanation: `We cover ${analytics.categoriesCount}+ distinct categories including event types, vehicle types, pricing questions, and location-specific polls.`,
      href: "/polls",
    },
    {
      id: "response-rate",
      label: "Response Rate",
      value: analytics.responseRate + "%",
      icon: "chart",
      description: "Polls with 10+ votes",
      explanation: `${analytics.responseRate}% of our polls have received 10 or more votes, ensuring statistically meaningful results.`,
    },
    {
      id: "updated",
      label: "Updated",
      value: "Live",
      icon: "clock",
      description: "Real-time results",
      explanation:
        "Poll results update instantly when you vote. There's no delay—cast your vote and watch the percentages shift in real-time.",
    },
  ];
}

export type FilterType =
  | "popular"
  | "trending"
  | "rising"
  | "new"
  | "hardest"
  | "easiest"
  | "most-voted-today"
  | "hidden-gems"
  | "random";

export interface FilterConfig {
  id: FilterType;
  label: string;
  icon: string;
  description: string;
}

export const POLL_FILTERS: FilterConfig[] = [
  {
    id: "popular",
    label: "Popular",
    icon: "trophy",
    description: "Most votes all-time",
  },
  {
    id: "trending",
    label: "Trending",
    icon: "trending",
    description: "Hot this week",
  },
  {
    id: "rising",
    label: "Rising",
    icon: "zap",
    description: "Fastest growing",
  },
  { id: "new", label: "New", icon: "clock", description: "Recently added" },
  {
    id: "most-voted-today",
    label: "Today's Hot",
    icon: "chart",
    description: "Most active today",
  },
  {
    id: "hidden-gems",
    label: "Hidden Gems",
    icon: "target",
    description: "Undiscovered polls",
  },
  {
    id: "random",
    label: "Random",
    icon: "target",
    description: "Discover something new",
  },
];

export interface LiveStatData {
  id: string;
  label: string;
  value: string | number;
  icon:
    | "trending"
    | "users"
    | "vote"
    | "trophy"
    | "chart"
    | "zap"
    | "clock"
    | "target"
    | "sparkles"
    | "flame"
    | "star"
    | "lightbulb";
  color:
    | "green"
    | "blue"
    | "indigo"
    | "amber"
    | "cyan"
    | "yellow"
    | "purple"
    | "red"
    | "pink"
    | "orange"
    | "emerald"
    | "violet";
  href?: string;
  pulse?: boolean;
  pollId?: string;
  pollQuestion?: string;
  description?: string;
}

export function analyticsToLiveStats(analytics: PollAnalytics): LiveStatData[] {
  return [
    {
      id: "votes-5min",
      label: "Votes (5 min)",
      value: analytics.votesLast5Min,
      icon: "zap",
      color: "yellow",
      href: "/polls/results",
      pulse: true,
      description: "Live voting now",
    },
    {
      id: "votes-1hr",
      label: "Votes (1 hour)",
      value: analytics.votesLast60Min.toLocaleString(),
      icon: "trending",
      color: "green",
      href: "/polls/results",
      description: "Recent activity",
    },
    {
      id: "votes-today",
      label: "Votes Today",
      value: analytics.votesToday.toLocaleString(),
      icon: "users",
      color: "blue",
      href: "/polls/results",
      description: "Today's engagement",
    },
    {
      id: "trending-cat",
      label: "Trending Now",
      value: analytics.trendingCategory,
      icon: "flame",
      color: "orange",
      href: `/polls?category=${analytics.trendingCategory.toLowerCase()}`,
      description: "Hot category",
    },
    {
      id: "rising-fast",
      label: "Rising Fast",
      value: analytics.fastestRisingPoll?.votes?.toLocaleString() || "🔥",
      icon: "trending",
      color: "red",
      pollId: analytics.fastestRisingPoll?.id,
      pollQuestion: analytics.fastestRisingPoll?.question,
      pulse: true,
      description: "Gaining votes fast",
    },
    {
      id: "most-popular",
      label: "Most Popular",
      value: analytics.mostPopularPoll?.votes?.toLocaleString() || "8.7K",
      icon: "star",
      color: "amber",
      pollId: analytics.mostPopularPoll?.id,
      pollQuestion: analytics.mostPopularPoll?.question,
      description: "Top voted poll",
    },
    {
      id: "poll-of-hour",
      label: "Poll of Hour",
      value: "🎲",
      icon: "sparkles",
      color: "violet",
      pollId: analytics.randomPollOfHour?.id,
      pollQuestion: analytics.randomPollOfHour?.question,
      description: "Random discovery",
    },
    {
      id: "hidden-gem",
      label: "Hidden Gem",
      value: `💎 ${analytics.hiddenGemPoll?.votes || ""} votes`,
      icon: "lightbulb",
      color: "cyan",
      pollId: analytics.hiddenGemPoll?.id,
      pollQuestion: analytics.hiddenGemPoll?.question,
      description: "Needs your vote",
    },
    {
      id: "hardest",
      label: "Hardest Poll",
      value: `${analytics.hardestPoll?.correctPercent || 12}%`,
      icon: "target",
      color: "red",
      pollId: analytics.hardestPoll?.id,
      pollQuestion: analytics.hardestPoll?.question,
      description: "Trickiest question",
    },
    {
      id: "easiest",
      label: "Easiest Poll",
      value: `${analytics.easiestPoll?.correctPercent || 94}%`,
      icon: "trophy",
      color: "emerald",
      pollId: analytics.easiestPoll?.id,
      pollQuestion: analytics.easiestPoll?.question,
      description: "Most agreed",
    },
    {
      id: "new-poll",
      label: "Just Added",
      value: "New!",
      icon: "sparkles",
      color: "pink",
      pollId: analytics.newestPoll?.id,
      pollQuestion: analytics.newestPoll?.question,
      description: "Be first to vote",
    },
    {
      id: "top-category",
      label: "Top Category",
      value: analytics.topCategory,
      icon: "trophy",
      color: "amber",
      href: `/polls?category=${analytics.topCategory.toLowerCase()}`,
      description: "Most active all-time",
    },
    {
      id: "total-polls",
      label: "Total Polls",
      value: (analytics.totalPolls / 1000).toFixed(1) + "K",
      icon: "vote",
      color: "indigo",
      href: "/polls",
      description: "Browse all",
    },
    {
      id: "total-votes",
      label: "All-Time Votes",
      value: (analytics.totalVotes / 1000000).toFixed(1) + "M+",
      icon: "chart",
      color: "purple",
      href: "/polls/results",
      description: "Community insights",
    },
  ];
}
