// src/app/layout.js
import './globals.css';

export const metadata = { title: 'B2R' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-xl font-bold text-indigo-700">B2R</span>
            </div>
            <nav className="space-x-4">
              <a href="#" className="text-gray-600 hover:text-indigo-600 transition">Home</a>
              <a href="#" className="text-gray-600 hover:text-indigo-600 transition">Tools</a>
              <a href="#" className="text-gray-600 hover:text-indigo-600 transition">Contact</a>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-100">
          <div className="container mx-auto px-4 py-4 text-center text-gray-600">
            © {new Date().getFullYear()} B2R. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
