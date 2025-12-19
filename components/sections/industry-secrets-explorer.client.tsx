"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  BadgeDollarSign,
  CalendarClock,
  ClipboardCheck,
  FileCheck,
  Gavel,
  MapPinned,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type IndustrySecretCategory =
  | "pricing"
  | "billing"
  | "booking"
  | "seasonal"
  | "fees"
  | "routing"
  | "policy"
  | "quality"
  | "safety";

export type IndustrySecret = {
  id: string;
  category: IndustrySecretCategory;
  title: string;
  summary: string;
  bodyHtml: string;
};

const CATEGORY_LABELS: Record<IndustrySecretCategory, string> = {
  pricing: "Pricing",
  billing: "Billing",
  booking: "Booking",
  seasonal: "Seasonal",
  fees: "Fees",
  routing: "Routing",
  policy: "Policy",
  quality: "Quality",
  safety: "Safety",
};

const CATEGORY_ICONS: Record<
  IndustrySecretCategory,
  React.ComponentType<{ className?: string }>
> = {
  pricing: BadgeDollarSign,
  billing: FileCheck,
  booking: ClipboardCheck,
  seasonal: CalendarClock,
  fees: AlertTriangle,
  routing: MapPinned,
  policy: Gavel,
  quality: Timer,
  safety: ShieldCheck,
};

function SecretCard({ secret }: { secret: IndustrySecret }) {
  const Icon = CATEGORY_ICONS[secret.category];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          className="group h-full cursor-pointer rounded-3xl
            shadow-[0_35px_120px_rgba(5,10,35,0.65)] border border-white/10
            bg-gradient-to-r from-slate-900/80 to-slate-950/90 p-6
            transition-all hover:-translate-y-1 hover:border-white/20"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <Badge
                variant="outline"
                className="w-fit text-xs font-bold border-white/15 bg-white/5
                  text-white/70"
              >
                {CATEGORY_LABELS[secret.category].toUpperCase()}
              </Badge>
              <div
                className="flex h-10 w-10 items-center justify-center
                  rounded-full bg-primary/10 text-primary"
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="space-y-2">
              <h3
                className="text-xl font-extrabold leading-tight text-white
                  group-hover:text-primary transition-colors"
              >
                {secret.title}
              </h3>
              <p className="text-white/70 leading-relaxed">{secret.summary}</p>
            </div>

            <Button
              variant="link"
              className="p-0 h-auto text-primary font-bold"
            >
              Learn more →
            </Button>
          </div>
        </Card>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-xl border-white/10 bg-[#060E23] text-white"
      >
        <DialogHeader>
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center
              rounded-full bg-primary/10 text-primary"
          >
            <Icon className="h-7 w-7" />
          </div>
          <DialogTitle className="text-2xl font-bold text-white">
            {secret.title}
          </DialogTitle>
          <DialogDescription className="text-base text-white/60">
            {CATEGORY_LABELS[secret.category]}
          </DialogDescription>
        </DialogHeader>

        <div
          className="my-2 max-h-[60vh] overflow-y-auto rounded-xl bg-white/5 p-5
            text-sm leading-relaxed text-white/80"
        >
          <div dangerouslySetInnerHTML={{ __html: secret.bodyHtml }} />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button asChild className="rounded-xl font-bold" size="lg">
            <Link href="/contact">Get a quote</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CtaBreak({
  title,
  description,
  href,
  cta,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <Card
      className="group rounded-3xl shadow-[0_35px_120px_rgba(5,10,35,0.65)]
        border border-primary/25 bg-gradient-to-br from-primary/20
        via-[#0C163A]/60 to-transparent p-8 text-white transition
        hover:border-primary/40"
    >
      <h3 className="text-2xl font-extrabold tracking-tight mb-2 text-white">
        {title}
      </h3>
      <p className="text-white/70 mb-6">{description}</p>
      <Button asChild className="rounded-xl font-bold" size="lg">
        <Link href={href}>{cta}</Link>
      </Button>
    </Card>
  );
}

export function IndustrySecretsExplorer({
  secrets,
  defaultSelected,
}: {
  secrets: IndustrySecret[];
  defaultSelected?: IndustrySecretCategory[];
}) {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<IndustrySecretCategory[]>(
    defaultSelected ?? [],
  );

  const categories = React.useMemo(() => {
    const set = new Set<IndustrySecretCategory>();
    secrets.forEach((s) => set.add(s.category));
    return Array.from(set);
  }, [secrets]);

  const toggleCategory = (cat: IndustrySecretCategory) => {
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = React.useMemo(() => {
    return secrets.filter((s) => {
      const matchesCategory =
        selected.length === 0 || selected.includes(s.category);

      const hay = `${s.title} ${s.summary}`.toLowerCase();
      const matchesQuery = !normalizedQuery || hay.includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [secrets, selected, normalizedQuery]);

  const withBreaks = React.useMemo(() => {
    const out: Array<
      { kind: "secret"; secret: IndustrySecret } | { kind: "cta"; id: string }
    > = [];
    filtered.forEach((s, idx) => {
      out.push({ kind: "secret", secret: s });
      if (idx === 5) out.push({ kind: "cta", id: "quote-checklist" });
      if (idx === 11) out.push({ kind: "cta", id: "off-peak" });
    });
    return out;
  }, [filtered]);

  return (
    <section className="py-16 md:py-24 bg-[#0C163A]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto mb-8 max-w-4xl text-center space-y-4">
          <h2
            className="text-3xl md:text-4xl font-extrabold tracking-tight
              text-white"
          >
            Insider Knowledge
          </h2>
          <p className="text-lg text-white/75">
            Search secrets, filter by category, then open any card for the full
            playbook.
          </p>
        </div>

        <div className="mx-auto max-w-5xl md:max-w-7xl">
          <div
            className="rounded-3xl border border-white/10 bg-white/5 p-4
              shadow-[0_35px_120px_rgba(5,10,35,0.65)] max-w-5xl mx-auto"
          >
            <div
              className="flex flex-col gap-3 md:flex-row md:items-center
                md:justify-between"
            >
              <div className="relative w-full">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search secrets (e.g. pricing, prom, cleaning fees)…"
                  className="h-10 border-white/15 bg-white/5 text-white
                    placeholder:text-white/60 focus-visible:border-white/40
                    focus-visible:ring-white/15"
                />
              </div>

              <div
                className="flex items-center justify-center md:justify-end
                  gap-2"
              >
                <Button
                  variant="outline"
                  className="rounded-xl border-white/15 bg-white/5 text-white/80
                    hover:bg-white/10 hover:text-white"
                  onClick={() => {
                    setQuery("");
                    setSelected([]);
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>

            <div
              className="mt-4 flex flex-wrap items-center justify-center gap-2"
            >
              {categories.map((cat) => {
                const active = selected.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={cn(
                      `inline-flex items-center gap-2 rounded-full border px-3
                      py-1.5 text-sm font-semibold transition-all`,
                      active
                        ? "border-white/40 bg-white/15 text-white shadow-sm"
                        : `border-white/15 bg-white/5 text-white/75
                          hover:border-white/40 hover:bg-white/10`,
                    )}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 text-sm text-white/65 text-center">
              Showing{" "}
              <span className="font-semibold text-white">
                {filtered.length}
              </span>{" "}
              result
              {filtered.length === 1 ? "" : "s"}.
            </div>
          </div>

          <div
            className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
              gap-8"
          >
            {withBreaks.map((item, idx) => {
              if (item.kind === "cta") {
                if (item.id === "quote-checklist") {
                  return (
                    <CtaBreak
                      key={`${item.id}-${idx}`}
                      title="Get an all-in quote checklist"
                      description="Make sure your quote includes hourly base, taxes, fuel, tolls, cleaning, and gratuity—so you can compare apples to apples."
                      href="/pricing"
                      cta="See Pricing"
                    />
                  );
                }

                return (
                  <CtaBreak
                    key={`${item.id}-${idx}`}
                    title="Prom + peak Saturdays = plan early"
                    description="Weekdays and daytime slots usually unlock better availability and lower minimums. Flexibility is your secret weapon."
                    href="/contact"
                    cta="Ask about off-peak"
                  />
                );
              }

              return <SecretCard key={item.secret.id} secret={item.secret} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
