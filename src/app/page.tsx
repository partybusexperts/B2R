// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-white antialiased">
        {children}
      </body>
    </html>
  );
}
