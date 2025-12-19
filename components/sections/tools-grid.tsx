import { ToolCard } from "./tool-card";
import Link from "next/link";
import { shuffle } from "@/lib/utils";
import { getTools } from "@/lib/data/tools";

interface ToolsGridProps {
  category?: string; // e.g. "home", "pricing"
}

export async function ToolsGrid({ category = "general" }: ToolsGridProps) {
  // 1. Fetch tools (limit to 20 to allow for randomization pool)
  const allTools = await getTools();

  if (!allTools) return null;

  // 2. Logic: "Context First, then Random"
  // Filter for tools that match the current page category
  const contextTools = allTools.filter(
    (t) => t.category?.toLowerCase() === category.toLowerCase(),
  );

  // Filter for the rest
  const otherTools = allTools.filter(
    (t) => t.category?.toLowerCase() !== category.toLowerCase(),
  );

  // Combine: Context tools + Shuffled other tools
  const displayTools = [...contextTools, ...shuffle(otherTools)].slice(0, 4); // Show 4 tools total

  return (
    <section className="py-16 md:py-24 bg-[#0E1F46]">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Tools</h2>

          <Link
            href={"/tools"}
            className="text-sm rounded-xl border border-white/15 bg-white/10
              px-3 py-1.5 hover:bg-white/15 text-white"
          >
            View more tools →
          </Link>
        </div>

        {/* Grid: 1 col mobile, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {/* Mobile View All */}
        {/* <div className="mt-8 text-center md:hidden">
          <Button
            variant="outline"
            asChild
            className="w-full rounded-xl font-bold"
          >
            <Link href="/tools">View All Tools</Link>
          </Button>
        </div> */}

        <div className="mt-6 flex justify-center">
          <Link
            href="/tools"
            className="text-sm rounded-xl border border-white/15 bg-white/10
              px-4 py-2 hover:bg-white/15 text-white"
          >
            View more tools →
          </Link>
        </div>
      </div>
    </section>
  );
}
