import { cn } from "@/lib/utils";
import { getWhySectionsBySlug } from "@/lib/data/content_section";
import { WhyFeaturesGridClient } from "@/components/sections/content-features.client";
import { Zap } from "lucide-react";

interface WhySectionProps {
  slug: string;
  className?: string;
}

export async function WhySection({ slug, className }: WhySectionProps) {
  const why_section = await getWhySectionsBySlug(slug);

  if (!why_section || !why_section.features) return null;

  return (
    <section className={cn("relative bg-[#0a1628] py-6", className)}>
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="relative rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-white/10 py-8 px-5 md:px-8">
          <div className="absolute -top-3 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
            <Zap className="w-3.5 h-3.5 text-white" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">
              Why Choose
            </span>
          </div>
          
          <h2 className="text-xl md:text-2xl font-bold text-center text-white mt-2 mb-2">
            {why_section.title}
          </h2>
          <p className="text-white/60 text-center text-sm max-w-2xl mx-auto mb-6">
            {why_section.intro}
          </p>

          <WhyFeaturesGridClient
            features={why_section.features}
            className="grid grid-cols-2 lg:grid-cols-3 gap-3"
            defaultCta={{ label: "Get a quote", link: "/contact" }}
          />
        </div>
      </div>
    </section>
  );
}
