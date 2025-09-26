// app/page.tsx
import CTA from "@/components/sections/CTA";
import HeroHeaderServer from "@/components/HeroHeaderServer";
import { getSections } from "@/lib/server/pages";

export default async function Home() {
  // Load all active sections for the home page from Supabase
  const sections = await getSections("home");

  return (
    <main>
      {/* HERO (kept exactly as you have it, just lowered darken to 0.15 for brightness) */}
      <HeroHeaderServer
        pageSlug="home"
        fallback={{
          page_slug: "home",
          title: "Bus2Ride — Group transport made easy",
          subtitle:
            "Instant quotes, transparent pricing, and clean vehicles for every event.",
          primary_cta: { label: "Get Instant Quote", href: "/quote" },
          secondary_cta: { label: "View Fleet", href: "/fleet" },
          tertiary_cta: { label: "Contact Us", href: "/contact" },
          gradient_from: "from-sky-400",
          gradient_via: "via-blue-600",
          gradient_to: "to-indigo-900",
          text_color: "text-white",
          wave_fill: "#122a56",

          images: [
            "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/24%20Passenger%20Party%20Bus/24%20Passenger%20Party%20Bus%20Interior%20Lux.png",
            "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/24%20Passenger%20Shuttle%20Bus/24%20Passenger%20Shuttle%20Bus%20Interior%20Lux.png",
            "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/45%20Passenger%20Party%20Bus/45%20Passenger%20Party%20Bus%20Interior%20Lux.png",
            "https://scnmubytflrxvokmrfnc.supabase.co/storage/v1/object/public/vehicles1/32%20Passenger%20Party%20Bus/32%20Passenger%20Party%20Bus%20Interior%20Lux.png",
          ],
          autoplay_ms: 6000,
          darken: 0.15, // brighter default
        }}
      />

      {/* Render sections from Supabase by kind */}
      {sections.map((s, i) => {
        switch (s.kind) {
          case "cta":
            return <CTA key={i} data={s.data} />;

          // When you add more kinds, just uncomment/add:
          // case "features":     return <Features key={i} data={s.data} />;
          // case "testimonials": return <Testimonials key={i} data={s.data} />;
          // case "faq":          return <FAQ key={i} data={s.data} />;

          default:
            return null;
        }
      })}
    </main>
  );
}
