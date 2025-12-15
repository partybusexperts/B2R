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
          className="group h-full cursor-pointer border-border/60 bg-card/50 p-6
            shadow-sm transition-all hover:-translate-y-1
            hover:border-primary/50 hover:shadow-md"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <Badge
                variant="outline"
                className="w-fit text-xs font-bold text-primary
                  border-primary/20 bg-primary/5"
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
                className="text-xl font-extrabold leading-tight text-foreground
                  group-hover:text-primary transition-colors"
              >
                {secret.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {secret.summary}
              </p>
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

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center
              rounded-full bg-primary/10 text-primary"
          >
            <Icon className="h-7 w-7" />
          </div>
          <DialogTitle className="text-2xl font-bold">
            {secret.title}
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            {CATEGORY_LABELS[secret.category]}
          </DialogDescription>
        </DialogHeader>

        <div
          className="my-2 max-h-[60vh] overflow-y-auto rounded-xl bg-muted p-5
            text-sm leading-relaxed text-foreground"
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
    <Card className="border-border/60 bg-primary/5 p-8 shadow-sm">
      <h3 className="text-2xl font-extrabold tracking-tight mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
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
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto mb-8 max-w-4xl text-center space-y-4">
          <h2
            className="text-3xl md:text-4xl font-extrabold tracking-tight
              text-foreground"
          >
            Insider Knowledge
          </h2>
          <p className="text-lg text-muted-foreground">
            Search secrets, filter by category, then open any card for the full
            playbook.
          </p>
        </div>

        <div className="mx-auto max-w-5xl md:max-w-7xl">
          <div
            className="rounded-2xl border border-border bg-card p-4 shadow-sm
              max-w-5xl mx-auto"
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
                  className="h-10"
                />
              </div>

              <div
                className="flex items-center justify-center md:justify-end
                  gap-2"
              >
                <Button
                  variant="outline"
                  className="rounded-xl"
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
                        ? `border-primary bg-primary text-primary-foreground
                          shadow-sm`
                        : `border-border bg-background text-muted-foreground
                          hover:border-primary/50 hover:bg-accent`,
                    )}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 text-sm text-muted-foreground text-center">
              Showing <span className="font-semibold">{filtered.length}</span>{" "}
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
