// src/app/layout.js
import './globals.css';

export const metadata = { title: 'B2R' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm">
          <div className="container flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <img src="/globe.svg" alt="B2R Logo" className="h-8 w-8" />
              <span className="text-xl font-bold tracking-tight text-indigo-700">B2R</span>
            </div>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
              <a href="#" className="hover:text-indigo-600 transition">Home</a>
              <a href="#" className="hover:text-indigo-600 transition">Estimate</a>
              <a href="#" className="hover:text-indigo-600 transition">Contact</a>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-indigo-50 to-white py-12 border-b border-gray-100">
            <div className="container text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-4">Prom Party Bus Rentals in Chester, SC</h1>
              <p className="text-lg md:text-xl text-gray-700 mb-6">Modern, safe, and unforgettable rides for your big night. Get a quick quote or plan your event below!</p>
              <a href="#" className="btn text-base px-8 py-3">Get Started</a>
            </div>
          </section>
          <div className="container flex-1 py-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-6 mt-8">
          <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <span>&copy; {new Date().getFullYear()} B2R. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
              <a href="#" className="hover:text-indigo-600">Terms</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
