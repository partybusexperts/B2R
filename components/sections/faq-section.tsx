import { FaqClient } from "./faq-client";
import { Button } from "@/components/ui/button";
import { getFaqs } from "@/lib/data/faqs";
import Link from "next/link";

interface FaqSectionProps {
  category: string;
  title?: string;
}

export async function FaqSection({
  category,
  title = "Frequently Asked Questions",
}: FaqSectionProps) {
  const faqs = await getFaqs(category);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-20 md:py-24 bg-card border-b border-border/40">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2
            className="text-3xl md:text-4xl font-extrabold tracking-tight
              text-foreground"
          >
            {title}
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about booking, pricing, and our
            vehicles.
          </p>
        </div>

        {/* FAQ List - No outer card, just the list */}
        <div className="max-w-3xl mx-auto">
          <FaqClient faqs={faqs} />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-sm mb-3">
            Still have questions?
          </p>
          <Button
            variant="outline"
            asChild
            className="rounded-xl font-bold border-primary/20 hover:bg-primary/5
              hover:text-primary"
          >
            <Link href="/faq">Visit our Help Center</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
