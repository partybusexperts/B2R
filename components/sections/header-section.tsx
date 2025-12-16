import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  className?: string;
}

export function HeaderSection({
  badgeText,
  title,
  description,
  cards,
  categories,
  primaryCta,
  secondaryCta,
  className,
}: HeaderSectionProps) {
  return (
    <section className={cn("py-14 md:py-20 bg-[#0E1F46]", className)}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        <div
          className="relative overflow-hidden rounded-[56px] border
            border-white/10 bg-gradient-to-b from-[#0B1938] to-[#060E23]
            shadow-[0_60px_160px_rgba(2,6,23,0.65)]"
        >
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute inset-0 bg-gradient-to-br from-white/10
                via-transparent to-transparent"
            />
          </div>
          <div className="relative px-6 py-12 md:px-14 md:py-16">
            <div className="max-w-4xl">
              <div className="text-xs tracking-[0.45em] uppercase text-white/60">
                {badgeText}
              </div>

              <h1
                className="mt-4 text-5xl font-extrabold tracking-tight
                  text-white font-serif md:text-6xl lg:text-7xl"
              >
                {title}
              </h1>

              <p
                className="mt-6 max-w-3xl text-base leading-relaxed
                  text-white/75 md:text-lg"
              >
                {description}
              </p>

              {(primaryCta || secondaryCta) && (
                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
                  {primaryCta && (
                    <Button
                      asChild
                      size="lg"
                      className="h-12 rounded-full bg-white px-7 text-sm
                        font-bold text-[#0B1938] hover:bg-white/95"
                    >
                      <Link href={primaryCta.href}>{primaryCta.label}</Link>
                    </Button>
                  )}
                  {secondaryCta && (
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="h-12 rounded-full border-white/20 bg-white/5
                        px-7 text-sm font-bold text-white hover:bg-white/10"
                    >
                      <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Stats row */}
            <div
              className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2
                lg:grid-cols-4"
            >
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="rounded-[28px] border border-white/15 bg-white/5
                    px-7 py-8 text-center shadow-[0_25px_60px_rgba(3,7,18,0.4)]"
                >
                  <div
                    className="text-4xl font-extrabold text-white md:text-5xl"
                  >
                    {card.info}
                  </div>
                  <div
                    className="mt-3 text-[11px] tracking-[0.45em] uppercase
                      text-white/60"
                  >
                    {card.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Chips */}
            {categories && categories.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-3">
                {categories.map((c) => (
                  <Link
                    key={c.category}
                    href={`#faq-${c.category}`}
                    className="inline-flex items-center rounded-full border
                      border-white/15 bg-white/5 px-5 py-2 text-[11px]
                      font-semibold uppercase tracking-[0.35em] text-white/60
                      hover:bg-white/10 hover:text-white/80 transition-colors"
                  >
                    {c.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
