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
import {
  getPollResultsByCategory,
  getPollResultsHeaderData,
} from "@/lib/data/polls";
import FleetSection from "@/components/sections/fleet-section";

export default async function PollResultsPage() {
  const pollResultsHeaderData = await getPollResultsHeaderData();

  const pollResults = await getPollResultsByCategory(
    pollResultsHeaderData?.category_slug || "",
  );

  const reviews = (await getReviews()) ?? [];

  return (
    <main>
      {/* No Hero - Just Title Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h1
              className="text-4xl md:text-5xl font-extrabold tracking-tight
                text-foreground"
            >
              Live Poll Results
            </h1>
            <p className="text-xl text-muted-foreground">
              See what the community is saying about luxury travel trends.
            </p>
          </div>

          {/* Cool Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 flex items-center gap-4">
                <div
                  className="h-12 w-12 rounded-full bg-primary/10 flex
                    items-center justify-center shrink-0"
                >
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Votes Cast
                  </p>
                  <p className="text-3xl font-bold">
                    {pollResultsHeaderData?.total_votes || 3421}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 flex items-center gap-4">
                <div
                  className="h-12 w-12 rounded-full bg-primary/10 flex
                    items-center justify-center shrink-0"
                >
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Trending Topic
                  </p>
                  <p className="text-3xl font-bold">
                    {pollResultsHeaderData?.trending_topic || "Party Buses"}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 flex items-center gap-4">
                <div
                  className="h-12 w-12 rounded-full bg-primary/10 flex
                    items-center justify-center shrink-0"
                >
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Polls
                  </p>
                  <p className="text-3xl font-bold">
                    {pollResultsHeaderData?.total_polls || 245}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pollResults.map((poll) => (
              <Card key={poll.id} className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl leading-tight">
                    {poll.question}
                  </CardTitle>
                  <Badge variant="secondary" className="w-fit mt-2">
                    {poll.total_votes} votes
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                  {poll.options.map((option) => (
                    <div key={option.label} className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span>{option.label}</span>
                        <span>{option.percentage}%</span>
                      </div>
                      <Progress value={option.percentage} className="h-2" />
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
      <PollsGrid category="results" />
      <ReviewsSection reviews={reviews} />
      <ToolsGrid category="results" />
      <EventsGrid />
      <FaqSection category="poll-results" title="Poll FAQs" />
    </main>
  );
}
