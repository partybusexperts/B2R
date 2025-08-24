// app/layout.tsx
import "../styles/b2r.css"; // global theme (scoped by .theme-b2r)
import "./globals.css";

import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Footer from "../components/footer";

export const metadata: Metadata = {
  title: "Bus2Ride | Party Bus, Limo & Coach Rentals",
  description: "Luxury party bus, limo and coach rentals for any occasion.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Apply the theme site-wide by putting .theme-b2r on <body> */}
      <body className="theme-b2r min-h-screen antialiased">
        <Navigation />
        <main>{children}</main>
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
