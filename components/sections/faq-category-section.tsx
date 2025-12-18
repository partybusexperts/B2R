import { cn } from "@/lib/utils";
import { getFaqs } from "@/lib/data/faqs";
import { FaqClient } from "@/components/sections/faq-client";

interface FaqCategorySectionProps {
  category: string;
  title: string;
  className?: string;
}

export async function FaqCategorySection({
  category,
  title,
  className,
}: FaqCategorySectionProps) {
  const faqs = await getFaqs(category);

  if (!faqs) return null;

  return (
    <section className={cn("py-10 md:py-14", className)}>
      <div className="container mx-auto px-4 md:px-6">
        <div
          className="relative overflow-hidden rounded-[2.5rem] border
            border-white/10 bg-gradient-to-br from-[#0B1938]/90 via-[#081533]/80
            to-[#060E23]/90 shadow-[0_25px_60px_rgba(3,7,18,0.45)]"
        >
          {/* Soft background glow */}
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div
              className="mx-auto h-full max-w-5xl
                bg-[radial-gradient(circle_at_top,_rgba(58,105,255,0.35),_transparent_60%)]"
            />
          </div>

          <div className="relative px-6 py-10 md:px-12 md:py-12">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <p
                  className="text-xs font-semibold uppercase tracking-[0.55em]
                    text-white/45"
                >
                  {category.replace(/-/g, " ")}
                </p>
                <h2
                  className="mt-3 text-4xl md:text-5xl font-extrabold
                    tracking-tight text-white font-serif"
                >
                  {title}
                </h2>
                <p className="mt-2 text-white/65">
                  Tap to expand—four answers at a time.
                </p>
              </div>

              <div
                className="shrink-0 rounded-full border border-white/15
                  bg-white/5 px-5 py-2 text-sm font-semibold text-white/70"
              >
                {faqs.length} entries
              </div>
            </div>

            <div className="mt-8">
              <FaqClient
                faqs={faqs}
                initialCount={4}
                batchSize={4}
                loadMoreLabel="LOAD 4 MORE"
                showLoadMoreIcon={false}
                loadMoreVariant="outline"
                loadMoreClassName="h-auto rounded-full border border-white/15 bg-white/10 px-12 py-3 text-xs font-semibold tracking-[0.35em] uppercase text-white/80 transition hover:bg-white/15 hover:text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
