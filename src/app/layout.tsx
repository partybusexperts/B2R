// src/app/layout.tsx

import type { Metadata } from 'next';
import './globals.css';
import Navigation from '../components/Navigation';

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
      <body className="min-h-screen bg-white">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
