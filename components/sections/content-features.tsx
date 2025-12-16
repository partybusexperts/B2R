import { cn } from "@/lib/utils";
import { getWhySectionsBySlug } from "@/lib/data/content_section";
import { WhyFeaturesGridClient } from "@/components/sections/content-features.client";

interface WhySectionProps {
  slug: string;
  className?: string;
}

export async function WhySection({ slug, className }: WhySectionProps) {
  const why_section = await getWhySectionsBySlug(slug);

  if (!why_section || !why_section.features) return null;

  return (
    <section className={cn("bg-[#0E1F46]", className)}>
      <div
        className="max-w-6xl mx-auto bg-gradient-to-br from-[#122a5c]
          to-[#0f2148] rounded-3xl shadow-xl my-6 py-12 px-6 border
          border-blue-800/30"
      >
        {/* Section Header */}
        <h2
          className="text-4xl md:text-5xl font-extrabold text-center mb-2
            text-white font-serif tracking-tight"
        >
          {why_section.title}
        </h2>
        <p className="text-blue-100/90 text-center max-w-3xl mx-auto mb-8">
          {why_section.intro}
        </p>

        {/* The Features Grid */}
        <WhyFeaturesGridClient
          features={why_section.features}
          className={cn("grid sm:grid-cols-2 lg:grid-cols-3 gap-4")}
          defaultCta={{ label: "Get a quote", link: "/contact" }}
        />
      </div>
    </section>
  );
}
