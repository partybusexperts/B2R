import React from "react";
import CTA from "@/components/sections/CTA";
import { getCta } from "@/lib/server/settings";

export const revalidate = 600; // cache 10 minutes (set to 0 while tweaking)

export default async function CTAFromDbServer({
  vehicleHint,
  ctaKey = "cta_global",
}: {
  vehicleHint?: string;
  ctaKey?: string; // allows per-page overrides later, e.g. "cta_coach"
}) {
  const cta = await getCta(ctaKey);

  type Button = { label: string; href: string; style?: "primary" | "secondary" | "outline" };
  type CTAData = { slug?: string; title?: string; subtitle?: string; buttons?: Button[] };

  const data: CTAData = {
    slug: vehicleHint,
    title: cta.headline,
    subtitle: cta.subhead,
    buttons: [
      ...(cta.quote_href
        ? [
            {
              label: "Get a Quote",
              href: cta.quote_href,
              style: "primary" as const,
            },
          ]
        : []),
      ...(cta.email ? [{ label: "Email", href: `mailto:${cta.email}` }] : []),
      ...(cta.phone ? [{ label: "Call", href: `tel:${cta.phone}` }] : []),
    ],
  };

  return <CTA data={data} />;
}
