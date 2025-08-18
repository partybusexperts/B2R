import React from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  bgFrom?: string;
  bgTo?: string;
  id?: string;
}

export default function Section({
  children,
  className = "",
  bgFrom = "from-blue-900/90",
  bgTo = "to-black",
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`relative py-16 px-4 ${className} bg-gradient-to-b ${bgFrom} ${bgTo}`.trim()}
    >
      {children}
    </section>
  );
}
