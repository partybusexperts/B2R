import { ToolCard } from "./tool-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { shuffle } from "@/lib/utils";
import { getTools } from "@/lib/data/tools";
import { ChevronRight } from "lucide-react";

interface ToolsGridProps {
  category?: string; // e.g. "home", "pricing"
}

export async function ToolsGrid({ category = "general" }: ToolsGridProps) {
  // 1. Fetch tools (limit to 20 to allow for randomization pool)
  const allTools = await getTools();

  if (!allTools || allTools.length === 0) return null;

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
    <section className="py-16 md:py-24 bg-background border-b border-border/40">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div
          className="flex flex-col md:flex-row justify-between items-end mb-10
            gap-4"
        >
          <div className="max-w-2xl space-y-2">
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight
                text-foreground"
            >
              Planning Tools & Guides
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to plan the perfect trip, from pricing
              calculators to safety checklists.
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            className="group hidden gap-2 text-base font-bold text-primary
              hover:bg-primary/10 md:inline-flex"
          >
            <Link href={"/tools"}>
              View All Tools{" "}
              <ChevronRight
                className="h-4 w-4 transition-transform
                  group-hover:translate-x-1"
              />
            </Link>
          </Button>
        </div>

        {/* Grid: 1 col mobile, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 text-center md:hidden">
          <Button
            variant="outline"
            asChild
            className="w-full rounded-xl font-bold"
          >
            <Link href="/tools">View All Tools</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
