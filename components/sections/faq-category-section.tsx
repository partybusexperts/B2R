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

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className={cn("py-10 md:py-14", className)}>
      <div className="container mx-auto px-4 md:px-6">
        <div
          className="rounded-[2rem] border border-border/40 bg-card/40
            backdrop-blur-sm overflow-hidden"
        >
          <div className="px-6 py-10 md:px-10 md:py-12">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  className="text-4xl font-extrabold tracking-tight
                    text-foreground"
                >
                  {title}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Tap to expand—four answers at a time.
                </p>
              </div>

              <div
                className="shrink-0 rounded-full border border-border/50
                  bg-background/25 px-4 py-1.5 text-sm text-muted-foreground"
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
                loadMoreClassName="rounded-full px-10 tracking-[0.3em] uppercase"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
