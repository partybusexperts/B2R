import Hero from "@/components/layout/hero";
import { PollResultsExplorer } from "@/components/sections/poll-results-explorer.client";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { EventsGrid } from "@/components/sections/events-grid";
import FleetSection from "@/components/sections/fleet-section";
import { TriviaCarousel, type TriviaItem } from "@/components/sections/trivia-carousel";
import { SectionDivider, PremiumDivider } from "@/components/layout/section-dividers";
import { createClient } from "@/lib/supabase/server";
import { getReviews } from "@/lib/data/reviews";
import { pageMetadata } from "@/lib/seo/metadata";
import { Flame } from "lucide-react";
import { LiveStatsBar, DEFAULT_LIVE_STATS } from "@/components/sections/live-stats-bar";
import { PollFilterTabs } from "@/components/sections/poll-filter-tabs";
import { getPollAnalytics, analyticsToLiveStats } from "@/lib/data/poll-analytics";

export const revalidate = 60;

export const metadata = pageMetadata({
  title: "Hot Results - Transportation Poll Results",
  description:
    "See how the community voted on transportation polls. Browse hot results by category and state. 51,000+ polls and 2.4 million votes.",
  path: "/polls/results",
});

const TRIVIA_ITEMS: TriviaItem[] = [
  {
    id: "1",
    question: "What percentage of group event planners say transportation is their biggest stress?",
    answer: "78% of event planners cite transportation coordination as their top logistical concern, ahead of catering and venue.",
    category: "Industry Stats",
    source: "Event Planning Association 2024",
  },
  {
    id: "2",
    question: "How far in advance do most couples book wedding transportation?",
    answer: "6-9 months before the wedding date. Peak season bookings (May-October) often require 12+ months advance notice.",
    category: "Booking Tips",
    source: "The Knot Wedding Study",
  },
  {
    id: "3",
    question: "What's the most popular party bus feature according to rider polls?",
    answer: "LED lighting systems and sound systems tie for first place, with 42% of riders ranking each as essential.",
    category: "Rider Preferences",
    source: "Bus2Ride Community Polls",
  },
  {
    id: "4",
    question: "What day of the week has the lowest party bus rental rates?",
    answer: "Tuesday and Wednesday rentals can be 30-40% cheaper than Friday or Saturday bookings.",
    category: "Money Saver",
    source: "Industry Pricing Data",
  },
  {
    id: "5",
    question: "How many guests is the sweet spot for party bus group size?",
    answer: "15-20 passengers is ideal—large enough for great energy, small enough that everyone stays connected.",
    category: "Planning Tips",
    source: "Event Coordinator Survey",
  },
];

async function getHotPolls() {
  const supabase = await createClient();
  
  const { data: polls, error } = await supabase
    .from("polls1")
    .select(`
      id,
      question,
      category_slug,
      options:poll_options1 (
        id,
        label,
        vote_count,
        ord
      )
    `)
    .order("ord", { referencedTable: "poll_options1", ascending: true })
    .limit(100);
  
  if (error || !polls) {
    return [];
  }

  const pollsWithVotes = polls
    .map(poll => ({
      ...poll,
      category_slug: poll.category_slug ?? undefined,
      totalVotes: (poll.options || []).reduce((sum: number, o: { vote_count?: number }) => sum + (o.vote_count || 0), 0)
    }))
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .slice(0, 8);

  return pollsWithVotes;
}

const categoryConfigs = [
  { slug: "party-bus", title: "Party Bus", gradient: "from-indigo-500 to-purple-500", textColor: "text-indigo-400", iconName: "Music" },
  { slug: "limousines", title: "Limousine", gradient: "from-amber-400 to-yellow-500", textColor: "text-amber-400", iconName: "Car" },
  { slug: "coach-buses", title: "Coach Bus", gradient: "from-teal-500 to-emerald-500", textColor: "text-teal-400", iconName: "Car" },
  { slug: "pricing", title: "Pricing", gradient: "from-green-500 to-emerald-500", textColor: "text-green-400", iconName: "TrendingUp" },
  { slug: "weddings", title: "Wedding", gradient: "from-rose-400 to-pink-500", textColor: "text-rose-400", iconName: "Heart" },
  { slug: "prom", title: "Prom", gradient: "from-pink-500 to-rose-500", textColor: "text-pink-400", iconName: "GraduationCap" },
  { slug: "bachelorette-parties", title: "Bachelorette", gradient: "from-fuchsia-500 to-purple-500", textColor: "text-fuchsia-400", iconName: "Sparkles" },
  { slug: "bachelor-parties", title: "Bachelor Party", gradient: "from-blue-500 to-cyan-500", textColor: "text-blue-400", iconName: "PartyPopper" },
  { slug: "corporate", title: "Corporate", gradient: "from-slate-500 to-gray-500", textColor: "text-slate-400", iconName: "Briefcase" },
  { slug: "graduation", title: "Graduation", gradient: "from-purple-500 to-violet-500", textColor: "text-purple-400", iconName: "GraduationCap" },
  { slug: "sweet-16", title: "Sweet 16", gradient: "from-pink-400 to-fuchsia-500", textColor: "text-pink-400", iconName: "Crown" },
  { slug: "birthday", title: "Birthday", gradient: "from-orange-500 to-red-500", textColor: "text-orange-400", iconName: "PartyPopper" },
  { slug: "quinceanera", title: "Quinceañera", gradient: "from-pink-500 to-purple-500", textColor: "text-pink-400", iconName: "Crown" },
  { slug: "anniversary", title: "Anniversary", gradient: "from-red-500 to-rose-500", textColor: "text-red-400", iconName: "Heart" },
  { slug: "concert", title: "Concert", gradient: "from-violet-500 to-purple-500", textColor: "text-violet-400", iconName: "Music" },
  { slug: "sporting-events", title: "Sports Events", gradient: "from-emerald-500 to-green-500", textColor: "text-emerald-400", iconName: "TrendingUp" },
  { slug: "airport", title: "Airport Transfer", gradient: "from-sky-500 to-blue-500", textColor: "text-sky-400", iconName: "Car" },
  { slug: "wine-tours", title: "Wine Tours", gradient: "from-red-400 to-rose-500", textColor: "text-red-400", iconName: "Sparkles" },
  { slug: "brewery-tours", title: "Brewery Tours", gradient: "from-amber-500 to-orange-500", textColor: "text-amber-400", iconName: "Music" },
  { slug: "nightclub", title: "Nightclub", gradient: "from-purple-600 to-indigo-600", textColor: "text-purple-400", iconName: "Music" },
  { slug: "casino", title: "Casino Trips", gradient: "from-yellow-500 to-amber-500", textColor: "text-yellow-400", iconName: "Sparkles" },
  { slug: "holiday", title: "Holiday Events", gradient: "from-red-500 to-green-500", textColor: "text-red-400", iconName: "PartyPopper" },
  { slug: "funeral", title: "Funeral Services", gradient: "from-gray-600 to-slate-600", textColor: "text-gray-400", iconName: "Car" },
];

export default async function PollResultsPage() {
  const [hotPolls, reviews, analytics] = await Promise.all([
    getHotPolls(),
    getReviews(),
    getPollAnalytics(),
  ]);
  
  const liveStats = analyticsToLiveStats(analytics);

  return (
    <main>
      <Hero slug="polls" />

      <LiveStatsBar 
        stats={liveStats} 
        title="Live Results Activity"
      />

      <section className="py-12 bg-gradient-to-b from-[#0a1628] via-[#0d1d3a] to-[#0a1628]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 mb-6">
              <Flame className="w-5 h-5 text-orange-400 animate-pulse" aria-hidden="true" />
              <span className="text-sm font-bold tracking-wider uppercase text-orange-300">Hot Results</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              See What Everyone's Voting For
            </h1>
            <p className="text-lg text-blue-100/80 leading-relaxed max-w-2xl mx-auto">
              Browse poll results across <span className="text-white font-semibold">51,000+ transportation polls</span> with <span className="text-white font-semibold">2.4 million votes</span>. 
              Find out what riders prefer and embed results on your website.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <PollFilterTabs basePath="/polls/results" />
          </div>
        </div>
      </section>

      <PollResultsExplorer 
        categories={categoryConfigs}
        hotPolls={hotPolls}
      />

      <PremiumDivider />

      <FleetSection />

      <SectionDivider variant="glow" />

      <ReviewsSection reviews={reviews ?? []} />

      <SectionDivider variant="gradient" />

      <section className="py-16 bg-[#0a1628]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Transportation Trivia</h2>
              <TriviaCarousel items={TRIVIA_ITEMS} />
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">How to Book</h2>
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">1</div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Browse Our Fleet</h3>
                      <p className="text-white/70 text-sm">Explore party buses, limousines, and coach buses. Filter by capacity, features, and price.</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shrink-0">2</div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Get Your Quote</h3>
                      <p className="text-white/70 text-sm">Tell us your date, time, and destination. We'll provide instant pricing with no hidden fees.</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-500/10 to-orange-500/10 border border-pink-500/20">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold shrink-0">3</div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Confirm & Celebrate</h3>
                      <p className="text-white/70 text-sm">Secure your booking with a small deposit. On event day, your ride arrives on time, every time.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider variant="dots" />

      <EventsGrid />

      <SectionDivider variant="glow" />

      <FaqSection category="poll-results" title="Poll Results FAQ" />
    </main>
  );
}
