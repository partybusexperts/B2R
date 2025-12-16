"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { ToolData } from "@/types/tools.types";
import { cn } from "@/lib/utils";

export function ToolCard({ tool }: { tool: ToolData }) {
  const pricingCtaLabel = "Get a quote";
  const learnMoreCtaLink = tool?.cta_link ?? "/contact";

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* THE CARD: "Circle to the left" Layout */}
        <Card
          className="group rounded-2xl cursor-pointer border border-white/10
            bg-white/5 p-5 lg:p-6 text-left hover:bg-white/10 transition
            focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <div className="flex items-center gap-4">
            {/* 1. Circle Icon Container */}
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center
                transition-colors rounded-2xl bg-white/10 text-2xl text-white"
            >
              {tool.icon_name && tool.icon_name?.length === 2 ? (
                tool.icon_name
              ) : (
                <DynamicIcon
                  name={tool.icon_name as IconName}
                  className="h-6 w-6"
                />
              )}
            </div>

            {/* 2. Content */}
            <div className="min-w-0">
              <h3 className="text-lg font-semibold truncate text-white">
                {tool.title}
              </h3>
              <p className="text-xs text-white/60 truncate">
                Tap to learn more
              </p>
            </div>

            {/* 3. Hover Hint Arrow */}
            <div
              className="absolute right-4 top-4 opacity-0 transition-opacity
                group-hover:opacity-100"
            >
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
          </div>
        </Card>
      </DialogTrigger>

      {/* THE MODAL */}
      <DialogContent
        className="w-full max-w-3xl rounded-2xl p-0 shadow-2xl border
          border-blue-700/60 bg-[#050b1f] text-slate-100 overflow-hidden"
      >
        <DialogHeader>
          <div
            className="flex items-start justify-between gap-4 px-5 py-4 border-b
              border-blue-900/60 bg-[#050b26]"
          >
            <DialogTitle className="flex-1 min-w-0">{tool.title}</DialogTitle>
          </div>
        </DialogHeader>

        {/* Modal Body */}
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
                {tool.title ?? "More details coming soon"}
              </p>
              <p className="text-blue-100">
                {tool.modal_content ?? tool.description ?? (
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
