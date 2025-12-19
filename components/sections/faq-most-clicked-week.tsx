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

          <div className="relative px-6 py-10 md:px-12 md:py-14">
            <div className="text-center max-w-3xl mx-auto">
              <div
                className="text-xs tracking-[0.55em] uppercase text-white/45
                  font-semibold"
              >
                Quick answers
              </div>
              <h2
                className="mt-3 text-3xl md:text-5xl font-extrabold
                  tracking-tight text-white font-serif"
              >
                Most-clicked this week
              </h2>
              <p className="mt-4 text-sm md:text-base text-white/65">
                Eight fast responses people reference right after reading
                policies.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
              {top.map((faq) => {
                const slug = (faq.page_slug ?? "").toString();
                const label = labelForSlug(slug, categories).toUpperCase();

                return (
                  <div
                    key={faq.id}
                    className="rounded-2xl border border-white/10 bg-white/5
                      px-6 py-6 backdrop-blur-sm"
                  >
                    <div
                      className="text-[11px] tracking-[0.55em] uppercase
                        text-white/45 font-semibold"
                    >
                      {label}
                    </div>
                    <div className="mt-3 text-lg font-bold text-white">
                      {faq.question}
                    </div>
                    <div className="mt-3 text-sm text-white/70 leading-relaxed">
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
