import Link from "next/link";

type ComingSoonProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export function ComingSoon({
  eyebrow = "Coming soon",
  title = "This page is coming soon",
  description = "We’re building this page right now. In the meantime, you can browse the main site or request a quote.",
  primaryCta = { label: "Get a quote", href: "/contact" },
  secondaryCta = { label: "Browse locations", href: "/locations" },
}: ComingSoonProps) {
  return (
    <section className="bg-[#0E1F46] px-4 py-14">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <div
          className="relative overflow-hidden rounded-[2.5rem] border
            border-white/10 bg-gradient-to-br from-[#0B1938]/90 via-[#081533]/80
            to-[#060E23]/90 shadow-[0_25px_60px_rgba(3,7,18,0.45)]"
        >
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div
              className="mx-auto h-full max-w-5xl
                bg-[radial-gradient(circle_at_top,_rgba(58,105,255,0.35),_transparent_60%)]"
            />
          </div>

          <div className="relative px-6 py-12 md:px-12 md:py-14 text-center">
            <p
              className="text-xs font-semibold uppercase tracking-[0.45em]
                text-white/55"
            >
              {eyebrow}
            </p>
            <h1
              className="mt-4 text-3xl md:text-5xl font-extrabold text-white
                font-serif tracking-tight"
            >
              {title}
            </h1>
            <p className="mt-4 mx-auto max-w-2xl text-white/75">
              {description}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={primaryCta.href}
                className="inline-flex items-center justify-center rounded-full
                  bg-white text-[#04132d] px-7 py-3 text-sm font-semibold
                  shadow-[0_15px_40px_rgba(10,27,54,0.35)] transition
                  hover:translate-y-0.5 hover:bg-white"
              >
                {primaryCta.label}
              </Link>
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center justify-center rounded-full
                  border border-white/15 bg-white/5 px-7 py-3 text-sm
                  font-semibold text-white/90 transition hover:border-white/35
                  hover:bg-white/10"
              >
                {secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
