import React from 'react';
import HeroHeaderServer from '../../components/HeroHeaderServer';
import PricingClient from './PricingClient';
import { getHeroFallback } from '../../data/heroFallbacks';

export default function PricingPage() {
  return (
    <>
      <HeroHeaderServer pageSlug="pricing" fallback={getHeroFallback("pricing")} />
      <PricingClient />
    </>
  );
}