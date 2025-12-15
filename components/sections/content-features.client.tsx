"use client";

import * as React from "react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { cn } from "@/lib/utils";
import { WhyFeature } from "@/lib/data/content_section";

interface WhyFeaturesGridClientProps {
  features: WhyFeature[];
  className?: string;
  defaultCta?: {
    label: string;
    link: string;
  };
}

export function WhyFeaturesGridClient({
  features,
  className,
  defaultCta,
}: WhyFeaturesGridClientProps) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<WhyFeature | null>(null);

  const pricingCtaLabel = defaultCta?.label ?? "Get a quote";
  const learnMoreCtaLink = active?.cta_link ?? "/contact";

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setActive(null);
      }}
    >
      <div className={cn("grid gap-6 md:gap-8", className)}>
        {features.map((feature) => (
          <button
            key={`${feature.title}-${feature.id}`}
            type="button"
            onClick={() => {
              setActive(feature);
              setOpen(true);
            }}
            className={cn(
              `text-left focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl`,
            )}
            aria-label={`Open details for ${feature.title}`}
          >
            <Card
              className={cn(
                "h-full border-border/50 bg-card/50 transition-all",
                "hover:-translate-y-1 hover:shadow-lg hover:border-primary/20",
              )}
            >
              <CardHeader className="pb-2">
                <div
                  className="mb-4 inline-flex h-12 w-12 items-center
                    justify-center rounded-lg bg-primary/10 text-primary"
                >
                  <DynamicIcon
                    name={(feature.icon ?? "info") as IconName}
                    className="h-6 w-6"
                  />
                </div>
                <CardTitle className="text-xl font-bold text-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <DialogContent
        className={cn(
          "p-0 overflow-hidden",
          "w-[calc(100vw-2rem)] max-w-5xl",
          "max-h-[85vh]",
        )}
      >
        <div
          className="border-b border-border/60 bg-background/95 backdrop-blur
            supports-[backdrop-filter]:bg-background/80"
        >
          <div className="p-6 md:p-8">
            <DialogHeader className="gap-3 sm:text-left">
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div
                    className="mt-0.5 inline-flex h-12 w-12 shrink-0
                      items-center justify-center rounded-xl bg-primary/10
                      text-primary"
                  >
                    {active?.icon ? (
                      <DynamicIcon
                        name={active.icon as IconName}
                        className="h-6 w-6"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <DialogTitle
                      className="text-2xl md:text-3xl font-extrabold
                        tracking-tight"
                    >
                      {active?.modal_title ?? active?.title ?? ""}
                    </DialogTitle>
                    <DialogDescription className="mt-2 text-base">
                      {active?.modal_description ?? active?.description ?? ""}
                    </DialogDescription>
                  </div>
                </div>
              </div>
            </DialogHeader>
          </div>
        </div>

        <div className="px-6 pb-6 md:px-8 md:pb-8 overflow-y-auto">
          <div
            className={cn(
              "pt-6",
              "text-muted-foreground leading-relaxed",
              "space-y-4",
              "[&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-foreground",
              "[&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-foreground",
              "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
              `[&_a]:text-primary [&_a]:underline-offset-4
              hover:[&_a]:underline`,
            )}
          >
            {active?.modal_content ? (
              <div dangerouslySetInnerHTML={{ __html: active.modal_content }} />
            ) : (
              <div
                className="rounded-2xl border border-dashed border-border
                  bg-muted/20 p-6"
              >
                <p className="text-foreground font-semibold mb-1">
                  More details coming soon
                </p>
                <p>
                  This modal is ready — you just need to add{" "}
                  <span className="font-semibold">modal_content</span> (and
                  optional CTA fields) to the content data.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="mt-8 sm:justify-between">
            <Button asChild variant="outline" className="rounded-xl">
              <Link href={learnMoreCtaLink}>Learn more</Link>
            </Button>
            <Button asChild size="lg" className="rounded-xl">
              <Link href={"/pricing"}>{pricingCtaLabel}</Link>
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
