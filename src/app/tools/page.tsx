import HeroHeaderServer from "../../components/HeroHeaderServer";
import ToolsClient from "./ToolsClient";
import { getHeroFallback } from "@/data/heroFallbacks";
import { fetchFleetVehicles } from "@/lib/server/fleetData";
import { getFeaturedReviews } from "@/lib/server/reviews";
import { getFaqsForPage } from "@/lib/server/faqs";
import { getHomepageCategoryColumns } from "@/lib/home-polls";

export default async function ToolsPage() {
  const [featuredFleet, featuredReviews, faqs, pollColumns] = await Promise.all([
    fetchFleetVehicles().catch(() => null),
    getFeaturedReviews(9).catch(() => []),
    getFaqsForPage("tools", 120).catch(() => []),
    getHomepageCategoryColumns({ numColumns: 3, perColumn: 45 }).catch(() => []),
  ]);

  return (
    <main className="min-h-screen w-full text-white bg-[#0f1f46]">
      <HeroHeaderServer pageSlug="tools" fallback={getHeroFallback("tools")} />
      <ToolsClient
        featuredFleet={featuredFleet ?? undefined}
        featuredReviews={featuredReviews ?? []}
        faqs={faqs ?? []}
        pollColumns={pollColumns ?? []}
      />
    </main>
  );
}
