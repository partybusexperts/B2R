"use client";

import Link from "next/link";
import { ArrowRight, Wrench, Sparkles, Clock } from "lucide-react";
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
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { ToolData } from "@/lib/data/tools";

function SafeIcon({ name, className }: { name: string; className?: string }) {
  const iconKey = name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  const IconComponent = icons[iconKey];
  if (IconComponent) {
    return <IconComponent className={className} />;
  }
  return <Wrench className={className} />;
}

export function ToolCard({ tool }: { tool: ToolData }) {
  const isComingSoon = tool.status === "coming_soon";
  const learnMoreCtaLink = tool?.cta_link ?? "/contact";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          className="group relative rounded-2xl cursor-pointer border border-white/10
            bg-white/5 p-5 lg:p-6 text-left hover:bg-white/10 transition
            focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center transition-colors rounded-2xl text-2xl text-white",
                isComingSoon ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20" : "bg-white/10"
              )}
            >
              {tool.icon_name && tool.icon_name?.length === 2 ? (
                tool.icon_name
              ) : (
                <SafeIcon
                  name={tool.icon_name || "wrench"}
                  className="h-6 w-6"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold truncate text-white">
                {tool.title}
              </h3>
              <p className="text-xs text-white/60 line-clamp-1">
                {tool.description || "Tap to learn more"}
              </p>
            </div>

            {isComingSoon && (
              <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wide">Soon</span>
              </div>
            )}

            <div
              className="absolute right-4 bottom-4 opacity-0 transition-opacity
                group-hover:opacity-100"
            >
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
          </div>
        </Card>
      </DialogTrigger>

      <DialogContent
        className="w-full max-w-3xl rounded-2xl p-0 shadow-2xl border
          border-blue-700/60 bg-[#050b1f] text-slate-100 overflow-hidden"
      >
        <DialogHeader>
          <div
            className="flex items-start justify-between gap-4 px-5 py-4 border-b
              border-blue-900/60 bg-[#050b26]"
          >
            <DialogTitle className="flex items-center gap-3 flex-1 min-w-0">
              <div className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                isComingSoon ? "bg-gradient-to-br from-purple-500/30 to-pink-500/30" : "bg-white/10"
              )}>
                <SafeIcon name={tool.icon_name || "wrench"} className="h-5 w-5" />
              </div>
              <span>{tool.title}</span>
            </DialogTitle>
            {isComingSoon && (
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wide flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Coming Soon
                </span>
              </div>
            )}
          </div>
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
              `[&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline`,
            )}
          >
            <div className="rounded-2xl border border-dashed border-white/20 bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-6">
              <p className="text-white font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                {isComingSoon ? "What This Tool Will Do" : tool.title}
              </p>
              <p className="text-blue-100 leading-relaxed">
                {tool.modal_content || tool.description || "More details coming soon"}
              </p>
            </div>

            {isComingSoon && (
              <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-purple-300" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Coming Soon!</h3>
                <p className="text-purple-200/80 max-w-md mx-auto">
                  {tool.coming_soon_copy || "We're putting the finishing touches on this tool. Get ready for an amazing planning experience!"}
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="mt-8 sm:justify-between">
            <Button asChild variant="outline" className="rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
              <Link href={learnMoreCtaLink}>{tool.cta_text || "Learn more"}</Link>
            </Button>
            <Button asChild size="lg" className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <Link href="/contact">Get Notified</Link>
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
