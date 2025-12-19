import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { getReviews } from "@/lib/data/reviews";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users } from "lucide-react";
import { getPollResults, getPollResultsHeaderData } from "@/lib/data/polls";
import FleetSection from "@/components/sections/fleet-section";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Poll Results",
  description:
    "Live results from community polls — see trends and vote totals across the most-discussed booking topics.",
  path: "/polls/results",
});

export default async function PollResultsPage() {
  const pollResultsHeaderData = await getPollResultsHeaderData();

  const pollResults = await getPollResults(1000);

  const reviews = (await getReviews()) ?? [];

  return (
    <main>
      {/* No Hero - Just Title Section */}
      <section className="py-16 md:py-24 bg-[#0C163A]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em]
                text-white/70"
            >
              Rider intelligence
            </p>
            <h1
              className="mt-4 text-4xl font-semibold tracking-tight text-white
                sm:text-5xl"
            >
              Live Poll Results
            </h1>
            <p className="mt-3 text-base text-white/75 sm:text-lg">
              See what the community is saying about luxury travel trends.
            </p>
          </div>

          {/* Cool Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card
              className="rounded-3xl shadow-[0_35px_120px_rgba(5,10,35,0.65)]
                border border-white/10 bg-gradient-to-r from-slate-900/80
                to-slate-950/90 text-white"
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div
                  className="h-12 w-12 rounded-full bg-primary/10 flex
                    items-center justify-center shrink-0"
                >
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/70">
                    Total Votes Cast
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {pollResultsHeaderData?.total_votes || 3421}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card
              className="rounded-3xl shadow-[0_35px_120px_rgba(5,10,35,0.65)]
                border border-white/10 bg-gradient-to-r from-slate-900/80
                to-slate-950/90 text-white"
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div
                  className="h-12 w-12 rounded-full bg-primary/10 flex
                    items-center justify-center shrink-0"
                >
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/70">
                    Trending Topic
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {pollResultsHeaderData?.trending_topic || "Party Buses"}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card
              className="rounded-3xl shadow-[0_35px_120px_rgba(5,10,35,0.65)]
                border border-white/10 bg-gradient-to-r from-slate-900/80
                to-slate-950/90 text-white"
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div
                  className="h-12 w-12 rounded-full bg-primary/10 flex
                    items-center justify-center shrink-0"
                >
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/70">
                    Active Polls
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {pollResultsHeaderData?.total_polls || 245}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pollResults.map((poll) => (
              <Card
                key={poll.id}
                className="rounded-3xl shadow-[0_35px_120px_rgba(5,10,35,0.65)]
                  border border-white/10 bg-gradient-to-r from-slate-900/80
                  to-slate-950/90 text-white"
              >
                <CardHeader>
                  <CardTitle className="text-xl leading-tight text-white">
                    {poll.question}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="w-fit mt-2 border-white/15 bg-white/5
                      text-white/75"
                  >
                    {poll.total_votes} votes
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                  {poll.options.map((option) => (
                    <div key={option.label} className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-white/85">{option.label}</span>
                        <span className="text-white/70">
                          {option.percentage}%
                        </span>
                      </div>
                      <Progress
                        value={option.percentage}
                        className="h-2 bg-white/10"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TODO: Do a poll results section by category */}

      <FleetSection />
      <PollsGrid
        columnCategories={["pricing", "events", "booking-experience"]}
        hideCities
      />
      <ReviewsSection reviews={reviews} />
      <ToolsGrid category="results" />
      <EventsGrid />
      <FaqSection category="poll-results" title="Poll FAQs" />
    </main>
  );
}
