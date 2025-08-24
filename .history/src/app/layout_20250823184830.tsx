// app/layout.tsx
import "../styles/b2r.css"; // if your layout is at app/layout.tsx
// (if your layout is at src/app/layout.tsx, use "../../styles/b2r.css")

import type { Metadata } from 'next';
import './globals.css';
import Navigation from '../components/Navigation';
import Footer from '../components/footer';

export const metadata: Metadata = {
  title: 'Bus2Ride | Party Bus, Limo & Coach Rentals',
  description: 'Luxury party bus, limo and coach rentals for any occasion.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0f2148] text-blue-50">
        <Navigation />
        {children}
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