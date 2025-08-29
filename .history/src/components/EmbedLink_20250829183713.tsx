"use client";
import React, { useMemo, useState } from "react";

export default function EmbedLink({ id }: { id: string }) {
  const [copied, setCopied] = useState<"link" | "embed" | null>(null);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return `https://yourdomain.com/tools#${id}`;
    return `${window.location.origin}/tools#${id}`;
  }, [id]);

  const embedSrc = useMemo(() => {
    if (typeof window === "undefined") return `https://yourdomain.com/embed/${id}`;
    return `${window.location.origin}/embed/${id}`;
  }, [id]);

  const embedCode = `<iframe src="${embedSrc}" width="100%" height="560" frameborder="0" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;

  async function copy(text: string, kind: "link" | "embed") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1400);
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(kind);
        setTimeout(() => setCopied(null), 1400);
      } catch {
        // ignore
      }
    }
  }

  return (
    <div className="flex flex-col gap-1 text-xs">
      <button
        type="button"
        onClick={() => copy(shareUrl, "link")}
        className="w-full rounded border border-blue-500/30 bg-blue-950/40 px-2 py-1 hover:bg-blue-900/40"
        title="Copy link to this tool"
      >
        Copy Link
      </button>
      <button
        type="button"
        onClick={() => copy(embedCode, "embed")}
        className="w-full rounded border border-blue-500/30 bg-blue-950/40 px-2 py-1 hover:bg-blue-900/40"
        title="Copy iframe embed code"
      >
        Copy Embed
      </button>
      {copied && <div className="text-green-400 mt-1">{copied === "link" ? "Link copied!" : "Embed code copied!"}</div>}
    </div>
  );
}
