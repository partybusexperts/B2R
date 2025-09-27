"use client";
import React from "react";

type ButtonProps = {
  children?: React.ReactNode;
  className?: string;
  onClick?: (() => void) | (() => Promise<void>);
  variant?: string;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, className, onClick, variant, disabled, ...rest }: ButtonProps) {
  // Ensure native disabled is passed and arbitrary button props are supported
  return (
    <button type="button" className={className} onClick={onClick as any} data-variant={variant} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}

export default Button;
