"use client";
import React from "react";

type DialogProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  className?: string;
};

// Simple context so DialogClose can close the dialog without requiring Radix.
const DialogContext = React.createContext<{ onOpenChange?: (o: boolean) => void }>({});

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  // keep parent in sync
  React.useEffect(() => {
    if (onOpenChange) onOpenChange(open);
  }, [open, onOpenChange]);

  return <DialogContext.Provider value={{ onOpenChange }}>{children}</DialogContext.Provider>;
}

export function DialogContent({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function DialogHeader({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function DialogTitle({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <h2 className={className}>{children}</h2>;
}

export function DialogDescription({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <p className={className}>{children}</p>;
}

// DialogClose will call the context onOpenChange(false). Supports asChild pattern.
export function DialogClose({ asChild, children }: { asChild?: boolean; children?: React.ReactNode }) {
  const ctx = React.useContext(DialogContext);

  const handleClose = (e?: React.MouseEvent) => {
    if (ctx.onOpenChange) ctx.onOpenChange(false);
    if (e) e.stopPropagation();
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement;
    const childOnClick = ((child.props as unknown) as { onClick?: (e: React.MouseEvent) => void }).onClick;
    return (
      <span
        onClick={(ev) => {
          if (typeof childOnClick === "function") childOnClick(ev as unknown as React.MouseEvent);
          handleClose(ev as unknown as React.MouseEvent);
        }}
      >
        {child}
      </span>
    );
  }

  return (
    <button type="button" onClick={handleClose} aria-label="Close">
      {children}
    </button>
  );
}

export default Dialog;
