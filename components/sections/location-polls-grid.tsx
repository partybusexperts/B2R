import { getPollsByLocation, getPolls, PollWithOptions } from "@/lib/data/polls";
import { LocationPollsClient } from "./location-polls.client";
import Link from "next/link";
import { MapPin, Zap, TrendingUp, Sparkles } from "lucide-react";

interface LocationPollsGridProps {
  cityName: string;
  stateName?: string;
  title?: string;
}

export async function LocationPollsGrid({
  cityName,
  stateName,
  title,
}: LocationPollsGridProps) {
  let polls = await getPollsByLocation(cityName, 50);
  let isLocationSpecific = true;

  if (!polls || polls.length < 6) {
    const fallbackPolls = await getPolls(50, "");
    if (fallbackPolls && fallbackPolls.length > 0) {
      polls = fallbackPolls;
      isLocationSpecific = false;
    }
  }

  if (!polls || polls.length === 0) {
    return null;
  }

  const totalVotesForPoll = (poll: PollWithOptions) =>
    (poll.options ?? []).reduce(
      (sum, opt) => sum + Number(opt.vote_count ?? 0),
      0,
    );

  const sortedPolls = [...polls].sort(
    (a, b) =>
      totalVotesForPoll(b) - totalVotesForPoll(a) ||
      (a.question ?? "").localeCompare(b.question ?? ""),
  );

  const totalVotes = sortedPolls.reduce(
    (sum, poll) => sum + totalVotesForPoll(poll),
    0
  );

  const displayTitle = isLocationSpecific 
    ? (title || `${cityName}${stateName ? `, ${stateName}` : ""} Polls`)
    : "Transportation Polls";

  const displaySubtitle = isLocationSpecific
    ? `See what locals in ${cityName} are thinking about party transportation.`
    : "See what the community is thinking about party bus and limo rentals.";

  const BadgeIcon = isLocationSpecific ? MapPin : Sparkles;
  const badgeText = isLocationSpecific ? "Local Community" : "Live Community";
  const badgeColor = isLocationSpecific ? "text-teal-400" : "text-yellow-400";
  const badgeTextColor = isLocationSpecific ? "text-teal-300" : "text-yellow-300";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0d1d3a] to-[#0a1628] py-20 md:py-28">
      <div className="absolute inset-0 bg-mesh opacity-30" />
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full bg-teal-500/5 blur-[150px] pointer-events-none animate-orb-drift" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full bg-blue-500/8 blur-[120px] pointer-events-none" />
      
      <div className="relative container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
            <BadgeIcon className={`w-4 h-4 ${badgeColor}`} />
            <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${badgeTextColor}`}>
              {badgeText}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-serif text-glow-white">
            {displayTitle}
          </h2>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
            {displaySubtitle}
          </p>
          
          <div className="mt-8 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-white/80">{totalVotes.toLocaleString()}+ votes</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white/80">{sortedPolls.length} local polls</span>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 md:p-8 animate-fade-up-delay-1">
          <LocationPollsClient polls={sortedPolls} cityName={cityName} />
        </div>

        <div className="mt-12 flex justify-center animate-fade-up-delay-2">
          <Link
            href="/polls"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full
              bg-gradient-to-r from-teal-600 to-blue-600 text-white font-bold text-lg
              shadow-[0_20px_50px_rgba(20,184,166,0.3)] transition-all duration-300
              hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(20,184,166,0.4)]"
          >
            <span>Explore all polls</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
