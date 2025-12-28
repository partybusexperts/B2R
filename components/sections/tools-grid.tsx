import { ToolCard } from "./tool-card";
import Link from "next/link";
import { shuffle } from "@/lib/utils";
import { getTools } from "@/lib/data/tools";
import { Wrench, Sparkles } from "lucide-react";

interface ToolsGridProps {
  category?: string;
}

export async function ToolsGrid({ category = "general" }: ToolsGridProps) {
  const allTools = await getTools();

  if (!allTools) return null;

  const contextTools = allTools.filter(
    (t) => t.category?.toLowerCase() === category.toLowerCase(),
  );

  const otherTools = allTools.filter(
    (t) => t.category?.toLowerCase() !== category.toLowerCase(),
  );

  const displayTools = [...contextTools, ...shuffle(otherTools)].slice(0, 6);

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-[#0a1628]">
      <div className="absolute inset-0 bg-mesh opacity-40" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none animate-orb-drift" />
      
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="text-center mb-14 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
            <Wrench className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              Planning Resources
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-serif text-glow-white">
            Interactive Tools
          </h2>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
            Plan your perfect event with our smart calculators, pricing guides, and booking helpers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up-delay-1">
          {displayTools.map((tool, idx) => (
            <div 
              key={tool.id} 
              className="group relative"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative glass-panel-hover rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <ToolCard tool={tool} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex justify-center animate-fade-up-delay-2">
          <Link
            href="/tools"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full
              glass-panel-hover text-white font-semibold text-lg transition-all duration-300
              hover:scale-105"
          >
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span>View all tools</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
