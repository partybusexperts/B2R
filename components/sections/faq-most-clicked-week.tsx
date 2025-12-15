import { cn } from "@/lib/utils";
import type { FaqData } from "@/lib/data/faqs";

type Category = {
  category: string;
  title: string;
};

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ");
}

function toExcerpt(html: string | null, maxLen = 180) {
  const text = stripHtml(html ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen).trim()}…`;
}

function labelForSlug(slug: string, categories: readonly Category[]) {
  const match = categories.find((c) => c.category === slug);
  return (match?.title ?? slug ?? "").toString();
}

export function FaqMostClickedWeek({
  faqs,
  categories,
  count = 8,
  className,
}: {
  faqs: FaqData[];
  categories: readonly Category[];
  count?: number;
  className?: string;
}) {
  const top = [...faqs]
    .sort((a, b) => (b.click_count || 0) - (a.click_count || 0))
    .slice(0, count);

  if (top.length === 0) return null;

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container mx-auto px-4 md:px-6">
        <div
          className="rounded-[2rem] border border-border/40 bg-card/40
            backdrop-blur-sm overflow-hidden"
        >
          <div className="relative px-6 py-10 md:px-10 md:py-14">
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br
                from-primary/25 via-background/10 to-background/0"
            />

            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <div
                className="text-xs tracking-[0.35em] uppercase
                  text-muted-foreground"
              >
                Quick answers
              </div>
              <h2
                className="mt-3 text-3xl md:text-5xl font-extrabold
                  tracking-tight text-foreground"
              >
                Most-clicked this week
              </h2>
              <p className="mt-4 text-sm md:text-base text-muted-foreground">
                Eight fast responses people reference right after reading
                policies.
              </p>
            </div>

            <div
              className="relative z-10 mt-10 grid grid-cols-1 md:grid-cols-2
                gap-5"
            >
              {top.map((faq) => {
                const slug = (faq.page_slug ?? "").toString();
                const label = labelForSlug(slug, categories).toUpperCase();

                return (
                  <div
                    key={faq.id}
                    className="rounded-2xl border border-border/40
                      bg-background/25 px-6 py-6"
                  >
                    <div
                      className="text-[11px] tracking-[0.35em] uppercase
                        text-muted-foreground"
                    >
                      {label}
                    </div>
                    <div className="mt-3 text-lg font-bold text-foreground">
                      {faq.question}
                    </div>
                    <div
                      className="mt-3 text-sm text-muted-foreground
                        leading-relaxed"
                    >
                      {toExcerpt(faq.answer ?? null)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
