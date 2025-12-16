import { getFaqs } from "@/lib/data/faqs";
import { FaqSearchClient } from "@/components/sections/faq-search.client";

interface FaqSearchSectionProps {
  category?: string;
  title?: string;
  aboveTitle?: string;
  description?: string;
  initialCount?: number;
  inputPlaceholder?: string;
  searchMode?: "client" | "server" | "hybrid";
}

export async function FaqSearchSection({
  category,
  title,
  aboveTitle,
  description,
  inputPlaceholder,
  initialCount,
  searchMode,
}: FaqSearchSectionProps) {
  const faqs = await getFaqs(category);

  if (!faqs || faqs.length === 0) return null;

  return (
    <FaqSearchClient
      category={category}
      faqs={faqs}
      title={title}
      aboveTitle={aboveTitle}
      description={description}
      inputPlaceholder={inputPlaceholder}
      initialCount={initialCount}
      searchMode={searchMode}
    />
  );
}
