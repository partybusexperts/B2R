// app/layout.tsx
import "../styles/b2r.css"; // global theme (scoped by .theme-b2r)
import "./globals.css";
import React from 'react';
import { loadThemeVars } from '@/lib/theme';

import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Footer from "../components/footer";
import StructuredData from "../components/StructuredData";
// Client component (has 'use client' internally) can be imported directly
import ScrollUtilities from '../components/ScrollUtilities';

export const metadata: Metadata = {
  title: "Bus2Ride | Party Bus, Limo & Coach Rentals",
  description: "Luxury party bus, limo and coach rentals for any occasion.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // load theme tokens from Supabase and inject as CSS variables
  let cssVars = '';
  try {
    const vars = await loadThemeVars('light');
    cssVars = `:root{${Object.entries(vars).map(([k,v]) => `${k}:${v}`).join(';')}}`;
  } catch (e) {
    // fail softly if Supabase credentials missing
    cssVars = '';
  }

  return (
    <html lang="en">
      {/* Apply the theme site-wide by putting .theme-b2r on <body> */}
      <body className="theme-b2r min-h-screen antialiased">
        {/* Inject CSS variables loaded from Supabase */}
        {cssVars && <style dangerouslySetInnerHTML={{ __html: cssVars }} />}
        <StructuredData
          id="org-jsonld"
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Bus2Ride",
            url: "https://www.bus2ride.com",
            logo: "https://www.bus2ride.com/images/logo.png",
            sameAs: [
              "https://www.facebook.com/yourpage",
              "https://www.instagram.com/yourhandle",
              "https://www.tiktok.com/@yourhandle",
              "https://www.youtube.com/@yourchannel"
            ],
            contactPoint: [{
              "@type": "ContactPoint",
              telephone: "+1-888-535-2566",
              contactType: "customer service",
              areaServed: "US"
            }]
          }}
        />
        <StructuredData
          id="website-jsonld"
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Bus2Ride",
            url: "https://www.bus2ride.com",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://www.bus2ride.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }}
        />
        <Navigation />
        <main>{children}</main>
  <ScrollUtilities />
        <Footer
          phoneDisplay="(888) 535-2566"
          phoneTel="8885352566"
          email="info@bus2ride.com"
          socials={{
            facebook: "https://www.facebook.com/yourpage",
            instagram: "https://www.instagram.com/yourhandle",
            tiktok: "https://www.tiktok.com/@yourhandle",
            youtube: "https://www.youtube.com/@yourchannel",
          }}
        />
      </body>
    </html>
  );
}
