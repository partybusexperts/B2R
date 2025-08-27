"use client";
import React, { useEffect, useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { OptimizedImageEntry, bestSrc, srcSet, ensureMinWidthEntry } from '../utils/optimizedImages';

export interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt' | 'placeholder' | 'blurDataURL' | 'width' | 'height'> {
  entry: OptimizedImageEntry;
  alt?: string; // allow override
  // If layout is constrained by parent, allow fill
  fillParent?: boolean;
  priorityIfAbove?: number; // viewport Y threshold to auto set priority
  sizesOverride?: string; // optional custom sizes string
  minDesiredWidth?: number; // guard: auto swap to larger entry within same category
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({ entry, alt, className, fillParent = false, priorityIfAbove, sizesOverride, minDesiredWidth = 0, ...rest }) => {
  // Ensure minimum width variant if requested
  if (minDesiredWidth > 0) entry = ensureMinWidthEntry(entry, minDesiredWidth);

  const src = bestSrc(entry);
  const { sizes } = srcSet(entry);

  // Defer priority calculation to client to avoid SSR/client attribute mismatch on loading
  const [isPriority, setIsPriority] = useState(false);
  useEffect(() => {
    if (typeof priorityIfAbove === 'number') {
      const scrollTop = window.document?.documentElement?.scrollTop || window.scrollY || 0;
      if (scrollTop < priorityIfAbove) setIsPriority(true);
    }
  }, [priorityIfAbove]);

  const commonProps = {
    src,
    alt: alt || entry.alt,
    className,
    placeholder: 'blur' as const,
    blurDataURL: entry.blurDataURL,
    priority: isPriority,
    ...rest,
  };

  if (fillParent) {
    return (
      <Image
        {...commonProps}
        fill
        sizes={sizesOverride || '100vw'}
      />
    );
  }

  return (
    <Image
      {...commonProps}
      width={entry.width}
      height={entry.height}
      sizes={sizesOverride || sizes}
    />
  );
};

export default OptimizedImage;