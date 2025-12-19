import Hero from "@/components/layout/hero";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { PollsGrid } from "@/components/sections/polls-grid";
import { ToolsGrid } from "@/components/sections/tools-grid";
import { EventsGrid } from "@/components/sections/events-grid";
import { getReviews } from "@/lib/data/reviews";
import FleetSection from "@/components/sections/fleet-section";
import { IndustrySecretsSection } from "@/components/sections/industry-secrets-section";
import { FaqSection } from "@/components/sections/faq-section";
import { HeaderSection } from "@/components/sections/header-section";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Industry Secrets",
  description:
    "Contract gotchas, billing norms, and pricing quirks — distilled so you can book and negotiate like an insider.",
  path: "/industry-secrets",
});

export default async function IndustrySecretsPage() {
  const reviews = (await getReviews()) ?? [];
  // TODO: Industry secrets are all mocked and static. The connection/seeding to supabase is not done yey

  const cardsForHeader = [
    {
      info: "32",
      label: "PLAYBOOK SECRETS",
    },
    {
      info: "18%",
      label: "AVERAGE SAVINGS",
    },
    {
      info: "38",
      label: "Cities Validated",
    },
    {
      info: "220",
      label: "DISPATCH INTERVIEWS",
    },
  ] as const;

  return (
    <main>
      <Hero slug="industry-secrets" />

      <HeaderSection
        badgeText="Intel Briefing"
        title='The receipts behind every "industry secret."'
        description="Contract gotchas, billing norms, and pricing quirks—distilled so you can negotiate like an insider."
        cards={cardsForHeader}
      />

      <IndustrySecretsSection />

      <FleetSection />
      <PollsGrid category="secrets" />
      <ReviewsSection reviews={reviews} />
      <EventsGrid />
      <ToolsGrid category="secrets" />
      <FaqSection category="secrets" title="Industry FAQs" />

      {/* <FaqSearchSection
        category="secrets"
        title="Industry Secrets Mailbag"
        description="Search answers about pricing, booking, and policies."
        initialCount={8}
        searchMode="hybrid"
      /> */}
    </main>
  );
}
