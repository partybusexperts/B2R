// src/app/layout.js
import './globals.css';

export const metadata = { title: 'B2R' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
