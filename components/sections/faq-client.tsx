"use client";

import * as React from "react";
import { ChevronDown, Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { FaqData } from "@/lib/data/faqs";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

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
            className="group rounded-2xl border border-white/10 bg-white/5
              backdrop-blur-sm transition-shadow hover:shadow-lg"
          >
            <AccordionTrigger className="px-4 py-5 hover:no-underline">
              <div
                className="flex items-center justify-between w-full text-left
                  gap-4"
              >
                <span
                  className="text-base md:text-lg font-semibold text-white
                    leading-tight"
                >
                  {faq.question}
                </span>
                {/* Plus rotates when open */}
                <div className="text-sm text-white/70 shrink-0">
                  <Plus
                    className="h-5 w-5 transition-transform duration-200
                      group-data-[state=open]:rotate-45"
                  />
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent
              className="px-4 pb-6 pt-0 leading-relaxed md:text-base animate-in
                slide-in-from-top-2 text-base text-white/80"
            >
              <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        {hasMore ? (
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
              `rounded-2xl border border-white/15 bg-white/10 px-6 py-3 text-sm
                font-semibold text-white transition hover:bg-white/15
                hover:text-white h-auto`
            }
          >
            {loadMoreLabel}
            {showLoadMoreIcon && <ChevronDown className="h-4 w-4" />}
          </Button>
        ) : (
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
              `rounded-2xl border border-white/15 bg-white/10 px-6 py-3 text-sm
                font-semibold text-white transition hover:bg-white/15
                hover:text-white h-auto`
            }
            asChild
          >
            <Link href="/faqs">View all FAQs</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
