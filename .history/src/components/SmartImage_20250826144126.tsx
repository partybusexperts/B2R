"use client";
import React from 'react';
import OptimizedImage from './OptimizedImage';
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
  return <img src={src} alt={alt} className={className} />;
};

export default SmartImage;
