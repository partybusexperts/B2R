"use client";

import * as React from "react";
import { Check, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ShareArticleButton({ className }: { className?: string }) {
  const [copied, setCopied] = React.useState(false);
  const [copyFailed, setCopyFailed] = React.useState(false);

  const copyToClipboard = async () => {
    const url = window.location.href;

    try {
      // Clipboard API requires a secure context (https) and user gesture.
      if (!window.isSecureContext || !navigator.clipboard?.writeText) {
        throw new Error("Clipboard API unavailable");
      }

      await navigator.clipboard.writeText(url);
      setCopied(true);
      setCopyFailed(false);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback: we can't reliably auto-copy without the Clipboard API.
      // Use a prompt so the user can quickly copy.
      setCopyFailed(true);
      window.prompt("Copy this link:", url);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={copyToClipboard}
    >
      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      {copied ? "Link copied" : copyFailed ? "Copy link" : "Share Article"}
    </Button>
  );
}
