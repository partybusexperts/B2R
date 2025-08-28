"use client";
import React from 'react';
import OptimizedImage from './OptimizedImage';
import Image from 'next/image';
import { findByFileName, OptimizedImageEntry } from '../utils/optimizedImages';

type ImgLikeProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'>;
interface SmartImageProps extends ImgLikeProps {
  src: string;
  alt: string;
  className?: string;
  priorityIfAbove?: number;
  fillParent?: boolean;
  /** Optional responsive sizes hint; forwarded to next/image or img */
  sizes?: string;
}

// Attempts to map a legacy /images/... path to an optimized manifest entry by filename.
// Falls back to native <img> if not found.
export const SmartImage: React.FC<SmartImageProps> = ({ src, alt, className, priorityIfAbove, fillParent, sizes, ...rest }) => {
  if (!src) {
    console.warn('SmartImage: src is undefined or null', { alt, className });
    return <div className={className} style={{background:'#222',color:'#fff',padding:'2em',textAlign:'center'}}>Image unavailable</div>;
  }
  const file = src.split('/').pop() || src;
  let entry: OptimizedImageEntry | undefined;
  try {
    entry = findByFileName(file);
  } catch {
    entry = undefined;
  }
  if (entry) {
    return <OptimizedImage entry={entry} alt={alt} className={className} fillParent={fillParent} priorityIfAbove={priorityIfAbove} sizesOverride={sizes} />;
  }
  // External host? If matches remotePatterns, leverage next/image for DPR variants.
  try {
    const url = new URL(src);
    const host = url.hostname;
    const allowed = ['images.unsplash.com', 'i.scdn.co'];
    if (allowed.includes(host)) {
      // Without known intrinsic dims we let layout = responsive via fill in a wrapper or just set width/height heuristically.
      // Use a square-ish default to better suit playlist covers; allow caller overrides via rest (e.g., onError)
      return (
        <Image
          src={src}
          alt={alt}
          className={className}
          width={400 as number}
          height={400 as number}
          sizes={sizes || "(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"}
          {...rest}
        />
      );
    }
  } catch { /* ignore url parse errors */ }
  return <img src={src} alt={alt} className={className} sizes={sizes} {...rest} />;
};

export default SmartImage;
