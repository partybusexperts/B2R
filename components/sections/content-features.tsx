import { cn } from "@/lib/utils";
import { getWhySectionsBySlug } from "@/lib/data/content_section";
import { WhyFeaturesGridClient } from "@/components/sections/content-features.client";

interface WhySectionProps {
  slug: string;
  className?: string;
  cols?: 2 | 3 | 4; // Flexible layout options
}

export async function WhySection({
  slug,
  className,
  cols = 3,
}: WhySectionProps) {
  const why_section = await getWhySectionsBySlug(slug);

  if (!why_section || !why_section.features) return null;

  return (
    <section
      className={cn(
        "py-16 md:py-24 bg-card border-b border-border/40",
        className,
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2
            className="text-3xl md:text-4xl font-extrabold tracking-tight
              text-foreground"
          >
            {why_section.title}
          </h2>
          {why_section.intro && (
            <div
              className="text-lg text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: why_section.intro }}
            />
          )}
        </div>

        {/* The Features Grid */}
        <WhyFeaturesGridClient
          features={why_section.features}
          className={cn(
            // Tailwind class logic for dynamic columns
            cols === 3 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2",
          )}
          defaultCta={{ label: "Get a quote", link: "/contact" }}
        />
      </div>
    </section>
  );
}
