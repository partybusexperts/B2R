"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface ClickableCardProps {
  slug: string;
  ariaLabel?: string;
  className?: string;
  children: React.ReactNode;
}

export default function ClickableCard({ slug, ariaLabel, className, children }: ClickableCardProps) {
  const router = useRouter();

  const handleActivate = () => {
    // use next/router push to keep SPA navigation
    router.push(`/events/${slug}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleActivate();
    }
  };

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={handleActivate}
      onKeyDown={onKeyDown}
      className={className}
    >
      {children}
    </div>
  );
}
