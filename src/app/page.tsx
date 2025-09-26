// app/page.tsx
import React from "react";
import HeroHeaderServer from "@/components/HeroHeaderServer";

export default function Home() {
  return (
    <main>
      <HeroHeaderServer
        pageSlug="home"
        fallback={{
          page_slug: "home",
          title: "Bus2Ride — Group transport made easy",
          subtitle: "Instant quotes, transparent pricing, and clean vehicles for every event.",
          primary_cta:  { label: "Get Instant Quote", href: "/quote" },
          secondary_cta:{ label: "View Fleet",       href: "/fleet" },
          tertiary_cta: { label: "Contact Us",       href: "/contact" },
          gradient_from:"from-sky-400",
          gradient_via: "via-blue-600",
          gradient_to:  "to-indigo-900",
          text_color:   "text-white",
          wave_fill:    "#122a56",

          // TEMP: verify slideshow immediately
          images: [
            "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/24%20Passenger%20Party%20Bus/24%20Passenger%20Party%20Bus%20Interior%20Lux.png",
            "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/24%20Passenger%20Shuttle%20Bus/24%20Passenger%20Shuttle%20Bus%20Interior%20Lux.png",
            "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/45%20Passenger%20Party%20Bus/45%20Passenger%20Party%20Bus%20Interior%20Lux.png",
            "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/32%20Passenger%20Party%20Bus/32%20Passenger%20Party%20Bus%20Interior%20Lux.png"
          ],
          autoplay_ms: 6000,
          darken: 0.35,
        }}
      />

      {/* Your other sections go here */}
    </main>
  );
}
