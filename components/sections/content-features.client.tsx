"use client";

import * as React from "react";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  // DialogDescription,
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
              `group w-full bg-[#12244e] rounded-2xl shadow border
              border-blue-800/30 px-5 py-4 text-left transition
              hover:border-blue-500/60 focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-blue-400`,
            )}
            aria-label={`Open details for ${feature.title}`}
          >
            <div className="flex items-start gap-3">
              <div
                className="shrink-0 w-9 h-9 rounded-full bg-blue-900/20 border
                  border-blue-700/40 flex items-center justify-center text-xl"
              >
                {feature.icon && feature.icon?.length === 2 ? (
                  feature.icon
                ) : (
                  <DynamicIcon
                    name={feature.icon as IconName}
                    className="h-6 w-6"
                  />
                )}
              </div>
              <div className="">
                <div className="font-semibold text-white text-lg mb-0.5">
                  {feature.title}
                </div>
                <div className="text-blue-200 text-sm">
                  {feature.description}
                </div>
                <span
                  className="mt-2 inline-flex items-center gap-1 text-xs
                    font-semibold uppercase tracking-wide text-blue-300"
                >
                  Learn more →
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <DialogContent
        className={cn(
          `w-full max-w-3xl rounded-2xl p-0 shadow-2xl border border-blue-700/60
          bg-[#050b1f] text-slate-100 overflow-hidden`,
        )}
      >
        <DialogHeader
          className="flex items-start justify-between gap-4 px-5 py-4 border-b
            border-blue-900/60 bg-[#050b26]"
        >
          <DialogTitle className="flex-1 min-w-0">
            {active?.modal_title ?? active?.title ?? ""}
          </DialogTitle>
        </DialogHeader>

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
            <div
              className="rounded-2xl border border-dashed border-border
                bg-[#1e40afcc] p-6"
            >
              <p className="text-white font-semibold mb-1">
                {active?.modal_title ??
                  active?.title ??
                  "More details coming soon"}
              </p>
              <p className="text-blue-100">
                {active?.modal_content || (
                  <>
                    This modal is ready — you just need to add{" "}
                    <span className="font-semibold">modal_content</span> (and
                    optional CTA fields) to the content data.
                  </>
                )}
              </p>
            </div>
          </div>

          <DialogFooter className="mt-8 sm:justify-between">
            <Button asChild variant="outline" className="rounded-xl text-black">
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
