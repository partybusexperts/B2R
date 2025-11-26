import HeroHeaderServer from "../../components/HeroHeaderServer";
import ToolsClient from "./ToolsClient";
import { getHeroFallback } from "../../data/heroFallbacks";

export default function ToolsPage() {
  return (
    <main className="min-h-screen w-full text-white bg-[#0f1f46]">
      <HeroHeaderServer pageSlug="tools" fallback={getHeroFallback("tools")} />
      <ToolsClient />
    </main>
  );
}
