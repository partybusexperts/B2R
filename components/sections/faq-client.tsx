"use client";

import * as React from "react";
import { ChevronDown, Minus, Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { FaqData } from "@/lib/data/faqs";
import { createClient } from "@/lib/supabase/client";

export function FaqClient({
  faqs,
  initialCount = 5,
  batchSize = 25,
  loadMoreLabel = "Load More Questions",
  showLoadMoreIcon = true,
  loadMoreVariant = "ghost",
  loadMoreSize,
  loadMoreClassName,
}: {
  faqs: FaqData[];
  initialCount?: number;
  batchSize?: number;
  loadMoreLabel?: string;
  showLoadMoreIcon?: boolean;
  loadMoreVariant?: React.ComponentProps<typeof Button>["variant"];
  loadMoreSize?: React.ComponentProps<typeof Button>["size"];
  loadMoreClassName?: string;
}) {
  const supabase = createClient();
  const [visibleCount, setVisibleCount] = React.useState(() =>
    Math.min(initialCount, faqs.length),
  );

  React.useEffect(() => {
    setVisibleCount(Math.min(initialCount, faqs.length));
  }, [faqs, initialCount]);

  const displayedFaqs = faqs.slice(0, visibleCount);
  const hasMore = visibleCount < faqs.length;

  const handleFaqOpen = async (value: string) => {
    // If value is empty, it means the user closed the accordion. Don't count it.
    if (!value) return;

    // 'value' corresponds to the faq.id because of how AccordionItem is set up
    const { error } = await supabase.rpc("increment_faq_click", {
      p_id: value,
    });

    if (error) console.error("Error counting view:", error);
  };

  return (
    <div className="w-full">
      <Accordion
        type="single"
        collapsible
        className="w-full space-y-4"
        onValueChange={handleFaqOpen}
      >
        {displayedFaqs.map((faq) => (
          <AccordionItem
            key={faq.id}
            value={faq.id}
            // SEPARATED CARD STYLE
            className="border border-border/50 bg-card rounded-xl px-2 shadow-sm
              transition-all duration-200 hover:border-primary/30
              data-[state=open]:border-primary/50 data-[state=open]:bg-primary/5
              data-[state=open]:shadow-md"
          >
            <AccordionTrigger
              className="px-4 py-5 hover:no-underline
                [&[data-state=open]>div>svg.plus]:hidden
                [&[data-state=open]>div>svg.minus]:block"
            >
              <div
                className="flex items-center justify-between w-full text-left
                  gap-4"
              >
                <span
                  className="text-base md:text-lg font-semibold text-foreground
                    leading-tight"
                >
                  {faq.question}
                </span>
                {/* Custom Icon switching for a polished look */}
                <div className="shrink-0 text-primary/70">
                  <Plus
                    className="h-5 w-5 plus transition-transform duration-200"
                  />
                  <Minus className="h-5 w-5 minus hidden" />
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent
              className="px-4 pb-6 pt-0 text-muted-foreground leading-relaxed
                text-[15px] md:text-base animate-in slide-in-from-top-2"
            >
              <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            variant={loadMoreVariant}
            size={loadMoreSize}
            onClick={() =>
              setVisibleCount((current) =>
                Math.min(current + batchSize, faqs.length),
              )
            }
            className={
              loadMoreClassName ??
              `flex items-center gap-2 font-bold text-primary
              hover:bg-primary/10 transition-colors`
            }
          >
            {loadMoreLabel}
            {showLoadMoreIcon && <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      )}
    </div>
  );
}
