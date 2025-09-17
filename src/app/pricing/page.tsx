import React from 'react';
import HeroHeader from '../../components/HeroHeader';
import PricingClient from './PricingClient';
import { getHeroInitialData } from '../../lib/getHero';

export default async function PricingPage() {
  // slug for this page’s hero row
  const pageSlug = 'pricing';

  // server-side fetch from heroes1
  const hero = await getHeroInitialData(pageSlug);

  return (
    <>
      <HeroHeader
        pageSlug={pageSlug}
        // your existing fallback still works if DB is empty
        fallback={{
          page_slug: pageSlug,
          title: 'Transparent Pricing',
          subtitle: 'No hidden fees. Real quotes in minutes.',
          gradient_from: 'from-blue-950',
          gradient_via: 'via-blue-900',
          gradient_to: 'to-black',
          text_color: 'text-white',
          wave_fill: '#122a56',
        }}
        initialData={hero} // <- this makes your HeroHeader skip client fetch
      />

      {/* the rest of your pricing page */}
      <PricingClient />
    </>
  );
}