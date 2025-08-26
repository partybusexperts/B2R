import React from 'react';

interface StructuredDataProps<T = any> {
  data: T;
  // Optionally label multiple scripts
  id?: string;
}

/**
 * Renders JSON-LD structured data. Keep props minimal to avoid hydration mismatch.
 */
export function StructuredData({ data, id }: StructuredDataProps) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      {...(id ? { id } : {})}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default StructuredData;