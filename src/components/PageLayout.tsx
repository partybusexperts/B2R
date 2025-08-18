import React from "react";

interface PageLayoutProps {
  children: React.ReactNode;
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
  textColor?: string;
}

export default function PageLayout({
  children,
  gradientFrom = "from-blue-950",
  gradientVia = "via-blue-900",
  gradientTo = "to-black",
  textColor = "text-white",
}: PageLayoutProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientFrom} ${gradientVia} ${gradientTo} ${textColor}`}>
      {children}
    </div>
  );
}
