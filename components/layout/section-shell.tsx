import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type BackgroundVariant = "deep-navy" | "midnight" | "charcoal" | "gradient" | "mesh" | "transparent";

interface SectionShellProps {
  children: ReactNode;
  className?: string;
  background?: BackgroundVariant;
  withGlow?: boolean;
  withMesh?: boolean;
  id?: string;
}

const backgroundClasses: Record<BackgroundVariant, string> = {
  "deep-navy": "bg-[#0a1628]",
  midnight: "bg-[#0d1d3a]",
  charcoal: "bg-[#111827]",
  gradient: "bg-gradient-to-b from-[#0f172a] via-[#0d1d3a] to-[#0a1628]",
  mesh: "bg-[#0a1628] bg-mesh",
  transparent: "bg-transparent",
};

export function SectionShell({
  children,
  className,
  background = "deep-navy",
  withGlow = false,
  withMesh = false,
  id,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-16 md:py-24 overflow-hidden",
        backgroundClasses[background],
        withMesh && "bg-mesh",
        withGlow && "section-glow",
        className
      )}
    >
      {children}
    </section>
  );
}

export function SectionHeader({
  title,
  subtitle,
  aboveTitle,
  centered = true,
  className,
}: {
  title: string;
  subtitle?: string;
  aboveTitle?: string;
  centered?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("mb-12", centered && "text-center max-w-3xl mx-auto", className)}>
      {aboveTitle && (
        <p className="text-sm uppercase tracking-[0.2em] text-blue-400 mb-2 font-medium">
          {aboveTitle}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-serif tracking-tight text-glow-white">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-gray-300/90 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
