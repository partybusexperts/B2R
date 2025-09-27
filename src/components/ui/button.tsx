"use client";
import React from "react";

export function Button({ children, className, onClick, variant }: { children?: React.ReactNode; className?: string; onClick?: () => void; variant?: string }) {
  return (
    <button type="button" className={className} onClick={onClick} data-variant={variant}>
      {children}
    </button>
  );
}

export default Button;
