"use client";
import React from 'react';
import Image, { ImageProps } from 'next/image';
import { OptimizedImageEntry, bestSrc } from '@/utils/optimizedImages';

export interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt' | 'placeholder' | 'blurDataURL' | 'width' | 'height'> {
  entry: OptimizedImageEntry;
  alt?: string; // allow override
  // If layout is constrained by parent, allow fill
  fillParent?: boolean;
  priorityIfAbove?: number; // viewport Y threshold to auto set priority
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({ entry, alt, className, fillParent = false, priorityIfAbove, ...rest }) => {
  const src = bestSrc(entry);
  const usePriority = typeof window !== 'undefined' && typeof priorityIfAbove === 'number'
    ? (document?.documentElement?.scrollTop || 0) < priorityIfAbove
    : undefined;
  if (fillParent) {
    return (
      <Image
        src={src}
        alt={alt || entry.alt}
        className={className}
        placeholder="blur"
        blurDataURL={entry.blurDataURL}
        fill
        sizes="100vw"
        priority={usePriority}
        {...rest}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt || entry.alt}
      className={className}
      placeholder="blur"
      blurDataURL={entry.blurDataURL}
      width={entry.width}
      height={entry.height}
      priority={usePriority}
      {...rest}
    />
  );
};

export default OptimizedImage;