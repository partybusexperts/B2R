import React from 'react';
import HeroWithImage from './types/HeroWithImage';

export function renderBlock(b: { slug: string; type: string; variant?: string; props: any }) {
  if (b.type === 'hero' && (b.variant === 'with-image' || !b.variant)) {
    return <HeroWithImage key={b.slug} {...b.props} />;
  }
  return <div key={b.slug}>Missing block: {b.type}:{b.variant}</div>;
}
