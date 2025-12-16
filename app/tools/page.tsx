import Hero from "@/components/layout/hero";
import { ToolCard } from "@/components/sections/tool-card";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { FaqSection } from "@/components/sections/faq-section";
import { getTools } from "@/lib/data/tools";
import { getReviews } from "@/lib/data/reviews";
import FleetSection from "@/components/sections/fleet-section";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { HeaderSection } from "@/components/sections/header-section";

export default async function ToolsPage() {
  const tools = await getTools(100);
  const reviews = (await getReviews()) ?? [];

  const cardsForHeader = [
    {
      info: "25+",
      label: "Tools Available",
    },
    {
      info: "15",
      label: "Categories Covered",
    },
    {
      info: "10k+",
      label: "Users Helped",
    },
    {
      info: "99%",
      label: "User Satisfaction",
    },
  ] as const;

  return (
    <main>
      <Hero slug="tools" />

      {/* Tools Overview */}
      <HeaderSection
        badgeText="Event Planning Tools"
        title="Your Ultimate Event Planning Toolkit."
        description="Explore a curated collection of tools designed to simplify planning, optimize costs, and ensure your event's success. From calculators to checklists, everything you need is just a click away."
        cards={cardsForHeader}
      />

      {/* Tools List */}
      <section className="py-16 md:py-24 bg-[#0E1F46]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight
                text-white"
            >
              All Planning Tools
            </h2>
            <p className="text-lg text-white/70">
              Calculators, checklists, and guides to make your event a success.
            </p>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
              xl:grid-cols-4 gap-6"
          >
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      <FleetSection />
      <ReviewsSection reviews={reviews} />
      <PollsGrid category="tools" />
      <ToolsGrid category="tools" />
      <FaqSection category="tools" title="Tools FAQs" />
      <EventsGrid />
    </main>
  );
}
