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
import { getSecrets } from "@/lib/data/secrets";
import { getLocationsCount } from "@/lib/data/locations";

export const metadata = pageMetadata({
  title: "Industry Secrets",
  description:
    "Contract gotchas, billing norms, and pricing quirks — distilled so you can book and negotiate like an insider.",
  path: "/industry-secrets",
});

export default async function IndustrySecretsPage() {
  const reviews = (await getReviews()) ?? [];

  const secrets = (await getSecrets()) ?? [];

  const cityCount = await getLocationsCount();

  const extractPercents = (input: string) => {
    const matches = input.match(/\b(\d{1,3})\s*%/g) ?? [];
    return matches
      .map((m) => Number.parseInt(m.replace(/[^0-9]/g, ""), 10))
      .filter((n) => Number.isFinite(n));
  };

  const percentMentions = secrets.flatMap((s) =>
    extractPercents(`${s.summary ?? ""} ${s.body_html ?? ""}`),
  );

  const avgSavingsPercent =
    percentMentions.length > 0
      ? Math.round(
          percentMentions.reduce((sum, n) => sum + n, 0) /
            percentMentions.length,
        )
      : null;

  const dispatchMentionsCount = secrets.filter((s) =>
    /(dispatch|dispatcher|driver|operator)/i.test(
      `${s.title ?? ""} ${s.summary ?? ""} ${s.body_html ?? ""}`,
    ),
  ).length;

  const cardsForHeader = [
    {
      info: String(secrets.length),
      label: "PLAYBOOK SECRETS",
    },
    {
      info: avgSavingsPercent === null ? "—" : `${avgSavingsPercent}%`,
      label: "AVERAGE SAVINGS",
    },
    {
      info: String(cityCount),
      label: "Cities Validated",
    },
    {
      info: String(dispatchMentionsCount),
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

      <IndustrySecretsSection secrets={secrets} />

      <FleetSection />
      <PollsGrid
        columnCategories={[
          "pricing",
          "booking-experience",
          "best-driver-moments",
        ]}
        hideCities
      />
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
