import React from 'react';
import HeroHeaderServer from '../../components/HeroHeaderServer';
import GlobalReviewStripServer from '../../components/reviews/GlobalReviewStripServer';
import ToolsSection from '@/components/home/ToolsSection';
import PricingPollSection from '@/components/pricing/PricingPollSection';
import PricingFaqSection from '@/components/pricing/PricingFaqSection';
import { getHeroFallback } from '@/data/heroFallbacks';

export default function PricingPage() {
  return (
    <main className="bg-[#050f25] text-white">
      <HeroHeaderServer pageSlug="pricing" fallback={getHeroFallback("pricing")} />
      <PricingFaqSection />
      <PricingPollSection />
      <GlobalReviewStripServer />
      <ToolsSection />
    </main>
  );
}