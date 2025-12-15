"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { ToolData } from "@/types/tools.types";

export function ToolCard({ tool }: { tool: ToolData }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* THE CARD: "Circle to the left" Layout */}
        <Card
          className="group relative cursor-pointer overflow-hidden
            border-border/50 bg-card p-5 transition-all duration-300
            hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
        >
          <div className="flex items-start gap-4">
            {/* 1. Circle Icon Container */}
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center
                rounded-full bg-primary/10 text-primary transition-colors
                group-hover:bg-primary group-hover:text-primary-foreground"
            >
              <DynamicIcon
                name={(tool.icon_name ?? "info") as IconName}
                className="h-6 w-6"
              />
            </div>

            {/* 2. Content */}
            <div className="space-y-1.5">
              <h3
                className="font-bold leading-tight text-foreground
                  group-hover:text-primary transition-colors"
              >
                {tool.title}
              </h3>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {tool.description}
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
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center
              rounded-full bg-primary/10 text-primary"
          >
            <DynamicIcon
              name={(tool.icon_name ?? "info") as IconName}
              className="h-7 w-7"
            />
          </div>
          <DialogTitle className="text-2xl font-bold">{tool.title}</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            {tool.description}
          </DialogDescription>
        </DialogHeader>

        {/* Modal Body */}
        <div
          className="my-2 max-h-[60vh] overflow-y-auto rounded-xl bg-muted p-5
            text-sm leading-relaxed text-foreground"
        >
          {/* Render the content from DB */}
          <div dangerouslySetInnerHTML={{ __html: tool.modal_content || "" }} />
        </div>

        {/* Modal Footer / CTA */}
        <div className="flex justify-end gap-3 pt-2">
          {/* {tool.cta_link && (
            <Button asChild className="gap-2 font-bold rounded-xl" size="lg">
              <Link href={tool.cta_link}>
                {tool.cta_text || "Open Tool"}{" "}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )} */}

          <Button asChild className="gap-2 font-bold rounded-xl" size="lg">
            <Link href={`/tools/${tool.slug}`}>
              {tool.cta_text || "Open Tool"} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
