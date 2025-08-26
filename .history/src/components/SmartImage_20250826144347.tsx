"use client";
import React from 'react';
import OptimizedImage from './OptimizedImage';
import Image from 'next/image';
import { findByFileName, OptimizedImageEntry } from '../utils/optimizedImages';

interface SmartImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  className?: string;
  priorityIfAbove?: number;
  fillParent?: boolean;
}

// Attempts to map a legacy /images/... path to an optimized manifest entry by filename.
// Falls back to native <img> if not found.
export const SmartImage: React.FC<SmartImageProps> = ({ src, alt, className, priorityIfAbove, fillParent }) => {
  const file = src.split('/').pop() || src;
  let entry: OptimizedImageEntry | undefined;
  try {
    entry = findByFileName(file);
  } catch {
    entry = undefined;
  }
  if (entry) {
    return <OptimizedImage entry={entry} alt={alt} className={className} fillParent={fillParent} priorityIfAbove={priorityIfAbove} />;
  }
  // External host? If matches remotePatterns, leverage next/image for DPR variants.
  try {
    const url = new URL(src);
    const host = url.hostname;
    const allowed = ['images.unsplash.com', 'i.scdn.co'];
    if (allowed.includes(host)) {
      // Without known intrinsic dims we let layout = responsive via fill in a wrapper or just set width/height heuristically.
      return (
        <Image
          src={src}
          alt={alt}
          className={className}
          width={1200}
          height={800}
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
        />
      );
    }
  } catch {}
  return <img src={src} alt={alt} className={className} />;
};

export default SmartImage;
