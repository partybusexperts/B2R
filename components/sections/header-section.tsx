import Link from "next/link";
import { cn } from "@/lib/utils";

type InfoCard = {
  info: string;
  label: string;
};

type Category = {
  category: string;
  title: string;
};

interface HeaderSectionProps {
  badgeText: string;
  title: string;
  description: string;
  cards: readonly [InfoCard, InfoCard, InfoCard, InfoCard];
  categories?: readonly Category[];
  className?: string;
}

export function HeaderSection({
  badgeText,
  title,
  description,
  cards,
  categories,
  className,
}: HeaderSectionProps) {
  return (
    <section
      className={cn(
        "py-12 md:py-16 bg-background border-b border-border/40",
        className,
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div
          className="rounded-[2rem] border border-border/40 bg-card/40
            backdrop-blur-sm overflow-hidden"
        >
          <div className="relative px-6 py-10 md:px-10 md:py-14">
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br
                from-primary/20 via-background/10 to-background/0"
            />

            <div className="relative z-10 max-w-4xl">
              <div
                className="text-xs tracking-[0.35em] uppercase
                  text-muted-foreground"
              >
                {badgeText}
              </div>

              <h1
                className="mt-3 text-4xl md:text-6xl font-extrabold
                  tracking-tight text-foreground"
              >
                {title}
              </h1>

              <p
                className="mt-4 text-base md:text-lg text-muted-foreground
                  max-w-3xl"
              >
                {description}
              </p>
            </div>

            <div
              className="relative z-10 mt-10 grid grid-cols-2 lg:grid-cols-4
                gap-4"
            >
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-border/40
                    bg-background/30 px-6 py-5"
                >
                  <div
                    className="text-3xl md:text-4xl font-extrabold
                      text-foreground"
                  >
                    {card.info}
                  </div>
                  <div
                    className="mt-1 text-[11px] tracking-[0.35em] uppercase
                      text-muted-foreground"
                  >
                    {card.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="relative z-10 mt-10 flex flex-wrap gap-3">
              {categories?.map((c) => (
                <Link
                  key={c.category}
                  // Only for faqs right now
                  href={`#faq-${c.category}`}
                  className="inline-flex items-center rounded-full border
                    border-border/50 bg-background/25 px-4 py-2 text-xs
                    font-semibold tracking-wider text-muted-foreground
                    hover:text-foreground hover:border-primary/40
                    transition-colors"
                >
                  {c.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
